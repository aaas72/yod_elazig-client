import React from "react";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import { Link } from "react-router-dom";
import { useEventsData } from "@/hooks/useEventsData";
import { useTranslation } from "react-i18next";
import arPage from '../../data/locales/ar/eventsPage.json';
import enPage from '../../data/locales/en/eventsPage.json';
import trPage from '../../data/locales/tr/eventsPage.json';
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import ProgramCard from "@/components/ui/Cards/ProgramCard";

// Define the event type according to your data structure
type EventType = {
  id?: string;
  _id?: string;
  slug?: string;
  title: string;
  startDate?: string;
  date?: string;
  time?: string;
  location?: string;
  coverImage?: string;
  content?: string;
};

export default function EventsPage() {
  const { i18n } = useTranslation();
  const { events, loading } = useEventsData() as { events: EventType[]; loading: boolean };
  
  const lang = i18n.language as 'ar' | 'en' | 'tr';
  const pageMap: Record<string, any> = { ar: arPage, en: enPage, tr: trPage };
  const pageData = pageMap[lang] || pageMap['ar'];
  const heroData = pageData.hero;
  
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(b.startDate || b.date || "").getTime() -
      new Date(a.startDate || a.date || "").getTime()
  );
  
  return (
    <div>
      <SimplePageHero title={heroData.title} breadcrumbs={heroData.breadcrumbs} />
      <section className="md:p-12 p-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">{pageData.empty}</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event) => (
                <StaggerItem key={event.id || event._id}>
                  <Link to={`/events/${event.slug || event.id || event._id}`}>
                    <ProgramCard
                      title={event.title}
                      date={event.startDate || event.date}
                      time={event.time}
                      description={event.location || ""}
                      imageUrl={event.coverImage}
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