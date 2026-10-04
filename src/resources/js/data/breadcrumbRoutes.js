export const breadcrumbRoutes = [
    {
        path: '/admin/products',
        labelKey: 'breadcrumbs.products',
    },
    {
        path: '/admin/products/new',
        labelKey: 'breadcrumbs.product_new',
        parent: '/admin/products',
    },
    {
        path: '/admin/products/:id',
        labelKey: 'breadcrumbs.product',
        parent: '/admin/products',
    },
    {
        path: '/admin/appearance',
        labelKey: 'breadcrumbs.appearance',
    },
    {
        path: '/admin/orders',
        labelKey: 'breadcrumbs.orders',
    },
    {
        path: '/admin/deliveries',
        labelKey: 'breadcrumbs.deliveries',
    },
    {
        path: '/admin/payments',
        labelKey: 'breadcrumbs.payments',
    },
    {
        path: '/admin/discounts',
        labelKey: 'breadcrumbs.discounts',
    },
    {
        path: '/admin/analytics',
        labelKey: 'breadcrumbs.analytics',
    },
    {
        path: '/admin/domain',
        labelKey: 'breadcrumbs.domain',
    },
    {
        path: '/admin/settings',
        labelKey: 'breadcrumbs.settings',
    },
    {
        path: '/admin/settings/general',
        labelKey: 'breadcrumbs.settings_general',
        parent: '/admin/settings',
    },
    {
        path: '/admin/settings/currencies',
        labelKey: 'breadcrumbs.settings_currencies',
        parent: '/admin/settings',
    },
    {
        path: '/admin/settings/catalog',
        labelKey: 'breadcrumbs.settings_catalog',
        parent: '/admin/settings',
    },
    {
        path: '/admin/settings/images',
        labelKey: 'breadcrumbs.settings_images',
        parent: '/admin/settings',
    },
    {
        path: '/admin/administrators',
        labelKey: 'breadcrumbs.administrators',
        parent: '/admin/settings',
    },
    {
        path: '/admin/administrators/new',
        labelKey: 'breadcrumbs.administrator_new',
        parent: '/admin/administrators',
    },
    {
        path: '/admin/administrators/:id',
        labelKey: 'breadcrumbs.administrator',
        parent: '/admin/administrators',
    },
];
