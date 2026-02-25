import api from '@/lib/api';
import type { I18nText } from './programsService';

export interface FaqItem {
  _id: string;
  question: I18nText;
  answer: I18nText;
  category?: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export const faqService = {
  getPublished: async () => {
    const { data } = await api.get('/v1/faq');
    return data.data;
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/v1/faq/admin', { params });
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
