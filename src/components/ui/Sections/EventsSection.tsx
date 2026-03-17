"use client";

import SectionTitle from "@/components/ui/Titles/SectionTitle";
import ProgramCard from "@/components/ui/Cards/ProgramCard";
import Link from "next/link";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";

interface EventItem {
  _id: string;
  slug?: string;
  title: string | Record<string, string>;
  coverImage?: string;
  eventDate?: string;
  location?: string;
}

interface EventsSectionProps {
  events: EventItem[];
  lang: string;
}

const labels: Record<string, { title: string; more: string }> = {
  ar: { title: "الفعاليات", more: "عرض كل الفعاليات" },
  en: { title: "Events", more: "View All Events" },
  tr: { title: "Etkinlikler", more: "Tüm Etkinlikleri Gör" },
};

export default function EventsSection({ events, lang }: EventsSectionProps) {
  const t = labels[lang] || labels.ar;

  return (
    <section className="w-full py-22 px-4">
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
          {events.slice(0, 6).map((activity) => {
            // Extract title based on language
            const title = typeof activity.title === "string"
              ? activity.title
              : (activity.title[lang] || activity.title["ar"] || "");

            return (
              <StaggerItem key={activity.slug || activity._id}>
                <Link href={`/${lang}/events/${activity.slug || activity._id}`}>
                  <ProgramCard
                    title={title}
                    description={activity.location || ""}
                    imageUrl={activity.coverImage}
                  />
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeIn direction="up" delay={0.4}>
          <Button
            href={`/${lang}/events`}
            className="mt-20 w-fit text-sm text-red-800 border-red-800 mx-auto hover:bg-red-800 hover:text-white bg-transparent"
            variant="secondary"
          >
            {t.more}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
