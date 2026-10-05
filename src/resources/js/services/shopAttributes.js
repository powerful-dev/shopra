import { csrf, request } from './api';

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
