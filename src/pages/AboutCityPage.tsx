import React, { useState, useEffect } from "react";
import { MapPin, Info, ChevronLeft, ChevronRight } from "lucide-react";
import PageHero from "../components/ui/Sections/PageHero";
import SectionTitle from "../components/ui/Titles/SectionTitle";
import EngineCard from "../components/ui/Cards/EngineCard";
import FestivalCard from "../components/ui/Cards/FestivalCard";
import ActivityCard from "../components/ui/Cards/ProgramCard";
import { useAboutCityData } from "@/hooks/useAboutCityData";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";

export default function AboutCity() {
  const aboutCityData = useAboutCityData();
  const historicalLandmarks = aboutCityData.historicalLandmarks;
  const engines = aboutCityData.engines;
  const festivals = aboutCityData.festivals;
  const activities = aboutCityData.activities;
  const dishes = aboutCityData.dishes;
  const dailyLife = aboutCityData.dailyLife;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLandmarkIndex, setCurrentLandmarkIndex] = useState(0);

  const prevDish = () => {
    const isFirstDish = currentIndex === 0;
    const newIndex = isFirstDish ? dishes.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextDish = () => {
    const isLastDish = currentIndex === dishes.length - 1;
    const newIndex = isLastDish ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentDish = dishes[currentIndex];

  const calculateClosestIndex = (container: HTMLElement) => {
    const center = container.scrollLeft + container.clientWidth / 2;
    const children = Array.from(container.children) as HTMLElement[];
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(childCenter - center);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const handleLandmarkScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setCurrentLandmarkIndex(calculateClosestIndex(e.currentTarget));
  };

  const scrollToLandmark = (index: number) => {
    const container = document.getElementById("landmarks-container");
    if (container) {
      const children = Array.from(container.children) as HTMLElement[];
      if (children[index]) {
        const childCenter = children[index].offsetLeft + children[index].offsetWidth / 2;
        const containerCenter = container.clientWidth / 2;
        container.scrollTo({
          left: childCenter - containerCenter,
          behavior: "smooth"
        });
        setCurrentLandmarkIndex(index);
      }
    }
  };

  useEffect(() => {
    const checkCenter = () => {
      const container = document.getElementById("landmarks-container");
      if (container) {
        setCurrentLandmarkIndex(calculateClosestIndex(container));
      }
    };

    // Use requestAnimationFrame to ensure layout is ready
    requestAnimationFrame(checkCenter);

    window.addEventListener("resize", checkCenter);
    return () => window.removeEventListener("resize", checkCenter);
  }, []);

  return (
    <div className="min-h-screen">
      <PageHero
        title={aboutCityData.hero.title}
        subtitle={aboutCityData.hero.subtitle}
        imageUrl={aboutCityData.hero.imageUrl}
        imageAlt={aboutCityData.hero.imageAlt}
        breadcrumbs={aboutCityData.hero.breadcrumbs}
      />

      {/* Intro Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up">
            <SectionTitle
              title={aboutCityData.intro.title}
              className="text-red-800"
            />
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <div className="py-8 text-gray-700 text-justify text-md md:text-lg space-y-4 leading-relaxed">
              {aboutCityData.intro.paragraphs.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Historical Landmarks */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn className="mb-16 rtl:text-right ltr:text-left" direction="up">
            <SectionTitle
              title={aboutCityData.historicalLandmarksTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800"
            />
          </FadeIn>

          <StaggerContainer
            id="landmarks-container"
            className="relative flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden scrollbar-hide"
            onScroll={handleLandmarkScroll}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {historicalLandmarks.map((landmark: any) => (
              <StaggerItem
                key={landmark.id}
                className="shrink-0 w-[85vw] md:w-[calc((100%-4rem)/3)] snap-center group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:border-red-800 border-2 border-transparent transition-all duration-300"
              >
                <a
                  href={landmark.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    <img
                      src={landmark.imageUrl}
                      alt={landmark.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                      {aboutCityData.historicalLandmarksTag}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      {landmark.title}
                    </h3>
                    <div className="space-y-4">
                      {landmark.description.map((desc: string, i: number) => (
                        <p
                          key={i}
                          className="text-gray-600 leading-relaxed text-sm"
                        >
                          {desc}
                        </p>
                      ))}
                    </div>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {historicalLandmarks.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToLandmark(index)}
                className={`h-3 rounded-full transition-all duration-300 cursor-pointer hover:bg-red-600 ${
                  index === 0 || index === historicalLandmarks.length - 1
                    ? "md:hidden"
                    : ""
                } ${
                  index === currentLandmarkIndex
                    ? "w-8 bg-red-800"
                    : "w-3 bg-gray-300"
                }`}
                aria-label={`Go to landmark ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Economic Engines */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="rtl:text-right ltr:text-left">
            <SectionTitle
              title={aboutCityData.enginesTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engines.map((engine: any) => (
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
              title={dailyLife.title}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 rtl:pr-6 ltr:pl-6">
            {/* Modern Life */}
            <FadeIn direction="right" delay={0.2}>
              <div className="rtl:text-right ltr:text-left">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {dailyLife.modernLife.title}
                </h2>
                <div className="text-gray-700 leading-loose space-y-4">
                  {dailyLife.modernLife.paragraphs.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Traditional Life */}
            <FadeIn direction="left" delay={0.2}>
              <div className="rtl:text-right ltr:text-left">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {dailyLife.traditionalLife.title}
                </h2>
                <div className="text-gray-700 leading-loose space-y-4">
                  {dailyLife.traditionalLife.paragraphs.map((p: string, i: number) => (
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
              title={aboutCityData.festivalsTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {festivals.map((festival: any) => (
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
              title={aboutCityData.activitiesTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity: any) => (
              <StaggerItem key={activity.id}>
                <ActivityCard
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
      <section className=" bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" className="rtl:text-right ltr:text-left">
            <SectionTitle
              title={aboutCityData.dishesTitle}
              className="inline-block rtl:border-r-4 rtl:pr-2 ltr:border-l-4 ltr:pl-2 text-red-800 border-red-800 mb-12"
            />
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="relative bg-transparent rounded-3xl  overflow-hidden border border-gray-400">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1 rtl:text-right ltr:text-left">
                  <div className="mb-6">
                    <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">
                      {aboutCityData.dishOfTheMonth}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {currentDish.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {currentDish.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-8 justify-center md:justify-start">
                    <button
                      onClick={prevDish}
                      className="bg-gray-100 text-gray-600 p-1 md:p-2 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Previous Dish"
                    >
                      <ChevronLeft className="rtl:rotate-180" />
                    </button>
                    <div className="flex gap-2">
                      {dishes.map((_: any, idx: number) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? "w-8 bg-primary"
                              : "w-2 bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextDish}
                      className="bg-red-100 text-red-700 p-1 md:p-2 rounded-full hover:bg-red-200 transition-colors"
                      aria-label="Next Dish"
                    >
                      <ChevronRight className="rtl:rotate-180" />
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="flex justify-center order-1 md:order-2">
                  <img
                    src={currentDish.imageUrl}
                    alt={currentDish.title}
                    className="w-full h-80 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
