"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  currentLang: Locale;
  isMobile?: boolean;
}

export default function LanguageSwitcher({
  currentLang,
  isMobile = false,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const changeLanguage = (newLang: Locale) => {
    if (newLang === currentLang) {
      setOpen(false);
      return;
    }

    // Replace the current locale in the pathname with the new one
    const pathWithoutLocale = pathname.replace(`/${currentLang}`, "");
    const newPath = `/${newLang}${pathWithoutLocale || ""}`;

    // Set cookie for the middleware
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=${60 * 60 * 24 * 365}`;

    router.push(newPath);
    setOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".lang-switcher")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Mobile version - simple buttons
  if (isMobile) {
    return (
      <div className="flex gap-1">
        {locales.map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all uppercase ${
              currentLang === lang
                ? "bg-white text-red-700"
                : "text-white/80 hover:bg-white/20 hover:text-white"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    );
  }

  // Desktop version - dropdown
  return (
    <div className="relative z-50 lang-switcher">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-white hover:text-red-200 transition-colors xl:px-2 py-2 text-sm xl:text-md font-medium"
      >
        <Globe className="w-4 h-4 xl:w-[18px] xl:h-[18px]" />
        <span className="uppercase">{currentLang}</span>
      </button>

      <div
        className={`absolute ltr:right-0 rtl:left-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 transition-all duration-200 transform ltr:origin-top-right rtl:origin-top-left ${
          open ? "block opacity-100 visible" : "hidden opacity-0 invisible"
        }`}
      >
        <button
          onClick={() => changeLanguage("ar")}
          className={`block w-full text-right px-4 py-2 text-sm ${
            currentLang === "ar"
              ? "bg-red-50 text-red-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          العربية
        </button>
        <button
          onClick={() => changeLanguage("tr")}
          className={`block w-full text-left px-4 py-2 text-sm ${
            currentLang === "tr"
              ? "bg-red-50 text-red-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Türkçe
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={`block w-full text-left px-4 py-2 text-sm ${
            currentLang === "en"
              ? "bg-red-50 text-red-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
}
