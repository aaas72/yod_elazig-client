import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/volunteer.json';
import en from '../../data/locales/en/volunteer.json';
import tr from '../../data/locales/tr/volunteer.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useVolunteerData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
