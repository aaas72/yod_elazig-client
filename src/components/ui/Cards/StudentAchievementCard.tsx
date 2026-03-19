"use client";

import { resolveImage } from '@/utils/resolveImage';
import { Award, Facebook, Instagram, Linkedin } from 'lucide-react';

interface StudentAchievementCardProps {
  name: string;
  description: string;
  category?: string;
  image?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt?: string;
}

const StudentAchievementCard = ({ name, description, category, image, socialLinks, createdAt }: StudentAchievementCardProps) => {
  const socials = [
    { key: 'facebook', url: socialLinks?.facebook, icon: Facebook, color: 'hover:bg-[#1877F2]' },
    { key: 'instagram', url: socialLinks?.instagram, icon: Instagram, color: 'hover:bg-[#E4405F]' },
    { key: 'linkedin', url: socialLinks?.linkedin, icon: Linkedin, color: 'hover:bg-[#0A66C2]' },
  ].filter((s) => s.url);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(190,20,27,0.15)] transition-all duration-500 hover:-translate-y-1">
      {/* الشريط العلوي المتدرج */}
      <div className="h-40 bg-linear-to-br from-[#BE141B] via-[#d4393f] to-[#a11015] relative overflow-hidden">
        {/* زخرفة خلفية */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-10 h-10 border-2 border-white rounded-full"></div>
          <div className="absolute top-4 left-1/2 w-6 h-6 border border-white rounded-full"></div>
        </div>
        {/* أيقونة الإنجاز */}
        <div className="absolute top-3 inset-s-3 w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
          <Award size={20} className="text-white drop-shadow-md" />
        </div>
        {/* أيقونات السوشيال ميديا */}
        {socials.length > 0 && (
          <div className="absolute top-3 end-3 flex items-center gap-1.5">
            {socials.map(({ key, url, icon: Icon, color }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-lg transition-all duration-300 ${color} hover:scale-110 hover:shadow-lg`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* صورة الطالب - تتداخل مع الشريط */}
      <div className="flex justify-center -mt-[6.5rem] relative z-10">
        <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-500 ring-2 ring-[#BE141B]/20 group-hover:ring-[#BE141B]/40">
          <img
            src={resolveImage(image, { folder: 'student-achievements', fallback: '/imgs/default-avatar.png' })}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      {/* المحتوى */}
      <div className="px-6 pt-4 pb-6 text-center">
        {/* اسم الطالب */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#BE141B] transition-colors duration-300">
          {name}
        </h3>

        {/* فئة الجائزة */}
        {category && (
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#BE141B]/10 text-[#BE141B] rounded-full mb-3">
            {category}
          </span>
        )}

        {/* التاريخ */}
        {createdAt && (
          <span className="inline-block px-4 py-1 text-xs font-semibold bg-[#BE141B] text-white rounded-[50px] mb-3">
            {new Date(createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        )}

        {/* خط فاصل مزخرف */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-0.5 bg-[#BE141B]/30 group-hover:w-8 transition-all duration-300"></div>
          <div className="w-2 h-2 rounded-full bg-[#BE141B]/50"></div>
          <div className="w-6 h-0.5 bg-[#BE141B]/30 group-hover:w-8 transition-all duration-300"></div>
        </div>

        {/* الوصف */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* شريط سفلي */}
      <div className="h-1 bg-linear-to-r from-transparent via-[#BE141B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default StudentAchievementCard;
