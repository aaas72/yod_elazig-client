import { useState, useEffect } from 'react';
import { userService, User } from '@/services/userService';

interface Options {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export const useUsersData = ({ page = 1, limit = 10, search = '', enabled = true }: Options) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<any>({ page, limit, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({ page, limit, search });
      setUsers(res.users);
      setPagination(res.pagination);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        // clear tokens so auth context will treat as unauthenticated
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      // don't load until explicitly enabled (prevents protected calls before auth ready)
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, enabled]);

  return { users, pagination, loading, reload: load };
};