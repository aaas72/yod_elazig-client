import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import { getProgramBySlug, resolveImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/ui/Layouts/ArticleLayout";

interface ProgramDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
}

// Helper to get translated text from multilingual field
function getTranslatedText(
  field: string | Record<string, string> | undefined,
  locale: Locale
): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] || field.ar || Object.values(field)[0] || "";
}

export async function generateMetadata({
  params,
}: ProgramDetailPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;

  const program = await getProgramBySlug(id, locale);

  if (!program) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  const title = getTranslatedText(program.title, locale);
  const description = getTranslatedText(program.description, locale);

  return {
    title,
    description: description?.slice(0, 160),
    openGraph: {
      title,
      description,
      images: program.coverImage ? [resolveImageUrl(program.coverImage)] : [],
    },
    alternates: {
      canonical: `/${locale}/programs/${id}`,
      languages: {
        ar: `/ar/programs/${id}`,
        en: `/en/programs/${id}`,
        tr: `/tr/programs/${id}`,
      },
    },
  };
}

export const revalidate = 60;

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { lang, id } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;

  const program = await getProgramBySlug(id, locale);

  if (!program) {
    notFound();
  }

  // Get translated content
  const title = getTranslatedText(program.title, locale);
  const description = getTranslatedText(program.description, locale);

  // Direction based on language
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Labels
  const detailLabels = {
    ar: {
      home: "الرئيسية",
      programs: "برامجنا",
      location: "الموقع:",
      category: "التصنيف:",
      startDate: "تاريخ البدء:",
      endDate: "تاريخ الانتهاء:",
    },
    en: {
      home: "Home",
      programs: "Programs",
      location: "Location:",
      category: "Category:",
      startDate: "Start Date:",
      endDate: "End Date:",
    },
    tr: {
      home: "Ana Sayfa",
      programs: "Programlarımız",
      location: "Konum:",
      category: "Kategori:",
      startDate: "Başlangıç Tarihi:",
      endDate: "Bitiş Tarihi:",
    },
  };

  const t = detailLabels[locale];

  // Breadcrumbs
  const breadcrumbs = [
    { name: t.home, href: `/${locale}` },
    { name: t.programs, href: `/${locale}/programs` },
    { name: title, href: `/${locale}/programs/${id}` },
  ];

  return (
    <ArticleLayout
      title={title}
      coverImage={resolveImageUrl(program.coverImage)}
      breadcrumbs={breadcrumbs}
      date={program.startDate}
      locale={locale}
    >
      {/* Description/Content */}
      <div
        dir={dir}
        dangerouslySetInnerHTML={{ __html: description }}
        className={`prose text-sm sm:text-base md:prose-base lg:prose-lg max-w-none text-gray-800 text-justify prose-headings:text-neutral-900 prose-p:text-neutral-800 prose-p:leading-relaxed ${dir === "rtl" ? "rtl" : "ltr"} wrap-break-word`}
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
        }}
      />

      {/* Program Details */}
      <div className="mt-8 pt-6 border-t border-gray-200" dir={dir}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          {program.location && (
            <div
              className="wrap-break-word"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              <span className="font-bold text-gray-900">{t.location}</span>{" "}
              {program.location}
            </div>
          )}
          {program.category && (
            <div
              className="wrap-break-word"
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              <span className="font-bold text-gray-900">{t.category}</span>{" "}
              {program.category}
            </div>
          )}
          {(program.startDate || program.endDate) && (
            <div className="md:col-span-2 flex flex-wrap gap-6">
              {program.startDate && (
                <span>
                  <span className="font-bold text-gray-900">{t.startDate}</span>{" "}
                  {new Date(program.startDate).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : "en-US"
                  )}
                </span>
              )}
              {program.endDate && (
                <span>
                  <span className="font-bold text-gray-900">{t.endDate}</span>{" "}
                  {new Date(program.endDate).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : "en-US"
                  )}
                </span>
              )}
            </div>
          )}
        </div>
        {/* Tags */}
        {program.tags && program.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {(Array.isArray(program.tags) ? program.tags : [program.tags]).map(
              (tag: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full wrap-break-word"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  #{tag}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </ArticleLayout>
  );
}
