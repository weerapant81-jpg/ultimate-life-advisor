import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ActiveTab, ImageSettings, LegalPageType } from './types';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import SocialLinks from './components/SocialLinks';
import { ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const HomeView = lazy(() => import('./components/HomeView'));
const ServicesView = lazy(() => import('./components/ServicesView'));
const AboutUsView = lazy(() => import('./components/AboutUsView'));
const BlogView = lazy(() => import('./components/BlogView'));
const ContactAndPlanner = lazy(() => import('./components/ContactAndPlanner'));
const GameView = lazy(() => import('./components/GameView'));
const ImageAdminView = lazy(() => import('./components/ImageAdminView'));
const LegalView = lazy(() => import('./components/LegalView'));

type CookieConsent = 'accepted' | 'declined';
const COOKIE_CONSENT_KEY = 'ultimate-life-advisor-cookie-consent';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Home);
  const [lang, setLang] = useState<'EN' | 'TH'>('TH');
  const [imageSettings, setImageSettings] = useState<ImageSettings>({});
  const [legalPage, setLegalPage] = useState<LegalPageType>('privacy');
  const pageTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

  // Quick feedback email subscription
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubscribed, setFooterSubscribed] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsent | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      return saved === 'accepted' || saved === 'declined' ? saved : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let active = true;
    const loadImageSettings = async () => {
      const { fetchImageSettings } = await import('./lib/firebase');
      const settings = await fetchImageSettings();
      if (active) setImageSettings(settings);
    };
    loadImageSettings();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const applyHashRoute = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setActiveTab(ActiveTab.Home);
        return;
      }

      if (hash.startsWith('legal/')) {
        const page = hash.split('/')[1] as LegalPageType;
        if (['privacy', 'terms', 'disclaimer'].includes(page)) {
          setLegalPage(page);
          setActiveTab(ActiveTab.Legal);
        }
        return;
      }

      if (hash.startsWith('blog/')) {
        setActiveTab(ActiveTab.Blog);
        return;
      }

      if (hash.startsWith('advisor/')) {
        setActiveTab(ActiveTab.AboutUs);
        return;
      }

      const routeMap: Record<string, ActiveTab> = {
        services: ActiveTab.Services,
        about: ActiveTab.AboutUs,
        blog: ActiveTab.Blog,
        game: ActiveTab.Game,
        contact: ActiveTab.Contact,
        'admin/images': ActiveTab.ImageAdmin,
      };
      if (routeMap[hash]) setActiveTab(routeMap[hash]);
    };

    applyHashRoute();
    window.addEventListener('hashchange', applyHashRoute);
    return () => window.removeEventListener('hashchange', applyHashRoute);
  }, []);

  useEffect(() => {
    const tabHash: Partial<Record<ActiveTab, string>> = {
      [ActiveTab.Home]: '#/',
      [ActiveTab.Services]: '#/services',
      [ActiveTab.AboutUs]: '#/about',
      [ActiveTab.Blog]: '#/blog',
      [ActiveTab.Game]: '#/game',
      [ActiveTab.Contact]: '#/contact',
      [ActiveTab.ImageAdmin]: '#/admin/images',
      [ActiveTab.Legal]: `#/legal/${legalPage}`,
    };
    const nextHash = tabHash[activeTab];
    const currentHash = window.location.hash;
    const shouldKeepNestedRoute =
      (activeTab === ActiveTab.Blog && currentHash.startsWith('#/blog/')) ||
      (activeTab === ActiveTab.AboutUs && currentHash.startsWith('#/advisor/'));

    if (nextHash && !shouldKeepNestedRoute) {
      window.history.replaceState(null, '', nextHash);
    }
  }, [activeTab, legalPage]);

  useEffect(() => {
    const pageMeta: Record<ActiveTab, { title: string; description: string; hash: string }> = {
      [ActiveTab.Home]: {
        title: lang === 'TH' ? 'Ultimate Life Advisor | วางแผนการเงินเพื่อชีวิตในแบบที่คุณเลือก' : 'Ultimate Life Advisor | Financial Planning for the Life You Choose',
        description: lang === 'TH'
          ? 'ที่ปรึกษาวางแผนการเงิน ประกันชีวิต สุขภาพ การลงทุน เกษียณ และทุนการศึกษาบุตร พร้อมบริการนัดหมายปรึกษา'
          : 'Financial planning, life and health protection, investment, retirement, and education funding advisory services.',
        hash: '#/',
      },
      [ActiveTab.Services]: {
        title: lang === 'TH' ? 'บริการวางแผนการเงิน | Ultimate Life Advisor' : 'Financial Planning Services | Ultimate Life Advisor',
        description: lang === 'TH' ? 'บริการวางแผนการลงทุน ประกันชีวิต สุขภาพ เกษียณ ภาษี และการดูแลแผนครอบครัวแบบครบวงจร' : 'Explore comprehensive investment, insurance, retirement, tax, and family financial planning services.',
        hash: '#/services',
      },
      [ActiveTab.AboutUs]: {
        title: lang === 'TH' ? 'เกี่ยวกับเรา | Ultimate Life Advisor' : 'About Us | Ultimate Life Advisor',
        description: lang === 'TH' ? 'รู้จักผู้ก่อตั้ง ทีมที่ปรึกษา และแนวทางการดูแลลูกค้าของ Ultimate Life Advisor' : 'Meet the founders, advisors, and client-centered planning approach of Ultimate Life Advisor.',
        hash: '#/about',
      },
      [ActiveTab.Blog]: {
        title: lang === 'TH' ? 'ข่าวและบทความการเงิน | Ultimate Life Advisor' : 'Financial News and Articles | Ultimate Life Advisor',
        description: lang === 'TH' ? 'บทความสองภาษาเกี่ยวกับการลงทุน ประกันชีวิต สุขภาพ ภาษี เกษียณ และการวางแผนการเงินครอบครัว' : 'Bilingual articles on investing, insurance, health protection, tax, retirement, and family financial planning.',
        hash: '#/blog',
      },
      [ActiveTab.Game]: {
        title: lang === 'TH' ? 'เกมเศรษฐี จำลองชีวิตการเงิน 30 ปี | Ultimate Life Advisor' : 'Money Life Game — 30-Year Financial Simulation | Ultimate Life Advisor',
        description: lang === 'TH'
          ? 'เล่นเกมจำลองชีวิตการเงิน 30 ปี เลือกอาชีพ รับมือเหตุการณ์ไม่คาดฝัน แล้วดูว่าคุณจะเกษียณได้จริงไหม ฟรี ไม่ต้องสมัครสมาชิก'
          : 'Play a 30-year financial life simulation. Pick a career, face life events, and find out if you can really retire. Free, no sign-up.',
        hash: '#/game',
      },
      [ActiveTab.Contact]: {
        title: lang === 'TH' ? 'ติดต่อและนัดหมายที่ปรึกษา | Ultimate Life Advisor' : 'Contact and Book an Advisor | Ultimate Life Advisor',
        description: lang === 'TH' ? 'ทดลองคำนวณแผนการเงินและนัดหมายที่ปรึกษา Ultimate Life Advisor' : 'Use planning calculators and book a consultation with Ultimate Life Advisor.',
        hash: '#/contact',
      },
      [ActiveTab.Legal]: {
        title: lang === 'TH' ? 'นโยบายและเงื่อนไข | Ultimate Life Advisor' : 'Policies and Terms | Ultimate Life Advisor',
        description: lang === 'TH' ? 'นโยบายความเป็นส่วนตัว เงื่อนไขการใช้บริการ และคำเตือนความเสี่ยงของ Ultimate Life Advisor' : 'Privacy policy, terms of service, and risk disclaimer for Ultimate Life Advisor.',
        hash: `#/legal/${legalPage}`,
      },
      [ActiveTab.ImageAdmin]: {
        title: lang === 'TH' ? 'ระบบจัดการรูปภาพ | Ultimate Life Advisor' : 'Image Management | Ultimate Life Advisor',
        description: lang === 'TH' ? 'ระบบหลังบ้านสำหรับจัดการรูปภาพเว็บไซต์' : 'Admin image management for website assets.',
        hash: '#/admin/images',
      },
    };

    const meta = pageMeta[activeTab] ?? pageMeta[ActiveTab.Home];
    document.title = meta.title;
    const canonicalUrl = `${window.location.origin}/${meta.hash}`;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', meta.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', activeTab === ActiveTab.Blog ? 'article' : 'website');
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', `${window.location.origin}/images/hero-financial-planning.png`);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="robots"]', 'name', 'robots', activeTab === ActiveTab.ImageAdmin ? 'noindex,nofollow' : 'index,follow');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [activeTab, lang, legalPage]);

  // Render correct view based on active state
  const renderActiveView = () => {
    switch (activeTab) {
      case ActiveTab.Home:
        return <HomeView setActiveTab={setActiveTab} lang={lang} imageSettings={imageSettings} />;
      case ActiveTab.Services:
        return <ServicesView setActiveTab={setActiveTab} lang={lang} imageSettings={imageSettings} />;
      case ActiveTab.AboutUs:
        return <AboutUsView setActiveTab={setActiveTab} lang={lang} imageSettings={imageSettings} />;
      case ActiveTab.Blog:
        return <BlogView lang={lang} imageSettings={imageSettings} setActiveTab={setActiveTab} />;
      case ActiveTab.Game:
        return <GameView lang={lang} setActiveTab={setActiveTab} />;
      case ActiveTab.Contact:
        return <ContactAndPlanner lang={lang} />;
      case ActiveTab.Legal:
        return <LegalView lang={lang} page={legalPage} setActiveTab={setActiveTab} />;
      case ActiveTab.ImageAdmin:
        return <ImageAdminView lang={lang} imageSettings={imageSettings} onImageSettingsChange={setImageSettings} setActiveTab={setActiveTab} />;
      default:
        return <HomeView setActiveTab={setActiveTab} lang={lang} imageSettings={imageSettings} />;
    }
  };

  const handleFooterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerEmail.trim()) {
      setFooterSubscribed(true);
      setTimeout(() => {
        setFooterSubscribed(false);
        setFooterEmail('');
      }, 3000);
    }
  };

  const isBlogBrand = activeTab === ActiveTab.Blog;
  const footerCopy = lang === 'TH'
    ? {
        brandDescription: 'เราให้บริการคำปรึกษา ออกแบบแผนการเงิน การคุ้มครองชีวิตและสุขภาพ การออมเพื่อเกษียณ และการลงทุนอย่างเป็นระบบ เพื่อส่งต่อความมั่งคั่งอย่างมั่นคงที่สุด',
        sectionTitle: 'บริการและข้อมูล',
        investment: 'วางแผนการลงทุน',
        insurance: 'ประกันชีวิตและสุขภาพ',
        retirementTax: 'วางแผนเกษียณและภาษี',
        advisorArticles: 'บทความความรู้จากที่ปรึกษา',
        newsletterTitle: 'จดหมายข่าวการเงินรายสัปดาห์',
        newsletterDescription: 'รับสรุปความรู้ด้านเศรษฐกิจ การวางแผนภาษี ประกันชีวิต สุขภาพ และกลยุทธ์การเงินครอบครัวจากทีมที่ปรึกษาของเรา',
        riskDisclosure: 'คำเตือนความเสี่ยง: การวางแผนการเงิน การลงทุน และการทำประกันควรพิจารณาจากเป้าหมาย ฐานะการเงิน ความสามารถในการรับความเสี่ยง และเงื่อนไขของผลิตภัณฑ์อย่างรอบคอบ ผลการดำเนินงานในอดีตไม่ใช่สิ่งยืนยันผลลัพธ์ในอนาคต',
        copyright: '(c) 2026 Ultimate Life Advisor Group. All rights reserved.',
      }
    : {
        brandDescription: 'Providing elite multi-family asset advisory, smart structural trust architectures, and risk mitigation models matching institutional metrics.',
        sectionTitle: 'PRACTICE AREAS',
        investment: 'Portfolio Management',
        insurance: 'Family Trust Securities',
        retirementTax: 'Cross-border Asset Valuations',
        advisorArticles: 'Ultimate Advisor Blog',
        newsletterTitle: 'FINANCIAL RIGOR BULLETIN',
        newsletterDescription: 'Receive curated sovereign risk briefings, inflation indicators, and tax updates.',
        riskDisclosure: 'Regulatory Disclosure: Ultimate Life Advisor provides financial planning information for educational purposes. Bespoke asset allocation, insurance, and alternative structures involve market and product risks, including possible loss of capital or insufficient coverage.',
        copyright: '(c) 2026 Ultimate Life Advisor Group. All rights reserved.',
      };

  const openLegalPage = (page: LegalPageType) => {
    setLegalPage(page);
    setActiveTab(ActiveTab.Legal);
    window.location.hash = `#/legal/${page}`;
  };

  const saveCookieConsent = (value: CookieConsent) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      // If storage is blocked, hide the banner for this session.
    }
    setCookieConsent(value);
  };

  const cookieCopy = lang === 'TH'
    ? {
        title: 'เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์',
        description: 'เว็บไซต์นี้ใช้คุกกี้ที่จำเป็นสำหรับการทำงานของเว็บ การจดจำภาษา และการปรับปรุงประสบการณ์ใช้งานของคุณ',
        privacy: 'นโยบายความเป็นส่วนตัว',
        decline: 'ปฏิเสธ',
        accept: 'ยอมรับ',
      }
    : {
        title: 'We use cookies to improve your experience',
        description: 'This website uses essential cookies for site functionality, language preferences, and a smoother browsing experience.',
        privacy: 'Privacy Policy',
        decline: 'Decline',
        accept: 'Accept',
      };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isBlogBrand ? 'bg-brand-dark' : 'bg-brand-cream'
    }`}>
      
      {/* 1. Header & Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        setLang={setLang} 
      />

      {/* 2. Main Visual Area (With framer motion transition key) */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={pageTransition}
          >
            <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-500">Loading...</div>}>
              {renderActiveView()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Global Premium Footer */}
      <footer className="border-t py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-brand-dark border-brand-slate text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Col 1: Branding & Philosophy */}
          <div className="md:col-span-4 space-y-6">
            <Logo light size="md" />

            <p className="text-[16.8px] text-gray-400 font-sans leading-relaxed max-w-sm">
              {footerCopy.brandDescription}
            </p>
            
            <p className="hidden">
              {lang === 'TH'
                ? 'เน€เธฃเธฒเนเธซเนเธเธฃเธดเธเธฒเธฃเธเธณเธเธฃเธถเธเธฉเธฒ เธญเธญเธเนเธเธเนเธเธฃเธเธชเธฃเนเธฒเธเธชเธดเธเธ—เธฃเธฑเธเธขเน เนเธฅเธฐเธงเธดเธเธฑเธขเธเธฅเธขเธธเธ—เธเนเน€เธเธดเธเธชเธ–เธดเธ•เธดเธฃเธฐเธ”เธฑเธเธกเธฒเธ•เธฃเธเธฒเธเธชเธฒเธเธฅเน€เธเธทเนเธญเธเธฒเธฃเธชเนเธเธ•เนเธญเธเธงเธฒเธกเธกเธฑเนเธเธเธฑเนเธเธญเธขเนเธฒเธเธกเธฑเนเธเธเธเธ—เธตเนเธชเธธเธ”'
                : 'Providing elite multi-family asset advisory, smart structural trust architectures, and risk mitigation models matching institutional metrics.'}
            </p>

            <div className="flex items-center space-x-4 text-gray-400">
              <span className="text-[14px] font-mono text-gray-400 flex items-center space-x-1 border border-brand-slate px-2.5 py-1 rounded">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>SECURE CLIENT DATA</span>
              </span>
            </div>
            <button
              onClick={() => setActiveTab(ActiveTab.ImageAdmin)}
              className="inline-flex rounded border border-brand-slate px-3 py-1.5 text-[14px] font-mono text-gray-400 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              {lang === 'TH' ? 'จัดการรูปภาพ' : 'Image management'}
            </button>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-semibold text-[16.8px] tracking-wider uppercase text-gray-400">
              {footerCopy.sectionTitle}
            </h4>
            <ul className="space-y-2 text-[16.8px] font-mono">
              <li>
                <button onClick={() => setActiveTab(ActiveTab.Services)} className="hover:text-brand-orange text-gray-500 transition-colors">
                  {footerCopy.investment}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab(ActiveTab.Services)} className="hover:text-brand-orange text-gray-500 transition-colors">
                  {footerCopy.insurance}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab(ActiveTab.Services)} className="hover:text-brand-orange text-gray-500 transition-colors">
                  {footerCopy.retirementTax}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab(ActiveTab.Blog)} className="hover:text-brand-orange text-gray-500 transition-colors">
                  {footerCopy.advisorArticles}
                </button>
              </li>
            </ul>
            <div className="hidden">
            <h4 className="font-display font-semibold text-[16.8px] tracking-wider uppercase text-gray-400">
              {lang === 'TH' ? 'เธซเธเนเธฒเธเธฃเธดเธเธฒเธฃเนเธฅเธฐเธเนเธญเธกเธนเธฅ' : 'PRACTICE AREAS'}
            </h4>
            <ul className="space-y-2 text-[16.8px] font-mono">
              <li>
                <button onClick={() => setActiveTab(ActiveTab.Services)} className="hover:text-brand-orange text-gray-500 transition-colors">
                  {lang === 'TH' ? 'เธเธฅเธขเธธเธ—เธเนเธเธฑเธ”เธเธญเธฃเนเธ•เนเธเธฅเธดเนเธญ' : 'Portfolio Management'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab(ActiveTab.Services)} className="hover:text-brand-orange text-gray-500 transition-colors">
                  {lang === 'TH' ? 'เนเธเธฃเธเธชเธฃเนเธฒเธเธ—เธฃเธฑเธชเธ•เนเนเธฅเธฐเธเธดเธเธฑเธขเธเธฃเธฃเธก' : 'Family Trust Securities'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab(ActiveTab.Services)} className="hover:text-brand-orange text-gray-500 transition-colors">
                  {lang === 'TH' ? 'เธเธฒเธฃเธเธฃเธฐเน€เธกเธดเธเธกเธนเธฅเธเนเธฒเธชเธดเธเธ—เธฃเธฑเธเธขเนเธเนเธฒเธกเนเธ”เธ' : 'Cross-border Asset Valuations'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab(ActiveTab.Blog)} className="hover:text-brand-orange text-gray-500 transition-colors">
                  {lang === 'TH' ? 'เธเธฅเนเธญเธเธเธงเธฒเธกเธฃเธนเนเธเธญเธเธ—เธตเนเธเธฃเธถเธเธฉเธฒ' : 'Ultimate Advisor Blog'}
                </button>
              </li>
            </ul>
          </div>
          </div>

          {/* Col 3: Quick newsletter / feedback */}
          <div className="md:col-span-5 space-y-6">
            <h4 className="font-display font-semibold text-[16.8px] tracking-wider uppercase text-gray-400">
              {footerCopy.newsletterTitle}
            </h4>

            <p className="text-[16.8px] text-gray-400 leading-relaxed font-sans">
              {footerCopy.newsletterDescription}
            </p>

            <div className="hidden">
            <h4 className="font-display font-semibold text-[16.8px] tracking-wider uppercase text-gray-400">
              {lang === 'TH' ? 'เธเธ”เธซเธกเธฒเธขเธงเธดเธเธฑเธขเธ•เธฅเธฒเธ”เธฃเธฒเธขเธชเธฑเธเธ”เธฒเธซเน' : 'FINANCIAL RIGOR BULLETIN'}
            </h4>
            
            <p className="text-[16.8px] text-gray-500 leading-relaxed font-sans">
              {lang === 'TH'
                ? 'เธฃเธฑเธเธชเธฃเธธเธเธเธฃเธฐเธกเธงเธฅเธเธฅเน€เธจเธฃเธฉเธเธเธดเธเนเธฅเธฐเน€เธ—เธเธเธดเธเธเธฃเธดเธซเธฒเธฃเธ เธฒเธฉเธตเธเนเธฒเธกเธชเธฑเธเธเธฒเธ•เธดเธเธฒเธเธเนเธฒเธขเธงเธดเธเธฑเธข'
                : 'Receive curated sovereign risk briefings, inflation indicators, and tax updates.'}
            </p>

            </div>

            <form onSubmit={handleFooterSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="investor@domain.com"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                className="flex-1 rounded px-3 py-2 text-[16.8px] focus:outline-hidden focus:border-brand-orange bg-brand-slate text-white border-brand-slate"
              />
              <button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-4 py-2 rounded text-[16.8px] tracking-wider uppercase font-display"
              >
                {footerSubscribed ? <Check className="w-3.5 h-3.5" /> : 'SUBSCRIBE'}
              </button>
            </form>
          </div>

        </div>

        {/* Regulatory Disclaimers & Copyright */}
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-100 dark:border-brand-slate text-[14px] text-gray-400 space-y-4">
          <p className="font-sans leading-relaxed text-center md:text-left">
            {footerCopy.riskDisclosure}
          </p>
          <p className="hidden">
            {lang === 'TH'
              ? 'เธเธณเน€เธ•เธทเธญเธเธเธงเธฒเธกเน€เธชเธตเนเธขเธ: เธเธฒเธฃเธฅเธเธ—เธธเธเนเธเธชเธดเธเธ—เธฃเธฑเธเธขเนเธ—เธฒเธเธเธฒเธฃเน€เธเธดเธเนเธฅเธฐเธ•เธฃเธฒเธชเธฒเธฃเธญเธเธธเธเธฑเธเธเนเธกเธตเธเธงเธฒเธกเน€เธชเธตเนเธขเธเธชเธนเธ เธเธนเนเธฅเธเธ—เธธเธเธเธงเธฃเธ—เธณเธเธงเธฒเธกเน€เธเนเธฒเนเธเธฅเธฑเธเธฉเธ“เธฐเธชเธฑเธเธเธฒเธชเธดเธ—เธเธด เธเธฅเธ•เธญเธเนเธ—เธ เนเธฅเธฐเธชเธ เธฒเธงเธฐเธเธงเธฒเธกเน€เธชเธตเนเธขเธเธญเธขเนเธฒเธเธ–เธตเนเธ–เนเธงเธเธเนเธญเธเธ•เธฑเธ”เธชเธดเธเนเธเธฅเธเธ—เธธเธ เธเธฃเธฐเธชเธดเธ—เธเธดเธ เธฒเธเธเธฅเธเธฒเธเนเธเธญเธ”เธตเธ•เธกเธดเนเธ”เนเน€เธเนเธเธ•เธฑเธงเธขเธทเธเธขเธฑเธเธซเธฃเธทเธญเธเธฒเธฃเธฑเธเธ•เธตเธเธฅเธ•เธญเธเนเธ—เธเนเธเธญเธเธฒเธเธ•'
              : 'Regulatory Disclosure: Ultimate life Advisor (Singapore) Pte Ltd is a Capital Markets Services license holder regulated by the Monetary Authority of Singapore (MAS). Bespoke asset allocation architectures and alternative structures involve significant market risks including loss of initial capital.'}
          </p>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-[14px] text-gray-400 font-mono gap-4 pt-2">
            <span>{footerCopy.copyright}</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:justify-end">
              <div className="flex space-x-4">
                <button type="button" onClick={() => openLegalPage('terms')} className="hover:underline">Terms</button>
                <button type="button" onClick={() => openLegalPage('privacy')} className="hover:underline">Privacy</button>
                <button type="button" onClick={() => openLegalPage('disclaimer')} className="hover:underline">Disclaimer</button>
              </div>
              <SocialLinks variant="light" size="md" className="sm:justify-end" />
            </div>
          </div>
        </div>
      </footer>

      {!cookieConsent && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6 lg:pr-28"
          role="dialog"
          aria-live="polite"
          aria-label={cookieCopy.title}
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex gap-3">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-brand-charcoal">
                  {cookieCopy.title}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {cookieCopy.description}{' '}
                  <button
                    type="button"
                    onClick={() => openLegalPage('privacy')}
                    className="font-semibold text-brand-orange underline-offset-4 hover:underline"
                  >
                    {cookieCopy.privacy}
                  </button>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => saveCookieConsent('declined')}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                {cookieCopy.decline}
              </button>
              <button
                type="button"
                onClick={() => saveCookieConsent('accepted')}
                className="rounded-lg bg-brand-charcoal px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-black"
              >
                {cookieCopy.accept}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
