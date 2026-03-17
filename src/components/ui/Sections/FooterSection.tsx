"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface FooterProps {
  lang: Locale;
  dictionary: Dictionary;
}

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

const defaultSocialLinks = {
  facebook: "https://www.facebook.com/yod.elazig",
  instagram: "https://www.instagram.com/yod.elazig",
};

const defaultContactInfo = {
  email: "baroommaq@gmail.com",
  phone: "0534 838 92 97",
};

export default function Footer({ lang, dictionary }: FooterProps) {
  const quickLinks = dictionary.footer.quickLinks || [];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-[#181818] to-[#202020] text-white">
      {/* Background patterns */}
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
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="space-y-4 max-w-[200px]">
            <div className="flex items-end gap-3">
              <img
                src="/imgs/logos/yodellogo.webp"
                alt={dictionary.footer.logoAlt}
                className="h-20 object-contain"
                style={{ background: "transparent" }}
              />
            </div>
            <p className="text-xs leading-relaxed text-gray-300 text-justify">
              {dictionary.footer.aboutText}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold mb-4 text-red-600">
              {dictionary.footer.quickLinksTitle}
            </h2>
            <ul className="space-y-2 text-xs">
              {Array.isArray(quickLinks) &&
                quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`/${lang}${link.href === "/" ? "" : link.href}`}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold mb-4 text-red-600">
              {dictionary.footer.contactTitle}
            </h2>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-gray-300" />
                <a
                  href={`mailto:${defaultContactInfo.email}`}
                  className="text-gray-300 hover:text-white"
                >
                  {defaultContactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-gray-300" />
                <span className="text-gray-300" dir="ltr">
                  {defaultContactInfo.phone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={20} className="text-gray-300" />
                <span className="text-gray-300">{dictionary.footer.address}</span>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold mb-4 text-red-600">
              {dictionary.footer.followUsTitle}
            </h2>
            <div className="flex gap-4">
              {(["facebook", "instagram"] as const).map((platform) => {
                const Icon = socialIcons[platform];
                const url = defaultSocialLinks[platform];
                if (!Icon || !url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 hover:scale-110 transition-all duration-300 shadow-md"
                    aria-label={platform}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 text-center">
          <p className="text-xs text-white">
            &copy; {new Date().getFullYear()} {dictionary.footer.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
