import { useTranslation } from 'react-i18next';
import ar from '../../data/locales/ar/achievements.json';
import en from '../../data/locales/en/achievements.json';
import tr from '../../data/locales/tr/achievements.json';

const dataMap: Record<string, any> = { ar, en, tr };

export const useAchievementsData = () => {
  const { i18n } = useTranslation();
  return dataMap[i18n.language] || dataMap['ar'];
};