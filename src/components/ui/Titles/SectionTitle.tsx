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
      <h2 className="heading-2 text-xl md:text-2xl font-bold">{title}</h2>
      {subtitle && <p className="text-base text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
}
