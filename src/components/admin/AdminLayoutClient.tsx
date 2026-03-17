"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasPageAccess, ROLE_LABELS } from '@/constants/permissions';
import {
  LayoutDashboard, Newspaper, CalendarDays, GraduationCap, Trophy, HelpCircle,
  FolderOpen, Settings, Mail, Users, Image, TicketIcon, FileBarChart,
  LogOut, Menu, X, Home, Award, UserCircle, Link2
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, exact: true },
  { to: '/admin/news', label: 'الأخبار', icon: Newspaper },
  { to: '/admin/events', label: 'الفعاليات', icon: CalendarDays },
  { to: '/admin/programs', label: 'البرامج', icon: GraduationCap },
  { to: '/admin/achievements', label: 'الإنجازات', icon: Trophy },
  { to: '/admin/student-achievements', label: 'إنجازات الطلاب', icon: Award },
  { to: '/admin/board-members', label: 'أعضاء المجلس', icon: UserCircle },
  { to: '/admin/gallery', label: 'معرض الصور', icon: Image },
  { to: '/admin/faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
  { to: '/admin/ticker', label: 'الشريط الإخباري', icon: TicketIcon },
  { to: '/admin/members', label: 'الأعضاء', icon: Users },
  { to: '/admin/volunteers', label: 'التطوع', icon: Mail },
  { to: '/admin/forms', label: 'نماذج التسجيل', icon: FolderOpen },
  { to: '/admin/reports', label: 'التقارير', icon: FileBarChart },
  { to: '/admin/special-links', label: 'روابط خاصة', icon: Link2 },
  { to: '/admin/users', label: 'المستخدمون', icon: Users },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return null;
  }

  // Check if user has student role (no dashboard access)
  if (user?.role === 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ليس لديك صلاحية الوصول</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  // Filter links based on user permissions
  const filteredLinks = sidebarLinks.filter(link =>
    hasPageAccess(user?.role, link.to)
  );

  const roleLabel = user?.role ? ROLE_LABELS[user.role] || user.role : '';

  return (
    <div className="h-screen flex overflow-hidden" dir="rtl">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 right-0 w-72 bg-white border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300 overflow-hidden lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0">
                <img src="/imgs/logos/logo_v2.png" alt="Logo" className="w-23 mr-4 object-contain"/>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin-red">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to, link.exact);
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-red-600' : 'text-gray-400'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-700 font-bold text-sm">{user?.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-400">{roleLabel}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={18} className="text-gray-400 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={22} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
              {filteredLinks.find((l) => isActive(l.to, l.exact))?.label || 'لوحة التحكم'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home size={16} />
              <span className="hidden sm:inline">الموقع</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="container mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
