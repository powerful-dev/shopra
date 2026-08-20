import { useEffect, useRef } from 'react';

const DEFAULT_ACTION_CLASS = 'flex w-full items-center gap-2 rounded-[10px] border-0 bg-transparent px-3 py-2 text-left text-[12px] text-[color:var(--color-primary)] hover:bg-[#f7f3f0]';
const DANGER_ACTION_CLASS = 'flex w-full items-center gap-2 rounded-[10px] border-0 bg-transparent px-3 py-2 text-left text-[12px] text-[#b7483f] hover:bg-[#f7f3f0] disabled:cursor-not-allowed disabled:opacity-40';

export default function ActionsMenu({ actions, onClose }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [onClose]);

    const selectAction = (action) => {
        onClose();
        action.onClick?.();
    };

    return (
        <div ref={menuRef} className="absolute right-0 bottom-[calc(100%+8px)] z-30 min-w-[150px] rounded-2xl border border-[color:var(--color-border)] bg-white p-1.5 shadow-[var(--shadow-md)]">
            {actions.map((action) => (
                <button
                    className={action.variant === 'danger' ? DANGER_ACTION_CLASS : DEFAULT_ACTION_CLASS}
                    type="button"
                    disabled={action.disabled}
                    onClick={() => selectAction(action)}
                    key={action.label}
                >
                    {action.icon}
                    {action.label}
                </button>
            ))}
        </div>
    );
}
