export default function FooterPageModal() {
    return (
        <div
            id="footer-page-modal"
            className="modal-overlay !z-[600]"
            role="presentation"
            hidden
        >
            <section
                className="modal-dialog flex !w-[min(960px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="footer-page-modal-title"
            >
                <header className="flex min-h-[76px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[15px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Страница магазина
                        </small>

                        <h2
                            id="footer-page-modal-title"
                            className="m-0 text-[19px] font-[760] tracking-[-.025em]"
                            data-page-modal-heading
                        >
                            Редактировать страницу
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть редактор страницы"
                        data-modal-close
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

                <div className="flex flex-col gap-[13px] overflow-y-auto px-[23px] py-[21px] max-sm:px-4 max-sm:py-4">
                    <label className="form-field">
                        <span className="form-label">
                            Название страницы
                        </span>

                        <input
                            className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                            type="text"
                            defaultValue="Доставка и оплата"
                            data-page-title-input
                        />
                    </label>

                    <div className="form-field min-w-0">
                        <span className="form-label">
                            Текст страницы
                        </span>

                        <textarea
                            name="footer_page_content"
                            data-page-editor
                        />
                    </div>

                    <small className="text-[11px] text-[color:var(--color-secondary)]">
                        Используйте панель редактора для оформления текста,
                        добавления ссылок и изображений.
                    </small>
                </div>

                <footer className="flex min-h-[66px] shrink-0 items-center justify-end gap-2 border-t border-[color:var(--color-border)] bg-[#fcfbfa] px-[22px] py-[11px] max-sm:px-4">
                    <button
                        type="button"
                        className="mr-auto inline-flex min-h-[38px] items-center gap-[5px] rounded-[9px] border border-[#dfc4b8] bg-white px-[15px] text-[12px] font-bold text-[#a53f1b]"
                    >
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
                            <line
                                x1="10"
                                x2="10"
                                y1="11"
                                y2="17"
                            />
                            <line
                                x1="14"
                                x2="14"
                                y1="11"
                                y2="17"
                            />
                        </svg>

                        Удалить страницу
                    </button>

                    <button
                        type="button"
                        className="min-h-[38px] rounded-[9px] border border-[#d8d0ca] bg-white px-[15px] text-[12px] font-bold"
                        data-modal-close
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className="inline-flex min-h-[38px] items-center gap-[5px] rounded-[9px] border border-[color:var(--color-accent)] bg-[color:var(--color-accent)] px-[15px] text-[12px] font-bold text-white"
                        data-page-editor-save
                        data-modal-close
                    >
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
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>

                        Сохранить изменения
                    </button>
                </footer>
            </section>
        </div>
    );
}