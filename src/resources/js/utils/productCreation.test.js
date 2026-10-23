import assert from 'node:assert/strict';
import test from 'node:test';
import { buildProductPayload, resolveProductSaveTarget } from './productCreation.js';

test('blank first-photo draft stays on /new and is updated with fields entered before Save', () => {
    const emptyForm = {
        name: '',
        price: '',
        old_price: '',
        currency: '',
        quantity: '',
        show_stock: true,
        description: '',
        seo_title: '',
        seo_description: '',
        shop_group_id: null,
        status: 'draft',
    };
    const filledForm = {
        name: 'Кожаная сумка',
        price: '1290',
        old_price: '1490',
        currency: 'USD',
        quantity: '7',
        show_stock: false,
        description: '<p>Описание</p>',
        seo_title: 'Кожаная сумка',
        seo_description: 'Описание для поиска',
        shop_group_id: 12,
        status: 'draft',
    };

    // The first photo creates a draft before it can be uploaded.
    const draftPayload = buildProductPayload(emptyForm, 'draft', { useDraftDefaults: true });
    assert.equal(resolveProductSaveTarget(null, null), null);
    assert.equal(draftPayload.name, null);
    assert.equal(draftPayload.price, 0);
    assert.equal(draftPayload.quantity, 0);
    assert.equal(draftPayload.shop_group_id, null);

    const draftId = 42;
    const routeProductId = null;
    let localForm = { ...emptyForm, currency: 'UAH' };
    assert.equal(routeProductId, null);
    assert.equal(resolveProductSaveTarget(null, draftId), '42');
    assert.equal(resolveProductSaveTarget(routeProductId, draftId), '42');

    // The draft exists, but the user still edits the same local form at /new.
    localForm = { ...localForm, ...filledForm };

    const savePayload = buildProductPayload(localForm, 'draft', { attributes: [] });
    assert.deepEqual(savePayload, { ...filledForm, attributes: [] });
    // After Save, the same product is addressed by its permanent URL.
    assert.equal(resolveProductSaveTarget('42', draftId), '42');
});

test('fields entered before the first photo remain in the draft payload', () => {
    const form = {
        name: 'Сумка',
        price: '900',
        currency: 'UAH',
        quantity: '3',
        shop_group_id: 12,
        status: 'draft',
    };

    const draftPayload = buildProductPayload(form, 'draft', { useDraftDefaults: true });

    assert.equal(draftPayload.name, 'Сумка');
    assert.equal(draftPayload.price, '900');
    assert.equal(draftPayload.currency, 'UAH');
    assert.equal(draftPayload.quantity, '3');
    assert.equal(draftPayload.shop_group_id, 12);
    assert.equal(resolveProductSaveTarget(null, 42), '42');
});
