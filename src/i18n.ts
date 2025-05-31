// src/i18n.ts
import i18n from 'i18next';
import merge from 'lodash.merge';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';

import { translation } from '@happykiller/sunny-ui';
import appEN from '@src/locales/en/translation.json';
import appFR from '@src/locales/fr/translation.json';

const resources = {
  en: {
    translation: merge({}, translation.en, appEN),
  },
  fr: {
    translation: merge({}, translation.fr, appFR),
  }
};

const initI18n = async () => {
  await i18n
    .use(detector)
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: ['en', 'fr'],
      fallbackLng: 'fr',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      }
    });
};

export default initI18n;
