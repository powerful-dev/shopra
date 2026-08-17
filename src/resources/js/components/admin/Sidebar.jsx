import { NavLink } from 'react-router-dom'
import Brand from './Brand';
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

const navigation = [
    { label: 'Главная', path: '/admin/dashboard', icon: HomeIcon },
    { label: 'Внешний вид', path: '/admin/appearance', icon: AppearanceIcon },
    { label: 'Товары', path: '/admin/products', icon: ProductsIcon },
    { label: 'Заказы', path: '/admin/orders', icon: OrdersIcon, badge: '8' },
    { label: 'Доставка', path: '/admin/deliveries', icon: ShippingIcon },
    { label: 'Оплата', path: '/admin/payments', icon: PaymentsIcon },
    { label: 'Скидки', path: '/admin/discounts', icon: DiscountsIcon },
    { label: 'Статистика', path: '/admin/analytics', icon: AnalyticsIcon },
    { label: 'Домен', path: '/admin/domain', icon: DomainIcon },
    { label: 'Настройки', path: '/admin/settings', icon: SettingsIcon },
];

export default function Sidebar({ isOpen, user, onClose, onLogout }) {
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

            <nav className="flex-1 overflow-y-auto px-[10px] pb-[14px] max-lg:px-0">
                <div className="space-y-1">
                    {navigation.map(({ label, path, icon: Icon, badge }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={onClose}
                            className={({ isActive }) => `sidebar-nav-link${isActive ? ' active' : ''}`}
                        >
                            <span className="sidebar-icon"><Icon /></span>
                            <span className="leading-none">{label}</span>
                            {badge && <span className="sidebar-nav-badge">{badge}</span>}
                        </NavLink>
                    ))}
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

function SparklesIcon() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4M22 5h-4M4 17v2M5 18H3" /></svg>;
}
