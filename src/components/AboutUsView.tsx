import React, { useEffect, useState } from 'react';
import { ActiveTab, ImageSettings, TeamMember } from '../types';
import { DEFAULT_ADVISOR_MEMBERS, FOUNDER_MEMBERS } from '../data';
import { Eye, Compass, Mail, Phone, MapPin, Calendar, ArrowLeft, Briefcase, GraduationCap, ShieldCheck, Link, Copy, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutUsViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  lang: 'EN' | 'TH';
  imageSettings?: ImageSettings;
}

interface AdvisorProfileProps {
  advisor: TeamMember;
  lang: 'EN' | 'TH';
  onBack: () => void;
  onContact: () => void;
}

const localizeAdvisor = (advisor: TeamMember, lang: 'EN' | 'TH'): TeamMember => {
  if (lang === 'TH') {
    return {
      ...advisor,
      name: advisor.nameTh || advisor.name,
      role: advisor.roleTh || advisor.role,
      bio: advisor.bioTh || advisor.bio,
      specialty: advisor.specialtyTh || advisor.specialty,
      location: advisor.locationTh || advisor.location,
      profileSummary: advisor.profileSummaryTh || advisor.profileSummary,
      biography: advisor.biographyTh?.length ? advisor.biographyTh : advisor.biography,
      philosophy: advisor.philosophyTh || advisor.philosophy,
      experience: advisor.experienceTh?.length ? advisor.experienceTh : advisor.experience,
      education: advisor.educationTh?.length ? advisor.educationTh : advisor.education,
      credentials: advisor.credentialsTh?.length ? advisor.credentialsTh : advisor.credentials,
    };
  }

  return {
    ...advisor,
    name: advisor.nameEn || advisor.name,
    role: advisor.roleEn || advisor.role,
    bio: advisor.bioEn || advisor.bio,
    specialty: advisor.specialtyEn || advisor.specialty,
    location: advisor.locationEn || advisor.location,
    profileSummary: advisor.profileSummaryEn || advisor.profileSummary,
    biography: advisor.biographyEn?.length ? advisor.biographyEn : advisor.biography,
    philosophy: advisor.philosophyEn || advisor.philosophy,
    experience: advisor.experienceEn?.length ? advisor.experienceEn : advisor.experience,
    education: advisor.educationEn?.length ? advisor.educationEn : advisor.education,
    credentials: advisor.credentialsEn?.length ? advisor.credentialsEn : advisor.credentials,
  };
};

