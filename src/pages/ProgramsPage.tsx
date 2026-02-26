import React from "react";
import { Link } from "react-router-dom";
import { useProgramsData } from "../hooks/useProgramsData";
import { useTranslation } from "react-i18next";
import arPage from '../../data/locales/ar/programsPage.json';
import enPage from '../../data/locales/en/programsPage.json';
import trPage from '../../data/locales/tr/programsPage.json';
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import ProgramCard from "@/components/ui/Cards/ProgramCard";

export default function ProgramsPage() {
  const { i18n } = useTranslation();
  const { programs, loading } = useProgramsData({ admin: false });
  const lang = i18n.language as 'ar' | 'en' | 'tr';
  const pageMap: Record<string, any> = { ar: arPage, en: enPage, tr: trPage };
  const pageData = pageMap[lang] || pageMap['ar'];
  const heroData = pageData.hero;

  // Sort programs by startDate descending
  const sortedPrograms = [...programs].sort(
    (a, b) =>
      new Date(b.startDate || "").getTime() -
      new Date(a.startDate || "").getTime()
  );

  // Helper to ensure title is always string
  const getTitle = (title: any) => {
    if (typeof title === 'string') return title;
    if (typeof title === 'object' && title !== null) return title[lang] || title.ar || Object.values(title)[0] || '';
    return '';
  };

  return (
    <div>
      <SimplePageHero title={heroData.title} breadcrumbs={heroData.breadcrumbs} />
      <section className="md:p-12 p-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
          ) : sortedPrograms.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">{pageData.detail?.notFoundMessage || "لا توجد برامج حالياً"}</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPrograms.map((program) => (
                <StaggerItem key={program._id}>
                  <Link to={`/programs/${program.slug || program._id}`}>
                    <ProgramCard
                      title={getTitle(program.title)}
                      date={program.startDate}
                      description={program.location || ""}
                      imageUrl={program.coverImage}
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}
