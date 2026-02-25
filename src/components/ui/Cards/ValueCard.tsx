interface ValueCardProps {
  title: string;
  description: string;
  gradient: string; // تم إضافة خاصية التدرج
}

const ValueCard = ({ title, description, gradient }: ValueCardProps) => (
  <div
    className={` bg-white p-8 rounded-2xl text-center rtl:md:text-right ltr:md:text-left ${gradient}`}
  >
    <h3 className="card-title text-red-800 font-bold text-md md:text-xl mb-4">
      {title}
    </h3>
    <p className="leading-relaxed text-base md:text-lg text-gray-800">
      {description}
    </p>
  </div>
);
export default ValueCard;
