export default function FooterSettingsModal({ onClose }) {
    const footerPages = [
        'Доставка и оплата',
        'Возврат и обмен',
        'Договор оферты',
        'О нас',
        'Контакты',
        'Конфиденциальность',
    ];

    return (
        <div
            id="footer-settings-modal"
            className="modal-overlay"
            role="presentation"
        >
            <section
                className="modal-dialog flex !w-[min(760px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="footer-settings-modal-title"
            >
                <header className="flex min-h-[82px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[17px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Внешний вид магазина
                        </small>

                        <h2
                            id="footer-settings-modal-title"
                            className="m-0 text-[22px] font-[760] tracking-[-.035em]"
                        >
                            Нижняя часть сайта
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть настройки нижней части сайта"
                        onClick={onClose}
                    >
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
                    </button>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-[13px] overflow-y-auto px-[23px] py-[21px] max-sm:px-4 max-sm:py-4">
                    <section className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]">
                        <h3 className="m-0 text-[13px] font-bold">
                            Социальные сети
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Добавьте только те сети, которыми пользуется магазин.
                        </p>

                        <div className="grid grid-cols-[140px_1fr_36px] items-center gap-[7px] max-sm:grid-cols-[1fr_36px]">
                            <select
                                className="form-control h-[38px] rounded-[9px] px-3 text-[12px] max-sm:col-span-2"
                                aria-label="Социальная сеть"
                                defaultValue="Instagram"
                            >
                                <option>Instagram</option>
                                <option>Facebook</option>
                                <option>YouTube</option>
                                <option>TikTok</option>
                                <option>Telegram</option>
                                <option>Pinterest</option>
                            </select>

                            <input
                                className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                                type="text"
                                defaultValue="instagram.com/atelier7"
                                placeholder="Ссылка на профиль"
                                aria-label="Ссылка на профиль"
                            />

                            <button
                                type="button"
                                className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--color-border)] bg-white p-0 text-[#81786f] hover:border-[#c9b2a3] hover:text-[color:var(--color-accent)]"
                                aria-label="Удалить социальную сеть"
                            >
                                <TrashIcon />
                            </button>
                        </div>

                        <button
                            type="button"
                            className="mt-[11px] inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-dashed border-[#cbbdb2] bg-white px-[11px] text-[11px] font-bold text-[color:var(--color-accent)] hover:border-[#bda99a]"
                        >
                            <PlusIcon />
                            Добавить социальную сеть
                        </button>
                    </section>

                    <section className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]">
                        <h3 className="m-0 text-[13px] font-bold">
                            Страницы внизу сайта
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Создавайте обычные информационные страницы. Они появятся
                            только в футере и не будут перегружать шапку.
                        </p>

                        <div className="flex flex-col gap-[5px]">
                            {footerPages.map((title) => (
                                <FooterPageRow
                                    key={title}
                                    title={title}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            className="mt-[11px] inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-dashed border-[#cbbdb2] bg-white px-[11px] text-[11px] font-bold text-[color:var(--color-accent)] hover:border-[#bda99a]"
                        >
                            <PlusIcon />
                            Создать страницу
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

function FooterPageRow({ title }) {
    return (
        <div className="flex min-h-[41px] items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-white px-[9px] hover:border-[#c9b2a3] hover:bg-[#fffaf7]">
            <label
                className="grid shrink-0 cursor-pointer place-items-center"
                aria-label={`Показывать страницу ${title}`}
            >
                <input
                    className="checkbox-control"
                    type="checkbox"
                    defaultChecked
                />
            </label>

            <button
                type="button"
                className="flex min-w-0 flex-1 flex-col border-0 bg-transparent p-0 text-left"
                data-modal-trigger
                aria-controls="footer-page-modal"
                data-page-title={title}
            >
                <b className="truncate text-[11px]">
                    {title}
                </b>

                <small className="mt-px text-[11px] text-[color:var(--color-secondary)]">
                    Добавьте текст страницы
                </small>
            </button>

            <button
                type="button"
                className="grid h-[30px] w-[30px] place-items-center rounded-md border-0 bg-transparent p-0 text-[#857b73] hover:bg-[#f4eeea] hover:text-[color:var(--color-accent)]"
                aria-label={`Редактировать страницу ${title}`}
                data-modal-trigger
                aria-controls="footer-page-modal"
                data-page-title={title}
            >
                <PencilIcon />
            </button>

            <span className="grid h-[30px] w-[24px] cursor-grab place-items-center text-[#857b73]">
                <GripIcon />
            </span>
        </div>
    );
}

function TrashIcon() {
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
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}

function PencilIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
        </svg>
    );
}

function GripIcon() {
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
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
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