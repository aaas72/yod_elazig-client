import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getProgramsPageData } from "@/i18n/get-data";
import { getPrograms } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import ProgramCard from "@/components/ui/Cards/ProgramCard";

interface ProgramsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: ProgramsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;
  const content: Record<Locale, { title: string; description: string }> = {
    ar: { title: "برامجنا", description: "اكتشف برامج اتحاد الطلاب اليمنيين في إلازيغ - برامج دراسية، تدريبية، وتطوير مهارات للطلاب اليمنيين." },
    en: { title: "Programs", description: "Discover the programs of the Yemeni Students Union in Elazig - academic, training, and skill development programs for Yemeni students." },
    tr: { title: "Programlarımız", description: "Elazığ'daki Yemenli Öğrenciler Birliği'nin programlarını keşfedin - akademik, eğitim ve beceri geliştirme programları." },
  };
  const { title, description } = content[locale];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://yodelazig.org/${locale}/programs`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/programs`,
      languages: { ar: "/ar/programs", en: "/en/programs", tr: "/tr/programs" },
    },
  };
}

export const revalidate = 60;

export default async function ProgramsPage({ params }: ProgramsPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;

  let programs: Awaited<ReturnType<typeof getPrograms>> = [];
  try {
    programs = await getPrograms(locale);
  } catch {}

  const pageData = await getProgramsPageData(locale);

  const getTitle = (title: string | Record<string, string>) => {
    if (typeof title === "string") return title;
    return title[locale] || title.ar || Object.values(title)[0] || "";
  };

  const sortedPrograms = [...programs].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <SimplePageHero
        title={pageData.hero.title}
        breadcrumbs={pageData.hero.breadcrumbs}
        lang={locale}
      />
      <section className="md:p-12 p-6">
        <div className="max-w-6xl mx-auto">
          {sortedPrograms.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">
                {locale === "ar"
                  ? "لا توجد برامج حالياً"
                  : locale === "tr"
                  ? "Şu anda program bulunmuyor"
                  : "No programs available"}
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPrograms.map((program) => (
                <StaggerItem key={program.slug || program._id}>
                  <Link href={`/${locale}/programs/${program.slug || program._id}`}>
                    <ProgramCard
                      title={getTitle(program.title)}
                      description=""
                      imageUrl={program.coverImage}
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}
