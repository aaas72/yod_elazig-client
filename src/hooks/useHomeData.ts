import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/home.json';
import en from '../../data/locales/en/home.json';
import tr from '../../data/locales/tr/home.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useHomeData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
