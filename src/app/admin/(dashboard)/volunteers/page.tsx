"use client";

import React, { useEffect, useState } from 'react';
import { volunteerService } from '@/services/volunteerService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Clock,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Edit3,
  Play,
  CheckSquare,
  Pause,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Volunteer {
  _id: string;
  volunteerId: string;
  name: string;
  email: string;
  phone: string;
  university?: string;
  department?: string;
  yearOfStudy?: number;
  skills: string[];
  motivation: string;
  availableHours?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'active' | 'completed' | 'suspended';
  reviewedBy?: { name: string };
  reviewedAt?: string;
  reviewNote?: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-gray-50 text-gray-700',
  accepted: 'bg-green-50 text-green-700',
  active: 'bg-green-50 text-green-700',
  completed: 'bg-gray-50 text-gray-700',
  suspended: 'bg-red-50 text-red-700',
  rejected: 'bg-red-50 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة',
  accepted: 'مقبول',
  active: 'نشط',
  completed: 'منتهي',
  suspended: 'معلّق',
  rejected: 'مرفوض',
};

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0, active: 0, completed: 0, suspended: 0 });

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewAction, setReviewAction] = useState<'accepted' | 'rejected' | 'active' | 'completed' | 'suspended'>('accepted');
  const [reviewing, setReviewing] = useState(false);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    department: '',
    yearOfStudy: '',
    skills: '',
    motivation: '',
    availableHours: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [volunteersData, statsData] = await Promise.all([
        volunteerService.getAll(),
        volunteerService.getStats(),
      ]);
      setVolunteers(volunteersData.data || []);
      setStats(statsData || { total: 0, pending: 0, accepted: 0, rejected: 0, active: 0, completed: 0, suspended: 0 });
    } catch {
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setViewModalOpen(true);
  };

  const handleEditClick = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setEditForm({
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      university: volunteer.university || '',
      department: volunteer.department || '',
      yearOfStudy: volunteer.yearOfStudy?.toString() || '',
      skills: volunteer.skills?.join(', ') || '',
      motivation: volunteer.motivation,
      availableHours: volunteer.availableHours?.toString() || '',
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedVolunteer) return;
    setSaving(true);
    try {
      await volunteerService.update(selectedVolunteer._id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        university: editForm.university || undefined,
        department: editForm.department || undefined,
        yearOfStudy: editForm.yearOfStudy ? Number(editForm.yearOfStudy) : undefined,
        skills: editForm.skills ? editForm.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        motivation: editForm.motivation,
        availableHours: editForm.availableHours ? Number(editForm.availableHours) : undefined,
      });
      toast.success('تم تحديث البيانات بنجاح');
      setEditModalOpen(false);
      loadData();
    } catch {
      toast.error('فشل تحديث البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewClick = (volunteer: Volunteer, action: 'accepted' | 'rejected' | 'active' | 'completed' | 'suspended') => {
    setSelectedVolunteer(volunteer);
    setReviewAction(action);
    setReviewNote('');
    setReviewModalOpen(true);
  };

  const handleReview = async () => {
    if (!selectedVolunteer) return;
    setReviewing(true);
    try {
      await volunteerService.review(selectedVolunteer._id, reviewAction, reviewNote);
      const actionLabels: Record<string, string> = {
        accepted: 'تم قبول المتطوع',
        rejected: 'تم رفض المتطوع',
        active: 'تم تفعيل المتطوع',
        completed: 'تم إنهاء التطوع',
        suspended: 'تم تعليق المتطوع',
      };
      toast.success(actionLabels[reviewAction]);
      setReviewModalOpen(false);
      loadData();
    } catch {
      toast.error('فشل تحديث الحالة');
    } finally {
      setReviewing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المتطوع؟')) return;
    try {
      await volunteerService.delete(id);
      toast.success('تم الحذف بنجاح');
      loadData();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search) ||
      (v.volunteerId && v.volunteerId.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'volunteerId',
      label: 'المعرف',
      render: (item: Volunteer) => (
        <span className="font-mono text-sm text-blue-600">{item.volunteerId}</span>
      ),
    },
    {
      key: 'name',
      label: 'الاسم',
      render: (item: Volunteer) => (
        <span className="font-medium text-gray-800">{item.name}</span>
      ),
    },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'phone', label: 'الهاتف' },
    {
      key: 'university',
      label: 'الجامعة',
      render: (item: Volunteer) => item.university || '-',
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (item: Volunteer) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
          {statusLabels[item.status]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاريخ التقديم',
      render: (item: Volunteer) => new Date(item.createdAt).toLocaleDateString('ar-SA'),
    },
  ];

  const reviewActionLabels: Record<string, string> = {
    accepted: 'قبول المتطوع',
    rejected: 'رفض المتطوع',
    active: 'تفعيل المتطوع',
    completed: 'إنهاء التطوع',
    suspended: 'تعليق المتطوع',
  };

  const reviewConfirmLabels: Record<string, string> = {
    accepted: 'قبول',
    rejected: 'رفض',
    active: 'تفعيل',
    completed: 'إنهاء',
    suspended: 'تعليق',
  };

  const reviewConfirmMessages: Record<string, string> = {
    accepted: 'هل أنت متأكد من قبول',
    rejected: 'هل أنت متأكد من رفض',
    active: 'هل أنت متأكد من تفعيل',
    completed: 'هل أنت متأكد من إنهاء تطوع',
    suspended: 'هل أنت متأكد من تعليق',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer">
          <div className="bg-gray-100 group-hover:bg-red-50 p-2.5 rounded-lg transition-colors">
            <Users size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-500">إجمالي الطلبات</p>
          </div>
        </div>
        <div className="group bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer">
          <div className="bg-gray-100 group-hover:bg-red-50 p-2.5 rounded-lg transition-colors">
            <Clock size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
            <p className="text-sm text-gray-500">قيد المراجعة</p>
          </div>
        </div>
        <div className="group bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer">
          <div className="bg-gray-100 group-hover:bg-red-50 p-2.5 rounded-lg transition-colors">
            <UserCheck size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
            <p className="text-sm text-gray-500">نشط</p>
          </div>
        </div>
        <div className="group bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer">
          <div className="bg-gray-100 group-hover:bg-red-50 p-2.5 rounded-lg transition-colors">
            <CheckSquare size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
            <p className="text-sm text-gray-500">منتهي</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'الكل' },
          { value: 'pending', label: 'قيد المراجعة' },
          { value: 'accepted', label: 'مقبول' },
          { value: 'active', label: 'نشط' },
          { value: 'completed', label: 'منتهي' },
          { value: 'suspended', label: 'معلّق' },
          { value: 'rejected', label: 'مرفوض' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Volunteers Table */}
      <AdminDataTable
        title="طلبات التطوع"
        data={filteredVolunteers}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="البحث بالمعرف، الاسم، البريد، أو الهاتف..."
        emptyMessage="لا توجد طلبات تطوع"
        actions={(volunteer: Volunteer) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleView(volunteer)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
              title="عرض التفاصيل"
            >
              <Eye size={16} className="text-blue-600" />
            </button>
            <button
              onClick={() => handleEditClick(volunteer)}
              className="p-1.5 hover:bg-blue-50 rounded-lg"
              title="تعديل البيانات"
            >
              <Edit3 size={16} className="text-blue-600" />
            </button>
            {/* pending: accept / reject */}
            {volunteer.status === 'pending' && (
              <>
                <button
                  onClick={() => handleReviewClick(volunteer, 'accepted')}
                  className="p-1.5 hover:bg-green-50 rounded-lg"
                  title="قبول"
                >
                  <CheckCircle size={16} className="text-green-600" />
                </button>
                <button
                  onClick={() => handleReviewClick(volunteer, 'rejected')}
                  className="p-1.5 hover:bg-red-50 rounded-lg"
                  title="رفض"
                >
                  <XCircle size={16} className="text-red-500" />
                </button>
              </>
            )}
            {/* accepted: activate */}
            {volunteer.status === 'accepted' && (
              <button
                onClick={() => handleReviewClick(volunteer, 'active')}
                className="p-1.5 hover:bg-green-50 rounded-lg"
                title="تفعيل"
              >
                <Play size={16} className="text-green-600" />
              </button>
            )}
            {/* active: complete / suspend */}
            {volunteer.status === 'active' && (
              <>
                <button
                  onClick={() => handleReviewClick(volunteer, 'completed')}
                  className="p-1.5 hover:bg-purple-50 rounded-lg"
                  title="إنهاء التطوع"
                >
                  <CheckSquare size={16} className="text-purple-600" />
                </button>
                <button
                  onClick={() => handleReviewClick(volunteer, 'suspended')}
                  className="p-1.5 hover:bg-orange-50 rounded-lg"
                  title="تعليق"
                >
                  <Pause size={16} className="text-orange-500" />
                </button>
              </>
            )}
            {/* suspended: reactivate */}
            {volunteer.status === 'suspended' && (
              <button
                onClick={() => handleReviewClick(volunteer, 'active')}
                className="p-1.5 hover:bg-green-50 rounded-lg"
                title="إعادة تفعيل"
              >
                <Play size={16} className="text-green-600" />
              </button>
            )}
            <button
              onClick={() => handleDelete(volunteer._id)}
              className="p-1.5 hover:bg-red-50 rounded-lg"
              title="حذف"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        )}
      />

      {/* View Modal */}
      <AdminModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="تفاصيل المتطوع"
        size="lg"
      >
        {selectedVolunteer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">المعرف</label>
                <p className="font-mono text-blue-600">{selectedVolunteer.volunteerId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الاسم</label>
                <p className="font-medium">{selectedVolunteer.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">البريد الإلكتروني</label>
                <p className="font-medium">{selectedVolunteer.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الهاتف</label>
                <p className="font-medium">{selectedVolunteer.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الجامعة</label>
                <p className="font-medium">{selectedVolunteer.university || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">القسم</label>
                <p className="font-medium">{selectedVolunteer.department || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">سنة الدراسة</label>
                <p className="font-medium">{selectedVolunteer.yearOfStudy || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الساعات المتاحة</label>
                <p className="font-medium">{selectedVolunteer.availableHours || '-'} ساعة</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الحالة</label>
                <p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[selectedVolunteer.status]}`}>
                    {statusLabels[selectedVolunteer.status]}
                  </span>
                </p>
              </div>
            </div>
            {selectedVolunteer.skills.length > 0 && (
              <div>
                <label className="text-sm text-gray-500">المهارات</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedVolunteer.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-500">سبب التطوع</label>
              <p className="font-medium whitespace-pre-wrap">{selectedVolunteer.motivation}</p>
            </div>
            {selectedVolunteer.reviewNote && (
              <div>
                <label className="text-sm text-gray-500">ملاحظة المراجعة</label>
                <p className="font-medium">{selectedVolunteer.reviewNote}</p>
              </div>
            )}
            <div className="text-sm text-gray-400">
              تاريخ التقديم: {new Date(selectedVolunteer.createdAt).toLocaleString('ar-SA')}
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="تعديل بيانات المتطوع"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الساعات المتاحة أسبوعياً</label>
              <input
                type="number"
                min={1}
                max={40}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.availableHours}
                onChange={(e) => setEditForm({ ...editForm, availableHours: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الجامعة</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.university}
                onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">سنة الدراسة</label>
              <input
                type="number"
                min={1}
                max={8}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.yearOfStudy}
                onChange={(e) => setEditForm({ ...editForm, yearOfStudy: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المهارات (افصل بينها بفاصلة)</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              value={editForm.skills}
              onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">سبب التطوع</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              value={editForm.motivation}
              onChange={(e) => setEditForm({ ...editForm, motivation: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              إلغاء
            </button>
            <button
              onClick={handleEditSave}
              disabled={saving}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
            >
              {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Review Modal */}
      <AdminModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={reviewActionLabels[reviewAction]}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {reviewConfirmMessages[reviewAction]} "{selectedVolunteer?.name}"؟
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظة (اختياري)
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              rows={3}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="أضف ملاحظة..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              إلغاء
            </button>
            <button
              onClick={handleReview}
              disabled={reviewing}
              className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                reviewAction === 'accepted' || reviewAction === 'active'
                  ? 'bg-green-600 hover:bg-green-700'
                  : reviewAction === 'completed'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : reviewAction === 'suspended'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {reviewing ? 'جارٍ...' : reviewConfirmLabels[reviewAction]}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
