import api from '@/lib/api-client';

export interface Member {
  _id: string;
  studentId: string;
  fullName: string;
  fullNameEn: string;
  email: string;
  tcNumber: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  university: string;
  department: string;
  yearOfStudy: number;
  address?: string;
  profileImage?: string;
  studentDocument?: string;
  files?: string[];
  isActive: boolean;
  // Advanced membership system fields
  status: 'pending' | 'active' | 'suspended' | 'graduated' | 'rejected';
  reviewedBy?: { _id: string; name: string; email: string };
  reviewedAt?: string;
  reviewNote?: string;
  membershipType: 'regular' | 'premium' | 'honorary';
  applicationDate: string;
  enrollmentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberStats {
  total: number;
  pending: number;
  active: number;
  suspended: number;
  graduated: number;
  rejected: number;
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
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    membershipType?: string;
    university?: string;
    department?: string;
  }) => {
    const response = await api.get('/students', { params });
    return {
      data: response.data.data.data || [],
      pagination: response.data.data.pagination,
    };
  },

  getStats: async (): Promise<MemberStats> => {
    const { data } = await api.get('/students/stats');
    const stats = data.data?.stats || data.data;

    return {
      total: stats?.total || 0,
      pending: stats?.pending || 0,
      active: stats?.active || 0,
      suspended: stats?.suspended || 0,
      graduated: stats?.graduated || 0,
      rejected: stats?.rejected || 0,
    };
  },

  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data.data.student;
  },

  getByStudentId: async (studentId: string) => {
    const response = await api.get(`/students/by-id/${studentId}`);
    return response.data.data.student;
  },

  create: async (memberData: Partial<Member>) => {
    const response = await api.post('/students', memberData);
    return response.data.data.student;
  },

  update: async (id: string, memberData: Partial<Member> | FormData) => {
    const response = await api.put(`/students/${id}`, memberData);
    return response.data.data.student;
  },

  review: async (id: string, status: string, reviewNote?: string) => {
    const { data } = await api.patch(`/students/${id}/review`, { status, reviewNote });
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/students/${id}`);
  },

  exportAll: async (filters?: {
    status?: string;
    membershipType?: string;
    university?: string;
    department?: string;
  }) => {
    const { data } = await api.get('/students/export', { params: filters });
    return data.data;
  },

  toggleActive: async (id: string) => {
    const student = await membersService.getById(id);
    return membersService.update(id, { isActive: !student.isActive } as any);
  },
};
