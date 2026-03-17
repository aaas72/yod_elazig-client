"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/ui/Titles/SectionTitle";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";

interface Landmark {
  id: string | number;
  title: string;
  description: string[];
  imageUrl: string;
  wikiUrl?: string;
}

interface AboutCityClientProps {
  historicalLandmarks: Landmark[];
  historicalLandmarksTitle: string;
  historicalLandmarksTag: string;
}

export default function AboutCityClient({
  historicalLandmarks,
  historicalLandmarksTitle,
  historicalLandmarksTag,
}: AboutCityClientProps) {
  const [currentLandmarkIndex, setCurrentLandmarkIndex] = useState(0);

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
          behavior: "smooth",
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
    requestAnimationFrame(checkCenter);
    window.addEventListener("resize", checkCenter);
    return () => window.removeEventListener("resize", checkCenter);
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn className="mb-16 text-start" direction="up">
          <SectionTitle
            title={historicalLandmarksTitle}
            className="inline-block border-s-4 ps-2 text-red-800 border-red-800"
          />
        </FadeIn>

        <div
          id="landmarks-container"
          className="relative flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden scrollbar-hide"
          onScroll={handleLandmarkScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as any}
        >
          {historicalLandmarks.map((landmark) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src={landmark.imageUrl}
                    alt={landmark.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 end-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                    {historicalLandmarksTag}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                    {landmark.title}
                  </h3>
                  <div className="space-y-4">
                    {landmark.description.map((desc, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed text-sm">
                        {desc}
                      </p>
                    ))}
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {historicalLandmarks.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToLandmark(index)}
              className={`h-3 rounded-full transition-all duration-300 cursor-pointer hover:bg-red-600 ${
                index === 0 || index === historicalLandmarks.length - 1 ? "md:hidden" : ""
              } ${
                index === currentLandmarkIndex ? "w-8 bg-red-800" : "w-3 bg-gray-300"
              }`}
              aria-label={`Go to landmark ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
