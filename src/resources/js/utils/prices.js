export function parsePrice(value) {
    if (value === '' || value === null || value === undefined) return null;

    const parsedValue = Number(String(value).replace(/\s/g, '').replace(',', '.'));

    return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function findCurrencyRate(currencyRates = [], currency) {
    return currencyRates.find(({ code }) => code === currency)?.rate;
}

export function isValidCurrencyRate(rate) {
    const numericRate = Number(rate);

    return Number.isFinite(numericRate) && numericRate > 0;
}

export function convertPriceToStoreCurrency(value, priceCurrency, storeCurrency, currencyRates = []) {
    const parsedPrice = parsePrice(value);

    if (parsedPrice === null || !priceCurrency || !storeCurrency) return null;
    if (priceCurrency === storeCurrency) return parsedPrice;

    const rate = findCurrencyRate(currencyRates, priceCurrency);

    return isValidCurrencyRate(rate) ? parsedPrice * Number(rate) : null;
}
