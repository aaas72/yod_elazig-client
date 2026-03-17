"use client";

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

interface ProgramCardProps {
    title: string;
    description: string;
    imageUrl?: string;
    date?: string;
    time?: string;
}

const ProgramCard = ({ title, date, time, description, imageUrl }: ProgramCardProps) => {
    const bgUrl = resolveImage(imageUrl);
    return (
        <div
            className="relative rounded-lg overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72 group"
            style={{
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative p-6 h-full flex flex-col justify-between">
                <div>
                    <div className="font-bold text-white text-sm mb-1 line-clamp-2">{title}</div>
                    <p className="text-gray-300 text-xs line-clamp-3">{description}</p>
                </div>
                {date && (
                    <div className="text-sm text-gray-400 mt-4">
                        <DateBadge date={date} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramCard;
