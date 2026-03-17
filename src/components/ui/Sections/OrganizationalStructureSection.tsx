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

interface OrganizationalStructureSectionProps {
  members: BoardMember[];
  lang: string;
}

const OrganizationalStructureSection = ({
  members,
  lang,
}: OrganizationalStructureSectionProps) => {
  if (!members || members.length === 0) {
    return null;
  }

  // Group members by department
  const topLevel = members.filter((m) => !m.department);
  const departmentMap = new Map<string, BoardMember[]>();
  members
    .filter((m) => m.department)
    .forEach((m) => {
      const dept = m.department!;
      if (!departmentMap.has(dept)) departmentMap.set(dept, []);
      departmentMap.get(dept)!.push(m);
    });

  return (
    <div className="space-y-12">
      {/* Top-level leadership (no department) */}
      {topLevel.length > 0 && (
        <StaggerContainer className="flex flex-wrap justify-center gap-6">
          {topLevel.map((item) => (
            <StaggerItem key={item.id} className="w-full sm:w-64">
              <BoardMemberCard
                name={item.name}
                position={item.position}
                image={item.image}
                socialLinks={item.socialLinks}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Department groups */}
      {Array.from(departmentMap.entries()).map(([dept, deptMembers]) => (
        <div key={dept}>
          <h3 className="text-xl font-bold text-[#BE141B] text-center mb-6">
            {dept}
          </h3>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {deptMembers.map((item) => (
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
        </div>
      ))}
    </div>
  );
};

export default OrganizationalStructureSection;
