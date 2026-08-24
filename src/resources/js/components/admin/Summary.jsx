export default function Summary({
    icon,
    children,
    onClick,
    active = false,
    className = '',
    iconClassName = '',
    contentClassName = '',
}) {
    const Component = onClick ? 'button' : 'article';
    const interactiveProps = onClick
        ? { type: 'button', onClick, 'aria-pressed': active }
        : {};

    return (
        <Component
            {...interactiveProps}
            className={`flex min-h-[102px] items-center gap-3 rounded-[14px] border bg-[rgba(255,255,255,.92)] p-3.5 text-left shadow-[0_8px_26px_rgba(70,47,31,.035)] max-sm:min-h-[92px] max-sm:gap-2 max-sm:px-[9px] max-sm:py-[11px] cursor-pointer ${className} ${active ? '!border-[color:var(--color-accent)] ring-2 ring-[rgba(184,79,24,.1)]' : ''}`}
        >
            <span className={`grid h-10 w-10 flex-none place-items-center rounded-[11px] max-sm:h-[34px] max-sm:w-[34px] ${iconClassName}`}>
                {icon}
            </span>
            <div className={`grid min-w-0 flex-1 grid-cols-[1fr_auto] items-end ${contentClassName}`}>
                {children}
            </div>
        </Component>
    );
}
