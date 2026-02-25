import { ArrowLeft } from "lucide-react";
import { useGeneralData } from "@/hooks/useGeneralData";

const NewsletterForm = () => {
  const generalData = useGeneralData();
  return (
    <form className="relative w-full max-w-sm">
      <input
        type="email"
        placeholder={generalData.footer.newsletterPlaceholder}
        className="w-full pl-14 pr-5 py-3 text-white bg-white/10 border border-white rounded-full placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#BE141B] transition-shadow"
      />
      <button
        type="submit"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#BE141B] text-white p-2 rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
        aria-label={generalData.footer.newsletterButtonAriaLabel}
      >
        <ArrowLeft size={20} />
      </button>
    </form>
  );
};

export default NewsletterForm;
