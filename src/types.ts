/**
 * Shared Type Definitions for Ultimate Life Advisor
 */

export enum ActiveTab {
  Home = 'home',
  Services = 'services',
  AboutUs = 'about-us',
  Blog = 'blog',
  Game = 'game',
  Contact = 'contact',
  Legal = 'legal',
  ImageAdmin = 'image-admin'
}

export type LegalPageType = 'privacy' | 'terms' | 'disclaimer';

export interface ImageSettings {
  [key: string]: string | undefined;
}

export interface TeamMember {
  id: string;
  name: string;
  nameTh?: string;
  nameEn?: string;
  role: string;
  roleTh?: string;
  roleEn?: string;
  bio: string;
  bioTh?: string;
  bioEn?: string;
  image: string;
  specialty?: string;
  specialtyTh?: string;
  specialtyEn?: string;
  location?: string;
  locationTh?: string;
  locationEn?: string;
  email?: string;
  phone?: string;
  linkedInUrl?: string;
  tags?: string[];
  profileSummary?: string;
  profileSummaryTh?: string;
  profileSummaryEn?: string;
  biography?: string[];
  biographyTh?: string[];
  biographyEn?: string[];
  philosophy?: string;
  philosophyTh?: string;
  philosophyEn?: string;
  experience?: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  experienceTh?: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  experienceEn?: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  education?: {
    degree: string;
    school: string;
  }[];
  educationTh?: {
    degree: string;
    school: string;
  }[];
  educationEn?: {
    degree: string;
    school: string;
  }[];
  credentials?: string[];
  credentialsTh?: string[];
  credentialsEn?: string[];
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export interface BlogPost {
  id: string;
  createdAt?: string;
  title: string;
  titleTh?: string;
  titleEn?: string;
  category: 'investment' | 'retirement' | 'tax' | 'insurance' | 'education' | 'critical-illness' | 'unit-linked' | 'all';
  categoryTh: string;
  categoryEn?: string;
  excerpt: string;
  excerptTh?: string;
  excerptEn?: string;
  date: string;
  dateTh?: string;
  dateEn?: string;
  author: string;
  authorTh?: string;
  authorEn?: string;
  readTime: string;
  readTimeTh?: string;
  readTimeEn?: string;
  image: string;
  youtubeUrl?: string;
  content: string;
  contentTh?: string;
  contentEn?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  titleTh?: string;
  titleEn?: string;
  description?: string;
  descriptionTh?: string;
  descriptionEn?: string;
  duration: string;
  views: string;
  thumbnail: string;
  youtubeUrl?: string;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}
