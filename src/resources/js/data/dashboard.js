import OrdersIcon from '../components/icons/OrdersIcon';
import AnalyticsIcon from '../components/icons/AnalyticsIcon';
import OrdersInProcessIcon from '../components/icons/OrdersInProcessIcon';
import ProductsIcon from '../components/icons/ProductsIcon';

export const dashboardData = {
    metrics: [
        { label: 'Новые заказы', value: '12', detail: '+3 за сегодня', icon: OrdersIcon, tone: 'copper' },
        { label: 'Продажи за сегодня', value: '27 430 ₴', detail: '+18.2% к вчера', icon: AnalyticsIcon, tone: 'green' },
        { label: 'В обработке', value: '8', detail: 'Нужно подтвердить', icon: OrdersInProcessIcon, tone: 'blue' },
        { label: 'Товары', value: '124', detail: '6 заканчиваются', icon: ProductsIcon, tone: 'warm' },
    ],
    orders: [
        { id: '#1024', customer: 'Анна Смирнова', time: '2 мин. назад', total: '3 520 ₴', status: 'Новый', tone: 'new' },
        { id: '#1023', customer: 'Дмитрий Коваленко', time: '15 мин. назад', total: '5 890 ₴', status: 'Оплачен', tone: 'paid' },
        { id: '#1022', customer: 'Ольга Петрова', time: '1 ч. назад', total: '2 450 ₴', status: 'В обработке', tone: 'process' },
        { id: '#1021', customer: 'Сергей Иванов', time: '2 ч. назад', total: '7 100 ₴', status: 'Доставлен', tone: 'delivered' },
        { id: '#1020', customer: 'Елена Васильева', time: '3 ч. назад', total: '4 300 ₴', status: 'Новый', tone: 'new' },
    ],
    sales: {
        7: [4, 7, 15, 11, 17, 13, 12, 16, 27],
        30: [7, 11, 9, 16, 13, 19, 17, 22, 20, 28, 25, 31],
    },
    setupTasks: [
        { id: 'product', label: 'Добавить первый товар', description: 'Товар опубликован', icon: 'album', done: true },
        { id: 'delivery', label: 'Настроить доставку', description: 'Способ доставки добавлен', icon: 'location', done: true },
        { id: 'payment', label: 'Добавить способ оплаты', description: 'Принимайте оплату от покупателей', icon: 'credit-card' },
        { id: 'appearance', label: 'Настроить внешний вид', description: 'Логотип, цвета и баннер магазина', icon: 'paint-bucket' },
        { id: 'domain', label: 'Подключить домен', description: 'Собственный адрес магазина', icon: 'world', optional: true },
    ],
};
