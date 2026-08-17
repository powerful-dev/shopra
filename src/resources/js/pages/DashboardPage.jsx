import DashboardCard from '../components/admin/DashboardCard';
import DashboardWelcome from '../components/admin/DashboardWelcome';
import QuickActions from '../components/admin/QuickActions';
import RecentOrders from '../components/admin/RecentOrders';
import SalesChart from '../components/admin/SalesChart';
import SetupProgress from '../components/admin/SetupProgress';
import StatCard from '../components/admin/StatCard';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {

    const { user } = useAuth();

    return (
        <div className="mx-4 pb-8 max-sm:!mx-[13px] sm:max-lg:!mx-5 lg:mx-8">
            <DashboardWelcome userName={user.name.split(' ')[0]} />
            <section className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
                <StatCard type="orders" label="Новые заказы" value="12" detail="+3 за сегодня" />
                <StatCard type="sales" label="Продажи за сегодня" value="24 560 ₴" detail="+18% к вчера" />
                <StatCard type="processing" label="Заказы в обработке" value="28" detail="Смотреть" />
                <StatCard type="products" label="Товары" value="156" detail="Смотреть" />
            </section>

            <section className="mt-6 grid min-w-0 gap-3 xl:grid-cols-[1.2fr_1.6fr]">
                <DashboardCard dashboard title="Последние заказы" kicker="В реальном времени" action="Все заказы">
                    <RecentOrders />
                </DashboardCard>
                <DashboardCard dashboard chart title="Продажи за сегодня" kicker="Сегодня, 1 августа">
                    <SalesChart />
                </DashboardCard>
            </section>

            <section className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]">
                <DashboardCard dashboard title="Быстрые действия" kicker="Без лишних шагов" compact>
                    <QuickActions />
                </DashboardCard>
                <SetupProgress />
            </section>
        </div>
    );
}
