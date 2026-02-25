import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/activitiesPage.json';
import en from '../../data/locales/en/activitiesPage.json';
import tr from '../../data/locales/tr/activitiesPage.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useActivitiesPageData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
