import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import lang from '../../lang';
import { LANG } from '../constants/static';

const langList = Object.keys(LANG).filter((value) => value !== 'DEFAULT');

i18n.use(initReactI18next).init({
  resources: lang,
  fallbackLng: LANG.DEFAULT,
  interpolation: {
    escapeValue: false,
  },
  supportedLngs: langList,
  detection: {
    whitelist: langList,
  },
});

export { i18n };
