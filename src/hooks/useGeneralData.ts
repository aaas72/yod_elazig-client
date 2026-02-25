import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/general.json';
import en from '../../data/locales/en/general.json';
import tr from '../../data/locales/tr/general.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useGeneralData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
