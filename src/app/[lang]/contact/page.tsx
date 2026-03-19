import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getContactData } from "@/i18n/get-data";
import { notFound } from "next/navigation";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import FadeIn from "@/components/animations/FadeIn";
import ContactForm from "./ContactForm";

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;
  const titles: Record<Locale, string> = {
    ar: "تواصل معنا",
    en: "Contact Us",
    tr: "İletişim",
  };

  const descriptions: Record<Locale, string> = {
    ar: "تواصل مع اتحاد الطلاب اليمنيين في إلازيغ - راسلنا عبر البريد الإلكتروني أو واتساب وسنرد عليك في أقرب وقت.",
    en: "Contact the Yemeni Students Union in Elazig - reach us via email or WhatsApp and we'll respond as soon as possible.",
    tr: "Elazığ'daki Yemenli Öğrenciler Birliği ile iletişime geçin - e-posta veya WhatsApp aracılığıyla bize ulaşın.",
  };
  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `https://yodelazig.org/${locale}/contact`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: titles[locale], description: descriptions[locale], images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { ar: "/ar/contact", en: "/en/contact", tr: "/tr/contact" },
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const contactData = await getContactData(locale);

  // Fetch settings from API
  let contactEmail = "";
  let contactPhone = "";

  try {
    const apiBaseUrl = process.env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:5000/api/v1';
    const response = await fetch(`${apiBaseUrl}/settings`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const data = await response.json();
      const settings = data?.data?.settings;
      if (settings?.contactInfo) {
        contactEmail = settings.contactInfo.email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
        contactPhone = settings.contactInfo.phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
      }
    }
  } catch (error) {
    console.error("Failed to fetch contact settings:", error);
    // Use fallback values from env
    contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
    contactPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  }

  // If still empty, use env variables
  if (!contactEmail) contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  if (!contactPhone) contactPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const breadcrumbs = [
    { label: locale === "ar" ? "الرئيسية" : locale === "tr" ? "Ana Sayfa" : "Home", href: "/" },
    { label: contactData.hero.title },
  ];

  // Clean and format email and phone
  const cleanEmail = contactEmail.trim().toLowerCase();
  const phoneNumber = contactPhone.replace(/[^0-9+]/g, "");
  const whatsappNumber = phoneNumber.startsWith("+") ? phoneNumber.slice(1) : phoneNumber;

  return (
    <div>
      <SimplePageHero
        title={contactData.hero.title}
        breadcrumbs={breadcrumbs}
        lang={locale}
      />

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" delay={0.2}>
            <div className="max-w-3xl mx-auto p-10 relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                {contactData.options?.description && (
                  <div className="text-center mb-10">
                    <p className="text-gray-600">
                      {contactData.options.description}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email Option */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-red-200 transition duration-300">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                        <Mail size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {contactData.form?.fields?.email?.label || (locale === "ar" ? "البريد الإلكتروني" : "Email")}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 break-all">
                          {cleanEmail || (locale === "ar" ? "استخدم النموذج أدناه" : "Use the form below")}
                        </p>
                        <a
                          href={`https://mail.google.com/mail/?to=${contactEmail}&subject=${locale === "ar" ? "رسالة%20من%20الموقع" : locale === "tr" ? "Web%20Sitesinden%20Mesaj" : "Message%20from%20Website"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-red-900 text-white rounded-xl font-medium hover:bg-red-800 transition duration-300"
                        >
                          {contactData.options?.emailButton || (locale === "ar" ? "إرسال بريد إلكتروني" : locale === "tr" ? "E-posta Gönder" : "Send Email")}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Option */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-green-200 transition duration-300">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                        <FaWhatsapp size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {contactData.options?.whatsappLabel || "WhatsApp"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4" dir="ltr">
                          {contactPhone}
                        </p>
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition duration-300"
                        >
                          <FaWhatsapp size={18} className="me-2" />
                          <span>{contactData.options?.whatsappButton || (locale === "ar" ? "تواصل عبر واتساب" : locale === "tr" ? "WhatsApp ile İletişim" : "Contact via WhatsApp")}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact Form Section - Additional Contact Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn direction="up" delay={0.3}>
            <ContactForm lang={locale} />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
