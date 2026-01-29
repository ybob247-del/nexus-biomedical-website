/**
 * i18n Configuration
 * Internationalization setup for English and Spanish
 * 
 * Language is controlled by App.jsx based on current URL:
 * - /es* routes use Spanish
 * - /* routes use English
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

i18n
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      }
    },
    lng: 'en', // Default language - will be overridden by App.jsx based on URL
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
