import Sidebar from './Sidebar';

export default function MobileMenu({ isOpen, onClose, user, onLogout }) {
    if (!isOpen) return null;

    return <div className="shopra-mobile-overlay" role="presentation" onMouseDown={onClose}><div className="shopra-mobile-drawer" role="dialog" aria-modal="true" aria-label="Навигация" onMouseDown={(event) => event.stopPropagation()}><button className="shopra-drawer-close" type="button" onClick={onClose} aria-label="Закрыть меню" uk-close="true" /><Sidebar user={user} onNavigate={onClose} onLogout={onLogout} /></div></div>;
}
