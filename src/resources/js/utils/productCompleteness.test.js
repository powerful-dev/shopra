import test from 'node:test';
import assert from 'node:assert/strict';
import calculateProductCompleteness from './productCompleteness.js';

test('returns zero and every criterion for an empty product', () => {
    const result = calculateProductCompleteness();

    assert.equal(result.score, 0);
    assert.equal(result.level, 'low');
    assert.deepEqual(result.missingCriteria.map(({ id }) => id), [
        'name',
        'price',
        'category',
        'first-photo',
        'photo-gallery',
        'description',
        'attributes',
        'seo-title',
        'seo-description',
    ]);
});

test('scores a partially filled product and requires fifty description characters', () => {
    const result = calculateProductCompleteness({
        name: 'Кожаный рюкзак',
        price: '0',
        categoryCount: 1,
        photoCount: 1,
        description: `<p>${'а'.repeat(49)}</p><p>&nbsp;</p>`,
        seoTitle: 'Рюкзак CITY',
    });

    assert.equal(result.score, 55);
    assert.equal(result.level, 'medium');
    assert.deepEqual(result.missingCriteria.map(({ id }) => id), [
        'photo-gallery',
        'description',
        'attributes',
        'seo-description',
    ]);
});

test('returns one hundred for a fully filled product', () => {
    const result = calculateProductCompleteness({
        name: 'Кожаный рюкзак CITY',
        price: '6200.00',
        categoryCount: 2,
        photoCount: 3,
        description: `<p>${'Подробное описание товара с материалами, размерами и особенностями.'}</p>`,
        hasFilledAttribute: true,
        seoTitle: 'Кожаный рюкзак CITY',
        seoDescription: 'Натуральная кожа, удобная доставка и гарантия.',
    });

    assert.equal(result.score, 100);
    assert.equal(result.level, 'high');
    assert.deepEqual(result.missingCriteria, []);
});
