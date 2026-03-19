"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { boardMembersService, type BoardMemberItem } from '@/services/boardMembersService';
import { uploadService } from '@/services/uploadService';
import { resolveImage } from '@/utils/resolveImage';
import { formatFileSize } from '@/utils/imageCompressor';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Upload, X, Facebook, Instagram, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBoardMembersPage() {
  const [items, setItems] = useState<BoardMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BoardMemberItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nameAr: '', nameEn: '', nameTr: '',
    posAr: '', posEn: '', posTr: '',
    deptAr: '', deptEn: '', deptTr: '',
    image: '',
    facebook: '', instagram: '', linkedin: '',
    type: 'executive' as 'executive' | 'organizational' | 'supervisory',
    order: 0,
    isPublished: false,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { limit: 1000, search };
      if (typeFilter) params.type = typeFilter;
      const data = await boardMembersService.getAll(params);
      setItems(data?.data || []);
    } catch {
      toast.error('فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ nameAr: '', nameEn: '', nameTr: '', posAr: '', posEn: '', posTr: '', deptAr: '', deptEn: '', deptTr: '', image: '', facebook: '', instagram: '', linkedin: '', type: 'executive', order: 0, isPublished: true });
    setModalOpen(true);
  };

  const openEdit = (item: BoardMemberItem) => {
    setEditingItem(item);
    setFormData({
      nameAr: item.name.ar, nameEn: item.name.en, nameTr: item.name.tr,
      posAr: item.position.ar, posEn: item.position.en, posTr: item.position.tr,
      deptAr: item.department?.ar || '', deptEn: item.department?.en || '', deptTr: item.department?.tr || '',
      image: item.image || '',
      facebook: item.socialLinks?.facebook || '', instagram: item.socialLinks?.instagram || '', linkedin: item.socialLinks?.linkedin || '',
      type: item.type,
      order: item.order || 0,
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
        folder: editingItem ? `board-members/${editingItem._id}` : `board-members/new-${Date.now()}`,
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
      toast.error('يرجى إدخال الاسم بالثلاث لغات');
      return;
    }
    if (!formData.posAr.trim() || !formData.posEn.trim() || !formData.posTr.trim()) {
      toast.error('يرجى إدخال المنصب بالثلاث لغات');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: { ar: formData.nameAr, en: formData.nameEn, tr: formData.nameTr },
        position: { ar: formData.posAr, en: formData.posEn, tr: formData.posTr },
        department: { ar: formData.deptAr, en: formData.deptEn, tr: formData.deptTr },
        image: formData.image,
        socialLinks: { facebook: formData.facebook, instagram: formData.instagram, linkedin: formData.linkedin },
        type: formData.type,
        order: formData.order,
        isPublished: formData.isPublished,
      };
      if (editingItem) {
        await boardMembersService.update(editingItem._id, payload);
        toast.success('تم التحديث');
      } else {
        await boardMembersService.create(payload);
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
      await boardMembersService.delete(id);
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
      render: (item: BoardMemberItem) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {item.image ? (
            <img src={resolveImage(item.image, { folder: 'board-members' })} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
          )}
        </div>
      ),
    },
    { key: 'name', label: 'الاسم', render: (item: BoardMemberItem) => <p className="font-medium text-gray-800">{item.name.ar || item.name.en}</p> },
    { key: 'position', label: 'المنصب', render: (item: BoardMemberItem) => <p className="text-gray-500 text-sm">{item.position.ar || item.position.en}</p> },
    {
      key: 'type',
      label: 'النوع',
      render: (item: BoardMemberItem) => (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
          {item.type === 'executive' ? 'هيئة تنفيذية' : item.type === 'supervisory' ? 'هيئة رقابية' : 'هيكل تنظيمي'}
        </span>
      ),
    },
    {
      key: 'isPublished',
      label: 'الحالة',
      render: (item: BoardMemberItem) => (
        <span className={`px-2 py-1 text-xs rounded-full ${item.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.isPublished ? 'منشور' : 'مسودة'}
        </span>
      ),
    },
  ];

  return (
    <>
      {/* فلتر النوع */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTypeFilter('')}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${!typeFilter ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          الكل
        </button>
        <button
          onClick={() => setTypeFilter('executive')}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${typeFilter === 'executive' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          الهيئة التنفيذية
        </button>
        <button
          onClick={() => setTypeFilter('supervisory')}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${typeFilter === 'supervisory' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          الهيئة الرقابية
        </button>
        <button
          onClick={() => setTypeFilter('organizational')}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${typeFilter === 'organizational' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          الهيكل التنظيمي
        </button>
      </div>

      <AdminDataTable
        title=""
        data={items}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onAdd={openCreate}
        addLabel="إضافة عضو جديد"
        actions={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-blue-600" /></button>
            <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
          </div>
        )}
      />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل عضو' : 'إضافة عضو'} size="xl">
        <div className="space-y-5">
          {/* صورة العضو */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">صورة العضو</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 shrink-0">
                {formData.image ? (
                  <img src={resolveImage(formData.image, { folder: 'board-members' })} alt="" className="w-full h-full object-cover" />
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

          {/* النوع والترتيب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">النوع *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'executive' | 'organizational' | 'supervisory' })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="executive">هيئة تنفيذية</option>
                <option value="supervisory">الهيئة الرقابية</option>
                <option value="organizational">هيكل تنظيمي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الترتيب</label>
              <input
                type="number"
                min={0}
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* الاسم */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم (عربي) *</label>
              <input value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم (إنجليزي) *</label>
              <input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم (تركي) *</label>
              <input value={formData.nameTr} onChange={(e) => setFormData({ ...formData, nameTr: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
          </div>

          {/* المنصب */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المنصب (عربي) *</label>
              <input value={formData.posAr} onChange={(e) => setFormData({ ...formData, posAr: e.target.value })} placeholder="مثال: رئيس الاتحاد" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المنصب (إنجليزي) *</label>
              <input value={formData.posEn} onChange={(e) => setFormData({ ...formData, posEn: e.target.value })} placeholder="e.g. President" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المنصب (تركي) *</label>
              <input value={formData.posTr} onChange={(e) => setFormData({ ...formData, posTr: e.target.value })} placeholder="örn. Başkan" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
          </div>

          {/* القسم */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">القسم/اللجنة (عربي)</label>
              <input value={formData.deptAr} onChange={(e) => setFormData({ ...formData, deptAr: e.target.value })} placeholder="مثال: لجنة الثقافة" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">القسم/اللجنة (إنجليزي)</label>
              <input value={formData.deptEn} onChange={(e) => setFormData({ ...formData, deptEn: e.target.value })} placeholder="e.g. Culture Committee" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">القسم/اللجنة (تركي)</label>
              <input value={formData.deptTr} onChange={(e) => setFormData({ ...formData, deptTr: e.target.value })} placeholder="örn. Kültür Komitesi" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
          </div>

          {/* روابط السوشيال ميديا */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><Facebook size={14} className="text-[#1877F2]" /> Facebook</label>
              <input value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} placeholder="https://facebook.com/..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><Instagram size={14} className="text-[#E4405F]" /> Instagram</label>
              <input value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="https://instagram.com/..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><Linkedin size={14} className="text-[#0A66C2]" /> LinkedIn</label>
              <input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500" dir="ltr" />
            </div>
          </div>

          {/* نشر */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-5 h-5 rounded text-red-600 focus:ring-red-500" />
              <span className="text-sm font-medium text-gray-700">نشر العضو</span>
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
