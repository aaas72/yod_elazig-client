import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SEOBreadcrumbsProps {
  items: BreadcrumbItem[];
  lang: Locale;
  className?: string;
}

export default function SEOBreadcrumbs({ items, lang, className = "" }: SEOBreadcrumbsProps) {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://yodelazig.org/${lang}${item.href}` : undefined
    }))
  };

  const isRtl = lang === "ar";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav
        className={`flex items-center space-x-2 text-sm text-gray-600 mb-6 ${isRtl ? 'space-x-reverse' : ''} ${className}`}
        aria-label={lang === "ar" ? "تنقل الصفحة" : lang === "tr" ? "Sayfa navigasyonu" : "Page navigation"}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                size={16}
                className={`mx-2 text-gray-400 ${isRtl ? 'rotate-180' : ''}`}
              />
            )}
            {item.href && index < items.length - 1 ? (
              <Link
                href={`/${lang}${item.href}`}
                className="text-red-700 hover:text-red-800 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className={index === items.length - 1 ? "text-gray-800 font-semibold" : "text-gray-600"}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}