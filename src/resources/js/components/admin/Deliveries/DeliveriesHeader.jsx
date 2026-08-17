import BoxCheckedIcon from "../../icons/BoxCheckedIcon"

export default function DeliveriesHeader(){
    return (
        <section className="mb-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
                <p className="text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)] max-lg:hidden">
                    Настройки магазина
                </p>

                <h1 className="m-0 truncate text-[32px] font-[760] tracking-[-0.05em] max-lg:text-[19px]">
                    Доставка
                </h1>

                <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">
                    Включите готовую службу без ключей — покупатель укажет город,
                    отделение или адрес, а вы увидите всё в заказе.
                </p>
            </div>

            <div className="flex min-w-[225px] items-center gap-[10px] rounded-[12px] border border-[#d9eadb] bg-[#f4fbf5] p-3 max-sm:min-w-0">
                <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-white text-[#438254]">
                    <BoxCheckedIcon/>
                </span>

                <p className="m-0 flex flex-col max-sm:hidden">
                    <small className="text-[11px] text-[#869087]">
                        Готово принимать адреса
                    </small>

                    <strong className="mt-0.5 text-[12px] text-[#425046]">
                        2 способа включены
                    </strong>
                </p>
            </div>
        </section>
    );
}