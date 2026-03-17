"use client";

import React from "react";
import Link from "next/link";
import { resolveImage } from "@/utils/resolveImage";
import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";

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

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  time: string;
  image: string;
}

interface NewsGridProps {
  newsItems: NewsItem[];
  basePath?: string;
}

const NewsGrid = ({ newsItems, basePath = "/news" }: NewsGridProps) => {
  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {newsItems.map((news) => (
        <StaggerItem key={news.id}>
          <Link href={`${basePath}/${news.id}`}>
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative h-50 w-full">
                <img
                  src={resolveImage(news.image)}
                  alt={news.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  <DateBadge date={news.date} />
                </div>

                <div>
                  <div className=" text-white  text-start drop-shadow-lg text-sm md:text-md">
                    {news.title}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border-2 border-white/10 group-hover:border-white/50 transition-colors pointer-events-none" />
            </div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};

export default NewsGrid;
