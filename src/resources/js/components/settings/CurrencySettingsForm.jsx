import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedCurrencies } from '../../adminConfig';
import Field from '../form/Field';
import Input from '../form/Input';
import Select from '../form/Select';
import CloseIcon from '../icons/CloseIcon';
import ControlsIcon from '../icons/ControlsIcon';
import CurrencyIcon from '../icons/CurrencyIcon';

export default function CurrencySettingsForm({ value, errors = {}, disabled = false, onChange }) {
    const { t } = useTranslation();
    const [currencyToAdd, setCurrencyToAdd] = useState('');
    const rates = value.currency_rates ?? [];
    const availableCurrencies = supportedCurrencies
        .map(({ code }) => code)
        .filter((code) => code !== value.currency && !rates.some((rate) => rate.code === code));

    const updateRate = (currencyCode, rate) => {
        onChange({
            currency_rates: rates.map((item) => (
                item.code === currencyCode ? { ...item, rate } : item
            )),
        });
    };

    const updateBaseCurrency = (currency) => {
        onChange({
            currency,
            currency_rates: rates.filter(({ code }) => code !== currency),
        });
        setCurrencyToAdd('');
    };

    const addCurrency = () => {
        if (!currencyToAdd || rates.some(({ code }) => code === currencyToAdd)) {
            return;
        }

        onChange({ currency_rates: [...rates, { code: currencyToAdd, rate: '' }] });
        setCurrencyToAdd('');
    };

    const removeCurrency = (currencyCode) => {
        onChange({ currency_rates: rates.filter(({ code }) => code !== currencyCode) });
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
                <Field className="[&_.form-label]:text-[13px]" label={t('commonSettingsPage.currency.baseCurrency')} error={errors.currency}>
                    <Select
                        className={errors.currency ? '!border-red-500' : ''}
                        value={value.currency ?? ''}
                        disabled={disabled}
                        onChange={({ target }) => updateBaseCurrency(target.value || null)}
                    >
                        <option value="" disabled>{t('commonSettingsPage.currency.selectCurrency')}</option>
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
                    {t('commonSettingsPage.currency.ratesDescription', { currency: value.currency ?? '—' })}
                </p>

                {rates.length > 0 && (
                    <div className="mt-5 space-y-[10px]">
                        {rates.map(({ code, rate }, index) => (
                            <div key={code} className="grid max-w-[438px] grid-cols-[84px_minmax(150px,230px)_auto_36px] items-center gap-3 max-sm:grid-cols-[72px_minmax(0,1fr)_auto_34px] max-sm:gap-2">
                                <span className="text-[13px] font-[760] text-[color:var(--color-primary)]">1 {code} =</span>
                                <Input
                                    className={errors[`currency_rates.${index}.rate`] ? '!border-red-500' : ''}
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
                                <span className="text-[12px] text-[color:var(--color-secondary)]">{value.currency ?? '—'}</span>
                                <button
                                    type="button"
                                    className="grid h-9 w-9 place-items-center rounded-[8px] border border-transparent bg-transparent text-[#8c8179] hover:border-[#ead7ca] hover:bg-[#fff7f1] hover:text-[color:var(--color-accent)] disabled:opacity-50"
                                    disabled={disabled}
                                    aria-label={t('commonSettingsPage.currency.removeCurrency', { currency: code })}
                                    onClick={() => removeCurrency(code)}
                                >
                                    <CloseIcon />
                                </button>
                            </div>
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
