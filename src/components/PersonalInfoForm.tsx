import React from "react";
import FormInput from "./ui/Forms/FormInput";
import SectionTitle from "./ui/Titles/SectionTitle";
import Button from "./ui/Button";

interface PersonalInfoProps {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setStep: (step: number) => void;
  error?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoProps> = ({ form, handleChange, setStep, error }) => (
  <>
    <SectionTitle title="البيانات الشخصية" className="md:col-span-2 mb-6 border-b-2 border-red-800 pb-2 items-end text-right" />
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          value={form.profileImage}
        />
      </div>
      <FormInput label="رقم الإقامة للأجانب (YKN)" type="text" name="tcNumber" value={form.tcNumber} onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");
        handleChange({ ...e, target: { ...e.target, value } });
      }} required className="bg-white" placeholder="مثال: 99123456789" inputMode="numeric" maxLength={11} />
      {error && (
        <div className="md:col-span-2 text-red-700 bg-red-50 p-3 rounded-lg text-center font-medium">{error}</div>
      )}
      <div className="md:col-span-2 flex justify-end">
        <Button variant="primary" className="!py-3 !text-lg" onClick={() => setStep(2)}>
          التالي
        </Button>
      </div>
    </form>
  </>
);

export default PersonalInfoForm;
