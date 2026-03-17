"use client";

import SectionTitle from "@/components/ui/Titles/SectionTitle";
import FadeIn from "@/components/animations/FadeIn";
import ExecutiveBoardSection from "@/components/ui/Sections/ExecutiveBoardSection";
import OrganizationalStructureSection from "@/components/ui/Sections/OrganizationalStructureSection";
import AchievementsTimeline from "@/components/ui/Sections/AchievementsTimeline";
import StudentAchievementsSection from "@/components/ui/Sections/StudentAchievementsSection";
import JoinUsSection from "@/components/ui/Sections/JoinUsSection";
import { useBoardMembersData } from "@/hooks/useBoardMembersData";
import { useAchievementsData } from "@/hooks/useAchievementsData";
import { useStudentAchievementsData } from "@/hooks/useStudentAchievementsData";

interface AboutDynamicSectionsProps {
  lang: string;
  sections: {
    executiveBoard: string;
    organizationalChart: string;
    achievements: string;
    studentAchievements: string;
  };
  joinUsData?: {
    title?: any;
    description?: any;
    buttonText?: any;
    benefits?: any[];
  };
}

export default function AboutDynamicSections({ lang, sections }: AboutDynamicSectionsProps) {
  const locale = lang as 'ar' | 'en' | 'tr';
  const { members: executiveMembers, loading: execLoading } = useBoardMembersData('executive', locale);
  const { members: orgMembers, loading: orgLoading } = useBoardMembersData('organizational', locale);
  const { achievements, loading: achLoading } = useAchievementsData(locale);
  const { achievements: studentAchievements, loading: stuLoading } = useStudentAchievementsData(locale);

  return (
    <>
      {/* Executive Board Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl m-auto">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <SectionTitle
                title={sections.executiveBoard}
                className="text-gray-800 inline-block border-b-3 border-[#BE141B] pb-2 [&_h1]:text-xl [&_h1]:md:text-2xl [&_h1]:lg:text-3xl"
                center
              />
            </FadeIn>
          </div>
          {execLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ExecutiveBoardSection members={executiveMembers} lang={lang} />
          )}
        </div>
      </section>

      {/* Organizational Structure Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl m-auto">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <SectionTitle
                title={sections.organizationalChart}
                className="text-gray-800 inline-block border-b-3 border-[#BE141B] pb-2 [&_h1]:text-xl [&_h1]:md:text-2xl [&_h1]:lg:text-3xl"
                center
              />
            </FadeIn>
          </div>
          {orgLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <OrganizationalStructureSection members={orgMembers} lang={lang} />
          )}
        </div>
      </section>

      {/* Union Achievements Section */}
      <div className="max-w-6xl mx-auto px-4">
        <section className="w-full py-16 px-4">
          <div className="text-center">
            <FadeIn direction="up">
              <SectionTitle
                title={sections.achievements}
                className=" text-red-800"
              />
            </FadeIn>
          </div>
          {achLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <AchievementsTimeline achievements={achievements} lang={lang} />
          )}
        </section>

        {/* Student Achievements Section */}
        <section className="w-full py-16 px-4">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <SectionTitle
                title={sections.studentAchievements}
                className=" text-red-800"
              />
            </FadeIn>
          </div>
          {stuLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <StudentAchievementsSection achievements={studentAchievements} lang={lang} />
          )}
        </section>
      </div>

      {/* Join Us Section */}
      <JoinUsSection lang={lang} />
    </>
  );
}
