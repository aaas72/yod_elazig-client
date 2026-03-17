"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div
          key={faq._id}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <button
            onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
            className="w-full flex items-center justify-between p-6 text-start hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-800 text-lg">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-red-700 transition-transform ${
                openId === faq._id ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openId === faq._id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
