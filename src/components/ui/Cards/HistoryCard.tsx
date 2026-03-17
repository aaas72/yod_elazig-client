"use client";

import React from "react";
import { MapPin } from "lucide-react";

interface HistoryCardProps {
    imageUrl: string;
    title: string;
    children: React.ReactNode;
}

const HistoryCard = ({ imageUrl, title, children }: HistoryCardProps) => {
    return (
        <div className="flex flex-col lg:flex-row rounded-[28px] overflow-hidden ">
            {/* Text section */}
            <div className="w-full lg:w-3/5 p-8 flex items-center">
                <div className="text-gray-700 leading-loose space-y-4 text-base md:text-lg text-justify">
                    {children}
                </div>
            </div>
            {/* Image section */}
            <div className="w-full lg:w-2/5 h-64 lg:h-auto relative shrink-0">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-red-800/70 via-transparent"></div>
                {/* Title at bottom */}
                <div className="absolute bottom-6 end-6 text-white">
                    <h3 className="text-lg font-bold drop-shadow-md">{title}</h3>
                </div>
                {/* Map button */}
                <button className="absolute bottom-4 start-4 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors duration-300">
                    <MapPin size={24} />
                </button>
            </div>
        </div>
    );
};

export default HistoryCard;
