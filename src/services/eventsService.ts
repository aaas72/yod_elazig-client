import api from '@/lib/api';

export interface EventItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  category?: string;
  capacity?: number;
  coverImage?: string;
  author: { _id: string; name: string };
  isPublished: boolean;
  isFeatured?: boolean;
  attendees?: string[];
  registrationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export const eventsService = {
  getPublished: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/events', { params });
    return data.data;
  },

  getUpcoming: async () => {
    const { data } = await api.get('/events/upcoming');
    return data.data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/events/slug/${slug}`);
    return data.data.event;
  },

  // Admin
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/events/admin', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/events/${id}`);
    return data.data.event;
  },

  create: async (eventData: Partial<EventItem>) => {
    const { data } = await api.post('/events', eventData);
    return data.data.event;
  },

  update: async (id: string, eventData: Partial<EventItem>) => {
    const { data } = await api.put(`/events/${id}`, eventData);
    return data.data.event;
  },

  delete: async (id: string) => {
    await api.delete(`/events/${id}`);
  },

  togglePublish: async (id: string) => {
    const { data } = await api.patch(`/events/${id}/toggle-publish`);
    return data.data.event;
  },

  register: async (id: string) => {
    const { data } = await api.post(`/events/${id}/register`);
    return data.data;
  },

  unregister: async (id: string) => {
    const { data } = await api.delete(`/events/${id}/register`);
    return data.data;
  },
};
