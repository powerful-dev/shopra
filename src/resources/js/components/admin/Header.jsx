import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Brand from './Brand/Brand';

export default function Header({ onMenuClick }) {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const desktopNotificationsRef = useRef(null);
    const mobileNotificationsRef = useRef(null);

    useEffect(() => {
        const close = (event) => {
            const clickedInside = desktopNotificationsRef.current?.contains(event.target)
                || mobileNotificationsRef.current?.contains(event.target);

            if (event.key === 'Escape' || (event.type === 'mousedown' && !clickedInside)) setNotificationsOpen(false);
        };
        const closeOnResize = () => setNotificationsOpen(false);
        document.addEventListener('mousedown', close);
        document.addEventListener('keydown', close);
        window.addEventListener('resize', closeOnResize);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('keydown', close);
            window.removeEventListener('resize', closeOnResize);
        };
    }, []);

    return (
        <>
            <header className="sticky top-0 z-40 h-[var(--header-height)] bg-[var(--color-page-bg)] max-lg:hidden">
                <div className="mx-8 flex h-full items-center justify-between border-b border-[color:var(--color-header-border)]">
                    <label className="flex items-center gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-secondary)]">
                        <SearchIcon />
                        <input type="search" className="w-44 border-0 bg-transparent text-sm text-[color:var(--color-secondary)] outline-none" placeholder="Поиск по панели" aria-label="Поиск по панели" />
                    </label>
                    <div className="flex items-center gap-[9px]" ref={desktopNotificationsRef}>
                        <div className="relative">
                            <NotificationButton open={notificationsOpen} onClick={() => setNotificationsOpen((value) => !value)} />
                            {notificationsOpen && <NotificationDropdown />}
                        </div>
                        <button type="button" className="grid h-[39px] w-[39px] cursor-pointer place-items-center rounded-[10px] border border-transparent bg-white p-0 transition-colors duration-150 hover:border-[color:var(--color-border)]" aria-label="Помощь"><HelpIcon /></button>
                    </div>
                </div>
            </header>

            <header className="sticky top-0 z-40 hidden h-[62px] items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[18px] max-lg:flex" ref={mobileNotificationsRef}>
                <button type="button" className="grid h-[39px] w-[39px] place-items-center rounded-[10px] border border-transparent bg-white p-0 hover:border-[color:var(--color-border)]" aria-label="Открыть меню" onClick={onMenuClick}><MenuIcon /></button>
                <NavLink to="/admin/dashboard" aria-label="Shopra"><Brand /></NavLink>
                <div className="relative">
                    <NotificationButton open={notificationsOpen} onClick={() => setNotificationsOpen((value) => !value)} />
                    {notificationsOpen && <NotificationDropdown mobile />}
                </div>
            </header>
        </>
    );
}

function NotificationButton({ open, onClick }) {
    return <button type="button" className="relative grid h-[39px] w-[39px] cursor-pointer place-items-center rounded-[10px] border border-transparent bg-white p-0 transition-colors duration-150 hover:border-[color:var(--color-border)]" aria-label="Уведомления" aria-expanded={open} onClick={onClick}><BellIcon /><i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border-[1.5px] border-[color:var(--color-page-bg)] bg-[color:var(--color-accent)]" /></button>;
}

function NotificationDropdown({ mobile = false }) {
    return (
        <div className={`${mobile ? 'fixed right-3 top-[68px] z-[110] w-[calc(100vw-24px)]' : 'absolute right-[-42px] top-12 z-50 w-80'} overflow-hidden rounded-[15px] border border-[color:var(--color-border)] bg-white shadow-[0_18px_55px_rgba(58,38,24,0.14)]`}>
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 pb-[11px] pt-[15px]"><strong className="text-[13px]">Уведомления</strong><span className="text-xs font-bold text-[color:var(--color-accent)]">2 новых</span></div>
            <NotificationItem icon={<BagIcon />} iconClass="bg-[#f9eee7] text-[color:var(--color-accent)]" title="Новый заказ #1024" detail="Анна Смирнова · 3 520 ₴" />
            <NotificationItem icon={<BoxIcon />} iconClass="bg-[#eef8ee] text-[#2e8b45]" title="Заканчивается товар" detail="Кожаная сумка Forest · 2 шт." />
        </div>
    );
}

function NotificationItem({ icon, iconClass, title, detail }) {
    return <button type="button" className="flex w-full cursor-pointer items-center gap-[10px] border-0 border-b border-[#f1ede9] bg-white px-4 py-3 text-left hover:bg-[#fcfaf8]"><span className={`grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px] ${iconClass}`}>{icon}</span><span className="flex flex-col"><strong className="text-xs">{title}</strong><small className="text-xs text-[#77716b]">{detail}</small></span></button>;
}

const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
function SearchIcon() { return <svg className="h-4 w-4" viewBox="0 0 24 24" {...iconProps}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>; }
function MenuIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" {...iconProps}><path d="M4 6h16M4 12h16M4 18h16" /></svg>; }
function BellIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" {...iconProps}><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></svg>; }
function HelpIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" {...iconProps}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>; }
function BagIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" {...iconProps}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>; }
function BoxIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" {...iconProps}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></svg>; }
