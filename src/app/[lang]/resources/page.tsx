import React from "react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getResourcesData } from "@/i18n/get-data";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import ArchiveCategoryCard from "@/components/ui/Cards/ArchiveCategoryCard";
import {
  BookOpen,
  Image as ImageIcon,
  CalendarDays,
  FileArchive,
} from "lucide-react";

interface ResourcesPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: ResourcesPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;

  const titles: Record<Locale, string> = {
    ar: "الأرشيف",
    en: "Resources",
    tr: "Arşiv",
  };

  const descriptions: Record<Locale, string> = {
    ar: "مكتبة الموارد والأرشيف الخاص باتحاد الطلاب اليمنيين في إلازيغ - مستندات، أدلة، وموارد مفيدة للطلاب.",
    en: "Resource library and archive of the Yemeni Students Union in Elazig - documents, guides, and useful resources for students.",
    tr: "Elazığ Yemenli Öğrenciler Birliği'nin kaynak kütüphanesi ve arşivi - belgeler, kılavuzlar ve öğrenciler için faydalı kaynaklar.",
  };
  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `https://yodelazig.org/${locale}/resources`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: titles[locale], description: descriptions[locale], images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/resources`,
      languages: { ar: "/ar/resources", en: "/en/resources", tr: "/tr/resources" },
    },
  };
}

const iconMap: { [key: string]: React.ReactNode } = {
  BookOpen: <BookOpen />,
  ImageIcon: <ImageIcon />,
  CalendarDays: <CalendarDays />,
  FileArchive: <FileArchive />,
};

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const resourcesData = await getResourcesData(locale);
  const dictionary = await getDictionary(locale);

  const breadcrumbs = [
    { label: dictionary.navigation.home, href: "/" },
    { label: (resourcesData as any).hero?.breadcrumb || dictionary.navigation.resources },
  ];

  const categories = (resourcesData as any).categories || [];

  return (
    <div>
      <SimplePageHero
        title={(resourcesData as any).hero?.title || dictionary.navigation.resources}
        breadcrumbs={breadcrumbs}
        lang={locale}
      />

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            staggerDelay={0.1}
          >
            {categories.map((category: any) => (
              <StaggerItem key={category.id}>
                <ArchiveCategoryCard
                  title={category.title}
                  description={category.description}
                  icon={iconMap[category.iconName]}
                  link={`/${locale}${category.link}`}
                  isPrivate={category.isPrivate}
                  backgroundImage={category.backgroundImage}
                  viewArchiveLabel={dictionary.buttons.viewArchive}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
