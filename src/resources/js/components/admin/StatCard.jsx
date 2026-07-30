export default function StatCard({ metric }) {

    const Icon = metric.icon;

    return (
        
        <article className="shopra-stat-card uk-card uk-card-default">
            <span className={`shopra-stat-icon is-${metric.tone}`}>
                <Icon className="shopra-nav-icon" />
            </span>
            <div><small>{metric.label}</small><strong>{metric.value}</strong>
            <p className={metric.tone === 'green' ? 'is-positive' : ''}>{metric.detail}</p></div>
        </article>
    )
}
