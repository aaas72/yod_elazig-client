import React, { useEffect, useState, useCallback, useRef } from 'react';
import { tickerService, type TickerItem } from '@/services/tickerService';
import { uploadService } from '@/services/uploadService';
import { BASE_URL } from '@/lib/api';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Upload, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTickerPage() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TickerItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    textAr: '', textEn: '', textTr: '',
    link: '', image: '', isActive: true, order: '0',
  });

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await tickerService.getAll(); setItems(Array.isArray(data?.tickers) ? data.tickers : Array.isArray(data) ? data : []); } catch { toast.error('فشل التحميل'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ textAr: '', textEn: '', textTr: '', link: '', image: '', isActive: true, order: String(items.length) });
    setModalOpen(true);
  };

  const openEdit = (item: TickerItem) => {
    setEditingItem(item);
    setFormData({
      textAr: item.text.ar, textEn: item.text.en, textTr: item.text.tr,
      link: item.link || '', image: item.image || '', isActive: item.isActive ?? true, order: String(item.order ?? 0),
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadService.uploadImage(file, { folder: 'ticker' });
      setFormData(prev => ({ ...prev, image: result.url }));
      toast.success('تم رفع الصورة');
    } catch (error: any) {
      toast.error(error.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        text: { ar: formData.textAr, en: formData.textEn, tr: formData.textTr },
        link: formData.link, image: formData.image, isActive: formData.isActive, order: Number(formData.order),
      };
      if (editingItem) { await tickerService.update(editingItem._id, payload); toast.success('تم التحديث'); }
      else { await tickerService.create(payload); toast.success('تم الإنشاء'); }
      setModalOpen(false); loadData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'فشلت العملية'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; try { await tickerService.delete(id); toast.success('تم الحذف'); loadData(); } catch { toast.error('فشل الحذف'); } };

  const columns = [
    { key: 'order', label: '#', render: (item: TickerItem) => <span className="text-gray-400 text-sm">{item.order}</span> },
    { key: 'text', label: 'النص', render: (item: TickerItem) => <p className="font-medium text-gray-800 truncate max-w-sm">{item.text.ar || item.text.en}</p> },
    { key: 'isActive', label: 'الحالة', render: (item: TickerItem) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{item.isActive ? 'فعال' : 'معطل'}</span> },
    { key: 'link', label: 'الرابط', render: (item: TickerItem) => item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs truncate max-w-[150px] block">{item.link}</a> : <span className="text-gray-400 text-xs">-</span> },
  ];

  return (
    <>
      <AdminDataTable title="إدارة شريط الأخبار" data={items} columns={columns} loading={loading} search="" onSearchChange={() => {}} onAdd={openCreate} addLabel="عنصر جديد" pagination={{ page: 1, pages: 1, total: items.length }} onPageChange={() => {}} actions={(item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-blue-600" /></button>
          <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
        </div>
      )} />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل العنصر' : 'إضافة عنصر'} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">النص (عربي) *</label><textarea value={formData.textAr} onChange={(e) => setFormData({ ...formData, textAr: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">النص (إنجليزي) *</label><textarea value={formData.textEn} onChange={(e) => setFormData({ ...formData, textEn: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">النص (تركي) *</label><textarea value={formData.textTr} onChange={(e) => setFormData({ ...formData, textTr: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الرابط (اختياري)</label><input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">الترتيب</label><input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" dir="ltr" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الصورة (اختياري)</label>
            {formData.image && (
              <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 w-fit group">
                <img 
                  src={formData.image.startsWith('http') ? formData.image : `${BASE_URL}${formData.image.startsWith('/') ? '' : '/'}${formData.image}`} 
                  alt="معاينة" 
                  className="h-20 w-auto object-cover" 
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full hover:bg-red-700 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input 
                value={formData.image} 
                onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                placeholder="رابط الصورة أو المسار" 
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" 
                dir="ltr" 
              />
              <input 
                ref={imageInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                رفع
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">اتركها فارغة لاستخدام شعار الاتحاد.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-red-600 rounded" /><span className="text-sm text-gray-700">فعال</span></label>
          <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button><button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}</button></div>
        </div>
      </AdminModal>
    </>
  );
}
