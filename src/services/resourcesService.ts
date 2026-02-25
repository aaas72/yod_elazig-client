import api from '@/lib/api';
import type { I18nText } from './programsService';

export interface ResourceItem {
  _id: string;
  title: I18nText;
  description?: I18nText;
  url: string;
  fileUrl?: string;
  icon?: string;
  type: 'document' | 'video' | 'link' | 'image' | 'other';
  category: string;
  isPublic: boolean;
  allowedRoles?: string[];
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export const resourcesService = {
  getPublic: async () => {
    const { data } = await api.get('/v1/resources');
    return data.data;
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/v1/resources', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/resources/${id}`);
    return data.data.resource;
  },

  create: async (resourceData: Partial<ResourceItem>) => {
    const { data } = await api.post('/resources', resourceData);
    return data.data.resource;
  },

  update: async (id: string, resourceData: Partial<ResourceItem>) => {
    const { data } = await api.put(`/resources/${id}`, resourceData);
    return data.data.resource;
  },

  delete: async (id: string) => {
    await api.delete(`/resources/${id}`);
  },
};
