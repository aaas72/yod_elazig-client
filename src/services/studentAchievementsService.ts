import api from '@/lib/api-client';
import type { I18nText } from './programsService';

export interface StudentAchievementItem {
  _id: string;
  studentName: I18nText;
  description: I18nText;
  category?: I18nText;
  image?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export const studentAchievementsService = {
  getPublished: async (): Promise<StudentAchievementItem[]> => {
    const { data } = await api.get('/student-achievements');
    return data.data.achievements || [];
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/student-achievements/admin', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/student-achievements/${id}`);
    return data.data.achievement;
  },

  create: async (achievementData: Partial<StudentAchievementItem>) => {
    const { data } = await api.post('/student-achievements', achievementData);
    return data.data.achievement;
  },

  update: async (id: string, achievementData: Partial<StudentAchievementItem>) => {
    const { data } = await api.put(`/student-achievements/${id}`, achievementData);
    return data.data.achievement;
  },

  delete: async (id: string) => {
    await api.delete(`/student-achievements/${id}`);
  },
};
