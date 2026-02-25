import React from "react";
import {
  BookOpen,
  Image as ImageIcon,
  CalendarDays,
  FileArchive,
} from "lucide-react";
import ArchiveCategoryCard from "@/components/ui/Cards/ArchiveCategoryCard";
import { useResourcesData } from "@/hooks/useResourcesData";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import { useGeneralData } from "@/hooks/useGeneralData";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";

const iconMap: { [key: string]: React.ReactNode } = {
  BookOpen: <BookOpen />,
  ImageIcon: <ImageIcon />,
  CalendarDays: <CalendarDays />,
  FileArchive: <FileArchive />,
};

export default function ResourcesPage() {
  const generalData = useGeneralData();
  const resourcesData = useResourcesData();

  return (
    <div>
      <SimplePageHero
        title={resourcesData.hero.title}
        breadcrumbs={[
          { label: generalData.navigation[0].label, href: "/" },
          { label: resourcesData.hero.breadcrumb },
        ]}
      />

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            staggerChildren={0.1}
          >
            {resourcesData.categories.map((category) => (
              <StaggerItem key={category.id}>
                <ArchiveCategoryCard
                  title={category.title}
                  description={category.description}
                  icon={iconMap[category.iconName]}
                  link={category.link}
                  isPrivate={category.isPrivate}
                  backgroundImage={category.backgroundImage}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
