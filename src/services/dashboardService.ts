import api from '@/lib/api';

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    byRole: Record<string, number>;
  };
  students: { total: number; active: number };
  news: { total: number; published: number };
  events: { total: number; upcoming: number; published: number };
  programs: {
    total: number;
    published: number;
    byStatus: { upcoming: number; ongoing: number; completed: number };
  };
  volunteers: { total: number; pending: number; accepted: number; rejected: number };
  gallery: { albums: number; photos: number };
  content: { achievements: number; faqs: number; pages: number; tickers: number };
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/dashboard');
    return data.data.stats;
  },
};
