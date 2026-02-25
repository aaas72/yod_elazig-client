import { useJoinUsData } from "@/hooks/useJoinUsData";

interface BenefitCardProps {
  title: string;
  description: string;
}
const BenefitCard = ({ title, description }: BenefitCardProps) => (
  <div className="text-center rtl:md:text-right ltr:md:text-left px-6">
    <h3 className="text-white font-bold text-md md:text-xl mb-3">{title}</h3>
    <p className="leading-relaxed text-white/80 text-md md:text-md">
      {description}
    </p>
  </div>
);

const JoinUsSection = () => {
  const joinUsData = useJoinUsData();

  return (
    <section className="w-full  py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-linear-to-br from-[#BE141B] to-[#58090D] text-white rounded-3xl p-10 md:p-16">
          {/* الجزء العلوي */}
          <div className="text-center  mx-auto">
            <h2 className="text-xl rtl:text-right ltr:text-left md:text-2xl font-extrabold mb-4 text-white">
              {joinUsData.title}
            </h2>
            <p className="rtl:text-right ltr:text-left leading-relaxed mb-8  text-white/80 text-md md:text-md">
              {joinUsData.description}
            </p>
            <button className="bg-white h-[50px] text-[#BE141B] text-2xl font-bold py-3 px-8">
              {joinUsData.buttonText}
            </button>
          </div>

          {/* الفاصل */}
          <div className="my-12 border-t border-white/20"></div>

          {/* الجزء السفلي - المزايا */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {joinUsData.benefits.map((benefit, index) => (
              <div
                key={benefit.id}
                className={`relative ${
                  index < joinUsData.benefits.length - 1
                    ? "rtl:sm:border-l ltr:sm:border-r sm:border-white/40"
                    : ""
                } ${index < 2 ? "rtl:lg:border-l ltr:lg:border-r lg:border-white/20" : ""}`}
              >
                <BenefitCard
                  title={benefit.title}
                  description={benefit.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;
