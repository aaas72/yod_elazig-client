"use client";

import React from "react";
import { Trophy, BookOpen } from "lucide-react";

export interface Achievement {
  id: string;
  date: string;
  title: string;
  description: string;
  icon?: string | React.ReactNode;
}

interface TimelineItemProps {
  achievement: Achievement & { resolvedIcon: React.ReactNode };
  orientation: "left" | "right";
}

const TimelineItem = ({ achievement, orientation }: TimelineItemProps) => {
  const isLeft = orientation === "left";

  return (
    <div
      className={`mb-8 flex justify-between w-full items-center ${
        isLeft ? "md:flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="hidden md:block w-5/12" />
      <div className="relative z-10 flex items-center justify-center w-auto md:w-2/12">
        <div className="w-4 h-4 bg-white border-2 border-primary rounded-full" />
      </div>

      {/* Content card */}
      <div className="w-10/12 md:w-5/12">
        <div className="bg-white relative p-6 rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between gap-4 text-start">
            {/* Text content */}
            <div className="grow">
              <p className="inline-block px-4 py-1 text-sm font-semibold bg-[#BE141B] text-white rounded-[50px] mb-2">
                {achievement.date}
              </p>
              <h3 className="card-title text-red-800 font-bold text-md md:text-xl mb-2">
                {achievement.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {achievement.description}
              </p>
            </div>
            {/* Icon */}
            <div className="shrink-0 p-4 bg-red-50 rounded-full">
              {achievement.resolvedIcon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AchievementsTimelineProps {
  achievements: Achievement[];
  lang: string;
}

const AchievementsTimeline = ({ achievements, lang }: AchievementsTimelineProps) => {
  const isRTL = lang === "ar";

  if (!achievements || achievements.length === 0) {
    return null;
  }

  const achievementsData = achievements.map((item) => ({
    ...item,
    resolvedIcon:
      typeof item.icon === "string" || item.icon === undefined ? (
        <Trophy className="w-8 h-8 text-[#BE141B]" />
      ) : (
        (item.icon as React.ReactNode)
      ),
  }));

  return (
    <section className="w-full py-16 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Timeline vertical line — md and above only */}
          <div
            className="absolute h-full border border-dashed border-red-300 hidden md:block"
            style={
              isRTL
                ? { right: "50%", transform: "translateX(50%)" }
                : { left: "50%", transform: "translateX(-50%)" }
            }
          />

          <div className="flex flex-col gap-8 md:gap-0">
            {achievementsData.map((achievement, index) => {
              // On mobile always use "left" (card on the right side, i.e. normal flow)
              // On desktop alternate based on RTL/LTR direction
              const orientation: "left" | "right" = isRTL
                ? index % 2 === 0
                  ? "right"
                  : "left"
                : index % 2 === 0
                ? "left"
                : "right";

              return (
                <TimelineItem
                  key={achievement.id}
                  achievement={achievement}
                  orientation={orientation}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsTimeline;
