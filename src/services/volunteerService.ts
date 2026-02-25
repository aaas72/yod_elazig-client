import api from '@/lib/api';

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
    const { data } = await api.get('/v1/volunteers', { params });
    return data.data;
  },

  getStats: async () => {
    const { data } = await api.get('/v1/volunteers/stats');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/volunteers/${id}`);
    return data.data.volunteer;
  },

  review: async (id: string, status: 'accepted' | 'rejected', reviewNote?: string) => {
    const { data } = await api.patch(`/volunteers/${id}/review`, { status, reviewNote });
    return data.data;
  },

  exportAll: async () => {
    const { data } = await api.get('/volunteers/export');
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/volunteers/${id}`);
  },
};
