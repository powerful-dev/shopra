import { useEffect, useState } from 'react';

function getGreeting(hour) {
    if (hour >= 5 && hour <= 11) {
        return 'Доброе утро';
    }

    if (hour >= 12 && hour <= 16) {
        return 'Добрый день';
    }

    if (hour >= 17 && hour <= 22) {
        return 'Добрый вечер';
    }

    return 'Доброй ночи';
}

function formatDateLabel(date, timeZone) {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone,
    });

    const parts = formatter.formatToParts(date);
    const weekday = parts.find((part) => part.type === 'weekday')?.value ?? '';
    const day = parts.find((part) => part.type === 'day')?.value ?? '';
    const month = parts.find((part) => part.type === 'month')?.value ?? '';

    return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${day} ${month}`;
}

export function useLocalDateTime() {
    const [state, setState] = useState(() => {
        const now = new Date();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        return {
            greeting: getGreeting(now.getHours()),
            dateLabel: formatDateLabel(now, timeZone),
        };
    });

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            setState({
                greeting: getGreeting(now.getHours()),
                dateLabel: formatDateLabel(now, timeZone),
            });
        };

        updateDate();

        const intervalId = window.setInterval(updateDate, 60_000);

        return () => window.clearInterval(intervalId);
    }, []);

    return state;
}
