import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yodelazig.org";

const staticPages = [
  { path: "",         changeFreq: "daily"   as const, priority: 1.0 },
  { path: "/about",  changeFreq: "monthly" as const, priority: 0.9 },
  { path: "/news",   changeFreq: "daily"   as const, priority: 0.9 },
  { path: "/events", changeFreq: "weekly"  as const, priority: 0.9 },
  { path: "/programs",         changeFreq: "weekly"  as const, priority: 0.9 },
  { path: "/join-membership",  changeFreq: "monthly" as const, priority: 0.9 },
  { path: "/volunteer",        changeFreq: "monthly" as const, priority: 0.8 },
  { path: "/contact",          changeFreq: "monthly" as const, priority: 0.8 },
  { path: "/about-city",       changeFreq: "monthly" as const, priority: 0.8 },
  { path: "/about-university", changeFreq: "monthly" as const, priority: 0.8 },
  { path: "/faq",       changeFreq: "monthly" as const, priority: 0.7 },
  { path: "/resources", changeFreq: "monthly" as const, priority: 0.7 },
  { path: "/privacy-policy", changeFreq: "yearly" as const, priority: 0.5 },
  { path: "/terms-of-use", changeFreq: "yearly" as const, priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static pages — one entry per locale, with hreflang alternates
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page.path}`])
          ),
        },
      } as any);
    }
  }

  // Dynamic content from API (skip if no API available during build)
  const API_BASE = process.env.API_INTERNAL_URL;
  if (!API_BASE) {
    console.log("Sitemap: Skipping dynamic content (API_INTERNAL_URL not set)");
    return entries;
  }

  try {

    // News
    const newsRes = await fetch(`${API_BASE}/news?limit=200`, {
      next: { revalidate: 3600 },
    });
    if (newsRes.ok) {
      const newsData = await newsRes.json();
      const newsList = newsData.data?.news || newsData.data || [];
      for (const item of newsList) {
        const slug = item.slug || item._id;
        for (const locale of locales) {
          entries.push({
            url: `${BASE_URL}/${locale}/news/${slug}`,
            lastModified: new Date(item.updatedAt || item.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                locales.map((l) => [l, `${BASE_URL}/${l}/news/${slug}`])
              ),
            },
          } as any);
        }
      }
    }

    // Events
    const eventsRes = await fetch(`${API_BASE}/events?limit=200`, {
      next: { revalidate: 3600 },
    });
    if (eventsRes.ok) {
      const eventsData = await eventsRes.json();
      const eventsList = eventsData.data?.events || eventsData.data || [];
      for (const item of eventsList) {
        const slug = item.slug || item._id;
        for (const locale of locales) {
          entries.push({
            url: `${BASE_URL}/${locale}/events/${slug}`,
            lastModified: new Date(item.updatedAt || item.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                locales.map((l) => [l, `${BASE_URL}/${l}/events/${slug}`])
              ),
            },
          } as any);
        }
      }
    }

    // Programs
    const programsRes = await fetch(`${API_BASE}/programs?limit=200`, {
      next: { revalidate: 3600 },
    });
    if (programsRes.ok) {
      const programsData = await programsRes.json();
      const programsList = Array.isArray(programsData.data)
        ? programsData.data
        : programsData.data?.programs || [];
      for (const item of programsList) {
        const slug = item.slug || item._id;
        for (const locale of locales) {
          entries.push({
            url: `${BASE_URL}/${locale}/programs/${slug}`,
            lastModified: new Date(item.updatedAt || item.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                locales.map((l) => [l, `${BASE_URL}/${l}/programs/${slug}`])
              ),
            },
          } as any);
        }
      }
    }
  } catch (err) {
    console.error("Sitemap: failed to fetch dynamic content:", err);
  }

  return entries;
}
