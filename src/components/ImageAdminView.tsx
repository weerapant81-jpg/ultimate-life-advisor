import React, { useEffect, useState } from 'react';
import { ActiveTab, BlogPost, ImageSettings, TeamMember } from '../types';
import { DEFAULT_ADVISOR_MEMBERS } from '../data';
import { deleteAdvisorMember, deleteImageSetting, fetchAdvisorMembers, fetchBlogPosts, loginAdmin, loginAdminWithGoogle, logoutAdmin, saveAdvisorMember, saveImageSetting, sendAdminPasswordReset, watchAdminSession } from '../lib/firebase';
import { ArrowLeft, Check, GripVertical, ImagePlus, Loader2, Lock, Plus, RotateCcw, Save, Trash2, Upload, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageAdminViewProps {
  lang: 'EN' | 'TH';
  imageSettings: ImageSettings;
  onImageSettingsChange: (settings: ImageSettings) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

interface ImageCardProps {
  settingKey: string;
  title: string;
  description: string;
  fallbackUrl: string;
  value?: string;
  draftValue: string;
  savingKey: string | null;
  onDraftChange: (key: string, value: string) => void;
  onSave: (key: string, value: string) => void;
  onReset: (key: string) => void;
  onUpload: (key: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TESTIMONIAL_IMAGES = [
  {
    key: 'testimonial.1',
    title: 'Client testimonial 1',
    description: 'HR Director review avatar',
    fallbackUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  },
  {
    key: 'testimonial.2',
    title: 'Client testimonial 2',
    description: 'Orthopedic Surgeon review avatar',
    fallbackUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
  },
  {
    key: 'testimonial.3',
    title: 'Client testimonial 3',
    description: 'Export Business Owner review avatar',
    fallbackUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  },
  {
    key: 'testimonial.4',
    title: 'Client testimonial 4',
    description: 'Family Business Owner review avatar',
    fallbackUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  },
];

const EMPTY_ADVISOR: TeamMember = {
  id: '',
  name: '',
  nameTh: '',
  nameEn: '',
  role: '',
  roleTh: '',
  roleEn: '',
  bio: '',
  bioTh: '',
  bioEn: '',
  image: '',
  specialty: '',
  specialtyTh: '',
  specialtyEn: '',
  location: 'Nakhonratchasima Advisory Office',
  locationTh: 'สำนักงานที่ปรึกษานครราชสีมา',
  locationEn: 'Nakhonratchasima Advisory Office',
  email: '',
  phone: '',
  linkedInUrl: '',
  tags: [],
  profileSummary: '',
  profileSummaryTh: '',
  profileSummaryEn: '',
  biography: [],
  biographyTh: [],
  biographyEn: [],
  philosophy: '',
  philosophyTh: '',
  philosophyEn: '',
  experience: [],
  experienceTh: [],
  experienceEn: [],
  education: [],
  educationTh: [],
  educationEn: [],
  credentials: [],
  credentialsTh: [],
  credentialsEn: [],
};

const createAdvisorId = (name: string) => {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'advisor'}-${Date.now().toString(36)}`;
};

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const splitParagraphs = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

type AdvisorExperience = NonNullable<TeamMember['experience']>[number];
type AdvisorEducation = NonNullable<TeamMember['education']>[number];
type AdvisorExperienceField = 'experience' | 'experienceTh' | 'experienceEn';
type AdvisorEducationField = 'education' | 'educationTh' | 'educationEn';

const EMPTY_EXPERIENCE: AdvisorExperience = {
  title: '',
  company: '',
  period: '',
  description: '',
};

const EMPTY_EDUCATION: AdvisorEducation = {
  degree: '',
  school: '',
};

const cleanExperienceItems = (items: AdvisorExperience[] = []) =>
  items
    .map((item) => ({
      title: item.title.trim(),
      company: item.company.trim(),
      period: item.period.trim(),
      description: item.description.trim(),
    }))
    .filter((item) => item.title || item.company || item.period || item.description);

const cleanEducationItems = (items: AdvisorEducation[] = []) =>
  items
    .map((item) => ({
      degree: item.degree.trim(),
      school: item.school.trim(),
    }))
    .filter((item) => item.degree || item.school);

const toAdvisorForm = (advisor: TeamMember) => ({
  ...EMPTY_ADVISOR,
  ...advisor,
  nameTh: advisor.nameTh ?? advisor.name,
  nameEn: advisor.nameEn ?? advisor.name,
  roleTh: advisor.roleTh ?? advisor.role,
  roleEn: advisor.roleEn ?? advisor.role,
  bioTh: advisor.bioTh ?? advisor.bio,
  bioEn: advisor.bioEn ?? advisor.bio,
  specialtyTh: advisor.specialtyTh ?? advisor.specialty ?? '',
  specialtyEn: advisor.specialtyEn ?? advisor.specialty ?? '',
  locationTh: advisor.locationTh ?? advisor.location ?? '',
  locationEn: advisor.locationEn ?? advisor.location ?? '',
  profileSummaryTh: advisor.profileSummaryTh ?? advisor.profileSummary ?? '',
  profileSummaryEn: advisor.profileSummaryEn ?? advisor.profileSummary ?? '',
  biographyTh: advisor.biographyTh ?? advisor.biography ?? [],
  biographyEn: advisor.biographyEn ?? advisor.biography ?? [],
  philosophyTh: advisor.philosophyTh ?? advisor.philosophy ?? '',
  philosophyEn: advisor.philosophyEn ?? advisor.philosophy ?? '',
  tags: advisor.tags ?? [],
  biography: advisor.biography ?? [],
  credentials: advisor.credentials ?? [],
  credentialsTh: advisor.credentialsTh ?? advisor.credentials ?? [],
  credentialsEn: advisor.credentialsEn ?? advisor.credentials ?? [],
  experience: advisor.experience ?? [],
  experienceTh: advisor.experienceTh ?? advisor.experience ?? [],
  experienceEn: advisor.experienceEn ?? advisor.experience ?? [],
  education: advisor.education ?? [],
  educationTh: advisor.educationTh ?? advisor.education ?? [],
  educationEn: advisor.educationEn ?? advisor.education ?? [],
});

const resizeImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas is unavailable.'));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Unable to read image.'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
};

function ImageCard({
  settingKey,
  title,
  description,
  fallbackUrl,
  value,
  draftValue,
  savingKey,
  onDraftChange,
  onSave,
  onReset,
  onUpload,
}: ImageCardProps) {
  const currentUrl = draftValue || value || fallbackUrl;
  const isSaving = savingKey === settingKey;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
        <img
          src={currentUrl}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-[21.6px] font-bold text-brand-charcoal">{title}</h3>
          <p className="text-[14.4px] text-gray-500 leading-relaxed">{description}</p>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">
            Image URL
          </label>
          <input
            value={draftValue}
            onChange={(event) => onDraftChange(settingKey, event.target.value)}
            placeholder={fallbackUrl}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-brand-charcoal outline-hidden focus:border-brand-orange focus:bg-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-brand-charcoal hover:border-brand-orange hover:text-brand-orange transition-colors">
            <Upload className="w-4 h-4" />
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onUpload(settingKey, event)}
            />
          </label>
          <button
            type="button"
            onClick={() => onSave(settingKey, draftValue)}
            disabled={isSaving || !draftValue.trim()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-charcoal px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save
          </button>
          <button
            type="button"
            onClick={() => onReset(settingKey)}
            disabled={isSaving || !value}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Default
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ImageAdminView({ lang, imageSettings, onImageSettingsChange, setActiveTab }: ImageAdminViewProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('weerapan.aia@hotmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [drafts, setDrafts] = useState<ImageSettings>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [advisorMembers, setAdvisorMembers] = useState<TeamMember[]>(DEFAULT_ADVISOR_MEMBERS);
  const [advisorForm, setAdvisorForm] = useState<TeamMember>(() => toAdvisorForm(EMPTY_ADVISOR));
  const [advisorListDrafts, setAdvisorListDrafts] = useState({
    tags: '',
    credentialsTh: '',
    credentialsEn: '',
  });
  const [editingAdvisorId, setEditingAdvisorId] = useState<string | null>(null);
  const [savingAdvisor, setSavingAdvisor] = useState(false);
  const [draggedAdvisorId, setDraggedAdvisorId] = useState<string | null>(null);

  const isThai = lang === 'TH';

  useEffect(() => {
    return watchAdminSession((allowed) => {
      setIsAdmin(allowed);
    });
  }, []);

  useEffect(() => {
    const nextDrafts: ImageSettings = {};
    Object.entries(imageSettings).forEach(([key, value]) => {
      if (value) nextDrafts[key] = value;
    });
    setDrafts(nextDrafts);
  }, [imageSettings]);

  useEffect(() => {
    let active = true;
    const loadPosts = async () => {
      try {
        const posts = await fetchBlogPosts();
        if (active) setBlogPosts(posts);
      } finally {
        if (active) setLoadingPosts(false);
      }
    };
    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadAdvisors = async () => {
      const advisors = await fetchAdvisorMembers();
      if (active) setAdvisorMembers(advisors.length ? advisors : DEFAULT_ADVISOR_MEMBERS);
    };
    loadAdvisors();
    return () => {
      active = false;
    };
  }, []);

  const updateSetting = (key: string, value?: string) => {
    const nextSettings = { ...imageSettings };
    if (value) {
      nextSettings[key] = value;
    } else {
      delete nextSettings[key];
    }
    onImageSettingsChange(nextSettings);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');
    try {
      await loginAdmin(adminEmail, adminPassword);
      setAdminPassword('');
      setLoginError('');
    } catch (error) {
      console.error(error);
      setLoginError(isThai ? 'อีเมลหรือรหัสผ่านแอดมินไม่ถูกต้อง' : 'Invalid admin email or password.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    try {
      await loginAdminWithGoogle();
    } catch (error: unknown) {
      const msg = String((error as { message?: string; code?: string })?.message || '');
      const code = String((error as { code?: string })?.code || '');
      if (msg === 'not-admin') {
        setLoginError(isThai ? 'บัญชี Google นี้ไม่มีสิทธิ์จัดการเว็บไซต์' : 'This Google account is not allowed to manage the website.');
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // ผู้ใช้ปิดหน้าต่างเอง — ไม่ต้องโชว์ error
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        setLoginError(isThai ? 'ยังไม่ได้เปิดใช้ Google Sign-In ใน Firebase Console (Authentication → Sign-in method → Google → Enable)' : 'Google Sign-In is not enabled in Firebase Console (Authentication → Sign-in method → Google → Enable).');
      } else if (code === 'auth/popup-blocked') {
        setLoginError(isThai ? 'เบราว์เซอร์บล็อกหน้าต่างล็อกอิน — กดอนุญาต popup สำหรับเว็บนี้ (ไอคอนข้าง address bar) แล้วลองใหม่' : 'The browser blocked the sign-in popup — allow popups for this site and try again.');
      } else if (code === 'auth/unauthorized-domain') {
        setLoginError(isThai ? 'โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase (Authentication → Settings → Authorized domains)' : 'This domain is not authorized in Firebase (Authentication → Settings → Authorized domains).');
      } else {
        console.error(error);
        setLoginError((isThai ? 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ' : 'Google sign-in failed.') + (code ? ` [${code}]` : msg ? ` [${msg.slice(0, 80)}]` : ''));
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!adminEmail.trim() || resetStatus === 'sending') return;
    setLoginError('');
    setResetStatus('sending');
    try {
      await sendAdminPasswordReset(adminEmail);
      setResetStatus('sent');
    } catch (error) {
      console.error(error);
      setResetStatus('error');
    }
  };

  const handleDraftChange = (key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setSavingKey(key);
    setStatus('');
    try {
      await saveImageSetting(key, trimmed);
      updateSetting(key, trimmed);
      setStatus(isThai ? 'บันทึกรูปภาพเรียบร้อยแล้ว' : 'Image saved successfully.');
    } catch (error) {
      console.error(error);
      setStatus(isThai ? 'บันทึกรูปภาพไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ Firestore' : 'Unable to save image. Please check Firestore permissions.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleReset = async (key: string) => {
    setSavingKey(key);
    setStatus('');
    try {
      await deleteImageSetting(key);
      updateSetting(key);
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setStatus(isThai ? 'กลับไปใช้รูปภาพเริ่มต้นแล้ว' : 'Default image restored.');
    } catch (error) {
      console.error(error);
      setStatus(isThai ? 'ลบค่ารูปภาพไม่สำเร็จ' : 'Unable to reset image.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleUpload = async (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus(isThai ? 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น' : 'Please upload an image file only.');
      event.target.value = '';
      return;
    }

    setSavingKey(key);
    setStatus('');
    try {
      const resizedDataUrl = await resizeImageFile(file);
      if (resizedDataUrl.length > 850_000) {
        setStatus(isThai ? 'รูปยังมีขนาดใหญ่เกินไป กรุณาใช้ไฟล์ที่เล็กลงหรือใช้ URL รูปภาพแทน' : 'The image is still too large. Please use a smaller file or an image URL.');
        return;
      }
      setDrafts((prev) => ({ ...prev, [key]: resizedDataUrl }));
      await saveImageSetting(key, resizedDataUrl);
      updateSetting(key, resizedDataUrl);
      setStatus(isThai ? 'อัปโหลดและบันทึกรูปภาพเรียบร้อยแล้ว' : 'Image uploaded and saved.');
    } catch (error) {
      console.error(error);
      setStatus(isThai ? 'ไม่สามารถอ่านหรือบันทึกรูปนี้ได้' : 'Unable to read or save this image.');
    } finally {
      event.target.value = '';
      setSavingKey(null);
    }
  };

  const handleAdvisorFieldChange = (field: keyof TeamMember, value: TeamMember[keyof TeamMember]) => {
    setAdvisorForm((prev) => ({ ...prev, [field]: value }));
  };

  const syncAdvisorListDrafts = (advisor: TeamMember) => {
    setAdvisorListDrafts({
      tags: (advisor.tags ?? []).join(', '),
      credentialsTh: (advisor.credentialsTh ?? advisor.credentials ?? []).join(', '),
      credentialsEn: (advisor.credentialsEn ?? []).join(', '),
    });
  };

  const handleExperienceChange = (
    field: AdvisorExperienceField,
    index: number,
    key: keyof AdvisorExperience,
    value: string
  ) => {
    setAdvisorForm((prev) => {
      const items = [...((prev[field] as AdvisorExperience[] | undefined) ?? [])];
      items[index] = { ...(items[index] ?? EMPTY_EXPERIENCE), [key]: value };
      return { ...prev, [field]: items };
    });
  };

  const addExperienceItem = (field: AdvisorExperienceField) => {
    setAdvisorForm((prev) => ({
      ...prev,
      [field]: [...(((prev[field] as AdvisorExperience[] | undefined) ?? [])), { ...EMPTY_EXPERIENCE }],
    }));
  };

  const removeExperienceItem = (field: AdvisorExperienceField, index: number) => {
    setAdvisorForm((prev) => ({
      ...prev,
      [field]: ((prev[field] as AdvisorExperience[] | undefined) ?? []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleEducationChange = (
    field: AdvisorEducationField,
    index: number,
    key: keyof AdvisorEducation,
    value: string
  ) => {
    setAdvisorForm((prev) => {
      const items = [...((prev[field] as AdvisorEducation[] | undefined) ?? [])];
      items[index] = { ...(items[index] ?? EMPTY_EDUCATION), [key]: value };
      return { ...prev, [field]: items };
    });
  };

  const addEducationItem = (field: AdvisorEducationField) => {
    setAdvisorForm((prev) => ({
      ...prev,
      [field]: [...(((prev[field] as AdvisorEducation[] | undefined) ?? [])), { ...EMPTY_EDUCATION }],
    }));
  };

  const removeEducationItem = (field: AdvisorEducationField, index: number) => {
    setAdvisorForm((prev) => ({
      ...prev,
      [field]: ((prev[field] as AdvisorEducation[] | undefined) ?? []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleEditAdvisor = (advisor: TeamMember) => {
    setEditingAdvisorId(advisor.id);
    const formAdvisor = toAdvisorForm(advisor);
    setAdvisorForm(formAdvisor);
    syncAdvisorListDrafts(formAdvisor);
    setStatus('');
  };

  const handleNewAdvisor = () => {
    const emptyForm = toAdvisorForm(EMPTY_ADVISOR);
    setEditingAdvisorId(null);
    setAdvisorForm(emptyForm);
    syncAdvisorListDrafts(emptyForm);
    setStatus('');
  };

  const handleAdvisorDrop = async (targetAdvisorId: string) => {
    if (!draggedAdvisorId || draggedAdvisorId === targetAdvisorId || savingAdvisor) {
      setDraggedAdvisorId(null);
      return;
    }

    const currentOrder = advisorMembers;
    const fromIndex = currentOrder.findIndex((advisor) => advisor.id === draggedAdvisorId);
    const toIndex = currentOrder.findIndex((advisor) => advisor.id === targetAdvisorId);

    if (fromIndex < 0 || toIndex < 0) {
      setDraggedAdvisorId(null);
      return;
    }

    const nextOrder = [...currentOrder];
    const [movedAdvisor] = nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, movedAdvisor);

    setAdvisorMembers(nextOrder);
    setDraggedAdvisorId(null);
    setSavingAdvisor(true);
    setStatus('');

    try {
      await Promise.all(nextOrder.map((advisor, order) => saveAdvisorMember(advisor, order)));
      setStatus(isThai ? 'จัดลำดับที่ปรึกษาเรียบร้อยแล้ว' : 'Advisor order updated successfully.');
    } catch (error) {
      console.error(error);
      setAdvisorMembers(currentOrder);
      setStatus(isThai ? 'บันทึกลำดับที่ปรึกษาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' : 'Unable to update advisor order. Please try again.');
    } finally {
      setSavingAdvisor(false);
    }
  };

  const handleSaveAdvisor = async (event: React.FormEvent) => {
    event.preventDefault();
    const nameTh = (advisorForm.nameTh || advisorForm.name).trim();
    const nameEn = (advisorForm.nameEn || '').trim();
    const roleTh = (advisorForm.roleTh || advisorForm.role).trim();
    const roleEn = (advisorForm.roleEn || '').trim();
    const image = advisorForm.image.trim();

    if (!nameTh || !nameEn || !roleTh || !roleEn || !image) {
      setStatus(isThai ? 'กรุณากรอกชื่อ ตำแหน่ง และรูปภาพของที่ปรึกษา' : 'Please add advisor name, role, and image.');
      return;
    }

    const bioTh = (advisorForm.bioTh || advisorForm.bio).trim();
    const bioEn = (advisorForm.bioEn || '').trim();
    const summaryTh = advisorForm.profileSummaryTh?.trim() || advisorForm.profileSummary?.trim() || bioTh;
    const summaryEn = advisorForm.profileSummaryEn?.trim() || bioEn;
    const experienceTh = cleanExperienceItems(advisorForm.experienceTh ?? advisorForm.experience ?? []);
    const experienceEn = cleanExperienceItems(advisorForm.experienceEn ?? []);
    const educationTh = cleanEducationItems(advisorForm.educationTh ?? advisorForm.education ?? []);
    const educationEn = cleanEducationItems(advisorForm.educationEn ?? []);
    const tags = splitList(advisorListDrafts.tags);
    const credentialsTh = splitList(advisorListDrafts.credentialsTh);
    const credentialsEn = splitList(advisorListDrafts.credentialsEn);

    const finalAdvisor: TeamMember = {
      ...advisorForm,
      id: editingAdvisorId || advisorForm.id || createAdvisorId(nameEn || nameTh),
      name: nameTh,
      nameTh,
      nameEn,
      role: roleTh,
      roleTh,
      roleEn,
      image,
      bio: bioTh || roleTh,
      bioTh,
      bioEn,
      specialty: (advisorForm.specialtyTh || advisorForm.specialty)?.trim() || roleTh,
      specialtyTh: (advisorForm.specialtyTh || advisorForm.specialty)?.trim(),
      specialtyEn: advisorForm.specialtyEn?.trim() || advisorForm.specialty?.trim(),
      location: (advisorForm.locationTh || advisorForm.location)?.trim(),
      locationTh: (advisorForm.locationTh || advisorForm.location)?.trim(),
      locationEn: advisorForm.locationEn?.trim() || advisorForm.location?.trim(),
      email: advisorForm.email?.trim(),
      phone: advisorForm.phone?.trim(),
      linkedInUrl: advisorForm.linkedInUrl?.trim(),
      profileSummary: summaryTh,
      profileSummaryTh: summaryTh,
      profileSummaryEn: summaryEn,
      philosophy: advisorForm.philosophy?.trim() || (isThai ? 'ให้คำแนะนำอย่างตรงไปตรงมา โปร่งใส และยึดเป้าหมายของลูกค้าเป็นหลัก' : 'Advice should be clear, transparent, and centered on the client goals.'),
      philosophyTh: advisorForm.philosophyTh?.trim() || advisorForm.philosophy?.trim(),
      philosophyEn: advisorForm.philosophyEn?.trim() || advisorForm.philosophy?.trim(),
      tags,
      biography: advisorForm.biographyTh?.length ? advisorForm.biographyTh : [bioTh].filter(Boolean),
      biographyTh: advisorForm.biographyTh?.length ? advisorForm.biographyTh : [bioTh].filter(Boolean),
      biographyEn: advisorForm.biographyEn?.length ? advisorForm.biographyEn : [bioEn].filter(Boolean),
      credentials: credentialsTh,
      credentialsTh,
      credentialsEn,
      experience: experienceTh,
      experienceTh,
      experienceEn,
      education: educationTh,
      educationTh,
      educationEn,
    };

    setSavingAdvisor(true);
    setStatus('');
    try {
      const order = editingAdvisorId
        ? Math.max(0, advisorMembers.findIndex((advisor) => advisor.id === editingAdvisorId))
        : advisorMembers.length;
      const savedAdvisor = await saveAdvisorMember(finalAdvisor, order);
      setAdvisorMembers((prev) => {
        const exists = prev.some((advisor) => advisor.id === savedAdvisor.id);
        return exists
          ? prev.map((advisor) => (advisor.id === savedAdvisor.id ? savedAdvisor : advisor))
          : [...prev, savedAdvisor];
      });
      setEditingAdvisorId(savedAdvisor.id);
      const savedForm = toAdvisorForm(savedAdvisor);
      setAdvisorForm(savedForm);
      syncAdvisorListDrafts(savedForm);
      setStatus(isThai ? 'บันทึกข้อมูลที่ปรึกษาเรียบร้อยแล้ว' : 'Advisor saved successfully.');
    } catch (error) {
      console.error(error);
      setStatus(isThai ? 'บันทึกข้อมูลที่ปรึกษาไม่สำเร็จ กรุณาตรวจสอบ Firestore' : 'Unable to save advisor. Please check Firestore permissions.');
    } finally {
      setSavingAdvisor(false);
    }
  };

  const handleDeleteAdvisor = async (advisor: TeamMember) => {
    const confirmed = window.confirm(
      isThai
        ? `ต้องการลบ ${advisor.name} ออกจากหน้าเว็บใช่ไหม?`
        : `Remove ${advisor.name} from the website?`
    );
    if (!confirmed) return;

    setSavingAdvisor(true);
    setStatus('');
    try {
      await deleteAdvisorMember(advisor.id);
      await deleteImageSetting(`advisor.${advisor.id}`).catch(() => undefined);
      setAdvisorMembers((prev) => prev.filter((item) => item.id !== advisor.id));
      updateSetting(`advisor.${advisor.id}`);
      if (editingAdvisorId === advisor.id) handleNewAdvisor();
      setStatus(isThai ? 'ลบที่ปรึกษาออกจากหน้าเว็บแล้ว' : 'Advisor removed from the website.');
    } catch (error) {
      console.error(error);
      setStatus(isThai ? 'ลบที่ปรึกษาไม่สำเร็จ' : 'Unable to remove advisor.');
    } finally {
      setSavingAdvisor(false);
    }
  };

  const handleAdvisorImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus(isThai ? 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น' : 'Please upload an image file only.');
      event.target.value = '';
      return;
    }

    setSavingAdvisor(true);
    setStatus('');
    try {
      const resizedDataUrl = await resizeImageFile(file);
      if (resizedDataUrl.length > 850_000) {
        setStatus(isThai ? 'รูปยังมีขนาดใหญ่เกินไป กรุณาใช้ไฟล์ที่เล็กลง' : 'The image is still too large. Please use a smaller file.');
        return;
      }
      setAdvisorForm((prev) => ({ ...prev, image: resizedDataUrl }));
      setStatus(isThai ? 'อัปโหลดรูปที่ปรึกษาแล้ว กดบันทึกเพื่อใช้งานบนหน้าเว็บ' : 'Advisor image uploaded. Save the advisor to publish it.');
    } catch (error) {
      console.error(error);
      setStatus(isThai ? 'ไม่สามารถอ่านรูปนี้ได้ กรุณาลองไฟล์ใหม่' : 'Unable to read this image. Please try another file.');
    } finally {
      event.target.value = '';
      setSavingAdvisor(false);
    }
  };

  const renderImageCard = (key: string, title: string, description: string, fallbackUrl: string) => (
    <React.Fragment key={key}>
      <ImageCard
        settingKey={key}
        title={title}
        description={description}
        fallbackUrl={fallbackUrl}
        value={imageSettings[key]}
        draftValue={drafts[key] || ''}
        savingKey={savingKey}
        onDraftChange={handleDraftChange}
        onSave={handleSave}
        onReset={handleReset}
        onUpload={handleUpload}
      />
    </React.Fragment>
  );

  const renderExperienceEditor = (field: AdvisorExperienceField, title: string) => {
    const items = advisorForm[field]?.length ? advisorForm[field] : [{ ...EMPTY_EXPERIENCE }];

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-display text-base font-bold text-brand-charcoal">{title}</h4>
          <button
            type="button"
            onClick={() => addExperienceItem(field)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${field}-${index}`} className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={item.title}
                  onChange={(event) => handleExperienceChange(field, index, 'title', event.target.value)}
                  placeholder="Title"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-hidden focus:border-brand-orange"
                />
                <input
                  value={item.company}
                  onChange={(event) => handleExperienceChange(field, index, 'company', event.target.value)}
                  placeholder="Company / organization"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-hidden focus:border-brand-orange"
                />
                <input
                  value={item.period}
                  onChange={(event) => handleExperienceChange(field, index, 'period', event.target.value)}
                  placeholder="Period, e.g. 2018 - Present"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-hidden focus:border-brand-orange"
                />
                <button
                  type="button"
                  onClick={() => removeExperienceItem(field, index)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
              <textarea
                value={item.description}
                onChange={(event) => handleExperienceChange(field, index, 'description', event.target.value)}
                rows={2}
                placeholder="Description"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-hidden focus:border-brand-orange"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationEditor = (field: AdvisorEducationField, title: string) => {
    const items = advisorForm[field]?.length ? advisorForm[field] : [{ ...EMPTY_EDUCATION }];

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-display text-base font-bold text-brand-charcoal">{title}</h4>
          <button
            type="button"
            onClick={() => addEducationItem(field)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${field}-${index}`} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 rounded-lg bg-slate-50 border border-slate-100 p-3">
              <input
                value={item.degree}
                onChange={(event) => handleEducationChange(field, index, 'degree', event.target.value)}
                placeholder="Degree / credential"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-hidden focus:border-brand-orange"
              />
              <input
                value={item.school}
                onChange={(event) => handleEducationChange(field, index, 'school', event.target.value)}
                placeholder="School / issuer"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-hidden focus:border-brand-orange"
              />
              <button
                type="button"
                onClick={() => removeEducationItem(field, index)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isAdmin) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-brand-cream px-4 py-20">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-brand-charcoal mb-3">
            {isThai ? 'เข้าสู่ระบบจัดการเว็บไซต์' : 'Website Management Login'}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {isThai ? 'เข้าสู่ระบบด้วยบัญชี Google ของแอดมิน เพื่อแก้ไขรูปภาพ ที่ปรึกษา และข้อมูลบนหน้าเว็บ' : 'Sign in with the admin Google account to update images, advisors, and website content.'}
          </p>

          {/* ทางหลัก: Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-brand-charcoal hover:border-brand-orange hover:shadow-sm transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {isThai ? 'เข้าสู่ระบบด้วย Google' : 'Sign in with Google'}
          </button>
          {loginError && <p className="mt-3 text-sm text-red-600">{loginError}</p>}

          {/* ทางสำรอง: อีเมล + รหัสผ่านแบบเดิม (พับเก็บ) */}
          <details className="mt-6 border-t border-slate-100 pt-4">
            <summary className="text-sm text-gray-400 cursor-pointer select-none hover:text-gray-600">
              {isThai ? 'เข้าด้วยอีเมลและรหัสผ่านแทน' : 'Use email & password instead'}
            </summary>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <input
              type="email"
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-hidden focus:border-brand-orange"
              placeholder={isThai ? 'อีเมลแอดมิน' : 'Admin email'}
            />
            <input
              type="password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-hidden focus:border-brand-orange"
              placeholder={isThai ? 'รหัสผ่าน' : 'Password'}
            />
            <button type="submit" className="w-full rounded-lg bg-brand-charcoal px-5 py-3 font-semibold text-white hover:bg-black">
              {isThai ? 'เข้าสู่ระบบ' : 'Login'}
            </button>
            <div className="text-center">
              {resetStatus === 'sent' ? (
                <p className="text-sm text-emerald-600">
                  {isThai
                    ? 'ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแอดมินแล้ว — เช็คกล่องจดหมาย (รวมถึง Junk/Spam)'
                    : 'Password reset link sent — check the admin inbox (including Junk/Spam).'}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetStatus === 'sending'}
                  className="text-sm text-gray-500 underline underline-offset-4 hover:text-brand-orange disabled:opacity-50"
                >
                  {resetStatus === 'sending'
                    ? (isThai ? 'กำลังส่งอีเมล...' : 'Sending email...')
                    : (isThai ? 'ลืมรหัสผ่าน? ส่งอีเมลรีเซ็ต' : 'Forgot password? Send reset email')}
                </button>
              )}
              {resetStatus === 'error' && (
                <p className="mt-2 text-sm text-red-600">
                  {isThai ? 'ส่งอีเมลรีเซ็ตไม่สำเร็จ — ตรวจอีเมลแอดมินแล้วลองใหม่' : 'Could not send reset email — check the admin email and try again.'}
                </p>
              )}
            </div>
          </form>
          </details>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-brand-cream text-brand-charcoal">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setActiveTab(ActiveTab.Home)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-orange"
            >
              <ArrowLeft className="w-4 h-4" />
              {isThai ? 'กลับหน้าแรก' : 'Back home'}
            </button>
            <div className="inline-flex items-center gap-2 text-brand-orange text-xs font-mono font-semibold tracking-widest uppercase">
              <ImagePlus className="w-4 h-4" />
              Image Admin
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
              {isThai ? 'ระบบจัดการรูปภาพหลังบ้าน' : 'Website Image Management'}
            </h1>
            <p className="max-w-2xl text-gray-500 leading-relaxed">
              {isThai
                ? 'อัปโหลดรูปจากเครื่องหรือวาง URL รูปภาพเพื่อเปลี่ยนรูป Hero, บริการ, ที่ปรึกษา และบทความ ค่าที่บันทึกจะถูกใช้แทนรูปเดิมบนหน้าเว็บ'
                : 'Upload a file or paste an image URL to replace hero, service, advisor, and article images across the website.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => logoutAdmin()}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange"
          >
            {isThai ? 'ออกจากระบบแอดมิน' : 'Logout'}
          </button>
        </div>

        {status && (
          <div className="rounded-xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-semibold text-brand-orange">
            {status}
          </div>
        )}

        <section className="space-y-5">
          <h2 className="font-display text-2xl font-bold">Main Pages</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderImageCard('hero.home', isThai ? 'รูป Hero หน้าแรก' : 'Home hero image', isThai ? 'รูปหลักด้านขวาของหน้าแรก' : 'Main right-side image on the home page.', '/images/hero-financial-planning.png')}
            {renderImageCard('service.main', isThai ? 'รูปบริการหลัก' : 'Main service image', isThai ? 'รูปในการ์ดบริการการลงทุนและการออม' : 'Image in the investment and savings service card.', 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&q=80&w=800')}
            {renderImageCard('about.heritage', isThai ? 'รูปเกี่ยวกับเรา' : 'About page image', isThai ? 'รูปในส่วนประวัติและความน่าเชื่อถือ' : 'Image in the heritage section on the about page.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800')}
            {renderImageCard('about.excellence', isThai ? 'รูปแนวทางการดูแล' : 'Advisory excellence image', isThai ? 'รูปใน section แนวทางการดูแลแถวที่สองของหน้าเกี่ยวกับเรา' : 'Image in the second advisory section on the about page.', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=900')}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold">{isThai ? 'จัดการรายชื่อที่ปรึกษาการเงิน' : 'Financial Advisor Management'}</h2>
              <p className="text-sm text-gray-500">
                {isThai ? 'เพิ่ม แก้ไข หรือลบรายชื่อที่ปรึกษาที่แสดงบนหน้าเกี่ยวกับเรา' : 'Add, edit, or remove advisors shown on the About page.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleNewAdvisor}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <Plus className="w-4 h-4" />
              {isThai ? 'เพิ่มที่ปรึกษาใหม่' : 'New advisor'}
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.4fr] gap-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-display text-[21.6px] font-bold text-brand-charcoal">{isThai ? 'รายชื่อปัจจุบัน' : 'Current advisors'}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {advisorMembers.map((advisor) => (
                  <div
                    key={advisor.id}
                    draggable={!savingAdvisor}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      setDraggedAdvisorId(advisor.id);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={() => handleAdvisorDrop(advisor.id)}
                    onDragEnd={() => setDraggedAdvisorId(null)}
                    className={`group p-4 flex gap-3 items-center transition-colors ${
                      draggedAdvisorId === advisor.id
                        ? 'bg-orange-50 opacity-70'
                        : 'bg-white hover:bg-slate-50'
                    } ${savingAdvisor ? 'cursor-wait' : 'cursor-grab active:cursor-grabbing'}`}
                  >
                    <span
                      className="flex h-10 w-6 shrink-0 items-center justify-center rounded-md text-slate-300 transition-colors group-hover:text-brand-orange"
                      aria-hidden="true"
                    >
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <img
                      src={imageSettings[`advisor.${advisor.id}`] || advisor.image}
                      alt={advisor.name}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display font-bold text-brand-charcoal truncate">{advisor.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{advisor.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditAdvisor(advisor)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-brand-charcoal hover:border-brand-orange hover:text-brand-orange"
                      >
                        {isThai ? 'แก้ไข' : 'Edit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAdvisor(advisor)}
                        disabled={savingAdvisor}
                        className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        aria-label={isThai ? 'ลบที่ปรึกษา' : 'Delete advisor'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveAdvisor} className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-[21.6px] font-bold text-brand-charcoal">
                    {editingAdvisorId ? (isThai ? 'แก้ไขข้อมูลที่ปรึกษา' : 'Edit advisor') : (isThai ? 'เพิ่มที่ปรึกษาใหม่' : 'Add advisor')}
                  </h3>
                  <p className="text-[14.4px] text-gray-500">{isThai ? 'ข้อมูลนี้จะใช้ทั้งในการ์ดและหน้าโปรไฟล์' : 'These details power the advisor card and profile page.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'ชื่อ' : 'Name'} *</span>
                  <input value={advisorForm.nameTh || ''} onChange={(event) => handleAdvisorFieldChange('nameTh', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'ตำแหน่ง' : 'Role'} *</span>
                  <input value={advisorForm.roleTh || ''} onChange={(event) => handleAdvisorFieldChange('roleTh', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Name (EN) *</span>
                  <input value={advisorForm.nameEn || ''} onChange={(event) => handleAdvisorFieldChange('nameEn', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Role (EN) *</span>
                  <input value={advisorForm.roleEn || ''} onChange={(event) => handleAdvisorFieldChange('roleEn', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <div className="space-y-2 md:col-span-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">
                    {isThai ? 'อัปโหลดรูปภาพ' : 'Upload image'} *
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                    <div className="aspect-[4/5] overflow-hidden rounded-lg bg-white border border-slate-200">
                      {advisorForm.image ? (
                        <img
                          src={advisorForm.image}
                          alt={advisorForm.name || (isThai ? 'รูปที่ปรึกษา' : 'Advisor image')}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <UserPlus className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                      <p className="text-[14.4px] text-gray-500 leading-relaxed">
                        {isThai
                          ? 'เลือกรูปจากเครื่อง ระบบจะย่อขนาดให้อัตโนมัติก่อนบันทึก'
                          : 'Choose an image from your device. The system will resize it before saving.'}
                      </p>
                      <label className="inline-flex w-full sm:w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-charcoal px-5 py-3 text-sm font-semibold text-white hover:bg-black transition-colors">
                        <Upload className="w-4 h-4" />
                        {isThai ? 'เลือกรูปภาพ' : 'Choose image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAdvisorImageUpload}
                        />
                      </label>
                      {advisorForm.image && (
                        <button
                          type="button"
                          onClick={() => handleAdvisorFieldChange('image', '')}
                          className="inline-flex w-full sm:w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange"
                        >
                          <RotateCcw className="w-4 h-4" />
                          {isThai ? 'ล้างรูป' : 'Clear image'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'ความเชี่ยวชาญ' : 'Specialty'}</span>
                  <input value={advisorForm.specialtyTh || ''} onChange={(event) => handleAdvisorFieldChange('specialtyTh', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'อีเมล' : 'Email'}</span>
                  <input value={advisorForm.email || ''} onChange={(event) => handleAdvisorFieldChange('email', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'เบอร์โทร' : 'Phone'}</span>
                  <input value={advisorForm.phone || ''} onChange={(event) => handleAdvisorFieldChange('phone', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">LinkedIn Profile URL</span>
                  <input value={advisorForm.linkedInUrl || ''} onChange={(event) => handleAdvisorFieldChange('linkedInUrl', event.target.value)} placeholder="https://www.linkedin.com/in/..." className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'ที่อยู่/สำนักงาน' : 'Location'}</span>
                  <input value={advisorForm.locationTh || ''} onChange={(event) => handleAdvisorFieldChange('locationTh', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Bio</span>
                <textarea value={advisorForm.bioTh || ''} onChange={(event) => handleAdvisorFieldChange('bioTh', event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
              </label>
              <label className="space-y-2 block">
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Bio (EN)</span>
                <textarea value={advisorForm.bioEn || ''} onChange={(event) => handleAdvisorFieldChange('bioEn', event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
              </label>
              <label className="space-y-2 block">
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'สรุปหน้าโปรไฟล์' : 'Profile summary'}</span>
                <textarea value={advisorForm.profileSummaryTh || ''} onChange={(event) => handleAdvisorFieldChange('profileSummaryTh', event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
              </label>
              <label className="space-y-2 block">
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Profile summary (EN)</span>
                <textarea value={advisorForm.profileSummaryEn || ''} onChange={(event) => handleAdvisorFieldChange('profileSummaryEn', event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
              </label>
              <label className="space-y-2 block">
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'ประวัติแบบย่อหน้า' : 'Biography paragraphs'}</span>
                <textarea value={(advisorForm.biographyTh || []).join('\n')} onChange={(event) => handleAdvisorFieldChange('biographyTh', splitParagraphs(event.target.value))} rows={4} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
              </label>
              <label className="space-y-2 block">
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Biography paragraphs (EN)</span>
                <textarea value={(advisorForm.biographyEn || []).join('\n')} onChange={(event) => handleAdvisorFieldChange('biographyEn', splitParagraphs(event.target.value))} rows={4} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Tags</span>
                  <input value={advisorListDrafts.tags} onChange={(event) => setAdvisorListDrafts((prev) => ({ ...prev, tags: event.target.value }))} placeholder="Protection, MDRT, Retirement" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Credentials (TH)</span>
                  <input value={advisorListDrafts.credentialsTh} onChange={(event) => setAdvisorListDrafts((prev) => ({ ...prev, credentialsTh: event.target.value }))} placeholder="AIA, MDRT" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Credentials (EN)</span>
                  <input value={advisorListDrafts.credentialsEn} onChange={(event) => setAdvisorListDrafts((prev) => ({ ...prev, credentialsEn: event.target.value }))} placeholder="AIA, MDRT" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
                </label>
              </div>
              <label className="space-y-2 block">
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">{isThai ? 'แนวคิดการทำงาน' : 'Philosophy'}</span>
                <textarea value={advisorForm.philosophyTh || ''} onChange={(event) => handleAdvisorFieldChange('philosophyTh', event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
              </label>
              <label className="space-y-2 block">
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.16em] text-gray-400">Philosophy (EN)</span>
                <textarea value={advisorForm.philosophyEn || ''} onChange={(event) => handleAdvisorFieldChange('philosophyEn', event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-hidden focus:border-brand-orange focus:bg-white" />
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-5">
                <div>
                  <h4 className="font-display text-[21.6px] font-bold text-brand-charcoal">
                    {isThai ? 'ประสบการณ์ / การศึกษาในหน้าโปรไฟล์' : 'Profile experience and education'}
                  </h4>
                  <p className="text-[14.4px] text-gray-500">
                    {isThai ? 'ส่วนนี้จะแสดงในการ์ดประสบการณ์ และการศึกษา/ใบรับรองของหน้าโปรไฟล์ที่ปรึกษา' : 'These fields appear in the advisor profile experience and education cards.'}
                  </p>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {renderExperienceEditor('experienceTh', 'Experience (TH)')}
                  {renderExperienceEditor('experienceEn', 'Experience (EN)')}
                  {renderEducationEditor('educationTh', 'Education & Credentials (TH)')}
                  {renderEducationEditor('educationEn', 'Education & Credentials (EN)')}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={savingAdvisor} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-charcoal px-5 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50">
                  {savingAdvisor ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isThai ? 'บันทึกข้อมูลที่ปรึกษา' : 'Save advisor'}
                </button>
                <button type="button" onClick={handleNewAdvisor} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange">
                  <RotateCcw className="w-4 h-4" />
                  {isThai ? 'ล้างฟอร์ม' : 'Clear form'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-2xl font-bold">{isThai ? 'รูปที่ปรึกษา' : 'Advisor Images'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {advisorMembers.map((advisor: TeamMember) =>
              renderImageCard(`advisor.${advisor.id}`, advisor.name, advisor.role, advisor.image)
            )}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-2xl font-bold">{isThai ? 'รูปรีวิวลูกค้า' : 'Client Testimonial Images'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {TESTIMONIAL_IMAGES.map((item, index) =>
              renderImageCard(
                item.key,
                isThai ? `รูปรีวิวลูกค้าคนที่ ${index + 1}` : item.title,
                item.description,
                item.fallbackUrl
              )
            )}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold">{isThai ? 'รูปบทความ' : 'Article Images'}</h2>
            {loadingPosts && <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogPosts.map((post) =>
              renderImageCard(`blog.${post.id}`, post.titleEn || post.title, post.categoryEn || post.categoryTh, post.image)
            )}
          </div>
        </section>
      </section>
    </motion.div>
  );
}
