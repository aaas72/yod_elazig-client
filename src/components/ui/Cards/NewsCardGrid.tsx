import React from "react";
import DateBadge from "../DateBadge";
import { Link } from "react-router-dom";
import Image from "../Image";
import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";

interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  time: string;
  image: string;
}

// 🧱 تعريف خصائص المكوّن
interface NewsGridProps {
  newsItems: NewsItem[];
  basePath?: string;
}

const NewsGrid = ({ newsItems, basePath = "/news" }: NewsGridProps) => {
  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {newsItems.map((news) => (
        <StaggerItem key={news.id}>
          <Link to={`${basePath}/${news.id}`}>
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative h-50 w-full">
                <Image
                  src={news.image}
                  alt={news.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  <DateBadge date={news.date} time={news.time} />
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
