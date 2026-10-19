export default function AdminMobileActionBar({ children, className = '' }) {
    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-30 hidden border-t border-[color:var(--color-border)] bg-white/95 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur max-lg:block ${className}`.trim()}
        >
            <div className="flex min-w-0 w-full gap-2 [&>.button]:min-w-0">
                {children}
            </div>
        </div>
    );
}
