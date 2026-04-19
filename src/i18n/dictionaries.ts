import type { Locale } from "./config";

// Dictionary type based on actual translation structure
export interface Dictionary {
  navigation: {
    home: string;
    about: string;
    news: string;
    events: string;
    programs: string;
    aboutCity: string;
    aboutUniversity: string;
    resources: string;
    contact: string;
    volunteer: string;
    faq: string;
  };
  faq: {
    title: string;
    description: string;
    sectionTitle: string;
    sectionSubtitle: string;
    stillHaveQuestions: string;
    contactSupport: string;
    practicalSteps: string;
    illustrativeImages: string;
    noResults: string;
    trySearch: string;
    categoriesTitle: string;
  };
  faqCategories: {
    general: string;
    residency: string;
    academic: string;
    living: string;
    membership: string;
    technical: string;
    [key: string]: string;
  };
  footer: {
    rights: string;
    aboutText: string;
    logoAlt: string;
    quickLinksTitle: string;
    contactTitle: string;
    followUsTitle: string;
    newsletterTitle: string;
    newsletterDescription: string;
    newsletterPlaceholder: string;
    newsletterButtonAriaLabel: string;
    copyrightText: string;
    visitCountLabel: string;
    address: string;
    quickLinks: Array<{ href: string; label: string }>;
  };
  legal: {
    privacy: {
      title: string;
      introTitle: string;
      intro: string;
      updatedAt: string;
      sections: Array<{ title: string; points: string[] }>;
    };
    terms: {
      title: string;
      introTitle: string;
      intro: string;
      updatedAt: string;
      sections: Array<{ title: string; points: string[] }>;
    };
  };
  buttons: {
    readMore: string;
    submit: string;
    viewArchive: string;
    viewSpecialties: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    searchPlaceholder: string;
    noResults: string;
    trySearch: string;
    introduction: string;
  };
}

// Lazy load dictionaries
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ar: () => import("@/locales/ar/translation.json").then((m) => m.default as Dictionary),
  en: () => import("@/locales/en/translation.json").then((m) => m.default as Dictionary),
  tr: () => import("@/locales/tr/translation.json").then((m) => m.default as Dictionary),
};

// Get dictionary for a locale
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
