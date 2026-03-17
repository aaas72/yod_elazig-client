import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getAboutCityData } from "@/i18n/get-data";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/Sections/PageHero";
import SectionTitle from "@/components/ui/Titles/SectionTitle";
import EngineCard from "@/components/ui/Cards/EngineCard";
import FestivalCard from "@/components/ui/Cards/FestivalCard";
import ProgramCard from "@/components/ui/Cards/ProgramCard";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import AboutCityClient from "./AboutCityClient";
import DishesCarousel from "./DishesCarousel";

interface AboutCityPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: AboutCityPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;
  const data = await getAboutCityData(locale);

  const descriptions: Record<Locale, string> = {
    ar: "تعرّف على مدينة إلازيغ التركية - تاريخها، معالمها، ثقافتها، وكل ما يحتاجه الطالب اليمني للحياة فيها.",
    en: "Discover the Turkish city of Elazig - its history, landmarks, culture, and everything a Yemeni student needs to know about living there.",
    tr: "Türk kenti Elazığ'ı keşfedin - tarihi, simgeleri, kültürü ve Yemenli bir öğrencinin orada yaşamak için bilmesi gereken her şey.",
  };
  return {
    title: (data as any).hero?.title || "عن المدينة",
    description: descriptions[locale],
    openGraph: {
      title: (data as any).hero?.title || "عن المدينة",
      description: descriptions[locale],
      url: `https://yodelazig.org/${locale}/about-city`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: (data as any).hero?.title || "عن المدينة", description: descriptions[locale], images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/about-city`,
      languages: { ar: "/ar/about-city", en: "/en/about-city", tr: "/tr/about-city" },
    },
  };
}

export default async function AboutCityPage({ params }: AboutCityPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const data = (await getAboutCityData(locale)) as any;

  return (
    <div className="min-h-screen">
      <PageHero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        imageUrl={data.hero.imageUrl}
        imageAlt={data.hero.imageAlt}
        breadcrumbs={data.hero.breadcrumbs}
        lang={locale}
      />

      {/* Intro Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up">
            <SectionTitle title={data.intro.title} className="text-red-800" />
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <div className="py-8 text-gray-700 text-justify text-md md:text-lg space-y-4 leading-relaxed">
              {data.intro.paragraphs.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Historical Landmarks */}
      <AboutCityClient
        historicalLandmarks={data.historicalLandmarks}
        historicalLandmarksTitle={data.historicalLandmarksTitle}
        historicalLandmarksTag={data.historicalLandmarksTag}
      />

      {/* Economic Engines */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="rtl:text-right ltr:text-left">
            <SectionTitle
              title={data.enginesTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.engines.map((engine: any) => (
              <StaggerItem key={engine.id}>
                <EngineCard title={engine.title}>
                  {engine.content.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </EngineCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Daily Life */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="rtl:text-right ltr:text-left">
            <SectionTitle
              title={data.dailyLife.title}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 rtl:pr-6 ltr:pl-6">
            <FadeIn direction="right" delay={0.2}>
              <div className="rtl:text-right ltr:text-left">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {data.dailyLife.modernLife.title}
                </h2>
                <div className="text-gray-700 leading-loose space-y-4">
                  {data.dailyLife.modernLife.paragraphs.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.2}>
              <div className="rtl:text-right ltr:text-left">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {data.dailyLife.traditionalLife.title}
                </h2>
                <div className="text-gray-700 leading-loose space-y-4">
                  {data.dailyLife.traditionalLife.paragraphs.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Festivals */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="rtl:text-right ltr:text-left">
            <SectionTitle
              title={data.festivalsTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.festivals.map((festival: any) => (
              <StaggerItem key={festival.id}>
                <FestivalCard
                  title={festival.title}
                  description={festival.description}
                  imageUrl={festival.imageUrl}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Activities */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="rtl:text-right ltr:text-left">
            <SectionTitle
              title={data.activitiesTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.activities.map((activity: any) => (
              <StaggerItem key={activity.id}>
                <ProgramCard
                  title={activity.title}
                  description={activity.description}
                  imageUrl={activity.imageUrl}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Dishes */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="rtl:text-right ltr:text-left">
            <SectionTitle
              title={data.dishesTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <DishesCarousel dishes={data.dishes} dishOfTheMonth={data.dishOfTheMonth} />
        </div>
      </section>
    </div>
  );
}
