import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CheckIcon from '../icons/CheckIcon';
import SearchIcon from '../icons/SearchIcon';

const DROPDOWN_GAP = 7;
const DROPDOWN_MIN_WIDTH = 260;
const VIEWPORT_MARGIN = 14;

export default function SearchableSelect({
    name,
    options,
    value,
    onChange,
    placeholder = '',
    searchPlaceholder = '',
    emptyMessage = 'Нічого не знайдено',
    ariaLabel = placeholder,
    className = '',
    disabled = false,
    ariaBusy = false,
    closeOnSelect = true,
    multiple = false,
    actionLabel = '',
    onAction,
    actionRequiresQuery = false,
    actionWhenNoResults = false,
    createActionLabel = '',
    createInputPlaceholder = '',
    createSubmitLabel = 'Добавить',
    createCancelLabel = 'Отмена',
    onCreate,
    createPending = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [createValue, setCreateValue] = useState('');
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState(null);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const createInputRef = useRef(null);
    const createRequestRef = useRef(false);
    const listboxId = useId();
    const selectedValues = multiple && Array.isArray(value) ? value : [];
    const selectedOptions = multiple
        ? options.filter((option) => selectedValues.includes(option.value))
        : [];
    const selectedOption = multiple ? null : options.find((option) => option.value === value);
    const selectedLabel = multiple
        ? selectedOptions.map((option) => option.label).join(', ')
        : selectedOption?.label;
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const trimmedQuery = query.trim();
    const filteredOptions = useMemo(() => {
        if (!normalizedQuery) return options;

        return options.filter((option) => String(option.label).toLocaleLowerCase().includes(normalizedQuery));
    }, [normalizedQuery, options]);
    const resolvedActionLabel = typeof actionLabel === 'function'
        ? actionLabel(trimmedQuery)
        : actionLabel;
    const showAction = resolvedActionLabel
        && onAction
        && !isCreateFormOpen
        && (!actionRequiresQuery || trimmedQuery.length > 0)
        && (!actionWhenNoResults || filteredOptions.length === 0);
    const isCreateBusy = createPending || isSubmittingCreate;

    const close = (restoreFocus = false) => {
        setIsOpen(false);
        setQuery('');
        setIsCreateFormOpen(false);
        setCreateValue('');
        setDropdownStyle(null);
        if (restoreFocus) triggerRef.current?.focus();
    };

    const cancelCreate = () => {
        if (isCreateBusy) return;

        setIsCreateFormOpen(false);
        setCreateValue('');
        window.requestAnimationFrame(() => searchRef.current?.focus());
    };

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleOutsideClick = (event) => {
            if (!rootRef.current?.contains(event.target) && !dropdownRef.current?.contains(event.target)) close();
        };
        const handleEscape = (event) => {
            if (event.key !== 'Escape') return;

            if (isCreateFormOpen) {
                cancelCreate();
            } else {
                close(true);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        if (!isCreateFormOpen) searchRef.current?.focus();

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isCreateBusy, isCreateFormOpen, isOpen]);

    useEffect(() => {
        if (!disabled || !isOpen) return;

        setIsOpen(false);
        setQuery('');
        setIsCreateFormOpen(false);
        setCreateValue('');
        setDropdownStyle(null);
    }, [disabled, isOpen]);

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

            setDropdownStyle({ top: preferredTop, left, width });
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [filteredOptions.length, isCreateFormOpen, isOpen, query]);

    const selectOption = (option) => {
        if (option.disabled) return;

        if (multiple) {
            onChange(selectedValues.includes(option.value)
                ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
                : [...selectedValues, option.value]);
        } else {
            onChange(option.value);
        }

        if (closeOnSelect) {
            close(true);
        } else {
            setQuery('');
            searchRef.current?.focus();
        }
    };

    const runAction = () => {
        onAction(trimmedQuery);
        close();
    };

    const openCreateForm = () => {
        setCreateValue(trimmedQuery);
        setIsCreateFormOpen(true);
        window.requestAnimationFrame(() => createInputRef.current?.focus());
    };

    const submitCreate = async (event) => {
        event.preventDefault();
        const valueToCreate = createValue.trim();

        if (!valueToCreate || createRequestRef.current || isCreateBusy) return;

        createRequestRef.current = true;
        setIsSubmittingCreate(true);

        try {
            const wasCreated = await onCreate(valueToCreate);

            if (wasCreated === false) return;

            setCreateValue('');
            setIsCreateFormOpen(false);

            if (closeOnSelect) {
                close(true);
            } else {
                setQuery('');
                window.requestAnimationFrame(() => searchRef.current?.focus());
            }
        } catch {
            // The consumer owns error presentation; keep the inline form open for correction or retry.
        } finally {
            createRequestRef.current = false;
            setIsSubmittingCreate(false);
        }
    };

    return (
        <div ref={rootRef} className={`searchable-select ${className}`.trim()}>
            {name && (multiple
                ? selectedValues.map((selectedValue) => <input key={selectedValue} type="hidden" name={`${name}[]`} value={selectedValue} disabled={disabled} />)
                : <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />)}
            <button
                ref={triggerRef}
                className="searchable-select__trigger"
                type="button"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-busy={ariaBusy}
                disabled={disabled || isCreateBusy}
                onClick={() => isOpen ? close() : setIsOpen(true)}
            >
                <span className={selectedLabel ? 'searchable-select__value' : 'searchable-select__placeholder'}>
                    {selectedLabel || placeholder}
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
                            disabled={isCreateBusy}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </label>
                    <div id={listboxId} className="searchable-select__options" role="listbox" aria-multiselectable={multiple || undefined}>
                        {filteredOptions.length > 0 ? filteredOptions.map((option) => {
                            const isSelected = multiple
                                ? selectedValues.includes(option.value)
                                : option.value === value;

                            return (
                                <button
                                    className="searchable-select__option"
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    aria-disabled={Boolean(option.disabled)}
                                    disabled={option.disabled || isCreateBusy}
                                    onClick={() => selectOption(option)}
                                    key={option.value}
                                >
                                    <span>{option.label}</span>
                                    {(isSelected || option.showCheck) && <CheckIcon />}
                                </button>
                            );
                        }) : <p className="searchable-select__empty">{emptyMessage}</p>}
                    </div>
                    {showAction && (
                        <button className="searchable-select__action" type="button" disabled={isCreateBusy} onClick={runAction}>
                            <span aria-hidden="true">+</span>{resolvedActionLabel}
                        </button>
                    )}
                    {createActionLabel && onCreate && (isCreateFormOpen ? (
                        <form className="searchable-select__create-form" onSubmit={submitCreate}>
                            <input
                                ref={createInputRef}
                                type="text"
                                value={createValue}
                                placeholder={createInputPlaceholder}
                                aria-label={createInputPlaceholder || createActionLabel}
                                disabled={isCreateBusy}
                                onChange={(event) => setCreateValue(event.target.value)}
                            />
                            <button type="submit" disabled={isCreateBusy || !createValue.trim()}>{isCreateBusy ? '…' : createSubmitLabel}</button>
                            <button type="button" disabled={isCreateBusy} onClick={cancelCreate}>{createCancelLabel}</button>
                        </form>
                    ) : (
                        <button className="searchable-select__action" type="button" disabled={isCreateBusy} onClick={openCreateForm}>
                            <span aria-hidden="true">+</span>{createActionLabel}
                        </button>
                    ))}
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
