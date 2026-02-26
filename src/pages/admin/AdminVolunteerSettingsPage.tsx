import React, { useEffect, useState } from 'react';
import { settingsService } from '@/services/settingsService';
import { Save, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVolunteerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formLink, setFormLink] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await settingsService.get();
        setFormLink(data?.volunteerFormLink || '');
      } catch {
        toast.error('فشل تحميل الرابط');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.update({ volunteerFormLink: formLink });
      toast.success('تم حفظ الرابط بنجاح');
    } catch {
      toast.error('فشل حفظ الرابط');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Link2 size={24} /> رابط نموذج التطوع
      </h2>
      <input
        type="url"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        placeholder="https://..."
        value={formLink}
        onChange={e => setFormLink(e.target.value)}
        disabled={loading || saving}
      />
      <button
        className="bg-red-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-60"
        onClick={handleSave}
        disabled={loading || saving}
      >
        <Save size={18} /> {saving ? 'جارٍ الحفظ...' : 'حفظ'}
      </button>
    </div>
  );
}
