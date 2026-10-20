import { useEffect, useRef } from 'react';
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
    error = '',
    returnFocusRef,
    fallbackFocusRef,
}) {
    const dialogRef = useRef(null);
    const cancelButtonRef = useRef(null);
    const previousFocusRef = useRef(null);
    usePageScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen) return undefined;

        previousFocusRef.current = returnFocusRef?.current ?? document.activeElement;
        const focusFrame = window.requestAnimationFrame(() => cancelButtonRef.current?.focus());

        return () => {
            window.cancelAnimationFrame(focusFrame);
            let returnTarget = returnFocusRef?.current;

            if (!returnTarget?.isConnected) returnTarget = fallbackFocusRef?.current;
            if (!returnTarget?.isConnected) returnTarget = previousFocusRef.current;
            if (!returnTarget?.isConnected) returnTarget = null;

            window.requestAnimationFrame(() => returnTarget?.focus());
        };
    }, [isOpen, fallbackFocusRef, returnFocusRef]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !isLoading) {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== 'Tab') return;

            const dialog = dialogRef.current;

            if (!dialog) return;

            const focusableElements = [...dialog.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')];
            const firstElement = focusableElements[0];
            const lastElement = focusableElements.at(-1);

            if (event.shiftKey && (document.activeElement === firstElement || !dialog.contains(document.activeElement))) {
                event.preventDefault();
                lastElement?.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isLoading, isOpen, onClose]);

    if (!isOpen) return null;

    const confirmButtonClass = variant === 'danger'
        ? 'button border-[#b7483f] bg-[#b7483f] text-white hover:bg-[#9f3e36] disabled:opacity-50'
        : 'button button--primary disabled:opacity-50';

    return (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
            if (!isLoading) onClose(event);
        }}>
            <div ref={dialogRef} className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" aria-busy={isLoading} onMouseDown={(event) => event.stopPropagation()}>
                <h2 id="confirm-modal-title" className="m-0 text-xl font-bold">{title}</h2>
                <p className="my-4 text-sm text-[color:var(--color-secondary)]">{message}</p>
                {error && <p className="mb-4 mt-0 text-xs text-red-600" role="alert">{error}</p>}
                <div className="flex justify-end gap-2">
                    <button ref={cancelButtonRef} className="button button--secondary" type="button" onClick={onClose} disabled={isLoading}>{cancelText}</button>
                    <button className={confirmButtonClass} type="button" onClick={onConfirm} disabled={isLoading}>{isLoading ? `${confirmText}…` : confirmText}</button>
                </div>
            </div>
        </div>
    );
}
