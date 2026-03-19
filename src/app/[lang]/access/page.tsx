import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getAccessData } from "@/i18n/get-data";
import { notFound } from "next/navigation";
import FadeIn from "@/components/animations/FadeIn";

interface AccessPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: AccessPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;

  const titles: Record<Locale, string> = {
    ar: "الوصول إلى الأرشيف",
    en: "Archive Access",
    tr: "Arşiv Erişimi",
  };

  return {
    title: titles[locale],
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/access`,
      languages: { ar: "/ar/access", en: "/en/access", tr: "/tr/access" },
    },
  };
}

const archiveUrl =
  process.env.NEXT_PUBLIC_ARCHIVE_URL ||
  "https://drive.google.com/drive/folders/1A2w2eizUn1x1zu7dJ_ZEJO1F-ldornG3";

const allowedDomain = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "yodelazig.com";

export default async function AccessPage({ params }: AccessPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const accessData = (await getAccessData(locale)) as any;

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-red-900 via-red-800 to-red-900 text-white">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <FadeIn direction="up" className="w-full max-w-5xl">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex justify-center md:justify-start">
              <img
                src={accessData.logo.src}
                alt={accessData.logo.alt}
                width={300}
                height={150}
                className="block w-full max-w-[250px] md:max-w-md h-auto object-contain"
              />
            </div>
            <div className="text-center md:text-start">
              <h1 className="text-2xl md:text-3xl font-bold leading-none">
                {accessData.title}
              </h1>
              <p className="text-base md:text-lg text-white/80 mt-3 mb-6">
                {accessData.description}
              </p>

              <div className="text-sm text-white/80 mb-8">
                {accessData.domainNote.text}
                <span className="mx-2 inline-block px-3 py-1 rounded-full bg-white/10 text-white text-sm font-semibold">
                  {accessData.domainNote.prefix}
                  {allowedDomain}
                </span>
              </div>

              <a
                href={archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-full bg-white text-red-900 font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                {accessData.buttonText}
              </a>

              <p className="mt-8 text-sm text-white/60">
                {accessData.footerNote}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
