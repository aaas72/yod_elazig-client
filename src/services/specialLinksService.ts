import api from '@/lib/api-client';

export interface SpecialLinkItem {
  _id: string;
  title: string;
  url: string;
  description?: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export const specialLinksService = {
  getPublished: async (): Promise<SpecialLinkItem[]> => {
    const { data } = await api.get('/special-links');
    return data.data.links || [];
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/special-links/admin', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/special-links/${id}`);
    return data.data.link;
  },

  create: async (linkData: Partial<SpecialLinkItem>) => {
    const { data } = await api.post('/special-links', linkData);
    return data.data.link;
  },

  update: async (id: string, linkData: Partial<SpecialLinkItem>) => {
    const { data } = await api.put(`/special-links/${id}`, linkData);
    return data.data.link;
  },

  delete: async (id: string) => {
    await api.delete(`/special-links/${id}`);
  },
};
