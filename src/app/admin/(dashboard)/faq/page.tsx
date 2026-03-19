"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { faqService, type FaqItem, type FaqStep } from '@/services/faqService';
import { faqCategoryService, type FaqCategory } from '@/services/faqCategoryService';
import { uploadService } from '@/services/uploadService';
import { resolveImage } from '@/utils/resolveImage';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Edit, Trash2, GripVertical, Plus, X, Upload, FileText, Loader2, Image as ImageIcon, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

type Lang = 'ar' | 'en' | 'tr';

interface FaqFormData {
  question: { ar: string; en: string; tr: string };
  answer: { ar: string; en: string; tr: string };
  category: string;
  order: string;
  // Steps are now a single array of objects
  steps: Array<{
    text: { ar: string; en: string; tr: string };
    fileUrl: string;
  }>;
  documents: Array<{ name: { ar: string; en: string; tr: string }; url: string }>;
}

const initialFormData: FaqFormData = {
  question: { ar: '', en: '', tr: '' },
  answer: { ar: '', en: '', tr: '' },
  category: '',
  order: '0',
  steps: [],
  documents: [],
};

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<FaqCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FaqFormData>(initialFormData);
  const [categoryFormData, setCategoryFormData] = useState<{ name: { ar: string; en: string; tr: string }; slug: string }>({ name: { ar: '', en: '', tr: '' }, slug: '' });
  const [activeLang, setActiveLang] = useState<Lang>('ar');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingStepFile, setUploadingStepFile] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepFileInputRef = useRef<HTMLInputElement>(null);
  const activeStepIndexRef = useRef<number | null>(null);
  const entityFolderRef = useRef<string>('faq');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [faqData, catData] = await Promise.all([
        faqService.getAll({ search }),
        faqCategoryService.getAll()
      ]);
      const faqsList: FaqItem[] = Array.isArray(faqData)
        ? faqData
        : Array.isArray(faqData?.data)
        ? faqData.data
        : [];
      setItems(faqsList);
      setCategories(Array.isArray(catData?.data) ? catData.data : []);
    } catch {
      toast.error('فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      ...initialFormData,
      order: String(items.length + 1) // Auto-increment order
    });
    entityFolderRef.current = `faq/new-${Date.now()}`;
    setModalOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditingItem(item);

    // Map existing steps to new structure
    // If old structure (steps: {ar: [], ...}) exists, we try to migrate it visually
    // or if new structure (steps: [{text: {...}, fileUrl}]) exists, use it.

    let mappedSteps: FaqFormData['steps'] = [];

    if (Array.isArray(item.steps)) {
      // New structure
      mappedSteps = item.steps.map(s => ({
        text: { ar: s.text?.ar || '', en: s.text?.en || '', tr: s.text?.tr || '' },
        fileUrl: s.fileUrl || ''
      }));
    } else if (item.steps && typeof item.steps === 'object' && !Array.isArray(item.steps)) {
       // Old structure fallback (try to zip arrays)
       const oldSteps = item.steps as any; // { ar: string[], en: string[], tr: string[] }
       const maxLen = Math.max(
         oldSteps.ar?.length || 0,
         oldSteps.en?.length || 0,
         oldSteps.tr?.length || 0
       );

       for(let i=0; i<maxLen; i++) {
         mappedSteps.push({
           text: {
             ar: oldSteps.ar?.[i] || '',
             en: oldSteps.en?.[i] || '',
             tr: oldSteps.tr?.[i] || ''
           },
           fileUrl: ''
         });
       }
    }

    setFormData({
      question: { ar: item.question?.ar || '', en: item.question?.en || '', tr: item.question?.tr || '' },
      answer: { ar: item.answer?.ar || '', en: item.answer?.en || '', tr: item.answer?.tr || '' },
      category: item.category || '',
      order: String(item.order ?? 0),
      steps: mappedSteps,
      documents: item.documents?.map(doc => ({
        name: { ar: doc.name?.ar || '', en: doc.name?.en || '', tr: doc.name?.tr || '' },
        url: doc.url || ''
      })) || []
    });
    entityFolderRef.current = `faq/${item._id}`;
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: any = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        order: Number(formData.order),
        steps: formData.steps,
        documents: formData.documents
      };

      if (editingItem) {
        await faqService.update(editingItem._id, payload);
        toast.success('تم التحديث');
      } else {
        await faqService.create(payload);
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
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      await faqService.delete(id);
      toast.success('تم الحذف');
      loadData();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  // Steps Management
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { text: { ar: '', en: '', tr: '' }, fileUrl: '' }]
    }));
  };

  const updateStepText = (index: number, lang: Lang, value: string) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = {
        ...newSteps[index],
        text: { ...newSteps[index].text, [lang]: value }
      };
      return { ...prev, steps: newSteps };
    });
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const triggerStepFileUpload = (index: number) => {
    activeStepIndexRef.current = index;
    stepFileInputRef.current?.click();
  };

  const handleStepFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = activeStepIndexRef.current;

    if (!file || index === null) return;

    try {
      setUploadingStepFile(index);
      // Determine if image or file. Using uploadImage for simplicity if mostly images
      const res = await uploadService.uploadImage(file, { folder: entityFolderRef.current });

      setFormData(prev => {
        const newSteps = [...prev.steps];
        newSteps[index] = { ...newSteps[index], fileUrl: res.url };
        return { ...prev, steps: newSteps };
      });
      toast.success('تم رفع الملف للخطوة');
    } catch {
      toast.error('فشل رفع الملف');
    } finally {
      setUploadingStepFile(null);
      activeStepIndexRef.current = null;
      if (stepFileInputRef.current) stepFileInputRef.current.value = '';
    }
  };

  const removeStepFile = (index: number) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], fileUrl: '' };
      return { ...prev, steps: newSteps };
    });
  };

  // Documents Management
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDoc(true);
      const res = await uploadService.uploadImage(file, { folder: entityFolderRef.current });

      const newDoc = {
        name: { ar: file.name, en: file.name, tr: file.name },
        url: res.url
      };

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDoc]
      }));
      toast.success('تم رفع الملف');
    } catch {
      toast.error('فشل رفع الملف');
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updateDocName = (index: number, lang: Lang, value: string) => {
    setFormData(prev => {
      const newDocs = [...prev.documents];
      newDocs[index] = {
        ...newDocs[index],
        name: { ...newDocs[index].name, [lang]: value }
      };
      return { ...prev, documents: newDocs };
    });
  };

  const removeDoc = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Category Management
  const openCategoryModal = (category?: FaqCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        name: { ar: category.name.ar || '', en: category.name.en || '', tr: category.name.tr || '' },
        slug: category.slug || ''
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({ name: { ar: '', en: '', tr: '' }, slug: '' });
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      setSaving(true);
      if (editingCategory) {
        await faqCategoryService.update(editingCategory._id, categoryFormData);
        toast.success('تم تحديث التصنيف');
      } else {
        await faqCategoryService.create(categoryFormData);
        toast.success('تم إنشاء التصنيف');
      }
      setCategoryModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشلت العملية');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;
    try {
      await faqCategoryService.delete(id);
      toast.success('تم حذف التصنيف');
      loadData();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const getCategoryName = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? (cat.name.ar || cat.name.en || slug) : slug;
  };

  const columns = [
    { key: 'order', label: '#', render: (item: FaqItem) => <span className="flex items-center gap-1 text-gray-400"><GripVertical size={14} />{item.order}</span> },
    { key: 'question', label: 'السؤال', render: (item: FaqItem) => <p className="font-medium text-gray-800 truncate max-w-sm">{item.question.ar || item.question.en}</p> },
    { key: 'category', label: 'التصنيف', render: (item: FaqItem) => <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{getCategoryName(item.category) || '-'}</span> },
  ];

  return (
    <>
      <AdminDataTable
        title=""
        data={items}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={(v) => setSearch(v)}
        onAdd={openCreate}
        addLabel="سؤال جديد"
        actions={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-blue-600" /></button>
            <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
          </div>
        )}
      />

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'تعديل السؤال' : 'إضافة سؤال'}
        size="xl"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
          {/* Top Fields: Category & Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">التصنيف</label>
                <button
                  type="button"
                  onClick={() => openCategoryModal()}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Settings size={12} /> إدارة التصنيفات
                </button>
              </div>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="">اختر التصنيف</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name.ar || cat.name.en} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الترتيب</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Language Tabs */}
          <div className="sticky top-0 z-10 bg-white -mx-6 px-6 pb-2">
          <div className="flex gap-2 border-b border-gray-100 pb-2">
            {(['ar', 'en', 'tr'] as Lang[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeLang === lang
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'Türkçe'}
              </button>
            ))}
          </div>
          </div>

          {/* Question & Answer */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                السؤال ({activeLang.toUpperCase()})
              </label>
              <textarea
                value={formData.question[activeLang]}
                onChange={(e) => setFormData({
                  ...formData,
                  question: { ...formData.question, [activeLang]: e.target.value }
                })}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                الإجابة ({activeLang.toUpperCase()})
              </label>
              <RichTextEditor
                key={activeLang}
                content={formData.answer[activeLang]}
                onChange={(html) => setFormData({ ...formData, answer: { ...formData.answer, [activeLang]: html } })}
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                placeholder={activeLang === 'ar' ? 'اكتب الإجابة...' : activeLang === 'tr' ? 'Cevabı yazın...' : 'Write the answer...'}
              />
            </div>
          </div>

          {/* Steps Section - Now Independent of Language Tab for Structure, but Text is Multilingual */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                الخطوات / Steps (لكل خطوة ملف اختياري)
              </label>
              <button
                onClick={addStep}
                className="text-xs flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded"
              >
                <Plus size={14} /> إضافة خطوة
              </button>
            </div>

            {/* Hidden Input for Step File Upload */}
            <input
              type="file"
              ref={stepFileInputRef}
              className="hidden"
              onChange={handleStepFileUpload}
            />

            <div className="space-y-4">
              {formData.steps.map((step, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative group">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                       {/* Text Input for Active Language */}
                       <div className="flex items-center gap-2">
                         <span className="text-xs font-bold w-6 text-gray-500">{idx + 1}.</span>
                         <input
                           value={step.text[activeLang]}
                           onChange={(e) => updateStepText(idx, activeLang, e.target.value)}
                           className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500 bg-white"
                           placeholder={`Step Text (${activeLang.toUpperCase()})`}
                           dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                         />
                       </div>

                       {/* File Attachment for this Step */}
                       <div className="flex items-center gap-2 pl-8">
                         {step.fileUrl ? (
                           <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200 text-xs text-blue-600">
                             <ImageIcon size={14} />
                             <button onClick={() => setPreviewUrl(resolveImage(step.fileUrl))} className="max-w-37.5 truncate hover:underline text-blue-600">
                               {step.fileUrl.split('/').pop()}
                             </button>
                             <button onClick={() => removeStepFile(idx)} className="text-red-500 hover:bg-red-50 rounded p-0.5"><X size={12}/></button>
                           </div>
                         ) : (
                           <button
                             onClick={() => triggerStepFileUpload(idx)}
                             disabled={uploadingStepFile === idx}
                             className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50"
                           >
                             {uploadingStepFile === idx ? <Loader2 size={12} className="animate-spin"/> : <Upload size={12} />}
                             إرفاق ملف/صورة
                           </button>
                         )}
                       </div>
                    </div>

                    <button
                      onClick={() => removeStep(idx)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="حذف الخطوة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.steps.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-2">لا توجد خطوات مضافة.</p>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">المستندات العامة (أسفل السؤال)</label>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleDocUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingDoc}
                  className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors"
                >
                  {uploadingDoc ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  رفع مستند
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {formData.documents.map((doc, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={16} />
                      <button onClick={() => setPreviewUrl(resolveImage(doc.url))} className="hover:underline text-blue-600 truncate max-w-50">
                        {doc.url.split('/').pop()}
                      </button>
                    </div>
                    <button
                      onClick={() => removeDoc(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Localized Names for Document */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    {(['ar', 'en', 'tr'] as Lang[]).map(lang => (
                      <input
                        key={lang}
                        value={doc.name[lang]}
                        onChange={(e) => updateDocName(idx, lang, e.target.value)}
                        placeholder={`Name (${lang})`}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded bg-white outline-none focus:border-red-500"
                      />
                    ))}
                  </div>
                </div>
              ))}
              {formData.documents.length === 0 && (
                <p className="text-xs text-gray-400 italic">لا توجد مستندات مرفقة.</p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editingItem ? 'تحديث' : 'إنشاء'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70" onClick={() => setPreviewUrl(null)}>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden m-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{previewUrl.split('/').pop()}</span>
              <button onClick={() => setPreviewUrl(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="overflow-auto max-h-[75vh] flex items-center justify-center bg-gray-50 p-4">
              {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(previewUrl) ? (
                <img src={previewUrl} alt="preview" className="max-w-full max-h-[65vh] object-contain rounded" />
              ) : (
                <iframe src={previewUrl} className="w-full h-[65vh] rounded border" title="preview" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      <AdminModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
        size="md"
      >
        <div className="space-y-4">
          {/* Categories List */}
          {!editingCategory && categories.length > 0 && (
            <div className="mb-4 border-b border-gray-100 pb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">التصنيفات الحالية</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm">{cat.name.ar || cat.name.en} <span className="text-gray-400">({cat.slug})</span></span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openCategoryModal(cat)} className="p-1 hover:bg-gray-200 rounded"><Edit size={14} className="text-blue-600" /></button>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-500" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">المعرف (Slug)</label>
            <input
              type="text"
              value={categoryFormData.slug}
              onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
              placeholder="مثال: general, academic, living"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربية</label>
              <input
                type="text"
                value={categoryFormData.name.ar}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: { ...categoryFormData.name, ar: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                placeholder="أسئلة عامة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالإنجليزية</label>
              <input
                type="text"
                value={categoryFormData.name.en}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: { ...categoryFormData.name, en: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                placeholder="General Questions"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالتركية</label>
              <input
                type="text"
                value={categoryFormData.name.tr}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: { ...categoryFormData.name, tr: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Genel Sorular"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              onClick={handleSaveCategory}
              disabled={saving || !categoryFormData.slug || !categoryFormData.name.ar}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editingCategory ? 'تحديث' : 'إنشاء'}
            </button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
