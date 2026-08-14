document.addEventListener('DOMContentLoaded', () => {
    const preview = document.querySelector('[data-store-preview]');
    const deviceButtons = document.querySelectorAll('[data-preview-device]');

    if (!preview || deviceButtons.length === 0) {
        return;
    }

    const setPreviewDevice = (device) => {
        const isMobile = device === 'mobile';

        preview.classList.toggle('shopra-mobile', isMobile);
        preview.classList.toggle('shopra-desktop', !isMobile);

        deviceButtons.forEach((button) => {
            const isActive = button.dataset.previewDevice === device;

            button.classList.toggle('bg-[#f3eee9]', isActive);
            button.classList.toggle('text-[color:var(--accent-dark)]', isActive);
            button.classList.toggle('bg-transparent', !isActive);
            button.classList.toggle('text-[#6e6863]', !isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    };

    deviceButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setPreviewDevice(button.dataset.previewDevice);
        });
    });
});
