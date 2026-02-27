import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useSiteSettings } from '@/hooks/useSiteSettings';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent | MediaQueryList) =>
      setMatches(e.matches);

    setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const DesktopNav = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { href: "/", label: t("navigation.home") },
    { href: "/about", label: t("navigation.about") },
    { href: "/news", label: t("navigation.news") },
    { href: "/events", label: t("navigation.events") },
    { href: "/programs", label: t("navigation.programs") },
    { href: "/about-city", label: t("navigation.aboutCity") },
    { href: "/about-university", label: t("navigation.aboutUniversity") },
    { href: "/resources", label: t("navigation.resources") },
    { href: "/faq", label: t("navigation.faq") },
    { href: "/contact", label: t("navigation.contact") },
    { href: "/volunteer", label: t("navigation.volunteer") },
  ];

  return (
    <nav className="hidden lg:flex justify-center items-center text-white">
      <ul className="flex items-center gap-2 list-none">
        {navLinks.map((link) => {
          // تمييز الصفحة النشطة بدقة
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                to={link.href}
                className={` xl:px-2 py-2  rounded-full text-sm xl:text-md font-medium transition-all duration-300  ${
                  isActive
                    ? "bg-white text-red-700"
                    : "bg-transparent hover:bg-white/20"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
        {/* Language Button */}
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
};

const MobileNavMenu = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
}) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  // mobile menu links mirror the desktop ones (plus activities)
  const navLinks = [
    { href: "/", label: t("navigation.home") },
    { href: "/about", label: t("navigation.about") },
    { href: "/news", label: t("navigation.news") },
    { href: "/events", label: t("navigation.events") },
    { href: "/programs", label: t("navigation.programs") },
    { href: "/about-city", label: t("navigation.aboutCity") },
    { href: "/about-university", label: t("navigation.aboutUniversity") },
    { href: "/resources", label: t("navigation.resources") },
    { href: "/contact", label: t("navigation.contact") },
    { href: "/volunteer", label: t("navigation.volunteer") },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <div
      className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xl overflow-y-auto flex flex-col items-center pt-24 z-999 transition-transform duration-300 ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      <ul className="flex flex-col items-center gap-y-10 list-none">
        {navLinks.map((link) => {
          // تمييز الصفحة النشطة بدقة
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-xl font-bold px-6 py-3 rounded-full transition-all ${
                  isActive
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}

        <li className="pt-4" onClick={(e) => e.stopPropagation()}>
          <LanguageSwitcher />
        </li>
      </ul>
    </div>
  );
};
const DesktopHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container max-w-[1440px] h-[70px] m-auto flex justify-between items-center md:px-8">
        <Link to="/">
          <img
            src="/imgs/logos/yodellogo.png"
            alt="YÖSOT Logo"
            className="w-[100px] h-auto object-contain"
            style={{ background: 'transparent' }}
          />
        </Link>
        <DesktopNav />
      </div>
    </header>
  );
};

const MobileHeader = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isMenuOpen
          ? "bg-black/40 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center h-[100px] px-4 max-w-[1440px] mx-auto">
        <Link to="/">
          <img
            src="/imgs/logos/yodellogo.png"
            alt="YÖSOT Logo"
            className="w-[100px] my-4 object-contain"
            style={{ background: 'transparent' }}
          />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white bg-white/20 backdrop-blur-lg border border-white rounded-full p-2 hover:bg-white/30 transition-all"
        >
          <HiMenu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {isDesktop ? (
        <DesktopHeader />
      ) : (
        <>
          <MobileHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <MobileNavMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </>
      )}
    </>
  );
}
