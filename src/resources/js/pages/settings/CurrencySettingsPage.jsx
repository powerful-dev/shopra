import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Field from '../../components/form/Field';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import ControlsIcon from '../../components/icons/ControlsIcon';
import CurrencyIcon from '../../components/icons/CurrencyIcon';
import { supportedCurrencies } from '../../adminConfig';
import { useSettingsSection } from './SettingsSectionsContext';

export default function CurrencySettingsPage() {
    const { t } = useTranslation();
    const {
        data: form,
        errors: formErrors,
        isLoading,
        isSaving,
        updateData: updateCurrencySettings,
    } = useSettingsSection('currencies');
    const [currencyToAdd, setCurrencyToAdd] = useState('');
    const currencyCodes = supportedCurrencies.map(({ code }) => code);
    const disabled = isLoading || isSaving;
    const rates = form.currency_rates;

    const availableCurrencies = currencyCodes.filter(
        (code) => code !== form.currency && !rates.some((rate) => rate.code === code)
    );

    const updateRate = (currencyCode, value) => {
        updateCurrencySettings({
            currency_rates: rates.map((item) => (
                item.code === currencyCode ? { ...item, rate: value } : item
            )),
        });
    };

    const updateBaseCurrency = (currencyCode) => {
        updateCurrencySettings({
            currency: currencyCode,
            currency_rates: rates.filter(({ code }) => code !== currencyCode),
        });
        setCurrencyToAdd('');
    };

    const addCurrency = () => {
        if (!currencyToAdd || rates.some(({ code }) => code === currencyToAdd)) {
            return;
        }

        updateCurrencySettings({ currency_rates: [...rates, { code: currencyToAdd, rate: '' }] });
        setCurrencyToAdd('');
    };

    return (
        <section className="rounded-[15px] border border-[color:var(--color-border)] bg-white px-7 py-[26px] shadow-[var(--shadow-sm)] max-sm:px-4 max-sm:py-5">
            <header className="mb-[22px] flex items-start gap-3">
                <span className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center text-[color:var(--color-accent)]">
                    <CurrencyIcon size={20} />
                </span>
                <span className="min-w-0">
                    <h2 className="m-0 text-[18px] font-[760] leading-[1.35] tracking-[-0.02em] text-[color:var(--color-primary)]">
                        {t('commonSettingsPage.currency.title')}
                    </h2>
                    <p className="mt-1 text-[13px] leading-[1.4] text-[color:var(--color-secondary)]">
                        {t('commonSettingsPage.currency.description')}
                    </p>
                </span>
            </header>

            <div className="max-w-[300px]">
                <Field className="[&_.form-label]:text-[13px]" label={t('commonSettingsPage.currency.baseCurrency')} error={formErrors.currency}>
                    <Select
                        className={formErrors.currency ? '!border-red-500' : ''}
                        value={form.currency}
                        disabled={disabled}
                        onChange={({ target }) => updateBaseCurrency(target.value)}
                    >
                        {supportedCurrencies.map(({ code }) => (
                            <option key={code} value={code}>{code} — {t(`currencies.${code}`)}</option>
                        ))}
                    </Select>
                </Field>
            </div>
            <p className="mt-4 text-[12px] leading-[1.5] text-[color:var(--color-secondary)]">
                {t('commonSettingsPage.currency.baseCurrencyHint')}
            </p>

            <div className="mt-5 border-t border-[color:var(--color-border)] pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="m-0 text-[16px] font-[760] text-[color:var(--color-primary)]">
                        {t('commonSettingsPage.currency.ratesTitle')}
                    </h3>
                    <span className="rounded-[7px] bg-[#f4eae2] px-[10px] py-[6px] text-[11px] font-[600] text-[#8a573b]">
                        {t('commonSettingsPage.currency.manualRate')}
                    </span>
                </div>
                <p className="mt-4 text-[12px] leading-[1.55] text-[color:var(--color-secondary)]">
                    {t('commonSettingsPage.currency.ratesDescription', { currency: form.currency })}
                </p>

                {rates.length > 0 && (
                    <div className="mt-5 space-y-[10px]">
                        {rates.map(({ code, rate }, index) => (
                            <label key={code} className="grid max-w-[390px] grid-cols-[84px_minmax(150px,230px)_auto] items-center gap-3 max-sm:grid-cols-[72px_minmax(0,1fr)_auto] max-sm:gap-2">
                                <span className="text-[13px] font-[760] text-[color:var(--color-primary)]">1 {code} =</span>
                                <Input
                                    className={formErrors[`currency_rates.${index}.rate`] ? '!border-red-500' : ''}
                                    type="number"
                                    min="0"
                                    step="any"
                                    inputMode="decimal"
                                    value={rate}
                                    disabled={disabled}
                                    placeholder={t('commonSettingsPage.currency.ratePlaceholder')}
                                    aria-label={t('commonSettingsPage.currency.rateLabel', { currency: code })}
                                    onChange={({ target }) => updateRate(code, target.value)}
                                />
                                <span className="text-[12px] text-[color:var(--color-secondary)]">{form.currency}</span>
                            </label>
                        ))}
                    </div>
                )}

                <div className="mt-[18px] flex flex-wrap items-center gap-[10px]">
                    <label className="w-[280px] max-sm:w-full">
                        <span className="sr-only">{t('commonSettingsPage.currency.currencyToAdd')}</span>
                        <Select value={currencyToAdd} disabled={disabled || availableCurrencies.length === 0} onChange={({ target }) => setCurrencyToAdd(target.value)}>
                            <option value="">
                                {availableCurrencies.length > 0
                                    ? t('commonSettingsPage.currency.selectCurrency')
                                    : t('commonSettingsPage.currency.noCurrenciesAvailable')}
                            </option>
                            {availableCurrencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency} — {t(`currencies.${currency}`)}
                                </option>
                            ))}
                        </Select>
                    </label>
                    <button
                        type="button"
                        className="button button--outline min-h-[38px] rounded-[8px] px-3"
                        disabled={disabled || !currencyToAdd}
                        onClick={addCurrency}
                    >
                        {t('commonSettingsPage.currency.addCurrency')}
                    </button>
                </div>

                <aside className="mt-[18px] flex items-start gap-3 rounded-[11px] bg-[#f4f0ed] px-4 py-[15px] text-[12px] leading-[1.65] text-[#735846]">
                    <span className="mt-0.5 shrink-0 text-[#806f63]" aria-hidden="true"><ControlsIcon /></span>
                    <p>{t('commonSettingsPage.currency.rateInfo')}</p>
                </aside>
            </div>
        </section>
    );
}
