import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  center?: boolean; // Add center prop
}

export default function SectionTitle({ title, subtitle, className = '', center = false }: SectionTitleProps) {
  return (
    <div className={`flex flex-col ${center ? 'items-center text-center' : 'items-start text-start'} ${className}`}>
      <h1 className="font-bold text-sm md:text-md lg:text-2xl">{title}</h1>
      {subtitle && <p className="text-body text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
}
