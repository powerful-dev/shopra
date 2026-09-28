import { useCallback, useEffect, useRef, useState } from 'react';

export default function useFileDropZone({ disabled = false, onDrop }) {
    const dragDepthRef = useRef(0);
    const [isDragActive, setIsDragActive] = useState(false);

    const reset = useCallback(() => {
        dragDepthRef.current = 0;
        setIsDragActive(false);
    }, []);

    useEffect(() => {
        if (disabled) reset();
    }, [disabled, reset]);

    return {
        isDragActive,
        reset,
        dropZoneProps: {
            onDragEnter: (event) => {
                if (!Array.from(event.dataTransfer.types).includes('Files') || disabled) return;

                event.preventDefault();
                dragDepthRef.current += 1;
                setIsDragActive(true);
            },
            onDragOver: (event) => {
                if (!Array.from(event.dataTransfer.types).includes('Files')) return;

                event.preventDefault();
                event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
            },
            onDragLeave: (event) => {
                if (!isDragActive) return;

                event.preventDefault();
                dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

                if (dragDepthRef.current === 0) setIsDragActive(false);
            },
            onDrop: (event) => {
                if (!Array.from(event.dataTransfer.types).includes('Files')) return;

                event.preventDefault();
                reset();

                if (!disabled) onDrop(event.dataTransfer.files, event);
            },
        },
    };
}
