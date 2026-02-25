import { useState, useEffect } from 'react';
import { membersService } from '@/services/membersService';

export const useMembersData = (options = { page: 1, limit: 10, search: '' }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);

  interface MembersListResponse {
    data: any[];
    pagination: {
      page: number;
      pages: number;
      total: number;
      limit: number;
    };
  }

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await membersService.getAll(options) as MembersListResponse;
      console.log('FULL RESPONSE:', response);
      // Programs methodology: expect { data, pagination }
      let items: any[] = [];
      if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray(response.data)) {
          items = response.data;
        }
        setPagination(response.pagination || { page: 1, pages: 1, total: 0, limit: 10 });
      }
      setMembers(items);
    } catch (err) {
      console.error('Error fetching members:', err);
      setMembers([]);
      setPagination({ page: 1, pages: 1, total: 0, limit: 10 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.page, options.limit, options.search]);

  return { members, pagination, loading, reload: fetchMembers };
};
