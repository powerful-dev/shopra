import DeliveryServiceCard from './DeliveryServiceCard';
import PickupCard from './PickupCard';

export default function DeliveryServicesList({
    services,
    selectedServiceId,
    onSelect,
    onToggle,
    pickupEnabled,
    onPickupToggle,
}) {
    return (
        <div className="flex flex-col gap-2">
            {services.map((service) => (
                <DeliveryServiceCard
                    key={service.id}
                    {...service}
                    active={selectedServiceId === service.id}
                    onClick={() => onSelect?.(service.id)}
                    onToggle={(enabled) => onToggle?.(service.id, enabled)}
                />
            ))}

            <PickupCard
                enabled={pickupEnabled}
                onToggle={onPickupToggle}
            />
        </div>
    );
}