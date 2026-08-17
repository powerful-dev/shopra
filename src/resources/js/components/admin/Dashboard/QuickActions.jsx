const actions = [
    ['Добавить товар', 'plus'], ['Создать акцию', 'discount'], ['Добавить доставку', 'truck'],
    ['Настроить оплату', 'card'], ['Подключить домен', 'earth'],
];

export default function QuickActions() {
    return (
        <div className="quick-actions !grid-cols-2 sm:!grid-cols-3 xl:!grid-cols-5">
            {actions.map(([label, icon]) => (
                <button key={label} type="button" className="button quick-button">
                    <span><ActionIcon type={icon} /></span>
                    {label}
                </button>
            ))}
        </div>
    );
}

function ActionIcon({ type }) {
    const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (type === 'plus') return <svg {...props}><path d="M5 12h14M12 5v14" /></svg>;
    if (type === 'discount') return <svg {...props}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m15 9-6 6M9 9h.01M15 15h.01" /></svg>;
    if (type === 'truck') return <svg {...props}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>;
    if (type === 'card') return <svg {...props}><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>;
    return <svg {...props}><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54M7 3.34V5a3 3 0 0 0 3 3 2 2 0 0 1 2 2c0 1.1.9 2 2 2s2-.9 2-2 .9-2 2-2h3.17M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" /><circle cx="12" cy="12" r="10" /></svg>;
}
