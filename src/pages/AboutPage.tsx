import SectionTitle from "@/components/ui/Titles/SectionTitle";
import VisionCard from "@/components/ui/Cards/VisionCard";
import AchievementsTimeline from "@/components/ui/Sections/AchievementsTimeline";
import ValueCard from "@/components/ui/Cards/ValueCard";
import JoinUsSection from "@/components/ui/Sections/JoinUsSection";
import { useAboutData } from "@/hooks/useAboutData";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import { Key } from "react";

export default function AboutPage() {
  const aboutData = useAboutData();
  const VisionCardData = aboutData.vision;
  const values: {
    id: string | number;
    title: string;
    description: string;
    gradient?: string;
  }[] = aboutData.values;

  return (
    <>
      <SimplePageHero
        title={aboutData.hero.title}
        breadcrumbs={aboutData.hero.breadcrumbs}
      />

      {/* Main Content */}
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Who We Are Section */}
          <section className="mb-16">
            <FadeIn direction="up">
              <SectionTitle
                title={aboutData.intro.title}
                className=" text-red-800"
              />
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <div className="py-8 text-gray-700 text-justify text-md md:text-lg space-y-4 leading-relaxed">
                {aboutData.intro.content.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </FadeIn>
          </section>

          {/* Vision, Mission, Goals, Values Grid */}
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

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {VisionCardData.map((card: { id: Key | null | undefined; number: number; title: string; description: string; }) => (
                  <StaggerItem key={card.id}>
                    <VisionCard
                      number={card.number}
                      title={card.title}
                      description={card.description}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
          {/* Mission Section */}
          <section className="w-full py-16 px-4">
            <div className="text-center">
              <FadeIn direction="up">
                <SectionTitle
                  title={aboutData.sections.achievements}
                  className=" text-red-800"
                />
              </FadeIn>
            </div>

            <AchievementsTimeline />
          </section>
          {/* Our Values Section */}
          <section className="w-full  py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <FadeIn direction="up">
                  <SectionTitle
                    title={aboutData.sections.values}
                    className=" text-red-800"
                  />
                </FadeIn>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value: {
                  id: string | number;
                  title: string;
                  description: string;
                  gradient?: string;
                }) => (
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
        <JoinUsSection />

        {/* Organizational Chart Section */}
        <section className="w-full  py-16 px-4">
          <div className={"Organizational-Chart max-w-7xl m-auto "}>
            <div className="text-center ">
              <FadeIn direction="up">
                <SectionTitle
                  title={aboutData.sections.organizationalChart}
                  className="text-gray-800 inline-block border-b-3 border-[#BE141B] pb-2"
                />
              </FadeIn>
              <FadeIn direction="up" delay={0.3}>
                <img
                  src={aboutData.organizationalChart.imageSrc}
                  alt={aboutData.organizationalChart.imageAlt}
                />
              </FadeIn>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
