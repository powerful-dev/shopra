import { useState } from 'react';

export default function StyleElementsModal({ onClose }) {

    const [theme, setTheme] = useState('copper');
    const [shape, setShape] = useState('round');
    const [font, setFont] = useState('editorial');

    return (
        <div
            id="style-elements-modal"
            className="modal-overlay"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose?.();
                }
            }}
        >
            <section
                className="modal-dialog flex !w-[min(760px,100%)] flex-col bg-white"
                role="dialog"
                aria-modal="true"
                aria-labelledby="style-elements-modal-title"
            >
                <header className="flex min-h-[82px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-[22px] py-[17px] max-sm:px-4">
                    <div>
                        <small className="mb-[3px] block text-[11px] font-[750] uppercase tracking-[.08em] text-[color:var(--color-accent)]">
                            Внешний вид магазина
                        </small>

                        <h2
                            id="style-elements-modal-title"
                            className="m-0 text-[22px] font-[760] tracking-[-.035em]"
                        >
                            Цвета и стиль элементов
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-0 text-[#716861]"
                        aria-label="Закрыть настройки стиля"
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
                            Цветовая гамма
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Применяется к кнопкам, ссылкам и акцентам магазина.
                        </p>

                        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                            <ThemeOption
                                value="copper"
                                label="Тёплая кожа"
                                colors={['#22201e', '#b85a2b', '#f1e7dc']}
                                selected={theme === 'copper'}
                                onSelect={setTheme}
                            />

                            <ThemeOption
                                value="forest"
                                label="Лес"
                                colors={['#1d2921', '#58705d', '#e7ece7']}
                                selected={theme === 'forest'}
                                onSelect={setTheme}
                            />

                            <ThemeOption
                                value="navy"
                                label="Чернильный"
                                colors={['#172333', '#45627d', '#e5ebef']}
                                selected={theme === 'navy'}
                                onSelect={setTheme}
                            />

                            <ThemeOption
                                value="mono"
                                label="Графит"
                                colors={['#171717', '#686868', '#eeeeee']}
                                selected={theme === 'mono'}
                                onSelect={setTheme}
                            />

                            <ThemeOption
                                value="wine"
                                label="Бордо"
                                colors={['#2f2024', '#91465b', '#f1e5e8']}
                                selected={theme === 'wine'}
                                onSelect={setTheme}
                            />

                            <ThemeOption
                                value="sand"
                                label="Светлый песок"
                                colors={['#2b2823', '#a47a45', '#f3eadc']}
                                selected={theme === 'sand'}
                                onSelect={setTheme}
                            />

                            <ThemeOption
                                value="sea"
                                label="Морская"
                                colors={['#183032', '#2f7775', '#e2efee']}
                                selected={theme === 'sea'}
                                onSelect={setTheme}
                            />

                            <ThemeOption
                                value="plum"
                                label="Сливовая"
                                colors={['#2d2531', '#745d7c', '#ece6ef']}
                                selected={theme === 'plum'}
                                onSelect={setTheme}
                            />
                        </div>
                    </section>

                    <section className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]">
                        <h3 className="m-0 text-[13px] font-bold">
                            Форма элементов
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Единая форма для карточек, полей, баннеров и кнопок.
                        </p>

                        <div className="grid grid-cols-2 gap-[9px] max-sm:grid-cols-1">
                            <ShapeOption
                                value="round"
                                title="Скруглённые"
                                description="Мягкий современный вид"
                                selected={shape === 'round'}
                                onSelect={setShape}
                            />

                            <ShapeOption
                                value="straight"
                                title="Прямые"
                                description="Строгий редакционный вид"
                                selected={shape === 'straight'}
                                onSelect={setShape}
                            />
                        </div>
                    </section>

                    <section className="rounded-[13px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[17px]">
                        <h3 className="m-0 text-[13px] font-bold">
                            Стиль шрифтов
                        </h3>

                        <p className="mb-[13px] mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                            Каждый пресет сочетает выразительный шрифт заголовков
                            с хорошо читаемым основным текстом.
                        </p>

                        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                            <FontOption
                                value="modern"
                                title="Современный"
                                description="Manrope · Inter"
                                family="'Manrope', sans-serif"
                                selected={font === 'modern'}
                                onSelect={setFont}
                            />

                            <FontOption
                                value="editorial"
                                title="Редакционный"
                                description="Playfair Display · Inter"
                                family="'Playfair Display', serif"
                                selected={font === 'editorial'}
                                onSelect={setFont}
                            />

                            <FontOption
                                value="minimal"
                                title="Минимализм"
                                description="Montserrat · Open Sans"
                                family="'Montserrat', sans-serif"
                                selected={font === 'minimal'}
                                onSelect={setFont}
                            />

                            <FontOption
                                value="classic"
                                title="Классический"
                                description="Cormorant · Lato"
                                family="'Cormorant', serif"
                                selected={font === 'classic'}
                                onSelect={setFont}
                            />

                            <FontOption
                                value="soft"
                                title="Мягкий"
                                description="Nunito · Inter"
                                family="'Nunito', sans-serif"
                                selected={font === 'soft'}
                                onSelect={setFont}
                            />

                            <FontOption
                                value="geometric"
                                title="Геометричный"
                                description="Poppins · Source Sans"
                                family="'Poppins', sans-serif"
                                selected={font === 'geometric'}
                                onSelect={setFont}
                            />

                            <FontOption
                                value="elegant"
                                title="Элегантный"
                                description="Baskerville · Lato"
                                family="Baskerville, 'Libre Baskerville', serif"
                                selected={font === 'elegant'}
                                onSelect={setFont}
                            />

                            <FontOption
                                value="business"
                                title="Деловой"
                                description="Merriweather · Roboto"
                                family="'Merriweather', serif"
                                selected={font === 'business'}
                                onSelect={setFont}
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

