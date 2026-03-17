'use client';

import { useState, useEffect } from 'react';
import { faqService, FaqItem } from '@/services/faqService';
import { resolveImage } from '@/utils/resolveImage';

// Static structure fallback (no JSON locale files in Next.js)
const staticStructure = {
  categories: [] as any[],
};

export const useFaqData = () => {
  const lang = ((typeof window !== 'undefined' ? localStorage.getItem('NEXT_LOCALE') : null) || 'ar') as 'ar' | 'en' | 'tr';

  const initialData = {
    ...staticStructure,
    categories: [] as { id: string; title: string; questions: any[] }[],
  };

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const currentLang = ((typeof window !== 'undefined' ? localStorage.getItem('NEXT_LOCALE') : null) || 'ar') as 'ar' | 'en' | 'tr';

        // Fetch dynamic FAQs from API
        const dynamicFaqs = await faqService.getPublished();

        // Group FAQs by category
        const groupedQuestions: Record<string, any[]> = {};

        if (dynamicFaqs && Array.isArray(dynamicFaqs)) {
          dynamicFaqs.forEach((faq: FaqItem) => {
            const categoryId = faq.category;
            if (!groupedQuestions[categoryId]) {
              groupedQuestions[categoryId] = [];
            }

            // Map API data to UI structure
            let mappedSteps: any[] = [];
            if (Array.isArray(faq.steps)) {
              mappedSteps = faq.steps.map(step => {
                if (typeof step === 'string') {
                  return { text: step, fileUrl: null };
                }
                if (step && step.text) {
                  return {
                    text: step.text[currentLang] || step.text['ar'] || '',
                    fileUrl: step.fileUrl ? resolveImage(step.fileUrl) : null,
                  };
                }
                return { text: '', fileUrl: null };
              });
            } else if (faq.steps && typeof faq.steps === 'object') {
              const oldSteps = faq.steps as any;
              const stepsList = oldSteps[currentLang] || oldSteps['ar'] || [];
              mappedSteps = stepsList.map((s: string) => ({ text: s, fileUrl: null }));
            }

            groupedQuestions[categoryId].push({
              id: faq._id,
              question: faq.question[currentLang] || faq.question['ar'],
              answer: faq.answer[currentLang] || faq.answer['ar'],
              steps: mappedSteps,
              documents: faq.documents?.map(doc => ({
                name: doc.name[currentLang] || doc.name['ar'],
                image: resolveImage(doc.url),
              })),
            });
          });
        }

        // Build categories from dynamic data (no static structure to merge with)
        const mergedCategories = Object.keys(groupedQuestions).map(catId => ({
          id: catId,
          title: catId.charAt(0).toUpperCase() + catId.slice(1),
          questions: groupedQuestions[catId],
        }));

        setData({
          ...staticStructure,
          categories: mergedCategories,
        });

      } catch (error) {
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [lang]);

  return data;
};
