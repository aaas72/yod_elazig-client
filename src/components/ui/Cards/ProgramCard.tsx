import DateBadge from "../DateBadge";
interface ProgramCardProps {
    title: string;
    description: string;
    imageUrl?: string;
    date?: string;
    time?: string;
}

const ProgramCard = ({ title, date, time, description, imageUrl }: ProgramCardProps) => (
    <div 
        className="relative rounded-lg overflow-hidden h-64 group"
        style={{ 
            backgroundImage: `url(${imageUrl})`,
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

export default ProgramCard;

