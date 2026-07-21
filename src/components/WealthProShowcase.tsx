import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab } from '../types';

const SAMPLE_PLAN_PDF = '/wealthpro-sample-plan.pdf';

/* ── เซกชันโชว์แอป WealthPro (การ์ด mockup iPad) ──
   Carousel ปัดซ้าย-ขวาดูทีละรูป (touch + ปุ่มลูกศร + จุดบอกตำแหน่ง)
   ใช้ร่วมกันทั้งหน้าแรกและหน้า "บริการ" */

interface WealthProShowcaseProps {
  lang: 'EN' | 'TH';
  setActiveTab: (tab: ActiveTab) => void;
}

const CARDS = [
  {
    img: '/images/wealthpro-dashboard.png',
    altEn: 'WealthPro client dashboard',
    titleTh: 'แดชบอร์ดสุขภาพการเงิน',
    titleEn: 'Financial Health Dashboard',
    descTh: 'สถานะการเงินทุกมิติในหน้าเดียว — สภาพคล่อง ภาระหนี้ ความคุ้มครอง เกษียณ ทุนการศึกษา และมรดก พร้อมคะแนนสุขภาพการเงินและแผนดำเนินการของคุณ',
    descEn: 'Your entire financial position on one screen — liquidity, debt, protection, retirement, education, and estate, with a financial health score and action plan.',
  },
  {
    img: '/images/wealthpro-balance-sheet.png',
    altEn: 'WealthPro personal balance sheet',
    titleTh: 'งบการเงินส่วนบุคคล',
    titleEn: 'Personal Balance Sheet',
    descTh: 'รู้ว่าคุณยืนอยู่ตรงไหน — สินทรัพย์ หนี้สิน และโครงสร้างพอร์ตทั้งหมด จัดระเบียบชัดเจนเหมือนงบการเงินของบริษัทชั้นนำ',
    descEn: 'Know exactly where you stand — every asset, liability, and portfolio structure organized like a listed company\'s financial statements.',
  },
  {
    img: '/images/wealthpro-monte-carlo.png',
    altEn: 'WealthPro Monte Carlo simulation',
    titleTh: 'จำลองอนาคต 1,000 สถานการณ์',
    titleEn: '1,000-Scenario Monte Carlo Simulation',
    descTh: 'ไม่ใช่แค่ตัวเลขเดียว แต่เห็นทั้งกรณีตลาดดี กลาง และแย่ — ตอบได้ชัดว่า "ถ้าตลาดไม่เป็นใจ แผนของคุณยังไปถึงเป้าหมายไหม"',
    descEn: 'Not one number but the full range — good, median, and bad markets — answering clearly: "if markets disappoint, does your plan still survive?"',
  },
  {
    img: '/images/wealthpro-forward-cashflow.png',
    altEn: 'WealthPro forward cash flow projection',
    titleTh: 'งบการเงินล่วงหน้าถึงอายุ 85',
    titleEn: 'Forward Cash Flow to Age 85',
    descTh: 'กระแสเงินสดรายปีตลอดชีวิต — เห็นล่วงหน้าว่าปีไหนตึง ปีไหนสบาย และหลังเกษียณเงินของคุณพอใช้ถึงเมื่อไหร่',
    descEn: 'Year-by-year cash flow for life — see in advance which years are tight, which are comfortable, and how long your money lasts after retirement.',
  },
];

