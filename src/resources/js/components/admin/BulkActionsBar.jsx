const actionClasses = {
    danger: 'button min-h-[38px] border-[#e3b9b5] bg-[#fff5f4] text-[#b5443c] hover:border-[#cf8f89] hover:bg-[#fff0ef]',
    secondary: 'button button--secondary min-h-[38px]',
};

export default function BulkActionsBar({ selectedCount, countLabel, actions = [], className = '' }) {
    const resolvedCountLabel = typeof countLabel === 'function'
        ? countLabel(selectedCount)
        : countLabel;

    return (
        <div className={`flex min-h-[41px] w-full items-center gap-2.5 max-sm:flex-wrap ${className}`.trim()}>
            <strong className="mr-auto text-[13px] text-[#4f4741]" aria-live="polite">
                {resolvedCountLabel}
            </strong>
            {actions.map((action) => (
                <button
                    type="button"
                    className={actionClasses[action.variant] ?? actionClasses.secondary}
                    disabled={action.disabled}
                    onClick={action.onClick}
                    key={action.key ?? action.label}
                >
                    {action.icon}
                    {action.label}
                </button>
            ))}
        </div>
    );
}
