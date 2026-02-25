import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './locales/ar/translation.json';
import en from './locales/en/translation.json';
import tr from './locales/tr/translation.json';


// Custom detection for Turkish/Arabic browser language
const browserLang = navigator.language || navigator.languages[0] || 'ar';
let defaultLng = 'ar';
if (browserLang.startsWith('tr')) {
    defaultLng = 'tr';
} else if (browserLang.startsWith('ar')) {
    defaultLng = 'ar';
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ar: {
                translation: ar,
            },
            en: {
                translation: en,
            },
            tr: {
                translation: tr,
            },
        },
        fallbackLng: defaultLng,
        supportedLngs: ['ar', 'en', 'tr'],

        interpolation: {
            escapeValue: false, // React already safes from xss
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

export default i18n;