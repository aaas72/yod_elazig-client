
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
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white text-right">
            <div className="flex items-center justify-start gap-3 mb-3">
                <h3 className="text-lg font-bold">{title}</h3>
            </div>
            <p className="leading-relaxed max-w-lg text-justify text-base md:text-lg">
                {description}
            </p>
        </div>
    </div>
);


export default FestivalCard;