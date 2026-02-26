import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import NewsletterForm from "@/components/ui/Forms/NewsletterForm";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSiteSettings } from '@/hooks/useSiteSettings';

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

const Footer = () => {
  const { settings } = useSiteSettings();
  const { t } = useTranslation();

  const quickLinks = [
    { href: "/", label: t("navigation.home") },
    { href: "/about", label: t("navigation.about") },
    { href: "/events", label: t("navigation.events") },
    { href: "/contact", label: t("navigation.contact") },
  ];

  return (
    <footer className="relative overflow-hidden bg-linear-to-r from-[#181818] to-[#202020] text-white">
      <div className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden z-0">
        <img
          src="/pattrens/mainSimplLine2.svg"
          alt=""
          className="w-screen max-w-none h-auto opacity-35"
        />
        <img
          src="/pattrens/mainSimplLine3.svg"
          alt=""
          className="w-screen max-w-none h-auto opacity-35"
        />
      </div>
      <div className="max-w-6xl mx-auto pt-12 pb-4 px-4 sm:px-6 lg:px-8 relative z-20">
        {/* الجزء العلوي من الفوتر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* القسم الأول: نبذة وشعار */}
          <div className="space-y-4">
            <div className="flex items-end  gap-3">
              <img
                suppressHydrationWarning
                src={settings?.logo ? (settings.logo.startsWith('http') ? settings.logo : `${import.meta.env.VITE_API_URL}${settings.logo}`) : "/imgs/logos/yodellogo.png"}
                alt={settings?.siteName?.ar || t("footer.logoAlt")}
                className="h-20 object-contain"
                style={{ background: 'transparent' }}
              />
            </div>
            <p className="text-xs leading-relaxed text-white">
              {t("footer.aboutText")}
            </p>
          </div>

          {/* القسم الثاني: روابط سريعة */}
          <div className="space-y-4">
            <h3 className="text-sm mb-4 text-white">
              {t("footer.quickLinksTitle")}
            </h3>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="hover:text-gray-300 transition-colors duration-300 text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* القسم الثالث: تواصل معنا */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold mb-4 text-white">
              {t("footer.contactTitle")}
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3">
                <Mail
                  size={20}
                  className="bg-linear-to-r from-secondary-dark to-secondary text-white"
                />
                <a
                  href={`mailto:${settings?.contactInfo?.email || ''}`}
                  className="hover:text-gray-300 text-white"
                >
                  {settings?.contactInfo?.email || ''}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-white" />
                <span className="text-white">{settings?.contactInfo?.phone || ''}</span>
              </li>
            </ul>
          </div>

          {/* القسم الرابع: وسائل التواصل الاجتماعي */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold mb-4 text-white">
              {t("footer.followUsTitle")}
            </h3>
            <div className="flex gap-4">
              {settings?.socialLinks && Object.entries(settings.socialLinks).map(([platform, url], index) => {
                const Icon = socialIcons[platform as keyof typeof socialIcons];
                if (!Icon || !url) return null;
                return (
                  <a
                    key={index}
                    href={url as string}
                    className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 hover:scale-110 transition-all duration-300 shadow-md"
                    aria-label={platform}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>

            {/* Elegant visit counter below social links */}
            <div className="flex flex-col items-center mt-8">
              <span
                style={{
                  fontSize: '3rem',
                  fontWeight: 'normal',
                  color: 'transparent',
                  WebkitTextStroke: '1px #fff',
                  letterSpacing: '2px',
                  textShadow: '0 2px 8px #0002',
                  opacity: 0.35,
                  display: 'block',
                }}
              >
                {typeof window !== 'undefined' && localStorage.getItem('siteVisitCount') ? localStorage.getItem('siteVisitCount') : '0'}
              </span>
              <span style={{fontSize:'0.9rem',color:'#fff',opacity:0.45,marginTop:'-8px',fontWeight:'400',letterSpacing:'1px'}}>
                {t('footer.visitCountLabel')}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 text-center">
          <p className="text-xs text-white">
            &copy; {new Date().getFullYear()} {t("footer.copyrightText")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
