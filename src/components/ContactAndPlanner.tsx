import React, { useState, useMemo, useRef } from 'react';
import { Calendar, Mail, Phone, MapPin, Calculator, HelpCircle, Check, ArrowRight, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import TurnstileWidget, { TurnstileHandle } from './TurnstileWidget';

interface ContactAndPlannerProps {
  lang: 'EN' | 'TH';
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

export default function ContactAndPlanner({ lang }: ContactAndPlannerProps) {
  // Calculator States
  const [calculatorMode, setCalculatorMode] = useState<'compound' | 'insurance' | 'education'>('compound');
  const [initAmt, setInitAmt] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [returnRate, setReturnRate] = useState<number>(7.5); // Personal advisor portfolio average
  const [yearsCompounded, setYearsCompounded] = useState<number>(15);
  const [annualIncome, setAnnualIncome] = useState<number>(600000);
  const [incomeYears, setIncomeYears] = useState<number>(10);
  const [outstandingDebt, setOutstandingDebt] = useState<number>(500000);
  const [mortgageBalance, setMortgageBalance] = useState<number>(1500000);
  const [finalExpenses, setFinalExpenses] = useState<number>(200000);
  const [educationObligations, setEducationObligations] = useState<number>(1000000);
  const [existingProtection, setExistingProtection] = useState<number>(1000000);
  const [availableAssets, setAvailableAssets] = useState<number>(300000);
  const [childAge, setChildAge] = useState<number>(5);
  const [startStudyAge, setStartStudyAge] = useState<number>(18);
  const [annualEducationCost, setAnnualEducationCost] = useState<number>(250000);
  const [studyYears, setStudyYears] = useState<number>(4);
  const [educationInflation, setEducationInflation] = useState<number>(5);
  const [educationReturnRate, setEducationReturnRate] = useState<number>(5);
  const [currentEducationSavings, setCurrentEducationSavings] = useState<number>(100000);

  // Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('insurance');
  const [formDate, setFormDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formConsent, setFormConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const turnstileRef = useRef<TurnstileHandle>(null);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Compound Interest Calculation
  const calculationResults = useMemo(() => {
    const P = initAmt;
    const PMT = monthlyContribution;
    const r = returnRate / 100 / 12; // monthly rate
    const n = yearsCompounded * 12; // total months

    // FV of single initial amount: P * (1 + r)^n
    const fvInit = P * Math.pow(1 + r, n);

    // FV of monthly contributions: PMT * [((1 + r)^n - 1) / r] * (1 + r) [assuming payment at end/start]
    // Let's assume ordinary annuity (payment at end of month): PMT * [((1 + r)^n - 1) / r]
    let fvMonthly = 0;
    if (r > 0) {
      fvMonthly = PMT * ((Math.pow(1 + r, n) - 1) / r);
    } else {
      fvMonthly = PMT * n;
    }

    const totalPortfolio = fvInit + fvMonthly;
    const totalInvested = P + (PMT * n);
    const compoundInterest = Math.max(0, totalPortfolio - totalInvested);

    return {
      total: Math.round(totalPortfolio),
      invested: Math.round(totalInvested),
      interest: Math.round(compoundInterest),
    };
  }, [initAmt, monthlyContribution, returnRate, yearsCompounded]);

  const insuranceResults = useMemo(() => {
    const incomeReplacement = annualIncome * incomeYears;
    const grossNeed = outstandingDebt + mortgageBalance + finalExpenses + educationObligations + incomeReplacement;
    const existingResources = existingProtection + availableAssets;
    const coverageGap = Math.max(0, grossNeed - existingResources);

    return {
      incomeReplacement,
      grossNeed,
      existingResources,
      coverageGap,
    };
  }, [
    annualIncome,
    incomeYears,
    outstandingDebt,
    mortgageBalance,
    finalExpenses,
    educationObligations,
    existingProtection,
    availableAssets,
  ]);

  const educationResults = useMemo(() => {
    const yearsUntilStudy = Math.max(0, startStudyAge - childAge);
    const inflationRate = educationInflation / 100;
    const monthlyReturn = educationReturnRate / 100 / 12;
    const savingMonths = Math.max(1, yearsUntilStudy * 12);
    let futureEducationCost = 0;

    for (let year = 0; year < studyYears; year += 1) {
      futureEducationCost += annualEducationCost * Math.pow(1 + inflationRate, yearsUntilStudy + year);
    }

    const futureExistingSavings = currentEducationSavings * Math.pow(1 + educationReturnRate / 100, yearsUntilStudy);
    const educationGap = Math.max(0, futureEducationCost - futureExistingSavings);
    const monthlyRequired = monthlyReturn > 0
      ? educationGap / ((Math.pow(1 + monthlyReturn, savingMonths) - 1) / monthlyReturn)
      : educationGap / savingMonths;

    return {
      yearsUntilStudy,
      futureEducationCost: Math.round(futureEducationCost),
      futureExistingSavings: Math.round(futureExistingSavings),
      educationGap: Math.round(educationGap),
      monthlyRequired: Math.round(monthlyRequired),
    };
  }, [
    childAge,
    startStudyAge,
    annualEducationCost,
    studyYears,
    educationInflation,
    educationReturnRate,
    currentEducationSavings,
  ]);

  const formatBaht = (amount: number) => `฿${Math.round(amount).toLocaleString('th-TH')}`;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!formName.trim() || !formEmail.trim() || !formDate.trim()) {
      setFormError(lang === 'TH' ? 'กรุณากรอกชื่อ อีเมล และวันที่ต้องการนัดหมาย' : 'Please complete name, email, and preferred date.');
      return;
    }

    if (!formConsent) {
      setFormError(lang === 'TH'
        ? 'กรุณายอมรับนโยบายความเป็นส่วนตัวเพื่อดำเนินการต่อ'
        : 'Please accept the Privacy Policy to continue.');
      return;
    }

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setFormError(lang === 'TH'
        ? 'กรุณายืนยันว่าคุณไม่ใช่บอทก่อนส่งคำขอ'
        : 'Please complete the anti-bot verification before submitting.');
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          subject: formSubject,
          preferredDate: formDate,
          notes: formNotes,
          consent: formConsent,
          captchaToken,
          lang,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to send appointment request.');
      }

      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
      setFormName('');
      setFormEmail('');
      setFormDate('');
      setFormNotes('');
      setFormConsent(false);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : (lang === 'TH' ? 'ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' : 'Unable to send request. Please try again.')
      );
    } finally {
      setFormSubmitting(false);
      // Turnstile tokens are single-use; clear and reset for the next attempt.
      setCaptchaToken('');
      turnstileRef.current?.reset();
    }
  };

  const faqs = [
    {
      qEn: 'What is the minimum budget required to start a personal financial plan?',
      qTh: 'มีงบประมาณเริ่มต้นเท่าใดจึงจะวางแผนการเงินส่วนบุคคลได้?',
      aEn: 'We welcome everyone. Whether you are starting with a monthly savings plan of $100 or seeking to optimize a large retirement portfolio, our certified planners are here to help.',
      aTh: 'เรายินดีต้อนรับทุกท่าน ไม่ว่าคุณจะเริ่มต้นวางแผนการออมเป็นรายเดือนเพียงเดือนละ 3,000 บาท หรือต้องการจัดระเบียบพอร์ตเกษียณอายุหลักล้านบาท ทีมที่ปรึกษาการเงินของเราพร้อมให้บริการด้วยมาตรฐานความใส่ใจระดับเดียวกัน'
    },
    {
      qEn: 'How are the financial planner fees structured?',
      qTh: 'โครงสร้างค่าบริการของที่ปรึกษาการเงินเป็นอย่างไร?',
      aEn: 'We believe in fee clarity. We offer both project-based flat fees for comprehensive life financial planning and performance-aligned models. We never charge hidden setup fees.',
      aTh: 'เรายึดถือความโปร่งใสเป็นสำคัญ โดยมีทั้งการบริการจัดทำแผนการเงินส่วนบุคคลแบบคงที่รายโปรเจกต์ และการแนะนำพอร์ตการออมแบบไม่มีค่าใช้จ่ายแอบแฝง เพื่อให้คุณมั่นใจได้ว่าแผนงานเป็นกลางอย่างแท้จริง'
    },
    {
      qEn: 'Which insurance and investment companies do you partner with?',
      qTh: 'คุณทำงานร่วมกับบริษัทประกันและบริษัทจัดการกองทุนใดบ้าง?',
      aEn: 'As an independent advisor, we partner with all major top-tier life insurance, health insurance, and mutual fund asset management companies to find the most cost-effective and highest-benefit products for your goals.',
      aTh: 'ในฐานะที่ปรึกษาอิสระ เราเป็นพันธมิตรร่วมกับบริษัทประกันชีวิต ประกันสุขภาพ และบริษัทจัดการกองทุนรวมชั้นนำทุกแห่ง เพื่อเปรียบเทียบและคัดสรรผลิตภัณฑ์ที่มีผลประโยชน์สูงที่สุดและประหยัดเบี้ยประกันสูงสุดให้แก่เป้าหมายของคุณ'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-brand-cream min-h-screen text-brand-charcoal"
      id="contact-view-container"
    >
      
      {/* 1. Header Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4 border-b border-slate-200">
        <span className="text-brand-orange text-xs font-mono font-semibold tracking-widest uppercase block">
          {lang === 'TH' ? 'ติดต่อและขอคำปรึกษา' : 'BE SPOKE WEALTH ADVISORY'}
        </span>
        <h1 className="font-serif text-4.5xl md:text-5.5xl font-semibold tracking-tight text-brand-charcoal leading-tight">
          {lang === 'TH' ? 'จองการปรึกษาเพื่อวางแผนการเงิน' : 'Interactive Wealth Planner & Contact'}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm">
          {lang === 'TH'
            ? 'ใช้เครื่องคำนวณสถิติประเมินพอร์ตโฟลิโอของคุณ จากนั้นยืนยันการขอจองเวลาวิเคราะห์โครงสร้างพอร์ตโดยคณะทำงาน Ultimate life Advisor ของเรา'
            : 'Estimate your future compounding growth, evaluate strategic asset projections, and schedule your advisory slot below.'}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Interactive Planner Calculator (7 cols) */}
        <div id="financial-calculator-card" className="lg:col-span-7 space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-xs">
          
          <div className="flex items-center space-x-3 text-brand-orange">
            <Calculator className="w-6 h-6" />
            <h3 className="font-display font-bold text-xl text-brand-charcoal">
              {lang === 'TH' ? 'เครื่องคำนวณเป้าหมายการเงิน' : 'Financial Goal Calculator'}
            </h3>
          </div>

          <p className="text-xs text-gray-500">
            {lang === 'TH'
              ? 'ทดลองประเมินตัวเลขเบื้องต้นก่อนนัดหมายทีมที่ปรึกษา ผลลัพธ์เป็นเพียงประมาณการเพื่อใช้ประกอบการวางแผนเท่านั้น'
              : 'Estimate early planning numbers before booking an advisory session. Results are illustrative planning estimates only.'}
          </p>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-400 block uppercase">
              {lang === 'TH' ? 'เลือกประเภทเครื่องคำนวณ' : 'SELECT CALCULATOR'}
            </label>
            <select
              value={calculatorMode}
              onChange={(e) => setCalculatorMode(e.target.value as 'compound' | 'insurance' | 'education')}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-brand-charcoal focus:outline-hidden focus:border-brand-orange"
            >
              <option value="compound">{lang === 'TH' ? 'การเติบโตของเงินออม/เงินลงทุน' : 'Savings & Investment Growth'}</option>
              <option value="insurance">{lang === 'TH' ? 'ทุนประกันที่เหมาะสม' : 'Life Insurance Coverage Need'}</option>
              <option value="education">{lang === 'TH' ? 'ทุนการศึกษาบุตร' : 'Child Education Fund'}</option>
            </select>
          </div>

          {calculatorMode === 'compound' && (
          <div className="space-y-6 pt-4">
            {/* Input 1: Initial Capital */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-500">
                <span>{lang === 'TH' ? 'เงินออม/เงินลงทุนเริ่มต้น' : 'INITIAL CAPITAL (THB)'}</span>
                <span className="font-bold text-brand-charcoal">{formatBaht(initAmt)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={initAmt}
                onChange={(e) => setInitAmt(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>฿10,000</span>
                <span>฿2,500,000</span>
                <span>฿5,000,000</span>
              </div>
            </div>

            {/* Input 2: Monthly Contributions */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-500">
                <span>{lang === 'TH' ? 'เงินสะสมเพื่อเป้าหมายต่อเดือน' : 'MONTHLY SAVINGS (THB)'}</span>
                <span className="font-bold text-brand-charcoal">{formatBaht(monthlyContribution)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>฿500</span>
                <span>฿50,000</span>
                <span>฿100,000</span>
              </div>
            </div>

            {/* Input 3: Rate of Return */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-500">
                <span>{lang === 'TH' ? 'ผลตอบแทนคาดหวังเฉลี่ยต่อปี (%)' : 'ANNUAL RATE OF RETURN (%)'}</span>
                <span className="font-bold text-brand-orange">{returnRate}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="0.1"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>2.0% (Defensive Savings)</span>
                <span>7.5% (Balanced Portfolio average)</span>
                <span>15.0% (Active Equity plan)</span>
              </div>
            </div>

            {/* Input 4: Years of Compounding */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-500">
                <span>{lang === 'TH' ? 'ระยะเวลาการลงทุน (ปี)' : 'YEARS TO ACCUMULATE'}</span>
                <span className="font-bold text-brand-charcoal">{yearsCompounded} {lang === 'TH' ? 'ปี' : 'Years'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={yearsCompounded}
                onChange={(e) => setYearsCompounded(Number(e.target.value))}
                className="w-full accent-brand-orange"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>1 Year</span>
                <span>20 Years</span>
                <span>40 Years</span>
              </div>
            </div>

          </div>
          )}

          {calculatorMode === 'insurance' && (
            <div className="space-y-5 pt-4">
              <div className="rounded-xl bg-orange-50/70 border border-orange-100 p-4 text-xs text-slate-600 leading-relaxed">
                {lang === 'TH'
                  ? 'สูตรเบื้องต้น: ทุนประกัน = หนี้สิน + รายได้ที่ต้องการทดแทน + ภาระที่อยู่อาศัย + ค่าใช้จ่ายสุดท้าย + ค่าใช้จ่ายการศึกษา - ทุนประกันและสินทรัพย์ที่มีอยู่'
                  : 'Basic method: coverage need = debts + income replacement + mortgage + final expenses + education needs - existing coverage and liquid assets.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: lang === 'TH' ? 'รายได้ต่อปีที่ต้องการคุ้มครอง' : 'Annual income to replace',
                    value: annualIncome,
                    setValue: setAnnualIncome,
                    min: 120000,
                    max: 5000000,
                    step: 10000,
                  },
                  {
                    label: lang === 'TH' ? 'หนี้สินอื่น ๆ' : 'Other outstanding debts',
                    value: outstandingDebt,
                    setValue: setOutstandingDebt,
                    min: 0,
                    max: 5000000,
                    step: 10000,
                  },
                  {
                    label: lang === 'TH' ? 'ยอดสินเชื่อบ้านคงเหลือ' : 'Remaining mortgage',
                    value: mortgageBalance,
                    setValue: setMortgageBalance,
                    min: 0,
                    max: 10000000,
                    step: 50000,
                  },
                  {
                    label: lang === 'TH' ? 'ค่าใช้จ่ายสุดท้าย/ฉุกเฉิน' : 'Final and emergency expenses',
                    value: finalExpenses,
                    setValue: setFinalExpenses,
                    min: 0,
                    max: 2000000,
                    step: 10000,
                  },
                  {
                    label: lang === 'TH' ? 'ภาระทุนการศึกษาที่ต้องเตรียม' : 'Education obligations',
                    value: educationObligations,
                    setValue: setEducationObligations,
                    min: 0,
                    max: 10000000,
                    step: 50000,
                  },
                  {
                    label: lang === 'TH' ? 'ทุนประกันเดิมที่มีอยู่' : 'Existing life coverage',
                    value: existingProtection,
                    setValue: setExistingProtection,
                    min: 0,
                    max: 10000000,
                    step: 50000,
                  },
                ].map((input) => (
                  <div key={input.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-gray-500 gap-3">
                      <span>{input.label}</span>
                      <span className="font-bold text-brand-charcoal">{formatBaht(input.value)}</span>
                    </div>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={input.value}
                      onChange={(e) => input.setValue(Number(e.target.value))}
                      className="w-full accent-brand-orange"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                    <span>{lang === 'TH' ? 'จำนวนปีที่ต้องการทดแทนรายได้' : 'Income replacement years'}</span>
                    <span className="font-bold text-brand-charcoal">{incomeYears} {lang === 'TH' ? 'ปี' : 'years'}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={incomeYears}
                    onChange={(e) => setIncomeYears(Number(e.target.value))}
                    className="w-full accent-brand-orange"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-gray-500 gap-3">
                    <span>{lang === 'TH' ? 'สินทรัพย์สภาพคล่องที่นำมาใช้ได้' : 'Available liquid assets'}</span>
                    <span className="font-bold text-brand-charcoal">{formatBaht(availableAssets)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="50000"
                    value={availableAssets}
                    onChange={(e) => setAvailableAssets(Number(e.target.value))}
                    className="w-full accent-brand-orange"
                  />
                </div>
              </div>
            </div>
          )}

          {calculatorMode === 'education' && (
            <div className="space-y-5 pt-4">
              <div className="rounded-xl bg-orange-50/70 border border-orange-100 p-4 text-xs text-slate-600 leading-relaxed">
                {lang === 'TH'
                  ? 'สูตรเบื้องต้น: ประมาณค่าเทอมอนาคตด้วยอัตราเงินเฟ้อการศึกษา แล้วหักมูลค่าอนาคตของเงินออมที่มีอยู่ เพื่อหาเงินที่ยังขาดและเงินออมต่อเดือน'
                  : 'Basic method: project future tuition using education inflation, subtract future value of existing savings, then estimate the monthly saving needed.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: lang === 'TH' ? 'อายุบุตรปัจจุบัน' : 'Child current age',
                    value: childAge,
                    setValue: setChildAge,
                    min: 0,
                    max: 17,
                    step: 1,
                    suffix: lang === 'TH' ? 'ปี' : 'yrs',
                  },
                  {
                    label: lang === 'TH' ? 'อายุเริ่มเรียนมหาวิทยาลัย' : 'College start age',
                    value: startStudyAge,
                    setValue: setStartStudyAge,
                    min: 15,
                    max: 25,
                    step: 1,
                    suffix: lang === 'TH' ? 'ปี' : 'yrs',
                  },
                  {
                    label: lang === 'TH' ? 'ค่าเล่าเรียนต่อปี ณ ปัจจุบัน' : 'Current annual education cost',
                    value: annualEducationCost,
                    setValue: setAnnualEducationCost,
                    min: 50000,
                    max: 2000000,
                    step: 10000,
                    money: true,
                  },
                  {
                    label: lang === 'TH' ? 'เงินออมเพื่อการศึกษาที่มีอยู่' : 'Existing education savings',
                    value: currentEducationSavings,
                    setValue: setCurrentEducationSavings,
                    min: 0,
                    max: 5000000,
                    step: 10000,
                    money: true,
                  },
                  {
                    label: lang === 'TH' ? 'จำนวนปีที่ต้องสนับสนุน' : 'Years of study to fund',
                    value: studyYears,
                    setValue: setStudyYears,
                    min: 1,
                    max: 8,
                    step: 1,
                    suffix: lang === 'TH' ? 'ปี' : 'yrs',
                  },
                  {
                    label: lang === 'TH' ? 'เงินเฟ้อการศึกษาต่อปี' : 'Education inflation',
                    value: educationInflation,
                    setValue: setEducationInflation,
                    min: 1,
                    max: 10,
                    step: 0.1,
                    suffix: '%',
                  },
                  {
                    label: lang === 'TH' ? 'ผลตอบแทนคาดหวังของเงินออม' : 'Expected saving return',
                    value: educationReturnRate,
                    setValue: setEducationReturnRate,
                    min: 0,
                    max: 12,
                    step: 0.1,
                    suffix: '%',
                  },
                ].map((input) => (
                  <div key={input.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-gray-500 gap-3">
                      <span>{input.label}</span>
                      <span className="font-bold text-brand-charcoal">
                        {input.money ? formatBaht(input.value) : `${input.value}${input.suffix ? ` ${input.suffix}` : ''}`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={input.value}
                      onChange={(e) => input.setValue(Number(e.target.value))}
                      className="w-full accent-brand-orange"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Block */}
          {calculatorMode === 'compound' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100 text-center">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'เงินต้นรวม' : 'TOTAL INVESTED'}</span>
                  <p className="text-xl font-display font-bold text-slate-700 mt-1">
                    {formatBaht(calculationResults.invested)}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'ผลตอบแทนทบต้น' : 'COMPOUND INTEREST'}</span>
                  <p className="text-xl font-display font-bold text-brand-orange mt-1">
                    +{formatBaht(calculationResults.interest)}
                  </p>
                </div>

                <div className="bg-brand-charcoal text-white p-4 rounded-xl border border-brand-slate">
                  <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'มูลค่าพอร์ตประมาณการ' : 'ESTIMATED PORTFOLIO'}</span>
                  <p className="text-xl font-display font-bold text-emerald-400 mt-1">
                    {formatBaht(calculationResults.total)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <span className="text-[10px] font-mono text-gray-400 tracking-wider block uppercase">
                  {lang === 'TH' ? 'สัดส่วนเงินต้นและผลตอบแทน' : 'Proportional Wealth Composition'}
                </span>
                <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden flex">
                  <div 
                    style={{ width: `${(calculationResults.invested / calculationResults.total) * 100}%` }}
                    className="bg-brand-charcoal h-full flex items-center justify-center text-[10px] text-white font-mono font-bold transition-all duration-300"
                  >
                    {Math.round((calculationResults.invested / calculationResults.total) * 100)}%
                  </div>
                  <div 
                    style={{ width: `${(calculationResults.interest / calculationResults.total) * 100}%` }}
                    className="bg-brand-orange h-full flex items-center justify-center text-[10px] text-white font-mono font-bold transition-all duration-300"
                  >
                    {Math.round((calculationResults.interest / calculationResults.total) * 100)}%
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono pt-1">
                  <span className="flex items-center"><span className="w-2.5 h-2.5 bg-brand-charcoal rounded-sm mr-1.5 inline-block" />{lang === 'TH' ? 'เงินต้น' : 'Invested Base'}</span>
                  <span className="flex items-center"><span className="w-2.5 h-2.5 bg-brand-orange rounded-sm mr-1.5 inline-block" />{lang === 'TH' ? 'ผลตอบแทน' : 'Compounded Gain'}</span>
                </div>
              </div>
            </>
          )}

          {calculatorMode === 'insurance' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'รายได้ทดแทน' : 'INCOME REPLACEMENT'}</span>
                <p className="text-xl font-display font-bold text-slate-700 mt-1">{formatBaht(insuranceResults.incomeReplacement)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'ทุน/สินทรัพย์ที่มีอยู่' : 'EXISTING RESOURCES'}</span>
                <p className="text-xl font-display font-bold text-brand-orange mt-1">{formatBaht(insuranceResults.existingResources)}</p>
              </div>
              <div className="bg-brand-charcoal text-white p-4 rounded-xl border border-brand-slate">
                <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'ทุนประกันที่ควรมีเพิ่ม' : 'ADDITIONAL COVERAGE NEED'}</span>
                <p className="text-xl font-display font-bold text-emerald-400 mt-1">{formatBaht(insuranceResults.coverageGap)}</p>
              </div>
            </div>
          )}

          {calculatorMode === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'ค่าเรียนอนาคตรวม' : 'FUTURE EDUCATION COST'}</span>
                <p className="text-xl font-display font-bold text-slate-700 mt-1">{formatBaht(educationResults.futureEducationCost)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'เงินที่ยังขาด' : 'FUNDING GAP'}</span>
                <p className="text-xl font-display font-bold text-brand-orange mt-1">{formatBaht(educationResults.educationGap)}</p>
              </div>
              <div className="bg-brand-charcoal text-white p-4 rounded-xl border border-brand-slate">
                <span className="text-[10px] font-mono text-gray-400 block tracking-wider">{lang === 'TH' ? 'ควรออมต่อเดือน' : 'MONTHLY SAVING NEEDED'}</span>
                <p className="text-xl font-display font-bold text-emerald-400 mt-1">{formatBaht(educationResults.monthlyRequired)}</p>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Contact & Booking Form (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          <div id="booking-form-card" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-brand-orange">
              <Calendar className="w-6 h-6" />
              <h3 className="font-display font-bold text-lg text-brand-charcoal">
                {lang === 'TH' ? 'ขอนัดหมายพบผู้เชี่ยวชาญ' : 'Secure Advisory Slot'}
              </h3>
            </div>

            <p className="text-xs text-gray-500">
              {lang === 'TH'
                ? 'กรอกข้อมูลเพื่อส่งไปยังฝ่ายบริการสินทรัพย์ส่วนบุคคล คณะที่ปรึกษาของเราจะติดต่อกลับภายใน 1 วันทำการเพื่อยืนยันช่วงเวลา'
                : 'Send your mandate requirement profile. Our private advisory desk will contact you within 1 business day.'}
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'TH' ? 'ระบุชื่อ-นามสกุลของคุณ' : 'Enter your full name'}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">PROFESSIONAL EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">ADVISORY MANDATE</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-orange"
                >
                  <option value="insurance">{lang === 'TH' ? 'ประกันชีวิต สุขภาพ โรคร้ายแรง' : 'Life, Health & Critical Illness Insurance'}</option>
                  <option value="retirement">{lang === 'TH' ? 'การออมและวางแผนเพื่อการเกษียณ' : 'Retirement Wealth Planning'}</option>
                  <option value="education">{lang === 'TH' ? 'ทุนการศึกษาบุตรหลานระยะยาว' : 'Children\'s Education Fund'}</option>
                  <option value="investment">{lang === 'TH' ? 'การวางพอร์ตและลงทุนส่วนบุคคล' : 'Personal Investment Portfolio'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">PREFERRED BOOKING DATE</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-orange"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">ADDITIONAL REQUIREMENTS (OPTIONAL)</label>
                <textarea
                  rows={2}
                  placeholder={lang === 'TH' ? 'รายละเอียดสินทรัพย์หรือคำถามเพิ่มเติม...' : 'Notes or core holding structures...'}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-orange"
                />
              </div>

              <label className="flex items-start gap-3 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formConsent}
                  onChange={(e) => setFormConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand-orange"
                />
                <span className="text-[11px] leading-5 text-gray-500">
                  {lang === 'TH' ? (
                    <>
                      ข้าพเจ้ายินยอมให้ Ultimate Life Advisor เก็บและใช้ข้อมูลส่วนบุคคลที่ให้ไว้
                      เพื่อการติดต่อกลับและให้คำปรึกษาตาม
                      <a href="#/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-orange font-semibold underline underline-offset-2 hover:text-brand-charcoal">
                        นโยบายความเป็นส่วนตัว
                      </a>
                    </>
                  ) : (
                    <>
                      I consent to Ultimate Life Advisor collecting and using the personal data I provide
                      to contact me and deliver advisory services in accordance with the{' '}
                      <a href="#/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-orange font-semibold underline underline-offset-2 hover:text-brand-charcoal">
                        Privacy Policy
                      </a>
                      .
                    </>
                  )}
                </span>
              </label>

              {TURNSTILE_SITE_KEY && (
                <TurnstileWidget
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  lang={lang}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken('')}
                />
              )}

              <button
                type="submit"
                id="form-submit-booking-btn"
                disabled={formSubmitting || !formConsent || (Boolean(TURNSTILE_SITE_KEY) && !captchaToken)}
                className="w-full bg-brand-charcoal hover:bg-black text-white font-semibold py-3.5 rounded-lg text-xs tracking-wider font-display uppercase transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{formSubmitting ? (lang === 'TH' ? 'กำลังส่งคำขอ...' : 'SENDING REQUEST...') : (lang === 'TH' ? 'ส่งคำขอนัดหมายปรึกษา' : 'SUBMIT ADVISORY REQUEST')}</span>
                <ArrowRight className="w-4 h-4 text-brand-orange" />
              </button>

              {formError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

            </form>

            {formSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-emerald-800">
                  {lang === 'TH' ? 'ส่งคำนัดหมายเรียบร้อยแล้ว!' : 'Request Registered Successfully!'}
                </h5>
                <p className="text-[11px] text-emerald-600 font-sans">
                  {lang === 'TH' 
                    ? 'ที่ปรึกษาจะติดต่อกลับเพื่อสรุปช่วงเวลาและคู่มือความเสี่ยงเบื้องต้นในอีเมลของคุณ'
                    : 'A private banker will reach out with the initial diagnostics kit.'}
                </p>
              </motion.div>
            )}

          </div>

          {/* Core Office Locations */}
          <div className="bg-brand-charcoal text-white p-8 rounded-2xl border border-brand-slate space-y-4">
            <h4 className="font-display font-semibold text-[17px] tracking-wider uppercase text-brand-orange">
              {lang === 'TH' ? 'สำนักงานใหญ่ของเรา' : 'OUR HEADQUARTERS'}
            </h4>
            
            <div className="space-y-4 text-[17px] font-mono">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  {lang === 'TH'
                    ? '199/78 เดอะเวนิสปาร์ค ต.ในเมือง อ.เมือง จ.นครราชสีมา 30000'
                    : '199/78 The Venice Park, Naimueang, Mueang, Nakhonratchasima, 30000'}
                </span>
              </div>
              <div className="flex items-start space-x-3 pt-2 border-t border-brand-slate">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-300">099-4588787</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FAQ Accordion Section */}
      <section className="py-12 border-t border-slate-200 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-16">
        <div className="text-center space-y-2">
          <HelpCircle className="w-6 h-6 text-brand-orange mx-auto" />
          <h3 className="font-serif text-2xl font-bold">{lang === 'TH' ? 'คำถามที่พบบ่อย' : 'Frequently Asked Questions'}</h3>
          <p className="text-xs text-gray-400">Clear insights about our asset management relationship rules.</p>
        </div>

        <div className="space-y-3" id="faq-accordion-container">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-slate-100 overflow-hidden cursor-pointer shadow-xs transition-colors"
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div className="p-5 flex justify-between items-center select-none font-medium text-sm text-slate-800">
                  <span>{lang === 'TH' ? faq.qTh : faq.qEn}</span>
                  <span className={`text-brand-orange font-bold text-lg transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </div>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 pt-1 border-t border-slate-50 text-xs text-gray-500 leading-relaxed font-sans"
                  >
                    {lang === 'TH' ? faq.aTh : faq.aEn}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </motion.div>
  );
}

