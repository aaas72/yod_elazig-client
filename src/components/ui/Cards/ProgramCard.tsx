
import DateBadge from "../DateBadge";
import { resolveImage } from "@/utils/resolveImage";

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
                    <div className="font-bold text-white text-lg mb-2">{title}</div>
                    <p className="text-gray-300 text-sm text-justify">{description}</p>
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

