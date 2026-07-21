import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';
import { BlogPost, ImageSettings, TeamMember, VideoItem } from '../types';
import { BLOG_POSTS, DEFAULT_ADVISOR_MEMBERS, VIDEO_ITEMS } from '../data';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// บัญชีที่มีสิทธิ์จัดการเว็บ — ต้องตรงกับรายชื่อใน firestore.rules เสมอ
// (weerapan.t81@gmail.com เพิ่มตามคำยืนยันของเจ้าของเว็บ 2026-07-18 สำหรับ Google Sign-In)
export const ADMIN_EMAILS = ['weerapan.aia@hotmail.com', 'weerapan.t81@gmail.com'];

export const isAdminUser = (user: User | null) =>
  Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

export const watchAdminSession = (callback: (isAdmin: boolean, user: User | null) => void) =>
  onAuthStateChanged(auth, (user) => {
    callback(isAdminUser(user), user);
  });

export async function loginAdmin(email: string, password: string): Promise<void> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  if (!isAdminUser(credential.user)) {
    await signOut(auth);
    throw new Error('This account is not allowed to manage the website.');
  }
}

/** ล็อกอินแอดมินด้วย Google — ยอมรับเฉพาะบัญชีใน ADMIN_EMAILS (บัญชีอื่นถูก signOut ทันที) */
export async function loginAdminWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  if (!isAdminUser(credential.user)) {
    await signOut(auth);
    throw new Error('not-admin');
  }
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

/** ส่งอีเมลรีเซ็ตรหัสผ่านแอดมิน — จำกัดเฉพาะอีเมลใน ADMIN_EMAILS เท่านั้น */
export async function sendAdminPasswordReset(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!ADMIN_EMAILS.includes(normalized)) {
    throw new Error('This email is not an admin account.');
  }
  await sendPasswordResetEmail(auth, normalized);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  // Non-PII auth context only. Never log uid, email, or tenant id.
  authInfo: {
    signedIn: boolean;
    isAnonymous?: boolean | null;
    providers?: string[];
  };
}

export interface BlogPostPage {
  posts: BlogPost[];
  nextCursor: string | null;
  hasMore: boolean;
}

const BLOG_COLLECTION = 'blog_posts';
let blogCreatedAtBackfillPromise: Promise<void> | null = null;

const getPostTimestamp = (post: BlogPost) => {
  const candidates = [post.createdAt, post.dateEn, post.date, post.dateTh].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const parsed = Date.parse(candidate);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
};

const withCreatedAt = (post: BlogPost, fallbackIndex = 0): BlogPost => ({
  ...post,
  createdAt: post.createdAt || new Date(getPostTimestamp(post) || Date.now() - fallbackIndex).toISOString(),
});

const sortPostsByLatest = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => {
    const timeDiff = getPostTimestamp(b) - getPostTimestamp(a);
    if (timeDiff !== 0) return timeDiff;
    return b.id.localeCompare(a.id);
  });

const backfillBlogCreatedAtIfNeeded = () => {
  if (blogCreatedAtBackfillPromise) return blogCreatedAtBackfillPromise;

  blogCreatedAtBackfillPromise = (async () => {
    try {
      const snapshot = await getDocs(collection(db, BLOG_COLLECTION));
      const updates = snapshot.docs
        .map((item, index) => {
          const post = item.data() as BlogPost;
          if (post.createdAt) return null;
          return setDoc(doc(db, BLOG_COLLECTION, item.id), {
            createdAt: withCreatedAt(post, index).createdAt,
          }, { merge: true });
        })
        .filter(Boolean) as Promise<void>[];

      await Promise.all(updates);
    } catch (error) {
      console.error('Unable to backfill blog createdAt fields:', error);
    }
  })();

  return blogCreatedAtBackfillPromise;
};

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      signedIn: Boolean(auth.currentUser),
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      providers: auth.currentUser?.providerData?.map((provider) => provider.providerId) ?? [],
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Fetch all blog posts from Firestore.
 * If the collection is empty, seed it with the default BLOG_POSTS from data.ts.
 */
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const collectionPath = BLOG_COLLECTION;
  try {
    const colRef = collection(db, collectionPath);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      console.log('No blog posts found in Firestore. Seeding initial posts...');
      const seededPosts: BlogPost[] = [];
      for (const [index, post] of BLOG_POSTS.entries()) {
        const docRef = doc(db, collectionPath, post.id);
        const finalPost = withCreatedAt(post, index);
        try {
          await setDoc(docRef, finalPost);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `${collectionPath}/${post.id}`);
        }
        seededPosts.push(finalPost);
      }
      return sortPostsByLatest(seededPosts);
    }
    
    const posts: BlogPost[] = [];
    snapshot.forEach((doc) => {
      posts.push(withCreatedAt({ ...doc.data() } as BlogPost));
    });
    
    return sortPostsByLatest(posts);
  } catch (error) {
    // If it's a security permissions error, we MUST handle it and throw the JSON string
    if (error instanceof Error && error.message.includes('permission')) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
    }
    console.error('Error fetching blog posts from Firestore:', error);
    // Fallback to static data if Firestore fails on non-fatal network issues
    return sortPostsByLatest(BLOG_POSTS.map(withCreatedAt));
  }
}

