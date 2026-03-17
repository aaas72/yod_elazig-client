import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isValidLocale, type Locale } from "./src/i18n/config";

// Paths that don't need locale prefix
const PUBLIC_FILE = /\.(.*)$/;
const EXCLUDED_PATHS = ["/api", "/admin", "/_next", "/favicon", "/robots.txt", "/sitemap.xml"];

function getLocaleFromRequest(request: NextRequest): Locale {
  // Check cookie first
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language");
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, priority = "q=1"] = lang.trim().split(";");
        return {
          code: code.split("-")[0].toLowerCase(),
          priority: parseFloat(priority.replace("q=", "")) || 1,
        };
      })
      .sort((a, b) => b.priority - a.priority);

    for (const { code } of languages) {
      if (isValidLocale(code)) {
        return code;
      }
    }
  }

  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public files and excluded paths
  if (
    PUBLIC_FILE.test(pathname) ||
    EXCLUDED_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to locale-prefixed path
  const locale = getLocaleFromRequest(request);
  const newUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url);

  // Preserve search params
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);

  // Set locale cookie for future visits
  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
