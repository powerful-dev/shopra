import SenderSettings from './SenderSettings';
import DeliveryPricing from './DeliveryPricing';
import DeliveryAutomation from './DeliveryAutomation';
import DeliveryInfo from './DeliveryInfo';

export default function DeliverySettings() {
    return (
        <section className="mt-[11px] grid grid-cols-2 gap-[11px] max-lg:grid-cols-1">
            <SenderSettings />

            <DeliveryPricing />

            <DeliveryAutomation />

            <DeliveryInfo />
        </section>
    );
}