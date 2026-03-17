"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { studentAchievementsService, type StudentAchievementItem } from '@/services/studentAchievementsService';
import { uploadService } from '@/services/uploadService';
import { resolveImage } from '@/utils/resolveImage';
import { formatFileSize } from '@/utils/imageCompressor';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Upload, X, Facebook, Instagram, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminStudentAchievementsPage() {
  const [items, setItems] = useState<StudentAchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentAchievementItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nameAr: '', nameEn: '', nameTr: '',
    descAr: '', descEn: '', descTr: '',
    catAr: '', catEn: '', catTr: '',
    image: '',
    socialFacebook: '',
    socialInstagram: '',
    socialLinkedin: '',
    isPublished: false,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentAchievementsService.getAll({ limit: 1000, search });
      setItems(data?.data || []);
    } catch {
      toast.error('فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ nameAr: '', nameEn: '', nameTr: '', descAr: '', descEn: '', descTr: '', catAr: '', catEn: '', catTr: '', image: '', socialFacebook: '', socialInstagram: '', socialLinkedin: '', isPublished: true });
    setModalOpen(true);
  };

  const openEdit = (item: StudentAchievementItem) => {
    setEditingItem(item);
    setFormData({
      nameAr: item.studentName.ar, nameEn: item.studentName.en, nameTr: item.studentName.tr,
      descAr: item.description?.ar || '', descEn: item.description?.en || '', descTr: item.description?.tr || '',
      catAr: item.category?.ar || '', catEn: item.category?.en || '', catTr: item.category?.tr || '',
      image: item.image || '',
      socialFacebook: item.socialLinks?.facebook || '',
      socialInstagram: item.socialLinks?.instagram || '',
      socialLinkedin: item.socialLinks?.linkedin || '',
      isPublished: item.isPublished || false,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadService.uploadImage(file, {
        maxWidth: 400, maxHeight: 400, quality: 0.85,
        folder: editingItem ? `student-achievements/${editingItem._id}` : `student-achievements/new-${Date.now()}`,
      });
      setFormData(prev => ({ ...prev, image: result.url }));
      toast.success(`تم رفع الصورة (${formatFileSize(result.size)})`);
    } catch (err: any) {
      toast.error(err?.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData.nameAr.trim() || !formData.nameEn.trim() || !formData.nameTr.trim()) {
      toast.error('يرجى إدخال اسم الطالب بالثلاث لغات');
      return;
    }
    if (!formData.descAr.trim() || !formData.descEn.trim() || !formData.descTr.trim()) {
      toast.error('يرجى إدخال الوصف بالثلاث لغات');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        studentName: { ar: formData.nameAr, en: formData.nameEn, tr: formData.nameTr },
        description: { ar: formData.descAr, en: formData.descEn, tr: formData.descTr },
        category: { ar: formData.catAr, en: formData.catEn, tr: formData.catTr },
        image: formData.image,
        socialLinks: {
          facebook: formData.socialFacebook,
          instagram: formData.socialInstagram,
          linkedin: formData.socialLinkedin,
        },
        isPublished: formData.isPublished,
      };
      if (editingItem) {
        await studentAchievementsService.update(editingItem._id, payload);
        toast.success('تم التحديث');
      } else {
        await studentAchievementsService.create(payload);
        toast.success('تم الإنشاء');
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
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await studentAchievementsService.delete(id);
      toast.success('تم الحذف');
      loadData();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'الصورة',
      render: (item: StudentAchievementItem) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {item.image ? (
            <img src={resolveImage(item.image, { folder: 'student-achievements' })} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
          )}
        </div>
      ),
    },
    { key: 'studentName', label: 'اسم الطالب', render: (item: StudentAchievementItem) => <p className="font-medium text-gray-800">{item.studentName.ar || item.studentName.en}</p> },
    { key: 'category', label: 'فئة الجائزة', render: (item: StudentAchievementItem) => <p className="text-gray-500 text-sm">{item.category?.ar || item.category?.en || '—'}</p> },
    { key: 'description', label: 'الوصف', render: (item: StudentAchievementItem) => <p className="text-gray-500 text-sm truncate max-w-[200px]">{item.description.ar || item.description.en}</p> },
    {
      key: 'isPublished',
      label: 'الحالة',
      render: (item: StudentAchievementItem) => (
        <span className={`px-2 py-1 text-xs rounded-full ${item.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.isPublished ? 'منشور' : 'مسودة'}
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminDataTable
        title=""
        data={items}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onAdd={openCreate}
        addLabel="إنجاز طالب جديد"
        actions={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-blue-600" /></button>
            <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
          </div>
        )}
      />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل إنجاز طالب' : 'إضافة إنجاز طالب'} size="xl">
        <div className="space-y-5">
          {/* صورة الطالب */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">صورة الطالب</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 shrink-0">
                {formData.image ? (
                  <img src={resolveImage(formData.image, { folder: 'student-achievements' })} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload size={24} />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploading ? 'جاري الرفع...' : 'اختيار صورة'}
                </button>
                {formData.image && (
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <X size={12} /> إزالة الصورة
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* اسم الطالب */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم الطالب (عربي) *</label>
              <input value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم الطالب (إنجليزي) *</label>
              <input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم الطالب (تركي) *</label>
              <input value={formData.nameTr} onChange={(e) => setFormData({ ...formData, nameTr: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
          </div>

          {/* الوصف */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (عربي) *</label>
              <textarea value={formData.descAr} onChange={(e) => setFormData({ ...formData, descAr: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (إنجليزي) *</label>
              <textarea value={formData.descEn} onChange={(e) => setFormData({ ...formData, descEn: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (تركي) *</label>
              <textarea value={formData.descTr} onChange={(e) => setFormData({ ...formData, descTr: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
          </div>

          {/* فئة الجائزة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">فئة الجائزة (عربي)</label>
              <input value={formData.catAr} onChange={(e) => setFormData({ ...formData, catAr: e.target.value })} placeholder="مثال: أكاديمي، رياضي، ثقافي" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">فئة الجائزة (إنجليزي)</label>
              <input value={formData.catEn} onChange={(e) => setFormData({ ...formData, catEn: e.target.value })} placeholder="e.g. Academic, Sports, Cultural" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">فئة الجائزة (تركي)</label>
              <input value={formData.catTr} onChange={(e) => setFormData({ ...formData, catTr: e.target.value })} placeholder="örn. Akademik, Spor, Kültürel" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
          </div>

          {/* روابط التواصل الاجتماعي */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Facebook size={16} className="text-[#1877F2]" /> Facebook
              </label>
              <input value={formData.socialFacebook} onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })} placeholder="https://facebook.com/..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Instagram size={16} className="text-[#E4405F]" /> Instagram
              </label>
              <input value={formData.socialInstagram} onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })} placeholder="https://instagram.com/..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Linkedin size={16} className="text-[#0A66C2]" /> LinkedIn
              </label>
              <input value={formData.socialLinkedin} onChange={(e) => setFormData({ ...formData, socialLinkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
          </div>

          {/* نشر */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-5 h-5 rounded text-red-600 focus:ring-red-500" />
              <span className="text-sm font-medium text-gray-700">نشر الإنجاز</span>
            </label>
          </div>

          {/* أزرار */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">
              {saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}
            </button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
