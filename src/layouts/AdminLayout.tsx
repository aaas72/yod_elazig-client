import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Newspaper, CalendarDays, GraduationCap, Trophy, HelpCircle,
  FolderOpen, Settings, Mail, Users, Image, TicketIcon,
  LogOut, Menu, X, ChevronDown, Globe, Home
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, exact: true },
  { to: '/admin/members', label: 'الأعضاء', icon: Users },
  { to: '/admin/news', label: 'الأخبار', icon: Newspaper },
  { to: '/admin/events', label: 'الفعاليات', icon: CalendarDays },
  { to: '/admin/programs', label: 'البرامج', icon: GraduationCap },
  { to: '/admin/achievements', label: 'الإنجازات', icon: Trophy },
  { to: '/admin/faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
  { to: '/admin/resources', label: 'الموارد', icon: FolderOpen },
  { to: '/admin/gallery', label: 'معرض الصور', icon: Image },
  { to: '/admin/ticker', label: 'الشريط الإخباري', icon: TicketIcon },
  { to: '/admin/contacts', label: 'رسائل التواصل', icon: Mail },
  { to: '/admin/volunteers', label: 'طلبات التطوع', icon: Users },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/imgs/logos/yodellogo.png" alt="Logo" className="w-10 h-10 object-contain" />
                <div>
                  <h2 className="font-bold text-gray-800 text-sm">لوحة التحكم</h2>
                  <p className="text-xs text-gray-400">YOD Elazığ</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to, link.exact);
              return (
                <Link
                  key={link.to}
                  to={link.to}
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
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="تسجيل الخروج">
                <LogOut size={18} className="text-gray-400 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={22} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
              {sidebarLinks.find((l) => isActive(l.to, l.exact))?.label || 'لوحة التحكم'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home size={16} />
              <span className="hidden sm:inline">الموقع</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
