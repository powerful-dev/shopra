import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Field from '../../components/form/Field';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import SaveIcon from '../../components/icons/SaveIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import ControlsIcon from '../../components/icons/ControlsIcon';
import ProductsIcon from '../../components/icons/ProductsIcon';
import ImageIcon from '../../components/icons/ImageIcon';
import LanguageIcon from '../../components/icons/LanguageIcon';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import { csrf, request } from '../../services/api';
import imageFitPlaceholder from '../../../images/settings/image-fit-placeholder.svg';

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

function SettingsCard({ icon, title, description, children }) {
    return (
        <section className="rounded-[15px] border border-[color:var(--color-border)] bg-white px-7 py-[26px] shadow-[var(--shadow-sm)] max-sm:px-4 max-sm:py-5">
            <header className="mb-[26px] flex items-start gap-3">
                <span className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[#eee1d8] bg-[#fffaf6] text-[color:var(--color-accent)]">
                    {icon}
                </span>
                <span className="min-w-0 pt-px">
                    <h2 className="m-0 text-[18px] font-[760] leading-[1.35] tracking-[-0.02em] text-[color:var(--color-primary)]">{title}</h2>
                    <p className="mt-1 text-[13px] leading-[1.4] text-[color:var(--color-secondary)]">{description}</p>
                </span>
            </header>
            {children}
        </section>
    );
}

function ImageFitOption({ fitField, value, selectedValue, disabled, onChange, t }) {
    const isSelected = selectedValue === value;

    return (
        <label className={`flex min-h-[98px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border bg-white px-3 py-[10px] transition ${isSelected ? 'border-[color:var(--color-accent)] bg-[#fff7f1] shadow-[inset_0_0_0_1px_var(--color-accent)]' : 'border-[color:var(--color-border)] hover:border-[#d8c7bc]'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
            <input
                className="sr-only"
                type="radio"
                name={fitField}
                value={value}
                checked={isSelected}
                onChange={onChange}
                disabled={disabled}
            />
            <span className="grid h-[52px] w-[54px] place-items-center overflow-hidden rounded-[3px] bg-[#f2efec]" aria-hidden="true">
                <img
                    className={`h-full w-full ${value === 'contain' ? 'object-contain' : 'object-cover'}`}
                    src={imageFitPlaceholder}
                    alt=""
                />
            </span>
            <span className={`text-[12px] font-[700] ${isSelected ? 'text-[#9a3b12]' : 'text-[color:var(--color-secondary)]'}`}>
                {t(`commonSettingsPage.imageFitOptions.${value}`)}
            </span>
        </label>
    );
}

function ImageDimensionInput({ field, value, error, isLoading, onChange, label, t }) {
    return (
        <label className="block min-w-0">
            <span className="sr-only">{label}</span>
            <span className="mb-1.5 hidden text-[11px] font-[700] text-[color:var(--color-secondary)] max-xl:block" aria-hidden="true">{label}</span>
            <span className={`form-control-group flex h-[44px] items-center overflow-hidden rounded-[9px] bg-white ${error ? '!border-red-500' : ''}`}>
                <input
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[13px] text-[color:var(--color-primary)] outline-none placeholder:text-[#a69c94]"
                    type="number"
                    name={field}
                    min="1"
                    step="1"
                    placeholder={t('commonSettingsPage.imageSizeAuto')}
                    value={value}
                    onChange={onChange}
                    disabled={isLoading}
                />
                <span className="shrink-0 pr-3 text-[11px] text-[#8e847c]">px</span>
            </span>
            {error && <span className="mt-1 block text-[11px] text-red-600">{error[0]}</span>}
        </label>
    );
}

function ImageSizeSettings({ title, description, namePrefix, form, formErrors, isLoading, onChange, t }) {
    const widthField = `${namePrefix}_image_max_width`;
    const heightField = `${namePrefix}_image_max_height`;
    const fitField = `${namePrefix}_image_fit`;

    return (
        <div className="grid grid-cols-[minmax(155px,1.2fr)_minmax(130px,.85fr)_minmax(130px,.85fr)_minmax(250px,1.35fr)] items-center gap-3 border-t border-[color:var(--color-border)] py-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
            <div className="min-w-0 max-xl:col-span-2 max-sm:col-span-1">
                <h4 className="m-0 text-[13px] font-[760] text-[color:var(--color-primary)]">{title}</h4>
                <p className="mt-1 text-[11px] leading-[1.4] text-[color:var(--color-secondary)]">{description}</p>
            </div>

            <ImageDimensionInput
                field={widthField}
                value={form[widthField]}
                error={formErrors[widthField]}
                isLoading={isLoading}
                onChange={onChange}
                label={t('commonSettingsPage.imageMaxWidth')}
                t={t}
            />

            <ImageDimensionInput
                field={heightField}
                value={form[heightField]}
                error={formErrors[heightField]}
                isLoading={isLoading}
                onChange={onChange}
                label={t('commonSettingsPage.imageMaxHeight')}
                t={t}
            />

            <fieldset className="min-w-0 max-xl:col-span-2 max-sm:col-span-1">
                <legend className="sr-only">{t('commonSettingsPage.imageFit')}</legend>
                <div className="grid grid-cols-2 gap-2">
                    <ImageFitOption fitField={fitField} value="contain" selectedValue={form[fitField]} disabled={isLoading} onChange={onChange} t={t} />
                    <ImageFitOption fitField={fitField} value="cover" selectedValue={form[fitField]} disabled={isLoading} onChange={onChange} t={t} />
                </div>
                {formErrors[fitField] && <span className="mt-1 block text-[11px] text-red-600">{formErrors[fitField][0]}</span>}
            </fieldset>
        </div>
    );
}

function ImageSettingsCard({ title, description, namePrefix, formatField, form, formErrors, isLoading, onChange, t }) {
    return (
        <SettingsCard icon={<ImageIcon />} title={title} description={description}>
            <div className="grid grid-cols-[minmax(155px,1.2fr)_minmax(130px,.85fr)_minmax(130px,.85fr)_minmax(250px,1.35fr)] gap-3 pb-3 text-[11px] font-[700] text-[color:var(--color-secondary)] max-xl:hidden">
                <span>{t('commonSettingsPage.imageSize')}</span>
                <span>{t('commonSettingsPage.imageMaxWidth')}</span>
                <span>{t('commonSettingsPage.imageMaxHeight')}</span>
                <span>{t('commonSettingsPage.imageFit')}</span>
            </div>

            <ImageSizeSettings
                title={t('commonSettingsPage.smallImagesTitle')}
                description={t('commonSettingsPage.smallImagesDescription')}
                namePrefix={`${namePrefix}_small`}
                form={form}
                formErrors={formErrors}
                isLoading={isLoading}
                onChange={onChange}
                t={t}
            />

            <ImageSizeSettings
                title={t('commonSettingsPage.largeImagesTitle')}
                description={t('commonSettingsPage.largeImagesDescription')}
                namePrefix={`${namePrefix}_large`}
                form={form}
                formErrors={formErrors}
                isLoading={isLoading}
                onChange={onChange}
                t={t}
            />

            <div className="flex flex-wrap items-end gap-6 border-t border-[color:var(--color-border)] pt-4">
                <Field className="w-[190px] [&_.form-label]:text-[12px]" label={t('commonSettingsPage.imageFormat')} error={formErrors[formatField]}>
                    <Select
                        className={formErrors[formatField] ? '!border-red-500' : ''}
                        name={formatField}
                        value={form[formatField]}
                        onChange={onChange}
                        disabled={isLoading}
                    >
                        <option value="original">{t('commonSettingsPage.imageFormatOptions.original')}</option>
                        <option value="webp">{t('commonSettingsPage.imageFormatOptions.webp')}</option>
                    </Select>
                </Field>
                <p className="flex min-h-[42px] max-w-[310px] items-center text-[11px] leading-[1.55] text-[color:var(--color-secondary)]">
                    {t('commonSettingsPage.imageFormatHint')}
                </p>
            </div>
        </SettingsCard>
    );
}

export default function CommonSettingsPage() {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('general');
    const [form, setForm] = useState(() => formFromData({}));
    const [adminLanguages, setAdminLanguages] = useState([]);
    const [siteLanguages, setSiteLanguages] = useState([]);
    const [shopUnits, setShopUnits] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

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
            <section className="mb-7 flex w-full flex-wrap items-end gap-x-6 gap-y-4">
                <div className="min-w-0 flex-1">
                    <p className="mb-3 text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)] max-lg:hidden">
                        {t('commonSettingsPage.storeLabel')}
                    </p>
                    <h1 className="m-0 text-[32px] font-[760] leading-none tracking-[-0.05em] text-[color:var(--color-primary)] max-lg:text-[24px]">
                        {t('commonSettingsPage.pageTitle')}
                    </h1>
                    <p className="mt-2 text-[14px] text-[color:var(--color-secondary)]">
                        {t('commonSettingsPage.pageDescription')}
                    </p>
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
                <div className="grid grid-cols-[225px_minmax(0,1fr)] items-start gap-9 pb-8 max-lg:grid-cols-1 max-lg:gap-5">
                    <nav className="flex min-w-0 flex-col gap-1 max-lg:flex-row max-lg:overflow-x-auto max-lg:pb-1" role="tablist" aria-label={t('commonSettingsPage.tabsLabel')}>
                        {[
                            ['general', t('commonSettingsPage.tabs.general'), <ControlsIcon size="18" key="general" />],
                            ['catalog', t('commonSettingsPage.tabs.catalog'), <ProductsIcon key="catalog" />],
                            ['images', t('commonSettingsPage.tabs.images'), <ImageIcon size="18" key="images" />],
                        ].map(([id, label, icon]) => {
                            const isActive = activeTab === id;

                            return (
                                <button
                                    key={id}
                                    type="button"
                                    role="tab"
                                    id={`common-settings-tab-${id}`}
                                    aria-controls={`common-settings-panel-${id}`}
                                    aria-selected={isActive}
                                    className={`flex min-h-[46px] w-full items-center gap-3 rounded-[11px] border px-[14px] text-left text-[13px] transition-colors max-lg:w-auto max-lg:min-w-max ${isActive ? 'border-[#f0cdb9] bg-[#fff1e7] font-[720] text-[#8c3510]' : 'border-transparent bg-transparent font-[520] text-[color:var(--color-secondary)] hover:bg-white'}`}
                                    onClick={() => setActiveTab(id)}
                                >
                                    <span className="grid h-5 w-5 shrink-0 place-items-center">{icon}</span>
                                    <span>{label}</span>
                                    {isActive && <span className="ml-auto max-lg:hidden"><ChevronRightIcon /></span>}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="min-w-0">
                        {activeTab === 'general' && (
                            <div id="common-settings-panel-general" role="tabpanel" aria-labelledby="common-settings-tab-general" className="space-y-[18px]">
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
                                            disabled={isLoading}
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
                                                    disabled={isLoading}
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
                                                    disabled={isLoading}
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
                        )}

                        {activeTab === 'catalog' && (
                            <section id="common-settings-panel-catalog" role="tabpanel" aria-labelledby="common-settings-tab-catalog" className="rounded-[16px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[var(--shadow-sm)]">
                                <div className="p-5 max-sm:p-4">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-[18px] max-md:grid-cols-1">
                                        <h2 className="m-0 text-[16px] font-[760] text-[color:var(--color-primary)] md:col-span-2">
                                            {t('commonSettingsPage.shopSettingsTitle')}
                                        </h2>

                                        <div>
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
                                            <p className="mt-2 text-[12px] leading-[1.45] text-[color:var(--color-secondary)]">
                                                {t('commonSettingsPage.lowStockThresholdHint')}
                                            </p>
                                        </div>

                                        <div>
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
                                            <p className="mt-2 text-[12px] leading-[1.45] text-[color:var(--color-secondary)]">
                                                {t('commonSettingsPage.defaultShopUnitHint')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'images' && (
                            <div id="common-settings-panel-images" role="tabpanel" aria-labelledby="common-settings-tab-images">
                                <header className="mb-[18px]">
                                    <h2 className="m-0 text-[18px] font-[760] tracking-[-0.02em] text-[color:var(--color-primary)]">
                                        {t('commonSettingsPage.imageSettingsTitle')}
                                    </h2>
                                    <p className="mt-1 text-[13px] text-[color:var(--color-secondary)]">
                                        {t('commonSettingsPage.imageSettingsDescription')}
                                    </p>
                                </header>

                                <div className="space-y-[18px]">
                                    <ImageSettingsCard
                                        title={t('commonSettingsPage.categoryImagesTitle')}
                                        description={t('commonSettingsPage.categoryImagesDescription')}
                                        namePrefix="group"
                                        formatField="group_image_format"
                                        form={form}
                                        formErrors={formErrors}
                                        isLoading={isLoading}
                                        onChange={updateField}
                                        t={t}
                                    />

                                    <ImageSettingsCard
                                        title={t('commonSettingsPage.productImagesTitle')}
                                        description={t('commonSettingsPage.productImagesDescription')}
                                        namePrefix="product"
                                        formatField="product_image_format"
                                        form={form}
                                        formErrors={formErrors}
                                        isLoading={isLoading}
                                        onChange={updateField}
                                        t={t}
                                    />

                                    <aside className="rounded-[12px] bg-[#f1eeea] px-5 py-4 text-[12px] leading-[1.65] text-[color:var(--color-secondary)]">
                                        <h3 className="m-0 text-[13px] font-[760] text-[color:var(--color-primary)]">
                                            {t('commonSettingsPage.imageFitHelpTitle')}
                                        </h3>
                                        <p className="mt-1">{t('commonSettingsPage.imageFitHelpText')}</p>
                                    </aside>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}
