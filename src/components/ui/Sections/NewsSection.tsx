"use client";

import SectionTitle from "@/components/ui/Titles/SectionTitle";
import NewsGrid from "@/components/ui/Cards/NewsCardGrid";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/animations/FadeIn";

interface NewsItem {
  _id: string;
  slug?: string;
  title: string;
  coverImage?: string;
  publishDate?: string;
  createdAt?: string;
  translations?: {
    ar?: { title?: string; summary?: string; content?: string };
    en?: { title?: string; summary?: string; content?: string };
    tr?: { title?: string; summary?: string; content?: string };
  };
}

interface NewsSectionProps {
  news: NewsItem[];
  lang: string;
}

const labels: Record<string, { title: string; more: string }> = {
  ar: { title: "أحدث الأخبار", more: "عرض كل الأخبار" },
  en: { title: "Latest News", more: "View All News" },
  tr: { title: "Son Haberler", more: "Tüm Haberleri Görüntüle" },
};

export default function NewsSection({ news, lang }: NewsSectionProps) {
  const t = labels[lang] || labels.ar;

  const newsItems = news.slice(0, 8).map((item) => {
    // Extract title based on language, with fallback to main title (Arabic)
    let title = item.title; // Default Arabic title
    if (item.translations?.[lang as keyof typeof item.translations]?.title) {
      title = item.translations[lang as keyof typeof item.translations]!.title!;
    }

    return {
      id: item.slug || item._id,
      title,
      date: item.publishDate || item.createdAt || "",
      time: "",
      image: item.coverImage || "",
    };
  });

  return (
    <section className="w-full bg-linear-to-b from-[#1E1E1E] to-[#383838] py-22 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-16">
          <FadeIn direction="up">
            <SectionTitle
              title={t.title}
              className="text-primary font-bold text-xl md:text-2xl text-white"
            />
          </FadeIn>
        </div>

        <NewsGrid newsItems={newsItems} basePath={`/${lang}/news`} />

        <FadeIn direction="up" delay={0.4}>
          <Button
            href={`/${lang}/news`}
            className="mt-20 w-fit text-sm border text-white border-white mx-auto hover:bg-white hover:text-gray-900 bg-transparent"
            variant="secondary"
          >
            {t.more}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
