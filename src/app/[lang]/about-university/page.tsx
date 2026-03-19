import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getAboutUniversityData } from "@/i18n/get-data";
import { notFound } from "next/navigation";
import {
  Calendar, Users, Building, BookOpen, Stethoscope, DraftingCompass,
  FlaskConical, Landmark, Mic2, School, Trophy, Cpu, Ruler, Smile,
  HeartPulse, Dog, Fish,
} from "lucide-react";
import PageHero from "@/components/ui/Sections/PageHero";
import SectionTitle from "@/components/ui/Titles/SectionTitle";
import StatsSection from "@/components/ui/Sections/StatsSection";
import FacultyCard from "@/components/ui/Cards/FacultyCard";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";

interface AboutUniversityPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: AboutUniversityPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;
  const data = await getAboutUniversityData(locale);

  const descriptions: Record<Locale, string> = {
    ar: "تعرّف على جامعة الفرات في إلازيغ - أقسامها، كلياتها، المرافق المتاحة، وكل ما يحتاجه الطالب اليمني عن مقر دراسته.",
    en: "Learn about Fırat University in Elazig - its departments, faculties, available facilities, and everything a Yemeni student needs about their university.",
    tr: "Elazığ'daki Fırat Üniversitesi hakkında bilgi edinin - bölümleri, fakülteleri, mevcut tesisler ve Yemenli bir öğrencinin üniversite hakkında bilmesi gerekenler.",
  };
  return {
    title: (data as any).hero?.title || "عن الجامعة",
    description: descriptions[locale],
    openGraph: {
      title: (data as any).hero?.title || "عن الجامعة",
      description: descriptions[locale],
      url: `https://yodelazig.org/${locale}/about-university`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: (data as any).hero?.title || "عن الجامعة", description: descriptions[locale], images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/about-university`,
      languages: { ar: "/ar/about-university", en: "/en/about-university", tr: "/tr/about-university" },
    },
  };
}

const iconMap: Record<string, React.ElementType> = {
  Calendar, Users, Building, BookOpen, Stethoscope, DraftingCompass,
  FlaskConical, Landmark, Mic2, School, Trophy, Cpu, Ruler, Smile,
  HeartPulse, Dog, Fish,
};

export default async function AboutUniversityPage({ params }: AboutUniversityPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const data = (await getAboutUniversityData(locale)) as any;

  const universityStats = data.stats.map((stat: any) => {
    const Icon = iconMap[stat.icon] || Building;
    return {
      ...stat,
      icon: <Icon className="h-10 w-10 text-primary" />,
    };
  });

  const facultiesData = data.faculties.map((faculty: any) => {
    const Icon = iconMap[faculty.icon] || Building;
    return {
      ...faculty,
      icon: <Icon />,
    };
  });

  return (
    <>
      <PageHero
        subtitle={data.hero.subtitle}
        title={data.hero.title}
        imageUrl={data.hero.imageUrl}
        imageAlt={data.hero.imageAlt}
        breadcrumbs={data.hero.breadcrumbs}
        lang={locale}
      />
      <div className="md:p-12 my-8 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Intro */}
          <section>
            <FadeIn direction="up">
              <SectionTitle
                title={data.intro.title}
                className="inline-block border-s-4 ps-2 text-red-800 border-red-800"
              />
              <div className="p-8 text-[#383838] text-justify md:text-xl leading-relaxed space-y-4">
                {data.intro.paragraphs.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </FadeIn>
          </section>

          {/* Stats */}
          <StatsSection
            title={data.statsTitle}
            stats={universityStats}
            className="bg-transparent"
          />

          {/* Faculties */}
          <section className="section-spacing my-12 bg-transparent">
            <div className="w-full">
              <FadeIn direction="up">
                <SectionTitle
                  title={data.facultiesSection.title}
                  className="inline-block border-s-4 ps-2 text-red-800 border-red-800"
                />
                <p className="p-8 text-[#383838] md:text-xl leading-relaxed space-y-4">
                  {data.facultiesSection.description}
                </p>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-2 my-8 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {facultiesData.map((faculty: any) => (
                  <StaggerItem key={faculty.name}>
                    <FacultyCard
                      name={faculty.name}
                      icon={faculty.icon}
                      link={faculty.link}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* Research Section */}
          <section className="rounded-2xl overflow-hidden bg-linear-to-tr from-red-300 to-red-100">
            <FadeIn direction="up">
              <div className="relative w-full h-72 md:h-96">
                <img
                  src={data.researchSection.image.src}
                  alt={data.researchSection.image.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <SectionTitle
                  title={data.researchSection.title}
                  className="inline-block border-s-4 ps-2 text-red-800 border-red-800 mb-6"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {data.researchSection.paragraphs.map((paragraph: string, index: number) => (
                    <p
                      key={index}
                      className="text-gray-700 leading-relaxed text-base text-justify"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pt-6">
                  <Button
                    href={data.researchSection.button.href}
                    variant="secondary"
                    className="text-gray-600 border-white bg-white hover:bg-gray-100"
                  >
                    {data.researchSection.button.text}
                  </Button>
                </div>
              </div>
            </FadeIn>
          </section>
        </div>
      </div>
    </>
  );
}
