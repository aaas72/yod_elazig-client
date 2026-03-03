import HeroSection from "@/components/ui/Sections/HeroSection";
import { lazy, Suspense, useRef, useState, useEffect } from "react";
import {
  GraduationCap,
  CalendarCheck,
  Users,
  FileSignature,
  Handshake,
} from "lucide-react";
import StatsSection, { StatItem } from "@/components/ui/Sections/StatsSection";
import { useHomeData } from "@/hooks/useHomeData";

const NewsSection = lazy(() => import("@/components/ui/Sections/NewsSection"));
const EventsSection = lazy(() => import("@/components/ui/Sections/EventsSection"));
const PhotoGallerySection = lazy(() => import("@/components/ui/Sections/PhotoGallerySection"));

function LazyVisible({ children, minHeight = "200px" }: { children: React.ReactNode; minHeight?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible && <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>}
    </div>
  );
}

const iconMap: { [key: string]: React.ReactNode } = {
  GraduationCap: <GraduationCap className="h-10 w-10 text-[#BE141B]" />,
  CalendarCheck: <CalendarCheck className="h-10 w-10 text-[#BE141B]" />,
  Users: <Users className="h-10 w-10 text-[#BE141B]" />,
  FileSignature: <FileSignature className="h-10 w-10 text-[#BE141B]" />,
  Handshake: <Handshake className="h-10 w-10 text-[#BE141B]" />,
};

export default function HomePage() {
  const homeData = useHomeData();
  interface StatItemWithIcon extends StatItem {
    icon: React.ReactNode | null;
  }

  const unionStats: StatItemWithIcon[] = homeData.stats.map((item: StatItem) => ({
    ...item,
    icon: iconMap[item.icon as keyof typeof iconMap] || null,
  }));

  return (
    <div>
      <HeroSection />
      <LazyVisible minHeight="500px"><NewsSection /></LazyVisible>
      <LazyVisible minHeight="500px"><EventsSection /></LazyVisible>
      <LazyVisible minHeight="400px"><PhotoGallerySection /></LazyVisible>
      <StatsSection title={homeData.sections.stats.title} stats={unionStats} />
    </div>
  );
}
