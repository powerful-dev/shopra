import { Link } from 'react-router-dom';

const actions = [
    ['Добавить товар', '/admin/products', 'plus-circle'],
    ['Создать акцию', '/admin/discounts', 'tag'],
    ['Добавить доставку', '/admin/shipping', 'location'],
    ['Настроить оплату', '/admin/payments', 'credit-card'],
    ['Подключить домен', '/admin/domain', 'world'],
];

export default function QuickActions() {
    return <div className="shopra-quick-actions">{actions.map(([label, path, icon]) => <Link key={path} to={path}><span uk-icon={`icon: ${icon}; ratio: 0.85`} />{label}</Link>)}</div>;
}
