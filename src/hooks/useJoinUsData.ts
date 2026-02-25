import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/joinUs.json';
import en from '../../data/locales/en/joinUs.json';
import tr from '../../data/locales/tr/joinUs.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useJoinUsData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
