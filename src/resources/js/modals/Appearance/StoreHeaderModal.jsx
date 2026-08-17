export default function StoreHeaderModal({ onClose }) {
    const mobileItems = [
        {
            title: 'Поиск',
            icon: <SearchIcon />,
            disableUp: true,
        },
        {
            title: 'Кабинет',
            icon: <UserIcon />,
        },
        {
            title: 'Корзина',
            icon: <BagIcon />,
        },
        {
            title: 'Меню',
            icon: <MenuIcon />,
            disableDown: true,
        },
    ];

    const menuItems = [
        'Каталог',
        'Новинки',
        'Сумки',
        'Рюкзаки',
        'Аксессуары',
    ];

    return (
        <div
            id="store-header-modal"
            className="modal-overlay"
            role="presentation"
        >
            <section
                className="modal-dialog flex !w-[min(760px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="store-header-modal-title"
            >
                <header className="flex min-h-[82px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[17px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Внешний вид магазина
                        </small>

                        <h2
                            id="store-header-modal-title"
                            className="m-0 text-[22px] font-[760] tracking-[-.035em]"
                        >
                            Шапка магазина
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть настройки шапки"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-[13px] overflow-y-auto px-[23px] py-[21px] max-sm:px-4 max-sm:py-4">
                    <section
                        className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]"
                        data-selection-group
                    >
                        <h3 className="m-0 text-[13px] font-bold">
                            Расположение элементов
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Выберите готовую структуру шапки — изменения сразу видны в магазине.
                        </p>

                        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                            <HeaderLayoutOption
                                value="left"
                                label="Логотип слева"
                                selected
                            />

                            <HeaderLayoutOption
                                value="center"
                                label="Логотип по центру"
                            />
                        </div>
                    </section>

                    <section
                        className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]"
                        data-selection-group
                        data-selection-style="tabs"
                    >
                        <h3 className="m-0 text-[13px] font-bold">
                            Логотип
                        </h3>

                        <div
                            className="mt-[11px] grid grid-cols-2 gap-1 rounded-[9px] bg-[#efebe7] p-1"
                            role="tablist"
                        >
                            <button
                                type="button"
                                data-selection-option="text"
                                aria-pressed="true"
                                className="min-h-[33px] rounded-[7px] border-0 bg-white text-[11px] font-[650] text-[color:var(--color-accent)] shadow-[0_2px_7px_rgba(59,40,28,.08)]"
                            >
                                Надпись
                            </button>

                            <button
                                type="button"
                                data-selection-option="image"
                                aria-pressed="false"
                                className="min-h-[33px] rounded-[7px] border-0 bg-transparent text-[11px] font-[650] text-[#746c66]"
                            >
                                Изображение
                            </button>
                        </div>

                        <div
                            data-selection-panel="text"
                            className="mt-[11px]"
                        >
                            <label className="form-field">
                                <span className="form-label">
                                    Название магазина
                                </span>

                                <input
                                    className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                                    defaultValue="ATELIER No. 7"
                                />
                            </label>
                        </div>

                        <div
                            data-selection-panel="image"
                            className="!hidden mt-[11px]"
                            hidden
                        >
                            <label className="flex min-h-[62px] w-full cursor-pointer items-center gap-[10px] rounded-[9px] border border-dashed border-[#cfc4bb] bg-white px-[13px] py-[10px] text-left text-[color:var(--color-accent)]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                />

                                <UploadLogoIcon />

                                <span className="flex flex-col">
                                    <b className="text-[11px] text-[#514942]">
                                        Загрузить логотип
                                    </b>

                                    <small className="mt-0.5 text-[11px] text-[#968e87]">
                                        PNG или SVG, до 5 МБ
                                    </small>
                                </span>
                            </label>
                        </div>
                    </section>

                    <section
                        className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]"
                        data-selection-group
                        data-selection-style="tabs"
                    >
                        <h3 className="m-0 text-[13px] font-bold">
                            Ширина поиска
                        </h3>

                        <p className="mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Поиск не обязан занимать всю свободную ширину шапки.
                        </p>

                        <div className="mt-[11px] grid grid-cols-4 gap-1 rounded-[9px] bg-[#efebe7] p-1 max-sm:grid-cols-2">
                            <SearchWidthOption
                                value="icon"
                                label="Иконка"
                            />

                            <SearchWidthOption
                                value="compact"
                                label="Компактный"
                                selected
                            />

                            <SearchWidthOption
                                value="medium"
                                label="Средний"
                            />

                            <SearchWidthOption
                                value="wide"
                                label="Широкий"
                            />
                        </div>
                    </section>

                    <div className="flex min-h-[65px] items-center justify-between rounded-[11px] border border-[color:var(--color-border)] bg-[#fcfbfa] px-[15px] py-3">
                        <div className="flex flex-col">
                            <b className="text-[12px]">
                                Показывать телефон
                            </b>

                            <small className="mt-0.5 text-[11px] text-[color:var(--color-secondary)]">
                                Справа от логотипа
                            </small>
                        </div>

                        <label
                            className="switch"
                            aria-label="Показывать телефон"
                        >
                            <input
                                className="switch__input"
                                type="checkbox"
                                defaultChecked
                            />
                            <span className="switch__track" />
                        </label>
                    </div>

                    <label className="form-field">
                        <span className="form-label">
                            Номер телефона
                        </span>

                        <input
                            className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                            defaultValue="+380 67 123 45 67"
                        />
                    </label>

                    <section className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]">
                        <h3 className="m-0 text-[13px] font-bold">
                            Мобильная шапка
                        </h3>

                        <p className="mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Перетаскивайте иконки, меняйте порядок или удаляйте ненужные.
                        </p>

                        <div className="ae-mobile-icons ae-sortable-list">
                            {mobileItems.map((item) => (
                                <MobileHeaderItem
                                    key={item.title}
                                    {...item}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]">
                        <h3 className="m-0 text-[13px] font-bold">
                            Навигация по каталогу
                        </h3>

                        <p className="mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Перетаскивайте разделы — порядок сразу изменится в шапке магазина.
                        </p>

                        <div className="ae-list ae-sortable-list ae-header-menu">
                            {menuItems.map((title, index) => (
                                <HeaderMenuItem
                                    key={title}
                                    title={title}
                                    disableUp={index === 0}
                                    disableDown={index === menuItems.length - 1}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            className="ae-addline"
                        >
                            <PlusIcon />
                            Добавить раздел каталога
                        </button>
                    </section>
                </div>

                <footer className="flex min-h-[66px] shrink-0 items-center justify-end gap-2 border-t border-[color:var(--color-border)] bg-[#fcfbfa] px-[22px] py-[11px] max-sm:px-4">
                    <button
                        type="button"
                        className="min-h-[38px] rounded-[9px] border border-[#d8d0ca] bg-white px-[15px] text-[12px] font-bold"
                        onClick={onClose}
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className="inline-flex min-h-[38px] items-center gap-[5px] rounded-[9px] border border-[color:var(--color-accent)] bg-[color:var(--color-accent)] px-[15px] text-[12px] font-bold text-white"
                        data-modal-close
                    >
                        <CheckIcon />
                        Готово
                    </button>
                </footer>
            </section>
        </div>
    );
}

function HeaderLayoutOption({
    value,
    label,
    selected = false,
}) {
    return (
        <button
            type="button"
            data-selection-option={value}
            aria-pressed={selected}
            className={[
                'relative flex min-h-[92px] flex-col justify-center gap-2 rounded-[10px] border p-[9px]',
                selected
                    ? 'border-[#d39a78] bg-[#fff3eb] text-[color:var(--color-accent)]'
                    : 'border-[color:var(--color-border)] bg-white text-[#554d47]',
            ].join(' ')}
        >
            <i className="relative flex h-10 items-center gap-[5px] rounded-md border border-[#e2dcd6] bg-[#faf8f6] p-[7px]">
                {value === 'left' ? (
                    <>
                        <span className="h-2 w-[28%] rounded-sm bg-[color:var(--color-accent)]" />
                        <span className="h-2 w-[42%] rounded-sm bg-[#c8bdb5]" />
                        <span className="ml-auto h-2 w-[18%] rounded-sm bg-[#7f756e]" />
                    </>
                ) : (
                    <>
                        <span className="h-2 w-[25%] rounded-sm bg-[#c8bdb5]" />
                        <span className="absolute left-1/2 h-2 w-[27%] -translate-x-1/2 rounded-sm bg-[color:var(--color-accent)]" />
                        <span className="ml-auto h-2 w-[18%] rounded-sm bg-[#7f756e]" />
                    </>
                )}
            </i>

            <b className="text-center text-[11px]">
                {label}
            </b>

            <span
                data-selection-check
                className={[
                    'absolute right-2 top-2 h-[18px] w-[18px] place-items-center rounded-full bg-[color:var(--color-accent)] text-white',
                    selected ? 'grid' : 'hidden',
                ].join(' ')}
            >
                <CheckIcon width={12} height={12} strokeWidth={2.5} />
            </span>
        </button>
    );
}

function SearchWidthOption({
    value,
    label,
    selected = false,
}) {
    return (
        <button
            type="button"
            data-selection-option={value}
            aria-pressed={selected}
            className={[
                'min-h-[34px] rounded-[7px] border-0 text-[11px] font-bold',
                selected
                    ? 'bg-white text-[color:var(--color-accent)] shadow-[0_2px_7px_rgba(59,40,28,.08)]'
                    : 'bg-transparent text-[#756c65]',
            ].join(' ')}
        >
            {label}
        </button>
    );
}

function MobileHeaderItem({
    title,
    icon,
    disableUp = false,
    disableDown = false,
}) {
    return (
        <div>
            <GripDotsIcon className="ae-mobile-grip" />

            {icon}

            <b>{title}</b>

            <span className="ae-mobile-icon-actions">
                <button
                    type="button"
                    disabled={disableUp}
                    aria-label={`Поднять ${title}`}
                >
                    <ArrowUpIcon />
                </button>

                <button
                    type="button"
                    disabled={disableDown}
                    aria-label={`Опустить ${title}`}
                >
                    <ArrowDownIcon />
                </button>

                <button
                    type="button"
                    aria-label={`Удалить ${title}`}
                >
                    <TrashIcon />
                </button>
            </span>
        </div>
    );
}

function HeaderMenuItem({
    title,
    disableUp = false,
    disableDown = false,
}) {
    return (
        <div>
            <GripIcon className="ae-drag-handle" />

            <span>{title}</span>

            <span className="ae-header-menu-actions">
                <button
                    type="button"
                    disabled={disableUp}
                >
                    <ArrowUpIcon />
                </button>

                <button
                    type="button"
                    disabled={disableDown}
                >
                    <ArrowDownIcon />
                </button>

                <button
                    type="button"
                    className="text-[#625a54]"
                >
                    •••
                </button>
            </span>
        </div>
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
        >
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}

function UploadLogoIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12 3v12m-4-4 4 4 4-4" />
            <path d="M5 21h14" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
    );
}

function BagIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function GripDotsIcon({ className = '' }) {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <circle cx="9" cy="5" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="19" r="1" />
        </svg>
    );
}

function GripIcon({ className = '' }) {
    return (
        <svg
            className={className}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
        </svg>
    );
}

function ArrowUpIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
        </svg>
    );
}

function ArrowDownIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M5 12h14M12 5v14" />
        </svg>
    );
}

function CheckIcon({
    width = 15,
    height = 15,
    strokeWidth = 2,
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
        >
            <path d="m20 6-11 11-5-5" />
        </svg>
    );
}