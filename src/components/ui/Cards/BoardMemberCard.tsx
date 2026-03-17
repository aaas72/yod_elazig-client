"use client";

import { resolveImage } from '@/utils/resolveImage';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface BoardMemberCardProps {
  name: string;
  position: string;
  department?: string;
  image?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const BoardMemberCard = ({ name, position, department, image, socialLinks }: BoardMemberCardProps) => {
  const socials = [
    { key: 'facebook', url: socialLinks?.facebook, icon: Facebook, color: 'hover:bg-[#1877F2] hover:text-white' },
    { key: 'instagram', url: socialLinks?.instagram, icon: Instagram, color: 'hover:bg-[#E4405F] hover:text-white' },
    { key: 'linkedin', url: socialLinks?.linkedin, icon: Linkedin, color: 'hover:bg-[#0A66C2] hover:text-white' },
  ].filter((s) => s.url);

  return (
    <div className="group relative flex flex-col items-center text-center">
      {/* الصورة مع إطار مزدوج */}
      <div className="relative mb-5">
        {/* حلقة خارجية متحركة */}
        <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#BE141B] group-hover:border-[#BE141B] group-hover:rotate-180 transition-all duration-1000"></div>
        {/* حاوية الصورة */}
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-[0_0_30px_rgba(190,20,27,0.25)] transition-all duration-500 relative z-10">
          <img
            src={resolveImage(image, { folder: 'board-members', fallback: '/imgs/default-avatar.png' })}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        {/* أيقونات السوشيال ميديا */}
        {socials.length > 0 ? (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {socials.map(({ key, url, icon: Icon, color }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full bg-[#BE141B] border-2 border-white flex items-center justify-center text-white shadow-md transition-all duration-300 ${color} hover:scale-110 hover:shadow-lg`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        ) : (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#BE141B] rounded-full border-3 border-white z-20 shadow-md group-hover:scale-125 transition-transform duration-300"></div>
        )}
      </div>

      {/* الاسم */}
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#BE141B] transition-colors duration-300 mb-1">
        {name}
      </h3>

      {/* المنصب */}
      <p className="text-[#BE141B] text-sm font-semibold mb-2">{position}</p>

      {/* القسم */}
      {department && (
        <span className="text-gray-400 text-xs tracking-wide">{department}</span>
      )}

      {/* خط سفلي */}
      <div className="mt-3 w-10 h-[2px] bg-[#BE141B]/40 group-hover:w-20 transition-all duration-500 rounded-full"></div>
    </div>
  );
};

export default BoardMemberCard;
