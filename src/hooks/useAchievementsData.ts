import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { achievementsService, AchievementItem } from '../services/achievementsService';

export const useAchievementsData = () => {
  const { i18n } = useTranslation();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const data = await achievementsService.getPublished();
        
        // Sort by order or date
        const sortedData = (data || []).sort((a: AchievementItem, b: AchievementItem) => a.order - b.order);
        
        // Map to localized structure
        const lang = i18n.language as 'ar' | 'en' | 'tr';
        const localizedData = sortedData.map((item: AchievementItem) => ({
          id: item._id,
          title: item.title[lang] || item.title['ar'] || '',
          description: item.description[lang] || item.description['ar'] || '',
          date: new Date(item.date || item.createdAt).getFullYear().toString(), // Or format nicely
          icon: item.icon || 'BookOpen',
          order: item.order
        }));

        setAchievements(localizedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [i18n.language]);

  return { achievements, loading, error };
};
