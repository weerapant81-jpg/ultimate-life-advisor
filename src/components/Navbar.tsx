import React from 'react';
import { ActiveTab } from '../types';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';
import SocialLinks from './SocialLinks';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: 'EN' | 'TH';
  setLang: (lang: 'EN' | 'TH') => void;
}

export default function Navbar({ activeTab, setActiveTab, lang, setLang }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBlogSearch = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('focusBlogSearch', 'true');
    }
    setActiveTab(ActiveTab.Blog);
  };

  const navigationItems = [
    { id: ActiveTab.Home, labelEn: 'Home', labelTh: 'หน้าแรก' },
    { id: ActiveTab.Services, labelEn: 'Services', labelTh: 'บริการ' },
    { id: ActiveTab.AboutUs, labelEn: 'About Us', labelTh: 'เกี่ยวกับเรา' },
    { id: ActiveTab.Blog, labelEn: 'News & Articles', labelTh: 'ข่าวและบทความ' },
    // เกมเศรษฐี ซ่อนจากเมนูหลัก — ยังเข้าได้ทาง #/game และปุ่มในหน้า "บริการ"
    { id: ActiveTab.Contact, labelEn: 'Contact', labelTh: 'ติดต่อเรา' },
  ];

  const isBlogBrand = activeTab === ActiveTab.Blog;

  return (
    <header className={`sticky top-0 z-50 w-full transition-colors duration-300 border-b ${
      isBlogBrand 
        ? 'bg-brand-dark/95 border-brand-slate text-white' 
        : 'bg-white/95 border-slate-100 text-brand-charcoal shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand Selector */}
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab(ActiveTab.Home)}
              className="flex items-center cursor-pointer"
            >
              <Logo light={isBlogBrand} size="md" />
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center" id="desktop-nav">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? isBlogBrand
                        ? 'text-brand-orange'
                        : 'text-brand-charcoal font-semibold'
                      : isBlogBrand
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  {isActive && !isBlogBrand && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-orange"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {isActive && isBlogBrand && (
                    <motion.div
                      layoutId="activeIndicatorBlog"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-orange"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {lang === 'TH' ? item.labelTh : item.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <SocialLinks variant={isBlogBrand ? 'light' : 'dark'} />

            <button
              type="button"
              onClick={() => {
                openBlogSearch();
              }}
              className={`h-9 w-9 rounded-full border flex items-center justify-center transition-colors ${
                isBlogBrand
                  ? 'border-brand-slate text-gray-300 hover:text-white hover:bg-brand-slate'
                  : 'border-slate-200 text-gray-500 hover:text-brand-orange hover:border-brand-orange'
              }`}
              aria-label={lang === 'TH' ? 'ค้นหาบทความ' : 'Search articles'}
              title={lang === 'TH' ? 'ค้นหาบทความ' : 'Search articles'}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'TH' : 'EN')}
              id="lang-toggle-btn"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-display font-medium transition-colors ${
                isBlogBrand
                  ? 'border border-brand-slate text-gray-300 hover:bg-brand-slate'
                  : 'border border-slate-200 text-gray-600 hover:bg-slate-50'
              }`}
            >
              <span>{lang}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(ActiveTab.Contact)}
              id="header-cta-btn"
              className={`px-5 py-2.5 rounded-lg text-xs font-display font-semibold tracking-wider transition-all uppercase ${
                isBlogBrand
                  ? 'bg-brand-orange text-white hover:bg-brand-orange/90'
                  : 'bg-brand-charcoal text-white hover:bg-black'
              }`}
            >
              {lang === 'TH' ? 'นัดหมายที่ปรึกษา' : 'BOOK CONSULTATION'}
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setLang(lang === 'EN' ? 'TH' : 'EN')}
              className={`px-2 py-1 rounded text-xs font-mono border ${
                isBlogBrand ? 'border-brand-slate text-white' : 'border-slate-200 text-brand-charcoal'
              }`}
            >
              {lang}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-toggle"
              className={`p-2 rounded-lg ${
                isBlogBrand ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-brand-charcoal'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id="mobile-nav-panel"
          className={`md:hidden border-t px-4 pt-2 pb-6 space-y-1 ${
            isBlogBrand ? 'bg-brand-dark border-brand-slate' : 'bg-white border-slate-100'
          }`}
        >
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-3 rounded-lg text-base font-medium ${
                activeTab === item.id
                  ? isBlogBrand
                    ? 'text-brand-orange bg-brand-slate'
                    : 'text-black bg-slate-50 font-semibold'
                  : isBlogBrand
                    ? 'text-gray-300 hover:bg-brand-slate'
                    : 'text-gray-600 hover:bg-slate-50'
              }`}
            >
              {lang === 'TH' ? item.labelTh : item.labelEn}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 dark:border-brand-slate flex flex-col space-y-3">
            <SocialLinks variant={isBlogBrand ? 'light' : 'dark'} size="md" className="justify-center pb-2" />
            <button
              onClick={() => {
                openBlogSearch();
                setIsOpen(false);
              }}
              className={`w-full py-3 rounded-lg text-center text-sm font-semibold inline-flex items-center justify-center gap-2 ${
                isBlogBrand ? 'border border-brand-slate text-gray-200' : 'border border-slate-200 text-brand-charcoal'
              }`}
            >
              <Search className="w-4 h-4" />
              {lang === 'TH' ? 'ค้นหาบทความ' : 'Search articles'}
            </button>
            <button
              onClick={() => {
                setActiveTab(ActiveTab.Contact);
                setIsOpen(false);
              }}
              className={`w-full py-3 rounded-lg text-center text-sm font-semibold tracking-wider uppercase ${
                isBlogBrand ? 'bg-brand-orange text-white' : 'bg-brand-charcoal text-white'
              }`}
            >
              {lang === 'TH' ? 'นัดหมายปรึกษา' : 'BOOK CONSULTATION'}
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
