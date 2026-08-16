export default function DashboardWelcome() {
    return (
        <section className="mb-[27px] block px-0.5 pt-[25px] sm:flex sm:flex-wrap sm:items-start sm:gap-[18px] xl:mb-6 xl:flex-nowrap xl:items-end xl:justify-between xl:gap-6 xl:pt-[34px]">
            <div className="min-w-0">
                <p className="mb-2 text-xs font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)]">Суббота, 1 августа</p>
                <h1 className="text-[27px] font-[720] tracking-[-0.045em] text-[color:var(--color-primary)] sm:text-[clamp(26px,2.3vw,36px)]">Доброе утро, Иван! <span className="inline-block">👋</span></h1>
                <p className="mt-[7px] text-[13px] leading-[1.5] text-[color:var(--color-secondary)]">Вот что происходит в вашем магазине сегодня.</p>
            </div>
            <div className="mt-[18px] grid grid-cols-2 gap-[9px] sm:flex sm:w-full sm:items-center xl:mt-0 xl:w-auto">
                <button type="button" className="button button--secondary button--icon min-w-0 whitespace-nowrap max-sm:px-[9px]">
                    <EyeIcon /> Посмотреть магазин <OpenLinkIcon />
                </button>
                <span className="inline-flex min-h-10 min-w-0 items-center gap-2 whitespace-nowrap rounded-[10px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.55)] px-4 py-2.5 text-xs font-[650] text-[color:var(--color-secondary)] max-sm:px-[9px]">
                    <CalendarIcon /> Сегодня, 1 августа 2026 г.
                </span>
            </div>
        </section>
    );
}

function EyeIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>; }
function OpenLinkIcon() { return <svg className="h-3.5 w-3.5 max-sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>; }
function CalendarIcon() { return <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></svg>; }
