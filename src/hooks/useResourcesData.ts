import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/resources.json';
import en from '../../data/locales/en/resources.json';
import tr from '../../data/locales/tr/resources.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useResourcesData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
