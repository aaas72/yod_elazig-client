import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getAboutData, getJoinUsData } from "@/i18n/get-data";
import { notFound } from "next/navigation";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import SectionTitle from "@/components/ui/Titles/SectionTitle";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import ValueCard from "@/components/ui/Cards/ValueCard";
import AboutDynamicSections from "./AboutDynamicSections";

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;
  const aboutData = await getAboutData(locale);

  return {
    title: aboutData.hero.title,
    description: aboutData.intro.content[0]?.slice(0, 160),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        ar: "/ar/about",
        en: "/en/about",
        tr: "/tr/about",
      },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const aboutData = await getAboutData(locale);
  const joinUsData = await getJoinUsData(locale);

  return (
    <>
      <SimplePageHero
        title={aboutData.hero.title}
        breadcrumbs={aboutData.hero.breadcrumbs}
        lang={locale}
      />

      {/* Main Content */}
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Who We Are Section */}
          <section className="mb-16">
            <FadeIn direction="up">
              <SectionTitle title={aboutData.intro.title} className=" text-red-800" />
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <div className="py-8 text-gray-700 text-justify text-md md:text-lg space-y-4 leading-relaxed">
                {aboutData.intro.content.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </FadeIn>
          </section>

          {/* Vision, Mission, Goals Section */}
          <section className="w-full py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-center mb-12">
                <FadeIn direction="up">
                  <SectionTitle
                    title={aboutData.sections.visionMission}
                    className=" text-red-800"
                  />
                </FadeIn>
              </div>

              <StaggerContainer className="space-y-6">
                {aboutData.vision.map((card) => (
                  <StaggerItem key={card.id}>
                    <div className="rounded-2xl border-2 border-[#BE141B] overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center gap-4 px-6 py-2 bg-gradient-to-br from-[#BE141B] to-[#a11015]">
                        <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-white text-gray-800 text-xl font-bold rounded-full shadow-lg">
                          {card.number}
                        </div>
                        <h3 className="text-md md:text-xl font-bold text-white">
                          {card.title}
                        </h3>
                      </div>
                      {/* Body */}
                      <div className="px-6 py-5">
                        {card.description && (
                          <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-4">
                            {card.description}
                          </p>
                        )}
                        {card.subItems && card.subItems.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {card.subItems.map((sub, i) => (
                              <div
                                key={i}
                                className="rounded-xl p-4 bg-white border-2 border-dashed border-[#BE141B]/40"
                              >
                                <p className="font-semibold text-[#BE141B] mb-1 text-sm md:text-base">
                                  {sub.title}
                                </p>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                  {sub.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* Our Values Section */}
          <section className="w-full py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <FadeIn direction="up">
                  <SectionTitle title={aboutData.sections.values} className=" text-red-800" />
                </FadeIn>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aboutData.values.map((value) => (
                  <StaggerItem key={value.id}>
                    <ValueCard
                      title={value.title}
                      description={value.description}
                      gradient={value.gradient ?? ""}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </div>

        {/* Dynamic API sections: Executive Board, Org Structure, Achievements, Student Achievements, Join Us */}
        <AboutDynamicSections
          lang={locale}
          sections={{
            executiveBoard: aboutData.sections.executiveBoard,
            organizationalChart: aboutData.sections.organizationalChart,
            achievements: aboutData.sections.achievements,
            studentAchievements: aboutData.sections.studentAchievements,
          }}
          joinUsData={{
            title: (joinUsData as any).title,
            description: (joinUsData as any).description,
            buttonText: (joinUsData as any).buttonText,
            benefits: (joinUsData as any).benefits || [],
          }}
        />
      </div>
    </>
  );
}
