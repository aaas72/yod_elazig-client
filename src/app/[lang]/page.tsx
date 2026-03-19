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
    ar: "اتحاد الطلاب اليمنيين في تركيا فرع إلازيغ - منظمة طلابية تخدم الطلاب اليمنيين في جامعة الفرات وجامعات إلازيغ. نقدم الدعم الأكاديمي، المساعدات المالية، الأنشطة الثقافية، والبرامج التعليمية. انضم إلى أكثر من 500 طالب يمني في تركيا.",
    en: "Yemen Students Union Turkey - Elazig Branch serves over 500 Yemeni students at Firat University and Elazig universities. We provide academic support, financial aid, cultural activities, educational programs, and community services for Yemeni students studying in Turkey.",
    tr: "Türkiye Yemenli Öğrenciler Birliği - Elazığ Şubesi, Fırat Üniversitesi ve Elazığ üniversitelerinde öğrenim gören 500'den fazla Yemenli öğrenciye hizmet vermektedir. Akademik destek, mali yardım, kültürel etkinlikler ve eğitim programları sunuyoruz.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    keywords: locale === "ar" ? [
      "اتحاد الطلاب اليمنيين في تركيا",
      "طلاب يمنيين إلازيغ",
      "جامعة الفرات اليمنيين",
      "YOD Elazig",
      "الطلاب اليمنيين تركيا",
      "اتحاد طلابي إلازيغ",
      "دعم الطلاب اليمنيين",
      "أنشطة طلابية إلازيغ",
      "مساعدات مالية طلاب",
      "Firat University Yemeni",
      "Yemen students Turkey"
    ] : locale === "en" ? [
      "Yemen Students Union Turkey",
      "Yemeni students Elazig",
      "Firat University Yemen",
      "YOD Elazig union",
      "Yemen Turkey students",
      "student organization Elazig",
      "Yemeni student support",
      "academic assistance Yemen",
      "cultural activities Elazig",
      "financial aid students"
    ] : [
      "Türkiye Yemenli öğrenciler",
      "Elazığ Yemen öğrencileri",
      "Fırat Üniversitesi Yemen",
      "YOD Elazığ birliği",
      "öğrenci organizasyonu Elazığ",
      "Yemenli öğrenci desteği",
      "akademik yardım Yemen",
      "kültürel etkinlikler Elazığ",
      "mali destek öğrenciler"
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", tr: "/tr" },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      images: ["/imgs/logos/yodellogo.webp"],
      url: `https://yodelazig.org/${locale}`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": locale === "ar" ? "اتحاد الطلاب اليمنيين في تركيا - فرع إلازيغ" :
           locale === "en" ? "Yemen Students Union in Turkey - Elazig Branch" :
           "Türkiye'deki Yemenli Öğrenciler Birliği - Elazığ Şubesi",
    "url": `https://yodelazig.org/${locale}`,
    "logo": {
      "@type": "ImageObject",
      "url": "https://yodelazig.org/imgs/logos/yodellogo.webp"
    },
    "description": locale === "ar" ? "منظمة طلابية تخدم الطلاب اليمنيين في جامعة الفرات وإلازيغ" :
                   locale === "en" ? "Student organization serving Yemeni students at Firat University and Elazig" :
                   "Fırat Üniversitesi ve Elazığ'daki Yemenli öğrencilere hizmet eden öğrenci organizasyonu",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Elazig",
      "addressCountry": "TR"
    },
    "foundingDate": "2018",
    "memberOf": {
      "@type": "Organization",
      "name": locale === "ar" ? "اتحاد الطلاب اليمنيين في تركيا" :
             locale === "en" ? "Yemen Students Union in Turkey" :
             "Türkiye Yemenli Öğrenciler Birliği"
    },
    "offers": {
      "@type": "Service",
      "serviceType": locale === "ar" ? "خدمات طلابية" :
                    locale === "en" ? "Student Services" :
                    "Öğrenci Hizmetleri",
      "description": locale === "ar" ? "دعم أكاديمي ومالي وثقافي للطلاب" :
                     locale === "en" ? "Academic, financial and cultural support for students" :
                     "Öğrenciler için akademik, mali ve kültürel destek"
    }
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection lang={locale} />
      <NewsSection news={news} lang={locale} />
      <EventsSection events={events} lang={locale} />
      <PhotoGallerySection images={galleryImages} lang={locale} />
      <ProgramsSection programs={programs as any} lang={locale} />
      <StatsSection title={homeData.sections.stats.title} stats={unionStats} />
    </div>
  );
}
