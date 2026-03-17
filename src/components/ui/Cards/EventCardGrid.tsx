"use client";

import Link from "next/link";
import { resolveImage } from "@/utils/resolveImage";

// Inline DateBadge — not yet extracted in client-next
const DateBadge = ({ date, className = "" }: { date: string; className?: string }) => {
  let displayDate = date;
  try {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      displayDate = `${day}-${month}-${year}`;
    }
  } catch {}
  return (
    <span
      className={`bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full shadow-lg ${className}`}
    >
      {displayDate}
    </span>
  );
};

interface EventsItem {
  id: number;
  title: string;
  date: string;
  time: string;
  image: string;
  location?: string;
}

interface EventsGridProps {
  eventsItems: EventsItem[];
}

const EventCardGrid = ({ eventsItems }: EventsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventsItems.map((events) => (
        <Link href={`/activities/${events.id}`} key={events.id}>
          <div
            className="group relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="relative h-50 w-full">
              <img
                src={resolveImage(events.image)}
                alt={events.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex justify-end">
                <DateBadge date={events.date} />
              </div>

              <div className="text-start space-y-2">
                <div className=" text-white drop-shadow-lg text-sm md:text-md">
                  {events.title}
                </div>

                {events.location && (
                  <div className="flex items-center justify-start text-gray-300 text-sm gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0 9s8-7.343 8-11a8 8 0 10-16 0c0 3.657 8 11 8 11z"
                      />
                    </svg>
                    <span>{events.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute inset-0 rounded-2xl border-2 border-white/10 group-hover:border-white/50 transition-colors pointer-events-none" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventCardGrid;
