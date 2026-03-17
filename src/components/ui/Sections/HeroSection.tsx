"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import Link from "next/link";

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BASE_URL = RAW_BASE.replace(/\/$/, "");

function toAbsoluteUrl(img: string): string {
  if (!img) return "";
  // If already a localhost URL, extract the path and use production BASE_URL
  try {
    const u = new URL(img);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
      return `${BASE_URL}${u.pathname}`;
    }
  } catch {}
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
}

const heroImagesStatic = [
  "/imgs/HeroSectionImgs/yodelsty.webp",
  "/imgs/HeroSectionImgs/20251221_170500.webp",
];

const content: Record<string, { title: string; joinButton: string }> = {
  ar: {
    title: "اتحاد الطلاب اليمنيين في تركيا - فرع الازيغ",
    joinButton: "انضم إلينا",
  },
  en: {
    title: "Yemen Students Union in Turkey - Elazig Branch",
    joinButton: "Join Us",
  },
  tr: {
    title: "Türkiye'deki Yemenli Öğrenciler Birliği - Elazığ Şubesi",
    joinButton: "Bize Katıl",
  },
};

interface TickerItem {
  id: string;
  title: string;
  date: string;
  logo: boolean;
  image: string | null;
  link: string | null;
}

interface HeroSectionProps {
  lang: string;
}

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = content[lang] || content.ar;
  const [heroImages] = useState<string[]>(heroImagesStatic);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    // Fetch ticker from API
    fetch(`${BASE_URL}/api/v1/ticker`, {
      headers: { "Accept-Language": lang },
    })
      .then((r) => r.json())
      .then((data) => {
        const items = (data.data || []).map((item: any) => ({
          id: item._id,
          title: item.text?.[lang] || item.text?.ar || "",
          date: item.startDate
            ? new Date(item.startDate).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")
            : new Date(item.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US"),
          logo: !item.image,
          image: item.image ? toAbsoluteUrl(item.image) : null,
          link: item.url || item.link || null,
        }));
        setTickerItems(items);
      })
      .catch(() => {});
  }, [lang]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
      {/* First image preloaded */}
      <img
        src={heroImagesStatic[0]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: currentImageIndex === 0 ? "block" : "none" }}
      />

      <AnimatePresence mode="wait">
        {currentImageIndex > 0 && (
          <motion.div
            key={heroImages[currentImageIndex]}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#BE141B]/80 to-[#940a0e]/70" />

      <div className="relative z-10 p-8 md:p-12">
        <FadeIn direction="up" delay={0.2}>
          <h1 className="text-white mb-4 mx-auto text-xl font-bold md:text-3xl">{t.title}</h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.4}>
          <Link
            href={`/${lang}/join-membership`}
            className="inline-block px-6 py-2.5 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-bold hover:bg-white/25 transition-all duration-300 shadow-lg"
          >
            {t.joinButton}
          </Link>
        </FadeIn>
      </div>

      {tickerItems.length > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-6xl px-4">
          <FadeIn direction="up" delay={0.5}>
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-md shadow-2xl max-h-[100px] overflow-hidden">
              <div className="flex animate-scroll-news">
                {[...tickerItems, ...tickerItems].map((item, index) => {
                  const inner = (
                    <>
                      <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {item.logo ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <img src="/imgs/logos/yodellogo.webp" alt="Logo" className="w-10 h-10 object-contain" />
                          </div>
                        ) : (
                          <img src={item.image!} alt={item.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-white truncate mb-0.5">{item.title}</h3>
                        <p className="text-[10px] text-white">{item.date}</p>
                      </div>
                    </>
                  );

                  const cls = `flex items-center gap-3 px-4 py-3 min-w-[350px] border-e border-gray-200 last:border-e-0${item.link ? " cursor-pointer hover:bg-white/10 transition-colors" : ""}`;

                  return item.link ? (
                    <a key={`${item.id}-${index}`} href={item.link} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <div key={`${item.id}-${index}`} className={cls}>{inner}</div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      )}

      <div className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2 z-10 overflow-hidden">
        <img src="/pattrens/mainSimplLine.svg" alt="" className="w-screen max-w-none h-auto" />
      </div>
    </section>
  );
}
