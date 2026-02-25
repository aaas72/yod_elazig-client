import React, { useEffect, useState, useCallback } from 'react';
import { faqService, type FaqItem } from '@/services/faqService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    questionAr: '', questionEn: '', questionTr: '',
    answerAr: '', answerEn: '', answerTr: '',
    category: '', order: '0',
  });

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await faqService.getAll({ page, limit: 10, search }); setItems(data?.faqs || []); setPagination(data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 }); } catch { toast.error('فشل التحميل'); } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ questionAr: '', questionEn: '', questionTr: '', answerAr: '', answerEn: '', answerTr: '', category: '', order: String(items.length) });
    setModalOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditingItem(item);
    setFormData({
      questionAr: item.question.ar, questionEn: item.question.en, questionTr: item.question.tr,
      answerAr: item.answer.ar, answerEn: item.answer.en, answerTr: item.answer.tr,
      category: item.category || '', order: String(item.order ?? 0),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: any = {
        question: { ar: formData.questionAr, en: formData.questionEn, tr: formData.questionTr },
        answer: { ar: formData.answerAr, en: formData.answerEn, tr: formData.answerTr },
        category: formData.category, order: Number(formData.order),
      };
      if (editingItem) { await faqService.update(editingItem._id, payload); toast.success('تم التحديث'); }
      else { await faqService.create(payload); toast.success('تم الإنشاء'); }
      setModalOpen(false); loadData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'فشلت العملية'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; try { await faqService.delete(id); toast.success('تم الحذف'); loadData(); } catch { toast.error('فشل الحذف'); } };

  const columns = [
    { key: 'order', label: '#', render: (item: FaqItem) => <span className="flex items-center gap-1 text-gray-400"><GripVertical size={14} />{item.order}</span> },
    { key: 'question', label: 'السؤال', render: (item: FaqItem) => <p className="font-medium text-gray-800 truncate max-w-sm">{item.question.ar || item.question.en}</p> },
    { key: 'answer', label: 'الإجابة', render: (item: FaqItem) => <p className="text-sm text-gray-500 truncate max-w-xs">{item.answer.ar || item.answer.en}</p> },
    { key: 'category', label: 'التصنيف', render: (item: FaqItem) => <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{item.category || '-'}</span> },
  ];

  return (
    <>
      <AdminDataTable title="إدارة الأسئلة الشائعة" data={items} columns={columns} loading={loading} search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} onAdd={openCreate} addLabel="سؤال جديد" pagination={pagination} onPageChange={setPage} actions={(item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-blue-600" /></button>
          <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
        </div>
      )} />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل السؤال' : 'إضافة سؤال'} size="xl">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">السؤال (عربي) *</label><textarea value={formData.questionAr} onChange={(e) => setFormData({ ...formData, questionAr: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">السؤال (إنجليزي) *</label><textarea value={formData.questionEn} onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">السؤال (تركي) *</label><textarea value={formData.questionTr} onChange={(e) => setFormData({ ...formData, questionTr: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الإجابة (عربي) *</label><textarea value={formData.answerAr} onChange={(e) => setFormData({ ...formData, answerAr: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الإجابة (إنجليزي) *</label><textarea value={formData.answerEn} onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الإجابة (تركي) *</label><textarea value={formData.answerTr} onChange={(e) => setFormData({ ...formData, answerTr: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">التصنيف</label><input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الترتيب</label><input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button><button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}</button></div>
        </div>
      </AdminModal>
    </>
  );
}
