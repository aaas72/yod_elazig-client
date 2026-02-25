
import React, { useState } from "react";
import FormInput from "../../components/ui/Forms/FormInput";
import { useMembersData } from "../../hooks/useMembersData";
import AdminDataTable from "../../components/admin/AdminDataTable";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import AdminModal from "../../components/admin/AdminModal";
import { API_BASE_URL, UPLOAD_DIR, BASE_URL } from "@/lib/api";

interface Member {
  _id: string;
  fullName: string;
  fullNameEn?: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  email: string;
  tcNumber?: string;
  university: string;
  department: string;
  yearOfStudy: number;
  address?: string;
  isActive: boolean;
  enrollmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  studentId?: string;
  __v?: number;
  profileImage?: string;
  studentDocument?: string;
}


const AdminMembersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { members, pagination, loading, reload } = useMembersData({ page, limit: 10, search });

  // نافذة التعديل
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // زر تفعيل/تعطيل
  const handleToggle = async (id: string) => {
    try {
      await (await import("../../services/membersService")).membersService.toggleActive(id);
      reload();
    } catch (err) {
      alert("فشل التفعيل/التعطيل");
    }
  };
  // زر حذف
  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await (await import("../../services/membersService")).membersService.delete(id);
      reload();
    } catch (err) {
      alert("فشل الحذف");
    }
  };

  // زر تعديل
  const handleEdit = (member: Member) => {
    setEditMember(member);
    setEditModalOpen(true);
  };

  React.useEffect(() => {
    if (editModalOpen && editMember) {
      console.log('Populating form with:', editMember);
      setEditForm({
        fullName: editMember.fullName || '',
        fullNameEn: editMember.fullNameEn || '',
        gender: editMember.gender || '',
        dateOfBirth: editMember.dateOfBirth ? String(editMember.dateOfBirth).split('T')[0] : '',
        phoneNumber: editMember.phoneNumber || '',
        email: editMember.email || '',
        tcNumber: editMember.tcNumber || '',
        university: editMember.university || '',
        department: editMember.department || '',
        yearOfStudy: editMember.yearOfStudy || 0,
        address: editMember.address || '',
        isActive: editMember.isActive,
        profileImage: editMember.profileImage || '',
        studentDocument: editMember.studentDocument || '',
        studentId: editMember.studentId || '',
      });
    }
  }, [editModalOpen, editMember]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setEditForm((prev) => ({ ...prev, [name]: file }));
    } else if (type === "checkbox") {
      setEditForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };

  // تحقق من صحة البيانات كما في التسجيل
  const validateForm = () => {
    if (!editForm.fullName || String(editForm.fullName).length < 3) return "يرجى إدخال الاسم الكامل بشكل صحيح";
    if (!editForm.fullNameEn || String(editForm.fullNameEn).length < 3) return "يرجى إدخال الاسم الكامل بالإنجليزية بشكل صحيح";
    if (!editForm.gender || (editForm.gender !== "male" && editForm.gender !== "female")) return "يرجى اختيار الجنس";
    if (!editForm.dateOfBirth) return "يرجى إدخال تاريخ الميلاد";
    if (!/^5\d{9}$/.test(String(editForm.phoneNumber))) return "يرجى إدخال رقم هاتف تركي صحيح مكون من 10 أرقام يبدأ بـ 5 (مثال: 5354368820)";
    if (!editForm.email || !/^\S+@\S+\.\S+$/.test(String(editForm.email))) return "يرجى إدخال بريد إلكتروني صحيح";
    if (!/^\d{11}$/.test(String(editForm.tcNumber))) return "يجب أن يتكون رقم الإقامة من 11 رقم";
    if (!editForm.university) return "الجامعة مطلوبة";
    if (!editForm.department || String(editForm.department).length < 2) return "يرجى إدخال القسم بشكل صحيح";
    if (!editForm.yearOfStudy || isNaN(Number(editForm.yearOfStudy)) || Number(editForm.yearOfStudy) < 1) return "يرجى إدخال سنة الدراسة بشكل صحيح";
    if (!editForm.address || String(editForm.address).length < 10) return "يرجى إدخال العنوان بشكل مفصل";
    return null;
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMember) return;
    setSaving(true);
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }
    try {
      // Use FormData to handle file uploads correctly
      const formData = new FormData();
      formData.append('fullName', editForm.fullName || '');
      formData.append('fullNameEn', editForm.fullNameEn || '');
      formData.append('gender', editForm.gender || '');
      formData.append('dateOfBirth', editForm.dateOfBirth || '');
      formData.append('phoneNumber', editForm.phoneNumber || '');
      formData.append('email', editForm.email || '');
      formData.append('tcNumber', editForm.tcNumber || '');
      formData.append('university', editForm.university || '');
      formData.append('department', editForm.department || '');
      if (editForm.yearOfStudy) formData.append('yearOfStudy', String(editForm.yearOfStudy));
      formData.append('address', editForm.address || '');
      formData.append('isActive', String(!!editForm.isActive));

      if (editForm.profileImage && typeof editForm.profileImage === 'object' && 'name' in editForm.profileImage) {
        formData.append('profileImage', editForm.profileImage);
      }
      if (editForm.studentDocument && typeof editForm.studentDocument === 'object' && 'name' in editForm.studentDocument) {
        formData.append('studentDocument', editForm.studentDocument);
      }

      await (await import("../../services/membersService")).membersService.update(editMember._id, formData);
      setEditModalOpen(false);
      reload();
    } catch (err) {
      setError("فشل حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "fullName", label: "الاسم", render: (item: Member) => <span className="font-medium text-gray-800 truncate max-w-xs">{item.fullName}</span> },
    { key: "email", label: "البريد الإلكتروني" },
    { key: "tcNumber", label: "رقم الهوية" },
    { key: "university", label: "الجامعة" },
    { key: "department", label: "القسم" },
    { key: "yearOfStudy", label: "سنة الدراسة" },
    { key: "isActive", label: "الحالة", render: (item: Member) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.isActive ? "نشط" : "غير نشط"}</span> },
  ];

  return (
    <div className="p-6">
      <AdminDataTable
        title="إدارة العضويات"
        data={Array.isArray(members) ? members : []}
        columns={columns}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        pagination={pagination}
        onPageChange={setPage}
        actions={(member: Member) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggle(member._id)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
              title={member.isActive ? "تعطيل" : "تفعيل"}
            >
              {member.isActive ? (
                <EyeOff size={16} className="text-gray-400" />
              ) : (
                <Eye size={16} className="text-green-600" />
              )}
            </button>
            <button
              onClick={() => handleEdit(member)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
              title="تعديل"
            >
              <Edit size={16} className="text-blue-600" />
            </button>
            <button
              onClick={() => handleDelete(member._id)}
              className="p-1.5 hover:bg-red-50 rounded-lg"
              title="حذف"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        )}
      />

      {/* نافذة التعديل */}
      <AdminModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="تعديل بيانات العضو" size="xl">
        {editMember && (
          <form className="space-y-6" onSubmit={handleSaveEdit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="الاسم الكامل (عربي)" type="text" name="fullName" value={editForm.fullName || ''} onChange={handleFormChange} required className="bg-white" placeholder="مثال: أحمد محمد علي" />
              <FormInput label="الاسم الكامل (إنجليزي)" type="text" name="fullNameEn" value={editForm.fullNameEn || ''} onChange={handleFormChange} required className="bg-white" placeholder="مثال: Ahmed Mohammed Ali" />
              <div>
                <label className="block mb-1 font-medium">الجنس</label>
                <div className="flex gap-6 items-center">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="male" checked={editForm.gender === "male"} onChange={handleFormChange} required className="accent-red-800" />
                    <span>ذكر</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="female" checked={editForm.gender === "female"} onChange={handleFormChange} required className="accent-red-800" />
                    <span>أنثى</span>
                  </label>
                </div>
              </div>
              <FormInput label="تاريخ الميلاد" type="date" name="dateOfBirth" value={editForm.dateOfBirth ? String(editForm.dateOfBirth).slice(0,10) : ''} onChange={handleFormChange} required className="bg-white" placeholder="YYYY-MM-DD" />
              <FormInput label="رقم الهاتف" type="tel" name="phoneNumber" value={editForm.phoneNumber || ''} onChange={handleFormChange} required className="bg-white" placeholder="مثال: 5XXXXXXXXX" pattern="5\d{9}" inputMode="numeric" />
              <FormInput label="البريد الإلكتروني" type="email" name="email" value={editForm.email || ''} onChange={handleFormChange} required className="bg-white" placeholder="مثال: ahmed.student@example.com" />
              <FormInput
                label="رقم الإقامة للأجانب (YKN)"
                type="text"
                name="tcNumber"
                value={editForm.tcNumber || ''}
                onChange={handleFormChange}
                required
                className="bg-white"
                placeholder="مثال: 99123456789"
                inputMode="numeric"
                maxLength={11}
              />
              <FormInput label="العنوان" type="text" name="address" value={editForm.address || ''} onChange={handleFormChange} className="bg-white" placeholder="مثال: تركيا، إيلازيغ، منطقة X، حي Y، شارع Z، شقة 12" />
              <FormInput label="الجامعة" type="text" name="university" value={editForm.university || ''} disabled required className="bg-white" placeholder="جامعة الفرات (تلقائي)" />
              <FormInput label="القسم" type="text" name="department" value={editForm.department || ''} onChange={handleFormChange} className="bg-white" placeholder="مثال: هندسة الحاسوب" />
              <FormInput label="سنة الدراسة" type="number" name="yearOfStudy" value={editForm.yearOfStudy || ''} onChange={handleFormChange} min={1} max={8} className="bg-white" placeholder="مثال: 3" />
              <FormInput 
                label="صورة الملف الشخصي" 
                type="file" 
                name="profileImage" 
                accept="image/png,image/jpeg" 
                onChange={handleFormChange} 
                className="bg-white" 
                placeholder={
                  editForm.profileImage && typeof editForm.profileImage === 'object' && 'name' in editForm.profileImage
                    ? (editForm.profileImage as File).name
                    : "اختر صورة الملف الشخصي (PNG أو JPG)"
                }
                footer={typeof editForm.profileImage === 'string' && editForm.profileImage ? (
                   <div className="mt-1 flex items-center gap-3 px-1">
                     <img 
                       src={`http://localhost:5000${editForm.profileImage}`} 
                       alt="صورة الملف الشخصي" 
                       className="w-10 h-10 object-cover rounded-full border border-gray-200"
                     />
                     <a 
                       href={`http://localhost:5000${editForm.profileImage}`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-sm text-blue-600 hover:underline flex items-center gap-1" 
                       dir="ltr"
                     >
                       عرض الصورة الحالية
                     </a>
                   </div>
                ) : null}
              />
              <FormInput
                label="ورقة الطالب (أورنجي بلجسي)"
                type="file"
                name="studentDocument"
                accept="application/pdf"
                onChange={handleFormChange}
                className="bg-white"
                placeholder={
                  editForm.studentDocument && typeof editForm.studentDocument === 'object' && 'name' in editForm.studentDocument
                    ? (editForm.studentDocument as File).name
                    : "اختر ملف PDF لورقة الطالب"
                }
                footer={typeof editForm.studentDocument === 'string' && editForm.studentDocument ? (
                   <div className="mt-1 flex items-center gap-2 px-1">
                     <a 
                     href={`${BASE_URL}/${UPLOAD_DIR}${editForm.studentDocument}`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                       className="text-sm text-blue-600 hover:underline flex items-center gap-1" 
                       dir="ltr"
                     >
                       <Eye size={14} />
                       {String(editForm.studentDocument).split('/').pop()}
                     </a>
                   </div>
                ) : null}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الطالب</label>
                <input name="studentId" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-center bg-gray-50" value={editForm.studentId || ''} readOnly />
              </div>
              <div className="md:col-span-2 flex items-center gap-4 mt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input name="isActive" type="checkbox" checked={!!editForm.isActive} onChange={handleFormChange} className="w-4 h-4 text-green-600 rounded" />
                  <span className="text-sm">نشط</span>
                </label>
              </div>
              {error && (
                <div className="md:col-span-2 text-red-700 bg-red-50 p-3 rounded-lg text-center font-medium">{error}</div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => setEditModalOpen(false)} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">إلغاء</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</button>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminMembersPage;