import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/about.json';
import en from '../../data/locales/en/about.json';
import tr from '../../data/locales/tr/about.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useAboutData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
