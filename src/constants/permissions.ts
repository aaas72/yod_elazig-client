// Page permissions for admin dashboard
export const PAGE_PERMISSIONS: Record<string, string[]> = {
  '/admin': ['super_admin', 'admin', 'editor'],
  '/admin/members': ['super_admin', 'admin', 'editor'],
  '/admin/users': ['super_admin', 'admin'],
  '/admin/forms': ['super_admin', 'admin', 'editor'],
  '/admin/news': ['super_admin', 'admin', 'editor'],
  '/admin/events': ['super_admin', 'admin', 'editor'],
  '/admin/programs': ['super_admin', 'admin', 'editor'],
  '/admin/achievements': ['super_admin', 'admin', 'editor'],
  '/admin/student-achievements': ['super_admin', 'admin', 'editor'],
  '/admin/board-members': ['super_admin', 'admin', 'editor'],
  '/admin/faq': ['super_admin', 'admin', 'editor'],
  '/admin/gallery': ['super_admin', 'admin', 'editor'],
  '/admin/ticker': ['super_admin', 'admin', 'editor'],
  '/admin/volunteers': ['super_admin', 'admin'],
  '/admin/reports': ['super_admin', 'admin'],
  '/admin/special-links': ['super_admin', 'admin', 'editor'],
  '/admin/settings': ['super_admin', 'admin'],
};

// Role labels in Arabic
export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'مدير عام',
  admin: 'مدير',
  editor: 'محرر',
  student: 'طالب',
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<string, string> = {
  super_admin: 'لديك صلاحية كاملة للوصول لجميع الأقسام',
  admin: 'لديك صلاحية إدارة المحتوى والمستخدمين',
  editor: 'لديك صلاحية إدارة المحتوى (إنشاء، تعديل، حذف)',
  student: 'لديك صلاحية محدودة للعرض فقط',
};

// Check page access
export function hasPageAccess(role: string | undefined, path: string): boolean {
  if (!role) return false;

  const exactMatch = PAGE_PERMISSIONS[path];
  if (exactMatch) {
    return exactMatch.includes(role);
  }

  const parentPaths = Object.keys(PAGE_PERMISSIONS)
    .filter(p => path.startsWith(p) && p !== '/admin')
    .sort((a, b) => b.length - a.length);

  if (parentPaths.length > 0) {
    return PAGE_PERMISSIONS[parentPaths[0]]?.includes(role) ?? false;
  }

  if (path.startsWith('/admin')) {
    return ['super_admin', 'admin', 'editor'].includes(role);
  }

  return false;
}
