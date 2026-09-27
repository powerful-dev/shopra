import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import Field from '../../components/form/Field';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import SaveIcon from '../../components/icons/SaveIcon';
import BackIcon from '../../components/icons/BackIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import { csrf, request } from '../../services/api';

const IMAGE_SIZE_FIELDS = [
    'group_small_image_max_width',
    'group_small_image_max_height',
    'group_large_image_max_width',
    'group_large_image_max_height',
    'product_small_image_max_width',
    'product_small_image_max_height',
    'product_large_image_max_width',
    'product_large_image_max_height',
];

const formFromData = (data) => ({
    site_name: data.site_name ?? '',
    admin_language_id: data.admin_language_id ?? '',
    site_language_id: data.site_language_id ?? '',
    low_stock_threshold: data.low_stock_threshold ?? 5,
    default_shop_unit_id: data.default_shop_unit_id ?? '',
    group_small_image_max_width: data.group_small_image_max_width ?? '',
    group_small_image_max_height: data.group_small_image_max_height ?? '',
    group_small_image_fit: data.group_small_image_fit ?? 'contain',
    group_large_image_max_width: data.group_large_image_max_width ?? '',
    group_large_image_max_height: data.group_large_image_max_height ?? '',
    group_large_image_fit: data.group_large_image_fit ?? 'contain',
    group_image_format: data.group_image_format ?? 'webp',
    product_small_image_max_width: data.product_small_image_max_width ?? '',
    product_small_image_max_height: data.product_small_image_max_height ?? '',
    product_small_image_fit: data.product_small_image_fit ?? 'contain',
    product_large_image_max_width: data.product_large_image_max_width ?? '',
    product_large_image_max_height: data.product_large_image_max_height ?? '',
    product_large_image_fit: data.product_large_image_fit ?? 'contain',
    product_image_format: data.product_image_format ?? 'webp',
});

const formForRequest = (form) => ({
    ...form,
    ...Object.fromEntries(IMAGE_SIZE_FIELDS.map((field) => [field, form[field] === '' ? null : form[field]])),
});

function ImageSizeSettings({ title, namePrefix, form, formErrors, isLoading, onChange, t }) {
    const widthField = `${namePrefix}_image_max_width`;
    const heightField = `${namePrefix}_image_max_height`;
    const fitField = `${namePrefix}_image_fit`;

    return (
        <div>
            <h4 className="mb-3 text-[13px] font-[700] text-[color:var(--color-primary)]">
                {title}
            </h4>

            <div className="grid grid-cols-3 gap-x-4 gap-y-[18px] max-md:grid-cols-1">
                <Field label={t('commonSettingsPage.imageMaxWidth')} error={formErrors[widthField]}>
                    <Input
                        className={formErrors[widthField] ? '!border-red-500' : ''}
                        type="number"
                        name={widthField}
                        min="1"
                        step="1"
                        value={form[widthField]}
                        onChange={onChange}
                        disabled={isLoading}
                    />
                </Field>

                <Field label={t('commonSettingsPage.imageMaxHeight')} error={formErrors[heightField]}>
                    <Input
                        className={formErrors[heightField] ? '!border-red-500' : ''}
                        type="number"
                        name={heightField}
                        min="1"
                        step="1"
                        value={form[heightField]}
                        onChange={onChange}
                        disabled={isLoading}
                    />
                </Field>

                <Field label={t('commonSettingsPage.imageFit')} error={formErrors[fitField]}>
                    <Select
                        className={formErrors[fitField] ? '!border-red-500' : ''}
                        name={fitField}
                        value={form[fitField]}
                        onChange={onChange}
                        disabled={isLoading}
                    >
                        <option value="contain">{t('commonSettingsPage.imageFitOptions.contain')}</option>
                        <option value="cover">{t('commonSettingsPage.imageFitOptions.cover')}</option>
                    </Select>
                </Field>
            </div>
        </div>
    );
}

