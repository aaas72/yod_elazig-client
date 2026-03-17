import api from '@/lib/api-client';

interface MembershipPayload {
  fullName: string;
  fullNameEn: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  tcNumber: string;
  profileImage: File;
  studentDocument: File;
  university: string;
  department: string;
  yearOfStudy: number;
  address: string;
}

export async function submitMembership(payload: MembershipPayload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  const response = await api.post('/students/join', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
