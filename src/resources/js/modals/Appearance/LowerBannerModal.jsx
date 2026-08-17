export default function LowerBannerModal({onClose}) {
    return (
        <div
            id="lower-banner-modal"
            className="modal-overlay"
            role="presentation"
        >
            <section
                className="modal-dialog flex !w-[min(760px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="lower-banner-modal-title"
            >
                <header className="flex min-h-[82px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[17px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Внешний вид магазина
                        </small>

                        <h2
                            id="lower-banner-modal-title"
                            className="m-0 text-[22px] font-[760] tracking-[-.035em]"
                        >
                            Баннер
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть настройки нижнего баннера"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-[13px] overflow-y-auto px-[23px] py-[21px] max-sm:px-4 max-sm:py-4">
                    <section
                        className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]"
                        data-selection-group
                        data-selection-style="tabs"
                    >
                        <h3 className="m-0 text-[13px] font-bold">
                            Изображение или видео
                        </h3>

                        <div
                            className="my-[11px] grid grid-cols-2 gap-1 rounded-[9px] bg-[#efebe7] p-1"
                            role="tablist"
                        >
                            <button
                                type="button"
                                data-selection-option="lower-banner-image"
                                aria-pressed="true"
                                className="flex min-h-[33px] items-center justify-center gap-1.5 rounded-[7px] border-0 bg-white text-[11px] font-[650] text-[color:var(--color-accent)] shadow-[0_2px_7px_rgba(59,40,28,.08)]"
                            >
                                <ImageIcon />
                                Изображение
                            </button>

                            <button
                                type="button"
                                data-selection-option="lower-banner-video"
                                aria-pressed="false"
                                className="flex min-h-[33px] items-center justify-center gap-1.5 rounded-[7px] border-0 bg-transparent text-[11px] font-[650] text-[#746c66]"
                            >
                                <VideoIcon />
                                Видео
                            </button>
                        </div>

                        <div data-selection-panel="lower-banner-image">
                            <UploadField
                                accept="image/jpeg,image/png,image/webp"
                                icon={<ImageIcon width={19} height={19} />}
                                title="Загрузить изображение"
                                description="JPG, PNG или WEBP, до 10 МБ"
                            />
                        </div>

                        <div
                            data-selection-panel="lower-banner-video"
                            className="!hidden"
                            hidden
                        >
                            <UploadField
                                accept="video/mp4,video/webm"
                                icon={<VideoIcon width={19} height={19} />}
                                title="Загрузить видео"
                                description="MP4 или WebM, до 50 МБ"
                            />
                        </div>

                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#7c736c]">
                            <GripIcon width={14} height={14} />
                            Перетяните слайды, чтобы изменить порядок
                        </div>

                        <div className="mt-[11px] flex flex-col gap-1.5">
                            <SlideRow
                                title="Летняя коллекция"
                                type="Изображение"
                                previewClassName="bg-gradient-to-br from-[#443027] to-[#b37550]"
                            />

                            <SlideRow
                                title="Сумки для города"
                                type="Изображение"
                                previewClassName="bg-gradient-to-br from-[#6e725f] to-[#d0b38c]"
                            />

                            <SlideRow
                                title="Ручная работа"
                                type="Изображение"
                                previewClassName="bg-gradient-to-br from-[#32404b] to-[#9c7563]"
                            />
                        </div>

                        <button
                            type="button"
                            className="mt-[10px] inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-bold text-[color:var(--color-accent)]"
                        >
                            <PlusIcon />
                            Добавить слайд
                        </button>
                    </section>

                    <section
                        className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]"
                        data-selection-group
                    >
                        <h3 className="m-0 text-[13px] font-bold">
                            Цвет текста на баннере
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Подберите контрастный цвет заголовка и описания под загруженное изображение.
                        </p>

                        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                            <ColorOption
                                value="white"
                                label="Белый"
                                color="#ffffff"
                                selected
                                bordered
                            />

                            <ColorOption
                                value="milk"
                                label="Молочный"
                                color="#f4e7da"
                                bordered
                            />

                            <ColorOption
                                value="dark"
                                label="Тёмный"
                                color="#241d19"
                            />

                            <ColorOption
                                value="accent"
                                label="Акцентный"
                                color="#b85a2b"
                            />
                        </div>

                        <label
                            className="mt-2 flex min-h-[48px] cursor-pointer items-center gap-[10px] rounded-[9px] border border-[color:var(--color-border)] bg-white px-[10px]"
                            data-selection-option="custom"
                            aria-pressed="false"
                        >
                            <input
                                type="color"
                                defaultValue="#ffffff"
                                className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                            />

                            <span className="flex flex-1 flex-col">
                                <b className="text-[12px]">
                                    Свой цвет
                                </b>

                                <small className="mt-0.5 text-[11px] text-[color:var(--color-secondary)]">
                                    #FFFFFF
                                </small>
                            </span>

                            <CheckIcon className="hidden text-[color:var(--color-accent)]" />
                        </label>
                    </section>

                    <label className="form-field">
                        <span className="form-label">
                            Заголовок
                        </span>

                        <input
                            className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                            type="text"
                            defaultValue="Город. Дорога. Свобода."
                        />
                    </label>

                    <label className="form-field">
                        <span className="form-label">
                            Текст
                        </span>

                        <textarea
                            className="form-control min-h-[82px] resize-y rounded-[9px] px-3 py-2 text-[12px]"
                            rows={3}
                            defaultValue="Сумки и аксессуары ручной работы для города и путешествий."
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
                                defaultValue="Смотреть коллекцию"
                            />
                        </label>

                        <label className="form-field">
                            <span className="form-label">
                                Ссылка
                            </span>

                            <input
                                className="form-control h-[38px] rounded-[9px] px-3 text-[12px]"
                                type="text"
                                defaultValue="/catalog"
                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center gap-1 self-start border-0 bg-transparent p-0 text-[11px] font-bold text-[color:var(--color-accent)]"
                    >
                        <PlusIcon />
                        Добавить ещё кнопку
                    </button>
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

