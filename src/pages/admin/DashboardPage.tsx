import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  dashboardService,
  type DashboardStats,
} from "@/services/dashboardService";
import {
  Newspaper,
  CalendarDays,
  GraduationCap,
  Trophy,
  Mail,
  Users,
  Image,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  link?: string;
  subtitle?: string;
}

function StatCard({
  title,
  value,
  icon,
  color,
  link,
  subtitle,
}: StatCardProps) {
  const content = (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-xl`}>{icon}</div>
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
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "فشل تحميل الإحصائيات");
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
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // Safe defaults when merging API response
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
    volunteers: { total: 0, pending: 0, accepted: 0, rejected: 0, ...(raw.volunteers || {}) },
    gallery: { albums: 0, photos: 0, ...(raw.gallery || {}) },
    content: { achievements: 0, faqs: 0, pages: 0, tickers: 0, ...(raw.content || {}) },
    users: { total: 0, active: 0, byRole: {}, ...(raw.users || {}) },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-l from-red-600 to-red-800 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h2>
        <p className="text-red-100">
          إدارة محتوى موقع اتحاد الطلاب اليمنيين - فرع إلاذغ
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <span className="font-bold text-gray-800">
                {s.programs.byStatus.upcoming}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-green-500" />
                <span className="text-sm text-gray-600">جارية</span>
              </div>
              <span className="font-bold text-gray-800">
                {s.programs.byStatus.ongoing}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">مكتملة</span>
              </div>
              <span className="font-bold text-gray-800">
                {s.programs.byStatus.completed}
              </span>
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
                  {role === "super_admin"
                    ? "مدير عام"
                    : role === "admin"
                      ? "مدير"
                      : role === "editor"
                        ? "محرر"
                        : "طالب"}
                </span>
                <span className="font-bold text-gray-800">
                  {count as number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
