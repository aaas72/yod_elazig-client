import React, { useState } from "react";
import axios from "axios";
import SimplePageHero from "../components/ui/Sections/SimplePageHero";
import { submitMembership } from '../services/membershipService';
import PersonalInfoForm from '../components/PersonalInfoForm';
import EducationalInfoForm from '../components/EducationalInfoForm';
import FormInput from '../components/ui/Forms/FormInput';
import Button from '../components/ui/Button';

type MembershipForm = {
  fullName: string;
  fullNameEn: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  tcNumber: string;
  profileImage: File | null | string;
  passportDocument: File | null | string;
  studentDocument: File | null | string;
  university: string;
  department: string;
  yearOfStudy: string;
  address: string;
};

const initialState: MembershipForm = {
  fullName: "",
  fullNameEn: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  tcNumber: "",
  profileImage: "",
  passportDocument: "",
  studentDocument: "",
  university: "جامعة الفرات",
  department: "",
  yearOfStudy: "",
  address: "",
};

const JoinMembershipPage: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // دالة التحقق من صحة البيانات
  const validateForm = () => {
    // تحقق من الحقول النصية
    if (!form.fullName || form.fullName.length < 3) return "يرجى إدخال الاسم الكامل بشكل صحيح";
    if (!form.fullNameEn || form.fullNameEn.length < 3) return "يرجى إدخال الاسم الكامل بالإنجليزية بشكل صحيح";
    if (!form.gender || (form.gender !== "male" && form.gender !== "female")) return "يرجى اختيار الجنس";
    if (!form.dateOfBirth) return "يرجى إدخال تاريخ الميلاد";
    // تحقق من رقم الهاتف التركي بدقة (يدخل المستخدم فقط 10 أرقام تبدأ بـ 5)
    if (!/^5\d{9}$/.test(form.phoneNumber)) return "يرجى إدخال رقم هاتف تركي صحيح مكون من 10 أرقام يبدأ بـ 5 (مثال: 5354368820)";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) return "يرجى إدخال بريد إلكتروني صحيح";
    // تحقق من رقم الإقامة للأجانب (YKN)
    console.log("TC VALUE:", form.tcNumber);
    if (!/^\d{11}$/.test(form.tcNumber)) {
      return "يجب أن يتكون رقم الإقامة من 11 رقم";
    }
    // تحقق من رفع الملفات
    if (!form.profileImage || typeof form.profileImage === "string") return "يرجى رفع صورة الملف الشخصي (PNG أو JPG)";
    if (form.profileImage && !["image/png", "image/jpeg"].includes(form.profileImage.type)) return "يجب أن تكون الصورة من نوع PNG أو JPG";
    if (!form.studentDocument || typeof form.studentDocument === "string") return "يرجى رفع ملف PDF لورقة الطالب";
    if (form.studentDocument && form.studentDocument.type !== "application/pdf") return "يجب أن يكون الملف من نوع PDF";
    // تحقق من البيانات التعليمية
    if (!form.university) return "الجامعة مطلوبة";
    if (!form.department || form.department.length < 2) return "يرجى إدخال القسم بشكل صحيح";
    if (!form.yearOfStudy || isNaN(Number(form.yearOfStudy)) || Number(form.yearOfStudy) < 1) return "يرجى إدخال سنة الدراسة بشكل صحيح";
    if (!form.address || form.address.length < 10) return "يرجى إدخال العنوان بشكل مفصل";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm({ ...form, [name]: file });
    } else {
      setForm({ ...form, [name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    try {
      console.log('Submitting form with data:', {
        fullName: form.fullName,
        fullNameEn: form.fullNameEn,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        phoneNumber: "+90" + form.phoneNumber,
        email: form.email,
        tcNumber: form.tcNumber,
        profileImage: form.profileImage ? (form.profileImage as File).name : null,
        studentDocument: form.studentDocument ? (form.studentDocument as File).name : null,
      });
      
      await submitMembership({
        fullName: form.fullName,
        fullNameEn: form.fullNameEn,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        phoneNumber: "+90" + form.phoneNumber,
        email: form.email,
        tcNumber: form.tcNumber,
        profileImage: form.profileImage as File,
        studentDocument: form.studentDocument as File,
        university: form.university,
        department: form.department,
        yearOfStudy: Number(form.yearOfStudy),
        address: form.address,
      });
      setSuccess("تم التسجيل بنجاح!");
      setForm(initialState);
    } catch (err: any) {
      console.error('Registration Error:', err);
      if (err.response?.status === 409) {
        setError("تم التسجيل مسبقاً بهذا البريد الإلكتروني أو رقم الهوية");
      } else if (err.response?.data?.errors) {
        setError(
          err.response.data.errors
            .map((e: any) => e.msg || e.message || JSON.stringify(e))
            .join(' | ')
        );
      } else {
        setError(err.response?.data?.message || "حدث خطأ ما");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen " dir="rtl" lang="ar">
      <SimplePageHero
        title="التسجيل في عضوية الاتحاد"
        breadcrumbs={[{ label: "الرئيسية", href: "/" }, { label: "الانضمام" }]}
      />
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-4xl rounded-2xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Info */}
            <div className="md:col-span-2 mb-6 border-b-2 border-red-800 pb-2 items-end text-right">
              <span className="text-xl font-bold">البيانات الشخصية</span>
            </div>
            <FormInput label="الاسم الكامل (عربي)" type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="bg-white" placeholder="مثال: أحمد محمد علي" />
            <FormInput label="الاسم الكامل (إنجليزي)" type="text" name="fullNameEn" value={form.fullNameEn} onChange={handleChange} required className="bg-white" placeholder="مثال: Ahmed Mohammed Ali" />
            <div>
              <label className="block mb-1 font-medium">الجنس</label>
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="male" checked={form.gender === "male"} onChange={handleChange} required className="accent-red-800" />
                  <span>ذكر</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="female" checked={form.gender === "female"} onChange={handleChange} required className="accent-red-800" />
                  <span>أنثى</span>
                </label>
              </div>
            </div>
            <FormInput label="تاريخ الميلاد" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required className="bg-white" placeholder="YYYY-MM-DD" />
            <FormInput label="رقم الهاتف" type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="bg-white" placeholder="مثال: 5XXXXXXXXX" pattern="5\d{9}" inputMode="numeric" />
            <FormInput label="البريد الإلكتروني" type="email" name="email" value={form.email} onChange={handleChange} required className="bg-white" placeholder="مثال: ahmed.student@example.com" />
            <div className="col-span-1">
              <FormInput 
                label="صورة الملف الشخصي" 
                type="file" 
                name="profileImage" 
                accept="image/png,image/jpeg" 
                onChange={handleChange} 
                className="bg-white" 
                placeholder={
                  form.profileImage && typeof form.profileImage === 'object' && 'name' in form.profileImage
                    ? (form.profileImage as File).name
                    : "اختر صورة الملف الشخصي (PNG أو JPG)"
                }
                value={
                  typeof form.profileImage === "string"
                    ? form.profileImage
                    : form.profileImage && typeof form.profileImage === "object" && "name" in form.profileImage
                      ? (form.profileImage as File).name
                      : ""
                }
              />
            </div>
            <FormInput
              label="رقم الإقامة للأجانب (YKN)"
              type="text"
              name="tcNumber"
              value={form.tcNumber}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 11) value = value.slice(0, 11);
                setForm((prev) => ({ ...prev, tcNumber: value }));
              }}
              required
              className="bg-white"
              placeholder="مثال: 99123456789"
              inputMode="numeric"
              maxLength={11}
            />
                        <FormInput label="العنوان" type="text" name="address" value={form.address} onChange={handleChange} className="bg-white" placeholder="مثال: تركيا، إيلازيغ، منطقة X، حي Y، شارع Z، شقة 12" />
            {/* Educational Info */}
            <div className="md:col-span-2 mb-6 mt-8 border-b-2 border-red-800 pb-2 items-end text-right">
              <span className="text-xl font-bold">البيانات التعليمية</span>
            </div>
            <FormInput label="الجامعة" type="text" name="university" value={form.university} disabled required className="bg-white" placeholder="جامعة الفرات (تلقائي)" />
            <FormInput label="القسم" type="text" name="department" value={form.department} onChange={handleChange} className="bg-white" placeholder="مثال: هندسة الحاسوب" />
            <FormInput label="سنة الدراسة" type="number" name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange} min={1} max={8} className="bg-white" placeholder="مثال: 3" />
            <FormInput 
              label="ورقة الطالب (أورنجي بلجسي)" 
              type="file" 
              name="studentDocument" 
              accept="application/pdf" 
              onChange={handleChange} 
              className="bg-white" 
              placeholder={
                form.studentDocument && typeof form.studentDocument === 'object' && 'name' in form.studentDocument
                  ? (form.studentDocument as File).name
                  : "اختر ملف PDF لورقة الطالب"
              }
              value={
                typeof form.studentDocument === "string"
                  ? form.studentDocument
                  : form.studentDocument && typeof form.studentDocument === "object" && "name" in form.studentDocument
                    ? (form.studentDocument as File).name
                    : ""
              }
            />
            {error && (
              <div className="md:col-span-2 text-red-700 bg-red-50 p-3 rounded-lg text-center font-medium">{error}</div>
            )}
            {success && (
              <div className="md:col-span-2 text-green-700 bg-green-50 p-3 rounded-lg text-center font-medium">{success}</div>
            )}
            <div className="md:col-span-2 flex justify-end mt-6">
              <Button variant="primary" className="!py-3 !text-lg" >
                {loading ? "جاري الإرسال..." : "تسجيل"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinMembershipPage;
