import React, { useEffect, useState, useCallback } from 'react';
import { contactService } from '@/services/contactService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal from '@/components/admin/AdminModal';
import { Eye, Trash2, Reply, Mail, MailOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [viewItem, setViewItem] = useState<ContactItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const loadData = useCallback(async () => {
    try { setLoading(true); const data = await contactService.getAll({ page, limit: 10, status: statusFilter || undefined }); setContacts(data?.contacts || []); setPagination(data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 }); } catch { toast.error('فشل تحميل الرسائل'); } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleView = async (item: ContactItem) => {
    setViewItem(item);
    setReplyText('');
    if (item.status === 'new') { try { await contactService.markAsRead(item._id); loadData(); } catch { } }
  };

  const handleReply = async () => {
    if (!viewItem || !replyText.trim()) return;
    try { setReplying(true); await contactService.reply(viewItem._id, replyText); toast.success('تم إرسال الرد'); setViewItem(null); loadData(); } catch (err: any) { toast.error(err.response?.data?.message || 'فشل الإرسال'); } finally { setReplying(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد؟')) return; try { await contactService.delete(id); toast.success('تم الحذف'); loadData(); } catch { toast.error('فشل الحذف'); } };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { new: 'bg-blue-50 text-blue-700', read: 'bg-yellow-50 text-yellow-700', replied: 'bg-green-50 text-green-700' };
    const labels: Record<string, string> = { new: 'جديد', read: 'مقروء', replied: 'تم الرد' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-500'}`}>{labels[status] || status}</span>;
  };

  const columns = [
    { key: 'name', label: 'الاسم', render: (item: ContactItem) => <p className="font-medium text-gray-800">{item.name}</p> },
    { key: 'email', label: 'البريد', render: (item: ContactItem) => <span className="text-sm text-gray-500" dir="ltr">{item.email}</span> },
    { key: 'subject', label: 'الموضوع', render: (item: ContactItem) => <p className="text-sm text-gray-600 truncate max-w-[200px]">{item.subject}</p> },
    { key: 'status', label: 'الحالة', render: (item: ContactItem) => statusBadge(item.status) },
    { key: 'createdAt', label: 'التاريخ', render: (item: ContactItem) => <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('ar')}</span> },
  ];

  return (
    <>
      {/* Status Filter */}
      <div className="flex gap-2 mb-4">
        {[{ label: 'الكل', value: '' }, { label: 'جديد', value: 'new' }, { label: 'مقروء', value: 'read' }, { label: 'تم الرد', value: 'replied' }].map(s => (
          <button key={s.value} onClick={() => { setStatusFilter(s.value); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-sm ${statusFilter === s.value ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>{s.label}</button>
        ))}
      </div>

      <AdminDataTable title="رسائل التواصل" data={contacts} columns={columns} loading={loading} pagination={pagination} onPageChange={setPage} actions={(item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleView(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-blue-600" /></button>
          <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
        </div>
      )} />

      {/* View / Reply Modal */}
      <AdminModal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="تفاصيل الرسالة" size="lg">
        {viewItem && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-xs text-gray-400">الاسم</span><p className="font-medium">{viewItem.name}</p></div>
              <div><span className="text-xs text-gray-400">البريد</span><p className="font-medium" dir="ltr">{viewItem.email}</p></div>
            </div>
            <div><span className="text-xs text-gray-400">الموضوع</span><p className="font-medium">{viewItem.subject}</p></div>
            <div className="bg-gray-50 p-4 rounded-xl"><span className="text-xs text-gray-400 block mb-2">الرسالة</span><p className="text-gray-700 whitespace-pre-wrap">{viewItem.message}</p></div>
            {viewItem.status === 'replied' && viewItem.replyMessage && (
              <div className="bg-green-50 p-4 rounded-xl"><span className="text-xs text-green-600 block mb-2">الرد المرسل</span><p className="text-gray-700 whitespace-pre-wrap">{viewItem.replyMessage}</p></div>
            )}
            {viewItem.status !== 'replied' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الرد</label>
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="اكتب ردك هنا..." />
                <div className="flex justify-end mt-3">
                  <button onClick={handleReply} disabled={replying || !replyText.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 disabled:opacity-50">
                    <Reply size={16} />{replying ? 'جاري الإرسال...' : 'إرسال الرد'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </>
  );
}
