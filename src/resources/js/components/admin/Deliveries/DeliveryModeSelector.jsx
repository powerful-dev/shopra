export default function DeliveryModeSelector({
    value = 'manual',
    onChange,
}) {
    return (
        <div className="grid grid-cols-2 gap-[7px] border-b border-[#e8e2dd] bg-white p-[11px_12px] max-sm:grid-cols-1">
            <button
                type="button"
                onClick={() => onChange?.('manual')}
                className={[
                    'relative grid min-h-[74px] grid-cols-[31px_minmax(0,1fr)] items-center gap-2 rounded-[10px] border p-[9px] text-left',
                    value === 'manual'
                        ? 'border-[#d59068] bg-[#fff8f3]'
                        : 'border-[color:var(--color-border)] bg-white',
                ].join(' ')}
            >
                <span className="grid h-[31px] w-[31px] place-items-center rounded-[8px] bg-[#f9eee7] text-[color:var(--color-accent)]">
                    ✓
                </span>

                <p className="m-0">
                    <strong className="block text-[12px]">
                        Просто, без API
                    </strong>

                    <small className="mt-[3px] block text-[11px] leading-[1.35] text-[#918880]">
                        Покупатель вводит адрес — вы оформляете отправку вручную
                    </small>
                </p>

                <em className="absolute right-[7px] top-[6px] rounded-full bg-[#eaf6ec] px-[5px] py-[3px] text-[9px] not-italic font-extrabold uppercase text-[#438254]">
                    Рекомендуем
                </em>
            </button>

            <button
                type="button"
                onClick={() => onChange?.('api')}
                className={[
                    'grid min-h-[74px] grid-cols-[31px_minmax(0,1fr)] items-center gap-2 rounded-[10px] border p-[9px] text-left',
                    value === 'api'
                        ? 'border-[#d59068] bg-[#fff8f3]'
                        : 'border-[color:var(--color-border)] bg-white',
                ].join(' ')}
            >
                <span className="grid h-[31px] w-[31px] place-items-center rounded-[8px] bg-[#f2eeeb] text-[#837970]">
                    🔑
                </span>

                <p className="m-0">
                    <strong className="block text-[12px]">
                        Автоматически
                    </strong>

                    <small className="mt-[3px] block text-[11px] leading-[1.35] text-[#918880]">
                        Тарифы, накладные и статусы через кабинет службы
                    </small>
                </p>
            </button>
        </div>
    );
}