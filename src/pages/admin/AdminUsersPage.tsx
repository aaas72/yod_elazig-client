import React, { useState } from "react";
import FormInput from "../../components/ui/Forms/FormInput";
import AdminDataTable from "../../components/admin/AdminDataTable";
import { Edit, Trash2 } from "lucide-react";
import AdminModal from "../../components/admin/AdminModal";
import { userService, User } from "@/services/userService";

import { useAuth } from '@/contexts/AuthContext';
import { ROLE_VALUES } from '@/constants/roles';
import { useEffect, useCallback } from "react";
import toast from 'react-hot-toast';
const roles = ROLE_VALUES;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  // السماح فقط للأدوار التي لها صلاحية list
  const canListUsers = ['super_admin', 'admin', 'editor'].includes(user?.role ?? '');
  const { users, pagination, loading, reload } = useUsersData({ page, limit: 10, search, enabled: isAuthenticated && !authLoading && canListUsers });
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User> & { password?: string }>({});
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!canListUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-xl text-lg font-bold shadow">
          ليس لديك صلاحية الوصول لهذه الصفحة
        </div>
      </div>
    );
  }

  const openCreate = () => {
    setEditUser(null);
    setForm({ role: 'student', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ ...u, password: '' });
    setModalOpen(true);
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editUser) {
        // Only send changed fields
        const changed: any = {};
        Object.entries(form).forEach(([key, value]) => {
          if (
            value !== undefined &&
            (typeof value !== 'string' || value.trim() !== '' || key === 'password') &&
            value !== (editUser as any)[key]
          ) {
            changed[key] = value;
          }
        });
        await userService.update(editUser._id, changed);
        toast.success('تم تحديث المستخدم');
      } else {
        await userService.create(form as any);
        toast.success('تم إنشاء المستخدم');
      }
      setModalOpen(false);
      reload();
    } catch (err: any) {
      // عرض رسالة سبب المنع (403) في الأعلى
      if (err.response?.status === 403 && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.response?.data?.message || 'فشل حفظ المستخدم');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      await userService.delete(id);
      toast.success('تم حذف المستخدم بنجاح');
      reload();
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.message) {
        toast.error('ليس لديك صلاحية حذف هذا المستخدم.');
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('حدث خطأ أثناء حذف المستخدم.');
      }
    }
  };

  const toggleActive = async (id: string) => {
    await userService.toggleActive(id);
    reload();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'isActive', label: 'Active' },
    { key: 'actions', label: 'Actions' },
  ];

  const rows = (users && Array.isArray(users) ? users : []).map(u => ({
    ...u,
    actions: (
      <div className="flex gap-2">
        <button onClick={() => openEdit(u)}>
          <Edit size={16} color="#16a34a" />
        </button>
        <button onClick={() => handleDelete(u._id)}>
          <Trash2 size={16} color="#dc2626" />
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">إدارة المستخدمين</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-red-600 text-white rounded-lg">إضافة مستخدم</button>
      </div>

      <AdminDataTable
        columns={columns}
        data={rows}
        loading={loading}
        search={search}
        pagination={pagination}
        onPageChange={setPage}
        title=""

      />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'تعديل مستخدم' : 'مستخدم جديد'}>
        <div className="space-y-4">
          <FormInput label="الاسم" name="name" value={form.name || ''} onChange={e => handleChange('name', e.target.value)} />
          <FormInput label="البريد الإلكتروني" name="email" type="email" value={form.email || ''} onChange={e => handleChange('email', e.target.value)} />
          <FormInput label="كلمة المرور" name="password" type="password" value={form.password || ''} onChange={e => handleChange('password', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الصلاحية</label>
            <select value={form.role} onChange={e => handleChange('role', e.target.value)} className="w-full border-gray-200 rounded-lg">
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input type="checkbox" checked={form.isActive} onChange={e => handleChange('isActive', e.target.checked)} />
              <span className="mr-2">نشط</span>
            </label>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg">
              {saving ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
function useUsersData({
  page,
  limit,
  search,
  enabled,
}: {
  page: number;
  limit: number;
  search: string;
  enabled: boolean;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!enabled) {
      setUsers([]);
      setPagination({});
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await userService.getAll({ page, limit, search });
      setUsers(res.users || []);
      setPagination(res.pagination || {});
    } catch (err) {
      setUsers([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, enabled]);

  useEffect(() => {
    if (!enabled) {
      setUsers([]);
      setPagination({});
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [fetchUsers, enabled]);

  const reload = () => {
    fetchUsers();
  };

  return { users, pagination, loading, reload };
}
