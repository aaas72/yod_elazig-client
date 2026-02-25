import api from '@/lib/api';
import type { I18nText } from './programsService';

export interface TickerItem {
  _id: string;
  text: I18nText;
  url?: string;
  link?: string;
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export const tickerService = {
  getActive: async () => {
    const { data } = await api.get('/v1/ticker');
    return data.data;
  },

  getAll: async () => {
    const { data } = await api.get('/v1/ticker/admin');
    return data.data;
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
    const { data } = await api.put('/ticker/bulk', tickers);
    return data.data;
  },
};
