import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getNews, getEvents, getPrograms, getGallery } from "@/lib/api";
import { getHomeData } from "@/i18n/get-data";
import {
  GraduationCap,
  CalendarCheck,
  Users,
  FileSignature,
  Handshake,
} from "lucide-react";
import HeroSection from "@/components/ui/Sections/HeroSection";
import NewsSection from "@/components/ui/Sections/NewsSection";
import EventsSection from "@/components/ui/Sections/EventsSection";
import PhotoGallerySection from "@/components/ui/Sections/PhotoGallerySection";
import ProgramsSection from "@/components/ui/Sections/ProgramsSection";
import StatsSection from "@/components/ui/Sections/StatsSection";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;

  const titles: Record<Locale, string> = {
    ar: "اتحاد الطلاب اليمنيين في تركيا - فرع إلازيغ",
    en: "Yemen Students Union in Turkey - Elazig Branch",
    tr: "Türkiye'deki Yemenli Öğrenciler Birliği - Elazığ Şubesi",
  };
  const descriptions: Record<Locale, string> = {
    ar: "الموقع الرسمي لاتحاد الطلاب اليمنيين في تركيا فرع إلازيغ. نقدم الدعم والمساعدة للطلاب اليمنيين.",
    en: "Official website of the Yemen Students Union in Turkey, Elazig Branch. We provide support and assistance to Yemeni students.",
    tr: "Türkiye'deki Yemenli Öğrenciler Birliği - Elazığ Şubesi resmi web sitesi. Yemenli öğrencilere destek ve yardım sağlıyoruz.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", tr: "/tr" },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      images: ["/imgs/logos/yodellogo.webp"],
    },
  };
}

export const revalidate = 60;

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-10 w-10 text-[#BE141B]" />,
  CalendarCheck: <CalendarCheck className="h-10 w-10 text-[#BE141B]" />,
  Users: <Users className="h-10 w-10 text-[#BE141B]" />,
  FileSignature: <FileSignature className="h-10 w-10 text-[#BE141B]" />,
  Handshake: <Handshake className="h-10 w-10 text-[#BE141B]" />,
};

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const locale = lang as Locale;

  const homeData = await getHomeData(locale);
  let news: Awaited<ReturnType<typeof getNews>> = [];
  let events: Awaited<ReturnType<typeof getEvents>> = [];
  let programs: Awaited<ReturnType<typeof getPrograms>> = [];
  let galleryImages: string[] = [];

  try { news = await getNews(locale, 8); } catch {}
  try { events = await getEvents(locale, 6); } catch {}
  try { programs = await getPrograms(locale); } catch {}
  try {
    const albums = await getGallery(locale);
    // Extract images from all albums
    galleryImages = albums.flatMap(album =>
      album.photos.map(photo => photo.url)
    );
    // fallback to cover images if no photos
    if (galleryImages.length === 0) {
      galleryImages = albums.filter(a => a.coverImage).map(a => a.coverImage!);
    }
  } catch {}

  const unionStats = homeData.stats.map((item) => ({
    ...item,
    icon: iconMap[item.icon as string] || null,
  }));

  return (
    <div>
      <HeroSection lang={locale} />
      <NewsSection news={news} lang={locale} />
      <EventsSection events={events} lang={locale} />
      <PhotoGallerySection images={galleryImages} lang={locale} />
      <ProgramsSection programs={programs as any} lang={locale} />
      <StatsSection title={homeData.sections.stats.title} stats={unionStats} />
    </div>
  );
}
