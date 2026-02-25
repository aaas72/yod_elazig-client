import api from '@/lib/api';
import type { I18nText } from './programsService';

export interface GalleryAlbum {
  _id: string;
  title: I18nText;
  slug: string;
  description?: I18nText;
  coverImage?: string;
  category?: string;
  photos: GalleryPhoto[];
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export interface GalleryPhoto {
  _id: string;
  url: string;
  caption?: I18nText;
  order: number;
}

export const galleryService = {
  getPublished: async () => {
    const { data } = await api.get('/v1/gallery');
    return data.data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/gallery/slug/${slug}`);
    return data.data.album;
  },

  getAll: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get('/v1/gallery/admin', { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/gallery/${id}`);
    return data.data.album;
  },

  create: async (albumData: Partial<GalleryAlbum>) => {
    const { data } = await api.post('/gallery', albumData);
    return data.data.album;
  },

  createAlbum: async (albumData: Partial<GalleryAlbum>) => {
    const { data } = await api.post('/gallery', albumData);
    return data.data.album;
  },

  update: async (id: string, albumData: Partial<GalleryAlbum>) => {
    const { data } = await api.put(`/gallery/${id}`, albumData);
    return data.data.album;
  },

  updateAlbum: async (id: string, albumData: Partial<GalleryAlbum>) => {
    const { data } = await api.put(`/gallery/${id}`, albumData);
    return data.data.album;
  },

  delete: async (id: string) => {
    await api.delete(`/gallery/${id}`);
  },

  deleteAlbum: async (id: string) => {
    await api.delete(`/gallery/${id}`);
  },

  addPhotos: async (albumId: string, photos: Array<{ url: string; caption?: I18nText; order?: number }>) => {
    const { data } = await api.post(`/gallery/${albumId}/photos`, { photos });
    return data.data;
  },

  removePhoto: async (albumId: string, photoId: string) => {
    await api.delete(`/gallery/${albumId}/photos/${photoId}`);
  },

  reorderPhotos: async (albumId: string, photos: Array<{ id: string; order: number }>) => {
    const { data } = await api.patch(`/gallery/${albumId}/photos/reorder`, { photos });
    return data.data;
  },
};
