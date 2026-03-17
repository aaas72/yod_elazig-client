import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getVolunteerData } from "@/i18n/get-data";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import VolunteerForm from "./VolunteerForm";
import FadeIn from "@/components/animations/FadeIn";

interface VolunteerPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: VolunteerPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;

  const titles: Record<Locale, string> = {
    ar: "التطوع",
    en: "Volunteer",
    tr: "Gönüllü Ol",
  };

  const descriptions: Record<Locale, string> = {
    ar: "انضم إلى فريق متطوعي اتحاد الطلاب اليمنيين في إلازيغ وشارك في بناء مجتمع طلابي نشط ومتماسك.",
    en: "Join the volunteer team of the Yemeni Students Union in Elazig and help build an active and cohesive student community.",
    tr: "Elazığ Yemenli Öğrenciler Birliği'nin gönüllü ekibine katılın ve aktif bir öğrenci topluluğu oluşturmaya yardımcı olun.",
  };
  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `https://yodelazig.org/${locale}/volunteer`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: titles[locale], description: descriptions[locale], images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/volunteer`,
      languages: { ar: "/ar/volunteer", en: "/en/volunteer", tr: "/tr/volunteer" },
    },
  };
}

export default async function VolunteerPage({ params }: VolunteerPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const volunteerData = (await getVolunteerData(locale)) as any;
  const dictionary = await getDictionary(locale);

  const breadcrumbs = [
    { label: dictionary.navigation.home, href: "/" },
    { label: volunteerData.hero?.breadcrumb || volunteerData.hero?.title || "التطوع" },
  ];

  return (
    <div>
      <SimplePageHero
        title={volunteerData.hero?.title || "التطوع"}
        breadcrumbs={breadcrumbs}
        lang={locale}
      />

      {/* Benefits Section */}
      <section className="section-spacing my-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" delay={0.1}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {volunteerData.content?.title || "كن جزءاً من التغيير"}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {volunteerData.content?.description || "التطوع ليس مجرد عمل، بل هو فرصة لترك أثر إيجابي"}
              </p>
            </div>
          </FadeIn>

          {volunteerData.content?.benefits && (
            <FadeIn direction="up" delay={0.2}>
              <div className="grid md:grid-cols-4 gap-4 mb-12">
                {volunteerData.content.benefits.map((benefit: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-red-200 transition-all"
                  >
                    <span className="text-3xl font-black text-red-600 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn direction="up" delay={0.3}>
            <VolunteerForm formLabels={volunteerData.form || {}} lang={locale} />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
