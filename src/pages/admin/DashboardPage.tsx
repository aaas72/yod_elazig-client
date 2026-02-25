import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, type DashboardStats } from '@/services/dashboardService';
import {
  Newspaper, CalendarDays, GraduationCap, Trophy,
  Mail, Users, Image, TrendingUp,
  Clock, CheckCircle, XCircle, ArrowUpRight
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  link?: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, link, subtitle }: StatCardProps) {
  const content = (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
      {link && (
        <div className="mt-3 flex items-center gap-1 text-sm text-gray-400 group-hover:text-red-600 transition-colors">
          <span>عرض التفاصيل</span>
          <ArrowUpRight size={14} />
        </div>
      )}
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={loadStats} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // Safe defaults — cast to any to avoid TS "specified more than once" warnings
  const raw = stats as Record<string, any>;
  const s = {
    news: { total: 0, published: 0, ...(raw.news || {}) },
    events: { total: 0, upcoming: 0, published: 0, ...(raw.events || {}) },
    programs: {
      total: 0,
      published: 0,
      byStatus: { upcoming: 0, ongoing: 0, completed: 0, ...(raw.programs?.byStatus || {}) },
      ...(raw.programs || {}),
    },
    students: { total: 0, active: 0, ...(raw.students || {}) },
    contacts: { total: 0, new: 0, read: 0, replied: 0, ...(raw.contacts || {}) },
    volunteers: { total: 0, pending: 0, accepted: 0, rejected: 0, ...(raw.volunteers || {}) },
    gallery: { albums: 0, photos: 0, ...(raw.gallery || {}) },
    content: { achievements: 0, faqs: 0, resources: 0, pages: 0, tickers: 0, ...(raw.content || {}) },
    users: { total: 0, active: 0, byRole: {} as Record<string, number>, ...(raw.users || {}) },
  };
  // Ensure byStatus survives the programs spread
  if (!s.programs.byStatus) {
    s.programs.byStatus = { upcoming: 0, ongoing: 0, completed: 0 };
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-l from-red-600 to-red-800 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h2>
        <p className="text-red-100">إدارة محتوى موقع اتحاد الطلاب اليمنيين - فرع إلاذغ</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="الأخبار"
          value={s.news.total}
          subtitle={`${s.news.published} منشور`}
          icon={<Newspaper size={22} className="text-blue-600" />}
          color="bg-blue-50"
          link="/admin/news"
        />
        <StatCard
          title="الفعاليات"
          value={s.events.total}
          subtitle={`${s.events.upcoming} قادم`}
          icon={<CalendarDays size={22} className="text-purple-600" />}
          color="bg-purple-50"
          link="/admin/events"
        />
        <StatCard
          title="البرامج"
          value={s.programs.total}
          subtitle={`${s.programs.published} منشور`}
          icon={<GraduationCap size={22} className="text-green-600" />}
          color="bg-green-50"
          link="/admin/programs"
        />
        <StatCard
          title="الأعضاء"
          value={s.students.total}
          subtitle={`${s.students.active} نشط`}
          icon={<Users size={22} className="text-orange-600" />}
          color="bg-orange-50"
          link="/admin/members"
        />
      </div>

      {/* Communications */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">التواصل والطلبات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="رسائل التواصل"
            value={s.contacts.total}
            subtitle={`${s.contacts.new} جديد`}
            icon={<Mail size={22} className="text-red-600" />}
            color="bg-red-50"
            link="/admin/contacts"
          />
          <StatCard
            title="طلبات التطوع"
            value={s.volunteers.total}
            subtitle={`${s.volunteers.pending} معلق`}
            icon={<Users size={22} className="text-teal-600" />}
            color="bg-teal-50"
            link="/admin/volunteers"
          />
          <StatCard
            title="معرض الصور"
            value={s.gallery.albums}
            subtitle={`${s.gallery.photos} صورة`}
            icon={<Image size={22} className="text-pink-600" />}
            color="bg-pink-50"
            link="/admin/gallery"
          />
          <StatCard
            title="المحتوى"
            value={s.content.achievements + s.content.faqs + s.content.resources}
            subtitle={`${s.content.achievements} إنجاز · ${s.content.faqs} سؤال`}
            icon={<Trophy size={22} className="text-amber-600" />}
            color="bg-amber-50"
          />
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">إحصائيات تفصيلية</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Mail size={18} className="text-red-600" />
              حالة الرسائل
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-600">جديدة</span>
                </div>
                <span className="font-bold text-gray-800">{s.contacts.new}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-600">مقروءة</span>
                </div>
                <span className="font-bold text-gray-800">{s.contacts.read}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">تم الرد</span>
                </div>
                <span className="font-bold text-gray-800">{s.contacts.replied}</span>
              </div>
            </div>
          </div>

          {/* Volunteer Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-teal-600" />
              حالة طلبات التطوع
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-yellow-500" />
                  <span className="text-sm text-gray-600">معلقة</span>
                </div>
                <span className="font-bold text-gray-800">{s.volunteers.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span className="text-sm text-gray-600">مقبولة</span>
                </div>
                <span className="font-bold text-gray-800">{s.volunteers.accepted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle size={14} className="text-red-500" />
                  <span className="text-sm text-gray-600">مرفوضة</span>
                </div>
                <span className="font-bold text-gray-800">{s.volunteers.rejected}</span>
              </div>
            </div>
          </div>

          {/* Programs Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-green-600" />
              حالة البرامج
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-sm text-gray-600">قادمة</span>
                </div>
                <span className="font-bold text-gray-800">{s.programs.byStatus.upcoming}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-sm text-gray-600">جارية</span>
                </div>
                <span className="font-bold text-gray-800">{s.programs.byStatus.ongoing}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">مكتملة</span>
                </div>
                <span className="font-bold text-gray-800">{s.programs.byStatus.completed}</span>
              </div>
            </div>
          </div>

          {/* Users by Role */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-orange-600" />
              المستخدمون حسب الدور
            </h4>
            <div className="space-y-3">
              {Object.entries(s.users.byRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {role === 'super_admin' ? 'مدير عام' :
                     role === 'admin' ? 'مدير' :
                     role === 'editor' ? 'محرر' : 'طالب'}
                  </span>
                  <span className="font-bold text-gray-800">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
