import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './hooks/useAuth';
import AdminLayout from './components/admin/AdminLayout';
import { GuestOnly, RequireAuth } from './components/AuthGuards';
import CreateShopPage from './pages/CreateShopPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AdministratorsPage from './pages/admin/AdministratorsPage';
import AdministratorEditPage from './pages/admin/AdministratorEditPage';
import { placeholders } from './data/adminNavigation';
import DeliveriesPage from './pages/DeliveriesPage';
import AppearancePage from './pages/AppearancePage';
import PaymentPage from './pages/PaymentPage';
import DiscountsPage from './pages/DiscountsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import RequireModule from './components/admin/RequireModule';

import '../css/tailwind.css';
import '../scss/admin.scss';

function AdminApp() {

    const protectedRoutes = [

        ['/admin/products', 'products', <ProductsPage />],
        ['/admin/orders', 'orders', <OrdersPage />],
        ['/admin/administrators', 'administrators', <AdministratorsPage />],
        ['/admin/administrators/new', 'administrators', <AdministratorEditPage />],
        ['/admin/administrators/:id', 'administrators', <AdministratorEditPage />],
        ['/admin/deliveries', 'deliveries', <DeliveriesPage />],
        ['/admin/appearance', 'appearance', <AppearancePage />],
        ['/admin/payments', 'payments', <PaymentPage />],
        ['/admin/discounts', 'discounts', <DiscountsPage />],
        ['/admin/analytics', 'analytics', <AnalyticsPage />],
        ['/admin/settings', 'settings', <SettingsPage />],
    ];

    return (
        <AuthProvider><BrowserRouter><Routes>
            <Route path="/admin/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<DashboardPage />} />

                {protectedRoutes.map(([path, code, element]) => (
                    <Route
                        key={path}
                        path={path}
                        element={<RequireModule code={code}>{element}</RequireModule>}
                    />
                ))}

                {Object.entries(placeholders).map(([slug, [title, description]]) => <Route key={slug} path={`/admin/${slug}`} element={<PlaceholderPage title={title} description={description} />} />)}
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes></BrowserRouter></AuthProvider>
    );
}

const container = document.getElementById('admin-app');

if (container) {
    const root = window.__SHOPRA_ADMIN_ROOT__ ?? (window.__SHOPRA_ADMIN_ROOT__ = createRoot(container));

    root.render(<AdminApp />);
}
