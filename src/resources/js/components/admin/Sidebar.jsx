import { NavLink } from 'react-router-dom';
import Brand from './Brand/Brand';
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

export default function Sidebar({ user, onNavigate, onLogout }) {

    const adminNavigation = [
        { label: 'Главная', path: '/admin/dashboard', icon: HomeIcon },
        { label: 'Администраторы', path: '/admin/administrators', icon: SettingsIcon },
        { label: 'Внешний вид магазина', path: '/admin/appearance', icon: AppearanceIcon },
        { label: 'Товары', path: '/admin/products', icon: ProductsIcon },
        { label: 'Заказы', path: '/admin/orders', icon: OrdersIcon, badge: '8' },
        { label: 'Доставка', path: '/admin/shipping', icon: ShippingIcon },
        { label: 'Оплата', path: '/admin/payments', icon: PaymentsIcon },
        { label: 'Скидки и распродажи', path: '/admin/discounts', icon: DiscountsIcon },
        { label: 'Статистика', path: '/admin/analytics', icon: AnalyticsIcon },
        { label: 'Домен', path: '/admin/domain', icon: DomainIcon },
        { label: 'Настройки', path: '/admin/settings', icon: SettingsIcon },
    ];

    return (
        <aside className="shopra-sidebar">
            <div className="shopra-sidebar-logo"><Brand /></div>
            <nav className="shopra-side-nav" aria-label="Основная навигация">
                {adminNavigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `shopra-nav-item${isActive ? ' is-active' : ''}`
                            }
                        >
                            <Icon className="shopra-nav-icon" />

                            <span>{item.label}</span>

                            {item.badge && (
                                <b className="shopra-nav-badge">
                                    {item.badge}
                                </b>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
            <div className="shopra-sidebar-bottom">
                <UserMenu user={user} onLogout={onLogout} />
                <div className="shopra-setup-mini"><span>Готовность магазина</span><strong>72%</strong><i><b /></i></div>
            </div>
        </aside>
    );
}
