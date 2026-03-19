import Link from "next/link";
import { Locale } from "@/i18n/config";
import { MapPin, Calendar, User } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageDetailHeaderProps {
  locale: Locale;
  title: string;
  breadcrumbs: BreadcrumbItem[];
  subtitle?: string;
}

export default function PageDetailHeader({
  locale,
  title,
  breadcrumbs,
  subtitle,
}: PageDetailHeaderProps) {

  return (
    <section className="relative pt-24 pb-16 bg-linear-to-br from-red-800 to-red-900 text-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-lg md:text-xl font-bold leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-sm md:text-base mt-2">{subtitle}</p>
          )}
        </div>

        {/* Breadcrumbs at bottom */}
        <nav className="flex items-center gap-2 text-sm text-white/70">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-white truncate max-w-50">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}