import { useState } from 'react';

import DeliveriesHeader from '../components/admin/Deliveries/DeliveriesHeader';
import DeliveryServicesSection from '../components/admin/Deliveries/DeliveryServicesSection';
import DeliverySettings from '../components/admin/Deliveries/DeliverySettings';

const initialServices = [
    {
        id: 'nova-poshta',
        code: 'НП',
        name: 'Нова пошта',
        description:
            'Отделения, почтоматы и курьерская доставка по Украине и за границу.',
        codeClassName: 'bg-[#e53935] text-white',
        enabled: true,
        tags: [
            'По Украине',
            'За границу',
        ],
        mode: 'Ручной режим',
    },
    {
        id: 'ukrposhta',
        code: 'УП',
        name: 'Укрпошта',
        description:
            'Доставка по Украине и международные отправления из одного подключения.',
        codeClassName: 'bg-[#f3c72c] text-[#225090]',
        enabled: true,
        tags: [
            'По Украине',
            'За границу',
        ],
        mode: 'Ручной режим',
    },
];

export default function DeliveriesPage() {

    const [services, setServices] = useState(initialServices);
    const [selectedServiceId, setSelectedServiceId] = useState('nova-poshta');
    const [pickupEnabled, setPickupEnabled] = useState(false);
    const [mode, setMode] = useState('manual');

    const handleServiceToggle = (serviceId, enabled) => {
        setServices((current) =>
            current.map((service) =>
                service.id === serviceId
                    ? {
                        ...service,
                        enabled,
                    }
                    : service
            )
        );
    };

    return (
        <>
            
            <DeliveriesHeader/>

            <DeliveryServicesSection
                services={services}
                selectedServiceId={selectedServiceId}
                pickupEnabled={pickupEnabled}
                mode={mode}
                onSelect={setSelectedServiceId}
                onToggle={handleServiceToggle}
                onPickupToggle={setPickupEnabled}
                onModeChange={setMode}
            />

            <DeliverySettings/>

        </>
    );
}