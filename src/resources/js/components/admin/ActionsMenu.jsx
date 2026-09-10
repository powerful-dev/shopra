import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import MoreIcon from '../icons/MoreIcon';

const DEFAULT_ACTION_CLASS = 'flex w-full items-center gap-2 whitespace-nowrap rounded-[10px] border-0 bg-transparent px-3 py-2 text-left text-[12px] text-[color:var(--color-primary)] hover:bg-[#f7f3f0]';
const DANGER_ACTION_CLASS = 'flex w-full items-center gap-2 whitespace-nowrap rounded-[10px] border-0 bg-transparent px-3 py-2 text-left text-[12px] text-[#b7483f] hover:bg-[#f7f3f0] disabled:cursor-not-allowed disabled:opacity-40';

const TRIGGER_CLASS = 'grid h-8 w-8 place-items-center rounded-lg border-0 bg-transparent text-[#756d67] hover:bg-[#f2ede9]';
const MENU_GAP = 8;

export default function ActionsMenu({ actions, isOpen, onToggle, onClose, ariaLabel, className = '' }) {
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const [placement, setPlacement] = useState('bottom');

    useLayoutEffect(() => {
        if (!isOpen) return undefined;

        const updatePlacement = () => {
            const trigger = triggerRef.current;
            const menu = menuRef.current;

            if (!trigger || !menu) return;

            const triggerRect = trigger.getBoundingClientRect();
            const availableBelow = window.innerHeight - triggerRect.bottom;
            const requiredSpace = menu.getBoundingClientRect().height + MENU_GAP;

            setPlacement(availableBelow >= requiredSpace ? 'bottom' : 'top');
        };

        updatePlacement();
        window.addEventListener('resize', updatePlacement);
        window.addEventListener('scroll', updatePlacement, true);

        return () => {
            window.removeEventListener('resize', updatePlacement);
            window.removeEventListener('scroll', updatePlacement, true);
        };
    }, [isOpen, actions.length]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleOutsideClick = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                onClose();
            }
        };

        // Capture also receives clicks inside dialogs that stop event bubbling.
        document.addEventListener('mousedown', handleOutsideClick, true);

        return () => document.removeEventListener('mousedown', handleOutsideClick, true);
    }, [isOpen, onClose]);

    const selectAction = (action) => {
        onClose();
        action.onClick?.();
    };

    return (
        <div ref={containerRef} className={`relative w-8 flex items-center ${className}`.trim()}>
            <button
                ref={triggerRef}
                className={TRIGGER_CLASS}
                type="button"
                aria-label={ariaLabel}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={onToggle}
            >
                <MoreIcon />
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={`absolute right-0 z-30 w-max min-w-[150px] max-w-[400px] rounded-2xl border border-[color:var(--color-border)] bg-white p-1.5 shadow-[var(--shadow-md)] ${placement === 'bottom' ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'}`}
                    role="menu"
                >
                    {actions.map((action) => (
                        <button
                            className={action.variant === 'danger' ? DANGER_ACTION_CLASS : DEFAULT_ACTION_CLASS}
                            type="button"
                            role="menuitem"
                            disabled={action.disabled}
                            onClick={() => selectAction(action)}
                            key={action.label}
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
