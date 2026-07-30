import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import '@fontsource-variable/inter/wght.css';
import 'uikit/dist/css/uikit.min.css';

import { AuthProvider } from './hooks/useAuth';
import AdminLayout from './components/admin/AdminLayout';
import { GuestOnly, RequireAuth } from './components/AuthGuards';
import CreateShopPage from './pages/CreateShopPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { placeholders } from './data/adminNavigation';


import '../scss/admin.scss';

if (!window.__SHOPRA_UIKIT_ICONS__) {
    UIkit.use(Icons);
    window.__SHOPRA_UIKIT_ICONS__ = true;
}

function AdminApp() {
    return (
        <AuthProvider><BrowserRouter><Routes>
            <Route path="/admin/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/shops/create" element={<CreateShopPage />} />
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
