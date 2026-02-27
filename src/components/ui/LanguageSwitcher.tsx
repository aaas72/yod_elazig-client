import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);
  const [targetLang, setTargetLang] = useState("");

  const getLoadingText = (lng: string) => {
    switch (lng) {
      case "ar":
        return "جاري تغيير اللغة إلى العربية...";
      case "en":
        return "Switching to English...";
      case "tr":
        return "Türkçe'ye geçiliyor...";
      default:
        return "Loading...";
    }
  };

  const changeLanguage = async (lng: string) => {
    if (lng === i18n.language) return;
    
    setTargetLang(lng);
    setIsChanging(true);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
    
    await i18n.changeLanguage(lng);
    
    // تأخير بسيط لإظهار التحول بشكل سلس
    setTimeout(() => {
      setIsChanging(false);
    }, 800);
  };

  const currentLang = i18n.language;
  const [open, setOpen] = useState(false);

  // close menu when clicking outside
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

  return (
    <>
      <AnimatePresence>
        {isChanging && <LoadingSpinner fullScreen text={getLoadingText(targetLang)} />}
      </AnimatePresence>
      
      <div className="relative z-50 lang-switcher">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-white hover:text-red-200 transition-colors p-2"
        >
          <Globe size={20} />
          <span className="uppercase">{currentLang}</span>
        </button>

        <div
          className={`absolute ltr:right-0 rtl:left-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 transition-all duration-200 transform ltr:origin-top-right rtl:origin-top-left ${
            open ? "block opacity-100 visible" : "hidden opacity-0 invisible"
          }`}
        >
          <button
            onClick={() => { changeLanguage("ar"); setOpen(false); }}
            className={`block w-full text-right px-4 py-2 text-sm ${
              currentLang === "ar"
                ? "bg-red-50 text-red-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => { changeLanguage("tr"); setOpen(false); }}
            className={`block w-full text-left px-4 py-2 text-sm ${
              currentLang === "tr"
                ? "bg-red-50 text-red-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Türkçe
          </button>
          <button
            onClick={() => { changeLanguage("en"); setOpen(false); }}
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
    </>
  );
}

