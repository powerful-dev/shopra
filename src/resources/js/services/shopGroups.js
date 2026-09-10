import { csrf, request } from './api';

export async function moveShopGroup(id, targetId, position) {
    await csrf();
    await request(`/api/product-categories/${id}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_id: targetId, position }),
    });
}

export async function createShopGroup(data) {
    await csrf();
    const response = await request('/api/product-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response.data;
}

export async function getShopGroups(options = {}) {
    const response = await request('/api/product-categories', options);

    return response.data;
}

export async function getRootShopGroups(options = {}) {
    const response = await request('/api/product-categories/roots', options);

    return response.data;
}

export async function searchShopGroups(search, options = {}) {
    const params = new URLSearchParams({ search });
    const response = await request(`/api/product-categories/search?${params}`, options);

    return response.data;
}

export async function getShopGroupChildren(id, options = {}) {
    const response = await request(`/api/product-categories/${id}/children`, options);

    return response.data;
}

export async function getUniqueShopGroupSlug(value, options = {}) {
    const params = new URLSearchParams({ value });
    const response = await request(`/api/product-categories/slug?${params}`, options);

    return response.data.slug;
}
