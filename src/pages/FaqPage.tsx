import React, { useState, useEffect } from "react";
import { useFaqData } from "@/hooks/useFaqData";
import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import FadeIn from "@/components/animations/FadeIn";
import { ChevronDown, Search, Hash } from "lucide-react";
import FaqDocumentList from "@/components/ui/Faq/FaqDocumentList";
import FaqDocumentModal from "@/components/ui/Faq/FaqDocumentModal";
import RichText from "@/components/ui/RichText";

export default function FaqPage() {
  const faqData = useFaqData();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});
  const [modalData, setModalData] = useState<{ isOpen: boolean; title: string; image: string } | null>(null);

  useEffect(() => {
    if (faqData.categories.length > 0) {
      const categoryExists = faqData.categories.some((cat: { id: string }) => cat.id === activeCategory);
      if (!categoryExists) {
        setActiveCategory(faqData.categories[0].id);
      }
    }
  }, [faqData, activeCategory]);

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredCategories = faqData.categories
    .filter((cat: { id: string }) => (searchQuery ? true : cat.id === activeCategory))
    .map((cat: { id: string; title: string; questions: any[] }) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat: { questions: any[] }) => cat.questions.length > 0);

  return (
    <div className="min-h-screen">
      <SimplePageHero
        title={faqData.hero.title}
        breadcrumbs={faqData.hero.breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4 self-start">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Categories Menu (Desktop) */}
              <nav className="hidden lg:block bg-white rounded-2xl border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                  Categories
                </h3>
                <ul className="space-y-1">
                  {faqData.categories.map((category: { id: string; title: string }) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-start px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                          activeCategory === category.id
                            ? "bg-red-50 text-red-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Hash className="w-4 h-4 opacity-50" />
                        {category.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Categories Menu (Mobile) */}
              <nav className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-2">
                  {faqData.categories.map((category: { id: string; title: string }) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${
                        activeCategory === category.id
                          ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-200"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {activeCategory === category.id && <Hash className="w-3.5 h-3.5" />}
                      {category.title}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4 space-y-12">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category: { id: string; title: string; questions: any[] }) => (
                <div
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-24"
                >
                  <FadeIn direction="up">
                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                          {category.title}
                        </h2>
                      </div>
                      <div className={searchQuery ? "space-y-4 p-4" : "divide-y divide-gray-100 "}>
                        {category.questions.map((q) => (
                          <div
                            key={q.id}
                            className={`transition-all duration-300 rounded-b-3xl ${
                              openQuestions[q.id]
                                ? "bg-red-50/30 border-2 border-red-500  shadow-sm z-10 relative mt-2"
                                : "hover:bg-gray-50 border-2 border-transparent"
                            } ${
                              searchQuery && !openQuestions[q.id]
                                ? "border-2 border-red-500 rounded-xl shadow-sm"
                                : ""
                            }`}
                          >
                            <button
                              onClick={() => toggleQuestion(q.id)}
                              className="w-full text-start px-6 py-5 flex items-start justify-between gap-4 group"
                            >
                              <span className="font-semibold text-gray-800 group-hover:text-red-700 transition-colors pt-1">
                                {q.question}
                              </span>
                              <span
                                className={`shrink-0 p-2 rounded-full transition-all duration-300 ${
                                  openQuestions[q.id]
                                    ? "bg-red-100 text-red-600 rotate-180"
                                    : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                                }`}
                              >
                                <ChevronDown className="w-5 h-5" />
                              </span>
                            </button>
                            <div
                              className={`grid transition-all duration-300 ease-in-out ${
                                openQuestions[q.id]
                                  ? "grid-rows-[1fr] opacity-100"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="px-6 pb-6 pt-0">
                                  <div className="text-gray-600 leading-relaxed border-t border-red-100/50 pt-4">
                                    <p className="mb-4"><RichText text={q.answer} /></p>
                                    
                                    {/* Steps Section */}
                                    {(q as any).steps && (q as any).steps.length > 0 && (
                                      <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                          {faqData.labels.steps}
                                        </h4>
                                        <ol className="list-decimal list-inside space-y-2 text-sm">
                                          {(q as any).steps?.map((step: any, index: number) => (
                                            <li key={index} className="pl-2 marker:text-red-500 marker:font-semibold">
                                              <div className="inline-flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span className="text-gray-700">
                                                  <RichText text={typeof step === 'string' ? step : step.text} />
                                                </span>
                                                {typeof step !== 'string' && step.fileUrl && (
                                                  <a 
                                                    href={step.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                                                  >
                                                    <span className="underline">View File</span>
                                                  </a>
                                                )}
                                              </div>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    )}

                                    {/* Documents Section */}
                                    {(q as any).documents && (q as any).documents.length > 0 && (
                                      <FaqDocumentList 
                                        documents={(q as any).documents}
                                        title={faqData.labels.documents}
                                        onOpenModal={(doc) => setModalData({ isOpen: true, title: doc.name, image: doc.image })}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search query
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Document Preview Modal */}
      {modalData && (
        <FaqDocumentModal

          isOpen={modalData.isOpen}
          title={modalData.title}
          image={modalData.image}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
