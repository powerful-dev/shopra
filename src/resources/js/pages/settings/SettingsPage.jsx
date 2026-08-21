import SettingsIcon from '../../components/icons/SettingsIcon';
import StoreIcon from '../../components/icons/StoreIcon';
import MoreIcon from '../../components/icons/MoreIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon';

export default function SettingsPage() {
    const items = [
        {
            title: 'Основные настройки',
            description: 'Название магазина, контакты и уведомления',
            icon: <SettingsIcon />,
            href: '/admin/settings/common',
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

            <ArrowRightIcon />
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
