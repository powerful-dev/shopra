export default function SettingsPage() {
    const items = [
        {
            title: 'Основные настройки',
            description: 'Название магазина, контакты и уведомления',
            icon: <SettingsIcon />,
            onClick: () => {},
        },
        {
            title: 'Доступы сотрудников',
            description: 'Роли и права команды',
            icon: <StoreIcon />,
            href: '/admin/administrators',
        },
    ];

    return (
        <>
            <section className="mb-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)] max-lg:hidden">
                        Шопра · Панель управления
                    </p>

                    <h1 className="m-0 truncate text-[32px] font-[760] tracking-[-0.05em] max-lg:text-[19px]">
                        Настройки
                    </h1>

                    <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">
                        Основные данные магазина и дополнительные инструменты.
                    </p>
                </div>
            </section>

            <section className="grid gap-2 pb-8">
                {items.map((item) => (
                    <SettingsItem
                        key={item.title}
                        {...item}
                    />
                ))}
            </section>
        </>
    );
}

function SettingsItem({
    title,
    description,
    icon,
    href,
    onClick,
}) {
    const className =
        'grid min-h-[70px] w-full grid-cols-[38px_minmax(0,1fr)_18px] items-center gap-3 rounded-[13px] border border-[color:var(--color-border)] bg-white p-[12px_14px] text-left text-inherit no-underline shadow-[var(--shadow)] transition hover:border-[#d8c7bc] hover:bg-[#fcfaf8]';

    const content = (
        <>
            <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-[#f9eee7] text-[color:var(--color-accent)]">
                {icon}
            </span>

            <span className="flex min-w-0 flex-col">
                <strong className="text-[13px]">
                    {title}
                </strong>

                <small className="mt-0.5 text-[12px] text-[color:var(--color-secondary)]">
                    {description}
                </small>
            </span>

            <ChevronIcon />
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                className={className}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
        >
            {content}
        </button>
    );
}

function SettingsIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function StoreIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}