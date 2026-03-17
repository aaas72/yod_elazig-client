'use client';

import { useState, useEffect } from 'react';
import { programsService } from '@/services/programsService';
import { resolveImage } from '@/utils/resolveImage';

export interface UseProgramsDataOptions {
  page?: number;
  search?: string;
  admin?: boolean;
}

export interface UseProgramsDataResult {
  programs: any[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  loading: boolean;
  reload: () => void;
}

export function useProgramsData(options: UseProgramsDataOptions = {}): UseProgramsDataResult {
  const { page = 1, search = '', admin = false } = options;
  const [programs, setPrograms] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const lang = ((typeof window !== 'undefined' ? localStorage.getItem('NEXT_LOCALE') : null) || 'ar') as 'ar' | 'en' | 'tr';

    const fetch = async () => {
      try {
        let response;
        if (admin) {
          response = await programsService.getAll({ page, limit: 10, search });
        } else {
          response = await programsService.getAllForUsers({ page, limit: 10, search });
        }
        // Extract items and pagination
        let items: any[] = [];
        let paginationData = { page: 1, pages: 1, total: 0, limit: 10 };

        if (response && typeof response === 'object') {
          // Check for { data: [...], pagination: {...} } structure (Standard)
          if (Array.isArray(response.data)) {
            items = response.data;
          }
          // Check for direct array
          else if (Array.isArray(response)) {
            items = response;
          }
          // Check for nested data structures (legacy support)
          else if (response.data && Array.isArray(response.data.data)) {
            items = response.data.data;
          }
          else if (response.data && Array.isArray(response.data.programs)) {
            items = response.data.programs;
          }

          // Extract pagination
          if (response.pagination) {
            paginationData = response.pagination;
          } else if (response.data?.pagination) {
            paginationData = response.data.pagination;
          }
        }

        const mapped = items.map((item: any) => {
          const t = item.title && typeof item.title === 'object' ? item.title[lang] || item.title.ar || '' : item.title || '';
          const loc = item.location && typeof item.location === 'object' ? item.location[lang] || item.location.ar || '' : item.location || '';

          return {
            ...item,
            id: item.slug || item._id || item.id,
            _id: item._id || item.id,
            slug: item.slug || '',
            title: t,
            startDate: item.startDate,
            endDate: item.endDate,
            location: loc,
            coverImage: resolveImage(item.coverImage),
            category: item.category || '',
            isPublished: item.isPublished,
          };
        });
        if (!cancelled) {
          setPrograms(mapped);
          setPagination(paginationData);
        }
      } catch (error) {
        if (!cancelled) {
          setPrograms([]);
          setPagination({ page: 1, pages: 1, total: 0, limit: 10 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, search, admin, reloadCounter]);

  const reload = () => setReloadCounter(c => c + 1);

  return { programs, pagination, loading, reload };
}
