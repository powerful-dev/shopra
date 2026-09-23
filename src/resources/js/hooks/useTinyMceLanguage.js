import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import russianLanguageUrl from 'tinymce-i18n/langs8/ru.js?url';
import ukrainianLanguageUrl from 'tinymce-i18n/langs8/uk.js?url';

const languageUrls = {
    ru: russianLanguageUrl,
    uk: ukrainianLanguageUrl,
};

export function getTinyMceLanguageConfig(language) {
    const languageCode = language?.toLowerCase().split(/[-_]/)[0];
    const languageUrl = languageUrls[languageCode];

    if (!languageUrl) {
        return { language: 'en' };
    }

    return {
        language: languageCode,
        language_url: languageUrl,
    };
}

export default function useTinyMceLanguage() {
    const { i18n } = useTranslation();
    const language = i18n.language ?? i18n.resolvedLanguage;

    return useMemo(() => getTinyMceLanguageConfig(language), [language]);
}