function ThemeOption({
    value,
    label,
    colors,
    selected,
    onSelect,
}) {
    return (
        <button
            type="button"
            className={[
                'grid min-h-[58px] grid-cols-[auto_1fr_auto] items-center gap-[10px] rounded-[10px] border px-[11px] py-2 text-left',
                selected
                    ? 'border-[#d39a78] bg-[#fff3eb] text-[color:var(--color-accent)]'
                    : 'border-[color:var(--color-border)] bg-white',
            ].join(' ')}
            aria-pressed={selected}
            onClick={() => onSelect(value)}
        >
            <span className="flex">
                {colors.map((color, index) => (
                    <i
                        key={color}
                        className={[
                            'h-[23px] w-[23px] rounded-full border-2 border-white shadow-[0_0_0_1px_#ddd7d1]',
                            index > 0 ? '-ml-2' : '',
                        ].join(' ')}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </span>

            <b className="text-[12px]">
                {label}
            </b>

            {selected && <CheckIcon />}
        </button>
    );
}

function ShapeOption({
    value,
    title,
    description,
    selected,
    onSelect,
}) {
    return (
        <button
            type="button"
            className={[
                'relative grid min-h-[91px] grid-cols-[65px_1fr] grid-rows-2 items-end gap-x-[10px] rounded-[11px] border p-[11px] text-left',
                selected
                    ? 'border-[#d39a78] bg-[#fff3eb] text-[color:var(--color-accent)]'
                    : 'border-[color:var(--color-border)] bg-white',
            ].join(' ')}
            aria-pressed={selected}
            onClick={() => onSelect(value)}
        >
            <i
                className={[
                    'row-span-2 h-[65px] w-[65px] border border-[#ddd4cc] bg-[linear-gradient(#b85a2b_0_13px,transparent_13px_23px,#fff_23px)] shadow-[inset_0_0_0_11px_#f7f3ef]',
                    value === 'round' ? 'rounded-xl' : '',
                ].join(' ')}
            />

            <b className="text-[12px]">
                {title}
            </b>

            <small className="self-start text-[11px] text-[color:var(--color-secondary)]">
                {description}
            </small>

            {selected && (
                <span className="absolute right-2 top-2">
                    <CheckIcon />
                </span>
            )}
        </button>
    );
}

function FontOption({
    value,
    title,
    description,
    family,
    selected,
    onSelect,
}) {
    return (
        <button
            type="button"
            className={[
                'grid min-h-[68px] grid-cols-[48px_1fr_auto] items-center gap-[10px] rounded-[10px] border px-[11px] py-[9px] text-left',
                selected
                    ? 'border-[#d39a78] bg-[#fff3eb] text-[color:var(--color-accent)]'
                    : 'border-[color:var(--color-border)] bg-white',
            ].join(' ')}
            aria-pressed={selected}
            onClick={() => onSelect(value)}
        >
            <span
                className="grid h-[46px] w-[46px] place-items-center rounded-[9px] bg-[#f2eeea] text-[20px] text-[#453d37]"
                style={{ fontFamily: family }}
            >
                Aa
            </span>

            <span className="flex flex-col">
                <b className="text-[12px]">
                    {title}
                </b>

                <small className="mt-[3px] text-[11px] text-[color:var(--color-secondary)]">
                    {description}
                </small>
            </span>

            {selected && <CheckIcon />}
        </button>
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