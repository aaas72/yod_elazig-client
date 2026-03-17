import type { Locale } from "./config";

// Generic function to load data for a specific page
async function loadPageData<T>(locale: Locale, page: string): Promise<T> {
  const data = await import(`@/../data/locales/${locale}/${page}.json`);
  return data.default as T;
}

// Home page data types
export interface HomeData {
  hero: {
    title: string;
    joinButton: string;
    backgroundImage: string;
    logoUrl: string;
    ticker: Array<{
      id: number;
      title: string;
      date: string;
      image?: string;
      logo?: boolean;
    }>;
  };
  stats: Array<{
    id: number;
    icon: string;
    value: number | string;
    label: string;
  }>;
  sections: {
    stats: { title: string };
    news: { title: string; buttonText: string };
    events: { title: string; buttonText: string };
    programs: { title: string; buttonText: string };
    gallery: {
      title: string;
      images: Array<{ id: number; src: string; alt: string }>;
    };
  };
}

// About page data types
export interface AboutData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  intro: {
    title: string;
    content: string[];
  };
  sections: {
    visionMission: string;
    achievements: string;
    studentAchievements: string;
    executiveBoard: string;
    values: string;
    organizationalChart: string;
  };
  vision: Array<{
    id: number;
    number: number;
    title: string;
    description: string;
    subItems?: Array<{ title: string; description: string }>;
  }>;
  values: Array<{
    id: number;
    title: string;
    description: string;
    gradient: string;
  }>;
  organizationalChart: {
    imageSrc: string;
    imageAlt: string;
  };
}

// Generic page data with hero and breadcrumbs
export interface PageWithHero {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  [key: string]: unknown;
}

// News page data
export interface NewsPageData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  labels: {
    readMore: string;
    noNews: string;
  };
}

// Events page data
export interface EventsPageData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  labels: {
    readMore: string;
    noEvents: string;
  };
}

// Programs page data
export interface ProgramsPageData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  labels: {
    viewDetails: string;
    noPrograms: string;
  };
}

// Contact page data
export interface ContactData {
  [x: string]: any;
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  contactInfo: {
    title: string;
    items: Array<{
      id: number;
      icon: string;
      label: string;
      value: string;
      href?: string;
    }>;
  };
  form: {
    title: string;
    fields: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      subject: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
    };
    submit: string;
    success: string;
    error: string;
  };
}

// FAQ page data
export interface FaqData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  [key: string]: unknown;
}

// Not found page data
export interface NotFoundData {
  title: string;
  description: string;
  backHome: string;
}

// Volunteer page data
export interface VolunteerData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  [key: string]: unknown;
}

// Resources page data
export interface ResourcesData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  [key: string]: unknown;
}

// Access/Archive page data
export interface AccessData {
  hero: {
    title: string;
  };
  [key: string]: unknown;
}

// Join membership page data
export interface JoinUsData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  [key: string]: unknown;
}

// About city page data
export interface AboutCityData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  [key: string]: unknown;
}

// About university page data
export interface AboutUniversityData {
  hero: {
    title: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
  };
  [key: string]: unknown;
}

// Data loading functions
export const getHomeData = (locale: Locale) => loadPageData<HomeData>(locale, "home");
export const getAboutData = (locale: Locale) => loadPageData<AboutData>(locale, "about");
export const getNewsPageData = (locale: Locale) => loadPageData<NewsPageData>(locale, "newsPage");
export const getEventsPageData = (locale: Locale) => loadPageData<EventsPageData>(locale, "eventsPage");
export const getProgramsPageData = (locale: Locale) => loadPageData<ProgramsPageData>(locale, "programsPage");
export const getContactData = (locale: Locale) => loadPageData<ContactData>(locale, "contact");
export const getFaqData = (locale: Locale) => loadPageData<FaqData>(locale, "faq");
export const getNotFoundData = (locale: Locale) => loadPageData<NotFoundData>(locale, "notFound");
export const getVolunteerData = (locale: Locale) => loadPageData<VolunteerData>(locale, "volunteer");
export const getResourcesData = (locale: Locale) => loadPageData<ResourcesData>(locale, "resources");
export const getAccessData = (locale: Locale) => loadPageData<AccessData>(locale, "access");
export const getJoinUsData = (locale: Locale) => loadPageData<JoinUsData>(locale, "joinUs");
export const getAboutCityData = (locale: Locale) => loadPageData<AboutCityData>(locale, "aboutCity");
export const getAboutUniversityData = (locale: Locale) => loadPageData<AboutUniversityData>(locale, "aboutUniversity");
