import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react'; // أيقونة القفل
import { useTranslation } from "react-i18next";

interface ArchiveCategoryCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    isPrivate?: boolean; // خاصية لتحديد إذا كانت الفئة خاصة
    // 💡 أضفنا خاصية جديدة لعنوان صورة الخلفية
    backgroundImage: string;
}

export default function ArchiveCategoryCard({
    icon,
    title,
    description,
    link,
    isPrivate = false,
    backgroundImage
}: ArchiveCategoryCardProps) {
    const { t } = useTranslation();

    return (
        <Link to={link}>
            <div
                className=" relative h-64 md:h-72 w-full rounded-2xl overflow-hidden shadow-lg
                   hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer
                   group text-white"
            >
                {/* صورة الخلفية */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                    aria-label={title}
                ></div>

                {/* طبقة التدرج اللوني من الأسفل للأعلى مع تراكب لوني */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/10  flex flex-col justify-end p-6">
                    {/* أيقونة القفل إذا كانت الفئة خاصة */}
                    {isPrivate && (
                        <div className="absolute top-4 rtl:left-4 ltr:right-4 text-white/80 z-10" title="محتوى خاص للأعضاء">
                            <Lock size={20} />
                        </div>
                    )}

                    {/* الأيقونة الرئيسية - الآن في الجزء العلوي الأيسر كعلامة */}
                    <div className="absolute top-4 rtl:right-4 ltr:left-4 text-white/80 text-3xl z-10">
                        {icon}
                    </div>

                    <h3 className="text-xl font-bold mb-1 text-white">{title}</h3>
                    <p className="text-sm md:text-lg opacity-90 mb-4 line-clamp-2">{description}</p> {/* line-clamp لتحديد عدد الأسطر */}

                    <span className="text-sm font-semibold text-red-400 group-hover:text-red-300 group-hover:underline transition-colors">
                        {t('buttons.viewArchive')}
                    </span>
                </div>
            </div>
        </Link>
    );
}

