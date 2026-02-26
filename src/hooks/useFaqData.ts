import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { faqService, FaqItem } from '../services/faqService';
// We only import static data for structure/labels fallback
import ar from '../../data/locales/ar/faq.json';
import en from '../../data/locales/en/faq.json';
import tr from '../../data/locales/tr/faq.json';

const staticDataMap: Record<string, any> = { ar, en, tr };

export const useFaqData = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en' | 'tr';

  // Use static data ONLY for initial structure (labels, hero, category titles)
  const staticStructure = staticDataMap[lang] || staticDataMap['ar'];

  // Initialize with empty questions to avoid showing static content
  const initialData = {
    ...staticStructure,
    categories: staticStructure.categories.map((cat: any) => ({
      ...cat,
      questions: [] // Start empty, wait for API
    }))
  };

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
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
            // New structure: steps is Array<{ text: {ar,en,tr}, fileUrl: string }>
            let mappedSteps: any[] = [];
            if (Array.isArray(faq.steps)) {
              // New structure
              mappedSteps = faq.steps.map(step => {
                // Handle case where step might be a string (legacy/mixed data)
                if (typeof step === 'string') {
                  return { text: step, fileUrl: null };
                }
                // Handle valid object with text
                if (step && step.text) {
                  return {
                    text: step.text[lang] || step.text['ar'] || '',
                    fileUrl: step.fileUrl
                  };
                }
                return { text: '', fileUrl: null };
              });
            } else if (faq.steps && typeof faq.steps === 'object') {
              // Fallback for old structure (legacy data)
              const oldSteps = faq.steps as any;
              const stepsList = oldSteps[lang] || oldSteps['ar'] || [];
              mappedSteps = stepsList.map((s: string) => ({ text: s, fileUrl: null }));
            }

            groupedQuestions[categoryId].push({
              id: faq._id,
              question: faq.question[lang] || faq.question['ar'],
              answer: faq.answer[lang] || faq.answer['ar'],
              steps: mappedSteps,
              documents: faq.documents?.map(doc => ({
                name: doc.name[lang] || doc.name['ar'],
                image: doc.url
              }))
            });
          });
        }

        // Merge with static categories structure
        const existingCategoryIds = new Set(staticStructure.categories.map((c: any) => c.id));
        const mergedCategories = staticStructure.categories.map((cat: any) => {
          const dynamicQuestions = groupedQuestions[cat.id] || [];
          return {
            ...cat,
            questions: dynamicQuestions // Use dynamic questions (empty if none found for this category)
          };
        });

        // Add dynamic categories that are not in static structure
        Object.keys(groupedQuestions).forEach(catId => {
          if (!existingCategoryIds.has(catId)) {
            mergedCategories.push({
              id: catId,
              title: catId.charAt(0).toUpperCase() + catId.slice(1), // Fallback title
              questions: groupedQuestions[catId]
            });
          }
        });

        setData({
          ...staticStructure,
          categories: mergedCategories
        });

      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
        // On error, we keep the empty state (or you could choose to show static fallback if desired, but user requested otherwise)
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [lang]);

  return data;
};
