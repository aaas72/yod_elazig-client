import api from '@/lib/api';

export interface ReportItem {
  _id: string;
  title: string;
  description?: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  file: string;
  uploadedBy: { _id: string; name: string; email?: string };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const reportsService = {
  getPublished: async (): Promise<ReportItem[]> => {
    const { data } = await api.get('/reports/published');
    return data.data.reports || [];
  },

  getAll: async (params?: { page?: number; limit?: number; year?: number; quarter?: string }) => {
    const { data } = await api.get('/reports', { params });
    return data.data;
  },

  getById: async (id: string): Promise<ReportItem> => {
    const { data } = await api.get(`/reports/${id}`);
    return data.data.report;
  },

  create: async (formData: FormData): Promise<ReportItem> => {
    const { data } = await api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.report;
  },

  update: async (id: string, formData: FormData): Promise<ReportItem> => {
    const { data } = await api.put(`/reports/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.report;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },
};
