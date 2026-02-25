import HeroSection from "@/components/ui/Sections/HeroSection";
import NewsSection from "@/components/ui/Sections/NewsSection";
import {
  GraduationCap,
  CalendarCheck,
  Users,
  FileSignature,
  Handshake,
} from "lucide-react";
import StatsSection, { StatItem } from "@/components/ui/Sections/StatsSection";
import EventsSection from "@/components/ui/Sections/EventsSection";
import PhotoGallerySection from "@/components/ui/Sections/PhotoGallerySection";
import { useHomeData } from "@/hooks/useHomeData";

const iconMap: { [key: string]: React.ReactNode } = {
  GraduationCap: <GraduationCap className="h-10 w-10 text-[#BE141B]" />,
  CalendarCheck: <CalendarCheck className="h-10 w-10 text-[#BE141B]" />,
  Users: <Users className="h-10 w-10 text-[#BE141B]" />,
  FileSignature: <FileSignature className="h-10 w-10 text-[#BE141B]" />,
  Handshake: <Handshake className="h-10 w-10 text-[#BE141B]" />,
};

export default function HomePage() {
  const homeData = useHomeData();
  const unionStats: StatItem[] = homeData.stats.map((item) => ({
    ...item,
    icon: iconMap[item.icon] || null,
  }));

  return (
    <div>
      <HeroSection />
      <NewsSection />
      <EventsSection />
      <PhotoGallerySection />
      <StatsSection title={homeData.sections.stats.title} stats={unionStats} />
    </div>
  );
}