function AdvisorProfile({ advisor, lang, onBack, onContact }: AdvisorProfileProps) {
  const isThai = lang === 'TH';
  const bioTitle = advisor.name;
  const [copied, setCopied] = useState(false);
  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#/advisor/${encodeURIComponent(advisor.id)}`
    : `#/advisor/${advisor.id}`;
  const shareText = isThai
    ? `โปรไฟล์ที่ปรึกษา ${advisor.name} | Ultimate Life Advisor`
    : `${advisor.name} advisor profile | Ultimate Life Advisor`;
  const encodedProfileUrl = encodeURIComponent(profileUrl);

  const handleCopyProfile = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(isThai ? 'คัดลอกลิงก์โปรไฟล์' : 'Copy profile link', profileUrl);
    }
  };

  const handleNativeShare = async () => {
    if (!('share' in navigator)) {
      handleCopyProfile();
      return;
    }

    try {
      await navigator.share({
        title: shareText,
        text: advisor.bio || advisor.role,
        url: profileUrl,
      });
    } catch {
      // User canceled the native share dialog.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-screen text-brand-charcoal"
      id="advisor-profile-view"
    >
      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-24 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-[11px] font-display font-bold uppercase tracking-[0.18em] text-gray-500 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isThai ? 'กลับไปทีมที่ปรึกษา' : 'Back to advisors'}
        </button>

        <div className="mb-10 flex flex-wrap items-center gap-3 text-xs font-display font-bold uppercase tracking-[0.18em] text-gray-400">
          <span>{isThai ? 'ที่ปรึกษา' : 'Advisors'}</span>
          <span className="text-gray-300">/</span>
          <span className="text-brand-charcoal">{advisor.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <aside className="lg:col-span-4 xl:col-span-3 space-y-7">
            <div className="border border-slate-200 bg-white">
                <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-7 space-y-6">
                <div className="space-y-2">
                  <p className="text-[11px] font-display font-bold uppercase tracking-[0.18em] text-brand-orange">
                    {advisor.specialty ?? advisor.role}
                  </p>
                  <h1 className="font-display text-3xl font-bold tracking-tight text-brand-charcoal">
                    {advisor.name}
                  </h1>
                  <p className="text-sm text-gray-500 leading-relaxed">{advisor.role}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(advisor.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-[0.12em] text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={onContact}
                    className="w-full bg-brand-orange hover:bg-orange-600 text-white px-5 py-4 text-xs font-display font-bold uppercase tracking-[0.16em] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    {isThai ? 'นัดหมายปรึกษา' : 'Schedule a meeting'}
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full border border-brand-charcoal hover:bg-brand-charcoal hover:text-white text-brand-charcoal px-5 py-4 text-xs font-display font-bold uppercase tracking-[0.16em] transition-colors"
                  >
                    {isThai ? 'เลือกที่ปรึกษาคนอื่น' : 'Choose another advisor'}
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <p className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">
                    {isThai ? 'แชร์โปรไฟล์' : 'Share profile'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyProfile}
                      className="inline-flex items-center justify-center gap-2 border border-slate-200 px-3 py-3 text-[11px] font-display font-bold uppercase tracking-[0.12em] text-brand-charcoal transition-colors hover:border-brand-orange hover:text-brand-orange"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? (isThai ? 'คัดลอกแล้ว' : 'Copied') : (isThai ? 'คัดลอก' : 'Copy')}
                    </button>
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="inline-flex items-center justify-center gap-2 border border-slate-200 px-3 py-3 text-[11px] font-display font-bold uppercase tracking-[0.12em] text-brand-charcoal transition-colors hover:border-brand-orange hover:text-brand-orange"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {isThai ? 'แชร์' : 'Share'}
                    </button>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodedProfileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border border-slate-200 px-3 py-3 text-[11px] font-display font-bold uppercase tracking-[0.12em] text-brand-charcoal transition-colors hover:border-brand-orange hover:text-brand-orange"
                    >
                      Facebook
                    </a>
                    <a
                      href={`https://social-plugins.line.me/lineit/share?url=${encodedProfileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border border-slate-200 px-3 py-3 text-[11px] font-display font-bold uppercase tracking-[0.12em] text-brand-charcoal transition-colors hover:border-brand-orange hover:text-brand-orange"
                    >
                      Line
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 bg-white p-7 space-y-6">
              <h2 className="text-[11px] font-display font-bold uppercase tracking-[0.18em] text-brand-charcoal">
                {isThai ? 'ข้อมูลติดต่อ' : 'Contact details'}
              </h2>
              <div className="h-px bg-slate-200" />
              <div className="space-y-5 text-sm">
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-bold">Direct Email</p>
                    <p className="font-semibold text-brand-charcoal break-all">{advisor.email}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-bold">Office Direct</p>
                    <p className="font-semibold text-brand-charcoal">{advisor.phone}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-1" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-bold">Location</p>
                    <p className="font-semibold text-brand-charcoal">{advisor.location}</p>
                  </div>
                </div>
                {advisor.linkedInUrl && (
                  <a
                    href={advisor.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pt-4 border-t border-slate-100 w-full inline-flex items-center gap-3 text-left text-xs font-display font-bold uppercase tracking-[0.16em] text-brand-orange hover:text-orange-700"
                  >
                    <Link className="w-4 h-4" />
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 border border-slate-200 bg-white text-center">
              {(advisor.credentials ?? []).map((item) => (
                <span key={item} className="px-3 py-5 text-[11px] font-display font-bold uppercase tracking-[0.14em] text-gray-400">
                  {item}
                </span>
              ))}
            </div>
          </aside>

          <main className="lg:col-span-8 xl:col-span-9 space-y-8">
            <section className="border border-slate-200 bg-white p-8 sm:p-12 lg:p-20">
              <p className="text-[11px] font-display font-bold uppercase tracking-[0.18em] text-brand-orange mb-5">
                {isThai ? 'ประวัติที่ปรึกษา' : 'Biography'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-brand-charcoal mb-8">
                {bioTitle}
              </h2>
              <p className="text-lg font-semibold leading-relaxed text-brand-charcoal max-w-3xl mb-8">
                {advisor.profileSummary}
              </p>
              <div className="space-y-6 max-w-3xl">
                {(advisor.biography ?? [advisor.bio]).map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section className="bg-[#071f1f] text-white p-8 sm:p-12 lg:p-20 relative overflow-hidden">
              <ShieldCheck className="absolute right-8 top-8 w-24 h-24 text-white/10" />
              <p className="text-[11px] font-display font-bold uppercase tracking-[0.18em] text-brand-orange mb-7">
                {isThai ? 'แนวคิดการทำงาน' : 'Philosophy'}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">
                {isThai ? 'แนวคิดการวางแผน' : 'Investment Philosophy'}
              </h2>
              <blockquote className="max-w-3xl text-lg italic leading-8 text-white/85">
                "{advisor.philosophy}"
              </blockquote>
              <div className="mt-12 flex items-center gap-7 text-xs font-display font-bold uppercase tracking-[0.18em] text-brand-orange">
                <span className="h-px w-12 bg-brand-orange" />
                {advisor.name}, {advisor.role}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="border border-slate-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-5 h-5 text-brand-orange" />
                  <h2 className="text-[12px] font-display font-bold uppercase tracking-[0.18em] text-brand-charcoal">
                    {isThai ? 'ประสบการณ์' : 'Experience'}
                  </h2>
                </div>
                <div className="h-px bg-slate-200 mb-8" />
                <div className="space-y-8">
                  {(advisor.experience ?? []).map((item) => (
                    <div key={`${item.title}-${item.period}`} className="grid grid-cols-[18px_1fr] gap-5">
                      <span className="mt-1 w-3 h-3 bg-brand-orange" />
                      <div>
                        <h3 className="font-display font-bold text-base text-brand-charcoal">{item.title}</h3>
                        <p className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-brand-orange">
                          {item.company} | {item.period}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-slate-200 bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-5 h-5 text-brand-orange" />
                  <h2 className="text-[12px] font-display font-bold uppercase tracking-[0.18em] text-brand-charcoal">
                    {isThai ? 'การศึกษาและใบรับรอง' : 'Education'}
                  </h2>
                </div>
                <div className="h-px bg-slate-200 mb-8" />
                <div className="space-y-7">
                  {(advisor.education ?? []).map((item) => (
                    <div key={`${item.degree}-${item.school}`} className="flex gap-5">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-brand-charcoal">{item.degree}</h3>
                        <p className="text-sm text-gray-500">{item.school}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </section>
    </motion.div>
  );
}

export default function AboutUsView({ setActiveTab, lang, imageSettings = {} }: AboutUsViewProps) {
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [advisorMembers, setAdvisorMembers] = useState<TeamMember[]>(DEFAULT_ADVISOR_MEMBERS);

  useEffect(() => {
    let active = true;
    const loadAdvisors = async () => {
      const { fetchAdvisorMembers } = await import('../lib/firebase');
      const advisors = await fetchAdvisorMembers();
      if (active) setAdvisorMembers(advisors.length ? advisors : DEFAULT_ADVISOR_MEMBERS);
    };
    loadAdvisors();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const applyAdvisorHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('advisor/')) {
        const advisorId = decodeURIComponent(hash.split('/')[1] || '');
        setSelectedExpertId(advisorId || null);
        return;
      }
      if (hash === 'about') {
        setSelectedExpertId(null);
      }
    };

    applyAdvisorHash();
    window.addEventListener('hashchange', applyAdvisorHash);
    return () => window.removeEventListener('hashchange', applyAdvisorHash);
  }, []);

  const openAdvisorProfile = (advisorId: string) => {
    setSelectedExpertId(advisorId);
    window.location.hash = `#/advisor/${encodeURIComponent(advisorId)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAdvisorProfile = () => {
    setSelectedExpertId(null);
    window.location.hash = '#/about';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const founderIds = ['jidapa', 'weerapan'];
  const founderRecords = founderIds
    .map((id) => advisorMembers.find((member) => member.id === id) ?? FOUNDER_MEMBERS.find((member) => member.id === id))
    .filter((member): member is TeamMember => Boolean(member));

  const experts = advisorMembers.filter((expert) => !founderIds.includes(expert.id)).map((expert) => ({
    ...localizeAdvisor(expert, lang),
    image: imageSettings[`advisor.${expert.id}`] || expert.image,
  }));
  const founders: TeamMember[] = founderRecords.map((founder) => ({
    ...localizeAdvisor(founder, lang),
    image: founder.id === 'jidapa'
      ? imageSettings[`advisor.${founder.id}`] || imageSettings['about.heritage'] || founder.image
      : imageSettings[`advisor.${founder.id}`] || imageSettings['about.excellence'] || founder.image,
  }));
  const profileMembers = [...founders, ...experts];
  const selectedExpert = selectedExpertId
    ? profileMembers.find((member) => member.id === selectedExpertId) ?? null
    : null;

  if (selectedExpert) {
    return (
      <AdvisorProfile
        advisor={selectedExpert}
        lang={lang}
        onBack={closeAdvisorProfile}
        onContact={() => {
          setSelectedExpertId(null);
          setActiveTab(ActiveTab.Contact);
        }}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-brand-cream min-h-screen text-brand-charcoal"
      id="about-view-container"
    >
      {/* 1. Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <h1 className="font-serif text-4.5xl md:text-6.5xl font-semibold tracking-tight leading-tight text-brand-charcoal max-w-4xl mx-auto">
          {lang === 'TH' ? (
            'เราวางแผนการเงิน โดยยึดเป้าหมายคุณเป็นหลัก'
          ) : (
            <>Professional discipline <br /><span className="italic font-normal">meets</span> deeply personalized care.</>
          )}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-base">
          {lang === 'TH'
            ? 'เราคือพันธมิตรที่เคียงข้างคุณในทุกช่วงเวลาสำคัญของชีวิต มอบแผนการเงินส่วนบุคคล ประกันชีวิต ประกันสุขภาพ แผนออมเพื่อเกษียณ และกองทุนการศึกษาเพื่อคนที่คุณรักอย่างอุ่นใจ'
            : 'Ultimate Life Advisor operates at the intersection of professional financial discipline and deeply personalized care. Our plans are crafted to build security for your lifetime and beyond.'}
        </p>
      </section>

      {/* 2. Mission & Vision Cards */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-white p-12 rounded-xl border border-slate-100 shadow-xs hover:shadow-sm transition-all space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-3xl" />
            <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-lg flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-gray-400 tracking-wider uppercase block">OUR MISSION</span>
            <h3 className="font-serif text-2.5xl font-semibold text-brand-charcoal">
              {lang === 'TH' ? 'มอบแผนการเงินที่เรียบง่าย โปร่งใส และเหมาะสมที่สุดสำหรับชีวิตคุณ' : 'Bringing clarity to life\'s financial goals.'}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {lang === 'TH'
                ? 'เราช่วยขจัดความยุ่งยากและรวบรวมผลิตภัณฑ์ประกันภัยและการลงทุนที่ดีที่สุดมาไว้ในจุดเดียว เพื่อมอบแนวทางที่โปร่งใสและตรงตามเป้าหมายของครอบครัวคุณจริงๆ'
                : 'Our singular focus is evaluating complex options across top financial institutions to deliver custom, transparent paths for your family\'s future.'}
            </p>
          </div>

          {/* Vision Card (Dark Highlight) */}
          <div className="bg-brand-charcoal text-white p-12 rounded-xl border border-brand-slate shadow-lg space-y-6 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl" />
            <div className="w-12 h-12 bg-brand-slate text-brand-orange rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-gray-400 tracking-wider uppercase block">OUR VISION</span>
            <h3 className="font-display font-bold text-2xl text-white">
              {lang === 'TH' 
                ? 'เป็นมาตรฐานแห่งความไว้วางใจในการวางแผนการเงินส่วนบุคคล' 
                : 'The premium standard for personalized family protection.'}
            </h3>
            <p className="text-sm !text-white leading-7 font-medium">
              {lang === 'TH'
                ? 'มุ่งมั่นสร้างความมั่นคงให้ทุกครอบครัว ด้วยการออกแบบความคุ้มครองสุขภาพและเงินสะสมระยะยาว เพื่อความมั่นคงสูงสุดในทุกช่วงอายุ'
                : 'To become the preeminent trusted partner for family financial planning, integrating elite protection systems with smart compounding growth.'}
            </p>
          </div>

        </div>
      </section>

      {/* 3. Our Heritage Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <motion.button
              type="button"
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openAdvisorProfile(founders[0].id)}
              className="group relative w-full rounded-xl overflow-hidden shadow-xl border border-slate-200 text-left"
            >
              <img 
                src={founders[0].image}
                alt={founders[0].name} 
                className="w-full h-[400px] object-cover object-center filter contrast-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-charcoal/10" />
              <div className="absolute inset-0 bg-brand-charcoal/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-[11px] font-display font-bold uppercase tracking-[0.14em] text-brand-charcoal opacity-0 transition-all duration-300 group-hover:opacity-100">
                {lang === 'TH' ? 'คลิกดูประวัติ' : 'View biography'}
              </span>
            </motion.button>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-brand-orange text-2xl font-mono font-semibold tracking-wider uppercase block">
              {founders[0].name}
            </span>
            <h2 className="font-serif text-3.5xl font-semibold tracking-tight text-brand-charcoal">
              {founders[0].role}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              {founders[0].bio}
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border-l-2 border-brand-orange pl-4">
                <span className="text-xs text-gray-400 font-mono block">{lang === 'TH' ? 'ปีที่ก่อตั้งดูแล' : 'ESTABLISHED'}</span>
                <span className="text-lg font-display font-bold text-brand-charcoal">2009</span>
              </div>
              <div className="border-l-2 border-brand-orange pl-4">
                <span className="text-xs text-gray-400 font-mono block">{lang === 'TH' ? 'อัตราดูแลต่อเนื่อง' : 'CLIENT RETENTION'}</span>
                <span className="text-lg font-display font-bold text-brand-charcoal">99.2%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3B. Advisory Excellence Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <span className="text-brand-orange text-2xl font-mono font-semibold tracking-wider uppercase block">
              {founders[1].name}
            </span>
            <h2 className="font-serif text-3.5xl font-semibold tracking-tight text-brand-charcoal">
              {founders[1].role}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              {founders[1].bio}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab(ActiveTab.Contact)}
              className="inline-flex rounded-full bg-brand-charcoal px-6 py-3 text-xs font-display font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-black"
            >
              {lang === 'TH' ? 'นัดหมายปรึกษา' : 'Our Contact'}
            </button>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <motion.button
              type="button"
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openAdvisorProfile(founders[1].id)}
              className="group relative w-full rounded-xl overflow-hidden shadow-xl border border-slate-200 text-left"
            >
              <img
                src={founders[1].image}
                alt={founders[1].name}
                className="w-full h-[400px] object-cover object-center filter contrast-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-charcoal/10" />
              <div className="absolute inset-0 bg-brand-charcoal/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-[11px] font-display font-bold uppercase tracking-[0.14em] text-brand-charcoal opacity-0 transition-all duration-300 group-hover:opacity-100">
                {lang === 'TH' ? 'คลิกดูประวัติ' : 'View biography'}
              </span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* 4. Meet The Experts */}
      <section className="py-20 bg-white border-y border-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-3.5xl font-semibold tracking-tight text-brand-charcoal">
              {lang === 'TH' ? 'พบกับทีมที่ปรึกษาการเงินของเรา' : 'Meet Our Team'}
            </h2>
            <p className="text-xs text-gray-400">
              {lang === 'TH'
                ? 'ทีมงานตัวแทนประกันชีวิตและที่ปรึกษาการเงิน ที่ผ่านการศึกษาเรียนรู้ด้านการเงิน การประกันมาอย่างเป็นระบบ'
                : 'A team of life insurance agents and financial advisors who have undergone systematic training in finance and insurance..'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="experts-grid-container">
            {experts.map((expert) => (
              <motion.div 
                key={expert.id}
                whileHover={{ y: -6 }}
                onClick={() => openAdvisorProfile(expert.id)}
                id={`expert-${expert.id}`}
                className="bg-brand-cream rounded-xl border border-slate-200 overflow-hidden cursor-pointer group shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative overflow-hidden h-72 bg-slate-100">
                  <img 
                    src={expert.image} 
                    alt={expert.name} 
                    className="w-full h-full object-cover object-center filter contrast-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] font-mono tracking-wider bg-white/90 text-brand-charcoal px-3 py-1.5 rounded-full uppercase">
                      {lang === 'TH' ? 'คลิกดูประวัติ' : 'VIEW DETAILED BIO'}
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-white flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-base text-brand-charcoal group-hover:text-brand-orange transition-colors">
                      {expert.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono uppercase">{expert.role}</p>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4 line-clamp-2">
                    {expert.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <h3 className="font-serif text-3.5xl font-semibold">
          {lang === 'TH' ? 'พร้อมที่จะร่วมงานและปรึกษาเราแล้วหรือยัง?' : 'Ready to build your financial future?'}
        </h3>
        <p className="text-sm text-gray-500">
          {lang === 'TH'
            ? 'สำนักงานและที่ปรึกษาของเรายินดีให้ความมั่นใจและนำเสนอแผนการเงินของท่าน'
            : 'Our first consultation is designed to deliver immediate clarity to your personal setups.'}
        </p>
        <button
          onClick={() => setActiveTab(ActiveTab.Contact)}
          className="bg-brand-charcoal hover:bg-black text-white px-8 py-4 rounded-lg text-xs font-display font-bold tracking-wider uppercase inline-flex items-center space-x-2"
        >
          <span>{lang === 'TH' ? 'เริ่มต้นการนัดหมายปรึกษา' : 'SCHEDULE PRIVATE ADVISORY'}</span>
        </button>
      </section>

    </motion.div>
  );
}

