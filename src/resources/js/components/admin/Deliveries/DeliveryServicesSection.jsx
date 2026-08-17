import DeliveryServicesList from './DeliveryServicesList';
import DeliveryServiceDetails from './DeliveryServiceDetails';

export default function DeliveryServicesSection({
    services,
    selectedServiceId,
    mode,
    pickupEnabled,
    onSelect,
    onToggle,
    onPickupToggle,
    onModeChange,
}) {
    const selectedService = services.find(
        (service) => service.id === selectedServiceId
    );

    return (
        <section className="mt-[11px] rounded-[16px] border border-[color:var(--color-border)] bg-white p-[17px] shadow-[var(--shadow)]">
            <header className="mb-[13px] flex items-center justify-between gap-[18px] max-md:flex-col max-md:items-stretch">
                <div>
                    <p className="m-0 text-[11px] font-[760] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                        Готовые подключения
                    </p>

                    <h2 className="mb-0.5 mt-[3px] text-[17px] font-bold">
                        Службы доставки
                    </h2>

                    <p className="m-0 text-[12px] text-[#918880]">
                        Все необходимые способы уже собраны — остаётся включить нужные.
                    </p>
                </div>

                <button
                    type="button"
                    className="inline-flex min-h-[38px] items-center justify-center gap-[6px] rounded-[9px] border border-[#d8d0ca] bg-white px-[11px] text-[12px] font-bold text-[#655d57]"
                >
                    + Добавить свою доставку
                </button>
            </header>

            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(310px,.9fr)] gap-[11px] max-[980px]:grid-cols-1">
                <DeliveryServicesList
                    services={services}
                    selectedServiceId={selectedServiceId}
                    onSelect={onSelect}
                    onToggle={onToggle}
                    pickupEnabled={pickupEnabled}
                    onPickupToggle={onPickupToggle}
                />

                <DeliveryServiceDetails
                    service={selectedService}
                    mode={mode}
                    onModeChange={onModeChange}
                />
            </div>
        </section>
    );
}