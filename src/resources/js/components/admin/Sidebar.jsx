import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NavLink } from 'react-router-dom'
import Brand from './Brand';
import Skeleton from './Skeleton';
import UserMenu from './UserMenu';
import HomeIcon from '../icons/HomeIcon';
import AppearanceIcon from '../icons/AppearanceIcon';
import ProductsIcon from '../icons/ProductsIcon';
import OrdersIcon from '../icons/OrdersIcon';
import ShippingIcon from '../icons/ShippingIcon';
import PaymentsIcon from '../icons/PaymentsIcon';
import DiscountsIcon from '../icons/DiscountsIcon';
import AnalyticsIcon from '../icons/AnalyticsIcon';
import DomainIcon from '../icons/DomainIcon';
import SettingsIcon from '../icons/SettingsIcon';
import SparklesIcon from '../icons/SparklesIcon';
import { useModules } from '../../hooks/useModules';

const icons = {
    home: HomeIcon,
    appearance: AppearanceIcon,
    products: ProductsIcon,
    orders: OrdersIcon,
    shipping: ShippingIcon,
    payments: PaymentsIcon,
    discounts: DiscountsIcon,
    analytics: AnalyticsIcon,
    domain: DomainIcon,
    settings: SettingsIcon,
};

export default function Sidebar({ isOpen, user, onClose, onLogout }) {

    const { t } = useTranslation();
    const [navigation, setNavigation] = useState([]);
    const { modules, loading } = useModules();

    useEffect(() => {
        fetch('/api/sites/1/modules', {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Не удалось загрузить модули');
                }

                return response.json();
            })
            .then(({ data }) => {
                setNavigation(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <aside
            className={`sidebar-shell flex flex-col overflow-hidden max-lg:!z-[100] max-lg:!w-[min(310px,88vw)] max-lg:!min-w-0 max-lg:!border-r-0 max-lg:!bg-white max-lg:!p-[18px] max-lg:!pt-[22px] max-lg:!backdrop-blur-none max-lg:transition-transform max-lg:duration-200 max-lg:ease-out max-lg:will-change-transform ${isOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}`}
            aria-label="Основная навигация"
        >
            <div className="mb-[22px] hidden items-center justify-between px-2 max-lg:flex">
                <NavLink to="/admin/dashboard" onClick={onClose}><Brand /></NavLink>
                <button type="button" className="grid h-[39px] w-[39px] place-items-center rounded-[10px] border border-transparent bg-transparent p-0 hover:border-[color:var(--color-border)] hover:bg-white" aria-label="Закрыть меню" onClick={onClose}>
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            </div>

            <div className="px-[18px] pb-[26px] pt-[28px] max-lg:hidden">
                <NavLink to="/admin/dashboard"><Brand /></NavLink>
            </div>

            <nav className="flex-1 overflow-y-auto px-[10px] pb-[14px] max-lg:px-0" aria-busy={loading}>
                <div className="space-y-1">
                    {loading ? <SidebarMenuSkeleton /> : modules
                        .filter((module) => module.show_in_menu)
                        .map((module) => {
                            
                            const Icon = icons[module.icon];

                            return (
                                <NavLink
                                    key={module.id}
                                    to={module.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `sidebar-nav-link${isActive ? ' active' : ''}`
                                    }
                                >
                                    {Icon && (
                                        <span className="sidebar-icon">
                                            <Icon />
                                        </span>
                                    )}

                                    <span className="leading-none">
                                        {t(`modules.${module.code}`)}
                                    </span>
                                </NavLink>
                            );
                    })}

                </div>
            </nav>

            <div className="relative border-t border-[color:var(--sidebar-border)] px-[18px] pb-[18px] pt-[14px] max-lg:px-0 max-lg:pb-0">
                <UserMenu user={user} onLogout={onLogout} />
                <div className="mt-[10px] rounded-[12px] bg-[#faf7f4] px-[11px] py-[10px] text-xs text-[#685e56]">
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5"><SparklesIcon />Магазин готов</span>
                        <strong className="text-xs text-[#8c3510]">50%</strong>
                    </div>
                    <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#eadfd7]" role="progressbar" aria-label="Готовность магазина" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
                        <span className="block h-full w-1/2 rounded-[inherit] bg-gradient-to-r from-[#bb4e18] to-[#e28950]" />
                    </div>
                </div>
            </div>
        </aside>
    );
}

function SidebarMenuSkeleton() {
    const labelWidths = ['w-[78px]', 'w-[102px]', 'w-[86px]', 'w-[112px]', 'w-[94px]', 'w-[72px]', 'w-[106px]', 'w-[82px]'];

    return Array.from({ length: 8 }, (_, index) => (
        <div className="sidebar-nav-link pointer-events-none" aria-hidden="true" key={index}>
            <span className="sidebar-icon">
                <Skeleton className="h-[18px] w-[18px] rounded-[5px]" />
            </span>
            <Skeleton className={`h-[13px] ${labelWidths[index]}`} />
        </div>
    ));
}
