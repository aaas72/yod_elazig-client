import React, { useEffect, useState, useCallback } from 'react';
import { resourcesService, type ResourceItem } from '@/services/resourcesService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminResourcesPage() {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titleAr: '', titleEn: '', titleTr: '',
    descAr: '', descEn: '', descTr: '',
    type: 'document' as ResourceItem['type'], category: '', fileUrl: '', icon: '',
  });

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await resourcesService.getAll({ page, limit: 10, search }); setItems(data?.resources || []); setPagination(data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 }); } catch { toast.error('فشل التحميل'); } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ titleAr: '', titleEn: '', titleTr: '', descAr: '', descEn: '', descTr: '', type: 'document' as ResourceItem['type'], category: '', fileUrl: '', icon: '' });
    setModalOpen(true);
  };

  const openEdit = (item: ResourceItem) => {
    setEditingItem(item);
    setFormData({
      titleAr: item.title.ar, titleEn: item.title.en, titleTr: item.title.tr,
      descAr: item.description?.ar || '', descEn: item.description?.en || '', descTr: item.description?.tr || '',
      type: item.type || 'document', category: item.category || '', fileUrl: item.fileUrl || '', icon: item.icon || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        title: { ar: formData.titleAr, en: formData.titleEn, tr: formData.titleTr },
        description: { ar: formData.descAr, en: formData.descEn, tr: formData.descTr },
        type: formData.type, category: formData.category, fileUrl: formData.fileUrl, icon: formData.icon,
      };
      if (editingItem) { await resourcesService.update(editingItem._id, payload); toast.success('تم التحديث'); }
      else { await resourcesService.create(payload); toast.success('تم الإنشاء'); }
      setModalOpen(false); loadData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'فشلت العملية'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; try { await resourcesService.delete(id); toast.success('تم الحذف'); loadData(); } catch { toast.error('فشل الحذف'); } };

  const typeLabels: Record<string, string> = { document: 'مستند', video: 'فيديو', link: 'رابط', guide: 'دليل' };

  const columns = [
    { key: 'title', label: 'العنوان', render: (item: ResourceItem) => <p className="font-medium text-gray-800 truncate max-w-xs">{item.title.ar || item.title.en}</p> },
    { key: 'type', label: 'النوع', render: (item: ResourceItem) => <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">{typeLabels[item.type] || item.type}</span> },
    { key: 'category', label: 'التصنيف', render: (item: ResourceItem) => <span className="text-sm text-gray-500">{item.category || '-'}</span> },
    { key: 'fileUrl', label: 'الملف', render: (item: ResourceItem) => item.fileUrl ? <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs"><Download size={14} />تحميل</a> : <span className="text-gray-400 text-xs">-</span> },
  ];

  return (
    <>
      <AdminDataTable title="إدارة الموارد" data={items} columns={columns} loading={loading} search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} onAdd={openCreate} addLabel="مورد جديد" pagination={pagination} onPageChange={setPage} actions={(item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-blue-600" /></button>
          <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
        </div>
      )} />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل المورد' : 'إضافة مورد'} size="xl">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">النوع *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceItem['type'] })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white">
                <option value="document">مستند</option><option value="video">فيديو</option><option value="link">رابط</option><option value="guide">دليل</option>
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">التصنيف</label><input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">رابط الملف</label><input value={formData.fileUrl} onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الأيقونة</label><input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g. FileText" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button><button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}</button></div>
        </div>
      </AdminModal>
    </>
  );
}
