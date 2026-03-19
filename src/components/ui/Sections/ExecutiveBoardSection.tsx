"use client";

import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import BoardMemberCard from "@/components/ui/Cards/BoardMemberCard";
import FadeIn from "@/components/animations/FadeIn";

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  department?: string;
  image?: string;
  type: string;
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

  // Separate supervisory members (independent committee) by type
  const supervisoryMembers = members.filter((m) => m.type === 'supervisory');

  // Executive members only (excluding supervisory and organizational)
  const executiveMembers = members.filter((m) => m.type === 'executive');

  // Find president from executive members
  const president = executiveMembers.find(
    (m) =>
      m.position.includes("رئيس") ||
      m.position.toLowerCase().includes("president") ||
      m.position.toLowerCase().includes("başkan")
  ) || executiveMembers[0];

  // Other executive members (excluding president)
  const otherExecutiveMembers = executiveMembers.filter((m) => m.id !== president?.id);

  // Section titles
  const titles: Record<string, { supervisory: string }> = {
    ar: { supervisory: "اللجنة الرقابية" },
    en: { supervisory: "Supervisory Committee" },
    tr: { supervisory: "Denetim Komitesi" },
  };
  const t = titles[lang] || titles.ar;

  return (
    <div className="space-y-20">
      {/* Executive Board Section */}
      <div className="space-y-16">
        {/* President at the top */}
        {president && (
          <div className="flex justify-center">
            <BoardMemberCard
              name={president.name}
              position={president.position}
              department={president.department}
              image={president.image}
              socialLinks={president.socialLinks}
            />
          </div>
        )}

        {/* Executive members below president */}
        {otherExecutiveMembers.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-48 gap-y-16">
            {otherExecutiveMembers.map((member) => (
              <div key={member.id}>
                <BoardMemberCard
                  name={member.name}
                  position={member.position}
                  department={member.department}
                  image={member.image}
                  socialLinks={member.socialLinks}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supervisory Committee - Independent Section */}
      {supervisoryMembers.length > 0 && (
        <div className="space-y-10 pt-10 border-t-2 border-gray-100">
          <FadeIn direction="up">
            <h3 className="text-2xl font-bold text-gray-800 text-center">
              <span className="border-b-3 border-red-500 pb-2">{t.supervisory}</span>
            </h3>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-x-48 gap-y-16">
            {supervisoryMembers.map((member) => (
              <div key={member.id}>
                <BoardMemberCard
                  name={member.name}
                  position={member.position}
                  department={member.department}
                  image={member.image}
                  socialLinks={member.socialLinks}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveBoardSection;
