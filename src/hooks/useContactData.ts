import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/contact.json';
import en from '../../data/locales/en/contact.json';
import tr from '../../data/locales/tr/contact.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useContactData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};
