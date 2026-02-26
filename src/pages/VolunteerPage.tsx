import { ExternalLink } from "lucide-react";
import { useVolunteerData } from "@/hooks/useVolunteerData";
import { useVolunteerFormLink } from "@/hooks/useVolunteerFormLink";
import FadeIn from "@/components/animations/FadeIn";
import { useGeneralData } from "@/hooks/useGeneralData";
import Button from "@/components/ui/Button";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";

export default function Volunteer() {
  const generalData = useGeneralData();
  const volunteerData = useVolunteerData();
  const { formLink, loading, error } = useVolunteerFormLink();

  return (
    <div>
      <SimplePageHero
        title={volunteerData.hero.title}
        breadcrumbs={[
          { label: generalData.navigation[0].label, href: "/" },
          { label: volunteerData.hero.breadcrumb },
        ]}
      />

      {/* Volunteer Content Section */}
      <section className="section-spacing my-16">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" delay={0.2}>
            <div className="max-w-4xl mx-auto bg-transparent p-10 relative overflow-hidden text-center">
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {volunteerData.content.title}
                </h2>

                <p className="text-lg text-gray-600 mb-10 max-w-2xl leading-relaxed">
                  {volunteerData.content.description}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-10 w-full max-w-2xl">
                  {volunteerData.content.benefits.map(
                    (benefit: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-300 transition-all hover:shadow-md hover:border-red-100"
                      >
                        <span className="text-4xl font-black text-red-600 shrink-0 font-sans leading-none">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 font-bold text-start text-lg">
                          {benefit}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                {formLink ? (
                  <Button
                    href={formLink}
                    variant="primary"
                    icon={<ExternalLink size={20} />}
                  >
                    {volunteerData.content.buttonText}
                  </Button>
                ) : (
                  <button
                    className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed"
                    
                  >
                    {volunteerData.content.buttonText}
                  </button>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
