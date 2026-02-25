import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/aboutUniversity.json';
import en from '../../data/locales/en/aboutUniversity.json';
import tr from '../../data/locales/tr/aboutUniversity.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useAboutUniversityData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
