import { Link } from 'react-router-dom';
import DashboardCard from '../components/admin/DashboardCard';
import DashboardWelcome from '../components/admin/DashboardWelcome';
import PageContainer from '../components/admin/PageContainer';
import QuickActions from '../components/admin/QuickActions';
import RecentOrders from '../components/admin/RecentOrders';
import SalesChart from '../components/admin/SalesChart';
import SetupProgress from '../components/admin/SetupProgress';
import StatCard from '../components/admin/StatCard';
import { dashboardData } from '../data/dashboard';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <PageContainer>
            <DashboardWelcome name={user?.name?.split(' ')[0] ?? 'Администратор'} />
            <section className="shopra-metrics">{dashboardData.metrics.map((metric) => <StatCard key={metric.label} metric={metric} />)}</section>
            <section className="shopra-dashboard-grid"><DashboardCard title="Последние заказы" kicker="Заказы" action={<Link to="/admin/orders" className="shopra-text-link">Все заказы<span uk-icon="icon: arrow-right; ratio: 0.68" /></Link>}><RecentOrders orders={dashboardData.orders} /></DashboardCard><DashboardCard title="Продажи" kicker="Статистика" className="shopra-chart-card"><SalesChart series={dashboardData.sales} /></DashboardCard></section>
            <section className="shopra-bottom-grid"><DashboardCard title="Быстрые действия" kicker="Магазин"><QuickActions /></DashboardCard><SetupProgress tasks={dashboardData.setupTasks} /></section>
        </PageContainer>
    );
}
