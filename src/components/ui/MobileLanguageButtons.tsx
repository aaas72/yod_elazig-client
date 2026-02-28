import { useTranslation } from "react-i18next";
import React, { useState } from "react";

export default function MobileLanguageButtons() {
  const { i18n } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);
  const langs = ["ar", "tr", "en"];

  const changeLanguage = async (lng: string) => {
    if (lng === i18n.language) return;
    setIsChanging(true);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
    await i18n.changeLanguage(lng);
    setTimeout(() => setIsChanging(false), 500);
  };

  return (
    <div className="flex gap-2 justify-center">
      {langs.map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`px-3 py-1 rounded-full text-sm font-bold uppercase transition-all focus:outline-none ${
            i18n.language === lng
              ? "text-white"
              : "text-white/60"
          }`}
          style={{ background: 'none', border: 'none' }}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}