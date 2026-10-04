import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CurrencySettingsForm from '../../components/settings/CurrencySettingsForm';
import CloseIcon from '../../components/icons/CloseIcon';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import { getCurrencySettings, saveCurrencySettings } from '../../services/settings';

const emptySettings = {
    currency: null,
    currency_rates: [],
};

const normalizeSettings = (settings = {}) => ({
    ...emptySettings,
    ...settings,
    currency_rates: Array.isArray(settings.currency_rates) ? settings.currency_rates : [],
});

export default function CurrencySettingsModal({ isOpen, initialData, onClose, onSaved }) {
    const { t } = useTranslation();
    const [form, setForm] = useState(() => normalizeSettings(initialData));
    const [savedForm, setSavedForm] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    usePageScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const controller = new AbortController();
        const initialSettings = normalizeSettings(initialData);

        setForm(initialSettings);
        setSavedForm(initialSettings);
        setErrors({});
        setMessage('');
        setIsLoading(true);

        getCurrencySettings({ signal: controller.signal })
            .then((settings) => {
                const normalizedSettings = normalizeSettings(settings);
                setForm(normalizedSettings);
                setSavedForm(normalizedSettings);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setMessage(error.message || t('commonSettingsPage.loadError'));
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [initialData, isOpen, t]);

    if (!isOpen) {
        return null;
    }

    const updateForm = (fields) => {
        const changedFields = Object.keys(fields);

        setForm((current) => ({ ...current, ...fields }));
        setErrors((current) => Object.fromEntries(
            Object.entries(current).filter(([field]) => (
                !changedFields.some((changedField) => (
                    field === changedField || field.startsWith(`${changedField}.`)
                ))
            ))
        ));
        setMessage('');
    };

    const saveSettings = async (event) => {
        event.preventDefault();
        setErrors({});
        setMessage('');
        setIsSaving(true);

        try {
            const settings = normalizeSettings(await saveCurrencySettings(form));
            setForm(settings);
            setSavedForm(settings);
            onSaved(settings);
            onClose();
        } catch (error) {
            setErrors(error.errors ?? {});
            setMessage(error.message || t('commonSettingsPage.saveError'));
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = savedForm !== null && JSON.stringify(form) !== JSON.stringify(savedForm);
    const isDisabled = isLoading || isSaving;
    const closeModal = () => {
        if (!isSaving) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" role="presentation" onMouseDown={closeModal}>
            <section
                className="modal-dialog flex h-[min(780px,calc(100vh-44px))] max-w-[900px] flex-col bg-[#fbfaf8] max-[620px]:h-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="currency-settings-modal-title"
                aria-busy={isDisabled}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border)] bg-white px-6 py-[18px] max-[620px]:px-4">
                    <div className="min-w-0">
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.12em] text-[color:var(--color-accent)]">
                            {t('commonSettingsPage.storeLabel')}
                        </p>
                        <h2 id="currency-settings-modal-title" className="mb-0 mt-1 truncate text-[24px] font-[760] tracking-[-.035em] text-[#312d29]">
                            {t('commonSettingsPage.tabs.currency')}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#706861] hover:text-[color:var(--color-accent)]"
                        disabled={isSaving}
                        onClick={closeModal}
                        aria-label={t('commonSettingsPage.currency.closeModal')}
                    >
                        <CloseIcon width="18" height="18" />
                    </button>
                </header>

                <form id="currency-settings-modal-form" className="min-h-0 flex-1 overflow-y-auto p-5 max-[620px]:p-3" onSubmit={saveSettings}>
                    {message && <p className="mb-3 mt-0 text-xs text-red-600" role="alert">{message}</p>}
                    <CurrencySettingsForm
                        value={form}
                        errors={errors}
                        disabled={isDisabled}
                        onChange={updateForm}
                    />
                </form>

                <footer className="flex items-center justify-end gap-2 border-t border-[color:var(--color-border)] bg-white px-6 py-3 max-[620px]:px-4">
                    <button type="button" className="button button--secondary" disabled={isSaving} onClick={closeModal}>
                        {t('commonSettingsPage.currency.cancel')}
                    </button>
                    <button type="submit" form="currency-settings-modal-form" className="button button--primary" disabled={isDisabled || !isDirty}>
                        {isSaving ? t('commonSettingsPage.saving') : t('common.save')}
                    </button>
                </footer>
            </section>
        </div>
    );
}
