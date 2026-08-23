export const breadcrumbRoutes = [
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