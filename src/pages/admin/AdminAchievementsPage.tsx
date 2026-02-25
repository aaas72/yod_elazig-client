import React, { useEffect, useState, useCallback } from 'react';
import { achievementsService, type AchievementItem } from '@/services/achievementsService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AchievementItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titleAr: '', titleEn: '', titleTr: '',
    descAr: '', descEn: '', descTr: '',
    value: '', icon: '', category: '',
  });

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await achievementsService.getAll({ page, limit: 10, search }); setItems(data?.achievements || []); setPagination(data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 }); } catch { toast.error('فشل التحميل'); } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ titleAr: '', titleEn: '', titleTr: '', descAr: '', descEn: '', descTr: '', value: '', icon: '', category: '' });
    setModalOpen(true);
  };

  const openEdit = (item: AchievementItem) => {
    setEditingItem(item);
    setFormData({
      titleAr: item.title.ar, titleEn: item.title.en, titleTr: item.title.tr,
      descAr: item.description?.ar || '', descEn: item.description?.en || '', descTr: item.description?.tr || '',
      value: item.value?.toString() || '', icon: item.icon || '', category: item.category || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: any = {
        title: { ar: formData.titleAr, en: formData.titleEn, tr: formData.titleTr },
        description: { ar: formData.descAr, en: formData.descEn, tr: formData.descTr },
        icon: formData.icon, category: formData.category,
      };
      if (formData.value) payload.value = Number(formData.value);
      if (editingItem) { await achievementsService.update(editingItem._id, payload); toast.success('تم التحديث'); }
      else { await achievementsService.create(payload); toast.success('تم الإنشاء'); }
      setModalOpen(false); loadData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'فشلت العملية'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; try { await achievementsService.delete(id); toast.success('تم الحذف'); loadData(); } catch { toast.error('فشل الحذف'); } };

  const columns = [
    { key: 'title', label: 'العنوان', render: (item: AchievementItem) => <p className="font-medium text-gray-800">{item.title.ar || item.title.en}</p> },
    { key: 'value', label: 'القيمة', render: (item: AchievementItem) => <span className="text-sm font-semibold text-red-600">{item.value || '-'}</span> },
    { key: 'category', label: 'التصنيف', render: (item: AchievementItem) => <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{item.category || '-'}</span> },
    { key: 'icon', label: 'الأيقونة', render: (item: AchievementItem) => <span className="text-xs text-gray-500">{item.icon || '-'}</span> },
  ];

  return (
    <>
      <AdminDataTable title="إدارة الإنجازات" data={items} columns={columns} loading={loading} search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} onAdd={openCreate} addLabel="إنجاز جديد" pagination={pagination} onPageChange={setPage} actions={(item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-blue-600" /></button>
          <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
        </div>
      )} />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل الإنجاز' : 'إضافة إنجاز'} size="xl">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (عربي) *</label><input value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (إنجليزي) *</label><input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان (تركي) *</label><input value={formData.titleTr} onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (عربي)</label><textarea value={formData.descAr} onChange={(e) => setFormData({ ...formData, descAr: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (إنجليزي)</label><textarea value={formData.descEn} onChange={(e) => setFormData({ ...formData, descEn: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (تركي)</label><textarea value={formData.descTr} onChange={(e) => setFormData({ ...formData, descTr: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">القيمة / الرقم</label><input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الأيقونة</label><input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g. Trophy" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">التصنيف</label><input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button><button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}</button></div>
        </div>
      </AdminModal>
    </>
  );
}
