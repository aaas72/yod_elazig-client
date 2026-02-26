import React, { useEffect, useState } from 'react';
import { formsService, type FormItem, type FormField } from '@/services/formsService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Trash2, Eye, Plus, X, GripVertical, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Lang = 'ar' | 'en' | 'tr';
const LANGS: Lang[] = ['ar', 'en', 'tr'];

const initialField: FormField = {
  name: '',
  label: { ar: '', en: '', tr: '' },
  type: 'text',
  required: false,
  options: [],
  placeholder: { ar: '', en: '', tr: '' }
};

const initialForm: Partial<FormItem> = {
  title: { ar: '', en: '', tr: '' },
  description: { ar: '', en: '', tr: '' },
  slug: '',
  fields: [],
  isActive: true,
};

export default function AdminFormsPage() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FormItem | null>(null);
  const [formData, setFormData] = useState<Partial<FormItem>>(initialForm);
  const [activeLang, setActiveLang] = useState<Lang>('ar');
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await formsService.getAll();
      setForms(data);
    } catch {
      toast.error('فشل تحميل النماذج');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title?.ar) return toast.error('العنوان بالعربية مطلوب');
      
      // Auto-generate slug if empty
      if (!formData.slug) {
        formData.slug = formData.title.en ? 
          formData.title.en.toLowerCase().replace(/ /g, '-') : 
          `form-${Date.now()}`;
      }

      if (editingItem) {
        await formsService.update(editingItem._id, formData);
        toast.success('تم التحديث');
      } else {
        await formsService.create(formData);
        toast.success('تم الإنشاء');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشلت العملية');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      await formsService.delete(id);
      toast.success('تم الحذف');
      loadData();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  // Field Management
  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...(prev.fields || []), { ...initialField, name: `field_${Date.now()}` }]
    }));
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFormData(prev => {
      const newFields = [...(prev.fields || [])];
      newFields[index] = { ...newFields[index], ...updates };
      return { ...prev, fields: newFields };
    });
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields?.filter((_, i) => i !== index)
    }));
  };

  const columns = [
    { key: 'title', label: 'العنوان', render: (item: FormItem) => <span className="font-medium">{item.title.ar}</span> },
    { key: 'slug', label: 'الرابط', render: (item: FormItem) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.slug}</code> },
    { key: 'fields', label: 'الحقول', render: (item: FormItem) => <span className="text-sm text-gray-500">{item.fields.length} حقل</span> },
    { key: 'isActive', label: 'الحالة', render: (item: FormItem) => <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{item.isActive ? 'نشط' : 'غير نشط'}</span> },
  ];

  return (
    <>
      <AdminDataTable
        title="إدارة نماذج التسجيل"
        data={forms}
        columns={columns}
        loading={loading}
        onAdd={() => { setEditingItem(null); setFormData(initialForm); setModalOpen(true); }}
        addLabel="نموذج جديد"
        actions={(item) => (
          <div className="flex gap-1">
            <button onClick={() => window.open(`/forms/${item.slug}`, '_blank')} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="معاينة"><Eye size={16} /></button>
            <button onClick={() => navigate(`/admin/forms/${item._id}/submissions`)} className="p-1.5 hover:bg-gray-100 rounded text-blue-600" title="الاستجابات"><FileText size={16} /></button>
            <button onClick={() => { setEditingItem(item); setFormData(item); setModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded text-green-600"><Edit size={16} /></button>
            <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-gray-100 rounded text-red-500"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'تعديل النموذج' : 'نموذج جديد'}
        size="xl"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto p-1">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">معرف الرابط (Slug)</label>
              <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="example-form" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm font-medium">نشط</span>
              </label>
            </div>
          </div>

          {/* Lang Tabs */}
          <div className="flex gap-2 border-b">
            {LANGS.map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-4 py-2 text-sm font-medium ${activeLang === lang ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان النموذج ({activeLang})</label>
              <input
                value={formData.title?.[activeLang]}
                onChange={e => setFormData({ ...formData, title: { ...formData.title!, [activeLang]: e.target.value } })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف ({activeLang})</label>
              <textarea
                value={formData.description?.[activeLang]}
                onChange={e => setFormData({ ...formData, description: { ...formData.description!, [activeLang]: e.target.value } })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
              />
            </div>
          </div>

          {/* Form Builder */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">بناء النموذج (Fields)</h3>
              <button onClick={addField} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1">
                <Plus size={14} /> إضافة حقل
              </button>
            </div>

            <div className="space-y-3">
              {formData.fields?.map((field, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border relative group">
                  <button onClick={() => removeField(idx)} className="absolute top-2 left-2 text-gray-400 hover:text-red-500"><X size={16} /></button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <label className="text-xs text-gray-500 block mb-1">الاسم البرمجي (Unique)</label>
                      <input
                        value={field.name}
                        onChange={e => updateField(idx, { name: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                        placeholder="email_field"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs text-gray-500 block mb-1">النوع</label>
                      <select
                        value={field.type}
                        onChange={e => updateField(idx, { type: e.target.value as any })}
                        className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                      >
                        <option value="text">نص قصير</option>
                        <option value="textarea">نص طويل</option>
                        <option value="email">بريد إلكتروني</option>
                        <option value="number">رقم</option>
                        <option value="date">تاريخ</option>
                        <option value="select">قائمة منسدلة</option>
                        <option value="file">ملف</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">التسمية ({activeLang})</label>
                      <input
                        value={field.label[activeLang]}
                        onChange={e => updateField(idx, { label: { ...field.label, [activeLang]: e.target.value } })}
                        className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                      />
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div className="mt-2">
                      <label className="text-xs text-gray-500 block mb-1">الخيارات (مفصولة بفاصلة)</label>
                      <input
                        value={field.options?.join(', ')}
                        onChange={e => updateField(idx, { options: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full px-2 py-1.5 text-sm border rounded bg-white"
                        placeholder="Option 1, Option 2"
                      />
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => updateField(idx, { required: e.target.checked })}
                        className="w-3.5 h-3.5 rounded text-red-600"
                      />
                      <span className="text-xs">مطلوب (Required)</span>
                    </label>
                  </div>
                </div>
              ))}
              {formData.fields?.length === 0 && <p className="text-center text-gray-400 text-sm py-4">لا توجد حقول. أضف حقل جديد.</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button>
            <button onClick={handleSave} className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700">حفظ</button>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
