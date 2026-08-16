export default function DashboardCard({ title, kicker, action, children, compact = false, chart = false, dashboard = false, className = '' }) {
    if (!dashboard) {
        return <section className={`shopra-dashboard-card ${className}`.trim()}><header className="shopra-card-heading"><div>{kicker && <p>{kicker}</p>}<h2>{title}</h2></div>{action}</header>{children}</section>;
    }

    const content = <>
            <header className={`panel-head${compact ? ' compact' : ''}`}>
                <div>
                    {kicker && <p className="panel-kicker">{kicker}</p>}
                    <h2>{title}</h2>
                </div>
                {action && <button type="button" className="text-link">{action}</button>}
            </header>
            {children}
        </>;

    return (
        <article className="h-full min-w-0 rounded-[15px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_12px_40px_rgba(70,47,31,0.055)]">
            {chart ? <div className="flex h-full flex-col justify-between gap-6">{content}</div> : content}
        </article>
    );
}
