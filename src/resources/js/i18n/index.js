import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ru: { translation: ru },
            uk: { translation: uk },
            en: { translation: en },
        },
        lng: 'ru',
        fallbackLng: 'ru',
        supportedLngs: ['ru', 'uk', 'en'],
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
