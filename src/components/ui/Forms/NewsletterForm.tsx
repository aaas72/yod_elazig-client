"use client";

import { useState } from "react";

interface NewsletterFormProps {
  lang?: string;
}

const labels: Record<string, { placeholder: string; submit: string; success: string }> = {
  ar: { placeholder: "ادخل بريدك الإلكتروني", submit: "اشتراك", success: "تم الاشتراك بنجاح!" },
  en: { placeholder: "Enter your email", submit: "Subscribe", success: "Successfully subscribed!" },
  tr: { placeholder: "E-posta adresinizi girin", submit: "Abone Ol", success: "Başarıyla abone olundu!" },
};

export default function NewsletterForm({ lang = "ar" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const t = labels[lang] || labels.ar;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2" dir={lang === "ar" ? "rtl" : "ltr"}>
      {success ? (
        <p className="text-green-400 text-sm">{t.success}</p>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label={t.submit}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </>
      )}
    </form>
  );
}
