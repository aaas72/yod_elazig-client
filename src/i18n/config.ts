// Supported locales configuration
export const locales = ["ar", "en", "tr"] as const;
export type Locale = (typeof locales)[number];

// Default locale (Arabic)
export const defaultLocale: Locale = "ar";

// RTL languages
export const rtlLocales: Locale[] = ["ar"];

// Check if a locale is RTL
export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

// Get direction for a locale
export function getDirection(locale: Locale): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}

// Locale display names
export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  tr: "Türkçe",
};

// Validate if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
