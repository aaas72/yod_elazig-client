import React from "react";
import SectionTitle from "@/components/ui/Titles/SectionTitle";
import StatCard from "@/components/ui/Cards/StatCard";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";

export interface StatItem {
  id: number | string;
  icon: React.ReactNode;
  value: number | string;
  label: string;
}

interface StatsSectionProps {
  title: string;
  stats: StatItem[];
  className?: string; // لإضافة أي تنسيقات إضافية للحاوية
  titleClassName?: string; // لتخصيص تنسيق العنوان
}

const StatsSection = ({
  title,
  stats,
  className,
  titleClassName,
}: StatsSectionProps) => {
  return (
    <section
      className={`w-full bg-primary-lighter py-12 px-4 ${className || ""}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-12">
          <FadeIn direction="up">
            <SectionTitle
              title={title}
              className="text-primary font-bold text-xl md:text-2xl text-red-700"
            />
          </FadeIn>
        </div>

        <StaggerContainer className="flex flex-wrap justify-center gap-8">
          {stats.map((stat) => (
            <StaggerItem key={stat.id}>
              <StatCard
                icon={stat.icon}
                value={stat.value.toString()}
                label={stat.label}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default StatsSection;
