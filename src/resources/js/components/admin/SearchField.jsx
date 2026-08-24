import { useEffect, useRef, useState } from 'react';
import SearchIcon from '../icons/SearchIcon';

export default function SearchField({
    value,
    onSearch,
    placeholder,
    ariaLabel = placeholder,
    className = '',
    inputClassName = '',
    debounce = 700,
}) {
    const [query, setQuery] = useState(value);
    const onSearchRef = useRef(onSearch);

    useEffect(() => {
        onSearchRef.current = onSearch;
    }, [onSearch]);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        if (query === value) return undefined;

        const timeoutId = window.setTimeout(() => {
            onSearchRef.current(query.trim());
        }, debounce);

        return () => window.clearTimeout(timeoutId);
    }, [debounce, query, value]);

    return (
        <label className={className}>
            <SearchIcon />
            <input
                type="search"
                className={inputClassName}
                placeholder={placeholder}
                aria-label={ariaLabel}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
        </label>
    );
}
