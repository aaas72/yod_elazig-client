import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  footer?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, className = '', type = 'text', value, footer, ...props }) => {
  const [fileName, setFileName] = React.useState<string>('');
  React.useEffect(() => {
    if (
      type === 'file' &&
      value &&
      typeof value === 'object' &&
      'name' in value &&
      typeof (value as any).name === 'string'
    ) {
      setFileName((value as any).name);
    }
  }, [value, type]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      if (props.onChange) props.onChange(e);
    }
  };
  return (
    <div className="space-y-1">
      <label className="block mb-1 font-medium">{label}</label>
      {type === 'file' ? (
        <div>
          <label className="block w-full">
            <span className={`inline-block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white cursor-pointer text-right flex items-center ${fileName ? 'text-green-700 font-bold' : 'text-gray-400'}`}>
              {fileName ? (
                <>
                  <svg className="w-5 h-5 inline mr-2 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  تم الرفع
                  <span className="mx-2">|</span>
                  اسم الملف: {fileName}
                </>
              ) : (
                props.placeholder || "اختر ملف ..."
              )}
            </span>
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              {...props}
            />
          </label>
          {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 placeholder:text-gray-400 ${className} ${error ? 'border-red-400' : ''}`}
          {...props}
        />
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
      {footer}
    </div>
  );
};

export default FormInput;
