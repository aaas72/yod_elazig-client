import api from '@/lib/api';

export const contactService = {
  // Public
  submit: async (formData: { name: string; email: string; subject: string; message: string }) => {
    const { data } = await api.post('/v1/contacts', formData);
    return data.data;
  },

  // Admin
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const { data } = await api.get('/v1/contacts', { params });
    return data.data;
  },

  getStats: async () => {
    const { data } = await api.get('/v1/contacts/stats');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/v1/contacts/${id}`);
    return data.data.contact;
  },

  markAsRead: async (id: string) => {
    const { data } = await api.patch(`/v1/contacts/${id}/read`);
    return data.data;
  },

  reply: async (id: string, replyMessage: string) => {
    const { data } = await api.post(`/contacts/${id}/reply`, { replyMessage });
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/contacts/${id}`);
  },
};
