import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/aboutCity.json';
import en from '../../data/locales/en/aboutCity.json';
import tr from '../../data/locales/tr/aboutCity.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useAboutCityData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
