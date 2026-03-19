import api from '@/lib/api-client';
import type { I18nText } from './programsService';

export interface BoardMemberItem {
  _id: string;
  name: I18nText;
  position: I18nText;
  department?: I18nText;
  image?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  type: 'executive' | 'organizational' | 'supervisory';
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export const boardMembersService = {
  getPublished: async (type?: 'executive' | 'organizational' | 'supervisory'): Promise<BoardMemberItem[]> => {
    const params = type ? { type } : {};
    const { data } = await api.get('/board-members', { params });
    return data.data.members || [];
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string; type?: string }) => {
    const { data } = await api.get('/board-members/admin', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/board-members/${id}`);
    return data.data.member;
  },

  create: async (memberData: Partial<BoardMemberItem>) => {
    const { data } = await api.post('/board-members', memberData);
    return data.data.member;
  },

  update: async (id: string, memberData: Partial<BoardMemberItem>) => {
    const { data } = await api.put(`/board-members/${id}`, memberData);
    return data.data.member;
  },

  delete: async (id: string) => {
    await api.delete(`/board-members/${id}`);
  },
};
