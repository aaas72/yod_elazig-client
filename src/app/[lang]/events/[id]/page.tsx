import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import { getEventBySlug, resolveImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/ui/Layouts/ArticleLayout";

interface EventDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;

  const event = await getEventBySlug(id, locale);

  if (!event) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  const title = event.translations?.[locale]?.title || event.title;
  const summary = event.translations?.[locale]?.summary || event.summary;

  return {
    title,
    description: summary?.slice(0, 160),
    openGraph: {
      title,
      description: summary,
      images: event.coverImage ? [resolveImageUrl(event.coverImage)] : [],
    },
    alternates: {
      canonical: `/${locale}/events/${id}`,
      languages: {
        ar: `/ar/events/${id}`,
        en: `/en/events/${id}`,
        tr: `/tr/events/${id}`,
      },
    },
  };
}

export const revalidate = 60;

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { lang, id } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;

  const event = await getEventBySlug(id, locale);

  if (!event) {
    notFound();
  }

  // Get translated content
  const title = event.translations?.[locale]?.title || event.title;
  const description =
    event.translations?.[locale]?.description ||
    event.translations?.[locale]?.content ||
    event.description ||
    event.content ||
    "";
  const location = event.translations?.[locale]?.location || event.location || "";
  const rawTags = event.translations?.[locale]?.tags;
  const tags: string[] = rawTags
    ? typeof rawTags === "string"
      ? rawTags.split(",").map((x: string) => x.trim())
      : rawTags
    : event.tags || [];

  // Author and date
  const author = event.author?.name || "";
  const date = event.startDate || event.eventDate || event.date || event.createdAt;

  // Labels
  const detailLabels = {
    ar: {
      home: "الرئيسية",
      events: "الفعاليات",
      location: "المكان",
      category: "التصنيف",
      capacity: "السعة",
      date: "تاريخ",
      featured: "مميز",
      yes: "نعم",
    },
    en: {
      home: "Home",
      events: "Events",
      location: "Location",
      category: "Category",
      capacity: "Capacity",
      date: "Date",
      featured: "Featured",
      yes: "Yes",
    },
    tr: {
      home: "Ana Sayfa",
      events: "Etkinlikler",
      location: "Konum",
      category: "Kategori",
      capacity: "Kapasite",
      date: "Tarih",
      featured: "Öne Çıkan",
      yes: "Evet",
    },
  };

  const t = detailLabels[locale];

  // Breadcrumbs
  const breadcrumbs = [
    { name: t.home, href: `/${locale}` },
    { name: t.events, href: `/${locale}/events` },
    { name: title, href: `/${locale}/events/${id}` },
  ];

  // Format date for detail section
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
    } catch {}
    return dateStr;
  };

  return (
    <ArticleLayout
      title={title}
      coverImage={event.coverImage || ""}
      breadcrumbs={breadcrumbs}
      author={author}
      date={date}
      locale={locale}
    >
      {/* Description/Content */}
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-gray-800 text-justify prose-headings:text-neutral-900 prose-p:text-neutral-800 prose-p:leading-relaxed break-words"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
        }}
      />

      {/* Event Details */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          {location && (
            <div
              className="break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              <span className="font-bold text-gray-900">{t.location}:</span>{" "}
              {location}
            </div>
          )}
          {event.category && (
            <div
              className="break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              <span className="font-bold text-gray-900">{t.category}:</span>{" "}
              {event.category}
            </div>
          )}
          {event.capacity && (
            <div
              className="break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              <span className="font-bold text-gray-900">{t.capacity}:</span>{" "}
              {event.capacity}
            </div>
          )}
          {(event.startDate || event.eventDate) && (
            <div
              className="break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              <span className="font-bold text-gray-900">{t.date}:</span>{" "}
              {formatDate(event.startDate || event.eventDate || "")}
            </div>
          )}
          {event.isFeatured && (
            <div
              className="break-words"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              <span className="font-bold text-gray-900">{t.featured}:</span>{" "}
              <span className="text-green-600">{t.yes}</span>
            </div>
          )}
        </div>
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full break-words"
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
    </ArticleLayout>
  );
}
