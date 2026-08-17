export default function HandmadeModal({onClose}) {
    return (
        <div
            id="handmade-modal"
            className="modal-overlay"
            role="presentation"
        >
            <section
                className="modal-dialog flex !w-[min(760px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="handmade-modal-title"
            >
                <header className="flex min-h-[82px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[17px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Внешний вид магазина
                        </small>

                        <h2
                            id="handmade-modal-title"
                            className="m-0 text-[22px] font-[760] tracking-[-.035em]"
                        >
                            Заголовок и текст
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть настройки текстового блока"
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

                <div className="flex flex-col gap-[13px] overflow-y-auto px-[23px] pb-[25px] pt-[21px] max-sm:px-4 max-sm:py-4">
                    <label className="form-field">
                        <span className="form-label">
                            Надзаголовок
                        </span>

                        <input
                            className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                            type="text"
                            defaultValue="Ручная работа"
                        />
                    </label>

                    <label className="form-field">
                        <span className="form-label">
                            Заголовок
                        </span>

                        <input
                            className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                            type="text"
                            defaultValue="Вещи, которые становятся только лучше со временем"
                        />
                    </label>

                    <label className="form-field">
                        <span className="form-label">
                            Текст
                        </span>

                        <textarea
                            className="form-control min-h-[116px] resize-y rounded-[9px] px-3 py-2 text-[12px]"
                            rows={5}
                            defaultValue="Мы работаем с натуральной кожей и собираем каждое изделие вручную — спокойно, точно и с вниманием к деталям."
                        />
                    </label>

                    <div className="grid grid-cols-2 gap-[11px] max-sm:grid-cols-1">
                        <label className="form-field">
                            <span className="form-label">
                                Текст кнопки
                            </span>

                            <input
                                className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                                type="text"
                                defaultValue="О мастерской"
                            />
                        </label>

                        <label className="form-field">
                            <span className="form-label">
                                Ссылка
                            </span>

                            <input
                                className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                                type="text"
                                defaultValue="/about"
                            />
                        </label>
                    </div>
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

                        Готово
                    </button>
                </footer>
            </section>
        </div>
    );
}