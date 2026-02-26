import api from '@/lib/api';
import type { I18nText } from './programsService';

export interface TickerItem {
  _id: string;
  text: I18nText;
  url?: string;
  link?: string;
  image?: string;
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export const tickerService = {
  getPublished: async () => {
    const { data } = await api.get('/ticker');
    // Ensure we return the array directly, handling potential wrapper objects
    return data.data.tickers || data.data || [];
  },

  getAll: async () => {
    const { data } = await api.get('/ticker/admin');
    return data.data.tickers || data.data || [];
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/ticker/${id}`);
    return data.data.ticker;
  },

  create: async (tickerData: Partial<TickerItem>) => {
    const { data } = await api.post('/ticker', tickerData);
    return data.data.ticker;
  },

  update: async (id: string, tickerData: Partial<TickerItem>) => {
    const { data } = await api.put(`/ticker/${id}`, tickerData);
    return data.data.ticker;
  },

  delete: async (id: string) => {
    await api.delete(`/ticker/${id}`);
  },

  bulkUpdate: async (tickers: Partial<TickerItem>[]) => {
    const { data } = await api.put('/ticker/bulk', { items: tickers });
    return data.data.tickers;
  },
};
