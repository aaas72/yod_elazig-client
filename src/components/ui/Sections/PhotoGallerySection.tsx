"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { resolveImage } from "@/utils/resolveImage";

interface PhotoGallerySectionProps {
  images: string[];
  lang: string;
}

export default function PhotoGallerySection({ images, lang }: PhotoGallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const photos = (images || []).map((img, i) => ({
    id: i,
    src: resolveImage(img, "gallery/photos"),
    alt: `photo-${i}`,
  }));

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  useEffect(() => {
    if (!isHovered && photos.length > 1) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, photos.length, nextSlide]);

  if (photos.length === 0) return null;

  return (
    <FadeIn direction="up">
      <section
        dir="ltr"
        className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {photos.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              className="shrink-0 w-full h-full relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute top-1/2 start-5 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-full text-gray-800 hover:bg-white/60 hover:scale-110 transition-all duration-300 shadow-lg z-10"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next"
              className="absolute top-1/2 end-5 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-full text-gray-800 hover:bg-white/60 hover:scale-110 transition-all duration-300 shadow-lg z-10"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-white w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </FadeIn>
  );
}
