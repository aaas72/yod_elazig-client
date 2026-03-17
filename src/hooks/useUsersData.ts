'use client';

import { useState, useEffect } from 'react';
import { userService, User } from '@/services/userService';

interface Options {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export const useUsersData = ({ limit = 1000, search = '', enabled = true }: Options) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({ limit, search });
      setUsers(res.users);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, search, enabled]);

  return { users, loading, reload: load };
};