export async function fetchLatestBlogPost(): Promise<BlogPost | null> {
  try {
    await backfillBlogCreatedAtIfNeeded();
    const colRef = collection(db, BLOG_COLLECTION);
    const snapshot = await getDocs(query(colRef, orderBy('createdAt', 'desc'), limit(1)));
    const item = snapshot.docs[0];
    if (item) return withCreatedAt(item.data() as BlogPost);

    const fallback = await fetchBlogPosts();
    return fallback[0] ?? null;
  } catch (error) {
    console.error('Error fetching latest blog post from Firestore:', error);
    const fallback = await fetchBlogPosts();
    return fallback[0] ?? null;
  }
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const snapshot = await getDoc(doc(db, BLOG_COLLECTION, id));
    if (!snapshot.exists()) return null;
    return withCreatedAt(snapshot.data() as BlogPost);
  } catch (error) {
    console.error('Error fetching blog post by id from Firestore:', error);
    return BLOG_POSTS.find((post) => post.id === id) ?? null;
  }
}

export async function fetchBlogPostPage(pageSize = 9, cursor?: string | null): Promise<BlogPostPage> {
  try {
    if (!cursor) await backfillBlogCreatedAtIfNeeded();
    const colRef = collection(db, BLOG_COLLECTION);
    const pageQuery = cursor
      ? query(colRef, orderBy('createdAt', 'desc'), startAfter(cursor), limit(pageSize + 1))
      : query(colRef, orderBy('createdAt', 'desc'), limit(pageSize + 1));
    const snapshot = await getDocs(pageQuery);
    const fetched = snapshot.docs.map((item) => withCreatedAt(item.data() as BlogPost));
    const pagePosts = fetched.slice(0, pageSize);
    const lastPost = pagePosts[pagePosts.length - 1];

    return {
      posts: pagePosts,
      nextCursor: lastPost?.createdAt ?? null,
      hasMore: fetched.length > pageSize,
    };
  } catch (error) {
    console.error('Error fetching paged blog posts from Firestore:', error);
    const fallback = sortPostsByLatest((await fetchBlogPosts()).map(withCreatedAt));
    const startIndex = cursor ? fallback.findIndex((post) => post.createdAt === cursor) + 1 : 0;
    const normalizedStart = startIndex > 0 ? startIndex : 0;
    const pagePosts = fallback.slice(normalizedStart, normalizedStart + pageSize);
    const lastPost = pagePosts[pagePosts.length - 1];

    return {
      posts: pagePosts,
      nextCursor: lastPost?.createdAt ?? null,
      hasMore: normalizedStart + pageSize < fallback.length,
    };
  }
}

/**
 * Add a new blog post to Firestore.
 */
