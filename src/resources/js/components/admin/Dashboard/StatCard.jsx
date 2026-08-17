const tones = {
    orders: 'bg-[#fbf0e7] text-[color:var(--color-accent)]',
    sales: 'bg-[#eef8ee] text-[#2f7c4b]',
    processing: 'bg-[#edf3fa] text-[#3f6fa8]',
    products: 'bg-[#fbf0e7] text-[#b85d27]',
};

export default function StatCard({ type, label, value, detail }) {
    return (
        <article className="h-full rounded-[15px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[15px] shadow-[0_12px_40px_rgba(70,47,31,0.055)] transition duration-150 ease-in-out hover:-translate-y-px hover:shadow-[0_15px_42px_rgba(70,47,31,0.08)] max-sm:min-h-[105px] max-sm:px-3 max-sm:py-[14px]">
            <div className="flex items-center gap-4 max-sm:items-start max-sm:gap-3">
                <span className={`flex h-[43px] w-[43px] flex-none items-center justify-center rounded-xl max-sm:h-[35px] max-sm:w-[35px] ${tones[type]}`}>
                    <MetricIcon type={type} />
                </span>
                <div className="flex min-w-0 flex-col">
                    <p className={`text-xs font-[760] uppercase tracking-[0.09em] max-xl:text-[11px] ${type === 'orders' ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--color-secondary)]'}`}>{label}</p>
                    <strong className="text-[clamp(20px,1.75vw,27px)] font-[730] tracking-[-0.04em] text-[color:var(--color-primary)] max-sm:text-[19px]">{value}</strong>
                    <p className={`text-[11px] font-[650] ${type === 'sales' ? 'text-[#2f7c4b]' : 'text-[color:var(--color-secondary)]'}`}>{detail}</p>
                </div>
            </div>
        </article>
    );
}

function MetricIcon({ type }) {
    const common = { width: 21, height: 21, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (type === 'orders') return <svg {...common}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>;
    if (type === 'sales') return <svg {...common}><path d="M12 16v5M16 14v7M20 10v11" /><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" /><path d="M4 18v3M8 14v7" /></svg>;
    if (type === 'processing') return <svg {...common}><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12M3.3 7l7.703 4.734a2 2 0 0 0 1.994 0L20.7 7M7.5 4.27l9 5.15" /></svg>;
    return <svg {...common}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></svg>;
}
