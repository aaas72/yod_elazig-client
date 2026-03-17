'use client';

import { useState, useEffect } from 'react';
import { membersService } from '@/services/membersService';

export const useMembersData = (options = { limit: 1000, search: '' }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  interface MembersListResponse {
    data: any[];
    pagination: any;
  }

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await membersService.getAll(options) as MembersListResponse;
      let items: any[] = [];
      if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray(response.data)) {
          items = response.data;
        }
      }
      setMembers(items);
    } catch (err) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.limit, options.search]);

  return { members, loading, reload: fetchMembers };
};
