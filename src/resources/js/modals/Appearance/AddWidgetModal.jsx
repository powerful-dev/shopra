export default function AddWidgetModal({ onClose }) {
    const widgets = [
        {
            id: 'showcase',
            title: 'Витрина',
            description: 'Товары или категории в сетке',
            icon: <ShowcaseIcon />,
        },
        {
            id: 'text',
            title: 'Заголовок и текст',
            description: 'Текстовый блок с кнопкой',
            icon: <TextIcon />,
        },
        {
            id: 'banner',
            title: 'Баннер',
            description: 'Изображение или видео и кнопки',
            icon: <BannerIcon />,
        },
    ];

    return (
        <div
            id="add-widget-modal"
            className="modal-overlay"
            role="presentation"
        >
            <section
                className="modal-dialog flex !w-[min(760px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-widget-modal-title"
            >
                <header className="flex min-h-[82px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[17px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Внешний вид магазина
                        </small>

                        <h2
                            id="add-widget-modal-title"
                            className="m-0 text-[22px] font-[760] tracking-[-.035em]"
                        >
                            Добавить виджет
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть выбор виджета"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>
                </header>

                <div className="grid grid-cols-3 gap-[9px] overflow-y-auto px-[23px] pb-[25px] pt-[21px] max-sm:grid-cols-1 max-sm:px-4 max-sm:py-4">
                    {widgets.map((widget) => (
                        <WidgetOption
                            key={widget.id}
                            title={widget.title}
                            description={widget.description}
                            icon={widget.icon}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function WidgetOption({
    title,
    description,
    icon,
}) {
    return (
        <button
            type="button"
            className="grid min-h-[140px] grid-cols-[36px_1fr_auto] items-start gap-[9px] rounded-xl border border-[color:var(--color-border)] bg-[#fcfbfa] p-[14px] text-left text-[color:var(--color-accent)] transition-colors hover:border-[#c9b2a3] hover:bg-white max-sm:min-h-20"
            data-modal-close
        >
            {icon}

            <span className="flex flex-col text-[color:var(--color-primary)]">
                <b className="text-[12px]">
                    {title}
                </b>

                <small className="mt-1 text-[11px] leading-[1.4] text-[color:var(--color-secondary)]">
                    {description}
                </small>
            </span>

            <PlusIcon />
        </button>
    );
}

function CloseIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function ShowcaseIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    );
}

function TextIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
    );
}

function BannerIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                width="18"
                height="18"
                x="3"
                y="3"
                rx="2"
                ry="2"
            />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}