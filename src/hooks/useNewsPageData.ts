import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/newsPage.json';
import en from '../../data/locales/en/newsPage.json';
import tr from '../../data/locales/tr/newsPage.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useNewsPageData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
