import { Link } from "react-router-dom";
import FadeIn from "@/components/animations/FadeIn";

type Breadcrumb = {
  label: string;
  href?: string;
};

interface SimplePageHeroProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
}

export default function SimplePageHero({
  title,
  breadcrumbs = [],
}: SimplePageHeroProps) {
  return (
    <div className="bg-linear-to-bl from-red-900 via-red-800 to-red-900 text-white rounded-b-[36px] overflow-hidden">
      <section className="relative h-[50%] flex items-center pt-32 pb-16 px-16">
        <div className="max-w-6xl w-full mx-auto px-4 relative z-10">
          <div className="max-w-4xl rtl:text-right ltr:text-left">
            <FadeIn direction="up">
              <h1 className="text-xl md:text-3xl font-bold mb-6">{title}</h1>
            </FadeIn>
            {breadcrumbs.length > 0 && (
              <FadeIn direction="up" delay={0.2}>
                <nav className="text-sm text-red-200">
                  {breadcrumbs.map((crumb, index) => (
                    <span
                      key={`${crumb.label}-${index}`}
                      className="inline-flex items-center"
                    >
                      {crumb.href ? (
                        <Link to={crumb.href} className="hover:text-white">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                      {index < breadcrumbs.length - 1 && (
                        <span className="mx-2">/</span>
                      )}
                    </span>
                  ))}
                </nav>
              </FadeIn>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
          <img
            src="/pattrens/simplLine.svg"
            alt=""
            className="w-screen max-w-none h-auto"
          />
        </div>
      </section>
    </div>
  );
}
