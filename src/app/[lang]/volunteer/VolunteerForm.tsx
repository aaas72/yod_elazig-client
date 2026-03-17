"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { CheckCircle, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Forms/FormInput";

interface VolunteerFormProps {
  lang: Locale;
  formLabels: any;
}

type VolunteerFormState = {
  name: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  yearOfStudy: string;
  skills: string;
  motivation: string;
  availableHours: string;
};

export default function VolunteerForm({ lang, formLabels }: VolunteerFormProps) {
  const [form, setForm] = useState<VolunteerFormState>({
    name: "",
    email: "",
    phone: "",
    university: "",
    department: "",
    yearOfStudy: "",
    skills: "",
    motivation: "",
    availableHours: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const t = formLabels || {};
  const labels = t.labels || {};
  const placeholders = t.placeholders || {};
  const sections = t.sections || {};
  const validation = t.validation || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.name || form.name.length < 3) return validation.nameRequired || "الاسم مطلوب (3 أحرف على الأقل)";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) return validation.emailInvalid || "البريد الإلكتروني غير صحيح";
    if (!/^5\d{9}$/.test(form.phone)) return validation.phoneInvalid || "رقم الهاتف يجب أن يبدأ بـ 5 ويتكون من 10 أرقام";
    if (!form.motivation || form.motivation.length < 20) return validation.motivationRequired || "سبب التطوع مطلوب (20 حرف على الأقل)";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // TODO: API integration
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        university: "",
        department: "",
        yearOfStudy: "",
        skills: "",
        motivation: "",
        availableHours: "",
      });
    } catch (err: any) {
      setError(err.message || (t.errors?.generic || "حدث خطأ أثناء الإرسال"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          {t.success?.title || "تم إرسال طلبك بنجاح!"}
        </h2>
        <p className="text-green-700 mb-6">
          {t.success?.message || "سيتم مراجعة طلبك والتواصل معك قريباً"}
        </p>
        <Button href={`/${lang}`} variant="primary">
          {t.success?.backHome || "العودة للرئيسية"}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {t.title || "نموذج التقديم"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="border-b border-gray-200 pb-2 mb-4">
          <span className="text-lg font-bold text-red-700">
            {sections.personal || "المعلومات الشخصية"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={labels.name || "الاسم الكامل"}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder={placeholders.name || "أدخل اسمك الكامل"}
            className="bg-white"
          />
          <FormInput
            label={labels.email || "البريد الإلكتروني"}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder={placeholders.email || "example@email.com"}
            className="bg-white"
          />
          <FormInput
            label={labels.phone || "رقم الهاتف"}
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder={placeholders.phone || "5xxxxxxxxx"}
            pattern="5\d{9}"
            inputMode="numeric"
            className="bg-white"
          />
          <FormInput
            label={labels.availableHours || "ساعات التطوع المتاحة"}
            type="number"
            name="availableHours"
            value={form.availableHours}
            onChange={handleChange}
            placeholder={placeholders.availableHours || "عدد الساعات أسبوعياً"}
            min={1}
            max={40}
            className="bg-white"
          />
        </div>

        {/* Educational Info */}
        <div className="border-b border-gray-200 pb-2 mb-4 mt-8">
          <span className="text-lg font-bold text-red-700">
            {sections.education || "المعلومات التعليمية"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label={labels.university || "الجامعة"}
            type="text"
            name="university"
            value={form.university}
            onChange={handleChange}
            placeholder={placeholders.university || "اسم الجامعة"}
            className="bg-white"
          />
          <FormInput
            label={labels.department || "التخصص"}
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder={placeholders.department || "تخصصك الدراسي"}
            className="bg-white"
          />
          <FormInput
            label={labels.yearOfStudy || "السنة الدراسية"}
            type="number"
            name="yearOfStudy"
            value={form.yearOfStudy}
            onChange={handleChange}
            min={1}
            max={8}
            placeholder={placeholders.yearOfStudy || "1-8"}
            className="bg-white"
          />
        </div>

        {/* Skills & Motivation */}
        <div className="border-b border-gray-200 pb-2 mb-4 mt-8">
          <span className="text-lg font-bold text-red-700">
            {sections.skills || "المهارات والدوافع"}
          </span>
        </div>

        <div className="space-y-4">
          <FormInput
            label={labels.skills || "المهارات"}
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder={placeholders.skills || "مثال: تصميم، برمجة، تصوير (افصل بفاصلة)"}
            className="bg-white"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {labels.motivation || "لماذا تريد التطوع معنا؟"} <span className="text-red-500">*</span>
            </label>
            <textarea
              name="motivation"
              value={form.motivation}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none placeholder:text-gray-400 placeholder:opacity-100"
              placeholder={placeholders.motivation || "أخبرنا عن دوافعك للتطوع... (20 حرف على الأقل)"}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            variant="primary"
            className="!py-3 !px-8 !text-lg"
            icon={<Send size={20} />}
          >
            {loading ? (t.submitting || "جارٍ الإرسال...") : (t.submit || "إرسال الطلب")}
          </Button>
        </div>
      </form>
    </div>
  );
}
