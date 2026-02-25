
interface EngineCardProps {
    title: string;
    children: React.ReactNode;
}

const EngineCard = ({ title, children }: EngineCardProps) => (
    <div className="bg-linear-to-b from-[#fdecec] to-[#FFD4D4] p-8 rounded-[36px] h-full">
        <h3 className="text-lg font-bold text-primary mb-4 text-center">{title}</h3>
        <div className="text-gray-600 leading-relaxed space-y-4 text-justify text-base md:text-lg">
            {children}
        </div>
    </div>
);

export default EngineCard;
