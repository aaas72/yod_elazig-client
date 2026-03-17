'use client';

import { useState, useEffect } from 'react';
import { galleryService, GalleryAlbum } from '@/services/galleryService';
import { resolveImage } from '@/utils/resolveImage';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: {
    id: string;
    url: string;
    caption: string;
  }[];
}

export const useGalleryData = () => {
  const [albums, setAlbums] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const data = await galleryService.getPublished();

        const lang = ((typeof window !== 'undefined' ? localStorage.getItem('NEXT_LOCALE') : null) || 'ar') as 'ar' | 'en' | 'tr';

        const mappedAlbums = (data || []).map((album: GalleryAlbum) => ({
          id: album._id,
          title: album.title[lang] || album.title['ar'] || '',
          description: album.description?.[lang] || album.description?.['ar'] || '',
          // coverImage may be just filename or full path
          coverImage: album.coverImage ? resolveImage(album.coverImage, 'gallery/photos') : '',
          images: (album.photos || []).map(photo => ({
            id: photo._id,
            url: resolveImage(photo.url, 'gallery/photos'),
            caption: photo.caption?.[lang] || photo.caption?.['ar'] || '',
          })),
        }));

        setAlbums(mappedAlbums);
        setError(null);
      } catch (err) {
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return { albums, loading, error };
};
