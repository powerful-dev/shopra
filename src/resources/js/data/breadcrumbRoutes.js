export const breadcrumbRoutes = [
    {
        path: '/admin/products',
        labelKey: 'breadcrumbs.products',
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
        path: '/admin/settings/common',
        labelKey: 'breadcrumbs.settings_common',
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
