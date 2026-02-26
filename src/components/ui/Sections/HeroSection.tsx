import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHomeData } from "@/hooks/useHomeData";
import FadeIn from "@/components/animations/FadeIn";
import { tickerService, TickerItem } from "@/services/tickerService";
import { useTranslation } from "react-i18next";

// صور الخلفية من مجلد HeroSectionImgs
const heroImages = [
  "/imgs/HeroSectionImgs/yodelsty.jpg",
  "/imgs/HeroSectionImgs/20251221_170500.jpg",
];

export default function HeroSection() {
  const { i18n } = useTranslation();
  const homeData = useHomeData();
  // State for dynamic ticker
  const [tickerItems, setTickerItems] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load ticker data
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
          logo: true, // For now, use logo for all text tickers
          image: null // Or support image if added to backend
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

  // تبديل الصور كل 3 ثواني
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
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
