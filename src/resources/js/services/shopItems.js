import { csrf, request } from './api';

export async function getShopItemMediaConfig() {
    const response = await request('/api/products/media-config');

    return response.data;
}

export async function uploadShopItemMedia(id, type, file) {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file, file.name);

    await csrf();
    const response = await request(`/api/products/${id}/media`, {
        method: 'POST',
        body: formData,
    });

    return response.data;
}

export async function reorderShopItemMedia(id, ids) {
    await csrf();
    const response = await request(`/api/products/${id}/media/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
    });

    return response.data;
}

export async function deleteShopItemMedia(productId, mediaId) {
    await csrf();
    const response = await request(`/api/products/${productId}/media/${mediaId}`, {
        method: 'DELETE',
    });

    return response.data;
}

export async function deleteShopItemCategory(productId, categoryId) {
    await csrf();
    await request(`/api/products/${productId}/categories/${categoryId}`, {
        method: 'DELETE',
    });
}

export async function addShopItemCategory(productId, categoryId) {
    await csrf();
    const response = await request(`/api/products/${productId}/categories/${categoryId}`, {
        method: 'POST',
    });

    return response.data;
}
