import api from '@/lib/api';
import type { I18nText } from './programsService';

export interface AchievementItem {
  _id: string;
  title: I18nText;
  description: I18nText;
  image?: string;
  date?: string;
  value?: number;
  icon?: string;
  category?: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export const achievementsService = {
  getPublished: async () => {
    const { data } = await api.get('/v1/achievements');
    return data.data;
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/v1/achievements/admin', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/achievements/${id}`);
    return data.data.achievement;
  },

  create: async (achievementData: Partial<AchievementItem>) => {
    const { data } = await api.post('/achievements', achievementData);
    return data.data.achievement;
  },

  update: async (id: string, achievementData: Partial<AchievementItem>) => {
    const { data } = await api.put(`/achievements/${id}`, achievementData);
    return data.data.achievement;
  },

  delete: async (id: string) => {
    await api.delete(`/achievements/${id}`);
  },
};
