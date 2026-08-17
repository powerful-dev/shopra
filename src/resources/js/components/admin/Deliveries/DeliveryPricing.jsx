import PricingIcon from "../../icons/Deliveries/PricingIcon"

export default function DeliveryPricing() {
    return (
        <article className="rounded-[14px] border border-[color:var(--color-border)] bg-white p-[14px]">
            <header className="mb-3 flex items-center gap-[9px]">
                <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-[#f9eee7] text-[color:var(--color-accent)]">
                    <PricingIcon/>
                </span>

                <div>
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[.06em] text-[color:var(--color-accent)]">
                        Стоимость
                    </p>

                    <h2 className="mb-0 mt-0.5 text-[16px] font-bold">
                        Что увидит покупатель
                    </h2>
                </div>
            </header>

            <label className="flex flex-col gap-1 text-[11px] font-bold text-[#70665f]">
                Расчёт доставки

                <select className="h-[39px] rounded-[9px] border border-[#d8d0ca] bg-white px-[10px] text-[12px] font-normal">
                    <option>Фиксированная стоимость</option>
                    <option>Всегда бесплатно</option>
                    <option disabled>
                        По тарифам службы — нужен API
                    </option>
                </select>
            </label>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <PriceField
                    label="По Украине"
                    value="100"
                />

                <PriceField
                    label="За границу"
                    value="500"
                />
            </div>

            <div className="mt-3 grid grid-cols-[38px_minmax(0,1fr)_140px] items-center gap-2 rounded-[10px] border border-[#e7d2c4] bg-[#fff8f3] p-[10px] max-sm:grid-cols-[38px_1fr]">
                <label className="switch">
                    <input
                        className="switch__input"
                        type="checkbox"
                        defaultChecked
                    />

                    <span className="switch__track" />
                </label>

                <p className="m-0">
                    <strong className="block text-[12px]">
                        Бесплатно от суммы заказа
                    </strong>

                    <small className="text-[11px] text-[#8f867f]">
                        Для доставки по Украине
                    </small>
                </p>

                <div className="flex h-[37px] rounded-[8px] border border-[#d8d0ca] bg-white max-sm:col-start-2">
                    <input
                        defaultValue="2500"
                        className="min-w-0 flex-1 border-0 bg-transparent px-2 outline-none"
                    />

                    <b className="grid w-9 place-items-center border-l border-[#e7e1dc]">
                        ₴
                    </b>
                </div>
            </div>
        </article>
    );
}

function PriceField({ label, value }) {
    return (
        <label className="flex flex-col gap-1 text-[11px] font-bold">
            {label}

            <div className="flex h-[37px] rounded-[8px] border border-[#d8d0ca]">
                <input
                    defaultValue={value}
                    className="min-w-0 flex-1 border-0 bg-transparent px-2 outline-none"
                />

                <b className="grid w-9 place-items-center border-l border-[#e7e1dc] text-[#948b84]">
                    ₴
                </b>
            </div>
        </label>
    );
}