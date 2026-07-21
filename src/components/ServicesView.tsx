import React from 'react';
import { ActiveTab, ImageSettings } from '../types';
import { Calendar, Search, Layers, Cpu, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import WealthProShowcase from './WealthProShowcase';

interface ServicesViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  lang: 'EN' | 'TH';
  imageSettings?: ImageSettings;
}

export default function ServicesView({ setActiveTab, lang, imageSettings = {} }: ServicesViewProps) {
  const workflowSteps = [
    {
      num: '01',
      titleEn: 'Establish & Define Relationship',
      titleTh: 'สร้างและกำหนดข้อตกลงในการทำแผน',
      descEn: 'Introduce our fiduciary duties, define planning scope, clarify planner responsibilities, and ensure absolute fee transparency.',
      descTh: 'ทำความรู้จัก ชี้แจงบทบาทหน้าที่ของที่ปรึกษาการเงิน ความโปร่งใสด้านค่าบริการ และตกลงขอบเขตเป้าหมายเพื่อรากฐานความเชื่อมั่นร่วมกัน'
    },
    {
      num: '02',
      titleEn: 'Gather Client Data & Goals',
      titleTh: 'รวบรวมข้อมูลและเป้าหมายของลูกค้า',
      descEn: 'Collect complete financial records, cash flows, liabilities, and existing insurance policies to understand your current situation.',
      descTh: 'รวบรวมข้อมูลทางการเงินในปัจจุบันทั้งหมด เช่น สินทรัพย์ หนี้สิน รายจ่าย และกรมธรรม์เดิม พร้อมพูดคุยเพื่อระบุเป้าหมายชีวิตและครอบครัว'
    },
    {
      num: '03',
      titleEn: 'Analyze & Evaluate Status',
      titleTh: 'วิเคราะห์และประเมินสถานะทางการเงิน',
      descEn: 'Stress-test current policies, calculate liquidity ratios, analyze wealth gaps, and identify insurance coverage deficits.',
      descTh: 'นำข้อมูลทั้งหมดมาวิเคราะห์ทางสถิติ ประเมินอัตราส่วนทางการเงิน ตรวจหาช่องว่างความคุ้มครองสุขภาพและชีวิต (Insurance Gap Analysis)'
    },
    {
      num: '04',
      titleEn: 'Develop & Present Strategic Blueprints',
      titleTh: 'จัดทำและนำเสนอแผนการเงิน',
      descEn: 'Formulate personalized risk barrier and savings models, comparing top-tier insurance policies and asset funds objectively.',
      descTh: 'ออกแบบพอร์ตคุ้มครองสุขภาพ ทุนการศึกษา และแผนการออมเกษียณอย่างเป็นกลาง คัดสรรแบบประกันและกองทุนที่ให้ประโยชน์สูงสุดแก่คุณ'
    },
    {
      num: '05',
      titleEn: 'Implement Financial Recommendations',
      titleTh: 'ดำเนินการตามแผนการเงินอย่างโปร่งใส',
      descEn: 'Seamlessly coordinate coverage sign-ups and portfolio allocation setup with complete regulatory and fiduciary alignment.',
      descTh: 'ประสานงานดูแลขั้นตอนการสมัครผลิตภัณฑ์ประกันสุขภาพ ประกันชีวิต หรือการลงทุนในกองทุนรวมที่ตกลงไว้ให้ถูกต้อง โปร่งใส ไร้กังวล'
    },
    {
      num: '06',
      titleEn: 'Ongoing Monitoring & Annual Audits',
      titleTh: 'ติดตามและทบทวนอย่างสม่ำเสมอประจำปี',
      descEn: 'Proactively review policies, rebalance assets annually, and adjust the planning blueprint to match your evolving life stages.',
      descTh: 'ติดตามผลการออม ตรวจเช็คการเคลมสินไหม ทบทวนปรับปรุงกรมธรรม์ และปรับสมดุลพอร์ตลงทุนเป็นประจำทุกปีให้ก้าวทันทุกช่วงชีวิตของคุณ'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-brand-cream min-h-screen"
      id="services-view-container"
    >
      {/* 1. Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <span className="text-brand-orange text-xs font-mono font-semibold tracking-widest uppercase block">
          {lang === 'TH' ? 'บริการวางแผนการเงินส่วนบุคคลครบวงจร' : 'COMPREHENSIVE PERSONAL FINANCIAL SERVICES'}
        </span>
        <h1 className="font-serif text-4.5xl md:text-6xl font-semibold tracking-tight text-brand-charcoal max-w-4xl mx-auto leading-tight">
          {lang === 'TH' ? (
            'ออกแบบแผนชีวิตและการเงิน เพื่อความสุขสมบูรณ์ของครอบครัว'
          ) : (
            'Personal Financial Planning for True Peace of Mind.'
          )}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-base">
          {lang === 'TH'
            ? 'Ultimate Life Advisor ผสมผสานระเบียบแผนความคุ้มครองที่รัดกุมเข้ากับการสะสมทรัพย์และการลงทุนส่วนบุคคล เพื่อให้คุณใช้ชีวิตได้อย่างไร้กังวลและส่งต่อความอุ่นใจอย่างยั่งยืน'
            : 'Ultimate Life Advisor guides your wealth with tailored structures. We integrate premium risk protection, life/health insurance policies, retirement security, and strategic investment plans.'}
        </p>
      </section>

      {/* 2. Grid Services */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Card 1: Investment Strategy (Big Card with Skyscraper Image) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
            <div className="p-8 md:p-10 pb-6 md:pb-7 space-y-5">
              <div className="flex items-center space-x-3 text-brand-orange">
                <Layers className="w-6 h-6" />
                <h3 className="font-display font-bold text-xl text-brand-charcoal">
                  {lang === 'TH' ? 'การวางแผนการลงทุนและการออมส่วนบุคคล' : 'Bespoke Personal Investment & Savings Strategy'}
                </h3>
              </div>
              <p className="text-gray-500 text-sm max-w-xl">
                {lang === 'TH'
                  ? 'สร้างพอร์ตโฟลิโอส่วนบุคคลที่คัดสรรและประเมินกองทุนรวมคุณภาพสูงจากสถาบันการเงินที่หลากหลาย เพื่อให้เงินเก็บของคุณทำงานได้อย่างปลอดภัยและเอาชนะเงินเฟ้ออย่างมั่นคง'
                  : 'We formulate target-driven savings and asset allocation models tailored to your life objectives. Access elite mutual funds and diversified investment assets with active portfolio rebalancing.'}
              </p>
            </div>

            {/* Skyscraper photo below */}
            <div className="h-80 md:h-[360px] overflow-hidden relative border-t border-slate-100">
              <img 
                src={imageSettings['service.main'] || 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&q=80&w=800'} 
                alt="Skyscrapers Skyline" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 2: Proven Metrics (Dark background block) */}
          <div className="lg:col-span-4 bg-brand-charcoal text-white rounded-xl p-10 border border-brand-slate shadow-lg flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-xs font-mono text-brand-orange tracking-widest uppercase">
                {lang === 'TH' ? 'สถิติที่น่าไว้วางใจ' : 'PROVEN METRICS'}
              </span>
              <h3 className="font-serif text-2xl font-semibold text-white">
                {lang === 'TH' ? 'ความเชี่ยวชาญเพื่อแผนชีวิตที่มั่นคง' : 'Guaranteed consistency.'}
              </h3>
              <p className="text-xs text-gray-400">
                {lang === 'TH'
                  ? 'เราคัดเลือกสิ่งที่ดีที่สุดอย่างเป็นกลางเพื่อชีวิตและการเงินที่ยั่งยืนของครอบครัวคุณ'
                  : 'We do not sell biased products. Our priority is aligning 100% with your secure family protection and wealth goals.'}
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-brand-slate">
              <div>
                <p className="text-4xl font-display font-bold text-brand-orange">850+</p>
                <span className="text-xs text-gray-400 font-mono">{lang === 'TH' ? 'ครอบครัวที่ไว้วางใจให้ดูแล' : 'ACTIVE FAMILIES ADVISED'}</span>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-white">100%</p>
                <span className="text-xs text-gray-400 font-mono">{lang === 'TH' ? 'อัตราความพึงพอใจการบริการ' : 'CLIENT SATISFACTION SCORE'}</span>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-white">15+ YRS</p>
                <span className="text-xs text-gray-400 font-mono">{lang === 'TH' ? 'ประสบการณ์ที่ปรึกษาการเงินการลงทุน' : 'ADVISORY INDUSTRY EXCELLENCE'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Life & Health Protection */}
          <div className="lg:col-span-6 bg-white p-10 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-brand-orange">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-brand-charcoal">
                {lang === 'TH' ? 'การวางแผนประกันชีวิต สุขภาพ และโรคร้ายแรง' : 'Life, Health & Critical Illness Protection'}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {lang === 'TH'
                  ? 'วิเคราะห์และคัดกรองกรมธรรม์คุ้มครองความเสี่ยงภัยจากโรคภัยไข้เจ็บกะทันหัน และโรคร้ายแรง เพื่อโอนย้ายความเสี่ยงทางการเงินและปกป้องรายได้หลักของครอบครัว'
                  : 'Establish a custom safety net with optimal life, medical expense, and critical illness plans. We analyze multiple insurers to secure the highest coverage benefits.'}
              </p>
            </div>
            <div className="pt-6 border-t border-slate-50 text-xs font-mono text-gray-400">
              {lang === 'TH' ? 'ประกันชีวิต • ประกันสุขภาพพรีเมียม • คุ้มครองโรคร้ายแรง' : 'Life Protection • Healthcare Shield • Income Security'}
            </div>
          </div>

          {/* Card 4: Retirement and Children Education */}
          <div className="lg:col-span-6 bg-white p-10 rounded-xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-brand-orange">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-brand-charcoal">
                {lang === 'TH' ? 'วางแผนการเกษียณอายุและทุนการศึกษาบุตร' : 'Retirement Security & Child Education Funds'}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {lang === 'TH'
                  ? 'ออกแบบเป้าหมายทางการเงินระยะยาวเพื่อสร้างอิสรภาพในวัยเกษียณอย่างสุขสบาย พร้อมวางโครงสร้างกองทุนเพื่อสนับสนุนการศึกษาที่ดีที่สุดของลูกหลานอย่างอุ่นใจ'
                  : 'Structure dedicated compounding plans to guarantee comfortable, independent golden years, alongside customized saving models to lock in premium education tracks for your children.'}
              </p>
            </div>
            <div className="pt-6 border-t border-slate-50 text-xs font-mono text-gray-400">
              {lang === 'TH' ? 'กองทุนออมบำนาญ • ทุนการศึกษาหลักล้าน • เป้าหมายเกษียณสุขสบาย' : 'Retirement Wealth • Child Education Trusts • Future Target Savings'}
            </div>
          </div>

        </div>
      </section>

      {/* 2.5 WealthPro Platform Showcase (คอมโพเนนต์กลาง ใช้ร่วมกับหน้าแรก) */}
      <WealthProShowcase lang={lang} setActiveTab={setActiveTab} />

      {/* 3. Our Workflow (Dark Section) */}
      <section className="bg-brand-charcoal text-white py-24 my-16 border-y border-brand-slate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-brand-orange text-xs font-mono font-semibold tracking-widest uppercase block">
              {lang === 'TH' ? 'กระบวนการวางแผนการเงินระดับวิชาชีพ' : 'OUR PROFESSIONAL WORKFLOW'}
            </span>
            <h2 className="font-serif text-3.5xl font-semibold text-white tracking-tight">
              {lang === 'TH' ? 'กระบวนการวางแผนการเงินมาตรฐานสากล 6 ขั้นตอน' : 'Our 6-Step Professional Planning Standard'}
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              {lang === 'TH'
                ? 'เรายึดมั่นในมาตรฐานจรรยาบรรณวิชาชีพและกระบวนการทำงานที่เป็นระบบสากลของสมาคมนักวางแผนการเงิน เพื่อให้คุณมั่นใจว่าแผนการเงินของคุณนั้นเป็นกลาง ปลอดภัย และมีคุณภาพสูงสุดอย่างแท้จริง'
                : 'Meticulous professional execution is the hallmark of Ultimate life Advisor. We guide your wealth and risk strategy with structured international planning standards.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="workflow-steps-container">
            {workflowSteps.map((step) => (
              <div key={step.num} className="bg-brand-slate/60 p-8 rounded-xl border border-brand-slate flex flex-col justify-between min-h-[220px] relative hover:border-brand-orange transition-colors">
                <span className="font-mono text-4xl text-brand-orange/20 font-bold absolute top-4 right-4">{step.num}</span>
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-lg text-white">
                    {lang === 'TH' ? step.titleTh : step.titleEn}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {lang === 'TH' ? step.descTh : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Mini Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <h3 className="font-serif text-3xl font-semibold text-brand-charcoal">
          {lang === 'TH' ? 'พร้อมเริ่มวางแผนการเงินกับที่ปรึกษาของคุณแล้วหรือยัง?' : 'Ready to start planning with an advisor?'}
        </h3>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          {lang === 'TH'
            ? 'นัดหมายพูดคุยกับที่ปรึกษาการเงินของเรา เพื่อวิเคราะห์เป้าหมาย จัดสรรพอร์ต และวางแผนคุ้มครองที่เหมาะกับคุณโดยเฉพาะ'
            : 'Book a session with our financial advisor to review your goals, structure your portfolio, and build a protection plan tailored to you.'}
        </p>

        <div className="flex justify-center pt-4">
          <button
            onClick={() => setActiveTab(ActiveTab.Contact)}
            className="bg-brand-charcoal text-white hover:bg-black px-8 py-4 rounded-lg font-display font-semibold text-xs tracking-wider transition-all uppercase flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4 text-brand-orange" />
            <span>{lang === 'TH' ? 'นัดหมายที่ปรึกษาการเงิน' : 'BOOK A FINANCIAL ADVISOR'}</span>
          </button>
        </div>
      </section>

    </motion.div>
  );
}
