import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getEventsPageData } from "@/i18n/get-data";
import { getEvents } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import ProgramCard from "@/components/ui/Cards/ProgramCard";

interface EventsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: EventsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;
  const content: Record<Locale, { title: string; description: string }> = {
    ar: { title: "الفعاليات", description: "تصفح جميع فعاليات وأنشطة اتحاد الطلاب اليمنيين في إلازيغ - ورش عمل، احتفالات، ومناسبات ثقافية." },
    en: { title: "Events", description: "Browse all events and activities of the Yemeni Students Union in Elazig - workshops, celebrations, and cultural events." },
    tr: { title: "Etkinlikler", description: "Elazığ'daki Yemenli Öğrenciler Birliği'nin tüm etkinliklerini inceleyin - atölyeler, kutlamalar ve kültürel etkinlikler." },
  };
  const { title, description } = content[locale];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://yodelazig.org/${locale}/events`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/events`,
      languages: { ar: "/ar/events", en: "/en/events", tr: "/tr/events" },
    },
  };
}

export const revalidate = 60;

export default async function EventsPage({ params }: EventsPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;

  let events: Awaited<ReturnType<typeof getEvents>> = [];
  try {
    events = await getEvents(locale);
  } catch {}

  const pageData = await getEventsPageData(locale);

  const sortedEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.eventDate || b.createdAt).getTime() -
        new Date(a.eventDate || a.createdAt).getTime()
    )
    .map((event) => ({
      ...event,
      title: event.translations?.[locale]?.title || event.title,
      location: event.location || "",
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
          {sortedEvents.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">
                {locale === "ar"
                  ? "لا توجد فعاليات حالياً"
                  : locale === "tr"
                  ? "Şu anda etkinlik bulunmuyor"
                  : "No events available"}
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event) => (
                <StaggerItem key={event.slug || event._id}>
                  <Link href={`/${locale}/events/${event.slug || event._id}`}>
                    <ProgramCard
                      title={event.title}
                      date={event.eventDate}
                      description={event.location}
                      imageUrl={event.coverImage}
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}
