export default function AdminCard({
    sectionRef,
    id,
    title,
    icon: Icon,
    required = false,
    requiredLabel = 'Обязательно',
    children,
    className = '',
    bodyClassName = 'p-[15px_17px_17px] max-sm:p-[13px]',
    sectionProps = {},
}) {
    return (
        <section
            ref={sectionRef}
            id={id}
            className={`scroll-mt-[58px] rounded-[14px] border border-[color:var(--color-border)] bg-white shadow-[0_7px_24px_rgba(70,47,31,.03)] ${className}`}
            {...sectionProps}
        >
            <header className="flex min-h-[48px] items-center gap-[9px] border-b border-[#f0ece8] px-[17px]">
                {Icon && (
                    <span className="accordion__icon [&_svg]:h-[14px] [&_svg]:w-[14px]">
                        <Icon />
                    </span>
                )}
                <h2 className="text-[15px] font-[740]">{title}</h2>
                {required && (
                    <em className="rounded-full bg-[color:var(--color-success-soft)] px-[7px] py-1 text-[11px] font-[720] not-italic text-[color:var(--color-success)]">
                        {requiredLabel}
                    </em>
                )}
            </header>
            <div className={bodyClassName}>{children}</div>
        </section>
    );
}
