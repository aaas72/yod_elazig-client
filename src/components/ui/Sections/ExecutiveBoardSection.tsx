"use client";

import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import BoardMemberCard from "@/components/ui/Cards/BoardMemberCard";

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  department?: string;
  image?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface ExecutiveBoardSectionProps {
  members: BoardMember[];
  lang: string;
}

const ExecutiveBoardSection = ({ members, lang }: ExecutiveBoardSectionProps) => {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
      {members.map((item) => (
        <StaggerItem key={item.id}>
          <BoardMemberCard
            name={item.name}
            position={item.position}
            department={item.department}
            image={item.image}
            socialLinks={item.socialLinks}
          />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};

export default ExecutiveBoardSection;
