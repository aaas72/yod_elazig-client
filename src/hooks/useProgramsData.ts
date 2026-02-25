import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { programsService } from "@/services/programsService";
import { resolveImage } from "@/utils/resolveImage";

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
  const { page = 1, search = "", admin = false } = options;
  const { i18n } = useTranslation();
  const [programs, setPrograms] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetch = async () => {
      try {
        let response;
        if (admin) {
          response = await programsService.getAll({ page, limit: 10, search });
        } else {
          response = await programsService.getAllForUsers({ page, limit: 10, search });
        }
        // Always extract from response.data.data.data or response.data.data.programs
        let items: any[] = [];
        if (Array.isArray(response?.data?.data?.data)) {
          items = response.data.data.data;
        } else if (Array.isArray(response?.data?.data?.programs)) {
          items = response.data.data.programs;
        } else if (Array.isArray(response?.data?.data)) {
          items = response.data.data;
        } else if (Array.isArray(response?.data)) {
          items = response.data;
        } else if (response?.data?.data && typeof response.data.data === 'object') {
          // If it's a single object, wrap it in an array
          items = [response.data.data];
        } else if (response?.data && typeof response.data === 'object') {
          items = [response.data];
        } else {
          items = [];
        }
        const paginationData = response?.data?.data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 };
        const lang = i18n.language as "ar" | "en" | "tr";
        const mapped = items.map((item: any) => {
          const t = item.title && typeof item.title === "object" ? item.title[lang] || item.title.ar || "" : item.title || "";
          return {
            id: item.slug || item._id || item.id,
            _id: item._id || item.id,
            slug: item.slug || "",
            title: t,
            startDate: item.startDate,
            endDate: item.endDate,
            location: item.location || "",
            coverImage: resolveImage(item.coverImage),
            category: item.category || "",
            isPublished: item.isPublished,
            ...item,
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
  }, [page, search, i18n.language, admin]);

  const reload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 0);
  };

  return { programs, pagination, loading, reload };
}
