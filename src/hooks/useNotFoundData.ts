import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/notFound.json';
import en from '../../data/locales/en/notFound.json';
import tr from '../../data/locales/tr/notFound.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useNotFoundData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
