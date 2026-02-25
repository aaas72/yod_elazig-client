interface VisionCardProps {
    number: number;
    title: string;
    description: string;
}


const VisionCard = ({ number, title, description }: VisionCardProps) => (
    <div
        className="bg-white flex flex-col items-center p-8  rounded-2xl border-2 border-dashed border-[#BE141B] text-center h-full">
        <div
            className="flex items-center justify-center w-16 h-16 mb-6 bg-linear-to-br from-[#BE141B] to-[#a11015] text-white text-2xl font-bold rounded-full shadow-lg">
            {number}
        </div>
        <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            {description}
        </p>
    </div>
);

export default VisionCard;