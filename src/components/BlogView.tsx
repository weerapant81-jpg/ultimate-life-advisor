import React, { useState, useEffect } from 'react';
import { ActiveTab, BlogPost, ImageSettings, VideoItem } from '../types';
import { Play, Search, Calendar, User, Clock, Check, Film, X, Plus, Trash2, Loader2, Sparkles, ChevronDown, Upload, Youtube, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchBlogPostById, fetchBlogPostPage, fetchLatestBlogPost, addBlogPost, deleteBlogPost, deleteVideoItem, fetchVideoItems, saveVideoItem, setFeaturedVideoItem, loginAdmin, logoutAdmin, watchAdminSession } from '../lib/firebase';

interface BlogViewProps {
  lang: 'EN' | 'TH';
  imageSettings?: ImageSettings;
  setActiveTab: (tab: ActiveTab) => void;
}

type BlogCategory = 'all' | 'investment' | 'retirement' | 'tax' | 'insurance' | 'education' | 'critical-illness' | 'unit-linked';

const createArticleSlug = (post: BlogPost) => {
  const base = post.titleEn || post.title || post.titleTh || post.id;
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return `${post.id}-${slug || 'article'}`;
};

const getArticleIdFromSlug = (slug: string) => slug.split('-')[0] || slug;
const BLOG_PAGE_SIZE = 9;

const getVideoIdFromUrl = (url?: string) => {
  if (!url?.trim()) return '';
  try {
    const parsed = new URL(url.trim());
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0] || '';
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/shorts/') || parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/').filter(Boolean)[1] || '';
      }
      return parsed.searchParams.get('v') || '';
    }
  } catch {
    return '';
  }
  return '';
};

