import Breadcrumbs from '../components/admin/Breadcrumbs';

export default function DiscountsPage() {
    const stats = [
        {
            label: 'Активные скидки',
            value: '3',
            icon: <PercentBadgeIcon />,
        },
        {
            label: 'Предложений отправлено',
            value: '300',
            icon: <UsersIcon />,
        },
        {
            label: 'Продажи со скидкой',
            value: '42 680 ₴',
            icon: <PercentIcon />,
        },
    ];

    const discounts = [
        {
            title: 'Брошенная корзина',
            description: 'Автоматическое предложение · 15%',
            status: 'Активно',
            statusVariant: 'success',
            meta: '78 отправлено',
            action: 'Изменить',
            href: './discount_cart_edit.html',
            icon: <CartIcon />,
            iconClassName: 'bg-[#edf6ee] text-[#438254]',
        },
        {
            title: 'После добавления в избранное',
            description: 'Автоматическое предложение · 10%',
            status: 'Активно',
            statusVariant: 'success',
            meta: '202 отправлено',
            action: 'Изменить',
            icon: <HeartIcon />,
            iconClassName: 'bg-[#f7eee8] text-[color:var(--color-accent)]',
        },
        {
            title: 'Летняя распродажа',
            description: 'Выбранные товары · до 31 августа',
            status: 'Запланировано',
            statusVariant: 'planned',
            meta: '−20%',
            action: 'Открыть',
            href: './discount_sale_edit.html',
            icon: <PercentBadgeIcon width={19} height={19} />,
            iconClassName: 'bg-[#eef2f9] text-[#496b98]',
        },
    ];

    return (
        <>
            <header className="mb-[15px]">
                
                <Breadcrumbs className="mb-[3px]" />

                <h1 className="m-0 text-[31px] font-[760] tracking-[-.045em] max-sm:text-[25px]">
                    Скидки и распродажи
                </h1>

                <p className="mb-0 mt-[6px] text-[12px] text-[#827970]">
                    Помогайте покупателю решиться и освобождайте остатки без ручной
                    смены цен.
                </p>
            </header>

            <section className="grid grid-cols-3 gap-[9px] max-[820px]:grid-cols-1 max-sm:grid-cols-3 max-sm:gap-[6px]">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.label}
                        {...stat}
                    />
                ))}
            </section>

            <header className="mb-[10px] mt-[23px]">
                <p className="m-0 text-[11px] font-bold uppercase text-[color:var(--color-accent)]">
                    Основные действия
                </p>

                <h2 className="m-0 mt-0.5 text-[19px] font-[740] tracking-[-.035em]">
                    Что хотите настроить?
                </h2>
            </header>

            <section className="grid grid-cols-2 gap-[11px] max-[820px]:grid-cols-1">
                <ActionCard
                    title="Создать предложение"
                    description="Избранное, брошенная корзина, повторная покупка или промокод."
                    action="Настроить"
                    icon={<HeartIcon width={22} height={22} />}
                />

                <ActionCard
                    title="Создать распродажу"
                    description="Весь магазин, выбранные товары, малый остаток или конкретная модификация."
                    action="Создать"
                    icon={<PercentBadgeIcon width={22} height={22} />}
                    accent
                />
            </section>

            <header className="mb-[10px] mt-[26px] flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
                <div>
                    <p className="m-0 text-[11px] font-bold uppercase text-[color:var(--color-accent)]">
                        Работают сейчас
                    </p>

                    <h2 className="m-0 mt-0.5 text-[19px] font-[740] tracking-[-.035em]">
                        Ваши скидки
                    </h2>
                </div>

                <a
                    href="./promo_code_create.html"
                    className="inline-flex min-h-[35px] items-center gap-[6px] rounded-[9px] border border-[color:var(--color-border)] bg-white px-[10px] text-[11px] font-bold text-[color:var(--color-accent)] max-sm:w-full max-sm:justify-center"
                >
                    <TagIcon />
                    Новый промокод
                </a>
            </header>

            <section className="overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-white shadow-[0_9px_28px_rgba(66,43,27,.035)]">
                {discounts.map((discount) => (
                    <DiscountRow
                        key={discount.title}
                        {...discount}
                    />
                ))}
            </section>
        </>
    );
}

