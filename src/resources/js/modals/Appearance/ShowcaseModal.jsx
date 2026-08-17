export default function ShowcaseModal({onClose}) {
    const products = [
        {
            name: 'Сумка Moss',
            price: '3 290 ₴',
            previewClassName: 'from-[#87947b] to-[#c5c7b3]',
        },
        {
            name: 'Рюкзак Bruno',
            price: '4 890 ₴',
            previewClassName: 'from-[#8b502d] to-[#d5a575]',
        },
        {
            name: 'Кошелёк Mini',
            price: '1 290 ₴',
            previewClassName: 'from-[#653b3b] to-[#b78884]',
        },
        {
            name: 'Сумка Terra',
            price: '3 790 ₴',
            previewClassName: 'from-[#a98b65] to-[#e3d1b7]',
        },
        {
            name: 'Портмоне Slate',
            price: '1 690 ₴',
            previewClassName: 'from-[#443027] to-[#b37550]',
        },
        {
            name: 'Клатч Ember',
            price: '2 490 ₴',
            previewClassName: 'from-[#443027] to-[#b37550]',
        },
        {
            name: 'Ремень Atlas',
            price: '1 490 ₴',
            previewClassName: 'from-[#443027] to-[#b37550]',
        },
        {
            name: 'Шопер Loft',
            price: '3 590 ₴',
            previewClassName: 'from-[#443027] to-[#b37550]',
        },
    ];

    return (
        <div
            id="showcase-modal"
            className="modal-overlay"
            role="presentation"
        >
            <section
                className="modal-dialog flex !w-[min(760px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="showcase-modal-title"
            >
                <header className="flex min-h-[82px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[17px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Внешний вид магазина
                        </small>

                        <h2
                            id="showcase-modal-title"
                            className="m-0 text-[22px] font-[760] tracking-[-.035em]"
                        >
                            Витрина
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть настройки витрины"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-[13px] overflow-y-auto px-[23px] py-[21px] max-sm:px-4 max-sm:py-4">
                    <section className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]">
                        <h3 className="m-0 text-[13px] font-bold">
                            Заголовок витрины
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Тексты сразу обновляются в предпросмотре магазина.
                        </p>

                        <div className="grid grid-cols-2 gap-[11px] max-sm:grid-cols-1">
                            <label className="form-field">
                                <span className="form-label">
                                    Надзаголовок
                                </span>

                                <input
                                    className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                                    type="text"
                                    defaultValue="Выбор покупателей"
                                />
                            </label>

                            <label className="form-field">
                                <span className="form-label">
                                    Текст ссылки
                                </span>

                                <input
                                    className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                                    type="text"
                                    defaultValue="Смотреть все"
                                />
                            </label>
                        </div>

                        <label className="form-field mt-[11px]">
                            <span className="form-label">
                                Основной заголовок
                            </span>

                            <input
                                className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                                type="text"
                                defaultValue="Популярные товары"
                            />
                        </label>
                    </section>

                    <section
                        className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]"
                        data-selection-group
                    >
                        <h3 className="m-0 text-[13px] font-bold">
                            Что показать
                        </h3>

                        <div className="mt-[11px] grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                            <ShowTypeOption
                                selected
                                icon={<ProductsIcon />}
                                title="Товары"
                                description="Выбрать отдельные товары"
                            />

                            <ShowTypeOption
                                icon={<CategoriesIcon />}
                                title="Категории"
                                description="Показать разделы каталога"
                            />
                        </div>
                    </section>

                    <section className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]">
                        <h3 className="m-0 text-[13px] font-bold">
                            Выбранные товары
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Перетяните строки мышкой, чтобы изменить их порядок в витрине.
                        </p>

                        <label className="form-control-group flex h-[37px] items-center gap-[7px] rounded-[8px] bg-white px-[10px]">
                            <SearchIcon />

                            <input
                                className="form-control h-full text-[11px]"
                                type="search"
                                placeholder="Найти товар…"
                            />
                        </label>

                        <div
                            className="mt-[11px] flex flex-col gap-1.5 [&>div]:flex [&>div]:min-h-[41px] [&>div]:items-center [&>div]:gap-[9px] [&>div]:rounded-[8px] [&>div]:border [&>div]:border-[color:var(--color-border)] [&>div]:bg-white [&>div]:px-[9px] [&>div]:py-[5px] [&>div]:text-[#716961] [&>div>span]:flex [&>div>span]:min-w-0 [&>div>span]:flex-1 [&>div>span]:flex-col [&_b]:text-[12px] [&_b]:text-[#4d4640] [&_small]:mt-0.5 [&_small]:text-[11px]"
                            data-sortable-list
                        >
                            {products.map((product) => (
                                <ProductRow
                                    key={product.name}
                                    {...product}
                                />
                            ))}
                        </div>
                    </section>

                    <section
                        className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]"
                        data-selection-group
                    >
                        <h3 className="m-0 text-[13px] font-bold">
                            Расположение
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Выбранный вариант сразу применяется к витрине.
                        </p>

                        <div className="grid grid-cols-3 gap-2 overflow-x-auto max-sm:grid-cols-[repeat(3,minmax(125px,1fr))]">
                            <LayoutOption
                                selected
                                label="Сетка 4"
                                preview={
                                    <i className="h-[39px] w-[75px] border-[5px] border-[#f8f5f2] bg-[repeating-linear-gradient(90deg,#b8ada4_0_14px,transparent_14px_18px)] shadow-[0_0_0_1px_#e0d9d3]" />
                                }
                            />

                            <LayoutOption
                                label="Смешанная"
                                preview={
                                    <i className="grid h-[39px] w-[75px] grid-cols-6 grid-rows-2 gap-1 border-[5px] border-[#f8f5f2] shadow-[0_0_0_1px_#e0d9d3]">
                                        <span className="col-span-3 bg-[#b8ada4]" />
                                        <span className="col-span-3 bg-[#b8ada4]" />
                                        <span className="col-span-2 bg-[#b8ada4]" />
                                        <span className="col-span-2 bg-[#b8ada4]" />
                                        <span className="col-span-2 bg-[#b8ada4]" />
                                    </i>
                                }
                            />

                            <LayoutOption
                                label="Карусель"
                                preview={
                                    <i className="h-[39px] w-[75px] border-[5px] border-[#f8f5f2] bg-[repeating-linear-gradient(90deg,#b8ada4_0_11px,transparent_11px_15px)] shadow-[0_0_0_1px_#e0d9d3]" />
                                }
                            />
                        </div>
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

