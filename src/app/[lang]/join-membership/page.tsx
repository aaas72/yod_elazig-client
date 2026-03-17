import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { notFound } from "next/navigation";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import MembershipForm from "./MembershipForm";

interface JoinMembershipPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: JoinMembershipPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;

  const titles: Record<Locale, string> = {
    ar: "التسجيل في عضوية الاتحاد",
    en: "Join Union Membership",
    tr: "Birlik Üyeliğine Kayıt",
  };

  const descriptions: Record<Locale, string> = {
    ar: "سجّل الآن لتصبح عضواً في اتحاد الطلاب اليمنيين في إلازيغ واستفد من جميع الخدمات والدعم المقدم للطلاب.",
    en: "Register now to become a member of the Yemeni Students Union in Elazig and benefit from all services and support provided to students.",
    tr: "Elazığ'daki Yemenli Öğrenciler Birliği'ne üye olmak için şimdi kaydolun ve öğrencilere sunulan tüm hizmetlerden yararlanın.",
  };
  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `https://yodelazig.org/${locale}/join-membership`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: titles[locale], description: descriptions[locale], images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/join-membership`,
      languages: { ar: "/ar/join-membership", en: "/en/join-membership", tr: "/tr/join-membership" },
    },
  };
}

export default async function JoinMembershipPage({ params }: JoinMembershipPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;

  const breadcrumbs = [
    { label: locale === "ar" ? "الرئيسية" : locale === "tr" ? "Ana Sayfa" : "Home", href: "/" },
    { label: locale === "ar" ? "الانضمام" : locale === "tr" ? "Katılım" : "Join" },
  ];

  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <div className="min-h-screen" dir={dir} lang={locale}>
      <SimplePageHero
        title="التسجيل في عضوية الاتحاد"
        breadcrumbs={breadcrumbs}
        lang={locale}
      />
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-4xl rounded-2xl">
          <MembershipForm lang={locale} />
        </div>
      </div>
    </div>
  );
}
