import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatCard = ({ icon, value, label }: StatCardProps) => (
  <div className="bg-white flex flex-col items-center justify-center p-6  rounded-2xl border-2 border-dashed border-primary text-center h-48 w-48">
    <div className="text-red-800">{icon}</div>
    <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
    <p className="text-lg md:text-lg text-gray-600 mt-1">{label}</p>
  </div>
);

export default StatCard;

