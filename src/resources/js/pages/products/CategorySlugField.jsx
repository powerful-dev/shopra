import { useTranslation } from 'react-i18next';
import PencilIcon from '../../components/icons/PencilIcon';

export default function CategorySlugField({ slug, isEditing, isChecking = false, error = '', disabled = false, onChange, onEditingChange }) {
    const { t } = useTranslation();

    return (
        <div className="flex min-w-0 flex-col gap-[5px] text-xs text-[#8d857e]">
            {isEditing ? (
                <div className="form-control-group flex items-center rounded-lg px-[9px]">
                    <span className="shrink-0">/catalog/</span>
                    <input
                        className="form-control h-[30px] min-w-0 flex-1 bg-transparent text-xs"
                        aria-label={t('categoriesModal.form.slugLabel')}
                        name="slug"
                        autoFocus
                        maxLength={255}
                        disabled={disabled}
                        value={slug}
                        onChange={(event) => onChange(event.target.value)}
                        onBlur={() => onEditingChange(false)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                onEditingChange(false);
                            }
                        }}
                    />
                </div>
            ) : (
                <button
                    type="button"
                    className="inline-flex w-fit max-w-full cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-left text-xs text-[#8d857e] hover:text-[color:var(--color-accent)]"
                    aria-label={t('categoriesModal.form.editUrl', { url: `/catalog/${slug}` })}
                    disabled={disabled}
                    onClick={() => onEditingChange(true)}
                >
                    <span className="min-w-0 break-all">/catalog/{slug}</span>
                    <span className="inline-flex shrink-0"><PencilIcon /></span>
                </button>
            )}
            {!isEditing && isChecking && <span role="status">{t('categoriesModal.form.checkingUrl')}</span>}
            {!isEditing && error && <span role="alert">{error}</span>}
        </div>
    );
}
