"use client";

import { useRouter, usePathname } from "next/navigation";

const languages = [
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
];

interface MobileLanguageButtonsProps {
  currentLang: string;
  onClose?: () => void;
}

export default function MobileLanguageButtons({ currentLang, onClose }: MobileLanguageButtonsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (code: string) => {
    // Replace current locale segment in path
    const segments = pathname.split("/");
    segments[1] = code;
    const newPath = segments.join("/");
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.push(newPath);
    onClose?.();
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentLang === lang.code
              ? "bg-red-700 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
