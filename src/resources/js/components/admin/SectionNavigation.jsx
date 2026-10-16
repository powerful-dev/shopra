import { useCallback, useEffect, useRef } from 'react';

export default function SectionNavigation({
    sections,
    activeSectionId,
    onSectionSelect,
    navigationRef,
    ariaLabel = 'Разделы страницы',
    className = '',
}) {
    const internalNavigationRef = useRef(null);
    const itemRefs = useRef({});
    const setNavigationRef = useCallback((element) => {
        internalNavigationRef.current = element;

        if (typeof navigationRef === 'function') navigationRef(element);
        else if (navigationRef) navigationRef.current = element;
    }, [navigationRef]);

    useEffect(() => {
        const activeItem = itemRefs.current[activeSectionId];
        const navigation = internalNavigationRef.current;

        if (!activeItem || !navigation) return;

        const itemLeft = activeItem.offsetLeft;
        const itemRight = itemLeft + activeItem.offsetWidth;
        const visibleLeft = navigation.scrollLeft;
        const visibleRight = visibleLeft + navigation.clientWidth;

        if (itemLeft < visibleLeft) {
            navigation.scrollTo({ left: itemLeft, behavior: 'smooth' });
        } else if (itemRight > visibleRight) {
            navigation.scrollTo({ left: itemRight - navigation.clientWidth, behavior: 'smooth' });
        }
    }, [activeSectionId]);

    return (
        <nav
            ref={setNavigationRef}
            className={`flex items-center gap-0.5 overflow-x-auto ${className}`}
            aria-label={ariaLabel}
        >
            {sections.map(({ id, label, icon: Icon }) => {
                const isActive = id === activeSectionId;

                return (
                    <button
                        ref={(element) => {
                            if (element) itemRefs.current[id] = element;
                            else delete itemRefs.current[id];
                        }}
                        key={id}
                        type="button"
                        className={`flex min-h-[45px] shrink-0 cursor-pointer items-center gap-1.5 border-0 bg-transparent px-2.5 text-[12px] font-[680] ${isActive ? 'relative text-[color:var(--color-accent)] after:absolute after:inset-x-2.5 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[color:var(--color-accent)]' : 'text-[#756e67]'}`}
                        aria-current={isActive ? 'location' : undefined}
                        onClick={() => onSectionSelect(id)}
                    >
                        <span className={`grid h-[25px] w-[25px] place-items-center rounded-lg ${isActive ? 'bg-[#f9eee7]' : 'bg-[#f0ebe7]'}`}>
                            <Icon />
                        </span>
                        {label}
                    </button>
                );
            })}
        </nav>
    );
}
