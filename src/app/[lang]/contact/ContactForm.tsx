"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";

interface ContactInfoProps {
  lang: Locale;
}

const contactInfo = {
  ar: {
    title: "تواصل معنا",
    email: "البريد الإلكتروني",
    phone: "رقم الواتساب",
    copied: "تم النسخ!",
  },
  en: {
    title: "Contact Us",
    email: "Email",
    phone: "WhatsApp",
    copied: "Copied!",
  },
  tr: {
    title: "Bize Ulaşın",
    email: "E-posta",
    phone: "WhatsApp",
    copied: "Kopyalandı!",
  },
};

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "yodelazig.union@gmail.com";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905075555555";

export default function ContactForm({ lang }: ContactInfoProps) {
  const labels = contactInfo[lang];
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = (text: string, isEmail: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEmail) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">{labels.title}</h2>

      {/* Email Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📧</span>
          {labels.email}
        </h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-2">{CONTACT_EMAIL}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-block text-red-700 hover:text-red-800 font-medium transition-colors"
            >
              ✉️ {lang === "ar" ? "أرسل بريده" : lang === "tr" ? "E-mail Gönder" : "Send Email"}
            </a>
          </div>
          <button
            onClick={() => copyToClipboard(CONTACT_EMAIL, true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              copiedEmail
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {copiedEmail ? "✓ " + labels.copied : "📋 Copy"}
          </button>
        </div>
      </div>

      {/* WhatsApp Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          {labels.phone}
        </h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-2">+{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2)}</p>
            <button
              onClick={openWhatsApp}
              className="inline-block text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              💬 {lang === "ar" ? "فتح الواتساب" : lang === "tr" ? "WhatsApp'ı Aç" : "Open WhatsApp"}
            </button>
          </div>
          <button
            onClick={() => copyToClipboard(WHATSAPP_NUMBER, false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              copiedPhone
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {copiedPhone ? "✓ " + labels.copied : "📋 Copy"}
          </button>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-800 text-sm">
          {lang === "ar"
            ? "يمكنك التواصل معنا من خلال البريد الإلكتروني أو الواتساب. نحن هنا لمساعدتك!"
            : lang === "tr"
            ? "E-posta veya WhatsApp aracılığıyla bize ulaşabilirsiniz. Yardımcı olmak için buradayız!"
            : "You can reach us via email or WhatsApp. We're here to help!"}
        </p>
      </div>
    </div>
  );
}