function UploadField({
    accept,
    icon,
    title,
    description,
}) {
    return (
        <label className="flex min-h-[62px] w-full cursor-pointer items-center gap-[10px] rounded-[9px] border border-dashed border-[#cfc4bb] bg-white px-[13px] py-[10px] text-[color:var(--color-accent)]">
            <input
                type="file"
                accept={accept}
                className="sr-only"
            />

            {icon}

            <span className="flex flex-col">
                <b className="text-[11px] text-[#514942]">
                    {title}
                </b>

                <small className="mt-0.5 text-[11px] text-[#968e87]">
                    {description}
                </small>
            </span>

            <UploadIcon />
        </label>
    );
}

function SlideRow({
    title,
    type,
    previewClassName,
}) {
    return (
        <div className="flex min-h-[41px] items-center gap-[9px] rounded-[8px] border border-[color:var(--color-border)] bg-white px-[9px] py-[5px]">
            <button
                type="button"
                className="grid h-[30px] w-7 shrink-0 cursor-grab place-items-center rounded-md border-0 bg-transparent p-0 text-[#81776f]"
                aria-label="Перетащить слайд"
            >
                <GripIcon />
            </button>

            <i
                className={`h-[29px] w-10 shrink-0 rounded-[5px] ${previewClassName}`}
            />

            <span className="flex min-w-0 flex-1 flex-col text-[12px] text-[#4d4640]">
                {title}

                <small className="mt-0.5 text-[11px] text-[color:var(--color-secondary)]">
                    {type}
                </small>
            </span>

            <button
                type="button"
                className="grid h-[30px] w-[30px] place-items-center rounded-md border-0 bg-transparent p-0 text-[#7d746d]"
                aria-label="Удалить слайд"
            >
                <TrashIcon />
            </button>
        </div>
    );
}

function ColorOption({
    value,
    label,
    color,
    selected = false,
    bordered = false,
}) {
    return (
        <button
            type="button"
            className={[
                'flex min-h-[42px] items-center gap-2 rounded-[9px] border px-[10px] text-left',
                selected
                    ? 'border-[#d39a78] bg-[#fff3eb] text-[color:var(--color-accent)]'
                    : 'border-[color:var(--color-border)] bg-white',
            ].join(' ')}
            data-selection-option={value}
            aria-pressed={selected}
        >
            <i
                className={[
                    'h-6 w-6 rounded-full',
                    bordered ? 'border border-[#d8d0ca]' : '',
                ].join(' ')}
                style={{ backgroundColor: color }}
            />

            <span className="flex-1 text-[12px] font-bold">
                {label}
            </span>

            <CheckIcon className={selected ? '' : 'hidden'} />
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

function ImageIcon({ width = 16, height = 16 }) {
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
            <rect
                width="18"
                height="18"
                x="3"
                y="3"
                rx="2"
                ry="2"
            />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    );
}

function VideoIcon({ width = 16, height = 16 }) {
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
            <path d="m16 13 5.223 3.482A.5.5 0 0 0 22 16.066V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
            <rect
                x="2"
                y="6"
                width="14"
                height="12"
                rx="2"
            />
        </svg>
    );
}

function UploadIcon() {
    return (
        <svg
            className="ml-auto"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}

function GripIcon({ width = 15, height = 15 }) {
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
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
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
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}

function CheckIcon({ className = '' }) {
    return (
        <svg
            className={className}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m20 6-11 11-5-5" />
        </svg>
    );
}