import { csrf, request } from './api';

export async function getCurrencySettings({ signal } = {}) {
    const response = await request('/api/settings/currencies', { signal });

    return response.data;
}

export async function saveCurrencySettings(settings) {
    await csrf();
    const response = await request('/api/settings/currencies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currency: settings.currency,
            currency_rates: settings.currency_rates,
        }),
    });

    return response.data;
}
