'use client';

import { useState, useEffect } from 'react';
import { studentAchievementsService, type StudentAchievementItem } from '@/services/studentAchievementsService';

export const useStudentAchievementsData = (lang: 'ar' | 'en' | 'tr' = 'ar') => {
  const [achievements, setAchievements] = useState<{
    id: string;
    name: string;
    description: string;
    category?: string;
    image?: string;
    socialLinks?: { facebook?: string; instagram?: string; linkedin?: string };
    createdAt?: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await studentAchievementsService.getPublished();

        const localized = (data || [])
          .sort((a: StudentAchievementItem, b: StudentAchievementItem) => a.order - b.order)
          .map((item: StudentAchievementItem) => ({
            id: item._id,
            name: item.studentName[lang] || item.studentName['ar'] || '',
            description: item.description[lang] || item.description['ar'] || '',
            category: item.category?.[lang] || item.category?.['ar'] || '',
            image: item.image,
            socialLinks: item.socialLinks,
            createdAt: item.createdAt,
          }));

        setAchievements(localized);
        setError(null);
      } catch {
        setError('Failed to load student achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang]);

  return { achievements, loading, error };
};
