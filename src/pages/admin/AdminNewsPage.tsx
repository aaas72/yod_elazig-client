import React, { useEffect, useState, useCallback, useRef } from 'react';
import { newsService, type NewsItem } from '@/services/newsService';
import { uploadService } from '@/services/uploadService';
import { formatFileSize } from '@/utils/imageCompressor';
import { resolveImage } from '@/utils/resolveImage';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Eye, EyeOff, Languages, Upload, X, Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import toast from 'react-hot-toast';

type Lang = 'ar' | 'en' | 'tr';
interface LangFields { title: string; content: string; summary: string; category: string; tags: string; }
const LANGS: { key: Lang; label: string; dir: 'rtl' | 'ltr'; flag: string }[] = [
  { key: 'ar', label: 'العربية', dir: 'rtl', flag: '🇾🇪' },
  { key: 'tr', label: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
  { key: 'en', label: 'English', dir: 'ltr', flag: '🇬🇧' },
];

const emptyLang = (): LangFields => ({ title: '', content: '', summary: '', category: '', tags: '' });
const emptyTranslations = (): Record<Lang, LangFields> => ({ ar: emptyLang(), tr: emptyLang(), en: emptyLang() });

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [activeLang, setActiveLang] = useState<Lang>('ar');
  const [translations, setTranslations] = useState<Record<Lang, LangFields>>(emptyTranslations());
  const [sharedData, setSharedData] = useState({ coverImage: '', isPublished: false, isFeatured: false });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadService.uploadImage(file, { maxWidth: 600, maxHeight: 400, quality: 0.85, folder: 'news' });
      setSharedData(prev => ({ ...prev, coverImage: resolveImage(result.url) }));
      toast.success(`تم رفع الصورة (${formatFileSize(result.size)})`);
    } catch (err: any) {
      toast.error(err?.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await newsService.getAll({ page, limit: 10, search });
      setNews(data?.news || []);
      setPagination(data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 });
    } catch (err) {
      toast.error('فشل تحميل الأخبار');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const updateLang = (lang: Lang, field: keyof LangFields, value: string) => {
    setTranslations(prev => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
  };

  const openCreate = () => {
    setEditingItem(null);
    setActiveLang('ar');
    setTranslations(emptyTranslations());
    setSharedData({ coverImage: '', isPublished: false, isFeatured: false });
    setModalOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingItem(item);
    setActiveLang('ar');
    // Extract translations from item
    const t = (item as any).translations as Record<Lang, LangFields> | undefined;
    if (t && t.ar) {
      setTranslations({
        ar: { title: t.ar?.title || '', content: t.ar?.content || '', summary: t.ar?.summary || '', category: t.ar?.category || item.category || '', tags: t.ar?.tags || item.tags?.join(', ') || '' },
        en: { title: t.en?.title || '', content: t.en?.content || '', summary: t.en?.summary || '', category: t.en?.category || '', tags: t.en?.tags || '' },
        tr: { title: t.tr?.title || '', content: t.tr?.content || '', summary: t.tr?.summary || '', category: t.tr?.category || '', tags: t.tr?.tags || '' },
      });
    } else {
      // Fallback: put existing single-language data in Arabic
      setTranslations({
        ar: { title: item.title || '', content: item.content || '', summary: item.summary || '', category: item.category || '', tags: item.tags?.join(', ') || '' },
        en: emptyLang(),
        tr: emptyLang(),
      });
    }
    setSharedData({
      coverImage: resolveImage(item.coverImage),
      isPublished: item.isPublished,
      isFeatured: item.isFeatured || false,
    });
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
      const parseTags = (str: string) => str ? str.split(',').map(t => t.trim()).filter(Boolean) : [];

      // Build clean translations object with tags as arrays
      const cleanTranslations: Record<string, any> = {};
      for (const lang of LANGS) {
        const t = translations[lang.key];
        if (t.title.trim() || t.content.trim()) {
          cleanTranslations[lang.key] = {
            title: t.title,
            content: t.content,
            summary: t.summary,
            category: t.category,
            tags: parseTags(t.tags),
          };
        }
      }

      const payload: Record<string, any> = {
        title: translations.ar.title,
        content: translations.ar.content,
        summary: translations.ar.summary,
        category: translations.ar.category,
        tags: parseTags(translations.ar.tags),
        translations: cleanTranslations,
        coverImage: sharedData.coverImage,
        isPublished: sharedData.isPublished,
        isFeatured: sharedData.isFeatured,
      };
      if (editingItem) {
        await newsService.update(editingItem._id, payload);
        toast.success('تم تحديث الخبر');
      } else {
        await newsService.create(payload);
        toast.success('تم إنشاء الخبر');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'فشلت العملية';
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach((e: any) => toast.error(`${e.field || ''}: ${e.message || e.msg || ''}`));
      } else {
        toast.error(msg);
      }
      console.error('Save error:', err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await newsService.delete(id);
      toast.success('تم حذف الخبر');
      loadData();
    } catch (err) {
      toast.error('فشل الحذف');
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await newsService.togglePublish(id);
      toast.success('تم تحديث حالة النشر');
      loadData();
    } catch (err) {
      toast.error('فشل التحديث');
    }
  };

  // Check which languages are filled
  const getLangStatus = (lang: Lang) => {
    const t = translations[lang];
    return t.title.trim() || t.content.trim();
  };

  const columns = [
    {
      key: 'title',
      label: 'العنوان',
      render: (item: NewsItem) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-800 truncate">{item.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{item.slug}</p>
          {(item as any).translations && (
            <div className="flex gap-1 mt-1">
              {LANGS.map(l => {
                const t = (item as any).translations?.[l.key];
                const filled = t?.title;
                return (
                  <span key={l.key} className={`text-xs px-1.5 py-0.5 rounded ${filled ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-300'}`}>
                    {l.flag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'author',
      label: 'الكاتب',
      render: (item: NewsItem) => <span className="text-gray-600">{item.author?.name || '-'}</span>,
    },
    {
      key: 'isPublished',
      label: 'الحالة',
      render: (item: NewsItem) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.isPublished ? 'منشور' : 'مسودة'}
        </span>
      ),
    },
    {
      key: 'views',
      label: 'المشاهدات',
      render: (item: NewsItem) => <span className="text-gray-500">{item.views}</span>,
    },
    {
      key: 'createdAt',
      label: 'التاريخ',
      render: (item: NewsItem) => <span className="text-gray-500 text-xs">{new Date(item.createdAt).toLocaleDateString('ar')}</span>,
    },
  ];

  const currentLangConfig = LANGS.find(l => l.key === activeLang)!;
  const currentFields = translations[activeLang];

  return (
    <>
      <AdminDataTable
        title="إدارة الأخبار"
        data={news}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onAdd={openCreate}
        addLabel="خبر جديد"
        pagination={pagination}
        onPageChange={setPage}
        actions={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => handleTogglePublish(item._id)} className="p-1.5 hover:bg-gray-100 rounded-lg" title={item.isPublished ? 'إلغاء النشر' : 'نشر'}>
              {item.isPublished ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-green-600" />}
            </button>
            <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="تعديل">
              <Edit size={16} className="text-blue-600" />
            </button>
            <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="حذف">
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        )}
      />

      {/* Create/Edit Modal */}
      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'تعديل الخبر' : 'إضافة خبر جديد'} size="xl">
        <div className="space-y-5">
          {/* Language Tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl">
            {LANGS.map(lang => (
              <button
                key={lang.key}
                onClick={() => setActiveLang(lang.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${activeLang === lang.key
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
                {getLangStatus(lang.key) ? (
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </button>
            ))}
          </div>

          {/* Language-specific Fields */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-4 bg-gray-50/50">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Languages size={14} />
              <span>{currentLangConfig.flag} {currentLangConfig.label} — الحقول المترجمة</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                العنوان {activeLang === 'ar' && <span className="text-red-500">*</span>}
              </label>
              <input
                value={currentFields.title}
                onChange={(e) => updateLang(activeLang, 'title', e.target.value)}
                dir={currentLangConfig.dir}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                placeholder={activeLang === 'ar' ? 'عنوان الخبر' : activeLang === 'tr' ? 'Haber başlığı' : 'News title'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">المحتوى</label>
              <RichTextEditor
                key={activeLang}
                content={currentFields.content}
                onChange={(html) => updateLang(activeLang, 'content', html)}
                dir={currentLangConfig.dir}
                placeholder={activeLang === 'ar' ? 'اكتب محتوى الخبر...' : activeLang === 'tr' ? 'Haber içeriğini yazın...' : 'Write news content...'}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">التصنيف</label>
                <input
                  value={currentFields.category}
                  onChange={(e) => updateLang(activeLang, 'category', e.target.value)}
                  dir={currentLangConfig.dir}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  placeholder={activeLang === 'ar' ? 'مثال: أخبار عامة' : activeLang === 'tr' ? 'Örn: Genel haberler' : 'e.g. General news'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الوسوم (مفصولة بفاصلة)</label>
                <input
                  value={currentFields.tags}
                  onChange={(e) => updateLang(activeLang, 'tags', e.target.value)}
                  dir={currentLangConfig.dir}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  placeholder={activeLang === 'ar' ? 'وسم1, وسم2' : activeLang === 'tr' ? 'etiket1, etiket2' : 'tag1, tag2'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الملخص</label>
              <textarea
                value={currentFields.summary}
                onChange={(e) => updateLang(activeLang, 'summary', e.target.value)}
                rows={3}
                dir={currentLangConfig.dir}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                placeholder={activeLang === 'ar' ? 'ملخص قصير للخبر...' : activeLang === 'tr' ? 'Kısa özet...' : 'Short summary...'}
              />
            </div>
          </div>

          {/* Shared Fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>📌 حقول مشتركة (لجميع اللغات)</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">صورة الغلاف</label>
              {sharedData.coverImage && (
                <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200">
                  <img src={resolveImage(sharedData.coverImage)} alt="غلاف" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => setSharedData(prev => ({ ...prev, coverImage: '' }))}
                    className="absolute top-2 left-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={sharedData.coverImage}
                  onChange={(e) => setSharedData({ ...sharedData, coverImage: e.target.value })}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  dir="ltr"
                  placeholder="https://... أو ارفع صورة"
                />
                <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  رفع
                </button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={sharedData.isPublished} onChange={(e) => setSharedData({ ...sharedData, isPublished: e.target.checked })} className="w-4 h-4 text-red-600 rounded" />
                <span className="text-sm text-gray-700">نشر فوري</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={sharedData.isFeatured} onChange={(e) => setSharedData({ ...sharedData, isFeatured: e.target.checked })} className="w-4 h-4 text-red-600 rounded" />
                <span className="text-sm text-gray-700">مميز</span>
              </label>
            </div>
          </div>

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
