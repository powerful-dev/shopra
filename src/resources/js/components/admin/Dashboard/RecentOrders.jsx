const orders = [
    ['#1021', 'Мария Иванова', '2 товара — Самовывоз', '1 250 ₴', 'Новый', 'new'],
    ['#1020', 'ООО «Магазин»', '5 товаров — Курьер', '4 980 ₴', 'Оплачен', 'paid'],
    ['#1019', 'Алексей П.', '1 товар — Курьер', '390 ₴', 'В обработке', 'pending'],
    ['#1018', 'Елена С.', '3 товара — Самовывоз', '2 120 ₴', 'Новый', 'new'],
];

export default function RecentOrders() {
    return (
        <div className="data-list mt-4" role="list">
            {orders.map(([id, customer, description, amount, status, tone]) => (
                <div className="data-list__item max-sm:gap-y-0" role="listitem" tabIndex="0" key={id}>
                    <div className="data-list__id">{id}</div>
                    <div className="data-list__meta">
                        <strong>{customer}</strong>
                        <small>{description}</small>
                    </div>
                    <div className="data-list__amount max-sm:justify-self-end max-sm:text-right">{amount}</div>
                    <div className={`status-badge status-badge--${tone} max-sm:justify-self-end`}>{status}</div>
                    <svg className="data-list__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            ))}
        </div>
    );
}
