import api, { API_BASE_URL } from '@/lib/api';

export interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  folder: string;
  uploadedBy: { _id: string; name: string };
  createdAt: string;
}

export const mediaService = {
  getAll: async (params?: { page?: number; limit?: number; folder?: string; mimetype?: string }) => {
    const { data } = await api.get('/v1/media', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/media/${id}`);
    return data.data.media;
  },

  upload: async (file: File, folder = 'general', alt?: string): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (alt) formData.append('alt', alt);

    const { data } = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.media;
  },

  uploadMultiple: async (files: File[], folder = 'general') => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('folder', folder);

    const { data } = await api.post('/media/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  updateAlt: async (id: string, alt: string) => {
    const { data } = await api.patch(`/media/${id}`, { alt });
    return data.data.media;
  },

  delete: async (id: string) => {
    await api.delete(`/media/${id}`);
  },

  getFullUrl: (path: string) => {
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL.replace('/api/v1', '');
    return `${baseUrl}${path}`;
  },
};