function ShowTypeOption({
    selected = false,
    icon,
    title,
    description,
}) {
    return (
        <button
            type="button"
            className={[
                'flex min-h-[62px] items-center gap-[9px] rounded-[10px] border px-[11px] py-[9px] text-left',
                selected
                    ? 'border-[#d39a78] bg-[#fff3eb] text-[color:var(--color-accent)]'
                    : 'border-[color:var(--color-border)] bg-white',
            ].join(' ')}
            data-selection-option
            aria-pressed={selected}
        >
            {icon}

            <span className="flex flex-1 flex-col">
                <b className="text-[12px]">
                    {title}
                </b>

                <small className="mt-0.5 text-[11px] text-[color:var(--color-secondary)]">
                    {description}
                </small>
            </span>

            <CheckIcon className={selected ? '' : 'hidden'} />
        </button>
    );
}

function ProductRow({
    name,
    price,
    previewClassName,
}) {
    return (
        <div>
            <button
                type="button"
                className="grid h-[30px] w-7 shrink-0 cursor-grab place-items-center rounded-md border-0 bg-transparent p-0 text-[#81776f]"
                aria-label={`Перетащить ${name}`}
            >
                <GripIcon />
            </button>

            <i
                className={`h-[29px] w-10 shrink-0 rounded-[5px] bg-gradient-to-br ${previewClassName}`}
            />

            <span>
                <b>{name}</b>
                <small>{price}</small>
            </span>

            <CheckIcon />
        </div>
    );
}

function LayoutOption({
    selected = false,
    label,
    preview,
}) {
    return (
        <button
            type="button"
            className={[
                'flex min-h-[82px] flex-col items-center justify-center gap-[7px] rounded-[9px] border text-[11px] font-bold',
                selected
                    ? 'border-[#d39a78] bg-[#fff3eb] text-[color:var(--color-accent)]'
                    : 'border-[color:var(--color-border)] bg-white',
            ].join(' ')}
            data-selection-option
            aria-pressed={selected}
        >
            {preview}
            {label}
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

function ProductsIcon() {
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
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}

function CategoriesIcon() {
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
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            className="shrink-0 text-[color:var(--color-secondary)]"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function GripIcon() {
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
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
        </svg>
    );
}

function CheckIcon({ className = '' }) {
    return (
        <svg
            className={className}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m20 6-11 11-5-5" />
        </svg>
    );
}