import { BookOpen, Trophy, Star, Award } from "lucide-react";
import { useAchievementsData } from "@/hooks/useAchievementsData";

interface Achievement {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string | React.ReactNode;
}

interface TimelineItemProps {
  achievement: Achievement;
  orientation: "left" | "right";
}

const TimelineItem = ({ achievement, orientation }: TimelineItemProps) => {
  const isLeft = orientation === "left";
  // If icon is a string, we might need to render it dynamically, but here we already converted it in the parent or use a default
  // Ideally, the parent should pass a ReactNode. But let's handle it if it's passed as a node.

  return (
    <div
      className={`mb-8 flex justify-between w-full items-center ${
        isLeft ? "md:flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="hidden md:block w-5/12"></div>
      <div className="relative z-10 flex items-center justify-center w-auto md:w-2/12">
        <div className="w-4 h-4 bg-white border-2 border-primary rounded-full"></div>
      </div>

      {/* 3. بطاقة المحتوى */}
      <div className="w-10/12 md:w-5/12">
        <div className="bg-white relative p-6 rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between gap-4 text-start">
            {/* المحتوى النصي */}
            <div className="grow">
              {/* تم نقل التاريخ إلى هنا */}
              <p className="text-sm font-semibold text-primary mb-2">
                {achievement.date}
              </p>
              <h3 className="card-title text-red-800 font-bold text-md md:text-xl mb-2">
                {achievement.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                {achievement.description}
              </p>
            </div>
            {/* الأيقونة */}
            <div className="shrink-0 p-4 bg-red-50 rounded-full">
              {typeof achievement.icon === 'string' ? <BookOpen className="w-8 h-8 text-[#BE141B]" /> : achievement.icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementsTimeline = () => {
  const { achievements, loading, error } = useAchievementsData();
  // دعم اتجاه اللغة
  const lang = typeof window !== 'undefined' ? document.documentElement.lang : 'ar';
  const isRTL = lang === 'ar';

  if (loading) {
    return (
      <section className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto flex justify-center">
           <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Or show error message
  }

  if (!achievements || achievements.length === 0) {
    return null;
  }

  const achievementsData: Achievement[] = achievements.map((item) => {
    return {
      ...item,
      icon: <Trophy className="w-8 h-8 text-[#BE141B]" />,
    };
  });

  return (
    <section className="w-full py-16 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* خط التايم لاين يظهر فقط على md وما فوق */}
          <div
            className="absolute h-full border border-dashed border-red-300 hidden md:block"
            style={isRTL ? { right: "50%", transform: "translateX(50%)" } : { left: "50%", transform: "translateX(-50%)" }}
          ></div>
          {/* لا تعرض أي خط على الجوال */}
          <div className="md:hidden"></div>
          {/* عرض الإنجازات كمكونات عادية في الجوال */}
          <div className="flex flex-col gap-8 md:gap-0">
            {achievementsData.map((achievement, index) => (
              <TimelineItem
                key={achievement.id}
                achievement={achievement}
                orientation={window.innerWidth < 768 ? 'left' : (isRTL ? (index % 2 === 0 ? "right" : "left") : (index % 2 === 0 ? "left" : "right"))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default AchievementsTimeline;