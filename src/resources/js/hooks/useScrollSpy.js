import { useCallback, useEffect, useRef, useState } from 'react';
import useSectionScroll from './useSectionScroll';

const scrollIdleDelay = 120;

function resolveElement(reference) {
    if (reference === null || reference === undefined) return null;
    if (typeof reference === 'object' && 'current' in reference) {
        return reference.current ?? null;
    }

    return reference;
}

function isElement(value) {
    return value !== null && typeof value === 'object' && value.nodeType === 1;
}

function isEventTarget(value) {
    return typeof value?.addEventListener === 'function'
        && typeof value?.removeEventListener === 'function';
}

function getSectionElement(sectionRefs, sectionId) {
    return resolveElement(resolveElement(sectionRefs)?.[sectionId]);
}

function getStickyBoundary(stickyElement, scrollContainer, gap) {
    const containerTop = scrollContainer?.getBoundingClientRect().top ?? 0;
    const stickyStyles = stickyElement ? window.getComputedStyle(stickyElement) : null;
    const stickyTop = Number.parseFloat(stickyStyles?.top) || 0;
    const stickyHeight = stickyElement?.getBoundingClientRect().height ?? 0;

    return containerTop + stickyTop + stickyHeight + gap;
}

export default function useScrollSpy({
    sections,
    sectionRefs,
    navigationRef,
    containerRef,
    gap = 12,
} = {}) {
    const firstSectionId = sections?.[0]?.id ?? null;
    const [activeSectionId, setActiveSectionId] = useState(firstSectionId);
    const activeSectionIdRef = useRef(firstSectionId);
    const programmaticTargetRef = useRef(null);
    const scrollIdleTimerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const scrollToElement = useSectionScroll({
        stickyRef: navigationRef,
        containerRef,
        gap,
    });

    const updateActiveSection = useCallback(() => {
        if (programmaticTargetRef.current) return;

        const resolvedScrollContainer = resolveElement(containerRef);
        const resolvedNavigation = resolveElement(navigationRef);
        const scrollContainer = isElement(resolvedScrollContainer) ? resolvedScrollContainer : null;
        const navigation = isElement(resolvedNavigation) ? resolvedNavigation : null;
        const sectionElements = (sections ?? [])
            .map(({ id }) => ({ id, element: getSectionElement(sectionRefs, id) }))
            .filter(({ element }) => isElement(element));

        if (sectionElements.length === 0) return;

        const boundary = getStickyBoundary(navigation, scrollContainer, gap);
        let nextSectionId = sectionElements[0].id;

        for (const { id, element } of sectionElements) {
            if (element.getBoundingClientRect().top > boundary + 1) break;
            nextSectionId = id;
        }

        if (activeSectionIdRef.current === nextSectionId) return;

        activeSectionIdRef.current = nextSectionId;
        setActiveSectionId(nextSectionId);
    }, [containerRef, gap, navigationRef, sectionRefs, sections]);

    const scheduleUpdate = useCallback(() => {
        if (animationFrameRef.current !== null) return;

        animationFrameRef.current = window.requestAnimationFrame(() => {
            animationFrameRef.current = null;
            updateActiveSection();
        });
    }, [updateActiveSection]);

    const finishProgrammaticScroll = useCallback(() => {
        window.clearTimeout(scrollIdleTimerRef.current);
        programmaticTargetRef.current = null;
        // Keep the selected tab stable when the browser clamps a target near the page end.
        // The next manual scroll will resume position-based detection.
    }, []);

    const handleScroll = useCallback(() => {
        if (programmaticTargetRef.current) {
            window.clearTimeout(scrollIdleTimerRef.current);
            scrollIdleTimerRef.current = window.setTimeout(finishProgrammaticScroll, scrollIdleDelay);
            return;
        }

        scheduleUpdate();
    }, [finishProgrammaticScroll, scheduleUpdate]);

    useEffect(() => {
        const resolvedScrollTarget = resolveElement(containerRef);
        const scrollTarget = isEventTarget(resolvedScrollTarget) ? resolvedScrollTarget : window;
        const resizeObserver = typeof ResizeObserver === 'undefined'
            ? null
            : new ResizeObserver(scheduleUpdate);

        scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', scheduleUpdate);
        const navigation = resolveElement(navigationRef);
        if (isElement(navigation)) resizeObserver?.observe(navigation);
        (sections ?? []).forEach(({ id }) => {
            const section = getSectionElement(sectionRefs, id);
            if (isElement(section)) resizeObserver?.observe(section);
        });
        scheduleUpdate();

        return () => {
            scrollTarget.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', scheduleUpdate);
            resizeObserver?.disconnect();
            window.clearTimeout(scrollIdleTimerRef.current);
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [containerRef, handleScroll, navigationRef, scheduleUpdate, sectionRefs, sections]);

    useEffect(() => {
        if ((sections ?? []).some(({ id }) => id === activeSectionIdRef.current)) return;

        activeSectionIdRef.current = firstSectionId;
        setActiveSectionId(firstSectionId);
    }, [firstSectionId, sections]);

    const scrollToSection = useCallback((sectionId) => {
        const section = getSectionElement(sectionRefs, sectionId);
        if (!isElement(section)) return;

        activeSectionIdRef.current = sectionId;
        setActiveSectionId(sectionId);
        programmaticTargetRef.current = sectionId;
        window.clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = window.setTimeout(finishProgrammaticScroll, scrollIdleDelay);
        scrollToElement(section);
    }, [finishProgrammaticScroll, scrollToElement, sectionRefs]);

    return { activeSectionId, scrollToSection };
}
