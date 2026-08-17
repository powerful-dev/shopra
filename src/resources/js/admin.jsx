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
import AdministratorsPage from './pages/AdministratorsPage';
import AdminEditPage from './pages/AdminEditPage';
import { placeholders } from './data/adminNavigation';
import DeliveriesPage from './pages/DeliveriesPage';
import AppearancePage from './pages/AppearancePage';
import PaymentPage from './pages/PaymentPage';
import DiscountsPage from './pages/DiscountsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

import '../css/tailwind.css';
import '../scss/admin.scss';

function AdminApp() {
    return (
        <AuthProvider><BrowserRouter><Routes>
            <Route path="/admin/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/products" element={<ProductsPage />} />
                <Route path="/admin/orders" element={<OrdersPage />} />
                <Route path="/admin/administrators" element={<AdministratorsPage />} />
                <Route path="/admin/administrators/new" element={<AdminEditPage />} />
                <Route path="/admin/administrators/:id" element={<AdminEditPage />} />
                <Route path="/admin/shops/create" element={<CreateShopPage />} />
                <Route path="/admin/deliveries" element={<DeliveriesPage />} />
                <Route path="/admin/appearance" element={<AppearancePage />} />
                <Route path="/admin/payments" element={<PaymentPage />} />
                <Route path="/admin/discounts" element={<DiscountsPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
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
