import {
  BookOpen,
  Building,
  Calendar,
  Code,
  Cog,
  Dog,
  DraftingCompass,
  Fish,
  FlaskConical,
  Heart,
  House,
  Landmark,
  Pill,
  School,
  Speaker,
  Stethoscope,
  Users,
  Mic2,
  Trophy,
  Cpu,
  Ruler,
  Smile,
  HeartPulse,
} from "lucide-react";
import Image from "@/components/ui/Image";

import SectionTitle from "@/components/ui/Titles/SectionTitle";
import PageHero from "@/components/ui/Sections/PageHero";
import StatsSection, { StatItem } from "@/components/ui/Sections/StatsSection";
import FacultyCard from "@/components/ui/Cards/FacultyCard";
import Button from "@/components/ui/Button";
import React, { useState } from "react";
import { useAboutUniversityData } from "@/hooks/useAboutUniversityData";
import FadeIn from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";

const iconMap: { [key: string]: React.ElementType } = {
  Calendar,
  Users,
  Building,
  BookOpen,
  Stethoscope,
  DraftingCompass,
  FlaskConical,
  Landmark,
  Mic2,
  School,
  Trophy,
  Cpu,
  Ruler,
  Smile,
  HeartPulse,
  Dog,
  Fish,
};

export default function AboutUniversity() {
  const aboutUniversityData = useAboutUniversityData();
  const universityStats: StatItem[] = aboutUniversityData.stats.map((stat) => {
    const Icon = iconMap[stat.icon] || Building;
    return {
      ...stat,
      icon: <Icon className="h-10 w-10 text-primary" />,
    };
  });

  const facultiesData = aboutUniversityData.faculties.map((faculty) => {
    const Icon = iconMap[faculty.icon] || Building;
    return {
      ...faculty,
      icon: <Icon />,
    };
  });

  const [visibleFaculties, setVisibleFaculties] = useState(6);
  const campusImages = aboutUniversityData.campusLife.images;

  return (
    <>
      <PageHero
        subtitle={aboutUniversityData.hero.subtitle}
        title={aboutUniversityData.hero.title}
        imageUrl={aboutUniversityData.hero.imageUrl}
        imageAlt={aboutUniversityData.hero.imageAlt}
        breadcrumbs={aboutUniversityData.hero.breadcrumbs}
      />
      <div className="md:p-12 my-8 p-6">
        <div className="max-w-6xl mx-auto">
          <section className="">
            <FadeIn direction="up">
              <SectionTitle
                title={aboutUniversityData.intro.title}
                className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800"
              />
              <div className="p-8 text-[#383838] text-justify md:text-xl leading-relaxed space-y-4">
                {aboutUniversityData.intro.paragraphs.map(
                  (paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  )
                )}
              </div>
            </FadeIn>
          </section>
          {/* */}
          <StatsSection
            title={aboutUniversityData.statsTitle}
            stats={universityStats}
            className="bg-transparent" // يمكننا تغيير الخلفية بسهولة
          />
          {/* */}
          <section className="section-spacing my-12 bg-transparent">
            <div className="w-full">
              <FadeIn direction="up">
                <SectionTitle
                  title={aboutUniversityData.facultiesSection.title}
                  className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800"
                />
                <p className="p-8 text-[#383838] md:text-xl leading-relaxed space-y-4">
                  {aboutUniversityData.facultiesSection.description}
                </p>
              </FadeIn>

              <StaggerContainer
                className="grid grid-cols-2 my-8 md:grid-cols-3 lg:grid-cols-5 gap-8"
                staggerChildren={0.05}
              >
                {facultiesData.map((faculty) => (
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
          <section className="section-spacing my-12 ">
            <div className="w-full">
              <h2 className="heading-2 inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-[#383838] border-red-700 mb-8"></h2>
              <FadeIn direction="up">
                <SectionTitle
                  title={aboutUniversityData.campusLife.title}
                  className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-8">
                  <div className="grid grid-cols-2 gap-4">
                    {campusImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative w-full rounded-lg overflow-hidden shadow-lg ${
                          index === 0 ? "col-span-2 h-64" : "h-48"
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          layout="fill"
                          objectFit="cover"
                          className="hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 mr-6">
                    {aboutUniversityData.campusLife.features.map(
                      (feature, index) => (
                        <div key={index}>
                          <h3 className="font-bold text-md md:text-lg text-gray-800 mb-2 ">
                            {feature.title}
                          </h3>
                          <p className="body-text text-gray-600 text-justify text-lg leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>
          <section className="card-spacing rounded-2xl h-auto bg-linear-to-tr from-red-300 to-red-100">
            <FadeIn direction="up">
              <div className=" p-8">
                <SectionTitle
                  title={aboutUniversityData.researchSection.title}
                  className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-8">
                  {/* 1. الصورة المعبرة */}
                  <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={aboutUniversityData.researchSection.image.src}
                      alt={aboutUniversityData.researchSection.image.alt}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>

                  {/* 2. النص الوصفي وزر الدعوة لاتخاذ إجراء */}
                  <div className="space-y-6">
                    {aboutUniversityData.researchSection.paragraphs.map(
                      (paragraph, index) => (
                        <p
                          key={index}
                          className="text-gray-600 leading-relaxed text-lg text-justify"
                        >
                          {paragraph}
                        </p>
                      )
                    )}
                    <div className="pt-4">
                      <Button
                        href={aboutUniversityData.researchSection.button.href}
                        variant="secondary"
                        className={
                          " text-gray-600 border-white bg-white hover:bg-gray-100"
                        }
                      >
                        {aboutUniversityData.researchSection.button.text}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>
        </div>
      </div>
    </>
  );
}