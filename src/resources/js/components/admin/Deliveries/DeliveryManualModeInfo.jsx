export default function DeliveryManualModeInfo() {
    return (
        <div className="border-b border-[#e8e2dd] bg-white p-3">
            <div className="flex items-center gap-2 rounded-[9px] border border-[#d9eadb] bg-[#f4fbf5] p-[9px]">
                <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] bg-white text-[#438254]">
                    ✓
                </span>

                <p className="m-0">
                    <strong className="block text-[12px] text-[#425046]">
                        Ключи и договор не нужны
                    </strong>

                    <small className="text-[11px] text-[#778279]">
                        Этого режима достаточно, чтобы понимать, куда отправлять заказ.
                    </small>
                </p>
            </div>

            <div className="mt-[9px] grid grid-cols-[1fr_1.05fr] gap-2 max-sm:grid-cols-1">
                <div className="rounded-[9px] border border-[color:var(--color-border)] bg-[#fcfaf8] p-[10px]">
                    <p className="mb-2 text-[10px] font-[760] uppercase tracking-[.07em] text-[color:var(--color-accent)]">
                        Что заполнит покупатель
                    </p>

                    <strong className="block text-[11px] text-[#524a44]">
                        По Украине
                    </strong>

                    <ul className="mt-[5px] grid gap-1 pl-[14px] text-[11px] leading-[1.35] text-[#857b73]">
                        <li>Получатель и телефон</li>
                        <li>Город и отделение или почтомат</li>
                        <li>Адрес — если выбрана доставка курьером</li>
                    </ul>

                    <strong className="mt-[7px] block text-[11px] text-[#524a44]">
                        За границу
                    </strong>

                    <ul className="mt-[5px] grid gap-1 pl-[14px] text-[11px] leading-[1.35] text-[#857b73]">
                        <li>Получатель латиницей и телефон</li>
                        <li>Страна, индекс, город</li>
                        <li>Улица, дом и квартира</li>
                    </ul>
                </div>

                <div className="rounded-[9px] border border-[color:var(--color-border)] bg-[#fcfaf8] p-[10px]">
                    <p className="mb-2 text-[10px] font-[760] uppercase tracking-[.07em] text-[color:var(--color-accent)]">
                        Так это выглядит в заказе
                    </p>

                    <header className="flex items-center gap-[7px] border-b border-[#eee9e5] pb-2">
                        <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] bg-[#e53935] text-[10px] font-extrabold text-white">
                            НП
                        </span>

                        <p className="m-0 flex flex-col">
                            <strong className="text-[11px]">
                                Нова пошта · Отделение
                            </strong>

                            <small className="mt-0.5 text-[11px] text-[#928981]">
                                Доставка оплачивается получателем
                            </small>
                        </p>
                    </header>

                    <dl className="mt-[5px]">
                        <Row label="Куда" value="Одесса, отделение № 24" />
                        <Row label="Получатель" value="Анна Смирнова" />
                        <Row label="Телефон" value="+380 67 123 45 67" last />
                    </dl>
                </div>
            </div>

            <p className="mb-0 mt-[9px] rounded-[8px] bg-[#fff5ee] p-2 text-[11px] leading-[1.45] text-[#776c64]">
                Shopra сохраняет и показывает данные доставки в заказе.
                Накладную вы создаёте в кабинете Нова пошта, а готовый
                трек-номер добавляете в заказ вручную.
            </p>
        </div>
    );
}

function Row({ label, value, last = false }) {
    return (
        <div
            className={[
                'grid grid-cols-[55px_minmax(0,1fr)] gap-[6px] py-[5px] text-[11px]',
                !last ? 'border-b border-[#f0ece8]' : '',
            ].join(' ')}
        >
            <dt className="text-[#9a918a]">
                {label}
            </dt>

            <dd className="m-0 text-right font-[690] text-[#514943]">
                {value}
            </dd>
        </div>
    );
}