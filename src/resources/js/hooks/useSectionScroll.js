import { useCallback } from 'react';

export default function useSectionScroll({ stickyRef, containerRef, gap = 12 } = {}) {
    return useCallback((sectionRef) => {
        const section = sectionRef?.current ?? sectionRef;

        if (!section) return;

        const stickyElement = stickyRef?.current;
        const scrollContainer = containerRef?.current;
        const stickyTop = stickyElement
            ? Number.parseFloat(window.getComputedStyle(stickyElement).top) || 0
            : 0;
        const stickyHeight = stickyElement?.getBoundingClientRect().height ?? 0;
        const sectionTop = section.getBoundingClientRect().top;

        if (scrollContainer) {
            const containerTop = scrollContainer.getBoundingClientRect().top;

            scrollContainer.scrollTo({
                top: Math.max(0, scrollContainer.scrollTop + sectionTop - containerTop - stickyTop - stickyHeight - gap),
                behavior: 'smooth',
            });

            return;
        }

        window.scrollTo({
            top: Math.max(0, window.scrollY + sectionTop - stickyTop - stickyHeight - gap),
            behavior: 'smooth',
        });
    }, [containerRef, gap, stickyRef]);
}
