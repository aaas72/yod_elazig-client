// Server-side API helper for fetching data
const API_BASE = process.env.API_INTERNAL_URL || "http://localhost:5000/api/v1";

interface FetchOptions {
  lang?: string;
  revalidate?: number | false;
  cache?: RequestCache;
}

export async function fetchApi<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { lang = "ar", revalidate = 60, cache } = options;

  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
    next: cache ? undefined : { revalidate },
    cache,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data ?? json;
}

// News API
export interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  coverImage?: string;
  isPublished: boolean;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
  author?: { name?: string };
  category?: string;
  tags?: string[];
  translations?: Record<string, {
    title?: string;
    summary?: string;
    content?: string;
    category?: string;
    tags?: string | string[];
  }>;
}

// Server returns: ApiResponse(data: { data: NewsItem[], pagination })
// fetchApi extracts json.data → { data: [...], pagination: {...} }
export async function getNews(lang: string, limit?: number): Promise<NewsItem[]> {
  const params = limit ? `?limit=${limit}` : "";
  const result = await fetchApi<any>(`/news${params}`, { lang });
  // Handle paginated response: { data: [...], pagination: {...} }
  if (result && Array.isArray(result.data)) return result.data;
  // Handle { news: [...] }
  if (result && Array.isArray(result.news)) return result.news;
  // Handle direct array
  if (Array.isArray(result)) return result;
  return [];
}

export async function getNewsById(id: string, lang: string): Promise<NewsItem | null> {
  try {
    const result = await fetchApi<any>(`/news/${id}`, { lang });
    return result?.news || result;
  } catch {
    return null;
  }
}

export async function getNewsBySlug(slug: string, lang: string): Promise<NewsItem | null> {
  try {
    const result = await fetchApi<any>(`/news/slug/${slug}`, { lang });
    return result?.news || result;
  } catch {
    return null;
  }
}

// Events API
export interface EventItem {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  description?: string;
  coverImage?: string;
  eventDate?: string;
  startDate?: string;
  date?: string;
  location?: string;
  category?: string;
  capacity?: number;
  isFeatured?: boolean;
  author?: { name?: string };
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  translations?: Record<string, {
    title?: string;
    summary?: string;
    content?: string;
    description?: string;
    location?: string;
    tags?: string | string[];
  }>;
}

// Server returns: ApiResponse(data: { data: EventItem[], pagination })
export async function getEvents(lang: string, limit?: number): Promise<EventItem[]> {
  const params = limit ? `?limit=${limit}` : "";
  const result = await fetchApi<any>(`/events${params}`, { lang });
  if (result && Array.isArray(result.data)) return result.data;
  if (result && Array.isArray(result.events)) return result.events;
  if (Array.isArray(result)) return result;
  return [];
}

export async function getEventBySlug(slug: string, lang: string): Promise<EventItem | null> {
  try {
    const result = await fetchApi<any>(`/events/slug/${slug}`, { lang });
    return result?.event || result;
  } catch {
    return null;
  }
}

// Programs API
export interface ProgramItem {
  _id: string;
  title: string | Record<string, string>;
  slug: string;
  description?: string | Record<string, string>;
  content?: string;
  coverImage?: string;
  location?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  isActive: boolean;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Server returns: ApiResponse(data: { data: ProgramItem[], pagination })
export async function getPrograms(lang: string): Promise<ProgramItem[]> {
  const result = await fetchApi<any>(`/programs`, { lang });
  if (result && Array.isArray(result.data)) return result.data;
  if (result && Array.isArray(result.programs)) return result.programs;
  if (Array.isArray(result)) return result;
  return [];
}

export async function getProgramBySlug(slug: string, lang: string): Promise<ProgramItem | null> {
  try {
    const result = await fetchApi<any>(`/programs/slug/${slug}`, { lang });
    return result?.program || result;
  } catch {
    return null;
  }
}

// FAQ API
export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isPublished: boolean;
}

// Server returns: ApiResponse(data: { faqs: FaqItem[] })
export async function getFaqs(lang: string): Promise<FaqItem[]> {
  const result = await fetchApi<any>(`/faq`, { lang });
  if (result && Array.isArray(result.faqs)) return result.faqs;
  if (result && Array.isArray(result.data)) return result.data;
  if (Array.isArray(result)) return result;
  return [];
}

// Gallery API
export interface GalleryAlbum {
  _id: string;
  slug: string;
  title: {
    ar: string;
    en: string;
    tr: string;
  };
  coverImage?: string;
  photos: Array<{
    _id: string;
    url: string;
    thumbnail?: string;
    caption?: { ar?: string; en?: string; tr?: string };
    order: number;
  }>;
  category?: string;
  type: 'public' | 'private';
  order: number;
  isPublished: boolean;
}

// Server returns: ApiResponse(data: { albums: GalleryAlbum[] })
export async function getGallery(lang: string): Promise<GalleryAlbum[]> {
  try {
    const result = await fetchApi<any>(`/gallery`, { lang });
    if (result && Array.isArray(result.albums)) return result.albums;
    if (result && Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
  } catch {
    return [];
  }
}

// Settings API
export interface SiteSettings {
  contactEmail?: string;
  contactPhone?: string;
  socialMedia?: Record<string, string>;
  [key: string]: unknown;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const result = await fetchApi<any>(`/settings`);
    return result?.settings || result || {};
  } catch {
    return {};
  }
}

// Utility function to resolve image URLs
export function resolveImageUrl(path?: string): string {
  if (!path) return "/imgs/placeholder.jpg";
  // Normalize localhost URLs → extract path
  if (path.startsWith("http://localhost") || path.startsWith("http://127.0.0.1")) {
    try {
      path = new URL(path).pathname;
    } catch {}
  }
  if (path.startsWith("https://") || path.startsWith("http://")) return path;
  // In production, use relative paths. In development, use localhost.
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? '' : 'http://localhost:5000';
  return `${baseUrl}/${path.replace(/^\//, "")}`;
}
