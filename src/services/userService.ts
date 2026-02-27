import api from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UserListResponse {
  users: User[];
  pagination: PaginationInfo;
}

export const userService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/users', { params });
    // The API returns { users, pagination } inside data
    return {
      users: response.data.data.users,
      pagination: response.data.data.pagination,
    };
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data.user;
  },

  create: async (userData: Partial<User> & { password: string }) => {
    const response = await api.post('/users', userData);
    return response.data.data.user;
  },

  update: async (id: string, userData: Partial<User> & { password?: string }) => {
    // Remove undefined or empty string fields (except isActive and role)
    const filtered: any = {};
    Object.entries(userData).forEach(([key, value]) => {
      if (
        value !== undefined &&
        (typeof value !== 'string' || value.trim() !== '' || key === 'password')
      ) {
        filtered[key] = value;
      }
    });
    const response = await api.patch(`/users/${id}`, filtered);
    return response.data.data.user;
  },

  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },

  toggleActive: async (id: string) => {
    const response = await api.patch(`/users/${id}/toggle-active`);
    return response.data.data.user;
  },
};