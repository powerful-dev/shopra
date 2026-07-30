import { useEffect, useState } from 'react';
import Brand from './Brand/Brand';

export default function Header({ onMenuClick }) {
    const [activePopover, setActivePopover] = useState(null);

    useEffect(() => {
        const closeOnEscape = (event) => event.key === 'Escape' && setActivePopover(null);
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, []);

    return (
        <>
            <header className="shopra-mobile-bar"><button type="button" onClick={onMenuClick} aria-label="Открыть меню" uk-icon="icon: menu; ratio: 1.05" /><Brand compact /><button className="shopra-icon-button" type="button" aria-label="Уведомления" uk-icon="icon: bell" /></header>
            <header className="shopra-topbar">
                <div className="shopra-topbar-inner">
                    <div className="shopra-search"><span uk-icon="icon: search; ratio: 0.82" /><input type="search" placeholder="Поиск по панели" onFocus={() => setActivePopover('search')} aria-label="Поиск по панели" />{activePopover === 'search' && <div className="shopra-popover shopra-search-popover"><p>Начните вводить запрос для поиска по панели.</p></div>}</div>
                    <div className="shopra-top-actions">
                        <div className="shopra-popover-wrap"><button className="shopra-icon-button" type="button" aria-label="Уведомления" onClick={() => setActivePopover((value) => value === 'notifications' ? null : 'notifications')}><span uk-icon="icon: bell; ratio: 0.88" /><i /></button>{activePopover === 'notifications' && <NotificationPopover />}</div>
                        <button className="shopra-help-button" type="button" aria-label="Помощь" uk-icon="icon: question; ratio: 0.86" />
                        <select className="uk-select shopra-store-select" aria-label="Выбрать магазин"><option>Мой магазин</option><option>BartBag</option><option>Solomiya Artisan</option></select>
                    </div>
                </div>
            </header>
        </>
    );
}

function NotificationPopover() {
    return <div className="shopra-popover shopra-notification-popover"><header><strong>Уведомления</strong><span>2 новых</span></header><button type="button"><i uk-icon="icon: bag" /><span><b>Новый заказ #1024</b><small>Анна Смирнова · 3 520 ₴</small></span></button><button type="button"><i uk-icon="icon: warning" /><span><b>Заканчивается товар</b><small>Кожаная сумка Forest · 2 шт.</small></span></button></div>;
}
