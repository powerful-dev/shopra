import { useTranslation } from 'react-i18next';
import Field from '../../components/form/Field';
import { useSettingsSection } from './SettingsSectionsContext';

export default function CatalogSettingsPage() {
    const { t } = useTranslation();
    const {
        data: form,
        errors: formErrors,
        isLoading,
        isSaving,
        updateField,
    } = useSettingsSection('catalog');
    const shopUnits = form.shop_units;
    const disabled = isLoading || isSaving;

    return (
        <section className="rounded-[16px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[var(--shadow-sm)]">
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
                                disabled={disabled}
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
                                disabled={disabled}
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
    );
}
