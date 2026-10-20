export default function AdminMobileActionBar({ children, header = null, className = '' }) {
    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-30 hidden rounded-t-[16px] border border-b-0 border-[color:var(--color-border)] bg-white/95 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_36px_rgba(45,31,22,.12)] backdrop-blur max-lg:block ${className}`.trim()}
        >
            {header && <div className="mb-3 min-w-0">{header}</div>}
            <div className="flex min-w-0 w-full items-stretch gap-2 [&>.button]:min-w-0">
                {children}
            </div>
        </div>
    );
}
