"use client";

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// In production (browser), use relative paths. In development, use localhost.
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_BASE_URL = isProduction ? '/api/v1' : 'http://localhost:5000/api/v1';
const UPLOAD_DIR = process.env.NEXT_PUBLIC_UPLOAD_DIR || 'uploads';
const BASE_URL = isProduction ? '' : 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach token + language to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    const lang = localStorage.getItem('i18nextLng') || 'ar';
    config.headers['Accept-Language'] = lang;
  }
  return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Transform Error Messages to Arabic
    if (error.response && error.response.data) {
      let rawMsg = error.response.data.message || '';

      if (error.response.status === 422 || rawMsg.includes('Validation failed')) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          rawMsg = errors.map((e: { message: string }) => e.message.replace(/["']/g, '')).join('، ');
        }
      }

      const errorTranslations: Record<string, string> = {
        'Invalid token': 'الجلسة غير صالحة، يرجى تسجيل الدخول العودة.',
        'Token has expired': 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.',
        'No token provided': 'لم يتم العثور على جلسة صالحة.',
        'User belonging to this token no longer exists': 'حساب المستخدم لم يعد موجوداً.',
        'Password recently changed': 'تم تغيير كلمة المرور مؤخراً، يرجى تسجيل الدخول مجدداً.',
        'Account has been deactivated': 'تم إيقاف هذا الحساب.',
        'Not authorized': 'غير مصرح لك بإجراء هذه العملية.',
        'Access denied': 'تم رفض الوصول. الصلاحيات غير كافية.',
        'Duplicate value': 'يوجد عنصر آخر مسجل بنفس البيانات مسبقاً (قيمة مكررة).',
        'Invalid credentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        'Invalid input': 'البيانات المدخلة غير صحيحة.',
        'Internal Server Error': 'حدث خطأ داخلي في الخادم، يرجى المحاولة لاحقاً.',
        'Not Found': 'العنصر المطلوب غير موجود.',
        'Validation failed': 'فشل التحقق من صحة البيانات المدخلة.',
      };

      let translated = rawMsg.replace(/["']/g, '');

      for (const [eng, ar] of Object.entries(errorTranslations)) {
        if (translated.toLowerCase().includes(eng.toLowerCase())) {
          translated = ar;
          break;
        }
      }

      translated = translated.replace(/is required/g, 'مطلوب');
      translated = translated.replace(/must be a valid/g, 'يجب أن يكون صالحاً');
      translated = translated.replace(/must be at least/g, 'يجب أن يكون على الأقل');

      error.response.data.message = translated;
    }

    return Promise.reject(error);
  }
);

// Exported Token Check (Pre-flight for Uploads)
export const performPreflightTokenCheck = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    const decoded = jwtDecode(token) as { exp?: number };
    if (!decoded.exp) return;

    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;

    if (timeUntilExpiry < 60) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    }
  } catch (err) {
    console.error('Pre-flight token check failed:', err);
  }
};

export default api;
export { API_BASE_URL, UPLOAD_DIR, BASE_URL };
