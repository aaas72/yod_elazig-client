'use client';

import { useState, useEffect } from 'react';
import { boardMembersService, type BoardMemberItem } from '@/services/boardMembersService';

export const useBoardMembersData = (type?: 'executive' | 'organizational', lang: 'ar' | 'en' | 'tr' = 'ar') => {
  const [members, setMembers] = useState<{
    id: string;
    name: string;
    position: string;
    department?: string;
    image?: string;
    type: string;
    socialLinks?: { facebook?: string; instagram?: string; linkedin?: string };
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await boardMembersService.getPublished(type);

        const localized = (data || [])
          .sort((a: BoardMemberItem, b: BoardMemberItem) => a.order - b.order)
          .map((item: BoardMemberItem) => ({
            id: item._id,
            name: item.name[lang] || item.name['ar'] || '',
            position: item.position[lang] || item.position['ar'] || '',
            department: item.department?.[lang] || item.department?.['ar'] || '',
            image: item.image,
            type: item.type,
            socialLinks: item.socialLinks,
          }));

        setMembers(localized);
        setError(null);
      } catch {
        setError('Failed to load board members');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, lang]);

  return { members, loading, error };
};
