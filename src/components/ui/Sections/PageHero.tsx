"use client";

import React from "react";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  /** Also accepted as backgroundImage alias */
  imageUrl?: string;
  imageAlt?: string;
  breadcrumbs?: Breadcrumb[];
  lang?: string;
  direction?: "rtl" | "ltr";
  gradientFrom?: string;
  gradientTo?: string;
}

export default function PageHero({
  title,
  subtitle,
  description,
  backgroundImage,
  imageUrl,
  imageAlt = "Hero Image",
  breadcrumbs = [],
  lang = "ar",
  gradientFrom = "from-[#8B0F14]/100",
  gradientTo = "to-[#BE141B]/50",
}: PageHeroProps) {
  const actualImageUrl = backgroundImage || imageUrl || "";

  return (
    <section
      className={`relative w-full text-white rounded-b-[36px] overflow-hidden ${
        actualImageUrl
          ? "h-[60vh] md:h-[80vh]"
          : "py-16 bg-gradient-to-l from-red-600 to-red-800"
      }`}
    >
      {/* Background image */}
      {actualImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={actualImageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover rounded-b-[36px]"
        />
      )}

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-t ${gradientFrom} ${gradientTo} rounded-b-[36px] overflow-hidden`}
      />

      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 sm:px-8 py-4">
        {subtitle && (
          <FadeIn direction="up">
            <h2 className="text-h4 md:text-h3 text-white">{subtitle}</h2>
          </FadeIn>
        )}

        <FadeIn direction="up" delay={0.2}>
          <h1 className="text-h1 font-extrabold mt-2 drop-shadow-lg whitespace-normal wrap-break-word">
            {title}
          </h1>
        </FadeIn>

        {description && (
          <FadeIn direction="up" delay={0.3}>
            <p className="text-body md:text-card mt-4 max-w-2xl mx-auto drop-shadow-md opacity-90">
              {description}
            </p>
          </FadeIn>
        )}
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="absolute bottom-20 end-6 z-20 text-sm opacity-80 flex items-center">
          <FadeIn direction="left" delay={0.4}>
            <div className="flex items-center">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {crumb.href ? (
                    <Link
                      href={`/${lang}${crumb.href === "/" ? "" : crumb.href}`}
                      className="hover:underline"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="mx-2">/</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </FadeIn>
        </div>
      )}

      {/* Decorative bottom pattern */}
      <div className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2 z-10 overflow-hidden">
        <img
          src="/pattrens/simplLine.svg"
          alt=""
          className="w-screen max-w-none h-auto"
        />
      </div>
    </section>
  );
}
