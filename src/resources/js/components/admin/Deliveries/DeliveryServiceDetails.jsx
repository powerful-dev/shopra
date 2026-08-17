import DeliveryModeSelector from './DeliveryModeSelector';
import DeliveryManualModeInfo from './DeliveryManualModeInfo';
import DeliveryZone from './DeliveryZone';

export default function DeliveryServiceDetails({
    service,
    mode,
    onModeChange,
}) {
    if (!service) {
        return null;
    }

    return (
        <aside className="overflow-hidden rounded-[13px] border border-[color:var(--color-border)] bg-[#faf8f6]">
            <header className="grid min-h-[70px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-[10px] border-b border-[#eae5e1] bg-white p-[11px_12px]">
                <span
                    className={`grid h-[42px] w-[42px] place-items-center rounded-[12px] text-[12px] font-extrabold ${service.codeClassName}`}
                >
                    {service.code}
                </span>

                <div>
                    <p className="m-0 text-[10px] font-bold uppercase tracking-[.06em] text-[color:var(--color-accent)]">
                        Способ работы
                    </p>

                    <h3 className="mb-0 mt-0.5 text-[14px] font-bold">
                        {service.name}
                    </h3>
                </div>

                {service.enabled && (
                    <em className="rounded-full bg-[#eaf6ec] px-[7px] py-[5px] text-[11px] not-italic font-bold text-[#438254]">
                        Активна
                    </em>
                )}
            </header>

            <DeliveryModeSelector
                value={mode}
                onChange={onModeChange}
            />

            {mode === 'manual' && (
                <DeliveryManualModeInfo />
            )}

            <DeliveryZone
                title="Доставка по Украине"
                description="Покупатель укажет город и отделение вручную"
                enabled
                icon="⌖"
                iconClassName="bg-[#fff0e7] text-[color:var(--color-accent)]"
                tags={[
                    'Отделение',
                    'Почтомат',
                    'Курьер',
                ]}
            />

            <DeliveryZone
                title="Международная доставка"
                description="Покупатель заполнит полный почтовый адрес"
                icon="◎"
                iconClassName="bg-[#edf3fa] text-[#4873a2]"
                tags={[
                    'Отделение',
                    'Курьер',
                ]}
            />
        </aside>
    );
}