import React, { useState, useRef, useEffect } from 'react';
import { type ProgramItem } from '@/services/programsService';
import { useProgramsData } from '@/hooks/useProgramsData';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Eye, EyeOff, Upload, Loader2, Languages } from 'lucide-react';
import toast from 'react-hot-toast';

import { uploadService } from '@/services/uploadService';
import { formatFileSize } from '@/utils/imageCompressor';
import { resolveImage } from '@/utils/resolveImage';
import { programsService } from '@/services/programsService';

type Lang = 'ar' | 'en' | 'tr';
interface LangFields { title: string; description: string; }
const LANGS: { key: Lang; label: string; dir: 'rtl' | 'ltr'; flag: string }[] = [
  { key: 'ar', label: 'العربية', dir: 'rtl', flag: '🇾🇪' },
  { key: 'tr', label: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
  { key: 'en', label: 'English', dir: 'ltr', flag: '🇬🇧' },
];
const emptyLang = (): LangFields => ({ title: '', description: '' });
const emptyTranslations = (): Record<Lang, LangFields> => ({ ar: emptyLang(), tr: emptyLang(), en: emptyLang() });

export default function AdminProgramsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { programs: programsData, pagination, loading, reload } = useProgramsData({ page, search, admin: true });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgramItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<Lang>('ar');
  const [translations, setTranslations] = useState<Record<Lang, LangFields>>(emptyTranslations());
  const [sharedData, setSharedData] = useState({ startDate: '', endDate: '', location: '', category: '', coverImage: '', isPublished: false });

  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadService.uploadImage(file, { maxWidth: 600, maxHeight: 400, quality: 0.85, folder: 'programs' });
      setSharedData(prev => ({ ...prev, coverImage: resolveImage(result.url) }));
      toast.success(`تم رفع الصورة (${formatFileSize(result.size)})`);
    } catch (err: any) {
      toast.error(err?.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setActiveLang('ar');
    setTranslations(emptyTranslations());
    setSharedData({ startDate: '', endDate: '', location: '', category: '', coverImage: '', isPublished: false });
    setModalOpen(true);
  };

  const openEdit = (item: ProgramItem) => {
    setEditingItem(item);
    setActiveLang('ar');
    setTranslations({
      ar: { title: item.title.ar || '', description: item.description.ar || '' },
      en: { title: item.title.en || '', description: item.description.en || '' },
      tr: { title: item.title.tr || '', description: item.description.tr || '' },
    });
    setSharedData({
      startDate: item.startDate?.slice(0, 16) || '',
      endDate: item.endDate?.slice(0, 16) || '',
      location: item.location || '',
      category: item.category || '',
      coverImage: item.coverImage || '',
      isPublished: item.isPublished,
    });
    setModalOpen(true);
  };

  function updateLang(lang: Lang, field: keyof LangFields, value: string): void {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  }

  const handleSave = async () => {
    // تحقق من وجود عنوان عربي
    if (!translations.ar.title.trim()) {
      toast.error('العنوان بالعربية مطلوب');
      setActiveLang('ar');
      return;
    }
    try {
      setSaving(true);
      // بناء payload نظيف وإزالة الحقول الفارغة
      const clean = (obj: any) => {
        const out: any = {};
        Object.keys(obj).forEach(key => {
          const v = obj[key];
          if (
            v !== undefined &&
            v !== null &&
            !(typeof v === 'string' && v.trim() === '') &&
            !(Array.isArray(v) && v.length === 0)
          ) {
            out[key] = v;
          }
        });
        return out;
      };
      const payload: any = {
        title: clean({ ar: translations.ar.title, en: translations.en.title, tr: translations.tr.title }),
        description: clean({ ar: translations.ar.description, en: translations.en.description, tr: translations.tr.description }),
        startDate: sharedData.startDate,
        endDate: sharedData.endDate || undefined,
        location: sharedData.location,
        category: sharedData.category,
        coverImage: sharedData.coverImage,
        isPublished: sharedData.isPublished,
      };
      // إزالة الحقول الفارغة من المستوى الأعلى
      Object.keys(payload).forEach(key => {
        if (
          payload[key] === undefined ||
          payload[key] === null ||
          (typeof payload[key] === 'string' && payload[key].trim() === '') ||
          (Array.isArray(payload[key]) && payload[key].length === 0) ||
          (typeof payload[key] === 'object' && Object.keys(payload[key]).length === 0)
        ) {
          delete payload[key];
        }
      });
      if (editingItem) { await programsService.update(editingItem._id, payload); toast.success('تم التحديث'); }
      else { await programsService.create(payload); toast.success('تم الإنشاء'); }
      setModalOpen(false); reload();
    } catch (err: any) { toast.error(err.response?.data?.message || 'فشلت العملية'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; try { await programsService.delete(id); toast.success('تم الحذف'); reload(); } catch { toast.error('فشل الحذف'); } };
  const handleToggle = async (id: string) => { try { await programsService.togglePublish(id); toast.success('تم التحديث'); reload(); } catch { toast.error('فشل التحديث'); } };

  const statusLabel = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      upcoming: { cls: 'bg-blue-50 text-blue-700', label: 'قادم' },
      ongoing: { cls: 'bg-green-50 text-green-700', label: 'جاري' },
      completed: { cls: 'bg-gray-100 text-gray-500', label: 'مكتمل' },
    };
    const s = map[status] || { cls: 'bg-gray-100 text-gray-500', label: status };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>;
  };

  const columns = [
    { key: 'title', label: 'العنوان', render: (item: ProgramItem) => <p className="font-medium text-gray-800 truncate max-w-xs">{typeof item.title === 'object' ? item.title.ar || item.title.en : item.title}</p> },
    { key: 'status', label: 'الحالة', render: (item: ProgramItem) => statusLabel(item.status) },
    { key: 'isPublished', label: 'النشر', render: (item: ProgramItem) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.isPublished ? 'منشور' : 'مسودة'}</span> },
    { key: 'startDate', label: 'التاريخ', render: (item: ProgramItem) => <span className="text-xs text-gray-500">{new Date(item.startDate).toLocaleDateString('ar')}</span> },
  ];

  console.log("Fetching programs with params:", { page, search }); // Debugging: Log the parameters used for fetching programs
  console.log("Programs Data:", programsData); // Debugging: Log the fetched programs data

  useEffect(() => {
    console.log("Programs updated:", programsData); // Log programs whenever they are updated
  }, [programsData]);

  return (
    <>
      <AdminDataTable
        title=""
        data={programsData}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onAdd={openCreate}
        addLabel=" برنامج جديد"
        pagination={pagination}
        onPageChange={setPage}
        actions={(item) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggle(item._id)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              {item.isPublished ? (
                <EyeOff size={16} className="text-gray-400" />
              ) : (
                <Eye size={16} className="text-green-600" />
              )}
            </button>
            <button
              onClick={() => openEdit(item)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <Edit size={16} className="text-blue-600" />
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="p-1.5 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        )}
      />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل البرنامج' : 'إضافة برنامج'} size="xl">
        <div className="space-y-5">
          {/* تبويبات اللغات */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl mb-6">
            {LANGS.map(lang => (
              <button
                key={lang.key}
                onClick={() => setActiveLang(lang.key)}
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${activeLang === lang.key
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
                {activeLang === lang.key ? (
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </button>
            ))}
          </div>
          {/* حقول الترجمة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان *</label>
            <input
              value={translations[activeLang].title}
              onChange={(e) => updateLang(activeLang, 'title', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              dir={LANGS.find(l => l.key === activeLang)?.dir || 'rtl'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف *</label>
            <textarea
              value={translations[activeLang].description}
              onChange={(e) => updateLang(activeLang, 'description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              dir={LANGS.find(l => l.key === activeLang)?.dir || 'rtl'}
            />
          </div>
          {/* الحقول المشتركة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">تاريخ البداية *</label>
              <input
                type="datetime-local"
                value={sharedData.startDate}
                onChange={(e) => setSharedData({ ...sharedData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">تاريخ النهاية</label>
              <input
                type="datetime-local"
                value={sharedData.endDate}
                onChange={(e) => setSharedData({ ...sharedData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المكان</label>
              <input
                value={sharedData.location}
                onChange={(e) => setSharedData({ ...sharedData, location: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">صورة الغلاف</label>
              <div className="flex items-center gap-3">
                <input
                  value={sharedData.coverImage}
                  onChange={(e) => setSharedData({ ...sharedData, coverImage: e.target.value })}
                  placeholder="رابط الصورة أو اضغط رفع صورة"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none ${!sharedData.coverImage ? 'border-red-400' : 'border-gray-200'}`}
                  dir="ltr"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  onChange={handleCoverUpload}
                  className="hidden"
                  id="program-cover-upload"
                />
                <label htmlFor="program-cover-upload" className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl cursor-pointer border border-gray-200 hover:bg-gray-200 text-gray-700 text-xs">
                  {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                  رفع صورة
                </label>
                {sharedData.coverImage && (
                  <img src={sharedData.coverImage} alt="cover" className="w-14 h-10 object-cover rounded-lg border" />
                )}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sharedData.isPublished} onChange={(e) => setSharedData({ ...sharedData, isPublished: e.target.checked })} className="w-4 h-4 text-red-600 rounded" /><span className="text-sm text-gray-700">نشر فوري</span></label>
          <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button><button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}</button></div>
        </div>
      </AdminModal>
{/* ToastContainer is imported and rendered by the root layout or _app; no need to duplicate it here */}
    </>
  );
}
