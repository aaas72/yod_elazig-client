import api from '@/lib/api';

export interface Member {
  _id: string;
  fullName: string;
  email: string;
  tcNumber: string;
  university: string;
  department: string;
  yearOfStudy: number;
  isActive: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface MembersListResponse {
  data: Member[];
  pagination: PaginationInfo;
}

export const membersService = {
  // Admin
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/students', { params });
    // Adjust based on actual API response structure
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data.data.student;
  },

  create: async (memberData: Partial<Member>) => {
    const response = await api.post('/students', memberData);
    return response.data.data.student;
  },

  update: async (id: string, memberData: Partial<Member> | FormData) => {
    // If memberData is FormData, use it directly (for file uploads)
    // If it's a plain object, we can send it as JSON
    const response = await api.put(`/students/${id}`, memberData);
    return response.data.data.student;
  },

  delete: async (id: string) => {
    await api.delete(`/students/${id}`);
  },

  toggleActive: async (id: string) => {
    // If the backend doesn't have a specific toggle endpoint, we can use update
    // But assuming we want to toggle, we first get the student then update
    const student = await membersService.getById(id);
    return membersService.update(id, { isActive: !student.isActive } as any);
  },
};
