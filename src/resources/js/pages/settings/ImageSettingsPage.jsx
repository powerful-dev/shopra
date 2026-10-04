import { useTranslation } from 'react-i18next';
import Field from '../../components/form/Field';
import Select from '../../components/form/Select';
import ImageIcon from '../../components/icons/ImageIcon';
import imageFitPlaceholder from '../../../images/settings/image-fit-placeholder.svg';
import SettingsCard from './SettingsCard';
import { useSettingsSection } from './SettingsSectionsContext';

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

export default function ImageSettingsPage() {
    const { t } = useTranslation();
    const {
        data: form,
        errors: formErrors,
        isLoading,
        isSaving,
        updateField,
    } = useSettingsSection('images');
    const disabled = isLoading || isSaving;

    return (
        <div>
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
                    isLoading={disabled}
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
                    isLoading={disabled}
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
    );
}
