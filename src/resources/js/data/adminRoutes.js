import ProductsPage from '../pages/products/ProductsPage';
import ProductEditPage from '../pages/products/ProductEditPage';
import OrdersPage from '../pages/OrdersPage';
import AdministratorsPage from '../pages/admin/AdministratorsPage';
import AdministratorEditPage from '../pages/admin/AdministratorEditPage';
import DeliveriesPage from '../pages/DeliveriesPage';
import AppearancePage from '../pages/AppearancePage';
import PaymentPage from '../pages/PaymentPage';
import DiscountsPage from '../pages/DiscountsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import CommonSettingsPage from '../pages/settings/CommonSettingsPage';

export const adminRoutes = [
    { path: '/admin/products', module: 'products', component: ProductsPage },
    { path: '/admin/products/new', module: 'products', component: ProductEditPage },
    { path: '/admin/products/:id', module: 'products', component: ProductEditPage },
    { path: '/admin/orders', module: 'orders', component: OrdersPage },
    { path: '/admin/administrators', module: 'administrators', component: AdministratorsPage },
    { path: '/admin/administrators/new', module: 'administrators', component: AdministratorEditPage },
    { path: '/admin/administrators/:id', module: 'administrators', component: AdministratorEditPage },
    { path: '/admin/deliveries', module: 'deliveries', component: DeliveriesPage },
    { path: '/admin/appearance', module: 'appearance', component: AppearancePage },
    { path: '/admin/payments', module: 'payments', component: PaymentPage },
    { path: '/admin/discounts', module: 'discounts', component: DiscountsPage },
    { path: '/admin/analytics', module: 'analytics', component: AnalyticsPage },
    { path: '/admin/settings', module: 'settings', component: SettingsPage },
    { path: '/admin/settings/common', module: 'settings', component: CommonSettingsPage },
];
