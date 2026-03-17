import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { isValidLocale, locales } from "@/i18n/config";
import { getFaqData } from "@/i18n/get-data";
import { getDictionary } from "@/i18n/dictionaries";
import { fetchApi, resolveImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import FaqClient from "./FaqClient";

interface FaqPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const revalidate = 60;

interface ApiFaqItem {
  _id: string;
  question: { ar: string; en?: string; tr?: string };
  answer: { ar: string; en?: string; tr?: string };
  category: string;
  steps?: Array<{ text: { ar: string; en?: string; tr?: string }; fileUrl?: string }>;
  documents?: Array<{ name: { ar: string; en?: string; tr?: string }; url: string }>;
  order: number;
  isPublished: boolean;
}

function transformFaqsToCategories(faqs: ApiFaqItem[], locale: Locale) {
  const grouped: Record<string, Array<{
    id: string;
    question: string;
    answer: string;
    steps?: Array<{ text: string; fileUrl?: string | null }>;
    documents?: Array<{ name: string; image: string; file?: string }>;
  }>> = {};

  for (const faq of faqs) {
    const catId = faq.category;
    if (!grouped[catId]) grouped[catId] = [];

    const steps = faq.steps?.map((s) => ({
      text: s.text?.[locale] || s.text?.ar || "",
      fileUrl: s.fileUrl ? resolveImageUrl(s.fileUrl) : null,
    }));

    const documents = faq.documents?.map((d) => ({
      name: d.name?.[locale] || d.name?.ar || "",
      image: resolveImageUrl(d.url),
      file: resolveImageUrl(d.url),
    }));

    grouped[catId].push({
      id: faq._id,
      question: faq.question?.[locale] || faq.question?.ar || "",
      answer: faq.answer?.[locale] || faq.answer?.ar || "",
      steps,
      documents,
    });
  }

  return Object.entries(grouped).map(([catId, questions]) => ({
    id: catId,
    title: catId,
    questions,
  }));
}

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const locale = lang as Locale;
  const faqData = await getFaqData(locale);

  const descriptions: Record<Locale, string> = {
    ar: "إجابات على أكثر الأسئلة شيوعاً حول الحياة في إلازيغ، الدراسة في جامعة فرات، والانضمام إلى الاتحاد.",
    en: "Answers to the most frequently asked questions about life in Elazig, studying at Fırat University, and joining the union.",
    tr: "Elazığ'da yaşam, Fırat Üniversitesi'nde okuma ve birliğe katılma hakkında en sık sorulan sorulara cevaplar.",
  };
  return {
    title: (faqData as any).hero?.title || "FAQ",
    description: descriptions[locale],
    openGraph: {
      title: (faqData as any).hero?.title || "FAQ",
      description: descriptions[locale],
      url: `https://yodelazig.org/${locale}/faq`,
      siteName: "YOD Elazig",
      locale: locale === "ar" ? "ar_YE" : locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/imgs/logos/yodellogo.png", width: 512, height: 512, alt: "YOD Elazig" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: (faqData as any).hero?.title || "FAQ", description: descriptions[locale], images: ["/imgs/logos/yodellogo.png"] },
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { ar: "/ar/faq", en: "/en/faq", tr: "/tr/faq" },
    },
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const faqData = (await getFaqData(locale)) as any;
  const dictionary = await getDictionary(locale);

  // Fetch FAQ data from API (with static JSON as fallback)
  let categories = faqData.categories || [];
  try {
    const result = await fetchApi<any>("/faq", { lang: locale });
    const apiFaqs: ApiFaqItem[] = result?.faqs || result?.data || (Array.isArray(result) ? result : []);
    if (apiFaqs.length > 0) {
      categories = transformFaqsToCategories(apiFaqs, locale);
    }
  } catch {
    // Fallback to static JSON categories if API fails
  }

  return (
    <div className="min-h-screen">
      <SimplePageHero
        title={faqData.hero?.title || "FAQ"}
        breadcrumbs={faqData.hero?.breadcrumbs || []}
        lang={locale}
      />

      <FaqClient
        categories={categories}
        labels={{
          steps: faqData.labels?.steps || "Steps",
          documents: faqData.labels?.documents || "Documents",
        }}
        searchPlaceholder={dictionary.common.searchPlaceholder}
        noResultsTitle={dictionary.faq.noResults}
        noResultsText={dictionary.faq.trySearch}
      />
    </div>
  );
}
