import { useState, useEffect } from "react";
import Image from "../Image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHomeData } from "@/hooks/useHomeData";
import FadeIn from "@/components/animations/FadeIn";

export default function PhotoGallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const homeData = useHomeData();
  const photos = homeData.sections.gallery.images;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <FadeIn direction="up" fullWidth>
      <section
        dir="ltr"
        className="relative w-full h-[450px] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {photos.map((photo) => (
            <div key={photo.id} className="shrink-0 w-full h-full relative">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-5 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-full text-gray-800 hover:bg-white/60 hover:scale-110 transition-all duration-300 shadow-lg z-10"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-5 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-full text-gray-800 hover:bg-white/60 hover:scale-110 transition-all duration-300 shadow-lg z-10"
        >
          <ChevronRight />
        </button>
      </section>
    </FadeIn>
  );
}