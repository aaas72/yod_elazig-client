"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { membersService } from '@/services/membersService';
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
  UserMinus,
  GraduationCap,
  Edit3,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Member {
  _id: string;
  studentId: string;
  fullName: string;
  fullNameEn: string;
  email: string;
  tcNumber: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  university: string;
  department: string;
  yearOfStudy: number;
  address?: string;
  profileImage?: string;
  studentDocument?: string;
  files?: string[];
  isActive: boolean;
  status: 'pending' | 'active' | 'suspended' | 'graduated' | 'rejected';
  reviewedBy?: { name: string };
  reviewedAt?: string;
  reviewNote?: string;
  membershipType: 'regular' | 'premium' | 'honorary';
  applicationDate: string;
  enrollmentDate: string;
  notes?: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-gray-50 text-gray-700',
  active: 'bg-green-50 text-green-700',
  suspended: 'bg-red-50 text-red-700',
  graduated: 'bg-gray-50 text-gray-700',
  rejected: 'bg-red-50 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة',
  active: 'نشط',
  suspended: 'معلق',
  graduated: 'متخرج',
  rejected: 'مرفوض',
};

export default function AdminMembersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [stats, setStats] = useState({
    total: 0, pending: 0, active: 0, suspended: 0, graduated: 0, rejected: 0,
  });

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewAction, setReviewAction] = useState<'rejected' | 'active' | 'suspended' | 'graduated'>('active');
  const [reviewing, setReviewing] = useState(false);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    fullNameEn: '',
    email: '',
    phoneNumber: '',
    tcNumber: '',
    university: '',
    department: '',
    yearOfStudy: '',
    address: '',
    membershipType: 'regular' as string,
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    const timer = setTimeout(() => { loadData(); }, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, authLoading]);

  const loadData = async () => {
    if (!isAuthenticated || !user) {
      setMembers([]);
      setStats({ total: 0, pending: 0, active: 0, suspended: 0, graduated: 0, rejected: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [membersResult, statsResult] = await Promise.allSettled([
        membersService.getAll(),
        membersService.getStats(),
      ]);

      if (membersResult.status === 'fulfilled') {
        setMembers(membersResult.value.data || []);
      } else {
        setMembers([]);
      }

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value || { total: 0, pending: 0, active: 0, suspended: 0, graduated: 0, rejected: 0 });
      } else {
        setStats({ total: 0, pending: 0, active: 0, suspended: 0, graduated: 0, rejected: 0 });
      }

      if (membersResult.status === 'rejected' && statsResult.status === 'rejected') {
        toast.error('فشل تحميل البيانات');
      }
    } catch {
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setViewModalOpen(true);
  };

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setEditForm({
      fullName: member.fullName,
      fullNameEn: member.fullNameEn,
      email: member.email,
      phoneNumber: member.phoneNumber,
      tcNumber: member.tcNumber,
      university: member.university || '',
      department: member.department || '',
      yearOfStudy: member.yearOfStudy?.toString() || '',
      address: member.address || '',
      membershipType: member.membershipType || 'regular',
      notes: member.notes || '',
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedMember) return;
    setSaving(true);
    try {
      await membersService.update(selectedMember._id, {
        fullName: editForm.fullName,
        fullNameEn: editForm.fullNameEn,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        tcNumber: editForm.tcNumber,
        university: editForm.university || undefined,
        department: editForm.department || undefined,
        yearOfStudy: editForm.yearOfStudy ? Number(editForm.yearOfStudy) : undefined,
        address: editForm.address || undefined,
        membershipType: editForm.membershipType as any,
        notes: editForm.notes || undefined,
      } as any);
      toast.success('تم تحديث البيانات بنجاح');
      setEditModalOpen(false);
      loadData();
    } catch {
      toast.error('فشل تحديث البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewClick = (
    member: Member,
    action: 'rejected' | 'active' | 'suspended' | 'graduated'
  ) => {
    setSelectedMember(member);
    setReviewAction(action);
    setReviewNote('');
    setReviewModalOpen(true);
  };

  const handleReview = async () => {
    if (!selectedMember) return;
    setReviewing(true);
    try {
      await membersService.review(selectedMember._id, reviewAction, reviewNote);
      const actionLabels: Record<string, string> = {
        rejected: 'تم رفض العضوية',
        active: 'تم قبول وتفعيل العضو',
        suspended: 'تم تعليق العضو',
        graduated: 'تم تخريج العضو',
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
    if (!window.confirm('هل أنت متأكد من حذف هذا العضو؟')) return;
    try {
      await membersService.delete(id);
      toast.success('تم الحذف بنجاح');
      loadData();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.fullNameEn.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.tcNumber.includes(search) ||
      (m.studentId && m.studentId.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'studentId',
      label: 'المعرف',
      render: (item: Member) => (
        <span className="font-mono text-sm text-blue-600">{item.studentId}</span>
      ),
    },
    {
      key: 'fullName',
      label: 'الاسم',
      render: (item: Member) => (
        <span className="font-medium text-gray-800">{item.fullName}</span>
      ),
    },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'tcNumber', label: 'رقم الهوية' },
    {
      key: 'university',
      label: 'الجامعة',
      render: (item: Member) => item.university || '-',
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (item: Member) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
          {statusLabels[item.status]}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاريخ التسجيل',
      render: (item: Member) => new Date(item.createdAt).toLocaleDateString('ar-SA'),
    },
  ];

  const reviewActionLabels: Record<string, string> = {
    rejected: 'رفض العضوية',
    active: 'قبول وتفعيل العضو',
    suspended: 'تعليق العضو',
    graduated: 'تخريج العضو',
  };

  const reviewConfirmMessages: Record<string, string> = {
    rejected: 'هل أنت متأكد من رفض عضوية',
    active: 'هل أنت متأكد من قبول وتفعيل',
    suspended: 'هل أنت متأكد من تعليق',
    graduated: 'هل أنت متأكد من تخريج',
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
            <p className="text-sm text-gray-500">إجمالي الأعضاء</p>
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
            <GraduationCap size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.graduated}</p>
            <p className="text-sm text-gray-500">متخرج</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'الكل' },
          { value: 'pending', label: 'قيد المراجعة' },
          { value: 'active', label: 'نشط' },
          { value: 'suspended', label: 'معلق' },
          { value: 'graduated', label: 'متخرج' },
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

      {/* Members Table */}
      <AdminDataTable
        title="الأعضاء"
        data={filteredMembers}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="البحث بالمعرف، الاسم، البريد، أو رقم الهوية..."
        emptyMessage="لا توجد عضويات"
        actions={(member: Member) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleView(member)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
              title="عرض التفاصيل"
            >
              <Eye size={16} className="text-blue-600" />
            </button>
            <button
              onClick={() => handleEditClick(member)}
              className="p-1.5 hover:bg-blue-50 rounded-lg"
              title="تعديل البيانات"
            >
              <Edit3 size={16} className="text-blue-600" />
            </button>
            {member.status === 'pending' && (
              <>
                <button
                  onClick={() => handleReviewClick(member, 'active')}
                  className="p-1.5 hover:bg-green-50 rounded-lg"
                  title="قبول وتفعيل"
                >
                  <CheckCircle size={16} className="text-green-600" />
                </button>
                <button
                  onClick={() => handleReviewClick(member, 'rejected')}
                  className="p-1.5 hover:bg-red-50 rounded-lg"
                  title="رفض"
                >
                  <XCircle size={16} className="text-red-500" />
                </button>
              </>
            )}
            {member.status === 'active' && (
              <>
                <button
                  onClick={() => handleReviewClick(member, 'suspended')}
                  className="p-1.5 hover:bg-red-50 rounded-lg"
                  title="تعليق"
                >
                  <UserMinus size={16} className="text-red-500" />
                </button>
                <button
                  onClick={() => handleReviewClick(member, 'graduated')}
                  className="p-1.5 hover:bg-purple-50 rounded-lg"
                  title="تخريج"
                >
                  <GraduationCap size={16} className="text-purple-600" />
                </button>
              </>
            )}
            {member.status === 'suspended' && (
              <button
                onClick={() => handleReviewClick(member, 'active')}
                className="p-1.5 hover:bg-green-50 rounded-lg"
                title="إعادة تفعيل"
              >
                <UserCheck size={16} className="text-green-600" />
              </button>
            )}
            <button
              onClick={() => handleDelete(member._id)}
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
        title="تفاصيل العضو"
        size="lg"
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">المعرف</label>
                <p className="font-mono text-blue-600">{selectedMember.studentId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الاسم</label>
                <p className="font-medium">{selectedMember.fullName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الاسم الإنجليزي</label>
                <p className="font-medium">{selectedMember.fullNameEn}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">البريد الإلكتروني</label>
                <p className="font-medium">{selectedMember.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الهاتف</label>
                <p className="font-medium">{selectedMember.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">رقم الهوية</label>
                <p className="font-medium">{selectedMember.tcNumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الجامعة</label>
                <p className="font-medium">{selectedMember.university || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">القسم</label>
                <p className="font-medium">{selectedMember.department || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">سنة الدراسة</label>
                <p className="font-medium">{selectedMember.yearOfStudy || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">الحالة</label>
                <p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[selectedMember.status]}`}>
                    {statusLabels[selectedMember.status]}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">نوع العضوية</label>
                <p className="font-medium">
                  {selectedMember.membershipType === 'regular' ? 'عادي' : selectedMember.membershipType === 'premium' ? 'مميز' : 'فخري'}
                </p>
              </div>
            </div>
            {selectedMember.address && (
              <div>
                <label className="text-sm text-gray-500">العنوان</label>
                <p className="font-medium">{selectedMember.address}</p>
              </div>
            )}
            {selectedMember.notes && (
              <div>
                <label className="text-sm text-gray-500">ملاحظات</label>
                <p className="font-medium">{selectedMember.notes}</p>
              </div>
            )}
            {selectedMember.reviewNote && (
              <div>
                <label className="text-sm text-gray-500">ملاحظة المراجعة</label>
                <p className="font-medium">{selectedMember.reviewNote}</p>
              </div>
            )}
            <div className="text-sm text-gray-400">
              تاريخ التسجيل: {new Date(selectedMember.createdAt).toLocaleString('ar-SA')}
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="تعديل بيانات العضو"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الإنجليزي</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.fullNameEn}
                onChange={(e) => setEditForm({ ...editForm, fullNameEn: e.target.value })}
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
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهوية</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.tcNumber}
                onChange={(e) => setEditForm({ ...editForm, tcNumber: e.target.value })}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع العضوية</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={editForm.membershipType}
                onChange={(e) => setEditForm({ ...editForm, membershipType: e.target.value })}
              >
                <option value="regular">عادي</option>
                <option value="premium">مميز</option>
                <option value="honorary">فخري</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
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
            {reviewConfirmMessages[reviewAction]} "{selectedMember?.fullName}"؟
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
                reviewAction === 'active'
                  ? 'bg-green-600 hover:bg-green-700'
                  : reviewAction === 'graduated'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {reviewing ? 'جارٍ...' : 'تأكيد'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
