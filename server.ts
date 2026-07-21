import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: '.env.local' });
dotenv.config();

// Enable Sentry only when SENTRY_DSN is set (absent = silently disabled, no impact).
const sentryEnabled = Boolean(process.env.SENTRY_DSN);
if (sentryEnabled) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: 0, // errors only, no performance traces
  });
  console.log('[Sentry] backend error monitoring enabled');

  process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
    Sentry.captureException(reason);
  });
  process.on('uncaughtException', (error) => {
    console.error('[uncaughtException]', error);
    Sentry.captureException(error);
  });
}

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

// Trust the hosting proxy (Vercel/Render) so rate-limit sees the real client IP.
app.set('trust proxy', 1);

// Security headers. CSP is disabled here because the SPA/Vite dev server and
// external image/API hosts would otherwise be blocked; the host adds HSTS.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json({ limit: '32kb' }));

// Abuse protection on the public API endpoint (per-IP).
const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many appointment requests. Please try again later.' },
});

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

// Verify a Cloudflare Turnstile token. Returns true when the CAPTCHA is not
// configured (secret key absent) so local/dev environments keep working.
const verifyTurnstile = async (token: string, remoteIp?: string): Promise<boolean> => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.append('remoteip', remoteIp);

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const outcome = (await verifyRes.json()) as { success?: boolean };
    return outcome.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
};

const appointmentRecipient = process.env.APPOINTMENT_TO_EMAIL || 'weerapan.aia@hotmail.com';
const appointmentFromEmail = process.env.APPOINTMENT_FROM_EMAIL || 'Ultimate Life Advisor <onboarding@resend.dev>';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const subjectLabels: Record<string, { th: string; en: string }> = {
  insurance: { th: 'ประกันชีวิต สุขภาพ โรคร้ายแรง', en: 'Life, Health & Critical Illness Insurance' },
  retirement: { th: 'การออมและวางแผนเพื่อการเกษียณ', en: 'Retirement Wealth Planning' },
  education: { th: 'ทุนการศึกษาบุตรหลานระยะยาว', en: "Children's Education Fund" },
  investment: { th: 'การวางพอร์ตและลงทุนส่วนบุคคล', en: 'Personal Investment Portfolio' },
};

app.post('/api/appointment', appointmentLimiter, async (req, res) => {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return res.status(503).json({
        error: 'Email service is not configured. Please set RESEND_API_KEY on the server.'
      });
    }

    const name = String(req.body?.name || '').trim().slice(0, 120);
    const email = String(req.body?.email || '').trim().slice(0, 254);
    const subject = String(req.body?.subject || '').trim().slice(0, 120);
    const preferredDate = String(req.body?.preferredDate || '').trim().slice(0, 60);
    const notes = String(req.body?.notes || '').trim().slice(0, 2000);
    const consent = req.body?.consent === true;
    const lang = req.body?.lang === 'EN' ? 'EN' : 'TH';

    if (!name || !email || !preferredDate) {
      return res.status(400).json({ error: 'Name, email, and preferred date are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: lang === 'TH' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Please enter a valid email address.'
      });
    }

    // PDPA: require explicit consent before processing personal data.
    if (!consent) {
      return res.status(400).json({
        error: lang === 'TH'
          ? 'กรุณายอมรับนโยบายความเป็นส่วนตัวเพื่อดำเนินการต่อ'
          : 'Consent to the Privacy Policy is required to continue.'
      });
    }

    // Anti-bot: verify the Turnstile CAPTCHA (no-op if not configured).
    const captchaToken = String(req.body?.captchaToken || '');
    const captchaOk = await verifyTurnstile(captchaToken, req.ip);
    if (!captchaOk) {
      return res.status(400).json({
        error: lang === 'TH'
          ? 'การยืนยันตัวตนไม่สำเร็จ กรุณาลองยืนยันว่าคุณไม่ใช่บอทอีกครั้ง'
          : 'Anti-bot verification failed. Please try the verification again.'
      });
    }

    const mandate = subjectLabels[subject] ?? { th: subject || '-', en: subject || '-' };
    const mandateText = lang === 'TH' ? mandate.th : mandate.en;
    const submittedAt = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMandate = escapeHtml(mandateText);
    const safePreferredDate = escapeHtml(preferredDate);
    const safeNotes = escapeHtml(notes || '-');

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin: 0 0 16px; color: #111827;">New advisory appointment request</h2>
        <p style="margin: 0 0 20px;">A visitor submitted an appointment request from Ultimate Life Advisor.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <tr><td style="padding: 8px 0; font-weight: 700;">Name</td><td style="padding: 8px 0;">${safeName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Email</td><td style="padding: 8px 0;">${safeEmail}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Advisory mandate</td><td style="padding: 8px 0;">${safeMandate}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Preferred date</td><td style="padding: 8px 0;">${safePreferredDate}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Notes</td><td style="padding: 8px 0;">${safeNotes}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">PDPA consent</td><td style="padding: 8px 0;">Accepted (Privacy Policy)</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Submitted at</td><td style="padding: 8px 0;">${escapeHtml(submittedAt)}</td></tr>
        </table>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: appointmentFromEmail,
        to: [appointmentRecipient],
        reply_to: email,
        subject: `Appointment request: ${name}`,
        html
      })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Appointment email error:', response.status, payload);
      return res.status(502).json({
        error: lang === 'TH'
          ? 'ไม่สามารถส่งคำขอนัดหมายได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง'
          : 'Unable to submit your request right now. Please try again.'
      });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error('Appointment API error:', error);
    if (sentryEnabled) Sentry.captureException(error);
    return res.status(500).json({ error: 'Appointment service is temporarily unavailable.' });
  }
});

