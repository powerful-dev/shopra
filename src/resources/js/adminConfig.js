const adminRoot = document.getElementById('admin-app');

export const appName = adminRoot?.dataset.appName ?? '';

const parseSupportedCurrencies = () => {
    try {
        const currencies = JSON.parse(adminRoot?.dataset.supportedCurrencies ?? '[]');

        return Array.isArray(currencies) ? currencies : [];
    } catch {
        return [];
    }
};

export const supportedCurrencies = parseSupportedCurrencies();
