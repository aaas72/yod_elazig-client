"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavBarProps {
  lang: Locale;
  dictionary: Dictionary;
}

// Custom hook for media query
function useMediaQuery(query: string) {
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
}

// Desktop Navigation
function DesktopNav({ lang, dictionary }: NavBarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: `/${lang}`, label: dictionary.navigation.home },
    { href: `/${lang}/about`, label: dictionary.navigation.about },
    { href: `/${lang}/news`, label: dictionary.navigation.news },
    { href: `/${lang}/events`, label: dictionary.navigation.events },
    { href: `/${lang}/programs`, label: dictionary.navigation.programs },
    { href: `/${lang}/about-city`, label: dictionary.navigation.aboutCity },
    { href: `/${lang}/about-university`, label: dictionary.navigation.aboutUniversity },
    { href: `/${lang}/resources`, label: dictionary.navigation.resources },
    { href: `/${lang}/faq`, label: dictionary.navigation.faq },
    { href: `/${lang}/contact`, label: dictionary.navigation.contact },
    { href: `/${lang}/volunteer`, label: dictionary.navigation.volunteer },
  ];

  return (
    <nav className="hidden lg:flex justify-center items-center text-white">
      <ul className="flex items-center gap-2 list-none">
        {navLinks.map((link) => {
          const isActive =
            link.href === `/${lang}`
              ? pathname === `/${lang}` || pathname === `/${lang}/`
              : pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`xl:px-2 py-2 rounded-full text-sm xl:text-md font-medium transition-all duration-300 ${isActive
                    ? "bg-white text-red-700"
                    : "bg-transparent hover:bg-white/20"
                  }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
        <li>
          <LanguageSwitcher currentLang={lang} />
        </li>
      </ul>
    </nav>
  );
}

// Mobile Navigation Menu
function MobileNavMenu({
  isMenuOpen,
  setIsMenuOpen,
  lang,
  dictionary,
}: NavBarProps & {
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const navLinks = [
    { href: `/${lang}`, label: dictionary.navigation.home },
    { href: `/${lang}/about`, label: dictionary.navigation.about },
    { href: `/${lang}/news`, label: dictionary.navigation.news },
    { href: `/${lang}/events`, label: dictionary.navigation.events },
    { href: `/${lang}/programs`, label: dictionary.navigation.programs },
    { href: `/${lang}/about-city`, label: dictionary.navigation.aboutCity },
    { href: `/${lang}/about-university`, label: dictionary.navigation.aboutUniversity },
    { href: `/${lang}/resources`, label: dictionary.navigation.resources },
    { href: `/${lang}/faq`, label: dictionary.navigation.faq },
    { href: `/${lang}/contact`, label: dictionary.navigation.contact },
    { href: `/${lang}/volunteer`, label: dictionary.navigation.volunteer },
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
      className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xl overflow-y-auto flex flex-col items-center pt-20 z-[999] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      onClick={() => setIsMenuOpen(false)}
    >
      <ul className="flex flex-col items-center gap-y-6 list-none w-full">
        <li className="pb-2" onClick={(e) => e.stopPropagation()}>
          <LanguageSwitcher currentLang={lang} isMobile />
        </li>
        {navLinks.map((link, idx) => {
          const isActive =
            link.href === `/${lang}`
              ? pathname === `/${lang}` || pathname === `/${lang}/`
              : pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-base md:text-lg font-bold px-6 py-2 rounded-full transition-all ${isActive
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/20"
                  }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Desktop Header
function DesktopHeader({ lang, dictionary }: NavBarProps) {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="container max-w-[1440px] h-[70px] m-auto flex justify-between items-center md:px-8">
        <Link href={`/${lang}`}>
          <img
            src="/imgs/logos/yodellogo.webp"
            alt="YOD Logo"
            width={100}
            height={40}
            className="w-[100px] h-auto object-contain"
            style={{ background: "transparent" }}
          />
        </Link>
        <DesktopNav lang={lang} dictionary={dictionary} />
      </div>
    </header>
  );
}

// Mobile Header
function MobileHeader({
  isMenuOpen,
  setIsMenuOpen,
  lang,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
  lang: Locale;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMenuOpen
          ? "bg-black/40 backdrop-blur-sm"
          : "bg-transparent"
        }`}
    >
      <div className="flex justify-between items-center h-[70px] px-4 max-w-[1440px] mx-auto">
        <Link href={`/${lang}`}>
          <img
            src="/imgs/logos/yodellogo.webp"
            alt="YOD Logo"
            width={90}
            height={36}
            className="w-[90px] object-contain"
            style={{ background: "transparent" }}
          />
        </Link>
        <button
          className="text-white bg-white/20 backdrop-blur-lg border border-white rounded-full p-2 hover:bg-white/30 transition-all"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMenuOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </button>
      </div>
    </header>
  );
}

// Main NavBar Component
export default function NavBar({ lang, dictionary }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-[70px] lg:h-[70px] bg-black/30 backdrop-blur-sm" />
    );
  }

  return (
    <>
      {isDesktop ? (
        <DesktopHeader lang={lang} dictionary={dictionary} />
      ) : (
        <>
          <MobileHeader
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            lang={lang}
          />
          <MobileNavMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            lang={lang}
            dictionary={dictionary}
          />
        </>
      )}
    </>
  );
}
