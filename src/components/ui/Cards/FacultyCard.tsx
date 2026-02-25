import React from 'react';
import { useTranslation } from 'react-i18next';

interface FacultyCardProps {
    icon: React.ReactNode;
    name: string;
    link: string;
}

export default function FacultyCard({icon, name, link}: FacultyCardProps) {
    const { t } = useTranslation();

    return (
        <div
            className="bg-linear-to-tr from-[#fdecec] to-[#FFD4D4] rounded-lg  p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-5xl text-primary mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-red-800 mb-4 h-14">{name}</h3>
            <a href={link} target="_blank" rel="noopener noreferrer">
                  <span className="mt-auto text-sm font-semibold text-primary hover:text-primary-dark">
                    {t('buttons.viewSpecialties')}
                  </span>
            </a>
        </div>
    );
}

