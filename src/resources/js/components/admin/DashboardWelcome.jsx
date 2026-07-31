import EyeIcon from '../icons/EyeIcon';
import OpenLinkIcon from '../icons/OpenLinkIcon';
import CalendarIcon from '../icons/CalendarIcon';



export default function DashboardWelcome({ date, name }) {
    return (
        <section className="shopra-welcome">
            <div>
                <p>{date}</p>
                <h1>Доброе утро, {name}! <span>👋</span></h1>
                <small>Вот что происходит в вашем магазине сегодня.</small>
            </div>
            <div className="shopra-welcome-actions">
                <button className="shopra-button shopra-button-secondary" type="button">
                    <EyeIcon/>
                    Посмотреть магазин
                    <OpenLinkIcon/>
                </button>
                <span className="shopra-button shopra-button-secondary">
                    <CalendarIcon/>
                    25 июля 2026 г.
                </span>
            </div>
        </section>
    );
}
