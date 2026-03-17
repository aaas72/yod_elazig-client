"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

interface Dish {
  title: string;
  description: string;
  imageUrl: string;
}

interface DishesCarouselProps {
  dishes: Dish[];
  dishOfTheMonth: string;
}

export default function DishesCarousel({ dishes, dishOfTheMonth }: DishesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevDish = () => {
    setCurrentIndex(currentIndex === 0 ? dishes.length - 1 : currentIndex - 1);
  };

  const nextDish = () => {
    setCurrentIndex(currentIndex === dishes.length - 1 ? 0 : currentIndex + 1);
  };

  const currentDish = dishes[currentIndex];
  if (!currentDish) return null;

  return (
    <FadeIn direction="up" delay={0.2}>
      <div className="relative bg-transparent rounded-3xl overflow-hidden border border-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1 text-start">
            <div className="mb-6">
              <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">
                {dishOfTheMonth}
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
                {dishes.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-300"
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
          <div className="flex justify-center order-1 md:order-2 p-4">
            <img
              src={currentDish.imageUrl}
              alt={currentDish.title}
              className="w-full h-80 object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
