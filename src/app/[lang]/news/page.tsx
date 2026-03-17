import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getNewsPageData } from "@/i18n/get-data";
import { getNews } from "@/lib/api";
import { notFound } from "next/navigation";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import NewsGrid from "@/components/ui/Cards/NewsCardGrid";

interface NewsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;

  const titles: Record<Locale, string> = {
    ar: "الأخبار",
    en: "News",
    tr: "Haberler",
  };

  const descriptions: Record<Locale, string> = {
    ar: "آخر أخبار اتحاد الطلاب اليمنيين في تركيا فرع إلازيغ",
    en: "Latest news from Yemen Students Union in Turkey - Elazig Branch",
    tr: "Türkiye'deki Yemenli Öğrenciler Birliği - Elazığ Şubesi'nden son haberler",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/news`,
      languages: {
        ar: "/ar/news",
        en: "/en/news",
        tr: "/tr/news",
      },
    },
  };
}

export const revalidate = 60;

export default async function NewsPage({ params }: NewsPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;

  let news: Awaited<ReturnType<typeof getNews>> = [];
  try {
    news = await getNews(locale);
  } catch {}

  const pageData = await getNewsPageData(locale);

  const sortedNews = [...news]
    .sort((a, b) => {
      const dateA = new Date(a.publishDate || a.createdAt).getTime();
      const dateB = new Date(b.publishDate || b.createdAt).getTime();
      return dateB - dateA;
    })
    .map((item) => ({
      id: item.slug || item._id,
      title: item.translations?.[locale]?.title || item.title,
      date: item.publishDate || item.createdAt,
      time: "",
      image: item.coverImage || "",
    }));

  return (
    <div>
      <SimplePageHero
        title={pageData.hero.title}
        breadcrumbs={pageData.hero.breadcrumbs}
        lang={locale}
      />
      <section className="md:p-12 p-6">
        <div className="max-w-6xl mx-auto">
          {sortedNews.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">
                {locale === "ar"
                  ? "لا توجد أخبار حالياً"
                  : locale === "tr"
                  ? "Şu anda haber bulunmuyor"
                  : "No news available"}
              </p>
            </div>
          ) : (
            <NewsGrid newsItems={sortedNews} basePath={`/${locale}/news`} />
          )}
        </div>
      </section>
    </div>
  );
}
