'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasPageAccess, PAGE_PERMISSIONS, ROLE_LABELS } from '@/constants/permissions';

interface UsePermissionResult {
  hasAccess: boolean;
  userRole: string | undefined;
  roleLabel: string;
  requiredRoles: string[];
  isLoading: boolean;
}

/**
 * Hook للتحقق من صلاحية الوصول للصفحة الحالية
 */
export function usePagePermission(): UsePermissionResult {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const userRole = user?.role;
  const roleLabel = userRole ? ROLE_LABELS[userRole] || userRole : '';
  const requiredRoles = PAGE_PERMISSIONS[pathname] || [];
  const hasAccess = hasPageAccess(userRole, pathname);

  return {
    hasAccess,
    userRole,
    roleLabel,
    requiredRoles,
    isLoading,
  };
}

/**
 * Hook للتحقق من صلاحية معينة
 */
export function useHasRole(allowedRoles: string[]): boolean {
  const { user } = useAuth();
  return user?.role ? allowedRoles.includes(user.role) : false;
}

/**
 * Hook للتحقق من صلاحيات متعددة
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    canManageUsers: ['super_admin', 'admin'].includes(role || ''),
    canManageContent: ['super_admin', 'admin', 'editor'].includes(role || ''),
    canViewReports: ['super_admin', 'admin'].includes(role || ''),
    canManageSettings: ['super_admin', 'admin'].includes(role || ''),
    canDeleteItems: ['super_admin', 'admin'].includes(role || ''),
    isSuperAdmin: role === 'super_admin',
    isAdmin: role === 'admin',
    isEditor: role === 'editor',
  };
}
