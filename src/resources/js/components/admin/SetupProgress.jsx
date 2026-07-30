import { useState } from 'react';
import { Link } from 'react-router-dom';

const destinations = { product: '/admin/products', delivery: '/admin/shipping', payment: '/admin/payments', appearance: '/admin/appearance', domain: '/admin/domain' };

export default function SetupProgress({ tasks }) {
    const [isOpen, setIsOpen] = useState(false);
    const required = tasks.filter((task) => !task.optional);
    const completed = required.filter((task) => task.done).length;
    const percentage = Math.round(completed / required.length * 100);
    const nextTask = tasks.find((task) => !task.done && !task.optional) ?? tasks.find((task) => !task.done);
    const visibleTasks = isOpen ? tasks : [nextTask].filter(Boolean);

    return <div className="shopra-setup"><div className="shopra-setup-top"><span uk-icon="icon: bolt; ratio: 0.9" /><div><p>Старт магазина</p><strong>{percentage}% готово</strong></div><b>{completed} из {required.length}</b></div><h2>Сделайте магазин готовым к продажам</h2><div className="shopra-setup-list">{visibleTasks.map((task) => <Link key={task.id} to={destinations[task.id]} className={`shopra-setup-step${task.done ? ' is-done' : ''}`}><span className="shopra-setup-check" uk-icon={task.done ? 'icon: check; ratio: 0.76' : `icon: ${task.icon}; ratio: 0.76`} /><span><strong>{task.label}</strong><small>{task.description}</small>{task.optional && <em>Необязательно</em>}</span><i uk-icon="icon: chevron-right; ratio: 0.75" /></Link>)}</div><button className="shopra-setup-toggle" type="button" onClick={() => setIsOpen((value) => !value)}>{isOpen ? 'Скрыть шаги' : 'Все шаги'}<span uk-icon={`icon: chevron-${isOpen ? 'up' : 'down'}; ratio: 0.72`} /></button></div>;
}
