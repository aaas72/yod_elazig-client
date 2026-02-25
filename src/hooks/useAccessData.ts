import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/access.json';
import en from '../../data/locales/en/access.json';
import tr from '../../data/locales/tr/access.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useAccessData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
