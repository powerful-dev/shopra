import assert from 'node:assert/strict';
import test from 'node:test';
import { convertPriceToStoreCurrency } from './prices.js';

test('keeps the original price when the product uses the store currency', () => {
    assert.equal(convertPriceToStoreCurrency('1 250,50', 'UAH', 'UAH', []), 1250.5);
});

test('converts a product price to the store currency using its configured rate', () => {
    assert.equal(convertPriceToStoreCurrency('100', 'USD', 'UAH', [
        { code: 'USD', rate: '41.50' },
    ]), 4150);
});

test('does not return an unconverted price when the currency rate is unavailable', () => {
    assert.equal(convertPriceToStoreCurrency('100', 'USD', 'UAH', []), null);
    assert.equal(convertPriceToStoreCurrency('100', 'USD', 'UAH', [
        { code: 'USD', rate: '0' },
    ]), null);
});
