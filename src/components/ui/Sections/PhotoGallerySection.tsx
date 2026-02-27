import { useState, useEffect } from "react";
import Image from "../Image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGalleryData } from "@/hooks/useGalleryData";
import { useHomeData } from "@/hooks/useHomeData";
import FadeIn from "@/components/animations/FadeIn";
import { resolveImage } from "@/utils/resolveImage";

export default function PhotoGallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { albums, loading } = useGalleryData();
  const homeData = useHomeData();
  
  // Use dynamic images if available, otherwise fallback to static homeData
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && albums.length > 0) {
      // Flatten all photos from all albums
      const allPhotos = albums.flatMap(album => 
        album.images.map(img => {
          const fileName = typeof img === "string" ? img : img.url;
          const src = resolveImage(fileName, 'gallery/photos');
          return {
            id: img.id,
            src: src,
            alt: img.caption || album.title
          };
        })
      );

      // If no photos in albums, try cover images
      if (allPhotos.length === 0) {
        const covers = albums.filter(a => a.coverImage).map(album => {
          const fileName = album.coverImage;
          const src = resolveImage(fileName, 'gallery/photos');
          return {
            id: album.id,
            src: src,
            alt: album.title
          };
        });
        if (covers.length > 0) {
          setPhotos(covers);
          return;
        }
      }

      if (allPhotos.length > 0) {
        setPhotos(allPhotos);
      } else {
        setPhotos(homeData.sections.gallery.images);
      }
    } else if (!loading) {
       setPhotos(homeData.sections.gallery.images);
    }
  }, [albums, loading, homeData.sections.gallery.images]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isHovered && photos.length > 1) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, photos.length]);

  if (photos.length === 0) return null;

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
          {photos.map((photo, index) => (
            <div key={`${photo.id}-${index}`} className="shrink-0 w-full h-full relative">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
              {photo.alt && (
                <div className="absolute bottom-10 left-10 text-white z-10 max-w-2xl">
                  <h3 className="text-xl font-bold">{photo.alt}</h3>
                </div>
              )}
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
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
          </>
        )}
      </section>
    </FadeIn>
  );
}