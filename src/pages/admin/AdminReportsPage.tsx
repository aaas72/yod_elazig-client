import React, { useEffect, useState, useCallback } from 'react';
import { reportsService, type ReportItem } from '@/services/reportsService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, FileText, Download, Upload } from 'lucide-react';
import { BASE_URL } from '@/lib/api';
import toast from 'react-hot-toast';

const QUARTER_LABELS: Record<string, string> = {
  Q1: 'الربع الأول (يناير - مارس)',
  Q2: 'الربع الثاني (أبريل - يونيو)',
  Q3: 'الربع الثالث (يوليو - سبتمبر)',
  Q4: 'الربع الرابع (أكتوبر - ديسمبر)',
};

export default function AdminReportsPage() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quarter: 'Q1' as string,
    year: currentYear,
    isPublished: false,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportsService.getAll({ page, limit: 10 });
      setItems(data?.data || []);
      setPagination(data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 });
    } catch {
      toast.error('فشل تحميل التقارير');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      quarter: 'Q1',
      year: currentYear,
      isPublished: false,
    });
    setModalOpen(true);
  };

  const openEdit = (item: ReportItem) => {
    setEditingItem(item);
    setSelectedFile(null);
    setFormData({
      title: item.title,
      description: item.description || '',
      quarter: item.quarter,
      year: item.year,
      isPublished: item.isPublished,
    });
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('يُسمح فقط بملفات PDF');
        e.target.value = '';
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error('حجم الملف يجب أن لا يتجاوز 20 ميجابايت');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!editingItem && !selectedFile) {
      toast.error('يجب رفع ملف PDF');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('يجب إدخال عنوان التقرير');
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('title', formData.title);

      if (formData.description.trim()) {
        fd.append('description', formData.description);
      }

      fd.append('quarter', formData.quarter);
      fd.append('year', formData.year.toString());
      fd.append('isPublished', formData.isPublished.toString());

      if (selectedFile) {
        fd.append('file', selectedFile);
      }

      if (editingItem) {
        await reportsService.update(editingItem._id, fd);
        toast.success('تم تحديث التقرير');
      } else {
        await reportsService.create(fd);
        toast.success('تم إنشاء التقرير');
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
    if (!confirm('هل أنت متأكد من حذف هذا التقرير؟')) return;
    try {
      await reportsService.delete(id);
      toast.success('تم حذف التقرير');
      loadData();
    } catch {
      toast.error('فشل حذف التقرير');
    }
  };

  const getFileUrl = (filePath: string) => {
    if (filePath.startsWith('http')) return filePath;
    return `${BASE_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  };

  const columns = [
    {
      key: 'title',
      label: 'العنوان',
      render: (item: ReportItem) => (
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-red-500 shrink-0" />
          <p className="font-medium text-gray-800">{item.title}</p>
        </div>
      ),
    },
    {
      key: 'quarter',
      label: 'الربع',
      render: (item: ReportItem) => (
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {item.quarter}
        </span>
      ),
    },
    {
      key: 'year',
      label: 'السنة',
      render: (item: ReportItem) => (
        <span className="text-sm font-semibold text-gray-700">{item.year}</span>
      ),
    },
    {
      key: 'isPublished',
      label: 'الحالة',
      render: (item: ReportItem) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          item.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {item.isPublished ? 'منشور' : 'مسودة'}
        </span>
      ),
    },
    {
      key: 'file',
      label: 'الملف',
      render: (item: ReportItem) => (
        <a
          href={getFileUrl(item.file)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
        >
          <Download size={14} />
          تحميل PDF
        </a>
      ),
    },
  ];

  return (
    <>
      <AdminDataTable
        title="التقارير الربعية"
        data={items}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onAdd={openCreate}
        addLabel="تقرير جديد"
        pagination={pagination}
        onPageChange={setPage}
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
        title={editingItem ? 'تعديل التقرير' : 'إضافة تقرير جديد'}
        size="xl"
      >
        <div className="space-y-5">
          {/* العنوان */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان التقرير <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: تقرير الربع الأول 2026"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              dir="rtl"
            />
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف (اختياري)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف مختصر للتقرير..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              rows={3}
              dir="rtl"
            />
          </div>

          {/* الربع والسنة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">الربع السنوي</label>
              <select
                value={formData.quarter}
                onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              >
                <option value="Q1">{QUARTER_LABELS.Q1}</option>
                <option value="Q2">{QUARTER_LABELS.Q2}</option>
                <option value="Q3">{QUARTER_LABELS.Q3}</option>
                <option value="Q4">{QUARTER_LABELS.Q4}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">السنة</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                min={2020}
                max={2100}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* رفع ملف PDF */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ملف التقرير (PDF فقط)
              {!editingItem && <span className="text-red-500 mr-1">*</span>}
            </label>

            {editingItem && editingItem.file && !selectedFile && (
              <div className="mb-3 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileText size={18} className="text-red-500" />
                <span className="text-sm text-gray-600">ملف حالي مرفق</span>
                <a
                  href={getFileUrl(editingItem.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-red-600 hover:underline mr-auto"
                >
                  عرض الملف
                </a>
              </div>
            )}

            <div className="relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="report-file-input"
              />
              <label
                htmlFor="report-file-input"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-colors"
              >
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : 'اضغط لاختيار ملف PDF'}
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-1">الحد الأقصى: 20 ميجابايت</p>
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
            <label htmlFor="isPublished" className="text-sm text-gray-700">نشر التقرير</label>
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
