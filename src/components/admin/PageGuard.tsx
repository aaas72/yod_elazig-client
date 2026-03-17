"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasPageAccess, PAGE_PERMISSIONS } from '@/constants/permissions';
import AccessDenied from '@/components/admin/AccessDenied';

interface PageGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  pageName?: string;
}

/**
 * مكون للتحقق من صلاحية الوصول للصفحة
 * يُستخدم داخل صفحات الأدمن للتحقق من الصلاحيات
 */
export default function PageGuard({ children, requiredRoles, pageName }: PageGuardProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  const userRole = user?.role;
  const pagePath = pathname;
  const roles = requiredRoles || PAGE_PERMISSIONS[pagePath] || [];

  // التحقق من الصلاحية
  const hasAccess = requiredRoles
    ? requiredRoles.includes(userRole || '')
    : hasPageAccess(userRole, pagePath);

  if (!hasAccess) {
    return (
      <AccessDenied
        userRole={userRole}
        requiredRoles={roles}
        pageName={pageName}
      />
    );
  }

  return <>{children}</>;
}
