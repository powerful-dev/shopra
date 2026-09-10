import { useEffect } from 'react';

let lockCount = 0;
let originalBodyStyles = null;

function lockPageScroll() {
    lockCount += 1;
    if (lockCount > 1) return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const currentPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    originalBodyStyles = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
    };

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
        body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
}

function unlockPageScroll() {
    if (lockCount === 0) return;

    lockCount -= 1;
    if (lockCount > 0) return;

    const { body } = document;
    body.style.overflow = originalBodyStyles.overflow;
    body.style.paddingRight = originalBodyStyles.paddingRight;

    originalBodyStyles = null;
}

export default function usePageScrollLock(isLocked = true) {
    useEffect(() => {
        if (!isLocked) return undefined;

        lockPageScroll();

        return unlockPageScroll;
    }, [isLocked]);
}
