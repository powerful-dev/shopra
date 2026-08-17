export default function SetupProgress() {
    return (
        <article className="shopra-setup-card rounded-[15px] border border-[#ead8ca] p-[17px]">
            <div className="flex items-center gap-2 text-[color:var(--color-accent)]">
                <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-white"><StoreIcon /></span>
                <p className="m-0 flex-1 text-[11px] font-bold uppercase text-[#77716b]">Старт магазина</p>
                <strong className="text-xs">50%</strong>
            </div>
            <h2 className="mt-[13px] text-[15px] font-[720] tracking-[-0.025em] text-[color:var(--color-primary)]">Осталось совсем немного</h2>
            <div className="my-3 h-1.5 overflow-hidden rounded-[99px] bg-[#ead8cb]" role="progressbar" aria-label="Прогресс запуска магазина" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><i className="block h-full w-1/2 rounded-[inherit] bg-[linear-gradient(90deg,#bb4e18,#e28950)]" /></div>
            <div className="overflow-hidden border-t border-[rgba(196,158,131,0.28)]">
                <button type="button" className="flex min-h-12 w-full cursor-pointer items-center gap-[7px] border-0 border-b border-[rgba(196,158,131,0.2)] bg-transparent py-2 text-left text-[#594c43] hover:text-[#8c3510]">
                    <span className="grid h-[22px] w-[22px] place-items-center rounded-full border border-[#d8bda9] text-[color:var(--color-accent)]"><CardIcon /></span>
                    <span className="flex min-w-0 flex-1 flex-col gap-px"><strong className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-[680]">Добавить способ оплаты</strong><small className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[#8c8178]">Прими оплату от покупателя</small></span>
                    <ChevronIcon className="ml-auto -rotate-90" />
                </button>
            </div>
            <button type="button" className="group flex w-full cursor-pointer items-center justify-center gap-[5px] border-0 bg-transparent pt-[9px] text-[11px] font-bold text-[color:var(--color-accent)]" aria-expanded="false">
                Все шаги (5) <ChevronIcon />
            </button>
        </article>
    );
}

function StoreIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" /></svg>; }
function CardIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>; }
function ChevronIcon({ className = '' }) { return <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>; }