const getYoutubeThumbnail = (url?: string) => {
  const videoId = getVideoIdFromUrl(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
};

const createVideoId = (title: string) => {
  const slug = title.trim().toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return `video-${slug || 'lesson'}-${Date.now().toString(36)}`;
};

const getPostTimestamp = (post: BlogPost) => {
  const candidates = [post.createdAt, post.dateEn, post.date, post.dateTh].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const parsed = Date.parse(candidate);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
};

const sortPostsByLatest = (items: BlogPost[]) =>
  [...items].sort((a, b) => {
    const timeDiff = getPostTimestamp(b) - getPostTimestamp(a);
    if (timeDiff !== 0) return timeDiff;
    return b.id.localeCompare(a.id);
  });

export default function BlogView({ lang, imageSettings = {}, setActiveTab }: BlogViewProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  // Firestore state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [nextPageCursor, setNextPageCursor] = useState<string | null>(null);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Write Article modal states
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BlogCategory>('investment');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newReadTime, setNewReadTime] = useState('5 นาที');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newExcerptEn, setNewExcerptEn] = useState('');
  const [newAuthorEn, setNewAuthorEn] = useState('');
  const [newReadTimeEn, setNewReadTimeEn] = useState('5 min');
  const [newContentEn, setNewContentEn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Video state
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isVideoAdminOpen, setIsVideoAdminOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoTitleTh, setVideoTitleTh] = useState('');
  const [videoTitleEn, setVideoTitleEn] = useState('');
  const [videoDescriptionTh, setVideoDescriptionTh] = useState('');
  const [videoDescriptionEn, setVideoDescriptionEn] = useState('');
  const [videoYoutubeUrl, setVideoYoutubeUrl] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoViews, setVideoViews] = useState('');
  const [isSavingVideo, setIsSavingVideo] = useState(false);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('weerapan.aia@hotmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [pendingAction, setPendingAction] = useState<'write' | null>(null);

  useEffect(() => {
    return watchAdminSession((allowed) => {
      setIsAdmin(allowed);
    });
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    try {
      await loginAdmin(adminEmail, adminPassword);
      setIsPasscodeModalOpen(false);
      setAdminPassword('');
      setPasscodeError('');
      if (pendingAction === 'write') {
        setIsWriteModalOpen(true);
        setPendingAction(null);
      }
    } catch (error) {
      console.error(error);
      setPasscodeError(lang === 'TH' ? 'อีเมลหรือรหัสผ่านแอดมินไม่ถูกต้อง' : 'Invalid admin email or password.');
    }
  };

  const handleAdminLogout = () => {
    logoutAdmin();
  };

  const categories = [
    { id: 'all' as BlogCategory, labelTh: 'ทั้งหมด', labelEn: 'All' },
    { id: 'investment' as BlogCategory, labelTh: 'การลงทุน', labelEn: 'Investment' },
    { id: 'retirement' as BlogCategory, labelTh: 'วางแผนเกษียณ', labelEn: 'Retirement' },
    { id: 'tax' as BlogCategory, labelTh: 'ภาษี', labelEn: 'Tax' },
    { id: 'insurance' as BlogCategory, labelTh: 'ประกันชีวิต', labelEn: 'Insurance' },
    { id: 'education' as BlogCategory, labelTh: 'ทุนการศึกษาบุตร', labelEn: 'Education' },
    { id: 'critical-illness' as BlogCategory, labelTh: 'ประกันโรคร้ายแรง', labelEn: 'Critical Illness' },
    { id: 'unit-linked' as BlogCategory, labelTh: 'ประกันควบการลงทุน', labelEn: 'Unit-Linked' },
  ];

  const categoryLabels: Record<BlogCategory, { th: string; en: string }> = {
    all: { th: 'ทั้งหมด', en: 'All' },
    investment: { th: 'การลงทุน', en: 'Investment' },
    retirement: { th: 'วางแผนเกษียณ', en: 'Retirement' },
    tax: { th: 'ภาษี', en: 'Tax' },
    insurance: { th: 'ประกันชีวิต', en: 'Insurance' },
    education: { th: 'ทุนการศึกษาบุตร', en: 'Education' },
    'critical-illness': { th: 'ประกันโรคร้ายแรง', en: 'Critical Illness' },
    'unit-linked': { th: 'ประกันควบการลงทุน', en: 'Unit-Linked' },
  };

  const getCategoryButtonLabel = (category: BlogCategory) => {
    const labels = categoryLabels[category];
    return lang === 'TH' ? labels.th : labels.en;
  };

  const getEnglishFallback = (post: BlogPost) => {
    const title = `${post.title || ''} ${post.titleTh || ''}`;
    const fallbackContent = (body: string) => `${body}\n\nThis article is part of Ultimate Life Advisor's bilingual knowledge base. The English version is prepared as an accessible summary for readers who prefer English, while the Thai version may include the original full advisory notes.`;

    if (title.includes('แนวโน้มตลาดทุนโลก')) {
      return {
        title: 'Global Capital Market Outlook 2026: Opportunities and Challenges in Wealth Management',
        date: 'July 1, 2026',
        excerpt: 'A practical look at portfolio strategy during volatile economic conditions, with techniques for managing interest-rate cycles and inflation risk.',
        content: fallbackContent('Global markets in 2026 remain shaped by higher policy rates, persistent inflation, and uneven growth across regions. Investors need a disciplined allocation process, stronger liquidity planning, and a broader view of assets beyond traditional portfolios. A resilient plan combines diversification, quality growth exposure, and active treasury management so families can protect purchasing power while staying ready for opportunity.'),
      };
    }

    if (title.includes('5 เคล็ดลับ')) {
      return {
        title: 'Five Practical Tips for Building a Sustainable Equity Portfolio',
        date: 'June 28, 2026',
        excerpt: 'Expert portfolio habits for selecting quality assets, staying diversified, and improving long-term compounding discipline.',
        content: fallbackContent('A durable equity portfolio starts with clear asset allocation, quality screening, and disciplined rebalancing. Investors should avoid chasing daily news, focus on companies with durable cash flow, and design tax-aware holding strategies that support long-term net returns.'),
      };
    }

    if (title.includes('อัตราดอกเบี้ยทบต้น')) {
      return {
        title: 'Compound Interest: The Quiet Engine Behind Long-Term Wealth',
        date: 'July 2, 2026',
        excerpt: 'Most people see interest as a return, but time and consistency are what turn modest savings into meaningful wealth.',
        content: fallbackContent('Compound interest works when returns are reinvested and given enough time to grow. Starting early, investing consistently, and avoiding unnecessary withdrawals can create a powerful difference in long-term financial outcomes.'),
      };
    }

    if (title.includes('ประกันเด็ก')) {
      return {
        title: 'Child Insurance Planning: Protection and Education Funding in One Conversation',
        date: 'July 2, 2026',
        excerpt: 'A short guide to using insurance planning to protect children while preparing future education capital.',
        content: fallbackContent('For families, child-focused insurance planning can combine protection, savings discipline, and education funding. The right structure depends on the child’s age, family income, existing coverage, and the future school or university target.'),
      };
    }

    if (title.includes('ออมเงินช้าไป 10 ปี')) {
      return {
        title: 'What Delaying Savings by 10 Years Can Cost You',
        date: 'July 2, 2026',
        excerpt: 'A look at the real cost of waiting, and why time is often the most valuable asset in personal finance.',
        content: fallbackContent('Waiting ten years to save can dramatically increase the monthly amount needed to reach the same goal. Time allows compounding to do more of the work, while delay forces income to carry a heavier burden later.'),
      };
    }

    if (title.includes('ประกันโรคร้ายแรง')) {
      return {
        title: 'Why Critical Illness Insurance Matters',
        date: 'July 2, 2026',
        excerpt: 'Critical illness coverage can protect income, savings, and family stability when medical risk becomes financial risk.',
        content: fallbackContent('Health insurance helps pay medical bills, but critical illness protection can provide liquidity for income replacement, travel, recovery, and family obligations. It is especially important when savings would otherwise be disrupted by a major diagnosis.'),
      };
    }

    if (title.includes('เงินเฟ้อค่ารักษา')) {
      return {
        title: 'Medical Inflation in Thailand: The Silent Risk to Family Wealth',
        date: 'July 2, 2026',
        excerpt: 'Healthcare costs can rise faster than general inflation, making protection planning an important part of wealth preservation.',
        content: fallbackContent('Medical inflation can reduce the real value of savings and create pressure on retirement plans. A strong protection plan reviews hospital coverage, benefit limits, family history, and long-term affordability.'),
      };
    }

    if (title.includes('เกษียณสำราญ')) {
      return {
        title: 'Retiring Well With the Power of Compound Interest',
        date: 'June 15, 2026',
        excerpt: 'Time is one of the strongest multipliers in retirement planning. Starting earlier can lower the monthly savings burden.',
        content: fallbackContent('Retirement planning becomes easier when saving and investing start early. Compound growth gives each contribution more time to work, while a delayed start usually requires higher monthly savings to reach the same retirement target.'),
      };
    }

    if (title.includes('สิทธิลดหย่อนภาษี')) {
      return {
        title: 'Thailand Tax Deduction Updates for 2026',
        date: 'June 10, 2026',
        excerpt: 'A planning overview of tax-deductible funds, insurance allowances, and how to organize contributions before year-end.',
        content: fallbackContent('Tax planning should begin early in the year so households can align deductions with cash flow and long-term goals. Common tools include retirement funds, Thai ESG funds, health insurance, and pension insurance, depending on current rules and personal suitability.'),
      };
    }

    return {};
  };

  const getPostCopy = (post: BlogPost) => {
    const labels = categoryLabels[post.category] || categoryLabels.investment;
    const englishFallback = getEnglishFallback(post);
    return {
      title: lang === 'TH' ? (post.titleTh || post.title || post.titleEn || '') : (post.titleEn || englishFallback.title || post.title || post.titleTh || ''),
      excerpt: lang === 'TH' ? (post.excerptTh || post.excerpt || post.excerptEn || '') : (post.excerptEn || englishFallback.excerpt || post.excerpt || post.excerptTh || ''),
      content: lang === 'TH' ? (post.contentTh || post.content || post.contentEn || '') : (post.contentEn || englishFallback.content || post.content || post.contentTh || ''),
      author: lang === 'TH' ? (post.authorTh || post.author || post.authorEn || '') : (post.authorEn || (englishFallback.title ? 'Ultimate Life Advisor' : '') || post.author || post.authorTh || ''),
      readTime: lang === 'TH' ? (post.readTimeTh || post.readTime || post.readTimeEn || '') : (post.readTimeEn || (post.readTime || '').replace('นาที', 'min') || post.readTimeTh || ''),
      date: lang === 'TH' ? (post.dateTh || post.date || post.dateEn || '') : (post.dateEn || englishFallback.date || post.date || post.dateTh || ''),
      category: lang === 'TH' ? (post.categoryTh || labels.th) : (post.categoryEn || labels.en),
    };
  };

  const getPostImage = (post: BlogPost) => imageSettings[`blog.${post.id}`] || post.image;

  useEffect(() => {
    if (!selectedArticle) return;
    const copy = getPostCopy(selectedArticle);
    const url = `${window.location.origin}/#/blog/${encodeURIComponent(createArticleSlug(selectedArticle))}`;
    const image = getPostImage(selectedArticle);
    document.title = `${copy.title} | Ultimate Life Advisor`;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', copy.excerpt);
    setMeta('meta[property="og:title"]', 'property', 'og:title', copy.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', copy.excerpt);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [selectedArticle, lang, imageSettings]);

  // Fetch blog posts on mount
  useEffect(() => {
    let active = true;
    const loadPosts = async () => {
      try {
        const [latest, firstPage] = await Promise.all([
          fetchLatestBlogPost(),
          fetchBlogPostPage(BLOG_PAGE_SIZE),
        ]);
        if (active) {
          setFeaturedPost(latest);
          setPosts(sortPostsByLatest(firstPage.posts));
          setNextPageCursor(firstPage.nextCursor);
          setHasMorePosts(firstPage.hasMore);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
        if (active) {
          setLoading(false);
        }
      }
    };
    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadVideos = async () => {
      const videos = await fetchVideoItems();
      if (active) setVideoItems(videos);
    };
    loadVideos();
    return () => {
      active = false;
    };
  }, []);

  const handleLoadMorePosts = async () => {
    if (loadingMore || !hasMorePosts) return;
    setLoadingMore(true);
    try {
      const nextPage = await fetchBlogPostPage(BLOG_PAGE_SIZE, nextPageCursor);
      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const nextPosts = nextPage.posts.filter((post) => !existingIds.has(post.id));
        return sortPostsByLatest([...prev, ...nextPosts]);
      });
      setNextPageCursor(nextPage.nextCursor);
      setHasMorePosts(nextPage.hasMore);
    } catch (err) {
      console.error('Failed to load more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (loading || typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('focusBlogSearch') !== 'true') return;

    const timer = window.setTimeout(() => {
      document.getElementById('blog-search-input')?.focus();
      window.sessionStorage.removeItem('focusBlogSearch');
    }, 100);

    return () => window.clearTimeout(timer);
  }, [loading]);

  // Filtering articles based on category & search query
  const filteredArticles = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const searchableText = [
      post.title,
      post.titleTh,
      post.titleEn,
      post.excerpt,
      post.excerptTh,
      post.excerptEn,
      post.content,
      post.contentTh,
      post.contentEn,
    ].filter(Boolean).join(' ').toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });

  useEffect(() => {
    if (!posts.length) return;
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash.startsWith('blog/')) return;
    const slug = decodeURIComponent(hash.split('/')[1] || '');
    const postId = getArticleIdFromSlug(slug);
    const matched = posts.find((post) => post.id === postId);
    if (matched) {
      setSelectedArticle(matched);
      return;
    }
    let active = true;
    fetchBlogPostById(postId).then((post) => {
      if (active && post) setSelectedArticle(post);
    });
    return () => {
      active = false;
    };
  }, [posts]);

  const openArticle = (post: BlogPost) => {
    setSelectedArticle(post);
    window.history.replaceState(null, '', `#/blog/${encodeURIComponent(createArticleSlug(post))}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    window.history.replaceState(null, '', '#/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareArticle = async (post: BlogPost) => {
    const copy = getPostCopy(post);
    const url = `${window.location.origin}/#/blog/${encodeURIComponent(createArticleSlug(post))}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: copy.title, text: copy.excerpt, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      alert(lang === 'TH' ? 'คัดลอกลิงก์บทความแล้ว' : 'Article link copied.');
    } catch {
      await navigator.clipboard?.writeText(url);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterSuccess(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url?.trim()) return '';

    try {
      const parsed = new URL(url.trim());
      let videoId = '';

      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.split('/').filter(Boolean)[0] || '';
      } else if (parsed.hostname.includes('youtube.com')) {
        if (parsed.pathname.startsWith('/shorts/') || parsed.pathname.startsWith('/embed/')) {
          videoId = parsed.pathname.split('/').filter(Boolean)[1] || '';
        } else {
          videoId = parsed.searchParams.get('v') || '';
        }
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch {
      return '';
    }
  };

  const getVideoCopy = (video: VideoItem) => ({
    title: lang === 'TH' ? (video.titleTh || video.title) : (video.titleEn || video.title),
    description: lang === 'TH'
      ? (video.descriptionTh || video.description || '')
      : (video.descriptionEn || video.description || ''),
  });

  const featuredVideo = videoItems.find((video) => video.isFeatured) || videoItems[0] || null;
  const relatedVideos = featuredVideo
    ? videoItems.filter((video) => video.id !== featuredVideo.id)
    : videoItems.slice(1);

  const resetVideoForm = () => {
    setEditingVideoId(null);
    setVideoTitleTh('');
    setVideoTitleEn('');
    setVideoDescriptionTh('');
    setVideoDescriptionEn('');
    setVideoYoutubeUrl('');
    setVideoThumbnail('');
    setVideoDuration('');
    setVideoViews('');
  };

  const startEditVideo = (video: VideoItem) => {
    setEditingVideoId(video.id);
    setVideoTitleTh(video.titleTh || video.title);
    setVideoTitleEn(video.titleEn || video.title);
    setVideoDescriptionTh(video.descriptionTh || video.description || '');
    setVideoDescriptionEn(video.descriptionEn || video.description || '');
    setVideoYoutubeUrl(video.youtubeUrl || '');
    setVideoThumbnail(video.thumbnail || getYoutubeThumbnail(video.youtubeUrl));
    setVideoDuration(video.duration || '');
    setVideoViews(video.views || '');
    setIsVideoAdminOpen(true);
  };

  const handleSaveVideo = async (event: React.FormEvent) => {
    event.preventDefault();
    const thumbnail = videoThumbnail.trim() || getYoutubeThumbnail(videoYoutubeUrl);
    if (!videoTitleTh.trim() || !videoTitleEn.trim() || !videoYoutubeUrl.trim() || !getYoutubeEmbedUrl(videoYoutubeUrl)) {
      alert(lang === 'TH' ? 'กรุณากรอกชื่อวิดีโอทั้งสองภาษาและลิงก์ YouTube ที่ถูกต้อง' : 'Please add bilingual video titles and a valid YouTube link.');
      return;
    }

    setIsSavingVideo(true);
    try {
      const finalVideo: VideoItem = {
        id: editingVideoId || createVideoId(videoTitleEn || videoTitleTh),
        title: videoTitleTh.trim(),
        titleTh: videoTitleTh.trim(),
        titleEn: videoTitleEn.trim(),
        description: videoDescriptionTh.trim(),
        descriptionTh: videoDescriptionTh.trim(),
        descriptionEn: videoDescriptionEn.trim(),
        youtubeUrl: videoYoutubeUrl.trim(),
        thumbnail,
        duration: videoDuration.trim() || '00:00',
        views: videoViews.trim() || '0 views',
        order: editingVideoId
          ? videoItems.findIndex((video) => video.id === editingVideoId)
          : videoItems.length,
        isFeatured: editingVideoId
          ? videoItems.find((video) => video.id === editingVideoId)?.isFeatured
          : videoItems.length === 0,
        createdAt: new Date().toISOString(),
      };
      const savedVideo = await saveVideoItem(finalVideo);
      setVideoItems((prev) => {
        const exists = prev.some((video) => video.id === savedVideo.id);
        const next = exists
          ? prev.map((video) => (video.id === savedVideo.id ? savedVideo : video))
          : [...prev, savedVideo];
        return [...next].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      });
      resetVideoForm();
    } catch (error) {
      console.error(error);
      alert(lang === 'TH' ? 'บันทึกวิดีโอไม่สำเร็จ' : 'Unable to save video.');
    } finally {
      setIsSavingVideo(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm(lang === 'TH' ? 'ต้องการลบวิดีโอนี้ใช่ไหม?' : 'Delete this video?')) return;
    await deleteVideoItem(id);
    setVideoItems((prev) => prev.filter((video) => video.id !== id));
    if (selectedVideo?.id === id) setSelectedVideo(null);
  };

  const handleSetFeaturedVideo = async (id: string) => {
    await setFeaturedVideoItem(id);
    setVideoItems((prev) => prev.map((video) => ({ ...video, isFeatured: video.id === id })));
  };

  const resizeImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxSide = 1400;
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'TH' ? 'กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น' : 'Please upload an image file only.');
      event.target.value = '';
      return;
    }

    try {
      const resizedDataUrl = await resizeImageFile(file);
      if (resizedDataUrl.length > 850_000) {
        alert(lang === 'TH' ? 'รูปภาพยังมีขนาดใหญ่เกินไป กรุณาเลือกรูปที่เล็กลงหรือใช้ลิงก์รูปภาพแทน' : 'The image is still too large. Please choose a smaller image or use an image URL instead.');
        event.target.value = '';
        return;
      }
      setNewImageUrl(resizedDataUrl);
    } catch {
      alert(lang === 'TH' ? 'ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ กรุณาลองไฟล์อื่น' : 'Unable to read this image. Please try another file.');
      event.target.value = '';
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExcerpt.trim() || !newContent.trim() || !newAuthor.trim() || !newTitleEn.trim() || !newExcerptEn.trim() || !newContentEn.trim() || !newAuthorEn.trim()) {
      alert(lang === 'TH' ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please fill out all required fields.');
      return;
    }

    if (newYoutubeUrl.trim() && !getYoutubeEmbedUrl(newYoutubeUrl)) {
      alert(lang === 'TH' ? 'กรุณาใส่ลิงก์ YouTube ที่ถูกต้อง เช่น youtube.com/watch?v=... หรือ youtu.be/...' : 'Please enter a valid YouTube link, such as youtube.com/watch?v=... or youtu.be/...');
      return;
    }

    setIsSubmitting(true);

    const categoryThMap: Record<string, string> = {
      all: 'ทั้งหมด',
      investment: 'การลงทุน',
      retirement: 'วางแผนเกษียณ',
      tax: 'ภาษี',
      insurance: 'ประกันชีวิต',
      education: 'ทุนการศึกษาบุตร',
      'critical-illness': 'ประกันโรคร้ายแรง',
      'unit-linked': 'ประกันควบการลงทุน',
    };

    const youtubeUrl = newYoutubeUrl.trim();
    const today = new Date();
    const dateTh = today.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const dateEn = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const categoryLabel = categoryLabels[newCategory];
    const newPost: Omit<BlogPost, 'id'> = {
      createdAt: today.toISOString(),
      title: newTitle,
      titleTh: newTitle,
      titleEn: newTitleEn,
      category: newCategory as BlogPost['category'],
      categoryTh: categoryThMap[newCategory] || 'การลงทุน',
      categoryEn: categoryLabel.en,
      excerpt: newExcerpt,
      excerptTh: newExcerpt,
      excerptEn: newExcerptEn,
      date: lang === 'TH' ? dateTh : dateEn,
      dateTh,
      dateEn,
      author: newAuthor,
      authorTh: newAuthor,
      authorEn: newAuthorEn,
      readTime: newReadTime,
      readTimeTh: newReadTime,
      readTimeEn: newReadTimeEn,
      image: newImageUrl,
      content: newContent,
      contentTh: newContent,
      contentEn: newContentEn,
      ...(youtubeUrl ? { youtubeUrl } : {})
    };

    try {
      const savedPost = await addBlogPost(newPost);
      setPosts((prev) => sortPostsByLatest([savedPost, ...prev]));
      setFeaturedPost(savedPost);
      setIsWriteModalOpen(false);
      
      // Reset form
      setNewTitle('');
      setNewTitleEn('');
      setNewExcerpt('');
      setNewExcerptEn('');
      setNewContent('');
      setNewContentEn('');
      setNewAuthor('');
      setNewAuthorEn('');
      setNewReadTimeEn('5 min');
      setNewReadTime('5 นาที');
      setNewImageUrl('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800');
      setNewYoutubeUrl('');
    } catch (err) {
      console.error('Failed to add blog post:', err);
      alert(lang === 'TH' ? 'เกิดข้อผิดพลาดในการบันทึกบทความ' : 'Failed to save the article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (featuredPost?.id === id) {
        setFeaturedPost(await fetchLatestBlogPost());
      }
    } catch (err) {
      console.error('Failed to delete blog post:', err);
      alert(lang === 'TH' ? 'เกิดข้อผิดพลาดในการลบบทความ' : 'Failed to delete the article.');
    }
  };

  const activeCategoryItem = categories.find((c) => c.id === activeCategory) || categories[0];
  const activeCategoryCount = activeCategory === 'all' 
    ? posts.length 
    : posts.filter((p) => p.category === activeCategory).length;

  if (selectedArticle) {
    const articleCopy = getPostCopy(selectedArticle);
    const embedUrl = getYoutubeEmbedUrl(selectedArticle.youtubeUrl);

    return (
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-brand-cream text-brand-charcoal"
        id="blog-article-fullpage"
      >
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <button
              type="button"
              onClick={closeArticle}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{lang === 'TH' ? 'กลับไปหน้าบทความ' : 'Back to articles'}</span>
            </button>
            <button
              type="button"
              onClick={() => shareArticle(selectedArticle)}
              className="ml-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              {lang === 'TH' ? 'แชร์บทความ' : 'Share article'}
            </button>

            <div className="mt-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
                <span className="rounded-full bg-brand-orange px-3 py-1 font-bold uppercase text-white">
                  {articleCopy.category}
                </span>
                <span>{articleCopy.date}</span>
                <span>{articleCopy.readTime}</span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-brand-charcoal">
                {articleCopy.title}
              </h1>

              <p className="max-w-3xl text-base md:text-lg leading-relaxed text-slate-600">
                {articleCopy.excerpt}
              </p>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 font-mono font-bold text-brand-orange">
                  {articleCopy.author.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{articleCopy.author}</p>
                  <p className="text-xs text-slate-500">Ultimate Life Advisor</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
            <img
              src={getPostImage(selectedArticle)}
              alt={articleCopy.title}
              className="h-[320px] md:h-[520px] w-full object-cover"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </div>

          {selectedArticle.youtubeUrl && embedUrl && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
              <div className="aspect-video w-full">
                <iframe
                  src={embedUrl}
                  title={articleCopy.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-10 shadow-xs">
            <div className="prose prose-slate max-w-none text-[15px] md:text-base leading-8 whitespace-pre-wrap">
              {articleCopy.content}
            </div>
          </div>
        </section>
      </motion.article>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-brand-cream min-h-screen text-brand-charcoal"
      id="blog-view-container"
    >
      {/* 1. Header Banner & Featured Article (Screen 4 Hero) */}
      <section className="bg-brand-dark text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-brand-slate pb-8 gap-4">
            <div>
              <span 
                onClick={() => {
                  if (!isAdmin) {
                    setPendingAction('write');
                    setIsPasscodeModalOpen(true);
                  }
                }}
                className="text-brand-orange text-xs font-mono font-semibold tracking-widest uppercase block mb-1 cursor-pointer select-none"
                title={lang === 'TH' ? 'คลิกเพื่อเข้าสู่ระบบแอดมิน' : 'Click to login as admin'}
              >
                KNOWLEDGE & VIDEO HUB
              </span>
              <h2 className="font-serif text-3xl font-bold">
                {lang === 'TH' ? 'ข่าวและบทความ' : 'Knowledge Base'}
              </h2>
            </div>
            
            {/* Search and Write Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center max-w-lg w-full">
              <div className="relative flex-1">
                <input
                  id="blog-search-input"
                  type="text"
                  placeholder={lang === 'TH' ? 'ค้นหาบทความวิชาการ...' : 'Search articles...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-slate/80 border border-brand-slate rounded-lg py-2.5 pl-10 pr-4 text-xs font-sans text-white focus:outline-hidden focus:border-brand-orange"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>

              {/* Add Post Button with Admin Authentication */}
              {isAdmin && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setNewAuthor(lang === 'TH' ? 'ทีมวิเคราะห์ Ultimate Life' : 'Ultimate Life Analyst Team');
                      setIsWriteModalOpen(true);
                    }}
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold font-mono uppercase px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'TH' ? 'เขียนบทความ' : 'Write Article'}</span>
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="bg-brand-slate hover:bg-brand-slate/80 text-gray-300 hover:text-white text-xs font-bold font-mono uppercase px-3 py-2.5 rounded-lg border border-brand-slate flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    title={lang === 'TH' ? 'ออกจากระบบแอดมิน' : 'Logout Admin'}
                  >
                    <span>{lang === 'TH' ? 'ออก' : 'Logout'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 2. Video Knowledge Segment */}
      <section className="bg-brand-charcoal text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-brand-slate">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Video Hero */}
          <div className="lg:col-span-7 space-y-6 lg:pt-[30px]">
            {isAdmin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    resetVideoForm();
                    setIsVideoAdminOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 px-4 py-2 text-xs font-bold text-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  {lang === 'TH' ? 'จัดการวิดีโอ' : 'Manage Videos'}
                </button>
              </div>
            )}

            {false && (
            <>
            <h3 className="hidden font-serif text-2.5xl md:text-3.5xl font-bold leading-tight text-white">
              {lang === 'TH' ? 'ซีรีส์พิเศษ: พลิกวิกฤตเป็นโอกาสในการลงทุนต่างประเทศ' : 'Masterclass: International High-Yield Investing'}
            </h3>
            
            <p className="hidden text-sm text-gray-400 max-w-xl font-sans">
              {lang === 'TH'
                ? 'ร่วมฟังบทวิเคราะห์พิเศษจาก Marcus Thorne และสภาที่ปรึกษา เจาะลึกการวางโครงสร้างบัญชีนอกอาณาเขต (Offshore Account) และแนวทางการจัดการสินทรัพย์ต้านภาวะภูมิรัฐศาสตร์ผันผวน'
                : 'Learn real asset custody allocation with our CIO. Stream exclusive offshore structural frameworks, private banking validations, and international dividend audits.'}
            </p>
            </>
            )}

            {/* Video Player Box Mockup */}
            <div 
              onClick={() => featuredVideo && setSelectedVideo(featuredVideo)}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-brand-slate h-[360px] md:h-[430px] xl:h-[460px] group cursor-pointer"
            >
              <img 
                src={featuredVideo?.thumbnail || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800'}
                alt={featuredVideo ? getVideoCopy(featuredVideo).title : 'Video stream'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-dark/40 flex items-center justify-center group-hover:bg-brand-dark/30 transition-colors">
                <span className="w-16 h-16 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-dark to-transparent flex justify-between items-center text-xs font-mono">
                <span className="text-gray-200 font-semibold">{featuredVideo?.duration || 'Video lesson'}</span>
                <span className="bg-brand-orange px-2 py-0.5 rounded text-white font-bold">YOUTUBE</span>
              </div>
            </div>
          </div>

          {/* Secondary Video list */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-display font-semibold text-sm tracking-widest text-gray-400 uppercase leading-none">
              {lang === 'TH' ? 'วิดีโอความรู้อื่น ๆ' : 'RELATED DISCUSSIONS'}
            </h4>
            
            <div className="space-y-4" id="related-videos-container">
              {relatedVideos.length > 0 ? relatedVideos.map((video) => {
                const videoCopy = getVideoCopy(video);
                return (
                <div 
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="bg-brand-slate p-4 rounded-xl border border-brand-slate flex space-x-4 cursor-pointer hover:border-brand-orange/60 hover:bg-brand-slate/80 transition-colors"
                >
                  <div className="w-24 h-16 rounded overflow-hidden relative shrink-0">
                    <img 
                      src={video.thumbnail} 
                      alt={videoCopy.title} 
                      className="w-full h-full object-cover filter brightness-95"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </span>
                  </div>

                  <div className="flex flex-col justify-between py-1">
                    <h5 className="font-sans text-xs font-semibold text-white leading-snug line-clamp-2">
                      {videoCopy.title}
                    </h5>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>{video.duration}</span>
                      <span>{video.views}</span>
                    </div>
                  </div>
                </div>
                );
              }) : (
                <div className="rounded-xl border border-brand-slate bg-brand-slate/60 p-5 text-sm text-gray-400">
                  {lang === 'TH' ? 'ยังไม่มีวิดีโอเพิ่มเติม' : 'No related videos yet.'}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>


      {/* 3. Featured Article */}
      <section className="bg-brand-cream text-brand-charcoal py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Featured Hero Box */}
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center animate-pulse flex flex-col items-center justify-center h-80 lg:h-[450px] border border-slate-100 shadow-sm">
              <Loader2 className="w-8 h-8 text-brand-orange animate-spin mb-4" />
              <p className="text-sm text-gray-400 font-mono">
                {lang === 'TH' ? 'กำลังโหลดบทความจากฐานข้อมูล Cloud Firestore...' : 'Loading articles from Cloud Firestore...'}
              </p>
            </div>
          ) : featuredPost ? (
            (() => {
              const featuredCopy = getPostCopy(featuredPost);
              return (
            <div
              id="featured-blog-box"
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/70 grid grid-cols-1 lg:grid-cols-12 gap-0 relative group"
            >
              {/* Image */}
              <div className="lg:col-span-7 h-80 lg:h-[450px] relative overflow-hidden">
                <img 
                  src={getPostImage(featuredPost)} 
                  alt={featuredCopy.title} 
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-101 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                {featuredPost.youtubeUrl && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-lg">
                    <Youtube className="h-3.5 w-3.5" />
                    Video
                  </span>
                )}
              </div>

              {/* Info Block */}
              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-8 bg-white">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 bg-brand-orange/20 text-brand-orange text-[10px] font-mono rounded font-bold uppercase">
                    {featuredCopy.category}
                  </span>
                  <h3 
                    className="font-serif text-2xl md:text-3xl font-bold text-brand-charcoal leading-tight hover:text-brand-orange transition-colors cursor-pointer" 
                    onClick={() => openArticle(featuredPost)}
                  >
                    {featuredCopy.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    {featuredCopy.excerpt}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-100 text-xs font-mono text-slate-500">
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{featuredCopy.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredCopy.readTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => openArticle(featuredPost)}
                  className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold py-3.5 rounded-lg text-xs tracking-wider font-display uppercase transition-all"
                >
                  {lang === 'TH' ? 'อ่านเนื้อหาทั้งหมด' : 'READ MORE ARTICLE'}
                </button>
              </div>
            </div>
              );
            })()
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center justify-center h-80 border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 font-mono">
                {lang === 'TH' ? 'ยังไม่มีบทความในระบบ' : 'No featured articles in the system.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Knowledge Hub Tab Filtered Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Sidebar + Content Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" id="knowledge-hub-layout">
          {/* Sidebar Section */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 bg-slate-50/70 rounded-2xl p-6 border border-slate-100 space-y-6" id="blog-sidebar">
            <div className="space-y-1">
              <h3 className="font-serif text-sm font-bold text-brand-charcoal uppercase tracking-wider">
                {lang === 'TH' ? 'หมวดหมู่บทความ' : 'Categories'}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">
                {lang === 'TH' ? 'เลือกหมวดหมู่ที่ท่านสนใจ' : 'Filter by topics'}
              </p>
            </div>

            {/* Category Buttons/Links List */}
            {/* Desktop Layout (always visible on lg and above) */}
            <div className="hidden lg:flex lg:flex-col gap-1.5" id="desktop-categories-nav">
              {categories.map((cat) => {
                const count = cat.id === 'all' 
                  ? posts.length 
                  : posts.filter((p) => p.category === cat.id).length;

                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left w-full group ${
                      isActive
                        ? 'bg-brand-charcoal text-white font-semibold shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-gray-600 hover:text-black border border-slate-100'
                    }`}
                  >
                    <span>{getCategoryButtonLabel(cat.id)}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                      isActive 
                        ? 'bg-brand-orange text-white' 
                        : 'bg-slate-100 text-gray-400 group-hover:bg-slate-200'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Layout (dropdown style, visible below lg) */}
            <div className="lg:hidden relative w-full" id="mobile-categories-dropdown">
              {/* Active Category Bar Button (Click to Toggle) */}
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-semibold bg-brand-charcoal text-white shadow-sm w-full cursor-pointer transition-all border border-brand-slate/10"
              >
                <div className="flex items-center gap-2">
                  <span>{getCategoryButtonLabel(activeCategoryItem.id)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-orange text-white font-bold">
                    {activeCategoryCount}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Dropdown Options List */}
              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setIsCategoryDropdownOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-0 right-0 mt-2 z-30 bg-white rounded-xl border border-slate-150 shadow-xl p-2 flex flex-col gap-1 max-h-[320px] overflow-y-auto"
                    >
                      {categories.map((cat) => {
                        const count = cat.id === 'all' 
                          ? posts.length 
                          : posts.filter((p) => p.category === cat.id).length;
                        
                        const isActive = activeCategory === cat.id;

                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setActiveCategory(cat.id);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                              isActive
                                ? 'bg-slate-100 text-brand-charcoal font-semibold'
                                : 'hover:bg-slate-50 text-gray-600 hover:text-black'
                            }`}
                          >
                            <span>{getCategoryButtonLabel(cat.id)}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isActive 
                                ? 'bg-brand-orange text-white' 
                                : 'bg-slate-100 text-gray-400'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* Articles Section */}
          <div className="lg:col-span-9 space-y-6" id="articles-content-area">
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="articles-grid-container">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-white rounded-xl h-96 border border-slate-100 animate-pulse p-6 flex flex-col justify-between">
                    <div className="h-48 bg-slate-200 rounded-lg w-full mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-5 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                    </div>
                    <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
                  </div>
                ))
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((post) => {
                  const postCopy = getPostCopy(post);
                  return (
                  <motion.article 
                    key={post.id}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col cursor-pointer relative group"
                  >
                    {/* Delete Button (Only visible to authenticated Admin) */}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(lang === 'TH' ? `คุณแน่ใจหรือไม่ว่าต้องการลบบทความ "${postCopy.title}"?` : `Are you sure you want to delete "${postCopy.title}"?`)) {
                            handleDeletePost(post.id);
                          }
                        }}
                        className="absolute top-4 right-4 z-10 p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        title={lang === 'TH' ? 'ลบบทความ' : 'Delete Article'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="h-48 overflow-hidden relative" onClick={() => openArticle(post)}>
                      <img 
                        src={getPostImage(post)} 
                        alt={postCopy.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 px-2.5 py-1 bg-brand-charcoal/80 backdrop-blur-xs text-[10px] font-mono text-brand-orange rounded uppercase font-bold">
                        {postCopy.category}
                      </span>
                      {post.youtubeUrl && (
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-lg">
                          <Youtube className="h-3 w-3" />
                          Video
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between" onClick={() => openArticle(post)}>
                      <div className="space-y-3">
                        <span className="text-[10px] text-gray-400 font-mono block">{post.date}</span>
                        <h3 className="font-serif font-bold text-lg text-brand-charcoal leading-snug line-clamp-2 hover:text-brand-orange transition-colors">
                          {postCopy.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-sans line-clamp-3 leading-relaxed">
                          {postCopy.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 text-[11px] text-gray-400 font-mono">
                        <span className="font-medium text-slate-700">{postCopy.author}</span>
                        <span>{postCopy.readTime}</span>
                      </div>
                    </div>
                  </motion.article>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-12 text-gray-400 font-mono text-sm bg-white rounded-2xl border border-slate-100 shadow-xs">
                  {lang === 'TH' ? 'ไม่พบข้อมูลบทความตามหมวดหมู่หรือคำค้นหาที่เลือก' : 'No articles found matching the criteria.'}
                </div>
              )}
            </div>
            {!loading && hasMorePosts && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleLoadMorePosts}
                  disabled={loadingMore}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-xs font-display font-bold uppercase tracking-[0.14em] text-brand-charcoal shadow-xs transition-colors hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                  {lang === 'TH' ? 'โหลดบทความเพิ่มเติม' : 'Load more articles'}
                </button>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* 4. Appointment CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 text-brand-orange">
          <Calendar className="w-6 h-6" />
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-3xl font-bold">
            {lang === 'TH' ? 'นัดหมายที่ปรึกษาเพื่อวางแผนการเงิน' : 'Book a Financial Advisory Session'}
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {lang === 'TH'
              ? 'หากต้องการนำความรู้จากบทความไปปรับใช้กับแผนของคุณ ให้ทีมที่ปรึกษาช่วยประเมินเป้าหมายและแนวทางที่เหมาะสม'
              : 'Turn these insights into a plan tailored to your goals. Our advisory team can help review your needs and next steps.'}
          </p>
        </div>
        
        <div className="hidden">
          <h3 className="font-serif text-3xl font-bold">
            {lang === 'TH' ? 'รับข่าวสารและความรู้ทางการเงิน' : 'Subscribe to Strategic Digests'}
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {lang === 'TH'
              ? 'ไม่พลาดบทวิเคราะห์ สถิติภาษี และแผนเกษียณอัปเดตใหม่ล่าสุด ส่งตรงถึงกล่องข้อความคุณฟรีทุกสัปดาห์'
              : 'Join our weekly premium mailing list to receive macroeconomic briefs and portfolio audit updates.'}
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="hidden">
          <input
            type="email"
            required
            placeholder={lang === 'TH' ? 'กรอกอีเมลของคุณ...' : 'Enter your professional email...'}
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-hidden focus:border-brand-orange font-sans"
          />
          <button
            type="submit"
            className="bg-brand-charcoal hover:bg-black text-white px-6 py-3 rounded-lg font-display font-bold text-xs tracking-wider uppercase transition-colors"
          >
            {lang === 'TH' ? 'ติดตามรับความรู้' : 'SUBSCRIBE'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setActiveTab(ActiveTab.Contact)}
          className="inline-flex items-center justify-center rounded-lg bg-brand-charcoal px-8 py-4 font-display text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-black"
        >
          {lang === 'TH' ? 'นัดหมายที่ปรึกษา' : 'Book an Advisor'}
        </button>

        {newsletterSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-emerald-600 flex items-center justify-center space-x-1"
          >
            <Check className="w-4 h-4" />
            <span>
              {lang === 'TH' ? 'ขอบคุณที่สมัครรับข่าวสาร! กรุณาตรวจสอบอีเมลยืนยันของคุณ' : 'Thank you! You are subscribed to our wealth digests.'}
            </span>
          </motion.div>
        )}
      </section>

      {/* Article Detail Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="blog-reader-modal">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200 shadow-2xl relative"
            >
              {/* Sticky Close Header */}
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={closeArticle}
                  className="p-2 bg-black/40 text-white hover:bg-black/60 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content wrapper */}
              <div className="overflow-y-auto flex-1">
                <div className="h-64 md:h-80 w-full relative">
                  <img 
                    src={getPostImage(selectedArticle)} 
                    alt={selectedArticle.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                  {selectedArticle.youtubeUrl && (
                    <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-lg">
                      <Youtube className="h-3.5 w-3.5" />
                      YouTube Video
                    </span>
                  )}
                </div>

                <div className="p-8 md:p-12 space-y-6">
                  <div className="flex flex-wrap gap-4 items-center text-xs text-gray-400 font-mono">
                    <span className="bg-brand-orange text-white px-2.5 py-0.5 rounded uppercase font-bold text-[9px]">
                      {selectedArticle.categoryTh}
                    </span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>

                  <h3 className="font-serif text-2.5xl md:text-3.5xl font-bold leading-tight text-brand-charcoal">
                    {selectedArticle.title}
                  </h3>

                  <div className="flex items-center space-x-3 py-4 border-y border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-brand-orange font-mono">
                      {selectedArticle.author.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedArticle.author}</p>
                      <span className="text-[10px] text-gray-400 font-mono">Senior Content Advisor • Ultimate Life</span>
                    </div>
                  </div>

                  {selectedArticle.youtubeUrl && getYoutubeEmbedUrl(selectedArticle.youtubeUrl) && (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
                      <div className="aspect-video w-full">
                        <iframe
                          src={getYoutubeEmbedUrl(selectedArticle.youtubeUrl)}
                          title={selectedArticle.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 leading-relaxed font-sans space-y-4 whitespace-pre-wrap pt-4">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>

              {/* Footer of modal */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-gray-400">© 2026 Ultimate Life Advisor</span>
                <button
                  onClick={closeArticle}
                  className="bg-brand-charcoal text-white hover:bg-black px-4 py-2 rounded-lg font-bold font-mono text-[10px] uppercase transition-colors"
                >
                  {lang === 'TH' ? 'ปิดหน้านี้' : 'CLOSE ARTICLE'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video stream Modal player */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" id="video-stream-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-dark border border-brand-slate rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 p-2 bg-brand-slate text-gray-400 hover:text-white rounded-full z-10 transition-colors"
                title={lang === 'TH' ? 'ปิดวิดีโอ' : 'Close Video'}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center space-x-2 text-brand-orange">
                  <Film className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase">
                    {lang === 'TH' ? 'วิดีโอสัมมนาพิเศษ' : 'EXPERT VIDEO SERIES'}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white leading-tight">
                  {getVideoCopy(selectedVideo).title}
                </h3>
                
                {/* Mock Video player container */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-brand-slate flex items-center justify-center group mt-4">
                  <img 
                    src={selectedVideo.thumbnail} 
                    alt={getVideoCopy(selectedVideo).title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[2px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  
                  {/* Play Interface overlay */}
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                    <span className="text-xs font-mono text-gray-300 bg-brand-dark/80 px-3 py-1.5 rounded-full border border-brand-slate">
                      {lang === 'TH' ? `ความยาว ${selectedVideo.duration}` : `Duration ${selectedVideo.duration}`}
                    </span>
                  </div>

                  {/* Simulated timeline/controls bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-black/0 z-10 flex flex-col space-y-2">
                    <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                      <div className="bg-brand-orange h-full w-1/3" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                      <span>00:00 / {selectedVideo.duration}</span>
                      <span>{selectedVideo.views}</span>
                    </div>
                  </div>
                  {getYoutubeEmbedUrl(selectedVideo.youtubeUrl) && (
                    <iframe
                      src={getYoutubeEmbedUrl(selectedVideo.youtubeUrl)}
                      title={getVideoCopy(selectedVideo).title}
                      className="absolute inset-0 z-20 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>

                <p className="text-xs text-gray-400 font-sans leading-relaxed pt-2">
                  {lang === 'TH' 
                    ? '* นี่คือวิดีโอหลักสูตรสัมมนาพรีเมียมเฉพาะสมาชิกของ Ultimate Life Advisor ท่านสามารถติดต่อที่ปรึกษาการเงินส่วนบุคคลเพื่อขอรับสิทธิ์รับชมแบบเต็มรูปแบบ' 
                    : '* This is a premium expert video series for Ultimate Life Advisor members. Please contact your planner to unlock full access.'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Admin Modal */}
      <AnimatePresence>
        {isVideoAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                    {lang === 'TH' ? 'จัดการวิดีโอความรู้' : 'Video Library'}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-brand-charcoal">
                    {editingVideoId
                      ? (lang === 'TH' ? 'แก้ไขวิดีโอ' : 'Edit video')
                      : (lang === 'TH' ? 'เพิ่มวิดีโอใหม่' : 'Add new video')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsVideoAdminOpen(false);
                    resetVideoForm();
                  }}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-8 p-6 lg:grid-cols-[1fr_1.25fr]">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-brand-charcoal">
                    {lang === 'TH' ? 'วิดีโอทั้งหมด' : 'All videos'}
                  </h4>
                  <div className="space-y-3">
                    {videoItems.map((video) => {
                      const videoCopy = getVideoCopy(video);
                      return (
                        <div key={video.id} className="rounded-xl border border-slate-100 p-3">
                          <div className="flex gap-3">
                            <img
                              src={video.thumbnail}
                              alt={videoCopy.title}
                              className="h-16 w-24 rounded-lg object-cover"
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-sm font-bold text-brand-charcoal">{videoCopy.title}</p>
                              <p className="mt-1 text-xs text-slate-500">{video.duration} · {video.views}</p>
                              {video.isFeatured && (
                                <span className="mt-2 inline-flex rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-brand-orange">
                                  {lang === 'TH' ? 'วิดีโอเด่น' : 'Featured'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEditVideo(video)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange"
                            >
                              {lang === 'TH' ? 'แก้ไข' : 'Edit'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetFeaturedVideo(video.id)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange"
                            >
                              {lang === 'TH' ? 'ตั้งเป็นเด่น' : 'Set featured'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVideo(video.id)}
                              className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                            >
                              {lang === 'TH' ? 'ลบ' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSaveVideo} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Title TH *</span>
                      <input
                        value={videoTitleTh}
                        onChange={(event) => setVideoTitleTh(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden"
                        placeholder="ชื่อวิดีโอภาษาไทย"
                        required
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Title EN *</span>
                      <input
                        value={videoTitleEn}
                        onChange={(event) => setVideoTitleEn(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden"
                        placeholder="English video title"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Description TH</span>
                      <textarea
                        value={videoDescriptionTh}
                        onChange={(event) => setVideoDescriptionTh(event.target.value)}
                        className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden"
                        placeholder="คำอธิบายวิดีโอภาษาไทย"
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Description EN</span>
                      <textarea
                        value={videoDescriptionEn}
                        onChange={(event) => setVideoDescriptionEn(event.target.value)}
                        className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden"
                        placeholder="English video description"
                      />
                    </label>
                  </div>

                  <label className="space-y-1.5 block">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">YouTube URL *</span>
                    <input
                      value={videoYoutubeUrl}
                      onChange={(event) => {
                        setVideoYoutubeUrl(event.target.value);
                        if (!videoThumbnail) setVideoThumbnail(getYoutubeThumbnail(event.target.value));
                      }}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </label>

                  <label className="space-y-1.5 block">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {lang === 'TH' ? 'ลิงก์ภาพปก หรือปล่อยว่างเพื่อใช้ภาพจาก YouTube' : 'Thumbnail URL, or leave blank to use YouTube thumbnail'}
                    </span>
                    <input
                      value={videoThumbnail}
                      onChange={(event) => setVideoThumbnail(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden"
                      placeholder="https://..."
                    />
                  </label>

                  {(videoThumbnail || getYoutubeThumbnail(videoYoutubeUrl)) && (
                    <img
                      src={videoThumbnail || getYoutubeThumbnail(videoYoutubeUrl)}
                      alt="Video preview"
                      className="h-48 w-full rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {lang === 'TH' ? 'ระยะเวลา' : 'Duration'}
                      </span>
                      <input
                        value={videoDuration}
                        onChange={(event) => setVideoDuration(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden"
                        placeholder="12:30"
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {lang === 'TH' ? 'ยอดวิว' : 'Views'}
                      </span>
                      <input
                        value={videoViews}
                        onChange={(event) => setVideoViews(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-hidden"
                        placeholder="1.2K views"
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                    {editingVideoId && (
                      <button
                        type="button"
                        onClick={resetVideoForm}
                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                      >
                        {lang === 'TH' ? 'เพิ่มรายการใหม่' : 'New item'}
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSavingVideo}
                      className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
                    >
                      {isSavingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      {lang === 'TH' ? 'บันทึกวิดีโอ' : 'Save video'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write Article Modal Form */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" id="write-article-modal">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-brand-charcoal text-white rounded-2xl border border-brand-slate overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
            >
              <form onSubmit={handleCreatePost} className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-brand-slate flex justify-between items-center bg-brand-dark">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-brand-orange animate-pulse" />
                    <h3 className="font-serif text-lg font-bold text-white">
                      {lang === 'TH' ? 'เขียนบทความวิชาการใหม่' : 'Create New Scholarly Article'}
                    </h3>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="p-1.5 hover:bg-brand-slate text-gray-400 hover:text-white rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Fields wrapper */}
                <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-5">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                      {lang === 'TH' ? 'ชื่อบทความ *' : 'Article Title *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={lang === 'TH' ? 'ระบุชื่อบทความที่กระชับและน่าสนใจ...' : 'Enter article title...'}
                      className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                      Article Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      placeholder="Enter the English article title..."
                      className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                    />
                  </div>

                  {/* Author & Read Time (Row) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        {lang === 'TH' ? 'ผู้เขียน *' : 'Author *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder={lang === 'TH' ? 'ชื่อผู้เขียนหรือทีมวิเคราะห์...' : 'Enter author name...'}
                        className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        {lang === 'TH' ? 'เวลาในการอ่าน' : 'Read Time'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newReadTime}
                        onChange={(e) => setNewReadTime(e.target.value)}
                        placeholder={lang === 'TH' ? 'เช่น 5 นาที' : 'e.g. 5 min'}
                        className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        Author (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAuthorEn}
                        onChange={(e) => setNewAuthorEn(e.target.value)}
                        placeholder="Enter English author name..."
                        className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        Read Time (English)
                      </label>
                      <input
                        type="text"
                        required
                        value={newReadTimeEn}
                        onChange={(e) => setNewReadTimeEn(e.target.value)}
                        placeholder="e.g. 5 min"
                        className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        {lang === 'TH' ? 'หมวดหมู่ *' : 'Category *'}
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as BlogCategory)}
                        className="w-full bg-brand-dark border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                      >
                        <option value="investment">{lang === 'TH' ? 'การลงทุน (Investment)' : 'Investment'}</option>
                        <option value="retirement">{lang === 'TH' ? 'วางแผนเกษียณ (Retirement)' : 'Retirement'}</option>
                        <option value="tax">{lang === 'TH' ? 'ภาษี (Tax)' : 'Tax'}</option>
                        <option value="insurance">{lang === 'TH' ? 'ประกันชีวิต (Insurance)' : 'Insurance'}</option>
                        <option value="education">{lang === 'TH' ? 'ทุนการศึกษาบุตร (Education)' : 'Education'}</option>
                        <option value="critical-illness">{lang === 'TH' ? 'ประกันโรคร้ายแรง (Critical Illness)' : 'Critical Illness'}</option>
                        <option value="unit-linked">{lang === 'TH' ? 'ประกันควบการลงทุน (Unit-Linked)' : 'Unit-Linked'}</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        {lang === 'TH' ? 'ลิงก์รูปภาพประกอบ (URL)' : 'Custom Image URL'}
                      </label>
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Preset Images Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                      {lang === 'TH' ? 'หรือเลือกจากรูปภาพสำเร็จรูป:' : 'Or choose from gorgeous preset images:'}
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'Gold Coins', url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800' },
                        { name: 'Laptop Chart', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800' },
                        { name: 'Calculator Doc', url: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=800' },
                        { name: 'Meeting Growth', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800' },
                      ].map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setNewImageUrl(preset.url)}
                          className={`relative rounded-lg overflow-hidden h-14 border-2 transition-all ${
                            newImageUrl === preset.url ? 'border-brand-orange scale-102 ring-2 ring-brand-orange/40' : 'border-brand-slate hover:border-gray-400'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Image & YouTube URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        {lang === 'TH' ? 'อัพโหลดรูปภาพ' : 'Upload Image'}
                      </label>
                      <label className="group flex min-h-[104px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-brand-slate bg-brand-slate/20 px-4 py-4 text-center transition-colors hover:border-brand-orange hover:bg-brand-slate/35">
                        <Upload className="mb-2 h-5 w-5 text-brand-orange" />
                        <span className="text-xs font-bold text-white">
                          {lang === 'TH' ? 'เลือกรูปจากเครื่อง' : 'Choose an image file'}
                        </span>
                        <span className="mt-1 text-[10px] text-gray-500">
                          {lang === 'TH' ? 'ไฟล์จะถูกนำมาใช้เป็นภาพประกอบบทความ' : 'Used as the article cover image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        {lang === 'TH' ? 'ลิงก์วิดีโอ YouTube' : 'YouTube Video Link'}
                      </label>
                      <div className="rounded-lg border border-brand-slate bg-brand-slate/20 p-3">
                        <div className="flex items-center gap-2 text-brand-orange">
                          <Youtube className="h-4 w-4" />
                          <span className="text-[10px] font-mono font-bold uppercase">
                            {lang === 'TH' ? 'แชร์สื่อวิดีโอในบทความ' : 'Embed video in article'}
                          </span>
                        </div>
                        <input
                          type="url"
                          value={newYoutubeUrl}
                          onChange={(e) => setNewYoutubeUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="mt-3 w-full bg-brand-dark/70 border border-brand-slate rounded-lg px-3 py-2.5 text-xs focus:outline-hidden focus:border-brand-orange text-white font-mono"
                        />
                        {newYoutubeUrl && !getYoutubeEmbedUrl(newYoutubeUrl) && (
                          <p className="mt-2 text-[10px] text-red-300 font-mono">
                            {lang === 'TH' ? 'รองรับลิงก์ youtube.com หรือ youtu.be เท่านั้น' : 'Use a youtube.com or youtu.be link.'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selected cover preview */}
                  {newImageUrl && (
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                        {lang === 'TH' ? 'ตัวอย่างภาพประกอบ' : 'Cover Preview'}
                      </label>
                      <div className="h-36 overflow-hidden rounded-lg border border-brand-slate bg-brand-slate">
                        <img
                          src={newImageUrl}
                          alt={lang === 'TH' ? 'ตัวอย่างภาพประกอบบทความ' : 'Article cover preview'}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Excerpt */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                      {lang === 'TH' ? 'คำโปรยย่อ (Excerpt) *' : 'Short Excerpt *'}
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={newExcerpt}
                      onChange={(e) => setNewExcerpt(e.target.value)}
                      placeholder={lang === 'TH' ? 'เขียนแนะนำหรือสรุปสั้น ๆ ของบทความให้น่าดึงดูดใจ...' : 'Write a short enticing summary of your article...'}
                      className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                      Short Excerpt (English) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={newExcerptEn}
                      onChange={(e) => setNewExcerptEn(e.target.value)}
                      placeholder="Write a short English summary for this article..."
                      className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                      {lang === 'TH' ? 'เนื้อหาฉบับเต็ม *' : 'Full Content *'}
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder={lang === 'TH' ? 'พิมพ์เนื้อหาหลักของบทความที่นี่ สามารถจัดย่อหน้าได้...' : 'Write the main body paragraphs of the article here...'}
                      className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 block uppercase">
                      Full Content (English) *
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={newContentEn}
                      onChange={(e) => setNewContentEn(e.target.value)}
                      placeholder="Write the full English article content here..."
                      className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white font-sans leading-relaxed"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-brand-dark border-t border-brand-slate flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-5 py-2.5 bg-brand-slate hover:bg-brand-slate/80 text-white rounded-lg text-xs font-bold font-mono uppercase transition-colors cursor-pointer"
                  >
                    {lang === 'TH' ? 'ยกเลิก' : 'CANCEL'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-lg text-xs font-mono uppercase flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{lang === 'TH' ? 'กำลังบันทึก...' : 'SAVING...'}</span>
                      </>
                    ) : (
                      <span>{lang === 'TH' ? 'เผยแพร่บทความ' : 'PUBLISH ARTICLE'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Passcode Login Modal */}
      <AnimatePresence>
        {isPasscodeModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" id="admin-passcode-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-brand-charcoal text-white rounded-2xl border border-brand-slate overflow-hidden max-w-sm w-full shadow-2xl relative p-6 space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-brand-slate">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-serif text-lg font-bold text-white">
                    {lang === 'TH' ? 'เข้าสู่ระบบแอดมิน' : 'Admin Authentication'}
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setIsPasscodeModalOpen(false);
                    setAdminPassword('');
                    setPasscodeError('');
                    setPendingAction(null);
                  }}
                  className="p-1 hover:bg-brand-slate text-gray-400 hover:text-white rounded-full transition-colors animate-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {lang === 'TH' 
                    ? 'การเพิ่ม ลบ หรือแก้ไขบทความและวิดีโอ จำกัดเฉพาะบัญชีแอดมินที่ได้รับอนุญาตเท่านั้น' 
                    : 'Publishing and deletion of articles is restricted to authorized admin accounts.'}
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                    {lang === 'TH' ? 'อีเมลแอดมิน' : 'Admin Email'}
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="admin@example.com"
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      if (passcodeError) setPasscodeError('');
                    }}
                    className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                    {lang === 'TH' ? 'รหัสผ่าน' : 'Password'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (passcodeError) setPasscodeError('');
                    }}
                    className="w-full bg-brand-slate/30 border border-brand-slate rounded-lg px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-orange text-white"
                  />
                </div>

                {passcodeError && (
                  <p className="text-xs text-red-400 font-mono text-center">
                    {passcodeError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasscodeModalOpen(false);
                      setAdminPassword('');
                      setPasscodeError('');
                      setPendingAction(null);
                    }}
                    className="flex-1 py-2.5 bg-brand-slate hover:bg-brand-slate/80 text-white rounded-lg text-xs font-bold font-mono uppercase transition-colors cursor-pointer"
                  >
                    {lang === 'TH' ? 'ยกเลิก' : 'CANCEL'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-lg text-xs font-mono uppercase transition-colors cursor-pointer"
                  >
                    {lang === 'TH' ? 'เข้าสู่ระบบ' : 'LOGIN'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
