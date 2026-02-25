import React from 'react';
import Image from '../Image';
import { Link } from 'react-router-dom';
import FadeIn from "@/components/animations/FadeIn";

interface Breadcrumb {
    label: string;
    href?: string; // الرابط اختياري
}

interface PageHeroProps {
    subtitle?: string; // made optional
    title: string;
    description?: string; // Added description
    imageUrl?: string; // made optional and renamed from image in FaqPage usage, or we can map image to imageUrl
    image?: string; // Supporting both for backward compatibility or ease of use
    imageAlt?: string; // made optional
    breadcrumbs?: Breadcrumb[]; // made optional
    direction?: 'rtl' | 'ltr'; // الاتجاه اختياري، الافتراضي هو 'rtl'
    gradientFrom?: string; // لون بداية التدرج
    gradientTo?: string;   // لون نهاية التدرج
}

// 2. المكون الآن يقبل الخصائص (props)
export default function PageHero({
                                     subtitle,
                                     title,
                                     description,
                                     imageUrl,
                                     image, // Destructure image prop
                                     imageAlt = "Hero Image",
                                     breadcrumbs = [],
                                     direction = 'rtl', // القيمة الافتراضية
                                     gradientFrom = 'from-[#8B0F14]/100', // القيمة الافتراضية
                                     gradientTo = 'to-[#BE141B]/50',     // القيمة الافتراضية
                                 }: PageHeroProps) {
    
    // Determine the actual image source
    const actualImageUrl = imageUrl || image || "";

    return (
        <section dir={direction} className="relative h-[60vh] md:h-[80vh] w-full text-white rounded-b-[36px] overflow-hidden">
            {/* 3. استخدام next/image لتحسين أداء الصورة */}
            {actualImageUrl && (
                <Image
                    src={actualImageUrl}
                    alt={imageAlt}
                    className="absolute inset-0 w-full h-full object-cover rounded-b-[36px]"
                />
            )}
            {/* 4. استخدام متغيرات التدرج اللوني */}
            <div
                className={`absolute inset-0 bg-linear-to-t ${gradientFrom} ${gradientTo} rounded-b-[36px] overflow-hidden`}></div>

            {/* 5. استخدام متغيرات العناوين */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
                {subtitle && (
                    <FadeIn direction="up">
                        <h2 className="text-xl md:text-2xl  text-white">
                            {subtitle}
                        </h2>
                    </FadeIn>
                )}
                <FadeIn direction="up" delay={0.2}>
                    <h1 className="text-xl md:text-4xl font-extrabold mt-2 drop-shadow-lg">
                        {title}
                    </h1>
                </FadeIn>
                 {description && (
                    <FadeIn direction="up" delay={0.3}>
                        <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto drop-shadow-md opacity-90">
                            {description}
                        </p>
                    </FadeIn>
                )}
            </div>

            {/* 6. إنشاء مسار التنقل (Breadcrumbs) بشكل ديناميكي */}
            {breadcrumbs.length > 0 && (
                <div className="absolute bottom-20  right-6 z-20 text-sm opacity-80 flex items-center">
                    <FadeIn direction="left" delay={0.4}>
                        <div className="flex items-center">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    {crumb.href ? (
                                        <Link to={crumb.href} className="hover:underline">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span>{crumb.label}</span>
                                    )}
                                    {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            )}

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
