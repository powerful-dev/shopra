import { useState } from 'react';

export default function UserMenu({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="shopra-user-menu">
            <button className="shopra-profile-card" type="button" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen}>
                <span className="shopra-avatar">{initials}</span><span><strong>{user.name}</strong><small>Владелец магазина</small></span><i uk-icon="icon: chevron-down; ratio: 0.7" />
            </button>
            {isOpen && <div className="shopra-user-popover"><button type="button" onClick={onLogout}><span uk-icon="icon: sign-out" />Выйти</button></div>}
        </div>
    );
}