export default function CommonSettingsPage() {
    const { t, i18n } = useTranslation();
    const [form, setForm] = useState(() => formFromData({}));
    const [adminLanguages, setAdminLanguages] = useState([]);
    const [siteLanguages, setSiteLanguages] = useState([]);
    const [shopUnits, setShopUnits] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await request('/api/settings/common');

                setForm(formFromData(data));
                setAdminLanguages(data.admin_languages ?? []);
                setSiteLanguages(data.site_languages ?? []);
                setShopUnits(data.shop_units ?? []);

                const adminLanguage = data.admin_languages?.find(
                    (language) => Number(language.id) === Number(data.admin_language_id)
                );

                if (adminLanguage?.code) {
                    await i18n.changeLanguage(adminLanguage.code);
                }
            } catch (error) {
                setMessageType('error');
                setMessage(error.message ?? i18n.t('commonSettingsPage.loadError'));
            } finally {
                setIsLoading(false);
            }
        })();
    }, [i18n]);

    const updateField = ({ target }) => {
        setForm((current) => ({ ...current, [target.name]: target.value }));
        setFormErrors((current) => ({ ...current, [target.name]: undefined }));
    };

    const saveData = async () => {
        setFormErrors({});
        setMessage('');
        setIsSubmitting(true);

        try {
            await csrf();
            const { data } = await request('/api/settings/common', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formForRequest(form)),
            });

            setForm(formFromData(data));
            setAdminLanguages(data.admin_languages ?? []);
            setSiteLanguages(data.site_languages ?? []);
            setShopUnits(data.shop_units ?? []);

            const adminLanguage = data.admin_languages?.find(
                (language) => Number(language.id) === Number(data.admin_language_id)
            );

            if (adminLanguage?.code) {
                await i18n.changeLanguage(adminLanguage.code);
            }

            setMessageType('success');
            setMessage(t('commonSettingsPage.saved'));
        } catch (error) {
            setFormErrors(error.errors ?? {});
            setMessageType('error');
            setMessage(error.message ?? t('commonSettingsPage.saveError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Breadcrumbs className="mb-5 max-lg:hidden" />

            <section className="mb-5 flex w-full flex-wrap items-center gap-x-6 gap-y-3">
            
                <div className="flex min-w-0 flex-1 items-center gap-3 max-lg:gap-2">
                    <button
                        type="button"
                        className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white p-0 text-[#615950]"
    
                        onClick={() => navigate('/admin/settings')}
                    >
                        <BackIcon />
                    </button>
    
                    <h1 className="m-0 min-w-0 text-[32px] font-[760] leading-none tracking-[-0.05em] text-[color:var(--color-primary)] max-lg:text-[19px]">
                        {t('commonSettingsPage.title')}
                    </h1>
                </div>
    
                <div className="ml-auto flex shrink-0 items-center justify-end">
                    <button
                        className="button button--primary h-[40px] shrink-0 whitespace-nowrap px-[18px]"
                        type="submit"
                        form="common-settings-form"
                        disabled={isLoading || isSubmitting}
                    >
                        <SaveIcon />
                        {isSubmitting ? t('commonSettingsPage.saving') : t('common.save')}
                    </button>
                </div>
    
            </section>

            {message && (
                <div className={`alert alert--${messageType} mb-5 h-[40px] py-0`} role="status" aria-live="polite">
                    <span className="alert__icon"><CheckIcon /></span>
                    <span>{message}</span>
                </div>
            )}

            <form id="common-settings-form" noValidate onSubmit={(event) => { event.preventDefault(); saveData(); }}>
                <section className="rounded-[16px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[var(--shadow-sm)]">
                    <div className="p-5 max-sm:p-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-[18px] max-md:grid-cols-1">
                            <h2 className="m-0 text-[16px] font-[760] text-[color:var(--color-primary)] md:col-span-2">
                                {t('commonSettingsPage.title')}
                            </h2>

                            <Field className="md:col-span-2" label={t('commonSettingsPage.siteName')} error={formErrors.site_name}>
                                <input
                                    className={`form-input ${formErrors.site_name ? '!border-red-500' : ''}`}
                                    type="text"
                                    name="site_name"
                                    value={form.site_name}
                                    onChange={updateField}
                                    disabled={isLoading}
                                    required
                                />
                            </Field>

                            <Field label={t('commonSettingsPage.adminLanguage')} error={formErrors.admin_language_id}>
                                <select
                                    className={`form-select ${formErrors.admin_language_id ? '!border-red-500' : ''}`}
                                    name="admin_language_id"
                                    value={form.admin_language_id}
                                    onChange={updateField}
                                    disabled={isLoading}
                                    required
                                >
                                    <option value="">{t('commonSettingsPage.selectLanguage')}</option>
                                    {adminLanguages.map((language) => (
                                        <option key={language.id} value={language.id}>{language.name}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label={t('commonSettingsPage.siteLanguage')} error={formErrors.site_language_id}>
                                <select
                                    className={`form-select ${formErrors.site_language_id ? '!border-red-500' : ''}`}
                                    name="site_language_id"
                                    value={form.site_language_id}
                                    onChange={updateField}
                                    disabled={isLoading}
                                    required
                                >
                                    <option value="">{t('commonSettingsPage.selectLanguage')}</option>
                                    {siteLanguages.map((language) => (
                                        <option key={language.id} value={language.id}>{language.name}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                    </div>
                </section>

                <section className="mt-5 rounded-[16px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[var(--shadow-sm)]">
                    <div className="p-5 max-sm:p-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-[18px] max-md:grid-cols-1">
                        <h2 className="m-0 text-[16px] font-[760] text-[color:var(--color-primary)] md:col-span-2">
                                {t('commonSettingsPage.shopSettingsTitle')}
                        </h2>

                            <Field label={t('commonSettingsPage.lowStockThreshold')} error={formErrors.low_stock_threshold}>
                            <input
                                    className={`form-input ${formErrors.low_stock_threshold ? '!border-red-500' : ''}`}
                                    type="number"
                                    name="low_stock_threshold"
                                    min="1"
                                    step="1"
                                    value={form.low_stock_threshold}
                                onChange={updateField}
                                disabled={isLoading}
                                required
                            />
                        </Field>

                            <Field label={t('commonSettingsPage.defaultShopUnit')} error={formErrors.default_shop_unit_id}>
                            <select
                                    className={`form-select ${formErrors.default_shop_unit_id ? '!border-red-500' : ''}`}
                                    name="default_shop_unit_id"
                                    value={form.default_shop_unit_id}
                                onChange={updateField}
                                disabled={isLoading}
                            >
                                    <option value="">{t('commonSettingsPage.selectShopUnit')}</option>
                                    {shopUnits.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.is_system && unit.code ? t(`shopUnits.${unit.code}.name`) : unit.name || unit.short_name || unit.code}
                                        </option>
                                ))}
                            </select>
                        </Field>

                            <div className="mt-1 border-t border-[color:var(--color-border)] pt-5 md:col-span-2">
                                <h2 className="m-0 text-[16px] font-[760] text-[color:var(--color-primary)]">
                                    {t('commonSettingsPage.imageSettingsTitle')}
                                </h2>
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="mb-3 text-[14px] font-[700] text-[color:var(--color-primary)]">
                                    {t('commonSettingsPage.categoryImagesTitle')}
                                </h3>

                                <div className="space-y-[18px]">
                                    <ImageSizeSettings
                                        title={t('commonSettingsPage.smallImagesTitle')}
                                        namePrefix="group_small"
                                        form={form}
                                        formErrors={formErrors}
                                        isLoading={isLoading}
                                        onChange={updateField}
                                        t={t}
                                    />

                                    <ImageSizeSettings
                                        title={t('commonSettingsPage.largeImagesTitle')}
                                        namePrefix="group_large"
                                        form={form}
                                        formErrors={formErrors}
                                        isLoading={isLoading}
                                        onChange={updateField}
                                        t={t}
                                    />

                                    <div className="grid grid-cols-2 gap-x-4 max-md:grid-cols-1">
                                        <Field label={t('commonSettingsPage.imageFormat')} error={formErrors.group_image_format}>
                                            <Select
                                                className={formErrors.group_image_format ? '!border-red-500' : ''}
                                                name="group_image_format"
                                                value={form.group_image_format}
                                                onChange={updateField}
                                                disabled={isLoading}
                                            >
                                                <option value="original">{t('commonSettingsPage.imageFormatOptions.original')}</option>
                                                <option value="webp">{t('commonSettingsPage.imageFormatOptions.webp')}</option>
                                                <option value="avif">{t('commonSettingsPage.imageFormatOptions.avif')}</option>
                                            </Select>
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="mb-3 text-[14px] font-[700] text-[color:var(--color-primary)]">
                                    {t('commonSettingsPage.productImagesTitle')}
                                </h3>

                                <div className="space-y-[18px]">
                                    <ImageSizeSettings
                                        title={t('commonSettingsPage.smallImagesTitle')}
                                        namePrefix="product_small"
                                        form={form}
                                        formErrors={formErrors}
                                        isLoading={isLoading}
                                        onChange={updateField}
                                        t={t}
                                    />

                                    <ImageSizeSettings
                                        title={t('commonSettingsPage.largeImagesTitle')}
                                        namePrefix="product_large"
                                        form={form}
                                        formErrors={formErrors}
                                        isLoading={isLoading}
                                        onChange={updateField}
                                        t={t}
                                    />

                                    <div className="grid grid-cols-2 gap-x-4 max-md:grid-cols-1">
                                        <Field label={t('commonSettingsPage.imageFormat')} error={formErrors.product_image_format}>
                                            <Select
                                                className={formErrors.product_image_format ? '!border-red-500' : ''}
                                                name="product_image_format"
                                                value={form.product_image_format}
                                                onChange={updateField}
                                                disabled={isLoading}
                                            >
                                                <option value="original">{t('commonSettingsPage.imageFormatOptions.original')}</option>
                                                <option value="webp">{t('commonSettingsPage.imageFormatOptions.webp')}</option>
                                                <option value="avif">{t('commonSettingsPage.imageFormatOptions.avif')}</option>
                                            </Select>
                                        </Field>
                                    </div>
                                </div>
                            </div>
                    </div>
                    </div>
                </section>
            </form>
        </>
    );
}
