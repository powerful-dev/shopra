import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from './Header';
import MobileMenu from './MobileMenu';
import Sidebar from './Sidebar';

export default function AdminLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const signOut = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    return <div className="shopra-admin-shell"><Sidebar user={user} onLogout={signOut} /><MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} user={user} onLogout={signOut} /><main className="shopra-workspace"><Header onMenuClick={() => setIsMobileMenuOpen(true)} /><Outlet /></main></div>;
}
