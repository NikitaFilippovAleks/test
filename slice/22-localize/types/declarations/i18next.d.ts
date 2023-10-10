import 'i18next';

import ar from 'client/locales/translations/ar.json';
import en from 'client/locales/translations/en.json';
import es from 'client/locales/translations/es.json';
import fr from 'client/locales/translations/fr.json';
import ru from 'client/locales/translations/ru.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      ar: typeof ar;
      en: typeof en;
      es: typeof es;
      fr: typeof fr;
      ru: typeof ru;
    };
    returnNull: false;
  }
}
