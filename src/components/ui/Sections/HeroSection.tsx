import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHomeData } from "@/hooks/useHomeData";
import FadeIn from "@/components/animations/FadeIn";
import { tickerService, TickerItem } from "@/services/tickerService";
import { galleryService, GalleryAlbum } from "@/services/galleryService";
import { useTranslation } from "react-i18next";

import { BASE_URL } from '@/lib/api';

// Fallback images if no gallery images found
const fallbackImages = [
  "/imgs/HeroSectionImgs/yodelsty.jpg",
  "/imgs/HeroSectionImgs/20251221_170500.jpg",
];

export default function HeroSection() {
  const { i18n } = useTranslation();
  const homeData = useHomeData();
  
  // State for dynamic ticker & hero images
  const [tickerItems, setTickerItems] = useState<any[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 1. Load Hero Images from Gallery
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const albums = await galleryService.getPublished();
        // Flatten all photos from all albums, or pick specific "Hero" album if you want
        // Here we take up to 5 latest photos from published albums
        const allPhotos: string[] = [];
        
        if (Array.isArray(albums)) {
          albums.forEach((album: GalleryAlbum) => {
            if (album.photos && album.photos.length > 0) {
              album.photos.forEach(photo => {
                const fullUrl = photo.url.startsWith('http') ? photo.url : `${BASE_URL}${photo.url.startsWith('/') ? '' : '/'}${photo.url}`;
                allPhotos.push(fullUrl);
              });
            } else if (album.coverImage) {
               const fullUrl = album.coverImage.startsWith('http') ? album.coverImage : `${BASE_URL}${album.coverImage.startsWith('/') ? '' : '/'}${album.coverImage}`;
               allPhotos.push(fullUrl);
            }
          });
        }

        if (allPhotos.length > 0) {
          // Shuffle or take first 5
          setHeroImages(allPhotos.slice(0, 5));
        } else {
          setHeroImages(fallbackImages);
        }
      } catch (err) {
        console.error('Failed to load gallery for hero', err);
        setHeroImages(fallbackImages);
      }
    };
    fetchGallery();
  }, []);

  // 2. Load ticker data
  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const data = await tickerService.getPublished();
        // Map to display format
        const lang = i18n.language as 'ar' | 'en' | 'tr';
        const mapped = (data || []).map((item: TickerItem) => ({
          id: item._id,
          title: item.text[lang] || item.text['ar'] || '',
          date: item.startDate ? new Date(item.startDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : new Date(item.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US'),
          logo: !item.image, // Use logo only if no image provided
          image: item.image ? (item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`) : null
        }));
        setTickerItems(mapped);
      } catch (err) {
        console.error('Failed to load ticker', err);
        // Fallback to static data if API fails
        setTickerItems(homeData.hero.ticker || []);
      }
    };
    fetchTicker();
  }, [i18n.language, homeData.hero.ticker]);

  // 3. Auto-rotate images
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Slower rotation for better UX

    return () => clearInterval(interval);
  }, [heroImages]);

  // Ensure we have images to show
  const currentImage = heroImages.length > 0 ? heroImages[currentImageIndex] : fallbackImages[0];

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${currentImage}')` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 z-1 bg-linear-to-t from-[#BE141B]/80 to-[#940a0e]/70" />

      <div className="relative z-10 p-8 md:p-12">
        <FadeIn direction="up" delay={0.2}>
          <h1 className="text-white mb-4  mx-auto text-xl font-bold md:text-3xl">
            {homeData.hero.title}
          </h1>
        </FadeIn>
      </div>

      {tickerItems.length > 0 && (
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-6xl px-4">
        <FadeIn direction="up" delay={0.5}>
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-md shadow-2xl max-h-[100px] overflow-hidden">
            <div className="flex animate-scroll-news">
              {/* Duplicate news for seamless loop */}
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3 px-4 py-3 min-w-[350px] border-r border-gray-200 last:border-r-0"
                >
                  {/* Image or Logo */}
                  <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {item.logo ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={homeData.hero.logoUrl}
                          alt="Logo"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-white truncate mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-white">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
      )}

      <div className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2 z-10 overflow-hidden">
        <img
          src="/pattrens/mainSimplLine.svg"
          alt=""
          className="w-screen max-w-none h-auto"
        />

      </div>
    </section>
  );
}
