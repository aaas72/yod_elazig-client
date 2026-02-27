import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import FadeIn from "@/components/animations/FadeIn";
import { useContactData } from "@/hooks/useContactData";
import { useGeneralData } from "@/hooks/useGeneralData";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";

export default function Contact() {
  const contactData = useContactData();
  const generalData = useGeneralData();
  const { settings } = useSiteSettings();

  // prefer settings contact info when available
  const contactEmail =
    import.meta.env.VITE_CONTACT_EMAIL ||
    settings?.contactInfo?.email ||
    generalData.contactInfo.email;
  const contactPhone =
    settings?.contactInfo?.phone || generalData.contactInfo.phone;

  return (
    <div>
      <SimplePageHero
        title={contactData.hero.title}
        breadcrumbs={[
          { label: generalData.navigation[0].label, href: "/" },
          { label: contactData.hero.breadcrumb },
        ]}
      />

      {/* Contact Options Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn direction="up" delay={0.2}>
            <div className="max-w-3xl mx-auto p-10 relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="text-center mb-10">
                  <p className="text-gray-600">
                    {contactData.options.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email Option */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-red-200 transition duration-300">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                        <Mail size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {contactData.form.emailLabel}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 break-all">
                          {contactEmail}
                        </p>
                        <a
                          href={`mailto:${contactEmail}`}
                          className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-red-900 text-white rounded-xl font-medium hover:bg-red-800 transition duration-300"
                        >
                          {contactData.options.emailButton}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Option */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-green-200 transition duration-300">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                        <FaWhatsapp size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {contactData.options.whatsappLabel}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4" dir="ltr">
                          {contactPhone}
                        </p>
                        <a
                          href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition duration-300"
                        >
                          <FaWhatsapp size={18} className="mr-2" />
                          <span>{contactData.options.whatsappButton}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}