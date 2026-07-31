import EyeIcon from '../icons/EyeIcon';
import OpenLinkIcon from '../icons/OpenLinkIcon';
import CalendarIcon from '../icons/CalendarIcon';
import { useLocalDateTime } from '../../hooks/useLocalDateTime';

export default function DashboardWelcome({ name }) {
    const { greeting, dateLabel } = useLocalDateTime();

    return (
        <section className="shopra-welcome">
            <div>
                <p>{dateLabel}</p>
                <h1>{greeting}, {name}! <span>👋</span></h1>
                <small>Вот что происходит в вашем магазине сегодня.</small>
            </div>
            <div className="shopra-welcome-actions">
                <button className="shopra-button shopra-button-secondary" type="button">
                    <EyeIcon/>
                    Посмотреть магазин
                    <OpenLinkIcon/>
                </button>
            </div>
        </section>
    );
}
