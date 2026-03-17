"use client";

import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

interface ArchiveCategoryCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    isPrivate?: boolean;
    backgroundImage: string;
    viewArchiveLabel?: string;
}

export default function ArchiveCategoryCard({
    icon,
    title,
    description,
    link,
    isPrivate = false,
    backgroundImage,
    viewArchiveLabel = "View Archive",
}: ArchiveCategoryCardProps) {
    return (
        <Link href={link}>
            <div
                className=" relative h-64 md:h-72 w-full rounded-2xl overflow-hidden shadow-lg
                   hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer
                   group text-white"
            >
                {/* Background image */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                    aria-label={title}
                ></div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/10  flex flex-col justify-end p-6">
                    {/* Lock icon for private categories */}
                    {isPrivate && (
                        <div className="absolute top-4 end-4 text-white/80 z-10" title="Private content">
                            <Lock size={20} />
                        </div>
                    )}

                    {/* Main icon */}
                    <div className="absolute top-4 start-4 text-white/80 text-3xl z-10">
                        {icon}
                    </div>

                    <h3 className="text-xl font-bold mb-1 text-white">{title}</h3>
                    <p className="text-sm md:text-lg opacity-90 mb-4 line-clamp-2">{description}</p>

                    <span className="text-sm font-semibold text-red-400 group-hover:text-red-300 group-hover:underline transition-colors">
                        {viewArchiveLabel}
                    </span>
                </div>
            </div>
        </Link>
    );
}
