"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Hash, X, Link2, Check } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import FaqDocumentList from "@/components/ui/Faq/FaqDocumentList";
import FaqDocumentModal from "@/components/ui/Faq/FaqDocumentModal";
import RichText from "@/components/ui/RichText";

interface FaqQuestion {
  id: string;
  question: string;
  answer: string;
  steps?: Array<{ text: string; fileUrl?: string | null }>;
  documents?: Array<{ name: string; image: string }>;
}

interface FaqCategory {
  id: string;
  title: string;
  questions: FaqQuestion[];
}

interface FaqClientProps {
  categories: FaqCategory[];
  labels: {
    steps: string;
    documents: string;
  };
  searchPlaceholder: string;
  noResultsTitle: string;
  noResultsText: string;
}

export default function FaqClient({
  categories,
  labels,
  searchPlaceholder,
  noResultsTitle,
  noResultsText,
}: FaqClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    image: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (categories.length > 0) {
      const categoryExists = categories.some((cat) => cat.id === activeCategory);
      if (!categoryExists) {
        setActiveCategory(categories[0].id);
      }
    }
  }, [categories, activeCategory]);

  // Open question from URL hash on load
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#question-")) return;
    const qId = hash.replace("#question-", "");
    for (const cat of categories) {
      const found = cat.questions?.find((q) => q.id === qId);
      if (found) {
        setActiveCategory(cat.id);
        setOpenQuestions((prev) => ({ ...prev, [qId]: true }));
        setTimeout(() => {
          questionRefs.current[qId]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 400);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyQuestionLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#question-${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredCategories = categories
    .filter((cat) => (searchQuery ? true : cat.id === activeCategory))
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4 self-start">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-10 pe-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-base"
                />
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Categories Menu (Desktop) */}
              <nav className="hidden lg:block bg-white rounded-2xl border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                  Categories
                </h3>
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-start px-4 py-4 sm:py-3 rounded-lg text-base sm:text-sm font-medium transition-all flex items-center gap-3 ${
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
              <nav className="lg:hidden w-100 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide whitespace-nowrap">
                <div className="flex gap-2 flex-nowrap w-max">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex-shrink-0 whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${
                        activeCategory === category.id
                          ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-200"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {activeCategory === category.id && (
                        <Hash className="w-3.5 h-3.5" />
                      )}
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
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-24"
                >
                  <FadeIn direction="up">
                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-100 bg-gray-50/50 p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-3">
                          <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                          {category.title}
                        </h2>
                      </div>
                      <div
                        className={
                          searchQuery
                            ? "space-y-4 p-4"
                            : "divide-y divide-gray-100 "
                        }
                      >
                        {category.questions.map((q) => (
                          <div
                            key={q.id}
                            id={`question-${q.id}`}
                            ref={(el) => {
                              questionRefs.current[q.id] = el;
                            }}
                            className={`transition-all duration-300 rounded-b-3xl scroll-mt-28 ${
                              openQuestions[q.id]
                                ? "bg-red-50/30 border-2 border-red-500 shadow-sm z-10 relative mt-2"
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
                              <span className="font-semibold text-gray-800 group-hover:text-red-700 transition-colors pt-1 text-base sm:text-lg">
                                {q.question}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyQuestionLink(q.id);
                                  }}
                                  title="نسخ رابط السؤال"
                                  className="p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                  {copiedId === q.id ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Link2 className="w-4 h-4" />
                                  )}
                                </button>
                                <span
                                  className={`p-2 rounded-full transition-all duration-300 ${
                                    openQuestions[q.id]
                                      ? "bg-red-100 text-red-600 rotate-180"
                                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                                  }`}
                                >
                                  <ChevronDown className="w-5 h-5" />
                                </span>
                              </div>
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
                                  <div className="text-gray-600 leading-relaxed border-t border-red-100/50 pt-4 text-sm sm:text-base">
                                    <div
                                      className="mb-4 prose prose-sm max-w-none text-gray-600 leading-relaxed"
                                      dangerouslySetInnerHTML={{
                                        __html: q.answer,
                                      }}
                                    />

                                    {/* Steps Section */}
                                    {q.steps && q.steps.length > 0 && (
                                      <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                          {labels.steps}
                                        </h4>
                                        <ol className="list-decimal list-inside space-y-2 text-sm">
                                          {q.steps.map((step, index) => (
                                            <li
                                              key={index}
                                              className="pl-2 marker:text-red-500 marker:font-semibold"
                                            >
                                              <div className="inline-flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span className="text-gray-700">
                                                  <RichText
                                                    text={
                                                      typeof step === "string"
                                                        ? step
                                                        : step.text
                                                    }
                                                  />
                                                </span>
                                                {typeof step !== "string" &&
                                                  step.fileUrl && (
                                                    <button
                                                      onClick={() =>
                                                        setPreviewUrl(
                                                          step.fileUrl!
                                                        )
                                                      }
                                                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                                                    >
                                                      <span className="underline">
                                                        View File
                                                      </span>
                                                    </button>
                                                  )}
                                              </div>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    )}

                                    {/* Documents Section */}
                                    {q.documents && q.documents.length > 0 && (
                                      <FaqDocumentList
                                        documents={q.documents}
                                        title={labels.documents}
                                        onOpenModal={(doc) =>
                                          setModalData({
                                            isOpen: true,
                                            title: doc.name,
                                            image: doc.image,
                                          })
                                        }
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
                  {noResultsTitle}
                </h3>
                <p className="text-gray-500">{noResultsText}</p>
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

      {/* File Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {previewUrl.split("/").pop()}
              </span>
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh] flex items-center justify-center bg-gray-50 p-4">
              {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(previewUrl) ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-w-full max-h-[65vh] object-contain rounded"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  className="w-full h-[65vh] rounded border"
                  title="preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
