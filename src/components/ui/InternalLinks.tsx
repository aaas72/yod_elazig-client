import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface InternalLink {
  href: string;
  title: string;
  description?: string;
}

interface InternalLinksProps {
  lang: Locale;
  links: InternalLink[];
  title?: string;
  className?: string;
}

export default function InternalLinks({ lang, links, title, className = "" }: InternalLinksProps) {
  const defaultTitle = {
    ar: "صفحات ذات صلة",
    en: "Related Pages",
    tr: "İlgili Sayfalar"
  };

  return (
    <div className={`mt-16 p-6 bg-gray-50 rounded-xl border border-gray-100 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {title || defaultTitle[lang]}
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link, index) => (
          <Link
            key={index}
            href={`/${lang}${link.href}`}
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-red-200 hover:shadow-md transition-all duration-300 group"
          >
            <h4 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors mb-2">
              {link.title}
            </h4>
            {link.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {link.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}