export function resolveProductSaveTarget(routeProductId, createdProductId) {
    const productId = createdProductId ?? routeProductId;

    return productId === null || productId === undefined ? null : String(productId);
}

function normalizeNullableQuantity(quantity) {
    return quantity === '' || quantity === null || quantity === undefined ? null : quantity;
}

function normalizeNullableValue(value) {
    return value === '' || value === null || value === undefined ? null : value;
}

export function buildProductPayload(form, status, { useDraftDefaults = false, attributes } = {}) {
    return {
        ...form,
        name: form.name.trim() || null,
        price: normalizeNullableValue(form.price),
        old_price: normalizeNullableValue(form.old_price),
        currency: normalizeNullableValue(form.currency),
        quantity: useDraftDefaults && form.quantity === '' ? 0 : normalizeNullableQuantity(form.quantity),
        show_stock: form.show_stock,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        status,
        ...(attributes === undefined ? {} : { attributes }),
    };
}
