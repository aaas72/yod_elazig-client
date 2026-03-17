"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { specialLinksService, type SpecialLinkItem } from '@/services/specialLinksService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Link2, Copy, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSpecialLinksPage() {
  const [items, setItems] = useState<SpecialLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SpecialLinkItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    order: 0,
    isPublished: true,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await specialLinksService.getAll({ limit: 1000 });
      setItems(data?.data || []);
    } catch {
      toast.error('فشل تحميل الروابط');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      url: '',
      description: '',
      order: 0,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item: SpecialLinkItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      url: item.url,
      description: item.description || '',
      order: item.order,
      isPublished: item.isPublished,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('يجب إدخال عنوان الرابط');
      return;
    }
    if (!formData.url.trim()) {
      toast.error('يجب إدخال الرابط');
      return;
    }

    try {
      setSaving(true);
      if (editingItem) {
        await specialLinksService.update(editingItem._id, formData);
        toast.success('تم تحديث الرابط');
      } else {
        await specialLinksService.create(formData);
        toast.success('تم إنشاء الرابط');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشلت العملية');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) return;
    try {
      await specialLinksService.delete(id);
      toast.success('تم حذف الرابط');
      loadData();
    } catch {
      toast.error('فشل حذف الرابط');
    }
  };

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('فشل نسخ الرابط');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'العنوان',
      render: (item: SpecialLinkItem) => (
        <div className="flex items-center gap-2">
          <Link2 size={18} className="text-red-500 shrink-0" />
          <div>
            <p className="font-medium text-gray-800">{item.title}</p>
            {item.description && (
              <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'url',
      label: 'الرابط',
      render: (item: SpecialLinkItem) => (
        <div className="flex items-center gap-2 max-w-xs">
          <span className="text-sm text-gray-600 truncate" dir="ltr" title={item.url}>
            {item.url}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(item.url, item._id);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            title="نسخ الرابط"
          >
            {copiedId === item._id ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <Copy size={14} className="text-gray-400" />
            )}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            title="فتح الرابط"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} className="text-gray-400" />
          </a>
        </div>
      ),
    },
    {
      key: 'isPublished',
      label: 'الحالة',
      render: (item: SpecialLinkItem) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          item.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {item.isPublished ? 'نشط' : 'مخفي'}
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminDataTable
        title="الروابط الخاصة"
        data={items}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={(v) => setSearch(v)}
        onAdd={openCreate}
        addLabel="رابط جديد"
        actions={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <Edit size={16} className="text-blue-600" />
            </button>
            <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg">
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        )}
      />

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'تعديل الرابط' : 'إضافة رابط جديد'}
        size="xl"
      >
        <div className="space-y-5">
          {/* العنوان */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان الرابط <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: رابط التسجيل في العضوية"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              dir="rtl"
            />
          </div>

          {/* الرابط */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الرابط (URL) <span className="text-red-500">*</span></label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com/registration"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              dir="ltr"
            />
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف (اختياري)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف مختصر للرابط..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              rows={2}
              dir="rtl"
            />
          </div>

          {/* الترتيب */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الترتيب</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              min={0}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>

          {/* النشر */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="text-sm text-gray-700">نشر الرابط</label>
          </div>

          {/* أزرار */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
