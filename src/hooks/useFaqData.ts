import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/faq.json';
import en from '../../data/locales/en/faq.json';
import tr from '../../data/locales/tr/faq.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useFaqData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
