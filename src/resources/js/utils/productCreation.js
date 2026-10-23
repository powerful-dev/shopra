export function resolveProductSaveTarget(routeProductId, createdProductId) {
    const productId = createdProductId ?? routeProductId;

    return productId === null || productId === undefined ? null : String(productId);
}

function normalizeNullableQuantity(quantity) {
    return quantity === '' || quantity === null || quantity === undefined ? null : quantity;
}

export function buildProductPayload(form, status, { useDraftDefaults = false, attributes } = {}) {
    return {
        ...form,
        name: form.name.trim() || null,
        price: useDraftDefaults && form.price === '' ? 0 : form.price,
        old_price: form.old_price || null,
        quantity: useDraftDefaults && form.quantity === '' ? 0 : normalizeNullableQuantity(form.quantity),
        show_stock: form.show_stock,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        status,
        ...(attributes === undefined ? {} : { attributes }),
    };
}
