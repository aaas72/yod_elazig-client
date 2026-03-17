"use client";

import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import { resolveImageUrl } from "@/lib/api";

interface Breadcrumb {
  name: string;
  href: string;
}

interface ArticleLayoutProps {
  title: string;
  coverImage: string;
  breadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
  author?: string;
  date?: string;
  locale?: string;
}

export default function ArticleLayout({
  title,
  coverImage,
  breadcrumbs,
  children,
  author,
  date,
  locale = "ar",
}: ArticleLayoutProps) {
  const authorLabel =
    locale === "tr" ? "Yazar" : locale === "en" ? "Author" : "الكاتب";

  return (
    <div>
      <header className="relative flex items-center bg-gradient-to-bl from-red-900 via-red-800 to-red-900 text-white pb-10 pt-30 rounded-b-[36px] px-8 overflow-hidden">
        <div className="max-w-6xl w-full mx-auto px-4 relative z-10">
          <FadeIn direction="up">
            <div
              className="max-w-4xl text-start"
            >
              <h1
                className="text-xl md:text-3xl font-bold mb-6 break-words"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {title}
              </h1>
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="text-sm text-red-200">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={index}>
                      <Link
                        href={crumb.href}
                        className="hover:text-white transition-all"
                      >
                        {crumb.name}
                      </Link>
                      {index < breadcrumbs.length - 1 && (
                        <span className="mx-2">/</span>
                      )}
                    </span>
                  ))}
                </nav>
              )}
              {(author || date) && (
                <div className="mt-4 text-sm text-gray-300">
                  {author && <span>{`${authorLabel}: ${author}`}</span>}
                  {author && date && <span className="mx-2">&bull;</span>}
                  {date && (
                    <span>
                      {(() => {
                        try {
                          const d = new Date(date);
                          if (!isNaN(d.getTime())) {
                            const day = String(d.getDate()).padStart(2, "0");
                            const month = String(d.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = d.getFullYear();
                            return `${day}-${month}-${year}`;
                          }
                        } catch {}
                        return date;
                      })()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 end-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </header>
      <article className="pb-32">
        <main className="max-w-6xl mx-auto p-8 md:px-16 py-8">
          <FadeIn direction="up" delay={0.2}>
            <div
              className="w-full mx-auto overflow-hidden shadow-xl rounded-[22px] mb-6"
              style={{ maxWidth: "100%" }}
            >
              <img
                src={resolveImageUrl(coverImage)}
                alt={title}
                className="w-full object-cover block"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "none",
                }}
              />
            </div>
            {children}
          </FadeIn>
        </main>
      </article>
    </div>
  );
}
