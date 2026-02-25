import React, { useEffect, useState, useCallback } from 'react';
import { volunteerService } from '@/services/volunteerService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Eye, Trash2, CheckCircle, XCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface VolunteerItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  university?: string;
  department?: string;
  yearOfStudy?: number;
  skills?: string[];
  motivation: string;
  availableHours?: number;
  status: 'pending' | 'accepted' | 'rejected';
  reviewNote?: string;
  createdAt: string;
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [viewItem, setViewItem] = useState<VolunteerItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await volunteerService.getAll({ page, limit: 10, status: statusFilter || undefined }); setVolunteers(data?.volunteers || []); setPagination(data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 }); } catch { toast.error('فشل التحميل'); } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleReview = async (id: string, status: 'accepted' | 'rejected') => {
    try { await volunteerService.review(id, status, reviewNote); toast.success(status === 'accepted' ? 'تم القبول' : 'تم الرفض'); setViewItem(null); loadData(); } catch { toast.error('فشل التحديث'); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; try { await volunteerService.delete(id); toast.success('تم الحذف'); loadData(); } catch { toast.error('فشل الحذف'); } };

  const handleExport = async () => { try { const data = await volunteerService.exportAll(); const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'volunteers.json'; a.click(); toast.success('تم التصدير'); } catch { toast.error('فشل التصدير'); } };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { pending: 'bg-yellow-50 text-yellow-700', accepted: 'bg-green-50 text-green-700', rejected: 'bg-red-50 text-red-700' };
    const labels: Record<string, string> = { pending: 'معلق', accepted: 'مقبول', rejected: 'مرفوض' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status]}`}>{labels[status]}</span>;
  };

  const columns = [
    { key: 'name', label: 'الاسم', render: (item: VolunteerItem) => <p className="font-medium text-gray-800">{item.name}</p> },
    { key: 'email', label: 'البريد', render: (item: VolunteerItem) => <span className="text-sm text-gray-500" dir="ltr">{item.email}</span> },
    { key: 'university', label: 'الجامعة', render: (item: VolunteerItem) => <span className="text-sm text-gray-500">{item.university || '-'}</span> },
    { key: 'status', label: 'الحالة', render: (item: VolunteerItem) => statusBadge(item.status) },
    { key: 'createdAt', label: 'التاريخ', render: (item: VolunteerItem) => <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('ar')}</span> },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {[{ label: 'الكل', value: '' }, { label: 'معلق', value: 'pending' }, { label: 'مقبول', value: 'accepted' }, { label: 'مرفوض', value: 'rejected' }].map(s => (
            <button key={s.value} onClick={() => { setStatusFilter(s.value); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-sm ${statusFilter === s.value ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>{s.label}</button>
          ))}
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"><Download size={14} />تصدير</button>
      </div>

      <AdminDataTable title="طلبات التطوع" data={volunteers} columns={columns} loading={loading} pagination={pagination} onPageChange={setPage} actions={(item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setViewItem(item); setReviewNote(''); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-blue-600" /></button>
          <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
        </div>
      )} />

      <AdminModal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="تفاصيل طلب التطوع" size="lg">
        {viewItem && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-xs text-gray-400">الاسم</span><p className="font-medium">{viewItem.name}</p></div>
              <div><span className="text-xs text-gray-400">البريد</span><p className="font-medium" dir="ltr">{viewItem.email}</p></div>
              <div><span className="text-xs text-gray-400">الهاتف</span><p className="font-medium" dir="ltr">{viewItem.phone}</p></div>
              <div><span className="text-xs text-gray-400">الجامعة</span><p className="font-medium">{viewItem.university || '-'}</p></div>
              <div><span className="text-xs text-gray-400">القسم</span><p className="font-medium">{viewItem.department || '-'}</p></div>
              <div><span className="text-xs text-gray-400">السنة الدراسية</span><p className="font-medium">{viewItem.yearOfStudy || '-'}</p></div>
            </div>
            {viewItem.skills && viewItem.skills.length > 0 && (
              <div><span className="text-xs text-gray-400 block mb-2">المهارات</span><div className="flex flex-wrap gap-2">{viewItem.skills.map((s, i) => <span key={i} className="px-2 py-1 bg-gray-100 rounded-lg text-xs">{s}</span>)}</div></div>
            )}
            <div className="bg-gray-50 p-4 rounded-xl"><span className="text-xs text-gray-400 block mb-2">الدافع</span><p className="text-gray-700 whitespace-pre-wrap">{viewItem.motivation}</p></div>
            {viewItem.status === 'pending' && (
              <div className="space-y-3 pt-4 border-t">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">ملاحظة المراجعة</label><textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" /></div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => handleReview(viewItem._id, 'rejected')} className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl text-sm hover:bg-red-200"><XCircle size={16} />رفض</button>
                  <button onClick={() => handleReview(viewItem._id, 'accepted')} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700"><CheckCircle size={16} />قبول</button>
                </div>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </>
  );
}
