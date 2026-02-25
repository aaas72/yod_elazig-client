import api from '@/lib/api';

export interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  coverImage?: string;
  author: { _id: string; name: string };
  category?: string;
  tags?: string[];
  translations?: Record<string, { title?: string; content?: string; summary?: string; category?: string; tags?: string }>;
  isPublished: boolean;
  isFeatured?: boolean;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface NewsListResponse {
  news: NewsItem[];
  pagination: PaginationInfo;
}

export const newsService = {
  // Public
  getPublished: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
    sort?: string;
  }) => {
    const { data } = await api.get<{ success: boolean; data: NewsListResponse }>('/news', { params });
    return data.data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<{ success: boolean; data: { news: NewsItem } }>(`/news/slug/${slug}`);
    return data.data.news;
  },

  // Admin
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get<{ success: boolean; data: NewsListResponse }>('/news/admin', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: { news: NewsItem } }>(`/news/${id}`);
    return data.data.news;
  },

  create: async (newsData: Partial<NewsItem>) => {
    const { data } = await api.post<{ success: boolean; data: { news: NewsItem } }>('/news', newsData);
    return data.data.news;
  },

  update: async (id: string, newsData: Partial<NewsItem>) => {
    const { data } = await api.put<{ success: boolean; data: { news: NewsItem } }>(`/news/${id}`, newsData);
    return data.data.news;
  },

  delete: async (id: string) => {
    await api.delete(`/news/${id}`);
  },

  togglePublish: async (id: string) => {
    const { data } = await api.patch<{ success: boolean; data: { news: NewsItem } }>(`/news/${id}/toggle-publish`);
    return data.data.news;
  },
};
