export default function DeliveryZone({
    title,
    description,
    enabled = false,
    tags = [],
    icon,
    iconClassName = '',
    onToggle,
}) {
    return (
        <div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-[9px] border-b border-[#eae5e1] p-[13px_12px]">
            <span
                className={`grid h-[38px] w-[38px] place-items-center rounded-[10px] ${iconClassName}`}
            >
                {icon}
            </span>

            <p className="m-0">
                <strong className="block text-[12px]">
                    {title}
                </strong>

                <small className="mt-[3px] block text-[11px] text-[#928981]">
                    {description}
                </small>
            </p>

            <label className="switch">
                <input
                    className="switch__input"
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) => onToggle?.(event.target.checked)}
                />

                <span className="switch__track" />
            </label>

            <div className="col-start-2 col-end-4 flex flex-wrap gap-[5px]">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-[7px] bg-white px-[7px] py-[5px] text-[11px]"
                    >
                        {enabled ? '✓ ' : ''}
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}