// Lead จาก "เกมเศรษฐี" (#/game) — ผู้เล่นกรอกสมัครใจตอนจบเกม ส่งเป็นอีเมลเช่นเดียวกับนัดหมาย
const gameLeadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

app.post('/api/game-lead', gameLeadLimiter, async (req, res) => {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return res.status(503).json({ error: 'Email service is not configured.' });
    }

    const name = String(req.body?.name || '').trim().slice(0, 100);
    const contact = String(req.body?.contact || '').trim().slice(0, 100);
    const career = String(req.body?.career || '-').trim().slice(0, 50);
    const grade = String(req.body?.grade || '-').trim().slice(0, 2);
    const score = Number.isFinite(Number(req.body?.score)) ? Math.round(Number(req.body.score)) : null;
    const fundedAge = Number.isFinite(Number(req.body?.fundedAge)) ? Math.round(Number(req.body.fundedAge)) : null;
    const gameNetWorth = Number.isFinite(Number(req.body?.netWorth)) ? Math.round(Number(req.body.netWorth)) : null;
    const consent = req.body?.consent === true;

    if (!name || !contact) {
      return res.status(400).json({ error: 'กรุณากรอกชื่อและช่องทางติดต่อ' });
    }

    // PDPA: require explicit consent before processing personal data.
    if (!consent) {
      return res.status(400).json({ error: 'กรุณายอมรับนโยบายความเป็นส่วนตัวเพื่อดำเนินการต่อ' });
    }

    // Anti-bot: same Turnstile check as the appointment form (no-op if not configured).
    const captchaToken = String(req.body?.captchaToken || '');
    const captchaOk = await verifyTurnstile(captchaToken, req.ip);
    if (!captchaOk) {
      return res.status(400).json({ error: 'การยืนยันตัวตนไม่สำเร็จ กรุณาลองอีกครั้ง' });
    }

    const submittedAt = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin: 0 0 16px; color: #111827;">🎲 Lead ใหม่จากเกมเศรษฐี</h2>
        <p style="margin: 0 0 20px;">ผู้เล่นเกมจำลองชีวิตการเงินขอรับคำปรึกษาฟรี</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <tr><td style="padding: 8px 0; font-weight: 700;">ชื่อ</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">ติดต่อ</td><td style="padding: 8px 0;">${escapeHtml(contact)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">อาชีพในเกม</td><td style="padding: 8px 0;">${escapeHtml(career)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">ผลเกม</td><td style="padding: 8px 0;">เกรด ${escapeHtml(grade)} (${score ?? '-'}/100) · เงินพอใช้ถึงอายุ ${fundedAge === null ? '-' : fundedAge >= 100 ? '100+' : fundedAge} · ความมั่งคั่ง ${gameNetWorth === null ? '-' : gameNetWorth.toLocaleString('th-TH')} บาท</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">PDPA consent</td><td style="padding: 8px 0;">Accepted (Privacy Policy)</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">เวลาส่ง</td><td style="padding: 8px 0;">${escapeHtml(submittedAt)}</td></tr>
        </table>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: appointmentFromEmail,
        to: [appointmentRecipient],
        subject: `🎲 Game lead: ${name} (เกรด ${grade})`,
        html
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.error('Game lead email error:', response.status, payload);
      return res.status(502).json({ error: 'ไม่สามารถส่งข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง' });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error('Game lead API error:', error);
    if (sentryEnabled) Sentry.captureException(error);
    return res.status(500).json({ error: 'Service is temporarily unavailable.' });
  }
});

if (isProduction) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Ultimate Life Advisor running at http://127.0.0.1:${port}`);
});
