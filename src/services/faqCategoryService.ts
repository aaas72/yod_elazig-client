import api from '@/lib/api-client';
import type { I18nText } from './programsService';

export interface FaqCategory {
  _id: string;
  name: I18nText;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const faqCategoryService = {
  getActive: async (): Promise<FaqCategory[]> => {
    const { data } = await api.get('/faq-categories');
    if (data.data && Array.isArray(data.data.categories)) {
      return data.data.categories;
    }
    if (Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  },

  getAll: async (params?: { page?: number; limit?: number }): Promise<{ data: FaqCategory[]; pagination: any }> => {
    const { data } = await api.get('/faq-categories/admin', { params });
    return data.data;
  },

  getById: async (id: string): Promise<FaqCategory> => {
    const { data } = await api.get(`/faq-categories/${id}`);
    return data.data.category;
  },

  create: async (categoryData: Partial<FaqCategory>): Promise<FaqCategory> => {
    const { data } = await api.post('/faq-categories', categoryData);
    return data.data.category;
  },

  update: async (id: string, categoryData: Partial<FaqCategory>): Promise<FaqCategory> => {
    const { data } = await api.put(`/faq-categories/${id}`, categoryData);
    return data.data.category;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/faq-categories/${id}`);
  },

  reorder: async (items: Array<{ id: string; order: number }>): Promise<void> => {
    await api.patch('/faq-categories/reorder', { items });
  },
};
