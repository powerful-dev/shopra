export default function DeliveryServiceCard({
    code,
    name,
    description,
    codeClassName,
    active = false,
    enabled = false,
    tags = [],
    mode = 'Ручной режим',
    onClick,
    onToggle,
}) {
    return (
        <article
            className={[
                'overflow-hidden rounded-[13px] border bg-white',
                active
                    ? 'border-[#d9a98d] shadow-[0_0_0_2px_rgba(184,79,24,.045)]'
                    : 'border-[color:var(--color-border)]',
            ].join(' ')}
        >
            <button
                type="button"
                onClick={onClick}
                className="grid min-h-[86px] w-full grid-cols-[46px_minmax(0,1fr)_20px] items-center gap-[11px] border-0 bg-transparent p-3 text-left"
            >
                <span
                    className={`grid h-[46px] w-[46px] place-items-center rounded-[12px] text-[12px] font-extrabold ${codeClassName}`}
                >
                    {code}
                </span>

                <p className="m-0 flex min-w-0 flex-col">
                    <strong className="text-[13px]">{name}</strong>

                    <small className="mt-1 text-[12px] leading-[1.45] text-[#8f8780]">
                        {description}
                    </small>
                </p>

                <span>›</span>
            </button>

            <div className="flex min-h-[42px] items-center gap-[6px] border-t border-[#f0ece8] bg-[#fcfaf8] px-[11px] py-[7px]">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-[7px] bg-white px-[7px] py-[5px] text-[11px]"
                    >
                        {tag}
                    </span>
                ))}

                <em
                    className={[
                        'ml-auto text-[11px] not-italic font-bold',
                        active ? 'text-[#438254]' : 'text-[#948b84]',
                    ].join(' ')}
                >
                    {active ? '✓ ' : ''}
                    {mode}
                </em>

                <label className="switch">
                    <input
                        className="switch__input"
                        type="checkbox"
                        checked={enabled}
                        onChange={(event) => onToggle?.(event.target.checked)}
                    />

                    <span className="switch__track" />
                </label>
            </div>
        </article>
    );
}