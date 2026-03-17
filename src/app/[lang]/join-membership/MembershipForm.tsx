"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { submitMembership } from "@/services/membershipService";

interface MembershipFormProps {
  lang: Locale;
}

type MembershipFormState = {
  fullName: string;
  fullNameEn: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  tcNumber: string;
  profileImage: File | null;
  studentDocument: File | null;
  university: string;
  department: string;
  yearOfStudy: string;
  address: string;
};

const initialState: MembershipFormState = {
  fullName: "",
  fullNameEn: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  tcNumber: "",
  profileImage: null,
  studentDocument: null,
  university: "جامعة الفرات",
  department: "",
  yearOfStudy: "",
  address: "",
};

export default function MembershipForm({ lang }: MembershipFormProps) {
  const [form, setForm] = useState<MembershipFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [profileFileName, setProfileFileName] = useState("");
  const [studentDocFileName, setStudentDocFileName] = useState("");

  const validateForm = () => {
    if (!form.fullName || form.fullName.length < 3) return "يرجى إدخال الاسم الكامل بشكل صحيح";
    if (!form.fullNameEn || form.fullNameEn.length < 3) return "يرجى إدخال الاسم الكامل بالإنجليزية بشكل صحيح";
    if (!form.gender || (form.gender !== "male" && form.gender !== "female")) return "يرجى اختيار الجنس";
    if (!form.dateOfBirth) return "يرجى إدخال تاريخ الميلاد";
    if (!/^5\d{9}$/.test(form.phoneNumber)) return "يرجى إدخال رقم هاتف تركي صحيح مكون من 10 أرقام يبدأ بـ 5 (مثال: 5354368820)";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) return "يرجى إدخال بريد إلكتروني صحيح";
    if (!/^\d{11}$/.test(form.tcNumber)) return "يجب أن يتكون رقم الإقامة من 11 رقم";
    if (!form.profileImage) return "يرجى رفع صورة الملف الشخصي (PNG أو JPG)";
    if (form.profileImage && !["image/png", "image/jpeg"].includes(form.profileImage.type)) return "يجب أن تكون الصورة من نوع PNG أو JPG";
    if (!form.studentDocument) return "يرجى رفع ملف PDF لورقة الطالب";
    if (form.studentDocument && form.studentDocument.type !== "application/pdf") return "يجب أن يكون الملف من نوع PDF";
    if (!form.university) return "الجامعة مطلوبة";
    if (!form.department || form.department.length < 2) return "يرجى إدخال القسم بشكل صحيح";
    if (!form.yearOfStudy || isNaN(Number(form.yearOfStudy)) || Number(form.yearOfStudy) < 1) return "يرجى إدخال سنة الدراسة بشكل صحيح";
    if (!form.address || form.address.length < 10) return "يرجى إدخال العنوان بشكل مفصل";
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm({ ...form, [name]: file });
      if (name === "profileImage" && file) setProfileFileName(file.name);
      if (name === "studentDocument" && file) setStudentDocFileName(file.name);
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
      setProfileFileName("");
      setStudentDocFileName("");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("تم التسجيل مسبقاً بهذا البريد الإلكتروني أو رقم الهوية");
      } else if (err.response?.data?.errors) {
        setError(
          err.response.data.errors
            .map((e: any) => e.msg || e.message || JSON.stringify(e))
            .join(" | ")
        );
      } else {
        setError(err.response?.data?.message || "حدث خطأ ما");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Personal Info Section */}
      <div className="md:col-span-2 mb-6 border-b-2 border-red-800 pb-2 items-end text-start">
        <span className="text-xl font-bold">البيانات الشخصية</span>
      </div>

      {/* Full Name (Arabic) */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">الاسم الكامل (عربي)</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="مثال: أحمد محمد علي"
        />
      </div>

      {/* Full Name (English) */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">الاسم الكامل (إنجليزي)</label>
        <input
          type="text"
          name="fullNameEn"
          value={form.fullNameEn}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="مثال: Ahmed Mohammed Ali"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block mb-1 font-medium">الجنس</label>
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
              required
              className="accent-red-800"
            />
            <span>ذكر</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
              required
              className="accent-red-800"
            />
            <span>أنثى</span>
          </label>
        </div>
      </div>

      {/* Date of Birth */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">تاريخ الميلاد</label>
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">رقم الهاتف</label>
        <input
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="مثال: 5XXXXXXXXX"
          pattern="5\d{9}"
          inputMode="numeric"
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">البريد الإلكتروني</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="مثال: ahmed.student@example.com"
        />
      </div>

      {/* Profile Image */}
      <div className="col-span-1 space-y-1">
        <label className="block mb-1 font-medium">صورة الملف الشخصي</label>
        <label className="block w-full">
          <span
            className={`inline-block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white cursor-pointer text-start flex items-center ${
              profileFileName ? "text-green-700 font-bold" : "text-gray-400 text-[0.8rem]"
            }`}
          >
            {profileFileName ? (
              <>
                <svg className="w-5 h-5 inline me-2 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                تم الرفع
                <span className="mx-2">|</span>
                اسم الملف: {profileFileName}
              </>
            ) : (
              "اختر صورة الملف الشخصي (PNG أو JPG)"
            )}
          </span>
          <input
            type="file"
            name="profileImage"
            accept="image/png,image/jpeg"
            onChange={handleChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* TC Number (YKN) */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">رقم الإقامة للأجانب (YKN)</label>
        <input
          type="text"
          name="tcNumber"
          value={form.tcNumber}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 11) value = value.slice(0, 11);
            setForm((prev) => ({ ...prev, tcNumber: value }));
          }}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="مثال: 99123456789"
          inputMode="numeric"
          maxLength={11}
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">العنوان</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="مثال: تركيا، إيلازيغ، منطقة X، حي Y، شارع Z، شقة 12"
        />
      </div>

      {/* Educational Info Section */}
      <div className="md:col-span-2 mb-6 mt-8 border-b-2 border-red-800 pb-2 items-end text-start">
        <span className="text-xl font-bold">البيانات التعليمية</span>
      </div>

      {/* University */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">الجامعة</label>
        <input
          type="text"
          name="university"
          value={form.university}
          disabled
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="جامعة الفرات (تلقائي)"
        />
      </div>

      {/* Department */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">القسم</label>
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="مثال: هندسة الحاسوب"
        />
      </div>

      {/* Year of Study */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">سنة الدراسة</label>
        <input
          type="number"
          name="yearOfStudy"
          value={form.yearOfStudy}
          onChange={handleChange}
          min={1}
          max={8}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white placeholder:text-gray-400 placeholder:opacity-100"
          placeholder="مثال: 3"
        />
      </div>

      {/* Student Document */}
      <div className="space-y-1">
        <label className="block mb-1 font-medium">ورقة الطالب (أورنجي بلجسي)</label>
        <label className="block w-full">
          <span
            className={`inline-block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white cursor-pointer text-start flex items-center ${
              studentDocFileName ? "text-green-700 font-bold" : "text-gray-400 text-[0.8rem]"
            }`}
          >
            {studentDocFileName ? (
              <>
                <svg className="w-5 h-5 inline me-2 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                تم الرفع
                <span className="mx-2">|</span>
                اسم الملف: {studentDocFileName}
              </>
            ) : (
              "اختر ملف PDF لورقة الطالب"
            )}
          </span>
          <input
            type="file"
            name="studentDocument"
            accept="application/pdf"
            onChange={handleChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="md:col-span-2 text-red-700 bg-red-50 p-3 rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="md:col-span-2 text-green-700 bg-green-50 p-3 rounded-lg text-center font-medium">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <div className="md:col-span-2 flex justify-end mt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 text-lg cursor-pointer justify-center shadow text-red-800 border-2 hover:bg-[#FFC0C0] hover:px-8 disabled:opacity-50"
        >
          {loading ? "جاري الإرسال..." : "تسجيل"}
        </button>
      </div>
    </form>
  );
}
