import React from "react";
import FormInput from "./ui/Forms/FormInput";
import SectionTitle from "./ui/Titles/SectionTitle";
import Button from "./ui/Button";
import LoadingSpinner from "./ui/LoadingSpinner";

interface EducationalInfoProps {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setStep: (step: number) => void;
  loading: boolean;
  error: string;
  success: string;
}

const EducationalInfoForm: React.FC<EducationalInfoProps> = ({ form, handleChange, handleSubmit, setStep, loading, error, success }) => (
  <>
    <SectionTitle title="البيانات التعليمية" className="md:col-span-2 mb-6 border-b-2 border-red-800 pb-2 items-end text-right" />
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput label="الجامعة" type="text" name="university" value={form.university} disabled required className="bg-white" placeholder="جامعة الفرات (تلقائي)" />
      <FormInput label="القسم" type="text" name="department" value={form.department} onChange={handleChange} className="bg-white" placeholder="مثال: هندسة الحاسوب" />
      <FormInput label="سنة الدراسة" type="number" name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange} min={1} max={8} className="bg-white" placeholder="مثال: 3" />
      <FormInput label="العنوان" type="text" name="address" value={form.address} onChange={handleChange} className="bg-white" placeholder="مثال: تركيا، إيلازيغ، منطقة X، حي Y، شارع Z، شقة 12" />
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
        value={form.studentDocument}
      />
      {error && (
        <div className="md:col-span-2 text-red-700 bg-red-50 p-3 rounded-lg text-center font-medium">{error}</div>
      )}
      {success && (
        <div className="md:col-span-2 text-green-700 bg-green-50 p-3 rounded-lg text-center font-medium">{success}</div>
      )}
      <div className="md:col-span-2 flex justify-between">
        <Button variant="secondary" className="!py-3 !text-lg" onClick={() => setStep(1)}>
          رجوع
        </Button>
        <Button variant="primary" className="!py-3 !text-lg" >
          {loading ? <LoadingSpinner size="sm" text="جاري الإرسال..." /> : "تسجيل"}
        </Button>
      </div>
    </form>
  </>
);

export default EducationalInfoForm;