function StatCard({
    label,
    value,
    icon,
}) {
    return (
        <article className="flex min-h-[82px] items-center gap-[11px] rounded-[13px] border border-[color:var(--color-border)] bg-white p-[13px] shadow-[0_7px_22px_rgba(69,46,31,.035)] max-sm:min-h-[87px] max-sm:flex-col max-sm:items-start max-sm:gap-[6px] max-sm:p-[9px]">
            <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-[#f9eee7] text-[color:var(--color-accent)] max-sm:h-[31px] max-sm:w-[31px]">
                {icon}
            </span>

            <p className="m-0 flex flex-col">
                <small className="text-[11px] text-[#887f78]">
                    {label}
                </small>

                <strong className="mt-px text-[18px] tracking-[-.03em] max-sm:text-[14px]">
                    {value}
                </strong>
            </p>
        </article>
    );
}

function ActionCard({
    title,
    description,
    action,
    icon,
    accent = false,
}) {
    return (
        <button
            type="button"
            className={[
                'grid min-h-[190px] grid-cols-[46px_1fr] grid-rows-[1fr_auto] gap-[13px_12px] rounded-[16px] border border-[color:var(--color-border)] p-5 text-left shadow-[0_7px_22px_rgba(69,46,31,.035)] transition hover:-translate-y-0.5 hover:border-[#dcb49c] max-sm:min-h-[170px] max-sm:p-[15px]',
                accent ? 'card-accent-gradient' : 'bg-white',
            ].join(' ')}
        >
            <span className="grid h-[46px] w-[46px] place-items-center rounded-[12px] bg-[#f9eee7] text-[color:var(--color-accent)]">
                {icon}
            </span>

            <div>
                <h3 className="mb-[5px] mt-0.5 text-[17px] font-[740] tracking-[-.025em]">
                    {title}
                </h3>

                <p className="m-0 text-[12px] leading-[1.55] text-[#827970]">
                    {description}
                </p>
            </div>

            <b className="col-start-2 inline-flex items-center gap-1 justify-self-start text-[12px] text-[color:var(--color-accent)]">
                {action}
                <ChevronIcon />
            </b>
        </button>
    );
}

function DiscountRow({
    title,
    description,
    status,
    statusVariant,
    meta,
    action,
    href,
    icon,
    iconClassName,
}) {
    const statusClasses = {
        success: 'bg-[#eaf6ec] text-[#438254]',
        planned: 'bg-[#eef2f9] text-[#496b98]',
    };

    const actionClassName =
        'text-[11px] font-bold text-[color:var(--color-accent)] max-sm:col-start-2 max-sm:justify-self-start';

    return (
        <article className="grid min-h-[70px] grid-cols-[38px_minmax(190px,1.25fr)_95px_100px_64px] items-center gap-[10px] border-b border-[#f0ece8] p-[10px_13px] last:border-b-0 max-[820px]:grid-cols-[38px_minmax(0,1fr)_75px] max-sm:grid-cols-[34px_1fr]">
            <span
                className={`grid h-[38px] w-[38px] place-items-center rounded-[10px] ${iconClassName}`}
            >
                {icon}
            </span>

            <p className="m-0 flex flex-col">
                <strong className="text-[12px]">
                    {title}
                </strong>

                <small className="mt-0.5 text-[11px] text-[#928981]">
                    {description}
                </small>
            </p>

            <em
                className={[
                    'justify-self-start rounded-full px-[7px] py-[5px] text-[11px] not-italic font-bold max-sm:col-start-2',
                    statusClasses[statusVariant],
                ].join(' ')}
            >
                {status}
            </em>

            <b className="text-[11px] text-[#70665f] max-sm:col-start-2">
                {meta}
            </b>

            {href ? (
                <a
                    href={href}
                    className={actionClassName}
                >
                    {action}
                </a>
            ) : (
                <button
                    type="button"
                    className={`border-0 bg-transparent ${actionClassName}`}
                >
                    {action}
                </button>
            )}
        </article>
    );
}

function PercentBadgeIcon({
    width = 19,
    height = 19,
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <path d="m15 9-6 6" />
            <path d="M9 9h.01" />
            <path d="M15 15h.01" />
        </svg>
    );
}

function PercentIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="19" x2="5" y1="5" y2="19" />
            <circle cx="6.5" cy="6.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function HeartIcon({
    width = 22,
    height = 22,
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    );
}

function CartIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    );
}

function TagIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
            <circle
                cx="7.5"
                cy="7.5"
                r=".5"
                fill="currentColor"
            />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}