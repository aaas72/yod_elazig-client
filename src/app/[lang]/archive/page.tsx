import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";

interface ArchivePageProps {
  params: Promise<{ lang: string }>;
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    redirect("/ar/access");
  }
  const locale = lang as Locale;
  redirect(`/${locale}/access`);
}
