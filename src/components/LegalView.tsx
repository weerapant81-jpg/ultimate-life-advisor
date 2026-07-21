import React from 'react';
import { ActiveTab, LegalPageType } from '../types';
import { ArrowLeft, FileText, LockKeyhole, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface LegalViewProps {
  lang: 'EN' | 'TH';
  page: LegalPageType;
  setActiveTab: (tab: ActiveTab) => void;
}

const legalCopy = {
  privacy: {
    icon: LockKeyhole,
    thTitle: 'นโยบายความเป็นส่วนตัว',
    enTitle: 'Privacy Policy',
    thIntro: 'นโยบายนี้อธิบายวิธีที่ Ultimate Life Advisor (ผู้ควบคุมข้อมูลส่วนบุคคล) เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่าน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ข้อมูลที่ท่านส่งผ่านแบบฟอร์มจะใช้เพื่อการติดต่อกลับและให้คำปรึกษาตามที่ท่านร้องขอเท่านั้น',
    enIntro: 'This policy explains how Ultimate Life Advisor (the data controller) collects, uses, and discloses your personal data in accordance with Thailand\'s Personal Data Protection Act B.E. 2562 (PDPA). Information you submit through our forms is used only to contact you and provide the advisory services you request.',
    thPoints: [
      'ข้อมูลที่จัดเก็บ: ชื่อ-นามสกุล อีเมล วันที่ต้องการนัดหมาย หัวข้อที่สนใจ และข้อความ/หมายเหตุที่ท่านกรอกในแบบฟอร์มนัดหมาย',
      'วัตถุประสงค์และฐานทางกฎหมาย: ใช้เพื่อติดต่อกลับ ยืนยันการนัดหมาย และให้คำปรึกษา โดยอาศัย “ความยินยอม” ที่ท่านให้ไว้ก่อนส่งแบบฟอร์ม',
      'การเปิดเผยต่อผู้ให้บริการภายนอก: คำขอนัดหมายถูกส่งเป็นอีเมลผ่านผู้ให้บริการ (Resend) และเว็บไซต์/ฐานข้อมูลเนื้อหาใช้บริการ (Google Firebase) เราไม่จำหน่ายหรือเปิดเผยข้อมูลเพื่อการตลาดแก่บุคคลภายนอกโดยไม่ได้รับความยินยอม',
      'ระยะเวลาจัดเก็บ: เก็บข้อมูลนัดหมายเท่าที่จำเป็นต่อการติดต่อและให้บริการ และจะลบเมื่อหมดความจำเป็นหรือเมื่อท่านถอนความยินยอม',
      'สิทธิของเจ้าของข้อมูลตาม PDPA: ท่านมีสิทธิขอเข้าถึง/รับสำเนา แก้ไขให้ถูกต้อง ลบ ระงับการใช้ คัดค้านการประมวลผล ขอให้โอนย้ายข้อมูล และถอนความยินยอมได้ทุกเมื่อ',
      'การใช้สิทธิและการร้องเรียน: ติดต่อผู้ควบคุมข้อมูลที่ weerapan.aia@hotmail.com หรือโทร 099-4588787 (199/78 เดอะเวนิสปาร์ค อ.เมือง จ.นครราชสีมา 30000) หากไม่ได้รับการแก้ไข ท่านมีสิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC)'
    ],
    enPoints: [
      'Data we collect: full name, email, preferred appointment date, topic of interest, and any message/notes you enter in the appointment form.',
      'Purpose and legal basis: to contact you, confirm appointments, and provide advice, relying on the consent you give before submitting the form.',
      'Third-party processors: appointment requests are delivered by email via our provider (Resend); the website and content database use (Google Firebase). We do not sell or disclose your data to third parties for marketing without consent.',
      'Retention: appointment data is kept only as long as needed to contact you and provide the service, then deleted when no longer necessary or when you withdraw consent.',
      'Your rights under PDPA: you may access/obtain a copy, rectify, erase, restrict, object to processing, request data portability, and withdraw consent at any time.',
      'Exercising rights and complaints: contact the data controller at weerapan.aia@hotmail.com or 099-4588787 (199/78 The Venice Park, Mueang, Nakhonratchasima 30000). If unresolved, you may lodge a complaint with Thailand\'s Personal Data Protection Committee (PDPC).'
    ]
  },
  terms: {
    icon: FileText,
    thTitle: 'เงื่อนไขการใช้บริการ',
    enTitle: 'Terms of Service',
    thIntro: 'เนื้อหาในเว็บไซต์นี้จัดทำขึ้นเพื่อให้ข้อมูลเบื้องต้นด้านการวางแผนการเงิน ประกันชีวิต สุขภาพ และการออม ไม่ถือเป็นคำแนะนำเฉพาะบุคคลจนกว่าจะมีการประเมินข้อมูลของลูกค้าอย่างครบถ้วน',
    enIntro: 'This website provides general information about financial planning, life insurance, health protection, and savings. It is not individualized advice until a complete client assessment has been performed.',
    thPoints: [
      'ผู้ใช้ควรตรวจสอบความเหมาะสมของแผนกับเป้าหมาย ฐานะการเงิน และความสามารถในการรับความเสี่ยงของตนเอง',
      'ข้อมูลผลิตภัณฑ์และเงื่อนไขอาจเปลี่ยนแปลงตามบริษัทผู้ให้บริการและข้อกำหนดที่เกี่ยวข้อง',
      'การนัดหมายหรือส่งข้อมูลผ่านเว็บไซต์ไม่ได้เป็นการรับประกันผลตอบแทนหรือการอนุมัติผลิตภัณฑ์'
    ],
    enPoints: [
      'Users should evaluate suitability based on goals, financial position, and risk capacity.',
      'Product details and conditions may change according to providers and applicable rules.',
      'Booking or submitting information through the website does not guarantee returns or product approval.'
    ]
  },
  disclaimer: {
    icon: ShieldAlert,
    thTitle: 'คำเตือนความเสี่ยง',
    enTitle: 'Risk Disclaimer',
    thIntro: 'การวางแผนการเงิน การลงทุน และการทำประกันมีความเสี่ยงและเงื่อนไขเฉพาะบุคคล ผลลัพธ์ที่เกิดขึ้นจริงอาจแตกต่างจากประมาณการหรือข้อมูลตัวอย่างในเว็บไซต์',
    enIntro: 'Financial planning, investing, and insurance involve risks and individual conditions. Actual outcomes may differ from illustrations or examples shown on this website.',
    thPoints: [
      'ผลการดำเนินงานในอดีตไม่ใช่สิ่งยืนยันผลลัพธ์ในอนาคต',
      'เบี้ยประกัน ความคุ้มครอง และผลประโยชน์เป็นไปตามเงื่อนไขกรมธรรม์และการพิจารณาของบริษัทประกัน',
      'ควรศึกษารายละเอียดผลิตภัณฑ์และปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจ'
    ],
    enPoints: [
      'Past performance does not guarantee future results.',
      'Premiums, coverage, and benefits are subject to policy terms and insurer underwriting.',
      'Product details should be reviewed carefully with a qualified advisor before making decisions.'
    ]
  }
} satisfies Record<LegalPageType, {
  icon: React.ComponentType<{ className?: string }>;
  thTitle: string;
  enTitle: string;
  thIntro: string;
  enIntro: string;
  thPoints: string[];
  enPoints: string[];
}>;

export default function LegalView({ lang, page, setActiveTab }: LegalViewProps) {
  const copy = legalCopy[page];
  const Icon = copy.icon;
  const title = lang === 'TH' ? copy.thTitle : copy.enTitle;
  const intro = lang === 'TH' ? copy.thIntro : copy.enIntro;
  const points = lang === 'TH' ? copy.thPoints : copy.enPoints;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-brand-cream text-brand-charcoal">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <button
          type="button"
          onClick={() => setActiveTab(ActiveTab.Home)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'TH' ? 'กลับหน้าแรก' : 'Back home'}
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">{title}</h1>
            <p className="text-base md:text-lg leading-8 text-gray-600">{intro}</p>
          </div>

          <div className="space-y-4">
            {points.map((point) => (
              <div key={point} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                <p className="text-sm md:text-base leading-7 text-gray-700">{point}</p>
              </div>
            ))}
          </div>

          <p className="border-t border-slate-100 pt-6 text-sm leading-7 text-gray-500">
            {lang === 'TH'
              ? 'อัปเดตล่าสุด: 3 กรกฎาคม 2026 หากต้องการสอบถามเพิ่มเติม กรุณาติดต่อ Ultimate Life Advisor ผ่านช่องทางในหน้า ติดต่อเรา'
              : 'Last updated: July 3, 2026. For additional questions, please contact Ultimate Life Advisor through the Contact page.'}
          </p>
        </div>
      </section>
    </motion.div>
  );
}