export default function WealthProShowcase({ lang, setActiveTab }: WealthProShowcaseProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [showPlan, setShowPlan] = useState(false);

  // Lock body scroll + allow Escape to close while the plan preview is open.
  useEffect(() => {
    if (!showPlan) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPlan(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [showPlan]);

  // Keep the active dot/arrows in sync with the user's swipe/scroll position.
  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(CARDS.length - 1, index)));
  };

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(CARDS.length - 1, index));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
    setActive(clamped);
  };

  // Re-align to the current slide if the viewport is resized.
  useEffect(() => {
    const onResize = () => {
      const el = trackRef.current;
      if (el) el.scrollTo({ left: active * el.clientWidth });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="wealthpro-showcase-section">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <span className="text-brand-orange text-xs font-mono font-semibold tracking-widest uppercase block">
          {lang === 'TH' ? 'เทคโนโลยีเบื้องหลังคำแนะนำของเรา · POWERED BY WEALTHPRO' : 'THE TECHNOLOGY BEHIND OUR ADVICE · POWERED BY WEALTHPRO'}
        </span>
        <h2 className="font-serif text-3.5xl md:text-4xl font-semibold text-brand-charcoal tracking-tight leading-tight">
          {lang === 'TH'
            ? 'เห็นเส้นทางการเงินทั้งชีวิตของคุณ ก่อนถึงวันนั้นจริง'
            : 'See your entire financial life — before you live it.'}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
          {lang === 'TH'
            ? 'เราไม่ได้วางแผนบนกระดาษหรือความรู้สึก — ที่ปรึกษาของเราทำงานบน WealthPro แอปพลิเคชันวางแผนการเงินที่เราพัฒนาขึ้นเอง จำลองชีวิตการเงินของคุณตั้งแต่วันนี้จนถึงอายุ 85 ครบทั้งงบดุล กระแสเงินสด การลงทุน ประกัน ภาษี และมรดก ทุกคำแนะนำจึงมีตัวเลขรองรับ และคุณได้เห็นผลลัพธ์ของทุกทางเลือก ก่อนตัดสินใจจริง'
            : 'We do not plan on paper or gut feeling. Our advisors work on WealthPro — a financial planning application we built ourselves — simulating your financial life from today to age 85 across balance sheet, cash flow, investments, insurance, tax, and estate. Every recommendation is backed by numbers you can see before you decide.'}
        </p>
      </div>

      {/* Swipeable carousel */}
      <div className="relative" id="wealthpro-ipad-carousel">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CARDS.map((card) => (
            <div key={card.img} className="snap-start shrink-0 basis-full px-1">
              <div className="mx-auto max-w-3xl space-y-4">
                {/* iPad mockup frame */}
                <div className="rounded-[22px] bg-[#141414] p-3 shadow-xl border border-black/40">
                  <div className="rounded-[12px] overflow-hidden border border-white/10">
                    <img
                      src={card.img}
                      alt={lang === 'TH' ? card.titleTh : card.altEn}
                      className="w-full h-auto block select-none pointer-events-none"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                </div>
                <div className="px-1 text-center">
                  <h4 className="font-display font-bold text-lg text-brand-charcoal">
                    {lang === 'TH' ? card.titleTh : card.titleEn}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed mt-1 max-w-xl mx-auto">
                    {lang === 'TH' ? card.descTh : card.descEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow controls (desktop / non-touch) */}
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label={lang === 'TH' ? 'รูปก่อนหน้า' : 'Previous'}
          className="absolute left-1 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-charcoal shadow-lg border border-slate-200 transition hover:bg-white disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === CARDS.length - 1}
          aria-label={lang === 'TH' ? 'รูปถัดไป' : 'Next'}
          className="absolute right-1 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-charcoal shadow-lg border border-slate-200 transition hover:bg-white disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots + swipe hint */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {CARDS.map((card, index) => (
            <button
              key={card.img}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`${lang === 'TH' ? 'ไปที่รูป' : 'Go to slide'} ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                active === index ? 'w-6 bg-brand-orange' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          {lang === 'TH' ? 'ปัดซ้าย–ขวาเพื่อดูแต่ละรูป' : 'Swipe left or right to browse'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12">
        <button
          onClick={() => setShowPlan(true)}
          className="bg-brand-orange text-white hover:bg-brand-orange/90 px-7 py-3.5 rounded-lg font-display font-semibold text-xs tracking-wider transition-all uppercase inline-flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          {lang === 'TH' ? 'ตัวอย่างรายงานแผนการเงิน' : 'SAMPLE FINANCIAL PLAN REPORT'}
        </button>
        <button
          onClick={() => setActiveTab(ActiveTab.Game)}
          className="border border-slate-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange px-7 py-3.5 rounded-lg font-display font-semibold text-xs tracking-wider transition-all uppercase bg-white"
        >
          {lang === 'TH' ? '🎲 หรือลองเล่น "เกมเศรษฐี" ก่อน' : '🎲 OR TRY THE MONEY GAME FIRST'}
        </button>
      </div>

      {/* Sample financial plan preview modal */}
      <AnimatePresence>
        {showPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setShowPlan(false)}
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'TH' ? 'ตัวอย่างรายงานแผนการเงิน' : 'Sample financial plan report'}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-5 h-5 shrink-0 text-brand-orange" />
                  <h3 className="font-display font-semibold text-sm text-brand-charcoal truncate">
                    {lang === 'TH' ? 'ตัวอย่างรายงานแผนการเงิน' : 'Sample Financial Plan Report'}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={SAMPLE_PLAN_PDF}
                    download="WealthPro-Sample-Financial-Plan.pdf"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-charcoal px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-black"
                  >
                    <Download className="w-4 h-4 text-brand-orange" />
                    {lang === 'TH' ? 'ดาวน์โหลด' : 'Download'}
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowPlan(false)}
                    aria-label={lang === 'TH' ? 'ปิด' : 'Close'}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-gray-500 transition-colors hover:bg-slate-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF preview */}
              <div className="flex-1 bg-slate-100">
                <iframe
                  src={`${SAMPLE_PLAN_PDF}#view=FitH`}
                  title={lang === 'TH' ? 'ตัวอย่างรายงานแผนการเงิน' : 'Sample financial plan report'}
                  className="h-full w-full"
                />
              </div>

              {/* Mobile fallback (inline PDF often won't render on phones) */}
              <div className="border-t border-slate-100 px-5 py-2.5 text-center sm:hidden">
                <a
                  href={SAMPLE_PLAN_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-brand-orange underline underline-offset-2"
                >
                  {lang === 'TH' ? 'เปิดไฟล์เต็มในแท็บใหม่' : 'Open the full file in a new tab'}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
