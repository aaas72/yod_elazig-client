import React, { useEffect, useState, useCallback } from 'react';
import { settingsService } from '@/services/settingsService';
import { Save, Globe, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: '', siteNameEn: '', siteNameTr: '',
    siteDescription: '', siteDescriptionEn: '', siteDescriptionTr: '',
    logo: '', favicon: '',
    email: '', phone: '', whatsapp: '',
    addressAr: '', addressEn: '', addressTr: '',
    facebook: '', instagram: '', twitter: '', youtube: '', linkedin: '', telegram: '',
    footerTextAr: '', footerTextEn: '', footerTextTr: '',
    googleMapsUrl: '',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.get();
      if (data) {
        setSettings({
          siteName: data.siteName?.ar || '', siteNameEn: data.siteName?.en || '', siteNameTr: data.siteName?.tr || '',
          siteDescription: data.siteDescription?.ar || '', siteDescriptionEn: data.siteDescription?.en || '', siteDescriptionTr: data.siteDescription?.tr || '',
          logo: data.logo || '', favicon: data.favicon || '',
          email: data.contact?.email || '', phone: data.contact?.phone || '', whatsapp: data.contact?.whatsapp || '',
          addressAr: data.contact?.address?.ar || '', addressEn: data.contact?.address?.en || '', addressTr: data.contact?.address?.tr || '',
          facebook: data.socialLinks?.facebook || '', instagram: data.socialLinks?.instagram || '',
          twitter: data.socialLinks?.twitter || '', youtube: data.socialLinks?.youtube || '',
          linkedin: data.socialLinks?.linkedin || '', telegram: data.socialLinks?.telegram || '',
          footerTextAr: data.footer?.text?.ar || '', footerTextEn: data.footer?.text?.en || '', footerTextTr: data.footer?.text?.tr || '',
          googleMapsUrl: data.contact?.googleMapsUrl || '',
        });
      }
    } catch { toast.error('فشل تحميل الإعدادات'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsService.update({
        siteName: { ar: settings.siteName, en: settings.siteNameEn, tr: settings.siteNameTr },
        siteDescription: { ar: settings.siteDescription, en: settings.siteDescriptionEn, tr: settings.siteDescriptionTr },
        logo: settings.logo, favicon: settings.favicon,
        contact: {
          email: settings.email, phone: settings.phone, whatsapp: settings.whatsapp,
          address: { ar: settings.addressAr, en: settings.addressEn, tr: settings.addressTr },
          googleMapsUrl: settings.googleMapsUrl,
        },
        socialLinks: {
          facebook: settings.facebook, instagram: settings.instagram,
          twitter: settings.twitter, youtube: settings.youtube,
          linkedin: settings.linkedin, telegram: settings.telegram,
        },
        footer: { text: { ar: settings.footerTextAr, en: settings.footerTextEn, tr: settings.footerTextTr } },
      });
      toast.success('تم حفظ الإعدادات');
    } catch (err: any) { toast.error(err.response?.data?.message || 'فشل الحفظ'); } finally { setSaving(false); }
  };

  const InputField = ({ label, value, field, dir = 'rtl', icon }: { label: string; value: string; field: string; dir?: string; icon?: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input value={value} onChange={(e) => setSettings({ ...settings, [field]: e.target.value })} dir={dir} className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 ${icon ? 'pr-10' : ''}`} />
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
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
          <InputField label="اسم الموقع (عربي)" value={settings.siteName} field="siteName" />
          <InputField label="اسم الموقع (إنجليزي)" value={settings.siteNameEn} field="siteNameEn" dir="ltr" />
          <InputField label="اسم الموقع (تركي)" value={settings.siteNameTr} field="siteNameTr" dir="ltr" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="الوصف (عربي)" value={settings.siteDescription} field="siteDescription" />
          <InputField label="الوصف (إنجليزي)" value={settings.siteDescriptionEn} field="siteDescriptionEn" dir="ltr" />
          <InputField label="الوصف (تركي)" value={settings.siteDescriptionTr} field="siteDescriptionTr" dir="ltr" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="رابط الشعار" value={settings.logo} field="logo" dir="ltr" />
          <InputField label="رابط الأيقونة" value={settings.favicon} field="favicon" dir="ltr" />
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Phone size={18} className="text-red-500" />معلومات التواصل</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="البريد الإلكتروني" value={settings.email} field="email" dir="ltr" icon={<Mail size={15} />} />
          <InputField label="رقم الهاتف" value={settings.phone} field="phone" dir="ltr" icon={<Phone size={15} />} />
          <InputField label="واتساب" value={settings.whatsapp} field="whatsapp" dir="ltr" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="العنوان (عربي)" value={settings.addressAr} field="addressAr" icon={<MapPin size={15} />} />
          <InputField label="العنوان (إنجليزي)" value={settings.addressEn} field="addressEn" dir="ltr" />
          <InputField label="العنوان (تركي)" value={settings.addressTr} field="addressTr" dir="ltr" />
        </div>
        <InputField label="رابط خرائط جوجل" value={settings.googleMapsUrl} field="googleMapsUrl" dir="ltr" />
      </section>

      {/* Social Media */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">🔗 وسائل التواصل الاجتماعي</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Facebook" value={settings.facebook} field="facebook" dir="ltr" />
          <InputField label="Instagram" value={settings.instagram} field="instagram" dir="ltr" />
          <InputField label="Twitter / X" value={settings.twitter} field="twitter" dir="ltr" />
          <InputField label="YouTube" value={settings.youtube} field="youtube" dir="ltr" />
          <InputField label="LinkedIn" value={settings.linkedin} field="linkedin" dir="ltr" />
          <InputField label="Telegram" value={settings.telegram} field="telegram" dir="ltr" />
        </div>
      </section>

      {/* Footer */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">📝 نص الفوتر</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="النص (عربي)" value={settings.footerTextAr} field="footerTextAr" />
          <InputField label="النص (إنجليزي)" value={settings.footerTextEn} field="footerTextEn" dir="ltr" />
          <InputField label="النص (تركي)" value={settings.footerTextTr} field="footerTextTr" dir="ltr" />
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
