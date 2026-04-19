import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";

interface TermsPageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const content = dictionary.legal.terms;

  return {
    title: content.title,
    description: content.intro,
    alternates: {
      canonical: `/${locale}/terms-of-use`,
      languages: {
        ar: "/ar/terms-of-use",
        en: "/en/terms-of-use",
        tr: "/tr/terms-of-use",
      },
    },
  };
}

export default async function TermsOfUsePage({ params }: TermsPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const content = dictionary.legal.terms;

  return (
    <>
      <SimplePageHero
        title={content.title}
        breadcrumbs={[
          { label: dictionary.navigation.home, href: "/" },
          { label: content.title },
        ]}
        lang={locale}
      />

      <div className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <article className=" border border-gray-200 p-6 md:p-10 shadow-sm">
            <header className="pb-8 border-b border-gray-200">
              <p className="text-xs md:text-sm text-gray-500 mt-2">{content.updatedAt}</p>
              <div className="mt-5 space-y-3 text-gray-700 text-base md:text-lg leading-relaxed text-justify">
                <p>{content.introTitle}</p>
                <p>{content.intro}</p>
              </div>
            </header>

            <div className="mt-8 space-y-8">
              {content.sections.map((section, index) => (
                <section key={`${section.title}-${index}`} className="pt-6 border-t border-gray-100 first:border-t-0 first:pt-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                  <ul className="ps-6 list-disc marker:text-gray-500 text-gray-700 text-sm md:text-base leading-8 space-y-2 text-justify">
                    {section.points.map((point, pointIndex) => (
                      <li key={`${section.title}-point-${pointIndex}`}>{point}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
