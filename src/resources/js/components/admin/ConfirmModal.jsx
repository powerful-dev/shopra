import usePageScrollLock from '../../hooks/usePageScrollLock';

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    isLoading,
    onConfirm,
    onClose,
    variant,
}) {
    usePageScrollLock(isOpen);

    if (!isOpen) return null;

    const confirmButtonClass = variant === 'danger'
        ? 'button border-[#b7483f] bg-[#b7483f] text-white hover:bg-[#9f3e36] disabled:opacity-50'
        : 'button button--primary disabled:opacity-50';

    return (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
            <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" onMouseDown={(event) => event.stopPropagation()}>
                <h2 id="confirm-modal-title" className="m-0 text-xl font-bold">{title}</h2>
                <p className="my-4 text-sm text-[color:var(--color-secondary)]">{message}</p>
                <div className="flex justify-end gap-2">
                    <button className="button button--secondary" type="button" onClick={onClose}>{cancelText}</button>
                    <button className={confirmButtonClass} type="button" onClick={onConfirm} disabled={isLoading}>{isLoading ? `${confirmText}…` : confirmText}</button>
                </div>
            </div>
        </div>
    );
}
