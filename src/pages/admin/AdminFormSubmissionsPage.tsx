import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formsService, type FormSubmission, type FormItem } from '@/services/formsService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import { ArrowRight, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminFormSubmissionsPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [form, setForm] = useState<FormItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) loadData();
  }, [formId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [formData, subsData] = await Promise.all([
        formsService.getById(formId!),
        formsService.getSubmissions(formId!)
      ]);
      setForm(formData);
      setSubmissions(subsData);
    } catch {
      // toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (!submissions.length) return;
    const data = submissions.map(sub => {
      const row: any = { 'تاريخ الإرسال': new Date(sub.createdAt).toLocaleDateString('ar-EG') };
      form?.fields.forEach(field => {
        row[field.label.ar || field.name] = sub.data[field.name];
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");
    XLSX.writeFile(wb, `${form?.slug}_submissions.xlsx`);
  };

  // Generate dynamic columns based on form fields
  const columns = [
    { key: 'createdAt', label: 'التاريخ', render: (item: FormSubmission) => <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString('ar')}</span> },
    ...(form?.fields.slice(0, 4).map(field => ({
      key: field.name,
      label: field.label.ar || field.name,
      render: (item: FormSubmission) => {
        const val = item.data[field.name];
        if (field.type === 'file' && val) return <a href={val} target="_blank" className="text-blue-600 underline text-xs">عرض الملف</a>;
        return <span className="text-sm truncate max-w-[150px] block">{String(val || '-')}</span>;
      }
    })) || [])
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/forms')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowRight size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الاستجابات: {form?.title.ar}</h1>
          <p className="text-sm text-gray-500">عرض جميع الردود المرسلة لهذا النموذج</p>
        </div>
        <div className="mr-auto">
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download size={16} /> تصدير Excel
          </button>
        </div>
      </div>

      <AdminDataTable
        title={`الاستجابات: ${form?.title.ar || ''}`}
        data={submissions}
        columns={columns}
        loading={loading}
        pagination={{ page: 1, pages: 1, total: submissions.length, limit: 100 }}
        onPageChange={() => {}}
      />
    </div>
  );
}
