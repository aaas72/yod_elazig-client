import api from '@/lib/api-client';

export const volunteerService = {
  // Public
  submit: async (formData: {
    name: string;
    email: string;
    phone: string;
    university?: string;
    department?: string;
    yearOfStudy?: number;
    skills?: string[];
    motivation: string;
    availableHours?: number;
  }) => {
    const { data } = await api.post('/volunteers', formData);
    return data.data;
  },

  // Admin
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const { data } = await api.get('/volunteers', { params });
    return data.data;
  },

  getStats: async () => {
    const { data } = await api.get('/volunteers/stats');
    return data.data.stats;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/volunteers/${id}`);
    return data.data.volunteer;
  },

  review: async (id: string, status: 'accepted' | 'rejected' | 'active' | 'completed' | 'suspended', reviewNote?: string) => {
    const { data } = await api.patch(`/volunteers/${id}/review`, { status, reviewNote });
    return data.data;
  },

  update: async (id: string, updateData: Record<string, any>) => {
    const { data } = await api.put(`/volunteers/${id}`, updateData);
    return data.data.volunteer;
  },

  exportAll: async () => {
    const { data } = await api.get('/volunteers/export');
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/volunteers/${id}`);
  },
};
