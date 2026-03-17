"use client";

import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import StudentAchievementCard from "@/components/ui/Cards/StudentAchievementCard";

export interface StudentAchievement {
  id: string;
  name: string;
  description: string;
  category?: string;
  image?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt?: string;
}

interface StudentAchievementsSectionProps {
  achievements: StudentAchievement[];
  lang: string;
}

const StudentAchievementsSection = ({
  achievements,
  lang,
}: StudentAchievementsSectionProps) => {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {achievements.map((item) => (
        <StaggerItem key={item.id}>
          <StudentAchievementCard
            name={item.name}
            description={item.description}
            category={item.category}
            image={item.image}
            socialLinks={item.socialLinks}
            createdAt={item.createdAt}
          />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};

export default StudentAchievementsSection;
