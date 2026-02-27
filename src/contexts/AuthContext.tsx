import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'student';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    console.log('[Auth] checkAuth started');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('[Auth] No accessToken found');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('[Auth] accessToken exists, checking /auth/me');
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
    } catch (err: any) {
      console.log('[Auth] /auth/me failed, error:', err);
      // محاولة التجديد إذا فشل التحقق
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        console.log('[Auth] Trying refresh with refreshToken:', refreshToken);
        try {
          const res = await api.post('/auth/refresh-token', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          console.log('[Auth] Refresh success, new accessToken:', accessToken);
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          // تحديث header الخاص بـ axios
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          // إعادة محاولة التحقق بعد التجديد
          const { data } = await api.get('/auth/me');
          setUser(data.data.user);
          setIsLoading(false);
          return;
        } catch (refreshErr) {
          console.log('[Auth] Refresh failed:', refreshErr);
          // إذا فشل التجديد، حذف التوكنات وتسجيل الخروج
          setUser(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      } else {
        console.log('[Auth] No refreshToken found, logging out');
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email, password });
    const { user: userData, accessToken, refreshToken } = data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const isEditor = isAdmin || user?.role === 'editor';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
        isAdmin,
        isEditor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
