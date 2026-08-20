import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import { ModulesProvider } from '../../hooks/useModules';

export default function AdminLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('overflow-hidden', isMobileMenuOpen);
        const closeOnEscape = (event) => event.key === 'Escape' && setIsMobileMenuOpen(false);
        const closeOnDesktop = () => window.innerWidth >= 992 && setIsMobileMenuOpen(false);
        document.addEventListener('keydown', closeOnEscape);
        window.addEventListener('resize', closeOnDesktop);
        return () => {
            document.body.classList.remove('overflow-hidden');
            document.removeEventListener('keydown', closeOnEscape);
            window.removeEventListener('resize', closeOnDesktop);
        };
    }, [isMobileMenuOpen]);

    if (user?.id) window.__SHOPRA_ADMIN_ID__ = user.id;

    const signOut = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    return (
       <ModulesProvider>
            <div className="min-h-screen pl-[var(--sidebar-width)] max-lg:pl-0">
                {isMobileMenuOpen && <button type="button" className="fixed inset-0 z-[90] border-0 bg-[rgba(35,27,21,0.34)] p-0 backdrop-blur-[5px] lg:hidden" aria-label="Закрыть меню" onClick={() => setIsMobileMenuOpen(false)} />}
                <Sidebar isOpen={isMobileMenuOpen} user={user} onClose={() => setIsMobileMenuOpen(false)} onLogout={signOut} />
                <div className="min-w-0">
                    <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                    <main className="min-w-0 flex-1">
                        <div className="page-container pb-8 pt-[30px] max-sm:!mx-[13px] sm:max-lg:!mx-5"><Outlet /></div>
                    </main>
                </div>
            </div>
       </ModulesProvider>
    );
}
