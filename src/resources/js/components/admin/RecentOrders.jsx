import { Link } from 'react-router-dom';

export default function RecentOrders({ orders }) {
    return <div className="shopra-orders">{orders.map((order) => <Link to="/admin/orders" className="shopra-order" key={order.id}><b>{order.id}</b><span><strong>{order.customer}</strong><small>{order.time}</small></span><em>{order.total}</em><i className={`shopra-status is-${order.tone}`}>{order.status}</i><u uk-icon="icon: chevron-right; ratio: 0.65" /></Link>)}</div>;
}
