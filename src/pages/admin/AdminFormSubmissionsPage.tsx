import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formsService, type FormSubmission, type FormItem } from '@/services/formsService';
import AdminDataTable from '@/components/admin/AdminDataTable';
import { ArrowRight, Download, Eye, X, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

import { resolveImage } from '@/utils/resolveImage';
import AdminModal from '@/components/admin/AdminModal';

export default function AdminFormSubmissionsPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [form, setForm] = useState<FormItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

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
    ...(form?.fields.map(field => ({
      key: field.name,
      label: field.label.ar || field.name,
      render: (item: FormSubmission) => {
        // Safe access to data object
        if (!item || !item.data) return <span>-</span>;

        const val = item.data[field.name];
        if (field.type === 'file' && val && typeof val === 'string') {
          // Check if it's an image extension
          if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(val)) {
            const imgSrc = resolveImage(val);
            return (
              <a href={imgSrc} target="_blank" rel="noopener noreferrer" className="block w-16 h-16 rounded overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity">
                <img src={imgSrc} alt="uploaded" className="w-full h-full object-cover" />
              </a>
            );
          }
          // Otherwise link
          return <a href={resolveImage(val)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs break-all">عرض الملف</a>;
        }
        return <span className="text-sm truncate max-w-[150px] block" title={String(val || '')}>{String(val || '-')}</span>;
      }
    })) || [])
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/forms')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowRight size={20} /></button>
        <div className="mr-auto">
          <button onClick={exportExcel} className="flex items-center gap-2 px-2 py-1 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download size={16} /> Excel
          </button>
        </div>
      </div>

      <AdminDataTable
        title={"الردود المرسلة"}
        data={submissions}
        columns={columns}
        loading={loading}
        pagination={{ page: 1, pages: 1, total: submissions.length, limit: 100 }}
        onPageChange={() => { }}
        actions={(item) => (
          <button
            onClick={() => setSelectedSubmission(item)}
            className="p-1.5 hover:bg-gray-100 rounded text-blue-600"
            title="عرض التفاصيل"
          >
            <Eye size={18} />
          </button>
        )}
      />

      {/* View Modal */}
      <AdminModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title="تفاصيل الرد"
        size="lg"
      >
        {selectedSubmission && form && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm text-gray-500">
                تاريخ الإرسال: {new Date(selectedSubmission.createdAt).toLocaleString('ar-EG')}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {form.fields.map((field) => {
                const val = selectedSubmission.data?.[field.name];
                return (
                  <div key={field.name} className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {field.label.ar || field.name}
                    </label>
                    <div className="text-gray-900 break-words">
                      {field.type === 'file' ? (
                        val && typeof val === 'string' ? (
                          /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(val) ? (
                            <div className="mt-2">
                              <a href={resolveImage(val)} target="_blank" rel="noopener noreferrer" className="inline-block border rounded-lg overflow-hidden">
                                <img src={resolveImage(val)} alt="uploaded" className="max-w-full max-h-[300px] object-contain" />
                              </a>
                            </div>
                          ) : (
                            <a href={resolveImage(val)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 underline bg-white p-3 rounded border w-fit">
                              <Download size={16} />
                              <span>تحميل الملف</span>
                            </a>
                          )
                        ) : (
                          <span className="text-gray-400 italic text-sm">لا يوجد ملف مرفق</span>
                        )
                      ) : (
                        <span className="whitespace-pre-wrap">{Array.isArray(val) ? val.join(', ') : String(val || '-')}</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Extra fields section */}
              {selectedSubmission.data && Object.keys(selectedSubmission.data)
                .filter(key => !form.fields.some(f => f.name === key))
                .map(key => {
                  const val = selectedSubmission.data[key];
                  return (
                    <div key={key} className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                      <label className="block text-sm font-bold text-orange-800 mb-2">
                        {key} (حقل إضافي)
                      </label>
                      <div className="text-gray-900 break-words">
                        {typeof val === 'string' && /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(val) ? (
                          <div className="mt-2">
                            <a href={resolveImage(val)} target="_blank" rel="noopener noreferrer" className="inline-block border rounded-lg overflow-hidden">
                              <img src={resolveImage(val)} alt="uploaded" className="max-w-full max-h-[300px] object-contain" />
                            </a>
                          </div>
                        ) : (
                          <span className="whitespace-pre-wrap">{Array.isArray(val) ? val.join(', ') : String(val || '-')}</span>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* All Attachments Gallery (Fallback) */}
              {selectedSubmission.data && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Upload size={20} />
                    جميع الملفات المرفقة
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(selectedSubmission.data)
                      .filter(([_, val]) => typeof val === 'string' && /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(val))
                      .map(([key, val]) => (
                        <a key={key} href={resolveImage(val as string)} target="_blank" rel="noopener noreferrer" className="block border rounded-lg overflow-hidden hover:shadow-md transition bg-white p-2">
                          <img src={resolveImage(val as string)} alt={key} className="w-full h-32 object-cover rounded mb-2" />
                          <span className="text-xs text-gray-500 block truncate" title={key}>{key}</span>
                        </a>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
