import api from '@/lib/api';
import type { I18nText } from './programsService';

export interface FaqDocument {
  name: I18nText;
  url: string;
}

export interface FaqStep {
  text: I18nText;
  fileUrl?: string;
}

export interface FaqItem {
  _id: string;
  question: I18nText;
  answer: I18nText;
  category: string;
  steps?: FaqStep[];
  documents?: FaqDocument[];
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export const faqService = {
  getPublished: async () => {
    const { data } = await api.get('/faq');
    // Handle { data: { faqs: [] } } or { data: [] }
    if (data.data && Array.isArray(data.data.faqs)) {
      return data.data.faqs;
    }
    if (Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/faq/admin', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/faq/${id}`);
    return data.data.faq;
  },

  create: async (faqData: Partial<FaqItem>) => {
    const { data } = await api.post('/faq', faqData);
    return data.data.faq;
  },

  update: async (id: string, faqData: Partial<FaqItem>) => {
    const { data } = await api.put(`/faq/${id}`, faqData);
    return data.data.faq;
  },

  delete: async (id: string) => {
    await api.delete(`/faq/${id}`);
  },

  reorder: async (items: Array<{ id: string; order: number }>) => {
    const { data } = await api.patch('/faq/reorder', { items });
    return data.data;
  },
};
