import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import usePageScrollLock from './usePageScrollLock';

const baseModalZIndex = 1000;
const modalLayerStep = 10;
const modalStack = [];
const listeners = new Set();
let nextModalId = 0;
let stackVersion = 0;

function emitStackChange() {
    stackVersion += 1;
    listeners.forEach((listener) => listener());
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return stackVersion;
}

export default function useModalLayer(isOpen = true) {
    const modalIdRef = useRef(null);

    if (modalIdRef.current === null) {
        nextModalId += 1;
        modalIdRef.current = nextModalId;
    }

    usePageScrollLock(isOpen);
    useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    useLayoutEffect(() => {
        if (!isOpen) return undefined;

        const modalId = modalIdRef.current;
        modalStack.push(modalId);
        emitStackChange();

        return () => {
            const modalIndex = modalStack.lastIndexOf(modalId);
            if (modalIndex !== -1) modalStack.splice(modalIndex, 1);
            emitStackChange();
        };
    }, [isOpen]);

    const modalIndex = isOpen ? modalStack.lastIndexOf(modalIdRef.current) : -1;

    return {
        isTopModal: modalIndex !== -1 && modalIndex === modalStack.length - 1,
        layerStyle: { zIndex: baseModalZIndex + Math.max(modalIndex, 0) * modalLayerStep },
    };
}
