import React, { useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useUpdateSiteSettings } from '@/hooks/useUpdateSiteSettings';
import { Save, Globe, Phone, Mail, MapPin, Image as ImageIcon } from 'lucide-react';
import { uploadService } from '@/services/uploadService';
import toast from 'react-hot-toast';

const InputField = React.memo(
  ({
    label,
    value,
    field,
    dir = 'rtl',
    icon,
    onChange,
  }: {
    label: string;
    value: string;
    field: string;
    dir?: string;
    icon?: React.ReactNode;
    onChange: (field: string, value: string) => void;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          value={value || ''}
          onChange={e => onChange(field, e.target.value)}
          dir={dir}
          className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 ${icon ? 'pr-10' : ''}`}
        />
      </div>
    </div>
  )
);

export default function AdminSettingsPage() {

    // رفع صورة باستخدام uploadService الجاهز
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // تحقق من صيغة الشعار
      if (field === 'logo' && file.type !== 'image/png') {
        toast.error('يجب رفع صورة الشعار بصيغة PNG فقط');
        return;
      }
      try {
        const result = await uploadService.uploadImage(file, { folder: 'settings', maxWidth: 800, maxHeight: 800, quality: 0.8 });
        setLocalSettings((prev: any) => ({ ...prev, [field]: result.url }));
        toast.success('تم رفع الصورة بنجاح');
      } catch (err: any) {
        toast.error(err?.message || 'فشل رفع الصورة');
      }
    };
  const { settings, loading, error } = useSiteSettings();
  const [localSettings, setLocalSettings] = useState<any>(null);
  const { updateSettings, loading: saving } = useUpdateSiteSettings();

  React.useEffect(() => {
    if (settings) {
      setLocalSettings({
        siteName: settings.siteName?.ar || '', siteNameEn: settings.siteName?.en || '', siteNameTr: settings.siteName?.tr || '',
        siteDescription: settings.siteDescription?.ar || '', siteDescriptionEn: settings.siteDescription?.en || '', siteDescriptionTr: settings.siteDescription?.tr || '',
        logo: settings.logo || '', favicon: settings.favicon || '',
        email: settings.contactInfo?.email || '', phone: settings.contactInfo?.phone || '', whatsapp: settings.socialLinks?.whatsapp || '',
        addressAr: settings.contactInfo?.address?.ar || '', addressEn: settings.contactInfo?.address?.en || '', addressTr: settings.contactInfo?.address?.tr || '',
        facebook: settings.socialLinks?.facebook || '', instagram: settings.socialLinks?.instagram || '',
        twitter: settings.socialLinks?.twitter || '', youtube: settings.socialLinks?.youtube || '',
        linkedin: settings.socialLinks?.linkedin || '', telegram: settings.socialLinks?.telegram || '',
        footerTextAr: settings.footer?.text?.ar || '', footerTextEn: settings.footer?.text?.en || '', footerTextTr: settings.footer?.text?.tr || '',
        googleMapsUrl: settings.contactInfo?.googleMapsUrl || '',
      });
    }
  }, [settings]);

  // دالة تحقق بسيطة للمدخلات الأساسية
  const validateInputs = () => {
    if (!localSettings) return false;
    // تحقق من الحقول الأساسية (يمكنك إضافة المزيد حسب الحاجة)
    if (!localSettings.siteName?.trim()) {
      toast.error('يرجى إدخال اسم الموقع بالعربية');
      return false;
    }
    if (!localSettings.siteNameEn?.trim()) {
      toast.error('يرجى إدخال اسم الموقع بالإنجليزية');
      return false;
    }
    if (!localSettings.siteNameTr?.trim()) {
      toast.error('يرجى إدخال اسم الموقع بالتركية');
      return false;
    }
    if (!localSettings.email?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(localSettings.email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }
    if (!localSettings.phone?.trim()) {
      toast.error('يرجى إدخال رقم الهاتف');
      return false;
    }
    // يمكن إضافة المزيد من التحقق هنا حسب الحاجة
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;
    await updateSettings({
      siteName: { ar: localSettings.siteName, en: localSettings.siteNameEn, tr: localSettings.siteNameTr },
      siteDescription: { ar: localSettings.siteDescription, en: localSettings.siteDescriptionEn, tr: localSettings.siteDescriptionTr },
      logo: localSettings.logo, favicon: localSettings.favicon,
      contactInfo: {
        email: localSettings.email, phone: localSettings.phone,
        address: { ar: localSettings.addressAr, en: localSettings.addressEn, tr: localSettings.addressTr },
        googleMapsUrl: localSettings.googleMapsUrl,
      },
      socialLinks: {
        facebook: localSettings.facebook, instagram: localSettings.instagram,
        twitter: localSettings.twitter, youtube: localSettings.youtube,
        linkedin: localSettings.linkedin, telegram: localSettings.telegram,
        whatsapp: localSettings.whatsapp,
      },
      footer: { text: { ar: localSettings.footerTextAr, en: localSettings.footerTextEn, tr: localSettings.footerTextTr } },
    });
    toast.success('تم حفظ الإعدادات');
  };

  const handleChange = (field: string, value: string) => {
    setLocalSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading || !localSettings) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" /></div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;

  return (
    <div className="space-y-8 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إعدادات الموقع</h1>
          <p className="text-sm text-gray-500 mt-1">الإعدادات العامة للموقع</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
          <Save size={16} />{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {/* Site Identity */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Globe size={18} className="text-red-500" />هوية الموقع</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="اسم الموقع (عربي)" value={localSettings.siteName} field="siteName" onChange={handleChange} />
          <InputField label="اسم الموقع (إنجليزي)" value={localSettings.siteNameEn} field="siteNameEn" dir="ltr" onChange={handleChange} />
          <InputField label="اسم الموقع (تركي)" value={localSettings.siteNameTr} field="siteNameTr" dir="ltr" onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="الوصف (عربي)" value={localSettings.siteDescription} field="siteDescription" onChange={handleChange} />
          <InputField label="الوصف (إنجليزي)" value={localSettings.siteDescriptionEn} field="siteDescriptionEn" dir="ltr" onChange={handleChange} />
          <InputField label="الوصف (تركي)" value={localSettings.siteDescriptionTr} field="siteDescriptionTr" dir="ltr" onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* شعار الموقع */}
          <div className="flex items-center gap-2">
            {localSettings.logo && (
              <img
                src={
                  localSettings.logo.startsWith('http')
                    ? localSettings.logo
                    : `http://localhost:5000${localSettings.logo}`
                }
                alt="الشعار"
                className="h-12 w-12 object-cover rounded"
                style={{ background: 'transparent' }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            )}
            <label className="flex flex-col items-center cursor-pointer text-xs text-gray-600">
              <span className="flex items-center gap-1"><ImageIcon size={16} /> رفع صورة</span>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'logo')} className="hidden" />
            </label>
            <input
              value={localSettings.logo || ''}
              onChange={e => handleChange('logo', e.target.value)}
              dir="ltr"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
              placeholder="رابط الشعار أو بعد الرفع"
            />
          </div>
          {/* أيقونة الموقع */}
          <div className="flex items-center gap-2">
            {localSettings.favicon && (
              <img
                src={
                  localSettings.favicon.startsWith('http')
                    ? localSettings.favicon
                    : `http://localhost:5000${localSettings.favicon}`
                }
                alt="الأيقونة"
                className="h-12 w-12 object-cover rounded"
                style={{ background: 'transparent' }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            )}
            <label className="flex flex-col items-center cursor-pointer text-xs text-gray-600">
              <span className="flex items-center gap-1"><ImageIcon size={16} /> رفع صورة</span>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'favicon')} className="hidden" />
            </label>
            <input
              value={localSettings.favicon || ''}
              onChange={e => handleChange('favicon', e.target.value)}
              dir="ltr"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
              placeholder="رابط الأيقونة أو بعد الرفع"
            />
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Phone size={18} className="text-red-500" />معلومات التواصل</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="البريد الإلكتروني" value={localSettings.email} field="email" dir="ltr" icon={<Mail size={15} />} onChange={handleChange} />
          <InputField label="رقم الهاتف" value={localSettings.phone} field="phone" dir="ltr" icon={<Phone size={15} />} onChange={handleChange} />
          <InputField label="واتساب" value={localSettings.whatsapp} field="whatsapp" dir="ltr" onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="العنوان (عربي)" value={localSettings.addressAr} field="addressAr" icon={<MapPin size={15} />} onChange={handleChange} />
          <InputField label="العنوان (إنجليزي)" value={localSettings.addressEn} field="addressEn" dir="ltr" onChange={handleChange} />
          <InputField label="العنوان (تركي)" value={localSettings.addressTr} field="addressTr" dir="ltr" onChange={handleChange} />
        </div>
        <InputField label="رابط خرائط جوجل" value={localSettings.googleMapsUrl} field="googleMapsUrl" dir="ltr" onChange={handleChange} />
      </section>

      {/* Social Media */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">🔗 وسائل التواصل الاجتماعي</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Facebook" value={localSettings.facebook} field="facebook" dir="ltr" onChange={handleChange} />
          <InputField label="Instagram" value={localSettings.instagram} field="instagram" dir="ltr" onChange={handleChange} />
          <InputField label="Twitter / X" value={localSettings.twitter} field="twitter" dir="ltr" onChange={handleChange} />
          <InputField label="YouTube" value={localSettings.youtube} field="youtube" dir="ltr" onChange={handleChange} />
          <InputField label="LinkedIn" value={localSettings.linkedin} field="linkedin" dir="ltr" onChange={handleChange} />
          <InputField label="Telegram" value={localSettings.telegram} field="telegram" dir="ltr" onChange={handleChange} />
        </div>
      </section>

      {/* Footer */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">📝 نص الفوتر</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="النص (عربي)" value={localSettings.footerTextAr} field="footerTextAr" onChange={handleChange} />
          <InputField label="النص (إنجليزي)" value={localSettings.footerTextEn} field="footerTextEn" dir="ltr" onChange={handleChange} />
          <InputField label="النص (تركي)" value={localSettings.footerTextTr} field="footerTextTr" dir="ltr" onChange={handleChange} />
        </div>
      </section>

      {/* Bottom Save */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
          <Save size={16} />{saving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
        </button>
      </div>
    </div>
  );
}
