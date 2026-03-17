import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { locales, getDirection, isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Sections/FooterSection";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

const localeLabels: Record<Locale, { og: string; name: string }> = {
  ar: { og: "ar_YE", name: "العربية" },
  en: { og: "en_US", name: "English" },
  tr: { og: "tr_TR", name: "Türkçe" },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;
  const { og } = localeLabels[locale];

  return {
    openGraph: {
      locale: og,
      alternateLocale: (Object.values(localeLabels)
        .map((l) => l.og)
        .filter((l) => l !== og)) as string[],
    },
    alternates: {
      languages: {
        ar: `/ar`,
        en: `/en`,
        tr: `/tr`,
        "x-default": `/ar`,
      },
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const direction = getDirection(locale);
  const dictionary = await getDictionary(locale);

  return (
    <div lang={locale} dir={direction} className="flex flex-col min-h-screen">
      <NavBar lang={locale} dictionary={dictionary} />
      <main className="grow">{children}</main>
      <Footer lang={locale} dictionary={dictionary} />
    </div>
  );
}
