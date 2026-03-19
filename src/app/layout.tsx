import type { Metadata, Viewport } from "next";
import { Inter, Zain } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const zain = Zain({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-zain",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yodelazig.org"),
  title: {
    default: "اتحاد الطلاب اليمنيين في تركيا - فرع إلازيغ | YOD Elazig",
    template: "%s | YOD Elazig",
  },
  description:
    "الموقع الرسمي لاتحاد الطلاب اليمنيين في تركيا فرع إلازيغ. نقدم الدعم والمساعدة للطلاب اليمنيين، ننظم الأنشطة والفعاليات، ونعزز التواصل بين الطلاب.",
  keywords: [
    "اتحاد الطلاب اليمنيين",
    "تركيا",
    "إلازيغ",
    "طلاب يمنيين",
    "جامعة الفرات",
    "YOD Elazig",
    "Yemen Students Union Turkey",
    "Yemenli Öğrenciler Birliği",
    "Elazığ Yemenli öğrenciler",
    "Fırat Üniversitesi Yemenli",
    "Yemen Students Elazig",
    "Turkey student union",
  ],
  authors: [{ name: "اتحاد الطلاب اليمنيين - فرع إلازيغ" }],
  creator: "YOD Elazig",
  publisher: "اتحاد الطلاب اليمنيين",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_YE",
    alternateLocale: ["tr_TR", "en_US"],
    url: "https://yodelazig.org",
    siteName: "YOD Elazig - اتحاد الطلاب اليمنيين",
    title: "اتحاد الطلاب اليمنيين في تركيا - فرع إلازيغ",
    description:
      "الموقع الرسمي لاتحاد الطلاب اليمنيين في تركيا فرع إلازيغ. نقدم الدعم والمساعدة للطلاب اليمنيين.",
    images: [
      {
        url: "/imgs/logos/yodellogo.png",
        width: 512,
        height: 512,
        alt: "شعار اتحاد الطلاب اليمنيين - YOD Elazig",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "اتحاد الطلاب اليمنيين في تركيا - فرع إلازيغ | YOD Elazig",
    description:
      "الموقع الرسمي لاتحاد الطلاب اليمنيين في تركيا فرع إلازيغ.",
    images: ["/imgs/logos/yodellogo.png"],
  },
  // شعار الاتحاد كأيقونة التاب
  icons: {
    icon: [
      { url: "/imgs/logos/yodellogo.png", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/imgs/logos/yodellogo.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/imgs/logos/yodellogo.png",
        color: "#991b1b",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://yodelazig.org/ar",
    languages: {
      ar: "https://yodelazig.org/ar",
      en: "https://yodelazig.org/en",
      tr: "https://yodelazig.org/tr",
      "x-default": "https://yodelazig.org/ar",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#991b1b" },
    { media: "(prefers-color-scheme: dark)", color: "#7f1d1d" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "اتحاد الطلاب اليمنيين في تركيا - فرع إلازيغ",
  alternateName: [
    "YOD Elazig",
    "Türkiye'deki Yemenli Öğrenciler Birliği - Elazığ Şubesi",
    "Yemeni Students Union in Turkey - Elazig Branch",
  ],
  url: "https://yodelazig.org",
  logo: {
    "@type": "ImageObject",
    url: "https://yodelazig.org/imgs/logos/yodellogo.png",
    width: 512,
    height: 512,
  },
  description:
    "منظمة طلابية تهدف إلى خدمة الطلاب اليمنيين، والدفاع عن حقوقهم، وتعزيز التواصل والتعاون بينهم في مدينة إلازيغ التركية.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Elazig",
    addressRegion: "Elazığ",
    addressCountry: "TR",
  },
  sameAs: [
    "https://www.facebook.com/yodtelazig",
    "https://www.instagram.com/yod_elazig",
  ],
  foundingDate: "2018",
  knowsLanguage: ["ar", "tr", "en"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} ${zain.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
