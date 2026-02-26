import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formsService, type FormItem } from '@/services/formsService';
import { uploadService } from '@/services/uploadService';
import SimplePageHero from '@/components/ui/Sections/SimplePageHero';
import FadeIn from '@/components/animations/FadeIn';
import { toast } from 'react-hot-toast';
import { Loader2, Send, Upload, CheckCircle } from 'lucide-react';
import FormInput from '@/components/ui/Forms/FormInput';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/Titles/SectionTitle';

export default function PublicFormPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en' | 'tr';
  const [form, setForm] = useState<FormItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        const data = await formsService.getBySlug(slug!);
        setForm(data);
      } catch {
        // Handle error (redirect to 404)
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadForm();
  }, [slug]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileUpload = async (name: string, file: File) => {
    try {
      // Show loading indicator for file
      const result = await uploadService.uploadImage(file);
      handleInputChange(name, result.url);
    } catch {
      toast.error('Failed to upload file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validate
    const newErrors: Record<string, string> = {};
    form.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(lang === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields');
      return;
    }

    try {
      setSubmitting(true);
      await formsService.submit(form._id, formData);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;
  if (!form) return <div className="text-center py-20">Form not found</div>;

  if (success) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className=" p-8  text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Submitted Successfully!'}
          </h2>
          <p className="text-gray-500 mb-8">
            {lang === 'ar' ? 'شكراً لك، تم استلام بياناتك وسيتم مراجعتها قريباً.' : 'Thank you, your data has been received.'}
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-700 transition">
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screenpb-20" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <SimplePageHero
        title={form.title[lang] || form.title.ar}
        breadcrumbs={[{ label: lang === 'ar' ? 'الرئيسية' : 'Home', href: '/' }, { label: form.title[lang] || form.title.ar }]}
      />
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-4xl rounded-2xl">
          <FadeIn>
            <div className=" p-8 md:p-12">
              {form.description && (form.description[lang] || form.description.ar) && (
                <div className="mb-8 text-gray-600 leading-relaxed border-b border-gray-100 pb-6">
                  {form.description[lang] || form.description.ar}
                </div>
              )}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* عنوان القسم */}
                <div className="md:col-span-2 mb-6 border-b-2 border-red-800 pb-2 items-end text-right">
                  <span className="text-xl font-bold">{lang === 'ar' ? 'بيانات النموذج' : 'Form Data'}</span>
                </div>
                {form.fields.map((field) => (
                  <div key={field.name} className="col-span-1">
                    {/* استخدم FormInput إن أمكن */}
                    {['text','email','number','date','tel','file'].includes(field.type) ? (
                      <FormInput
                        label={field.label[lang] || field.label.ar}
                        type={field.type as any}
                        name={field.name}
                        value={field.type === 'file' ? undefined : (formData[field.name] || '')}
                        onChange={field.type === 'file'
                          ? (e: React.ChangeEvent<HTMLInputElement>) => {
                              if (e.target.files?.[0]) handleFileUpload(field.name, e.target.files[0]);
                            }
                          : (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.name, e.target.value)
                        }
                        required={field.required}
                        className="bg-white"
                        placeholder={field.placeholder?.[lang]}
                        error={errors[field.name]}
                        accept={field.type === 'file' ? undefined : undefined}
                        inputMode={field.type === 'number' ? 'numeric' : undefined}
                      />
                    ) : field.type === 'textarea' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label[lang] || field.label.ar}
                          {field.required && <span className="text-red-500 mx-1">*</span>}
                        </label>
                        <textarea
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${errors[field.name] ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-red-100'} focus:border-red-500 outline-none transition-all resize-none h-32`}
                          placeholder={field.placeholder?.[lang]}
                        />
                        {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                      </div>
                    ) : field.type === 'select' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label[lang] || field.label.ar}
                          {field.required && <span className="text-red-500 mx-1">*</span>}
                        </label>
                        <select
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${errors[field.name] ? 'border-red-500' : 'border-gray-200'} focus:border-red-500 focus:ring-4 focus:ring-red-50 outline-none transition-all bg-white`}
                        >
                          <option value="">{lang === 'ar' ? 'اختر...' : 'Select...'}</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                      </div>
                    ) : null}
                  </div>
                ))}
                <div className="md:col-span-2 flex justify-end mt-6">
                  <Button variant="primary" className="!py-3 !text-lg w-full md:w-auto" icon={submitting ? <Loader2 className="animate-spin" /> : <Send size={20} />} aria-disabled={submitting}>
                    {submitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'إرسال الطلب' : 'Submit Application')}
                  </Button>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
