import { useEffect, useState } from 'react';

export default function PageLoader({ text = 'Загрузка…', delay = 200 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!visible) {
        return null;
    }

    return (
        <div className="flex min-h-[280px] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <span
                    className="h-7 w-7 animate-spin rounded-full border-2 border-[color:var(--color-border)] border-t-[color:var(--color-accent)]"
                    aria-hidden="true"
                />

                <span className="text-[12px] font-medium text-[color:var(--color-secondary)]">
                    {text}
                </span>
            </div>
        </div>
    );
}