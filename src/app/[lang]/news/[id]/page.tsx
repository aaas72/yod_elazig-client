import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import { getNewsBySlug, getNewsById, resolveImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/ui/Layouts/ArticleLayout";

interface NewsDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;

  let news = await getNewsBySlug(id, locale);
  if (!news) {
    news = await getNewsById(id, locale);
  }

  if (!news) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  const title = news.translations?.[locale]?.title || news.title;
  const summary = news.translations?.[locale]?.summary || news.summary;

  return {
    title,
    description: summary?.slice(0, 160),
    openGraph: {
      title,
      description: summary,
      images: news.coverImage ? [resolveImageUrl(news.coverImage)] : [],
    },
    alternates: {
      canonical: `/${locale}/news/${id}`,
      languages: {
        ar: `/ar/news/${id}`,
        en: `/en/news/${id}`,
        tr: `/tr/news/${id}`,
      },
    },
  };
}

export const revalidate = 60;

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { lang, id } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;

  let news = await getNewsBySlug(id, locale);
  if (!news) {
    news = await getNewsById(id, locale);
  }

  if (!news) {
    notFound();
  }

  // Get translated content
  const title = news.translations?.[locale]?.title || news.title;
  const content = news.translations?.[locale]?.content || news.content;
  const category = news.translations?.[locale]?.category || news.category || "";
  const rawTags = news.translations?.[locale]?.tags;
  const tags: string[] = rawTags
    ? typeof rawTags === "string"
      ? rawTags.split(",").map((x: string) => x.trim())
      : rawTags
    : news.tags || [];

  // Author and date
  const author = news.author?.name || "";
  const date = news.publishDate || news.createdAt;

  // Breadcrumbs
  const breadcrumbLabels = {
    ar: { home: "الرئيسية", news: "الأخبار" },
    en: { home: "Home", news: "News" },
    tr: { home: "Ana Sayfa", news: "Haberler" },
  };
  const t = breadcrumbLabels[locale];

  const breadcrumbs = [
    { name: t.home, href: `/${locale}` },
    { name: t.news, href: `/${locale}/news` },
    { name: title, href: `/${locale}/news/${id}` },
  ];

  return (
    <ArticleLayout
      title={title}
      coverImage={news.coverImage || ""}
      breadcrumbs={breadcrumbs}
      author={author}
      date={date}
      locale={locale}
    >
      {/* Content */}
      <div
        className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: content || "",
        }}
      />

      {/* Tags and Category */}
      {(category || tags.length > 0) && (
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-3">
          {category && (
            <span
              className="text-sm text-gray-500 break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {category}
            </span>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="text-sm text-red-600 break-words"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </ArticleLayout>
  );
}
