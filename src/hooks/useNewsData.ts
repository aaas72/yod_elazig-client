import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { newsService } from '@/services/newsService';
import { resolveImage } from '@/utils/resolveImage';
import ar from '../../data/locales/ar/news.json';
import en from '../../data/locales/en/news.json';
import tr from '../../data/locales/tr/news.json';

const staticMap: Record<string, any[]> = { ar, en, tr };

export const useNewsData = () => {
  const { i18n } = useTranslation();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    newsService
      .getPublished({ limit: 100 })
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.news;
        if (!cancelled && items?.length) {
          const lang = i18n.language as 'ar' | 'en' | 'tr';
          const mapped = items.map((item: any) => {
            const t = item.translations?.[lang] || item.translations?.ar || {};
            const dateStr = item.publishedAt || item.createdAt || '';
            let time = '';
            try {
              const d = new Date(dateStr);
              if (!isNaN(d.getTime())) {
                const hh = String(d.getHours()).padStart(2, '0');
                const mm = String(d.getMinutes()).padStart(2, '0');
                time = `${hh}:${mm}`;
              }
            } catch { /* ignore */ }

            return {
              id: item.slug || item._id || item.id,
              _id: item._id || item.id,
              slug: item.slug || '',
              title: t.title || item.title || 'بدون عنوان',
              date: dateStr,
              time,
              image: resolveImage(item.coverImage || item.image),
              coverImage: resolveImage(item.coverImage || item.image),
              author: item.author?.name || item.author || '',
              content: t.content || item.content || '',
              summary: t.summary || item.summary || '',
              category: t.category || item.category || '',
              tags: t.tags
                ? (typeof t.tags === 'string' ? t.tags.split(',').map((x: string) => x.trim()).filter(Boolean) : t.tags)
                : item.tags || [],
            };
          });
          setNews(mapped);
        } else if (!cancelled) {
          setNews([]);
        }
      })
      .catch((err) => {
        console.warn('News API error:', err?.message);
        if (!cancelled) setNews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [i18n.language]);

  return { news, loading };
};
