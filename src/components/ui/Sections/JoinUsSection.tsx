"use client";

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

interface Benefit {
  id: string | number;
  title: string;
  description: string;
}

const defaultBenefitsByLang: Record<string, { title: string; description: string; buttonText: string; benefits: Benefit[] }> = {
  ar: {
    title: "انضم إلى يود العائلة",
    description:
      "كن جزءاً من مجتمع متميز يسعى إلى التطوير والإبداع، وانضم إلى آلاف الأعضاء الذين يحققون أهدافهم معنا.",
    buttonText: "انضم الآن",
    benefits: [
      {
        id: 1,
        title: "فرص التطوير",
        description: "احصل على فرص تدريبية وتعليمية متميزة تساعدك على تطوير مهاراتك.",
      },
      {
        id: 2,
        title: "شبكة العلاقات",
        description: "تواصل مع نخبة من الكفاءات والمحترفين في مختلف المجالات.",
      },
      {
        id: 3,
        title: "المشاركة المجتمعية",
        description: "ساهم في خدمة المجتمع من خلال مبادرات وبرامج متنوعة وهادفة.",
      },
      {
        id: 4,
        title: "الدعم المستمر",
        description: "استفد من دعم مستمر ومتابعة دائمة لضمان تحقيق أهدافك.",
      },
    ],
  },
  en: {
    title: "Join the YOD Family",
    description:
      "Be part of a distinguished community striving for development and creativity. Join thousands of members achieving their goals with us.",
    buttonText: "Join Now",
    benefits: [
      {
        id: 1,
        title: "Development Opportunities",
        description: "Access outstanding training and educational opportunities to develop your skills.",
      },
      {
        id: 2,
        title: "Networking",
        description: "Connect with a diverse network of professionals and experts across various fields.",
      },
      {
        id: 3,
        title: "Community Engagement",
        description: "Contribute to the community through diverse and purposeful initiatives and programs.",
      },
      {
        id: 4,
        title: "Continuous Support",
        description: "Benefit from ongoing support and guidance to ensure you achieve your goals.",
      },
    ],
  },
  tr: {
    title: "YOD Ailesine Katılın",
    description:
      "Gelişim ve yaratıcılık için çabalayan seçkin bir topluluğun parçası olun. Bizimle hedeflerine ulaşan binlerce üyeye katılın.",
    buttonText: "Şimdi Katıl",
    benefits: [
      {
        id: 1,
        title: "Gelişim Fırsatları",
        description: "Becerilerinizi geliştirmek için olağanüstü eğitim ve öğretim fırsatlarından yararlanın.",
      },
      {
        id: 2,
        title: "Ağ Kurma",
        description: "Farklı alanlardaki profesyoneller ve uzmanlardan oluşan çeşitli bir ağla bağlantı kurun.",
      },
      {
        id: 3,
        title: "Toplumsal Katılım",
        description: "Çeşitli ve amaçlı girişimler ve programlar aracılığıyla topluma katkıda bulunun.",
      },
      {
        id: 4,
        title: "Sürekli Destek",
        description: "Hedeflerinize ulaşmanızı sağlamak için sürekli destek ve rehberlikten yararlanın.",
      },
    ],
  },
};

interface JoinUsSectionProps {
  lang: string;
}

const JoinUsSection = ({ lang }: JoinUsSectionProps) => {
  const data = defaultBenefitsByLang[lang] || defaultBenefitsByLang.ar;

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-linear-to-br from-[#BE141B] to-[#58090D] text-white rounded-3xl p-10 md:p-16">
          {/* Top section */}
          <div className="text-center mx-auto">
            <h2 className="text-xl rtl:text-right ltr:text-left md:text-2xl font-extrabold mb-4 text-white">
              {data.title}
            </h2>
            <p className="rtl:text-right ltr:text-left leading-relaxed mb-8 text-white/80 text-md md:text-md">
              {data.description}
            </p>
            <button className="bg-white h-[50px] text-[#BE141B] text-2xl font-bold py-3 px-8">
              {data.buttonText}
            </button>
          </div>

          {/* Divider */}
          <div className="my-12 border-t border-white/20"></div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.benefits.map((benefit, index) => (
              <div
                key={benefit.id}
                className={`relative ${
                  index < data.benefits.length - 1
                    ? "rtl:sm:border-l ltr:sm:border-r sm:border-white/40"
                    : ""
                } ${index < 2 ? "rtl:lg:border-l ltr:lg:border-r lg:border-white/20" : ""}`}
              >
                <BenefitCard title={benefit.title} description={benefit.description} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;
