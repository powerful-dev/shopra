export default function PaymentPage() {
    const paymentMethods = [
        {
            code: 'IBAN',
            title: 'Оплата на реквизиты ФОП',
            description:
                'Без API и комиссии сервиса. Реквизиты приходят покупателю на почту.',
            info: 'Ручная проверка оплаты',
            variant: 'iban',
            recommended: true,
        },
        {
            code: 'LQ',
            title: 'LiqPay',
            description:
                'Оплата картой, Apple Pay и Google Pay на странице оплаты.',
            info: 'Public key + Private key',
            variant: 'liqpay',
        },
        {
            code: 'W',
            title: 'WayForPay',
            description:
                'Карты, электронные кошельки и другие способы онлайн-оплаты.',
            info: 'Merchant Account + Secret Key',
            variant: 'wayforpay',
        },
        {
            code: 'mono',
            title: 'plata by mono',
            description:
                'Интернет-эквайринг mono с автоматическим статусом платежа.',
            info: 'API-токен',
            variant: 'mono',
        },
    ];

    return (
        <>
            <section className="mb-5 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div>
                        <p className="text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)] max-lg:hidden">
                            Настройки магазина
                        </p>

                        <h1 className="m-0 text-[32px] font-[760] tracking-[-.05em] max-lg:text-[19px]">
                            Оплата
                        </h1>

                        <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">
                            Включите готовую службу без ключей — покупатель укажет город,
                            отделение или адрес, а вы увидите всё в заказе.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-[10px] rounded-[12px] border border-[#ead8ca] bg-[#fff8f3] p-3">
                    <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-white text-[color:var(--color-accent)]">
                        <CardIcon />
                    </span>

                    <p className="m-0 max-sm:hidden">
                        <small className="block text-[11px]">
                            Обязательная настройка
                        </small>

                        <strong className="text-[12px]">
                            Добавьте способ оплаты
                        </strong>
                    </p>
                </div>
            </section>

            <section className="grid min-h-[65px] grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-[10px] rounded-[13px] border border-[#ead8cd] bg-[#fffaf6] p-[11px_14px] max-sm:grid-cols-[36px_minmax(0,1fr)]">
                <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-white text-[color:var(--color-accent)]">
                    <InfoIcon />
                </span>

                <p className="m-0 flex flex-col">
                    <strong className="text-[12px]">
                        Для запуска магазина нужен минимум один способ
                    </strong>

                    <small className="mt-[3px] text-[11px] text-[#8f867f]">
                        Самый простой — реквизиты ФОП. Онлайн-эквайринг можно
                        подключить позже.
                    </small>
                </p>

                <b className="rounded-full bg-[#fff0e7] px-[8px] py-[6px] text-[11px] text-[color:var(--color-accent)] max-sm:col-start-2 max-sm:justify-self-start">
                    Обязательно
                </b>
            </section>

            <section className="mt-[11px] rounded-[16px] border border-[color:var(--color-border)] bg-white p-[17px] shadow-[var(--shadow)]">
                <header className="mb-3 flex justify-between">
                    <div>
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Готовые способы
                        </p>

                        <h2 className="m-0 mt-1 text-[17px] font-bold">
                            Как покупатель сможет оплатить
                        </h2>
                    </div>

                    <span className="h-fit rounded-full bg-[#f3efec] px-2 py-1 text-[11px]">
                        0 активно
                    </span>
                </header>

                <div className="grid grid-cols-[minmax(0,1fr)_minmax(360px,.95fr)] gap-[11px] max-[980px]:grid-cols-1">
                    <div className="flex flex-col gap-2">
                        {paymentMethods.map((method) => (
                            <PaymentMethodCard
                                key={method.title}
                                {...method}
                            />
                        ))}
                    </div>

                    <IbanSettings />
                </div>
            </section>

            <CustomerEmailPreview />

            <footer className="mb-8 mt-[11px] flex gap-2 rounded-[12px] border border-[#e7d2c4] bg-[#fff8f3] p-3">
                <svg
                    className="text-[color:var(--color-accent)]"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 18V6" />
                </svg>

                <p className="m-0 text-[11px]">
                    <strong className="block">
                        Shopra не хранит данные карт покупателей
                    </strong>

                    <small>
                        Онлайн-оплату обрабатывает выбранный платёжный сервис, а
                        в Shopra возвращается только статус платежа.
                    </small>
                </p>
            </footer>
        </>
    );
}

function PaymentMethodCard({
    code,
    title,
    description,
    info,
    variant,
    recommended = false,
}) {
    const codeClasses = {
        iban: 'bg-[linear-gradient(145deg,#d36425,#a94412)]',
        liqpay: 'bg-[#78bd2d]',
        wayforpay: 'bg-[#5065a8]',
        mono: 'bg-[#171717]',
    };

    return (
        <article
            className={[
                'overflow-hidden rounded-[13px] bg-white',
                recommended
                    ? 'border border-[#d9a98d] shadow-[0_0_0_2px_rgba(184,79,24,.045)]'
                    : 'border border-[color:var(--color-border)]',
            ].join(' ')}
        >
            <div
                className={[
                    'grid min-h-[86px] w-full items-center gap-[11px] p-3',
                    recommended
                        ? 'grid-cols-[46px_minmax(0,1fr)_auto_17px] bg-[linear-gradient(105deg,#fffaf6,#fff)] max-sm:grid-cols-[46px_minmax(0,1fr)_17px]'
                        : 'grid-cols-[46px_minmax(0,1fr)_17px] bg-white',
                ].join(' ')}
            >
                <b
                    className={`grid h-[46px] place-items-center rounded-[12px] text-[11px] text-white ${codeClasses[variant]}`}
                >
                    {code}
                </b>

                <p className="m-0">
                    <strong className="block text-[13px]">
                        {title}
                    </strong>

                    <small className="text-[12px] text-[#8f8780]">
                        {description}
                    </small>
                </p>

                {recommended && (
                    <em className="h-fit whitespace-nowrap rounded-full bg-[#eaf6ec] px-[6px] py-1 text-[11px] not-italic font-extrabold uppercase tracking-[.04em] text-[#438254] max-sm:col-start-2 max-sm:row-start-2 max-sm:justify-self-start">
                        Самый простой
                    </em>
                )}

                <ChevronIcon
                    className={
                        recommended
                            ? 'max-sm:col-start-3 max-sm:row-start-1'
                            : ''
                    }
                />
            </div>

            <div className="flex min-h-[42px] w-full items-center gap-[6px] border-t border-[#f0ece8] bg-[#fcfaf8] px-[11px] py-[7px] text-[11px] max-sm:flex-wrap">
                <span className="inline-flex items-center gap-1">
                    {recommended && <MailIcon width={12} height={12} />}
                    {info}
                </span>

                <b className="ml-auto text-[#948b84]">
                    Не настроено
                </b>

                <label className="switch">
                    <input
                        className="switch__input"
                        type="checkbox"
                    />
                    <span className="switch__track" />
                </label>
            </div>
        </article>
    );
}

function IbanSettings() {
    return (
        <aside className="overflow-hidden rounded-[13px] border border-[color:var(--color-border)] bg-[#faf8f6]">
            <header className="grid grid-cols-[48px_1fr_auto] items-center gap-2 border-b bg-white p-3">
                <b className="grid h-12 place-items-center rounded-[12px] bg-[#fff0e7] text-[11px] text-[color:var(--color-accent)]">
                    IBAN
                </b>

                <div>
                    <p className="m-0 text-[10px] font-bold uppercase text-[color:var(--color-accent)]">
                        Настройка способа
                    </p>

                    <h3 className="m-0 text-[14px]">
                        Оплата на реквизиты ФОП
                    </h3>
                </div>

                <em className="rounded-full bg-[#f1eeeb] px-2 py-1 text-[11px] not-italic">
                    Выключен
                </em>
            </header>

            <div className="bg-white p-3">
                <div className="flex items-center gap-2 rounded-[9px] border border-[#d9eadb] bg-[#f4fbf5] p-[9px]">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-white text-[#438254]">
                        <BankIcon />
                    </span>

                    <p className="m-0 flex flex-col">
                        <strong className="text-[12px]">
                            Без ключей и платёжного сервиса
                        </strong>

                        <small className="mt-0.5 text-[11px] leading-[1.35] text-[#778279]">
                            Shopra только передаст покупателю ваши реквизиты.
                            Оплату вы проверяете в банке и отмечаете вручную.
                        </small>
                    </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                    <PaymentField
                        className="col-span-full"
                        label="Получатель — ФОП или компания *"
                        placeholder="Например, ФОП Панасенко Вадим"
                    />

                    <PaymentField
                        className="col-span-full"
                        label="IBAN *"
                        placeholder="UA00 0000 0000 0000 0000 0000 000"
                    />

                    <PaymentField
                        label="ИНН / ЕДРПОУ *"
                        placeholder="Код получателя"
                    />

                    <PaymentField
                        label="Название банка"
                        placeholder="Например, АТ КБ ПриватБанк"
                    />

                    <label className="col-span-full text-[11px] font-bold">
                        Назначение платежа *

                        <input
                            className="mt-1 h-[39px] w-full rounded-[9px] border border-[#d8d0ca] px-2 font-normal"
                            defaultValue="Оплата заказа №{order_number}"
                        />

                        <small className="font-normal text-[#928981]">
                            Переменная {'{order_number}'} автоматически заменится
                            номером заказа.
                        </small>
                    </label>
                </div>

                <div className="mt-[10px] grid grid-cols-2 gap-[7px] max-sm:grid-cols-1">
                    <PaymentSwitchOption
                        title="Отправлять на почту"
                        description="Сразу после оформления заказа"
                        icon={<MailIcon />}
                    />

                    <PaymentSwitchOption
                        title="Показывать после заказа"
                        description="На странице «Заказ принят»"
                        icon={<ReceiptIcon />}
                    />
                </div>
            </div>

            <footer className="flex justify-end border-t bg-white p-3">
                <button
                    type="button"
                    className="rounded-[9px] border-0 bg-[color:var(--color-accent)] px-4 py-2 text-[12px] font-bold text-white"
                >
                    Сохранить и включить
                </button>
            </footer>
        </aside>
    );
}

function PaymentField({
    label,
    placeholder,
    className = '',
}) {
    return (
        <label className={`${className} text-[11px] font-bold`}>
            {label}

            <input
                className="mt-1 h-[39px] w-full rounded-[9px] border border-[#d8d0ca] px-2 font-normal"
                placeholder={placeholder}
            />
        </label>
    );
}

function PaymentSwitchOption({
    title,
    description,
    icon,
}) {
    return (
        <div className="grid min-h-[58px] grid-cols-[36px_minmax(0,1fr)_18px] items-center gap-[7px] rounded-[9px] border border-[color:var(--color-border)] bg-[#fcfaf8] p-2">
            <label className="switch switch--success">
                <input
                    className="switch__input"
                    type="checkbox"
                    defaultChecked
                />
                <span className="switch__track" />
            </label>

            <p className="m-0 flex flex-col">
                <strong className="text-[11px]">
                    {title}
                </strong>

                <small className="mt-0.5 text-[11px] text-[#938a83]">
                    {description}
                </small>
            </p>

            <span className="text-[#aaa19a]">
                {icon}
            </span>
        </div>
    );
}

function CustomerEmailPreview() {
    return (
        <section className="mt-[11px] rounded-[15px] border border-[color:var(--color-border)] bg-white p-4 shadow-[var(--shadow)]">
            <header className="mb-3 grid grid-cols-[39px_minmax(0,1fr)_auto] items-center gap-[9px] max-sm:grid-cols-[39px_minmax(0,1fr)]">
                <span className="grid h-[39px] w-[39px] place-items-center rounded-[10px] bg-[#f9eee7] text-[color:var(--color-accent)]">
                    <MailIcon width={18} height={18} />
                </span>

                <div>
                    <p className="m-0 text-[11px] font-bold uppercase text-[color:var(--color-accent)]">
                        Письмо покупателю
                    </p>

                    <h2 className="m-0 mt-0.5 text-[15px]">
                        Как придут реквизиты
                    </h2>
                </div>

                <button
                    type="button"
                    className="inline-flex min-h-[33px] items-center gap-1 justify-self-end rounded-[8px] border bg-white px-[9px] text-[11px] font-bold max-sm:col-start-2 max-sm:justify-self-start"
                >
                    <CopyIcon />
                    Копировать текст
                </button>
            </header>

            <div className="mx-auto max-w-[670px] overflow-hidden rounded-[12px] border border-[#e7e1dc] bg-[#fcfbfa] shadow-[0_8px_24px_rgba(58,40,28,.05)]">
                <div className="flex items-center gap-2 border-b border-[#ebe6e2] bg-[#f7f4f2] p-[10px_12px]">
                    <span className="grid h-[31px] w-[31px] place-items-center rounded-[8px] bg-white text-[color:var(--color-accent)]">
                        <BuildingIcon />
                    </span>

                    <p className="m-0 flex min-w-0 flex-col">
                        <small className="text-[11px] text-[#938a83]">
                            Тема письма
                        </small>

                        <strong className="mt-0.5 truncate text-[11px]">
                            Реквизиты для оплаты заказа №{'{order_number}'}
                        </strong>
                    </p>
                </div>

                <div className="p-[13px] text-[11px] leading-[1.5] text-[#6e655e]">
                    <p>
                        Здравствуйте! Ваш заказ <strong>№1048</strong> принят.
                    </p>

                    <p>
                        Для оплаты используйте реквизиты:
                    </p>

                    <dl className="m-0 overflow-hidden rounded-[9px] border border-[#ece7e3] bg-white">
                        <PaymentDetail
                            label="Получатель"
                            value="ФОП / компания"
                        />

                        <PaymentDetail
                            label="IBAN"
                            value="UA•• •••• •••• •••• •••• •••• •••"
                        />

                        <PaymentDetail
                            label="ИНН / ЕДРПОУ"
                            value="••••••••••"
                        />

                        <PaymentDetail
                            label="Назначение"
                            value="Оплата заказа №1048"
                            last
                        />
                    </dl>

                    <p className="mb-0 mt-[9px] rounded-[7px] bg-[#fff8f3] p-2 text-[#7a7068]">
                        После оплаты ответьте на это письмо или дождитесь
                        подтверждения магазина.
                    </p>
                </div>
            </div>
        </section>
    );
}

function PaymentDetail({
    label,
    value,
    last = false,
}) {
    return (
        <div
            className={[
                'grid grid-cols-[105px_1fr] gap-[10px] p-[7px_9px]',
                last ? '' : 'border-b border-[#f0ece8]',
            ].join(' ')}
        >
            <dt className="text-[#968d86]">
                {label}
            </dt>

            <dd className="m-0 text-right font-bold">
                {value}
            </dd>
        </div>
    );
}

function CardIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}

function ChevronIcon({ className = '' }) {
    return (
        <svg
            className={className}
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

function MailIcon({
    width = 16,
    height = 16,
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
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function BankIcon() {
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
            <line x1="3" x2="21" y1="22" y2="22" />
            <line x1="6" x2="6" y1="18" y2="11" />
            <line x1="10" x2="10" y1="18" y2="11" />
            <line x1="14" x2="14" y1="18" y2="11" />
            <line x1="18" x2="18" y1="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
        </svg>
    );
}

function ReceiptIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
            <path d="M14 8H8" />
            <path d="M16 12H8" />
            <path d="M13 16H8" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect width="14" height="14" x="8" y="8" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    );
}

function BuildingIcon() {
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
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    );
}