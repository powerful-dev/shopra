export default function DashboardCard({ title, kicker, action, children, className = '' }) {
    return <section className={`shopra-dashboard-card uk-card uk-card-default ${className}`.trim()}><header className="shopra-card-heading"><div>{kicker && <p>{kicker}</p>}<h2>{title}</h2></div>{action}</header>{children}</section>;
}
