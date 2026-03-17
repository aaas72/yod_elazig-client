"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { eventsService, type EventItem } from '@/services/eventsService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Eye, EyeOff, Languages, Upload, X, Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { uploadService } from '@/services/uploadService';
import { formatFileSize } from '@/utils/imageCompressor';
import { resolveImage } from '@/utils/resolveImage';
import toast from 'react-hot-toast';

type Lang = 'ar' | 'en' | 'tr';
interface LangFields { title: string; description: string; tags: string; location: string; }
const LANGS: { key: Lang; label: string; dir: 'rtl' | 'ltr'; flag: string; placeholders: { title: string; description: string; location: string; tags: string } }[] = [
  { key: 'ar', label: 'العربية', dir: 'rtl', flag: '🇾🇪', placeholders: { title: 'أدخل عنوان الفعالية...', description: 'اكتب وصف الفعالية...', location: 'أدخل موقع الفعالية...', tags: 'وسم1, وسم2, ...' } },
  { key: 'tr', label: 'Türkçe', dir: 'ltr', flag: '🇹🇷', placeholders: { title: 'Etkinlik başlığını girin...', description: 'Etkinlik açıklamasını yazın...', location: 'Etkinlik konumunu girin...', tags: 'etiket1, etiket2, ...' } },
  { key: 'en', label: 'English', dir: 'ltr', flag: '🇬🇧', placeholders: { title: 'Enter event title...', description: 'Write event description...', location: 'Enter event location...', tags: 'tag1, tag2, ...' } },
];
const emptyLang = (): LangFields => ({ title: '', description: '', tags: '', location: '' });
const emptyTranslations = (): Record<Lang, LangFields> => ({ ar: emptyLang(), tr: emptyLang(), en: emptyLang() });

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);
  const [activeLang, setActiveLang] = useState<Lang>('ar');
  const [translations, setTranslations] = useState<Record<Lang, LangFields>>(emptyTranslations());
  const [sharedData, setSharedData] = useState({ coverImage: '', isPublished: true, date: '', category: '', capacity: '', });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const entityFolderRef = useRef<string>('events');

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await eventsService.getAll({ limit: 1000, search }); setEvents(data?.events || []); } catch { toast.error('فشل تحميل الفعاليات'); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadService.uploadImage(file, { maxWidth: 600, maxHeight: 400, quality: 0.85, folder: entityFolderRef.current });
      setSharedData(prev => ({ ...prev, coverImage: result.url }));
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
    setSharedData({ date: '', category: '', capacity: '', coverImage: '', isPublished: true });
    entityFolderRef.current = `events/new-${Date.now()}`;
    setModalOpen(true);
  };

  const openEdit = (item: EventItem) => {
    setEditingItem(item);
    setActiveLang('ar');
    entityFolderRef.current = `events/${item._id}`;
    // Extract translations from item
    const t = (item as any).translations as Record<Lang, any> | undefined;
    const tagsToStr = (v: any) => Array.isArray(v) ? v.join(', ') : (v || '');
    setTranslations({
      ar: {
        title: t?.ar?.title || item.title || '',
        description: t?.ar?.description || item.description || '',
        tags: tagsToStr(t?.ar?.tags) || tagsToStr((item as any).tags),
        location: t?.ar?.location || item.location || '',
      },
      en: {
        title: t?.en?.title || '',
        description: t?.en?.description || '',
        tags: tagsToStr(t?.en?.tags),
        location: t?.en?.location || '',
      },
      tr: {
        title: t?.tr?.title || '',
        description: t?.tr?.description || '',
        tags: tagsToStr(t?.tr?.tags),
        location: t?.tr?.location || '',
      },
    });
    setSharedData(prev => ({
      ...prev,
      coverImage: item.coverImage || '',
      isPublished: item.isPublished || false,
      date: item.startDate ? item.startDate.slice(0, 10) : '',
      capacity: item.capacity ? String(item.capacity) : '',
    }));
    setModalOpen(true);
  };

  const handleSave = async () => {
    // Validate at least Arabic title
    if (!translations.ar.title.trim()) {
      toast.error('العنوان بالعربية مطلوب');
      setActiveLang('ar');
      return;
    }
    try {
      setSaving(true);
      // Helper to parse tags to array
      const parseTags = (str: string) => str ? str.split(',').map(t => t.trim()).filter(Boolean) : [];
      // Build clean translations object (remove empty fields, tags as array)
      const cleanTranslations: Record<string, any> = {};
      for (const lang of LANGS) {
        const t = translations[lang.key];
        if (t.title.trim() || t.description.trim()) {
          cleanTranslations[lang.key] = {
            title: t.title,
            description: t.description,
            tags: parseTags(t.tags),
            location: t.location,
          };
        }
      }
      // بناء الـ payload حسب ما يتوقعه الـ backend
      const payload: any = {
        title: translations.ar.title,
        description: translations.ar.description,
        startDate: sharedData.date,
        location: translations.ar.location,
        capacity: sharedData.capacity ? parseInt(sharedData.capacity) : undefined,
        tags: parseTags(translations.ar.tags),
        isPublished: sharedData.isPublished,
        coverImage: sharedData.coverImage,
        translations: cleanTranslations,
      };
      // إزالة الحقول الفارغة
      Object.keys(payload).forEach(key => {
        if (
          payload[key] === undefined ||
          payload[key] === null ||
          (typeof payload[key] === 'string' && payload[key].trim() === '') ||
          (Array.isArray(payload[key]) && payload[key].length === 0)
        ) {
          delete payload[key];
        }
      });
      if (editingItem) { await eventsService.update(editingItem._id, payload); toast.success('تم التحديث'); }
      else { await eventsService.create(payload); toast.success('تم الإنشاء'); }
      setModalOpen(false); loadData();
    } catch (err: any) { toast.error(err.response?.data?.message || 'فشلت العملية'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; try { await eventsService.delete(id); toast.success('تم الحذف'); loadData(); } catch { toast.error('فشل الحذف'); } };
  const handleToggle = async (id: string) => { try { await eventsService.togglePublish(id); toast.success('تم التحديث'); loadData(); } catch { toast.error('فشل التحديث'); } };

  const columns = [
    { key: 'title', label: 'العنوان', render: (item: EventItem) => <p className="font-medium text-gray-800 truncate max-w-xs">{item.title}</p> },
    { key: 'startDate', label: 'التاريخ', render: (item: EventItem) => <span className="text-xs text-gray-500">{new Date(item.startDate).toLocaleDateString('ar')}</span> },
    { key: 'location', label: 'المكان', render: (item: EventItem) => <span className="text-sm text-gray-500">{item.location || '-'}</span> },
    { key: 'isPublished', label: 'الحالة', render: (item: EventItem) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.isPublished ? 'منشور' : 'مسودة'}</span> },
  ];
  function updateLang(lang: Lang, field: keyof LangFields, value: string): void {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  }

  return (
    <>
      <AdminDataTable title="" data={events} columns={columns} loading={loading} search={search} onSearchChange={setSearch} onAdd={openCreate} addLabel="فعالية جديدة" actions={(item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleToggle(item._id)} className="p-1.5 hover:bg-gray-100 rounded-lg">{item.isPublished ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-green-600" />}</button>
          <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-blue-600" /></button>
          <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
        </div>
      )} />

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل الفعالية' : 'إضافة فعالية'} size="xl">
        <div className="space-y-5">
          {/* تبويبات اللغات بنفس واجهة الخبر */}
          <div className="sticky top-0 z-10 bg-white pb-2 -mx-6 px-6">
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl mb-0">
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
          </div>
          {/* حقول الترجمة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان *</label>
            <input
              value={translations[activeLang].title}
              onChange={(e) => updateLang(activeLang, 'title', e.target.value)}
              placeholder={LANGS.find(l => l.key === activeLang)?.placeholders.title}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              dir={LANGS.find(l => l.key === activeLang)?.dir || 'rtl'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف *</label>
            <RichTextEditor
              key={activeLang}
              content={translations[activeLang].description}
              onChange={(val) => updateLang(activeLang, 'description', val)}
              placeholder={LANGS.find(l => l.key === activeLang)?.placeholders.description || 'اكتب وصف الفعالية...'}
              dir={LANGS.find(l => l.key === activeLang)?.dir || 'rtl'}
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الملخص</label>
            <textarea
              // value={translations[activeLang].summary}
              // onChange={(e) => updateLang(activeLang, 'summary', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              dir={LANGS.find(l => l.key === activeLang)?.dir || 'rtl'}
              disabled
              placeholder="تم حذف الملخص بناءً على متطلبات الـ API"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">المكان</label>
            <input
              value={translations[activeLang].location}
              onChange={(e) => updateLang(activeLang, 'location', e.target.value)}
              placeholder={LANGS.find(l => l.key === activeLang)?.placeholders.location}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              dir={LANGS.find(l => l.key === activeLang)?.dir || 'rtl'}
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">التصنيف</label>
            <input
              // value={translations[activeLang].category}
              // onChange={(e) => updateLang(activeLang, 'category', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              disabled
              placeholder="تم حذف التصنيف بناءً على متطلبات الـ API"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الوسوم (مفصولة بفاصلة)</label>
            <input
              value={translations[activeLang].tags}
              onChange={(e) => updateLang(activeLang, 'tags', e.target.value)}
              placeholder={LANGS.find(l => l.key === activeLang)?.placeholders.tags}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              dir={LANGS.find(l => l.key === activeLang)?.dir || 'rtl'}
            />
          </div>
          {/* الحقول المشتركة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">التاريخ *</label>
              <input
                type="date"
                value={sharedData.date}
                onChange={(e) => setSharedData({ ...sharedData, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                dir="ltr"
              />
            </div>
            {/* صورة الغلاف مع رفع */}
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
                id="event-cover-upload"
              />
              <label htmlFor="event-cover-upload" className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl cursor-pointer border border-gray-200 hover:bg-gray-200 text-gray-700 text-xs">
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                رفع صورة
              </label>
              {sharedData.coverImage && (
                <img src={resolveImage(sharedData.coverImage)} alt="cover" className="w-14 h-10 object-cover rounded-lg border" />
              )}
            </div>
          </div>
          </div>
          {/* تم حذف الملخص والتصنيف بناءً على متطلبات الـ API */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={sharedData.isPublished} onChange={(e) => setSharedData({ ...sharedData, isPublished: e.target.checked })} className="w-4 h-4 text-red-600 rounded" />
            <span className="text-sm text-gray-700">نشر فوري</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : editingItem ? 'تحديث' : 'إنشاء'}</button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
