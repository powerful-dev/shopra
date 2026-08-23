import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './i18n';

import { AuthProvider } from './hooks/useAuth';
import AdminLayout from './components/admin/AdminLayout';
import { GuestOnly, RequireAuth } from './components/AuthGuards';
import CreateShopPage from './pages/CreateShopPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { placeholders } from './data/adminNavigation';
import { adminRoutes } from './data/adminRoutes';
import RequireModule from './components/admin/RequireModule';

import '../css/tailwind.css';
import '../scss/admin.scss';

function AdminApp() {
    return (
        <AuthProvider><BrowserRouter><Routes>
            <Route path="/admin/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<DashboardPage />} />

                {adminRoutes.map(({ path, module, component: Component }) => (
                    <Route
                        key={path}
                        path={path}
                        element={<RequireModule code={module}><Component /></RequireModule>}
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
