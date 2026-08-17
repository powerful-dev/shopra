export default function TopBannerModal({ onClose }) {
    return (
        <div
            id="top-banner-modal"
            className="modal-overlay"
            role="presentation"
        >
            <section
                className="modal-dialog flex !w-[min(760px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="top-banner-modal-title"
            >
                <header className="flex min-h-[82px] items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[17px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Внешний вид магазина
                        </small>

                        <h2
                            id="top-banner-modal-title"
                            className="m-0 text-[22px] font-[760] tracking-[-.035em]"
                        >
                            Верхний баннер
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть настройки верхнего баннера"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex flex-col gap-[13px] overflow-y-auto px-[23px] pb-[25px] pt-[21px] max-sm:px-4 max-sm:py-4">
                    <div className="flex min-h-[65px] items-center justify-between gap-4 rounded-[11px] border border-[color:var(--color-border)] bg-[#fcfbfa] px-[15px] py-3">
                        <div className="flex min-w-0 flex-col">
                            <b className="text-[12px]">
                                Показывать верхний баннер
                            </b>

                            <small className="mt-0.5 text-[11px] text-[color:var(--color-secondary)]">
                                Тонкая строка над шапкой
                            </small>
                        </div>

                        <label
                            className="switch"
                            aria-label="Показывать верхний баннер"
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
                            Текст баннера
                        </span>

                        <input
                            className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                            type="text"
                            defaultValue="Бесплатная доставка от 2 500 ₴"
                        />
                    </label>

                    <label className="form-field">
                        <span className="form-label">
                            Ссылка
                        </span>

                        <input
                            className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                            type="text"
                            defaultValue="/delivery"
                        />
                    </label>

                    <fieldset className="m-0 border-0 p-0">
                        <legend className="mb-[7px] text-[11px] font-[700] text-[#4f4842]">
                            Цвет фона баннера
                        </legend>

                        <div className="flex items-center gap-2">
                            <ColorOption
                                value="#22201e"
                                label="Тёмный"
                                className="bg-[#22201e]"
                                defaultChecked
                            />

                            <ColorOption
                                value="#b85a2b"
                                label="Медный"
                                className="bg-[#b85a2b]"
                            />

                            <ColorOption
                                value="#f1e7dc"
                                label="Светлый"
                                className="bg-[#f1e7dc]"
                            />

                            <label
                                className="grid h-[33px] w-[33px] cursor-pointer place-items-center rounded-full border-[3px] border-white bg-white text-[#716861] shadow-[0_0_0_1px_#d7d0ca]"
                                aria-label="Выбрать свой цвет"
                            >
                                <input
                                    type="color"
                                    defaultValue="#78331b"
                                    className="sr-only"
                                />

                                <PlusIcon />
                            </label>
                        </div>
                    </fieldset>
                </div>

                <footer className="flex min-h-[66px] items-center justify-end gap-2 border-t border-[color:var(--color-border)] bg-[#fcfbfa] px-[22px] py-[11px] max-sm:px-4">
                    <button
                        type="button"
                        className="min-h-[38px] rounded-[9px] border border-[#d8d0ca] bg-white px-[15px] text-[12px] font-[700]"
                        onClick={onClose}
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className="inline-flex min-h-[38px] items-center gap-[5px] rounded-[9px] border border-[color:var(--color-accent)] bg-[color:var(--color-accent)] px-[15px] text-[12px] font-[700] text-white"
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

function ColorOption({
    value,
    label,
    className,
    defaultChecked = false,
}) {
    return (
        <label
            className={[
                'relative h-[33px] w-[33px] cursor-pointer rounded-full border-[3px] border-white shadow-[0_0_0_1px_#d7d0ca]',
                className,
            ].join(' ')}
        >
            <input
                type="radio"
                name="top-banner-color"
                value={value}
                defaultChecked={defaultChecked}
                className="sr-only"
            />

            <span className="sr-only">
                {label}
            </span>
        </label>
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
        >
            <path d="M18 6 6 18M6 6l12 12" />
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
        >
            <path d="M5 12h14M12 5v14" />
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
            strokeLinecap="round"
        >
            <path d="m20 6-11 11-5-5" />
        </svg>
    );
}