import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/programsPage.json';
import en from '../../data/locales/en/programsPage.json';
import tr from '../../data/locales/tr/programsPage.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useProgramsPageData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
