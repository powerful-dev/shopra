import EyeIcon from '../icons/EyeIcon';
import OpenLinkIcon from '../icons/OpenLinkIcon';
import CalendarIcon from '../icons/CalendarIcon';
import { useLocalDateTime } from '../../hooks/useLocalDateTime';

export default function DashboardWelcome({ name }) {
    const { greeting, dateLabel } = useLocalDateTime();
    const homeUrl = document.getElementById('admin-app')?.dataset.storeUrl;

    return (
        <section class="shopra-header-actions">
            <div>
                <p>{dateLabel}</p>
                <h1>{greeting}, {name}! <span>👋</span></h1>
                <small>Вот что происходит в вашем магазине сегодня.</small>
            </div>
            {homeUrl && (
                <div class="shopra-header-actions-actions">
                    <a
                        className="shopra-button shopra-button-secondary"
                        href={homeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <EyeIcon />
                        Посмотреть магазин
                        <OpenLinkIcon />
                    </a>
                </div>
            )}
        </section>
    );
}
