import { csrf, request } from './api';
import i18n from '../i18n';

export async function getShopAttributeUnits({ signal } = {}) {
    const response = await request('/api/product-attribute-units', {
        signal,
        headers: {
            'Accept-Language': i18n.resolvedLanguage ?? i18n.language ?? 'ru',
        },
    });

    return response.data;
}

export async function getShopAttributes({ signal } = {}) {
    const response = await request('/api/product-attributes', { signal });

    return response.data;
}

export async function getShopItemAttributes(productId, { signal } = {}) {
    const response = await request(`/api/products/${productId}/attributes`, { signal });

    return response.data;
}

export async function syncShopItemAttributes(productId, attributes) {
    await csrf();
    const response = await request(`/api/products/${productId}/attributes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes }),
    });

    return response.data;
}

export async function createShopAttributeOption(attributeId, optionData) {
    await csrf();

    const response = await request(`/api/product-attributes/${attributeId}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optionData),
    });

    return response.data;
}

export async function updateShopAttribute(attributeId, attributeData) {
    await csrf();

    const response = await request(`/api/product-attributes/${attributeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attributeData),
    });

    return response.data;
}

export async function updateShopAttributeOption(attributeId, optionId, optionData) {
    await csrf();

    const response = await request(`/api/product-attributes/${attributeId}/options/${optionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optionData),
    });

    return response.data;
}

export async function deleteShopAttributeOption(attributeId, optionId) {
    await csrf();
    await request(`/api/product-attributes/${attributeId}/options/${optionId}`, { method: 'DELETE' });
}

export async function createShopAttributeWithOptions(attributeData, optionValues = []) {
    await csrf();

    const { data: attribute } = await request('/api/product-attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attributeData),
    });

    try {
        const options = [];

        for (const [sortOrder, value] of optionValues.entries()) {
            const response = await request(`/api/product-attributes/${attribute.id}/options`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value, sort_order: sortOrder }),
            });
            options.push(response.data);
        }

        return { ...attribute, options };
    } catch (error) {
        try {
            await request(`/api/product-attributes/${attribute.id}`, { method: 'DELETE' });
        } catch (cleanupError) {
            console.error('Unable to remove an incomplete product attribute.', cleanupError);
        }

        throw error;
    }
}

export async function updateShopAttributeWithOptions(attribute, attributeData, optionValues = []) {
    const updatedAttribute = await updateShopAttribute(attribute.id, attributeData);
    const retainedOptionIds = new Set(optionValues.filter((option) => option.id !== null).map((option) => option.id));

    for (const option of attribute.options ?? []) {
        if (!retainedOptionIds.has(option.id)) {
            await deleteShopAttributeOption(attribute.id, option.id);
        }
    }

    const options = [];

    for (const [sortOrder, option] of optionValues.entries()) {
        if (option.id !== null) {
            options.push(await updateShopAttributeOption(attribute.id, option.id, {
                value: option.value,
                sort_order: sortOrder,
            }));
        } else {
            options.push(await createShopAttributeOption(attribute.id, {
                value: option.value,
                sort_order: sortOrder,
            }));
        }
    }

    return { ...updatedAttribute, options };
}
