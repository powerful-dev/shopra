import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CheckIcon from '../icons/CheckIcon';
import SearchIcon from '../icons/SearchIcon';

const DROPDOWN_GAP = 7;
const DROPDOWN_MIN_WIDTH = 260;
const VIEWPORT_MARGIN = 14;

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = '',
    searchPlaceholder = '',
    emptyMessage = 'Нічого не знайдено',
    ariaLabel = placeholder,
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [dropdownStyle, setDropdownStyle] = useState(null);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const listboxId = useId();
    const selectedOption = options.find((option) => option.value === value);
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filteredOptions = useMemo(() => {
        if (!normalizedQuery) return options;

        return options.filter((option) => String(option.label).toLocaleLowerCase().includes(normalizedQuery));
    }, [normalizedQuery, options]);

    const close = (restoreFocus = false) => {
        setIsOpen(false);
        setQuery('');
        setDropdownStyle(null);
        if (restoreFocus) triggerRef.current?.focus();
    };

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleOutsideClick = (event) => {
            if (!rootRef.current?.contains(event.target) && !dropdownRef.current?.contains(event.target)) close();
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape') close(true);
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        searchRef.current?.focus();

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    useLayoutEffect(() => {
        if (!isOpen) return undefined;

        const updatePosition = () => {
            const trigger = triggerRef.current;
            const dropdown = dropdownRef.current;
            if (!trigger || !dropdown) return;

            const triggerRect = trigger.getBoundingClientRect();
            const maxWidth = Math.max(0, window.innerWidth - VIEWPORT_MARGIN * 2);
            const width = Math.min(Math.max(triggerRect.width, DROPDOWN_MIN_WIDTH), maxWidth);
            const maxLeft = Math.max(VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN);
            const left = Math.min(Math.max(triggerRect.left, VIEWPORT_MARGIN), maxLeft);
            const dropdownHeight = dropdown.offsetHeight;
            const spaceBelow = window.innerHeight - triggerRect.bottom - DROPDOWN_GAP;
            const spaceAbove = triggerRect.top - DROPDOWN_GAP;
            const preferredTop = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove
                ? triggerRect.bottom + DROPDOWN_GAP
                : triggerRect.top - dropdownHeight - DROPDOWN_GAP;
            const maxTop = Math.max(VIEWPORT_MARGIN, window.innerHeight - dropdownHeight - VIEWPORT_MARGIN);
            const top = Math.min(Math.max(preferredTop, VIEWPORT_MARGIN), maxTop);

            setDropdownStyle({ top, left, width });
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [filteredOptions.length, isOpen, query]);

    const selectOption = (option) => {
        onChange(option.value);
        close(true);
    };

    return (
        <div ref={rootRef} className={`searchable-select ${className}`.trim()}>
            <button
                ref={triggerRef}
                className="searchable-select__trigger"
                type="button"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                onClick={() => isOpen ? close() : setIsOpen(true)}
            >
                <span className={selectedOption ? 'searchable-select__value' : 'searchable-select__placeholder'}>
                    {selectedOption?.label ?? placeholder}
                </span>
                <ChevronIcon />
            </button>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="searchable-select__dropdown"
                    style={dropdownStyle ?? { visibility: 'hidden' }}
                >
                    <label className="searchable-select__search">
                        <SearchIcon />
                        <input
                            ref={searchRef}
                            type="search"
                            value={query}
                            placeholder={searchPlaceholder}
                            aria-label={searchPlaceholder}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </label>
                    <div id={listboxId} className="searchable-select__options" role="listbox">
                        {filteredOptions.length > 0 ? filteredOptions.map((option) => {
                            const isSelected = option.value === value;

                            return (
                                <button
                                    className="searchable-select__option"
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => selectOption(option)}
                                    key={option.value}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && <CheckIcon />}
                                </button>
                            );
                        }) : <p className="searchable-select__empty">{emptyMessage}</p>}
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}

function ChevronIcon() {
    return (
        <svg className="searchable-select__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m7 10 5 5 5-5" />
        </svg>
    );
}
