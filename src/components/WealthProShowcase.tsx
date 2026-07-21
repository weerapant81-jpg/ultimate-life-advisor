import React from 'react';
import { ActiveTab } from '../types';

/* ── เซกชันโชว์แอป WealthPro (การ์ด mockup iPad 4 ใบ) ──
   ใช้ร่วมกันทั้งหน้าแรกและหน้า "บริการ" — เนื้อหาเดียวกัน ตำแหน่งต่างกัน */

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="wealthpro-ipad-grid">
        {CARDS.map((card) => (
          <div key={card.img} className="space-y-4 group">
            {/* iPad mockup frame */}
            <div className="rounded-[22px] bg-[#141414] p-3 shadow-xl border border-black/40 transition-transform duration-300 group-hover:-translate-y-1.5">
              <div className="rounded-[12px] overflow-hidden border border-white/10">
                <img
                  src={card.img}
                  alt={lang === 'TH' ? card.titleTh : card.altEn}
                  className="w-full h-auto block"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="px-1">
              <h4 className="font-display font-bold text-lg text-brand-charcoal">
                {lang === 'TH' ? card.titleTh : card.titleEn}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                {lang === 'TH' ? card.descTh : card.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12">
        <button
          onClick={() => setActiveTab(ActiveTab.Contact)}
          className="bg-brand-orange text-white hover:bg-brand-orange/90 px-7 py-3.5 rounded-lg font-display font-semibold text-xs tracking-wider transition-all uppercase"
        >
          {lang === 'TH' ? 'นัดหมายดูแผนตัวอย่างจริงของคุณ' : 'BOOK A LIVE PLANNING SESSION'}
        </button>
        <button
          onClick={() => setActiveTab(ActiveTab.Game)}
          className="border border-slate-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange px-7 py-3.5 rounded-lg font-display font-semibold text-xs tracking-wider transition-all uppercase bg-white"
        >
          {lang === 'TH' ? '🎲 หรือลองเล่น "เกมเศรษฐี" ก่อน' : '🎲 OR TRY THE MONEY GAME FIRST'}
        </button>
      </div>
    </section>
  );
}