export async function addBlogPost(post: Omit<BlogPost, 'id'> & { id?: string }): Promise<BlogPost> {
  const generatedId = post.id || 'post-' + Math.random().toString(36).substring(2, 9);
  const finalPost: BlogPost = {
    ...post,
    id: generatedId,
    createdAt: post.createdAt || new Date().toISOString(),
  };
  const firestorePost = Object.fromEntries(
    Object.entries(finalPost).filter(([, value]) => value !== undefined)
  ) as BlogPost;
  
  const docPath = `${BLOG_COLLECTION}/${finalPost.id}`;
  try {
    const docRef = doc(db, BLOG_COLLECTION, finalPost.id);
    await setDoc(docRef, firestorePost);
    return finalPost;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Delete a blog post from Firestore.
 */
export async function deleteBlogPost(id: string): Promise<void> {
  const docPath = `${BLOG_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function fetchImageSettings(): Promise<ImageSettings> {
  const collectionPath = 'image_settings';
  try {
    const snapshot = await getDocs(collection(db, collectionPath));
    const settings: ImageSettings = {};
    snapshot.forEach((item) => {
      const data = item.data() as { url?: string };
      if (typeof data.url === 'string' && data.url.trim()) {
        settings[item.id] = data.url;
      }
    });
    return settings;
  } catch (error) {
    console.error('Error fetching image settings from Firestore:', error);
    return {};
  }
}

export async function saveImageSetting(key: string, url: string): Promise<void> {
  const docPath = `image_settings/${key}`;
  try {
    await setDoc(doc(db, 'image_settings', key), {
      url,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteImageSetting(key: string): Promise<void> {
  const docPath = `image_settings/${key}`;
  try {
    await deleteDoc(doc(db, 'image_settings', key));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

const ADVISOR_COLLECTION = 'advisor_members';

const cleanAdvisor = (advisor: TeamMember): TeamMember => {
  const normalized: TeamMember = {
    ...advisor,
    tags: advisor.tags?.filter(Boolean) ?? [],
    biography: advisor.biography?.filter(Boolean) ?? [],
    experience: advisor.experience ?? [],
    experienceTh: advisor.experienceTh ?? [],
    experienceEn: advisor.experienceEn ?? [],
    education: advisor.education ?? [],
    educationTh: advisor.educationTh ?? [],
    educationEn: advisor.educationEn ?? [],
    credentials: advisor.credentials?.filter(Boolean) ?? [],
    credentialsTh: advisor.credentialsTh?.filter(Boolean) ?? [],
    credentialsEn: advisor.credentialsEn?.filter(Boolean) ?? [],
  };

  return Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== undefined)
  ) as TeamMember;
};

export async function fetchAdvisorMembers(): Promise<TeamMember[]> {
  try {
    const snapshot = await getDocs(collection(db, ADVISOR_COLLECTION));

    if (snapshot.empty) {
      const seededAdvisors: TeamMember[] = [];
      for (const advisor of DEFAULT_ADVISOR_MEMBERS) {
        const finalAdvisor = cleanAdvisor(advisor);
        await setDoc(doc(db, ADVISOR_COLLECTION, finalAdvisor.id), {
          ...finalAdvisor,
          order: seededAdvisors.length,
          updatedAt: new Date().toISOString(),
        });
        seededAdvisors.push(finalAdvisor);
      }
      return seededAdvisors;
    }

    const advisors = snapshot.docs
      .map((item) => item.data() as TeamMember & { order?: number })
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    return advisors.map(cleanAdvisor);
  } catch (error) {
    console.error('Error fetching advisor members from Firestore:', error);
    return DEFAULT_ADVISOR_MEMBERS;
  }
}

export async function saveAdvisorMember(advisor: TeamMember, order = 999): Promise<TeamMember> {
  const finalAdvisor = cleanAdvisor(advisor);
  const docPath = `${ADVISOR_COLLECTION}/${finalAdvisor.id}`;
  try {
    await setDoc(doc(db, ADVISOR_COLLECTION, finalAdvisor.id), {
      ...finalAdvisor,
      order,
      updatedAt: new Date().toISOString(),
    });
    return finalAdvisor;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteAdvisorMember(id: string): Promise<void> {
  const docPath = `${ADVISOR_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, ADVISOR_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

const VIDEO_COLLECTION = 'video_items';

const cleanVideo = (video: VideoItem): VideoItem => {
  const finalVideo: VideoItem = {
    ...video,
    titleTh: video.titleTh || video.title,
    titleEn: video.titleEn || video.title,
    descriptionTh: video.descriptionTh || video.description || '',
    descriptionEn: video.descriptionEn || video.description || '',
    createdAt: video.createdAt || new Date().toISOString(),
  };

  return Object.fromEntries(
    Object.entries(finalVideo).filter(([, value]) => value !== undefined)
  ) as VideoItem;
};

export async function fetchVideoItems(): Promise<VideoItem[]> {
  try {
    const snapshot = await getDocs(collection(db, VIDEO_COLLECTION));

    if (snapshot.empty) {
      const seededVideos: VideoItem[] = [];
      for (const [index, video] of VIDEO_ITEMS.entries()) {
        const finalVideo = cleanVideo({
          ...video,
          isFeatured: index === 0,
          order: index,
        });
        await setDoc(doc(db, VIDEO_COLLECTION, finalVideo.id), finalVideo);
        seededVideos.push(finalVideo);
      }
      return seededVideos;
    }

    const videos = snapshot.docs.map((item) => cleanVideo(item.data() as VideoItem));
    const existingIds = new Set(videos.map((video) => video.id));
    const missingDefaultVideos = VIDEO_ITEMS
      .filter((video) => !existingIds.has(video.id))
      .map((video, index) => cleanVideo({
        ...video,
        isFeatured: false,
        order: videos.length + index,
      }));

    if (missingDefaultVideos.length > 0) {
      await Promise.all(missingDefaultVideos.map((video) =>
        setDoc(doc(db, VIDEO_COLLECTION, video.id), video)
      ));
    }

    return [...videos, ...missingDefaultVideos]
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  } catch (error) {
    console.error('Error fetching video items from Firestore:', error);
    return VIDEO_ITEMS.map((video, index) => cleanVideo({ ...video, isFeatured: index === 0, order: index }));
  }
}

export async function saveVideoItem(video: VideoItem): Promise<VideoItem> {
  const finalVideo = cleanVideo(video);
  const docPath = `${VIDEO_COLLECTION}/${finalVideo.id}`;
  try {
    await setDoc(doc(db, VIDEO_COLLECTION, finalVideo.id), {
      ...finalVideo,
      updatedAt: new Date().toISOString(),
    });
    return finalVideo;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteVideoItem(id: string): Promise<void> {
  const docPath = `${VIDEO_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, VIDEO_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function setFeaturedVideoItem(id: string): Promise<void> {
  const videos = await fetchVideoItems();
  await Promise.all(videos.map((video) =>
    setDoc(doc(db, VIDEO_COLLECTION, video.id), {
      isFeatured: video.id === id,
      updatedAt: new Date().toISOString(),
    }, { merge: true })
  ));
}
