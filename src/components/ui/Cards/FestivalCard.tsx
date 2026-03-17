"use client";

interface FestivalCardProps {
    title: string;
    description: string;
    imageUrl: string;
}

const FestivalCard = ({ title, description, imageUrl }: FestivalCardProps) => (
    <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-lg group">
        <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-red-900/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white text-start">
            <div className="flex items-center justify-start gap-2 mb-1">
                <h3 className="text-sm font-bold leading-snug">{title}</h3>
            </div>
            <p className="leading-snug text-xs opacity-90 line-clamp-3">
                {description}
            </p>
        </div>
    </div>
);

export default FestivalCard;
