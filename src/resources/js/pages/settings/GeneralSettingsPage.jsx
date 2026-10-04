import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Field from '../../components/form/Field';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import ControlsIcon from '../../components/icons/ControlsIcon';
import LanguageIcon from '../../components/icons/LanguageIcon';
import SettingsCard from './SettingsCard';
import { useSettingsSection } from './SettingsSectionsContext';

export default function GeneralSettingsPage() {
    const { t, i18n } = useTranslation();
    const {
        data: form,
        errors: formErrors,
        isLoading,
        isSaving,
        savedData,
        updateField,
    } = useSettingsSection('general');
    const adminLanguages = form.admin_languages;
    const siteLanguages = form.site_languages;
    const disabled = isLoading || isSaving;

    useEffect(() => {
        const adminLanguage = savedData?.admin_languages?.find(
            (language) => Number(language.id) === Number(savedData.admin_language_id)
        );

        if (adminLanguage?.code) {
            i18n.changeLanguage(adminLanguage.code);
        }
    }, [i18n, savedData]);

    return (
        <div className="space-y-[18px]">
            <SettingsCard
                icon={<ControlsIcon size={18} />}
                title={t('commonSettingsPage.generalSettingsTitle')}
                description={t('commonSettingsPage.generalSettingsDescription')}
            >
                <Field className="[&_.form-label]:text-[13px]" label={t('commonSettingsPage.siteName')} error={formErrors.site_name}>
                    <Input
                        className={formErrors.site_name ? '!border-red-500' : ''}
                        type="text"
                        name="site_name"
                        value={form.site_name}
                        onChange={updateField}
                        disabled={disabled}
                        required
                    />
                </Field>
            </SettingsCard>

            <SettingsCard
                icon={<LanguageIcon />}
                title={t('commonSettingsPage.languageSettingsTitle')}
                description={t('commonSettingsPage.languageSettingsDescription')}
            >
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                    <div>
                        <Field className="[&_.form-label]:text-[13px]" label={t('commonSettingsPage.adminLanguage')} error={formErrors.admin_language_id}>
                            <Select
                                className={formErrors.admin_language_id ? '!border-red-500' : ''}
                                name="admin_language_id"
                                value={form.admin_language_id}
                                onChange={updateField}
                                disabled={disabled}
                                required
                            >
                                <option value="">{t('commonSettingsPage.selectLanguage')}</option>
                                {adminLanguages.map((language) => (
                                    <option key={language.id} value={language.id}>{language.name}</option>
                                ))}
                            </Select>
                        </Field>
                        <p className="mt-2 text-[12px] text-[color:var(--color-secondary)]">{t('commonSettingsPage.adminLanguageHint')}</p>
                    </div>

                    <div>
                        <Field className="[&_.form-label]:text-[13px]" label={t('commonSettingsPage.siteLanguage')} error={formErrors.site_language_id}>
                            <Select
                                className={formErrors.site_language_id ? '!border-red-500' : ''}
                                name="site_language_id"
                                value={form.site_language_id}
                                onChange={updateField}
                                disabled={disabled}
                                required
                            >
                                <option value="">{t('commonSettingsPage.selectLanguage')}</option>
                                {siteLanguages.map((language) => (
                                    <option key={language.id} value={language.id}>{language.name}</option>
                                ))}
                            </Select>
                        </Field>
                        <p className="mt-2 text-[12px] text-[color:var(--color-secondary)]">{t('commonSettingsPage.siteLanguageHint')}</p>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
}
