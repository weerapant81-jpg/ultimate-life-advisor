import React, { useState } from 'react';
import { ActiveTab, ImageSettings } from '../types';
import { ArrowUpRight, Shield, BarChart3, TrendingUp, ChevronRight, Award, UserCheck, ClipboardList, Map, CheckCircle2, RefreshCw, Layers, Star, Play, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import WealthProShowcase from './WealthProShowcase';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  lang: 'EN' | 'TH';
  imageSettings?: ImageSettings;
}

export default function HomeView({ setActiveTab, lang, imageSettings = {} }: HomeViewProps) {
  const [activeServiceFocus, setActiveServiceFocus] = useState('investment');

  const serviceFocusItems = [
    {
      id: 'investment',
      count: '01',
      icon: <TrendingUp className="w-4 h-4" />,
      labelTh: 'ลงทุนและออม',
      labelEn: 'Invest & Save',
      titleTh: 'จัดพอร์ตการลงทุนให้สอดคล้องกับเป้าหมายชีวิต',
      titleEn: 'Investment planning shaped around your life goals',
      descTh: 'ออกแบบสัดส่วนสินทรัพย์และแผนออมระยะยาวให้เหมาะกับเป้าหมาย ระยะเวลา และระดับความเสี่ยงที่คุณรับได้',
      descEn: 'Build a practical asset allocation and long-term saving plan aligned with your goals, timeline, and risk profile.',
    },
    {
      id: 'protection',
      count: '02',
      icon: <Shield className="w-4 h-4" />,
      labelTh: 'คุ้มครองครอบครัว',
      labelEn: 'Protect Family',
      titleTh: 'ปิดช่องว่างความคุ้มครองชีวิต สุขภาพ และรายได้',
      titleEn: 'Close life, health, and income protection gaps',
      descTh: 'วิเคราะห์ภาระครอบครัว ความคุ้มครองเดิม และความเสี่ยงด้านสุขภาพ เพื่อออกแบบแผนที่ดูแลคนสำคัญได้จริง',
      descEn: 'Review existing coverage, family obligations, and health exposure to create a protection plan that genuinely supports your household.',
    },
    {
      id: 'retirement',
      count: '03',
      icon: <BarChart3 className="w-4 h-4" />,
      labelTh: 'เกษียณและการศึกษา',
      labelEn: 'Future Goals',
      titleTh: 'วางแผนเกษียณและทุนการศึกษาบุตรอย่างเป็นระบบ',
      titleEn: 'Plan retirement and education funding with structure',
      descTh: 'แปลงเป้าหมายระยะยาวให้เป็นตัวเลขรายเดือนที่ทำได้จริง พร้อมติดตามและปรับแผนตามช่วงชีวิต',
      descEn: 'Turn long-term goals into realistic monthly actions, then review and adjust the plan as life changes.',
    },
    {
      id: 'tax',
      count: '04',
      icon: <ClipboardList className="w-4 h-4" />,
      labelTh: 'ภาษีและรีวิวแผน',
      labelEn: 'Tax & Review',
      titleTh: 'จัดการภาษีและทบทวนแผนการเงินประจำปี',
      titleEn: 'Optimize tax planning and annual financial reviews',
      descTh: 'ช่วยจัดลำดับสิทธิประโยชน์ทางภาษี ตรวจแผนเดิม และปรับพอร์ตให้ยังสอดคล้องกับเป้าหมายของครอบครัว',
      descEn: 'Prioritize tax benefits, review existing plans, and keep your portfolio aligned with changing family goals.',
    },
  ];

  const selectedServiceFocus = serviceFocusItems.find((item) => item.id === activeServiceFocus) ?? serviceFocusItems[0];

  // Stagger variants for smooth entry animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-brand-cream min-h-screen text-brand-charcoal"
      id="home-view-container"
    >
      {/* 1. Hero Section */}
      <section className="relative pt-10 pb-16 md:py-20 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left Content */}
          <motion.div variants={itemVariants} className="lg:col-span-6 space-y-7 relative z-10">
            <div className="inline-flex items-center px-0 py-0 border-0 shadow-none">
              <span className="text-sm font-display font-semibold text-brand-orange">
                {lang === 'TH' ? 'วางแผนวันนี้ เพื่อชีวิตที่มั่นคงในอนาคต' : 'Plan today for a steadier future'}
              </span>
            </div>
            
            <h1 className={`font-serif font-semibold tracking-tight leading-tight text-brand-charcoal ${lang === 'TH' ? 'text-[42px] md:text-[52px] lg:text-[58px] max-w-[720px]' : 'text-5xl md:text-6xl lg:text-7xl max-w-3xl'}`}>
              {lang === 'TH' ? (
                <>วางแผนการเงิน<br />เพื่อชีวิตในแบบที่คุณเลือก</>
              ) : (
                <>Financial Planning<br />for the Life You Choose</>
              )}
            </h1>

            <div className="h-0.5 w-10 bg-brand-orange" />
            
            <p className="text-base text-gray-600 max-w-xl font-sans leading-relaxed">
              {lang === 'TH' ? (
                'เราช่วยคุณวางแผนการเงินอย่างรอบด้าน ทั้งการลงทุน ประกันชีวิต ภาษี และการเกษียณ ด้วยกลยุทธ์ที่เหมาะสมกับเป้าหมายของคุณ'
              ) : (
                'We help you plan across investments, protection, tax, and retirement with practical strategies shaped around your goals.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <button
                onClick={() => setActiveTab(ActiveTab.Contact)}
                id="hero-cta-consult"
                className="bg-brand-orange text-white hover:bg-brand-orange/90 px-8 py-4 rounded-lg font-display font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-3"
              >
                <span>{lang === 'TH' ? 'นัดหมายปรึกษาฟรี' : 'Book Free Consultation'}</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={() => setActiveTab(ActiveTab.Services)}
                id="hero-cta-portfolio"
                className="border border-slate-300 hover:bg-white text-brand-charcoal px-8 py-4 rounded-lg font-display font-medium text-sm transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{lang === 'TH' ? 'ดูบริการของเรา' : 'View Our Services'}</span>
              </button>
            </div>
          </motion.div>

          {/* Hero Right Image */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-6 relative"
            id="hero-image-panel"
          >
            <div className="relative overflow-hidden">
              <img 
                src={imageSettings['hero.home'] || '/images/hero-financial-planning.png'} 
                alt="Ultimate Life Advisor financial planning consultation" 
                className="w-full h-[420px] md:h-[560px] object-cover filter contrast-105"
                fetchPriority="high"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white via-white/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/50 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

          {/* 2. Solutions / Services Grid */}
          <section className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="home-services-preview">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <span className="text-brand-orange text-xs font-mono font-semibold tracking-widest uppercase block">
                {lang === 'TH' ? 'บริการของเรา' : 'OUR SERVICES'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
                {lang === 'TH' ? 'โซลูชั่นทางการเงินที่ออกแบบเพื่อคุณ' : 'Financial Solutions Designed Around You'}
              </h2>
              <p className="text-gray-500 font-sans text-sm max-w-2xl mx-auto">
                {lang === 'TH' 
                  ? 'วางโครงสร้างการเงินให้ชัดเจนขึ้น ตั้งแต่วันนี้ไปจนถึงวันที่คุณต้องการใช้ชีวิตอย่างมั่นคง' 
                  : 'Clear, practical planning across the decisions that shape your financial life.'}
              </p>
            </div>

            <div className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
              <div className="lg:col-span-5 grid grid-cols-2 gap-2">
                {serviceFocusItems.map((item) => {
                  const isActive = item.id === activeServiceFocus;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveServiceFocus(item.id)}
                      className={`flex min-h-20 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                        isActive
                          ? 'border-brand-orange bg-brand-charcoal text-white shadow-sm'
                          : 'border-slate-100 bg-slate-50/70 text-slate-600 hover:border-brand-orange/40 hover:bg-white'
                      }`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isActive ? 'bg-brand-orange text-white' : 'bg-white text-brand-orange'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-[10px] font-mono font-bold tracking-wider ${isActive ? 'text-white/55' : 'text-slate-400'}`}>
                          {item.count}
                        </span>
                        <span className="block text-sm font-display font-bold leading-tight">
                          {lang === 'TH' ? item.labelTh : item.labelEn}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={selectedServiceFocus.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="lg:col-span-7 rounded-xl bg-slate-50 p-6 md:p-8 border border-slate-100 flex flex-col justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange">
                    <Sparkles className="w-3.5 h-3.5" />
                    {lang === 'TH' ? 'เลือกเส้นทางที่เหมาะกับคุณ' : 'Choose your advisory path'}
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-charcoal leading-tight">
                    {lang === 'TH' ? selectedServiceFocus.titleTh : selectedServiceFocus.titleEn}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-slate-600 max-w-2xl">
                    {lang === 'TH' ? selectedServiceFocus.descTh : selectedServiceFocus.descEn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab(ActiveTab.Contact)}
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-orange px-5 py-3 text-xs font-display font-bold uppercase tracking-wider text-white hover:bg-brand-orange/90 transition-colors"
                >
                  {lang === 'TH' ? 'นัดหมายเพื่อประเมินแผน' : 'Schedule a planning review'}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <div className="bg-white p-7 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                    <TrendingUp className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-charcoal">
                    {lang === 'TH' ? 'วางแผนการลงทุน' : 'Investment Planning'}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === 'TH'
                      ? 'วางกลยุทธ์การลงทุนที่เหมาะสมกับเป้าหมายและความเสี่ยงของคุณ'
                      : 'Investment strategies aligned with your goals, timeline, and risk profile.'}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab(ActiveTab.Services)}
                  className="mt-6 text-xs font-mono font-bold text-brand-orange flex items-center space-x-1"
                >
                  <span>{lang === 'TH' ? 'ดูรายละเอียด' : 'EXPLORE'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-7 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                    <Shield className="w-5 h-5 text-brand-orange" />
                  </div>
                    <h3 className="font-display font-bold text-lg text-brand-charcoal">
                      {lang === 'TH' ? 'ประกันชีวิตและสุขภาพ' : 'Life & Health Protection'}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {lang === 'TH'
                        ? 'แผนประกันที่คุ้มครองคุณและคนที่คุณรักในทุกช่วงของชีวิต'
                        : 'Protection planning for your income, health, family, and long-term security.'}
                    </p>
                </div>
                <button 
                  onClick={() => setActiveTab(ActiveTab.Services)}
                  className="mt-6 text-xs font-mono font-bold text-brand-orange flex items-center space-x-1"
                >
                  <span>{lang === 'TH' ? 'ดูรายละเอียด' : 'EXPLORE'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-7 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                    <BarChart3 className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-charcoal">
                    {lang === 'TH' ? 'วางแผนเกษียณ' : 'Retirement Planning'}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === 'TH'
                      ? 'เตรียมความพร้อมเพื่ออนาคตที่คุณภาพชีวิตมั่นคงและเลือกได้'
                      : 'A practical roadmap for a stable, flexible, and confident future lifestyle.'}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab(ActiveTab.Services)}
                  className="mt-6 text-xs font-mono font-bold text-brand-orange flex items-center space-x-1"
                >
                  <span>{lang === 'TH' ? 'ดูรายละเอียด' : 'EXPLORE'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-7 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                    <ClipboardList className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-charcoal">
                    {lang === 'TH' ? 'วางแผนภาษี' : 'Tax Planning'}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === 'TH'
                      ? 'บริหารภาษีอย่างมีประสิทธิภาพ ถูกต้องตามกฎหมาย และสอดคล้องกับแผนชีวิต'
                      : 'Tax-efficient planning that supports your goals while staying compliant.'}
                  </p>
                </div>

                <button 
                  onClick={() => setActiveTab(ActiveTab.Services)}
                  className="mt-6 text-xs font-mono font-bold text-brand-orange flex items-center space-x-1"
                >
                  <span>{lang === 'TH' ? 'ดูรายละเอียด' : 'EXPLORE'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </section>

          {/* WealthPro Platform Showcase (คอมโพเนนต์กลาง ใช้ร่วมกับหน้า "บริการ") */}
          <WealthProShowcase lang={lang} setActiveTab={setActiveTab} />

          {/* Professional Planning Process Section */}
          <section id="cfp-process-section" className="py-20 bg-slate-900 text-white rounded-3xl my-16 px-6 sm:px-10 lg:px-16 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full filter blur-3xl -mr-32 -mt-32"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center space-x-2 bg-brand-orange/10 border border-brand-orange/30 px-3 py-1 rounded-full text-[10px] font-mono text-brand-orange uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 animate-pulse" />
                  <span>{lang === 'TH' ? 'มาตรฐานวิชาชีพการวางแผนการเงิน' : 'GLOBAL PROFESSIONAL STANDARD'}</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4.5xl font-semibold tracking-tight text-white leading-tight">
                  {lang === 'TH' 
                    ? 'มากกว่าแค่การเสนอขายประกัน: กระบวนการวางแผนการเงินระดับวิชาชีพ' 
                    : 'Fiduciary Wealth Architecture: Our Professional 6-Step Process'}
                </h2>
                <p className="text-gray-400 font-sans text-sm max-w-2xl mx-auto">
                  {lang === 'TH'
                    ? 'เพราะกรมธรรม์ที่ดีที่สุดและการเก็บออมที่ยั่งยืน ต้องถูกออกแบบขึ้นจากสถาปัตยกรรมทางการเงินที่แม่นยำและจรรยาบรรณวิชาชีพที่เป็นกลาง เราไม่ได้มุ่งเน้นเสนอขายแบบประกัน แต่เราเคียงข้างคุณตามขั้นตอนการวางแผนอย่างเป็นระบบ'
                    : 'A secure financial future is not built on transaction sales, but through tailored fiduciary analysis. We partner with you through an international planning framework.'}
                </p>
              </div>

              {/* 6 Grid Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    num: '01',
                    titleTh: 'สร้างและกำหนดข้อตกลง',
                    titleEn: 'Establish & Define Relationship',
                    subtitleTh: 'Fiduciary trust & Contract',
                    subtitleEn: 'Fee transparency & scope',
                    descTh: 'ทำความรู้จักและชี้แจงบทบาทหน้าที่ของที่ปรึกษาการเงิน ความโปร่งใสด้านค่าธรรมเนียม และตกลงขอบเขตการวางแผนอย่างเป็นทางการ',
                    descEn: 'Introduce our fiduciary duties, define planning scope, answer your questions, and establish absolute fee/relationship transparency.',
                    badgeTh: 'ความโปร่งใส 100%',
                    badgeEn: '100% Transparency',
                    icon: <UserCheck className="w-5 h-5 text-brand-orange" />
                  },
                  {
                    num: '02',
                    titleTh: 'รวบรวมข้อมูลและเป้าหมาย',
                    titleEn: 'Gather Client Data & Goals',
                    subtitleTh: 'Personal goals & financial facts',
                    subtitleEn: 'Quantitative & qualitative data',
                    descTh: 'พูดคุยเก็บข้อมูลสถานะการเงินอย่างละเอียด (ทรัพย์สิน หนี้สิน รายจ่าย กรมธรรม์เดิมที่มี) พร้อมค้นหาเป้าหมายและข้อจำกัดส่วนบุคคล',
                    descEn: 'Collect complete financial records, cash flows, liabilities, and current covers while defining your qualitative lifetime milestones.',
                    badgeTh: 'เจาะลึกความต้องการ',
                    badgeEn: 'Need Audit',
                    icon: <ClipboardList className="w-5 h-5 text-brand-orange" />
                  },
                  {
                    num: '03',
                    titleTh: 'วิเคราะห์สถานะทางการเงิน',
                    titleEn: 'Analyze & Evaluate Status',
                    subtitleTh: 'Diagnostics & Stress-test',
                    subtitleEn: 'Gap analysis & financial ratios',
                    descTh: 'นำข้อมูลเชิงลึกมาวิเคราะห์ประเมิน อัตราส่วนสภาพคล่อง ช่องว่างความคุ้มครองสุขภาพและชีวิต (Insurance Gap) เพื่อหาจุดบกพร่องที่ต้องแก้ไข',
                    descEn: 'Evaluate financial health ratios, stress-test current policies, identify insurance deficits, and evaluate your saving-capacity.',
                    badgeTh: 'ตรวจพอร์ตและตรวจช่องว่าง',
                    badgeEn: 'Gap Analysis',
                    icon: <BarChart3 className="w-5 h-5 text-brand-orange" />
                  },
                  {
                    num: '04',
                    titleTh: 'จัดทำและนำเสนอแผนการเงิน',
                    titleEn: 'Develop & Present Recommendations',
                    subtitleTh: 'Holistic blueprint & alternatives',
                    subtitleEn: 'Unbiased plan design',
                    descTh: 'ออกแบบพอร์ตความคุ้มครองสุขภาพและแผนการออมอย่างเป็นกลาง เปรียบเทียบสินค้าจากบริษัทชั้นนำเพื่อให้ได้ผลประโยชน์สูงสุดต่อลูกค้าอย่างแท้จริง',
                    descEn: 'Formulate an integrated custom plan comparing top-tier insurance policies and active mutual funds, focusing strictly on client benefit.',
                    badgeTh: 'เปรียบเทียบเป็นกลางจากทุกบริษัท',
                    badgeEn: 'Unbiased Curation',
                    icon: <Map className="w-5 h-5 text-brand-orange" />
                  },
                  {
                    num: '05',
                    titleTh: 'ดำเนินการตามแผนการเงิน',
                    titleEn: 'Implement Recommendations',
                    subtitleTh: 'Coordinated execution',
                    subtitleEn: 'Seamless policy setup',
                    descTh: 'ประสานงานดูแลการสมัครผลิตภัณฑ์ทางการเงิน กรมธรรม์ หรือกองทุนรวมที่ได้รับการอนุมัติอย่างถูกต้อง ครบถ้วน และโปร่งใสในทุกขั้นตอน',
                    descEn: 'Execute the agreed blueprint seamlessly, managing the setup of medical insurance shields or wealth funds with full compliance.',
                    badgeTh: 'ดูแลธุรกรรมถูกต้องไร้รอยต่อ',
                    badgeEn: 'Seamless Execution',
                    icon: <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  },
                  {
                    num: '06',
                    titleTh: 'ติดตามและทบทวนอย่างสม่ำเสมอ',
                    titleEn: 'Monitor & Review Annually',
                    subtitleTh: 'Ongoing tuning & annual audit',
                    subtitleEn: 'Adapt to life stages',
                    descTh: 'ติดตามผล ทบทวนพอร์ตและอัปเดตสิทธิ์ความคุ้มครองกรมธรรม์ทุกปี หรือเมื่อเหตุการณ์ชีวิตเปลี่ยน เพื่อให้แผนเคียงข้างเป้าหมายเสมอ',
                    descEn: 'Conduct proactive annual reviews, claims checking, and portfolio rebalancing to align with your evolving family and career goals.',
                    badgeTh: 'ดูแลเคียงข้างระยะยาวรายปี',
                    badgeEn: 'Annual Stewardship',
                    icon: <RefreshCw className="w-5 h-5 text-brand-orange" />
                  }
                ].map((item) => (
                  <div key={item.num} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 hover:border-brand-orange/50 transition-all group flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                          {item.icon}
                        </div>
                        <span className="font-mono text-3xl font-bold text-slate-700 group-hover:text-brand-orange/20 transition-colors">{item.num}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base text-white group-hover:text-brand-orange transition-colors">
                          {lang === 'TH' ? item.titleTh : item.titleEn}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                          {lang === 'TH' ? item.subtitleTh : item.subtitleEn}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        {lang === 'TH' ? item.descTh : item.descEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80">
                      <span className="inline-block text-[10px] font-mono text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded border border-brand-orange/10">
                        {lang === 'TH' ? item.badgeTh : item.badgeEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Fiduciary Statement */}
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-800/60 text-center text-xs text-gray-400 font-sans max-w-3xl mx-auto">
                {lang === 'TH' 
                  ? '🛡️ ในฐานะที่ปรึกษาที่เป็นพันธมิตรกับทุกสถาบันชั้นนำ เรายึดถือประโยชน์สูงสุดของลูกค้าเป็นที่ตั้ง (Fiduciary Duty) โดยไม่มีข้อผูกมัดหรือการกดดันยอดขายแบบตัวแทนทั่วไป' 
                  : '🛡️ Fiduciary Commitment: As independent planners partnered with all top institutions, we are bound by standard professional ethics to prioritize your benefit over product sales commissions.'}
              </div>
            </div>
          </section>

          {/* 3. Why Us Section & Testimony */}
          <section className="bg-white py-20 border-y border-slate-100" id="trust-and-testimonials-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-16">
                
                {/* Left Points */}
                <div className="space-y-10" id="why-choose-us-section">
                  <div className="space-y-3 text-center max-w-3xl mx-auto">
                    <span className="text-brand-orange text-xs font-mono font-semibold tracking-wider uppercase block">
                      {lang === 'TH' ? 'ทำไมต้องเลือกเรา' : 'THE ULTIMATE LIFE ADVISOR DIFFERENCE'}
                    </span>
                    <h2 className="font-serif text-3.5xl font-semibold tracking-tight text-brand-charcoal">
                      {lang === 'TH' 
                        ? 'ทำไมลูกค้าและครอบครัวจึงไว้วางใจให้ Ultimate Life Advisor ดูแล' 
                        : 'Why Families Trust Ultimate Life Advisor for Their Future'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="ultimate-life-advisor-differences">
                    
                    <div className="flex space-x-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
                      <span className="font-mono text-lg text-brand-orange font-bold">01</span>
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base text-brand-charcoal">
                          {lang === 'TH' ? 'บริการที่ซื่อสัตย์และเป็นกลาง' : 'Completely Unbiased Guidance'}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {lang === 'TH'
                            ? 'เราไม่มีผลิตภัณฑ์การเงินแฝงเร้น แนะนำทางเลือกและผลิตภัณฑ์ที่เหมาะสมที่สุดจากทุกบริษัทประกันและสถาบันการเงิน เพื่อผลประโยชน์สูงสุดของคุณ'
                            : 'We operate strictly without proprietary product or fund bias. Our recommendations are curated from top-tier partners to fit your unique goals.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
                      <span className="font-mono text-lg text-brand-orange font-bold">02</span>
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base text-brand-charcoal">
                          {lang === 'TH' ? 'แผนการเงินแบบองค์รวม' : 'Holistic Financial Architecture'}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {lang === 'TH'
                            ? 'เราออกแบบแผนการเงินครอบคลุมทั้งการคุ้มครองรายได้ การประกันชีวิตและสุขภาพ การเตรียมความพร้อมเกษียณ ตลอดจนแผนกองทุนการศึกษาเพื่อคนที่คุณรัก'
                            : 'A holistic plan integrating income protection, life and health insurance, retirement readiness, and education funds for the people you love.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
                      <span className="font-mono text-lg text-brand-orange font-bold">03</span>
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base text-brand-charcoal">
                          {lang === 'TH' ? 'ที่ปรึกษาคู่คิดตลอดชีวิต' : 'Lifelong Financial Partnership'}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {lang === 'TH'
                            ? 'พร้อมเคียงข้างและปรับปรุงแผนตามความเหมาะสมในแต่ละช่วงชีวิตอย่างต่อเนื่อง เพื่อความอุ่นใจและมั่นใจในระยะยาว'
                            : 'We stand beside you through life\'s changing seasons, continuously monitoring and adapting your plan to fit your evolving family milestones.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xs">
                      <span className="font-mono text-lg text-brand-orange font-bold">04</span>
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-base text-brand-charcoal">
                          {lang === 'TH' ? 'ติดตามผลอย่างเป็นระบบ' : 'Systematic Review'}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {lang === 'TH'
                            ? 'ทบทวนแผนตามรอบเวลาและเหตุการณ์สำคัญในชีวิต เพื่อให้แผนการเงินยังเหมาะกับเป้าหมายของคุณเสมอ'
                            : 'Scheduled reviews keep your financial plan aligned with life changes, market shifts, and long-term goals.'}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Testimonials Panel */}
                <div className="space-y-8" id="client-testimonials-section">
                  <div className="space-y-2 text-center max-w-3xl mx-auto">
                    <span className="text-brand-orange text-xs font-mono font-semibold tracking-wider uppercase block">
                      {lang === 'TH' ? 'เสียงตอบรับจากผู้ใช้บริการจริง' : 'CLIENT TESTIMONIALS'}
                    </span>
                    <h3 className="font-serif text-2.5xl font-semibold tracking-tight text-brand-charcoal">
                      {lang === 'TH' ? 'รีวิวและเสียงตอบรับจากลูกค้า' : 'Trusted by Prominent Families'}
                    </h3>
                  </div>

                  {/* Testimonial Grid Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                    {[
                      {
                        quoteTh: '“ประทับใจความโปร่งใสและขั้นตอนการวิเคราะห์ช่องว่างความคุ้มครอง (Insurance Gap) ที่เป็นระบบและมืออาชีพมาก ทำให้รู้ว่าตัวเราขาดการปกป้องสุขภาพตรงไหน ไม่มีการยัดเยียดขายสินค้าเลยค่ะ”',
                        quoteEn: '“Extremely impressed with their professional Gap Analysis. They mapped out exactly what was missing in my family insurance plan without any high-pressure sales tactics.”',
                        name: 'คุณณิชชา วงศ์ภัทร',
                        roleTh: 'ผู้บริหารฝ่ายทรัพยากรบุคคล (HR Director)',
                        roleEn: 'Human Resources Director',
                        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
                        stars: 5
                      },
                      {
                        quoteTh: '“ในฐานะแพทย์ ผมไม่มีเวลาเจาะลึกแผนเกษียณและคุ้มครองความเสี่ยงเลย ทีมที่ปรึกษาช่วยจัดพอร์ตและตรวจเช็คเปรียบเทียบจากสถาบันชั้นนำอย่างเป็นกลาง ได้ผลประโยชน์สูงสุดต่อชีวิตผมจริงๆ”',
                        quoteEn: '“As a busy surgeon, I lack the time to analyze complex plans. Their independent team compared all top-tier providers neutrally and secured the absolute best coverage for us.”',
                        name: 'นพ. พรหมมินทร์ ลีลาสมบูรณ์',
                        roleTh: 'ศัลยแพทย์กระดูกและข้อ (Orthopedic Surgeon)',
                        roleEn: 'Orthopedic Surgeon',
                        img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
                        stars: 5
                      },
                      {
                        quoteTh: '“การวางแผนภาษีและกองทุนเพื่อการศึกษามีความซับซ้อนมาก ที่ปรึกษาช่วยไขข้อข้องใจ มีขั้นตอนการทำแผนที่ชัดเจน ติดตามผลและปรับปรุงพอร์ตรายปีอย่างใส่ใจเสมอมาครับ”',
                        quoteEn: '“Tax & educational fund planning is highly complex. Their planner answered all queries, established a clear roadmap, and provides attentive annual review updates.”',
                        name: 'คุณสุรศักดิ์ เกียรติ์ไพบูลย์',
                        roleTh: 'เจ้าของธุรกิจนำเข้าและส่งออก (Export Business Owner)',
                        roleEn: 'Export Business Owner',
                        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
                        stars: 5
                      },
                      {
                        quoteTh: '“ทีมงานช่วยจัดลำดับความสำคัญของแผนประกันและแผนลงทุนได้เข้าใจง่าย ทำให้ครอบครัวตัดสินใจได้มั่นใจขึ้นและเห็นภาพอนาคตชัดเจนกว่าเดิม”',
                        quoteEn: '“The team made protection and investment priorities easy to understand. Our family now makes decisions with more confidence and a clearer long-term picture.”',
                        name: 'คุณวรัญญา ตั้งศิริกุล',
                        roleTh: 'เจ้าของกิจการครอบครัว (Family Business Owner)',
                        roleEn: 'Family Business Owner',
                        img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
                        stars: 5
                      }
                    ].map((t, idx) => (
                      <div key={idx} className="bg-brand-cream/35 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between hover:border-brand-orange/40">
                        <span className="text-4xl font-serif text-brand-orange/15 absolute top-2 right-4">“</span>
                        
                        <div className="space-y-3">
                          {/* Stars Row */}
                          <div className="flex items-center space-x-1">
                            {[...Array(t.stars)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                            ))}
                          </div>
                          
                          <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                            {lang === 'TH' ? t.quoteTh : t.quoteEn}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3.5 pt-4 mt-4 border-t border-slate-200/50">
                          <img 
                            src={imageSettings[`testimonial.${idx + 1}`] || t.img} 
                            alt={t.name} 
                            className="w-10 h-10 rounded-full object-cover filter brightness-105 border border-slate-100"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h5 className="font-display font-bold text-xs sm:text-sm text-brand-charcoal">{t.name}</h5>
                            <span className="text-[10px] sm:text-xs text-gray-500">{lang === 'TH' ? t.roleTh : t.roleEn}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 4. Banner Call To Action */}
          <section className="bg-brand-charcoal text-white rounded-2xl mx-4 sm:mx-6 lg:mx-8 my-20 p-8 md:p-16 max-w-7xl lg:mx-auto border border-brand-slate shadow-xl overflow-hidden relative">
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono tracking-widest text-brand-orange uppercase">
                  {lang === 'TH' ? 'เริ่มต้นสร้างความอุ่นใจให้กับชีวิตของคุณ' : 'SECURE YOUR FINANCIAL FUTURE'}
                </span>
                <h3 className="font-serif text-3xl md:text-4.5xl font-semibold tracking-tight text-white leading-tight">
                  {lang === 'TH' 
                    ? 'พร้อมหรือยังที่จะปกป้องครอบครัวและสร้างแผนการเงินที่มั่นคง?' 
                    : 'Ready to protect your loved ones with a structured financial plan?'}
                </h3>
                <p className="text-sm text-gray-400 max-w-2xl">
                  {lang === 'TH'
                    ? 'ติดต่อทีมงานที่ปรึกษาการเงินส่วนบุคคลวันนี้ เพื่อเข้ารับการประเมินช่องว่างความคุ้มครองและจัดทำแผนการออมเบื้องต้นฟรี'
                    : 'Schedule an initial strategic consultation with our certified financial advisors to map out your coverage, retirement, and savings goals.'}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setActiveTab(ActiveTab.Contact)}
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3.5 rounded-lg text-sm font-display font-bold tracking-wider transition-all"
                >
                  {lang === 'TH' ? 'สร้างแผนการเงิน' : 'CREATE PLAN'}
                </button>
                <button
                  onClick={() => setActiveTab(ActiveTab.Contact)}
                  className="bg-brand-slate hover:bg-brand-slate/80 text-white border border-brand-slate px-8 py-3.5 rounded-lg text-sm font-display font-bold tracking-wider transition-all"
                >
                  {lang === 'TH' ? 'คุยกับที่ปรึกษา' : 'SPEAK TO ADVISOR'}
                </button>
              </div>

            </div>
          </section>

    </motion.div>
  );
}
