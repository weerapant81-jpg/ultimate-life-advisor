# Deploy — Ultimate Life Advisor (Render)

Single Node/Express Web Service. `server.ts` builds to `dist/` and serves both the
site and the `/api/appointment` endpoint from one process.

## 1. Get the code into a Git repo

Render deploys from GitHub/GitLab. Push this folder to a new repo:

```bash
cd "E:/Ultimate Web/ultimate-life-advisor"
git init            # if not already a repo
git add .
git commit -m "Ultimate Life Advisor"
# create an empty repo on GitHub, then:
git remote add origin https://github.com/<you>/ultimate-life-advisor.git
git push -u origin main
```

`.env.local` is gitignored — secrets never go in the repo. They are set in the Render dashboard (step 3).

## 2. Create the service

- Render Dashboard → **New → Blueprint** → pick the repo. Render reads `render.yaml`.
- (Or **New → Web Service** manually with:)
  - Build command: `npm install --include=dev && npm run build`
  - Start command: `npm start`
  - Region: Singapore

> Why `--include=dev`: `tsx`, `vite`, `tailwindcss`, `typescript` are in devDependencies.
> With `NODE_ENV=production` set, a plain `npm install` skips them and the build fails.

## 3. Set environment variables (Render dashboard → Environment)

| Key | Type | Notes |
|-----|------|-------|
| `NODE_ENV` | `production` | already in render.yaml |
| `VITE_TURNSTILE_SITE_KEY` | secret | Cloudflare Turnstile **Site** key — baked in at BUILD time |
| `TURNSTILE_SECRET_KEY` | secret | Cloudflare Turnstile **Secret** key |
| `RESEND_API_KEY` | secret | **new** Resend key (old one was deleted) |
| `APPOINTMENT_TO_EMAIL` | value | where appointment requests are sent |
| `APPOINTMENT_FROM_EMAIL` | value | verified Resend sender |
| `VITE_SENTRY_DSN` | secret | optional — frontend errors (blank = off) |
| `SENTRY_DSN` | secret | optional — backend errors (blank = off) |

⚠️ **`VITE_*` vars are read at build time.** After changing them you must trigger a
**redeploy/rebuild** — a runtime restart alone won't pick them up.

## 4. First deploy → you get a free URL

Render gives `https://ultimate-life-advisor.onrender.com` (HTTPS automatic).

- Add that hostname to your Cloudflare **Turnstile** widget (Hostnames list).
- When you later buy a real domain: Render → Settings → **Custom Domains**, add it,
  point DNS as instructed, then add the domain to the Turnstile widget too.

## 5. Post-deploy smoke test

- Open the URL — site loads over HTTPS.
- Go to **ติดต่อ/นัดหมาย**, fill the form, complete the Turnstile check, submit →
  the advisor inbox (`APPOINTMENT_TO_EMAIL`) receives the email.
- Submitting without the CAPTCHA / without consent should be rejected.

## Still to do before going fully live (outside this repo)

- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Turn on 2FA for the admin Firebase account
- [ ] Create the real Cloudflare Turnstile keys and set them in Render
- [ ] Create the new Resend key and set it in Render

## Notes

- **Free plan** spins down after ~15 min idle → first request has a ~50s cold start.
  Upgrade to **Starter** ($7/mo) for always-on if that matters for demos/clients.
- Rate limiting (in-memory) works here because it's one persistent process — this is
  why we host on Render rather than a serverless platform.
