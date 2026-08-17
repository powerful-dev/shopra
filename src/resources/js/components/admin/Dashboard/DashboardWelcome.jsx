import CalendarIcon from '../../icons/CalendarIcon';
import EyeIcon from '../../icons/EyeIcon';
import OpenLinkIcon from '../../icons/OpenLinkIcon';
import { useLocalDateTime } from '../../../hooks/useLocalDateTime';

export default function DashboardWelcome({userName}) {

    const { greeting, dateLabel } = useLocalDateTime();
    const homeUrl = document.getElementById('admin-app')?.dataset.storeUrl;

    return (
        <section className="mb-[27px] block px-0.5 sm:flex sm:flex-wrap sm:items-start sm:gap-[18px] xl:mb-6 xl:flex-nowrap xl:items-end xl:justify-between xl:gap-6">
            <div className="min-w-0">
  
                <h1 className="text-[27px] font-[720] tracking-[-0.045em] text-[color:var(--color-primary)] sm:text-[clamp(26px,2.3vw,36px)]">{greeting}, { userName }! <span className="inline-block">👋</span></h1>
                <p className="mt-[7px] text-[13px] leading-[1.5] text-[color:var(--color-secondary)]">Вот что происходит в вашем магазине сегодня.</p>
            </div>
            <div className="mt-[18px] grid grid-cols-2 gap-[9px] sm:flex sm:w-full sm:items-center xl:mt-0 xl:w-auto">
                {homeUrl.length > 0 && (
                    <a 
                        className="button button--secondary button--icon min-w-0 whitespace-nowrap max-sm:px-[9px]"
                        href={homeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        <EyeIcon /> Посмотреть магазин <OpenLinkIcon />
                    </a>
                )}
                <span className="inline-flex min-h-10 min-w-0 items-center gap-2 whitespace-nowrap rounded-[10px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.55)] px-4 py-2.5 text-xs font-[650] text-[color:var(--color-secondary)] max-sm:px-[9px]">
                    <CalendarIcon /> {dateLabel}
                </span>
            </div>
        </section>
    );
}
