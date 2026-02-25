// خدمة التسجيل في العضوية
import api from '../lib/api';

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
  // Log payload for debugging
  console.log('Sending Membership Data:', payload);
  for (let [key, value] of formData.entries()) {
    console.log(`FormData: ${key} = ${value instanceof File ? value.name : value}`);
  }
  const response = await api.post('/students/join', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}