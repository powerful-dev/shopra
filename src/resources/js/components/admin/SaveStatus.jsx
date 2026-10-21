import { useTranslation } from 'react-i18next';
import CheckIcon from '../icons/CheckIcon';

export default function SaveStatus({ status, className = '' }) {
    const { t } = useTranslation();

    if (status !== 'saving' && status !== 'success') return null;

    return (
        <div
            className={`flex min-w-0 shrink-0 items-center gap-2 break-words text-[12px] font-bold ${status === 'success' ? 'text-[#3c8354]' : 'text-[#766d66]'} ${className}`.trim()}
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            {status === 'saving' ? (
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#cfc6bf] border-t-[color:var(--color-accent)]" aria-hidden="true" />
            ) : (
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#4c9564] text-white" aria-hidden="true"><CheckIcon /></span>
            )}
            <span>{t(`common.saveStatus.${status}`)}</span>
        </div>
    );
}
