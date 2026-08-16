import { useEffect, useRef, useState } from 'react';

export default function UserMenu({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const name = user?.name || user?.email || 'Administrator';
    const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

    useEffect(() => {
        const close = (event) => {
            if (event.key === 'Escape' || (event.type === 'mousedown' && !menuRef.current?.contains(event.target))) setIsOpen(false);
        };
        document.addEventListener('mousedown', close);
        document.addEventListener('keydown', close);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('keydown', close);
        };
    }, []);

    return (
        <div ref={menuRef} className="relative max-lg:hidden">
            <button type="button" className="flex w-full items-center gap-[10px] rounded-[13px] border border-[color:var(--sidebar-border)] bg-[color:var(--sidebar-surface)] p-[10px] text-left shadow-[0_5px_18px_rgba(63,44,29,0.035)]" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen} aria-haspopup="menu">
                <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c18461] to-[#82441f] text-[13px] font-[750] text-white">{initials}</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-xs font-semibold text-[color:var(--sidebar-text-strong)]">{name}</strong><small className="mt-px block text-xs text-[color:var(--sidebar-text-muted)]">Owner</small></span>
            </button>
            {isOpen && <div className="sidebar-user-popover" role="menu"><button type="button" className="sidebar-user-popover__item" onClick={onLogout} role="menuitem"><span className="flex h-5 w-5 items-center justify-center text-[color:var(--sidebar-active-text)]"><LogoutIcon /></span><span>Выйти</span></button></div>}
        </div>
    );
}

function LogoutIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></svg>;
}
