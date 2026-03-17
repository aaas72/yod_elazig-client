"use client";

import SectionTitle from "@/components/ui/Titles/SectionTitle";
import ProgramCard from "@/components/ui/Cards/ProgramCard";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";

export interface ProgramItem {
  _id: string;
  slug?: string;
  title: string | Record<string, string>;
  description?: string | Record<string, string>;
  coverImage?: string;
  location?: string;
}

interface ProgramsSectionProps {
  programs: ProgramItem[];
  lang: string;
}

const labels: Record<string, { title: string; more: string }> = {
  ar: { title: "البرامج", more: "عرض كل البرامج" },
  en: { title: "Programs", more: "View All Programs" },
  tr: { title: "Programlar", more: "Tüm Programları Gör" },
};

export default function ProgramsSection({ programs, lang }: ProgramsSectionProps) {
  const t = labels[lang] || labels.ar;
  const displayedPrograms = (programs || []).slice(0, 6);

  return (
    <section className="w-full py-22 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-16">
          <FadeIn direction="up">
            <SectionTitle
              title={t.title}
              className="text-primary font-bold text-xl md:text-2xl text-red-700"
            />
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPrograms.map((program, index) => {
            // Extract title based on language
            const title = typeof program.title === "string"
              ? program.title
              : (program.title[lang] || program.title["ar"] || "");

            let desc = program.location || "";
            if (!desc && program.description) {
              const rawDesc =
                typeof program.description === "string"
                  ? program.description
                  : (program.description[lang] ||
                    program.description["ar"] ||
                    "");
              desc = rawDesc.replace(/<[^>]*>?/gm, "");
            }

            return (
              <StaggerItem key={program.slug || program._id || index}>
                <Link href={`/${lang}/programs/${program.slug || program._id}`}>
                  <ProgramCard
                    title={title}
                    description={desc}
                    imageUrl={program.coverImage}
                  />
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeIn direction="up" delay={0.4}>
          <div className="flex justify-center mt-20">
            <Link
              href={`/${lang}/programs`}
              className="w-fit text-sm text-red-800 border border-red-800 px-6 py-3 rounded-full hover:bg-red-800 hover:text-white transition-all bg-transparent"
            >
              {t.more}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
