"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  ArrowUpRight,
  HelpCircle,
  Award,
  UserCircle,
  FileText,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  Icon: React.ElementType;
  link?: string;
  subtitle?: string;
}

function StatCard({
  title,
  value,
  Icon,
  link,
  subtitle,
}: StatCardProps) {
  const content = (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-red-400 hover:shadow-[0_4px_20px_rgba(190,20,27,0.12)] transition-all duration-300 group cursor-pointer shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 group-hover:text-[#BE141B] transition-colors duration-300">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-gray-100 group-hover:bg-red-50 p-3 rounded-xl transition-colors">
          <Icon size={22} className="text-gray-500 group-hover:text-red-600 transition-colors" />
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

  return link ? <Link href={link} className="h-full block">{content}</Link> : content;
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
    content: { achievements: 0, faqs: 0, faqsPublished: 0, faqCategories: 0, pages: 0, tickers: 0, ...(raw.content || {}) },
    users: { total: 0, active: 0, byRole: {}, ...(raw.users || {}) },
    studentAchievements: { total: 0, published: 0, ...(raw.studentAchievements || {}) },
    boardMembers: { total: 0, executive: 0, organizational: 0, ...(raw.boardMembers || {}) },
    reports: { total: 0, ...(raw.reports || {}) },
  };

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="الأخبار"
          value={s.news.total}
          subtitle={`${s.news.published} منشور`}
          Icon={Newspaper}
          link="/admin/news"
        />
        <StatCard
          title="الفعاليات"
          value={s.events.total}
          subtitle={`${s.events.upcoming} قادم`}
          Icon={CalendarDays}
          link="/admin/events"
        />
        <StatCard
          title="البرامج"
          value={s.programs.total}
          subtitle={`${s.programs.published} منشور`}
          Icon={GraduationCap}
          link="/admin/programs"
        />
        <StatCard
          title="الأعضاء"
          value={s.students.total}
          subtitle={`${s.students.active} نشط`}
          Icon={Users}
          link="/admin/members"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="الإنجازات"
          value={s.content.achievements}
          Icon={Trophy}
          link="/admin/achievements"
        />
        <StatCard
          title="الأسئلة الشائعة"
          value={s.content.faqs}
          subtitle={`${s.content.faqsPublished} منشور • ${s.content.faqCategories} تصنيف`}
          Icon={HelpCircle}
          link="/admin/faq"
        />
        <StatCard
          title="المعرض"
          value={s.gallery.albums}
          subtitle={`${s.gallery.photos} صورة`}
          Icon={Image}
          link="/admin/gallery"
        />
        <StatCard
          title="المتطوعون"
          value={s.volunteers.total}
          subtitle={`${s.volunteers.pending} بانتظار المراجعة`}
          Icon={Mail}
          link="/admin/volunteers"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إنجازات الطلاب"
          value={s.studentAchievements.total}
          subtitle={`${s.studentAchievements.published} منشور`}
          Icon={Award}
          link="/admin/student-achievements"
        />
        <StatCard
          title="أعضاء المجلس"
          value={s.boardMembers.total}
          subtitle={`${s.boardMembers.executive} تنفيذي • ${s.boardMembers.organizational} تنظيمي`}
          Icon={UserCircle}
          link="/admin/board-members"
        />
        <StatCard
          title="التقارير"
          value={s.reports.total}
          Icon={FileText}
          link="/admin/reports"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Programs Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-red-400 hover:shadow-[0_4px_20px_rgba(190,20,27,0.12)] transition-all duration-300">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-gray-500" />
            حالة البرامج
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600">قادمة</span>
              </div>
              <span className="font-bold text-gray-800">
                {s.programs.byStatus.upcoming}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600">جارية</span>
              </div>
              <span className="font-bold text-gray-800">
                {s.programs.byStatus.ongoing}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600">مكتملة</span>
              </div>
              <span className="font-bold text-gray-800">
                {s.programs.byStatus.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Users by Role */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-red-400 hover:shadow-[0_4px_20px_rgba(190,20,27,0.12)] transition-all duration-300">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={18} className="text-gray-500" />
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
