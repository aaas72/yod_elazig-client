import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

const notFoundContent: Record<Locale, { title: string; message: string; buttonText: string }> = {
  ar: {
    title: "الصفحة غير موجودة",
    message: "عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.",
    buttonText: "العودة إلى الصفحة الرئيسية",
  },
  en: {
    title: "Page Not Found",
    message: "Sorry, we couldn't find the page you're looking for.",
    buttonText: "Back to Home",
  },
  tr: {
    title: "Sayfa Bulunamadı",
    message: "Üzgünüz, aradığınız sayfayı bulamadık.",
    buttonText: "Ana Sayfaya Dön",
  },
};

export default async function NotFound() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("referer") || "";

  // Extract locale from pathname
  let locale: Locale = defaultLocale;
  for (const l of locales) {
    if (pathname.includes(`/${l}/`) || pathname.endsWith(`/${l}`)) {
      locale = l;
      break;
    }
  }

  const content = notFoundContent[locale];
  const isRtl = locale === "ar";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <body>
        <div
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4"
        >
          <div className="text-center max-w-lg">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/imgs/logos/yodellogo.webp"
                alt="YOD Elazig"
                width={120}
                height={120}
                className="mx-auto opacity-80"
              />
            </div>

            {/* 404 Number */}
            <div className="relative">
              <h1 className="text-[150px] md:text-[200px] font-black text-red-700/10 leading-none select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl md:text-8xl font-bold text-red-700">404</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
              {content.title}
            </h2>

            {/* Message */}
            <p className="text-gray-600 mt-3 mb-8 text-lg">
              {content.message}
            </p>

            {/* Back Button */}
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 bg-red-700 text-white px-8 py-3.5 rounded-full font-bold hover:bg-red-800 transition-all duration-300 hover:shadow-lg hover:shadow-red-700/25 hover:-translate-y-0.5"
            >
              {isRtl ? (
                <>
                  {content.buttonText}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {content.buttonText}
                </>
              )}
            </Link>

            {/* Decorative Elements */}
            <div className="mt-16 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-700/30"></div>
              <div className="w-2 h-2 rounded-full bg-red-700/50"></div>
              <div className="w-2 h-2 rounded-full bg-red-700/30"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
