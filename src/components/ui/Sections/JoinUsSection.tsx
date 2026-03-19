"use client";

interface BenefitCardProps {
  title: string;
  description: string;
}

const BenefitCard = ({ title, description }: BenefitCardProps) => (
  <div className="text-center md:text-start px-6">
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
    title: "انضم إلى اتحاد الطلاب اليمنيين",
    description:
      "كن جزءاً من مجتمع طلابي متميز في إلازيغ، وانضم إلى الطلاب اليمنيين الذين يحققون أهدافهم الأكاديمية والمهنية معنا.",
    buttonText: "انضم الآن",
    benefits: [
      {
        id: 1,
        title: "الدعم الأكاديمي",
        description: "احصل على دعم مستمر في دراستك ومصادر تعليمية متنوعة للتفوق الأكاديمي.",
      },
      {
        id: 2,
        title: "الأنشطة الثقافية",
        description: "شارك في فعالياتنا الثقافية والاجتماعية التي تعزز الهوية اليمنية والثقافة العربية.",
      },
      {
        id: 3,
        title: "شبكة الطلاب",
        description: "تواصل مع زملائك الطلاب اليمنيين وبناء صداقات وعلاقات مهنية تدوم مدى الحياة.",
      },
      {
        id: 4,
        title: "التوجيه والإرشاد",
        description: "استفد من خبرات الطلاب الخريجين والتوجيه المهني لبناء مستقبلك بنجاح.",
      },
    ],
  },
  en: {
    title: "Join the Yemeni Students Union",
    description:
      "Be part of a distinguished student community in Elazığ. Join Yemeni students achieving their academic and professional goals with us.",
    buttonText: "Join Now",
    benefits: [
      {
        id: 1,
        title: "Academic Support",
        description: "Get continuous support in your studies and diverse educational resources for academic excellence.",
      },
      {
        id: 2,
        title: "Cultural Activities",
        description: "Participate in our cultural and social events that promote Yemeni identity and Arab culture.",
      },
      {
        id: 3,
        title: "Student Network",
        description: "Connect with fellow Yemeni students and build lifelong friendships and professional relationships.",
      },
      {
        id: 4,
        title: "Mentoring & Guidance",
        description: "Benefit from graduate student experiences and career guidance to build your future successfully.",
      },
    ],
  },
  tr: {
    title: "Yemen Öğrenci Birliğine Katılın",
    description:
      "Elazığ'daki seçkin öğrenci topluluğunun bir parçası olun. Bizimle akademik ve mesleki hedeflerine ulaşan Yemenli öğrencilere katılın.",
    buttonText: "Şimdi Katıl",
    benefits: [
      {
        id: 1,
        title: "Akademik Destek",
        description: "Çalışmalarınızda sürekli destek ve akademik mükemmellik için çeşitli eğitim kaynakları alın.",
      },
      {
        id: 2,
        title: "Kültürel Etkinlikler",
        description: "Yemen kimliğini ve Arap kültürünü destekleyen kültürel ve sosyal etkinliklerimize katılın.",
      },
      {
        id: 3,
        title: "Öğrenci Ağı",
        description: "Fellow Yemen öğrencilerle bağlantı kurun ve yaşam boyu sürecek dostluklar ve mesleki ilişkiler inşa edin.",
      },
      {
        id: 4,
        title: "Mentorluk ve Rehberlik",
        description: "Mezun öğrenci deneyimlerinden ve kariyer rehberliğinden yararlanarak geleceğinizi başarıyla inşa edin.",
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
            <h2 className="text-xl text-start md:text-2xl font-extrabold mb-4 text-white">
              {data.title}
            </h2>
            <p className="text-start leading-relaxed mb-8 text-white/80 text-md md:text-md">
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
                    ? "sm:border-e sm:border-white/40"
                    : ""
                } ${index < 2 ? "lg:border-e lg:border-white/20" : ""}`}
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
