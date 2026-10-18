import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import CloseIcon from '../../components/icons/CloseIcon';
import PencilIcon from '../../components/icons/PencilIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import { getShopAttributes, getShopAttributeUnits } from '../../services/shopAttributes';
import CreateAttributeModal from './CreateAttributeModal';

const sortAttributes = (attributes) => [...attributes].sort((left, right) => (
    left.sort_order - right.sort_order || left.id - right.id
));

export default function ProductAttributesModal({ isOpen, initialAttributes = [], onClose, onAttributesChanged }) {
    const { t } = useTranslation();
    const [attributes, setAttributes] = useState(initialAttributes);
    const [units, setUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState(null);
    usePageScrollLock(isOpen);

    const close = useCallback(() => {
        if (isFormOpen) return;

        setEditingAttribute(null);
        setLoadError('');
        onClose();
    }, [isFormOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const controller = new AbortController();
        setAttributes(sortAttributes(initialAttributes));
        setIsLoading(true);
        setLoadError('');

        getShopAttributes({ signal: controller.signal })
            .then((loadedAttributes) => {
                if (controller.signal.aborted) return;

                const sortedAttributes = sortAttributes(loadedAttributes);
                setAttributes(sortedAttributes);
                onAttributesChanged(sortedAttributes);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Unable to load product attributes.', error);
                    setLoadError(t('productEditPage.attributesSection.errors.directoryLoad'));
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        getShopAttributeUnits({ signal: controller.signal })
            .then(setUnits)
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Unable to load product attribute units.', error);
                }
            });

        return () => controller.abort();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || isFormOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') close();
        };

        document.addEventListener('keydown', closeOnEscape);

        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [close, isFormOpen, isOpen]);

    if (!isOpen) return null;

    const unitShortNames = new Map(units.map((unit) => [unit.value, unit.short_name]));

    const saveAttribute = (savedAttribute) => {
        const nextAttributes = sortAttributes([
            ...attributes.filter((attribute) => attribute.id !== savedAttribute.id),
            savedAttribute,
        ]);
        setAttributes(nextAttributes);
        onAttributesChanged(nextAttributes);
        setEditingAttribute(null);
        setIsFormOpen(false);
    };

    return createPortal(
        <>
            <div className="modal-overlay" role="presentation" onMouseDown={close}>
                <section
                    className="modal-dialog flex h-[min(760px,calc(100vh-44px))] max-w-[960px] flex-col bg-[#fbfaf8] max-[620px]:h-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="product-attributes-modal-title"
                    aria-busy={isLoading}
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <header className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border)] bg-white px-7 pb-[18px] pt-[22px] max-[620px]:px-[15px] max-[620px]:pb-[14px] max-[620px]:pt-[17px]">
                        <div className="flex flex-col">
                            <p className="m-0 text-[11px] font-bold uppercase tracking-[.12em] text-[color:var(--color-accent)]">{t('productEditPage.attributesModal.directory')}</p>
                            <h2 id="product-attributes-modal-title" className="mb-1 mt-0.5 text-[28px] font-[760] tracking-[-.04em] text-[#312d29] max-[620px]:text-[22px]">{t('productEditPage.attributesSection.manage')}</h2>
                            <span className="text-xs text-[#8d857e]">{t('productEditPage.attributesModal.description')}</span>
                        </div>
                        <button type="button" className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[11px] border border-[color:var(--color-border)] bg-white text-[#706861] hover:text-[color:var(--color-accent)]" onClick={close} aria-label={t('productEditPage.actions.close')}>
                            <CloseIcon width="18" height="18" />
                        </button>
                    </header>

                    <div className="flex items-center justify-between gap-4 px-7 py-4 max-[620px]:px-[14px]">
                        <strong className="text-[12px] text-[#554e48]">{t('productEditPage.attributesModal.allAttributes')}</strong>
                        <button type="button" className="button button--primary min-h-[42px] justify-center" onClick={() => { setEditingAttribute(null); setIsFormOpen(true); }}>
                            <PlusIcon width="15" height="15" />{t('productEditPage.attributesSection.addAttribute')}
                        </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-6 max-[620px]:px-[14px]">
                        {loadError && <p className="mb-3 mt-0 rounded-lg bg-[#fff5ef] px-3 py-2 text-[12px] text-[#9a3b12]" role="alert">{loadError}</p>}
                        {isLoading && attributes.length === 0 && <p className="m-0 rounded-xl border border-[color:var(--color-border)] bg-white p-5 text-center text-xs text-[#918880]" role="status">{t('productEditPage.attributesSection.loading')}</p>}
                        {!isLoading && !loadError && attributes.length === 0 && <p className="m-0 rounded-xl border border-dashed border-[#ded6d0] bg-white p-5 text-center text-xs text-[#918880]">{t('productEditPage.attributesModal.empty')}</p>}
                        {attributes.length > 0 && (
                            <div className="overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white">
                                <div className="grid grid-cols-[minmax(160px,1.35fr)_minmax(125px,.8fr)_minmax(70px,.55fr)_90px_110px_42px] items-center gap-3 border-b border-[color:var(--color-border)] bg-[#f8f5f2] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.06em] text-[#8d857e] max-[760px]:hidden">
                                    <span>{t('productEditPage.createAttribute.name')}</span>
                                    <span>{t('productEditPage.createAttribute.type')}</span>
                                    <span>{t('productEditPage.attributesModal.unit')}</span>
                                    <span>{t('productEditPage.attributesModal.visibility')}</span>
                                    <span>{t('productEditPage.attributesModal.filter')}</span>
                                    <span />
                                </div>
                                <div className="divide-y divide-[color:var(--color-border)]">
                                    {attributes.map((attribute) => (
                                        <article className="grid min-h-[58px] grid-cols-[minmax(160px,1.35fr)_minmax(125px,.8fr)_minmax(70px,.55fr)_90px_110px_42px] items-center gap-3 px-4 py-2.5 max-[760px]:grid-cols-[minmax(0,1fr)_42px]" key={attribute.id}>
                                            <strong className="min-w-0 truncate text-[12px] text-[#443e39]">{attribute.name}</strong>
                                            <span className="text-[12px] text-[#756d66] max-[760px]:col-start-1">{t(`productEditPage.createAttribute.types.${attribute.type}`, { defaultValue: attribute.type })}</span>
                                            <span className="text-[12px] text-[#756d66] max-[760px]:col-start-1">{attribute.unit ? (unitShortNames.get(attribute.unit) ?? attribute.unit) : '—'}</span>
                                            <Status value={attribute.is_visible} trueLabel={t('productEditPage.attributesModal.visible')} falseLabel={t('productEditPage.attributesModal.hidden')} />
                                            <Status value={attribute.is_filterable} trueLabel={t('productEditPage.attributesModal.inFilter')} falseLabel={t('productEditPage.attributesModal.notInFilter')} />
                                            <button
                                                type="button"
                                                className="grid h-[36px] w-[36px] place-items-center rounded-[9px] border border-[#e2d9d3] bg-white text-[#756d66] hover:border-[#d7ad94] hover:text-[color:var(--color-accent)] max-[760px]:col-start-2 max-[760px]:row-span-3 max-[760px]:row-start-1"
                                                aria-label={t('productEditPage.attributesModal.editAria', { name: attribute.name })}
                                                title={t('productEditPage.attributesModal.edit')}
                                                onClick={() => { setEditingAttribute(attribute); setIsFormOpen(true); }}
                                            >
                                                <PencilIcon />
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <CreateAttributeModal
                isOpen={isFormOpen}
                attribute={editingAttribute}
                onClose={() => { setEditingAttribute(null); setIsFormOpen(false); }}
                onSaved={saveAttribute}
            />
        </>,
        document.body,
    );
}

function Status({ value, trueLabel, falseLabel }) {
    return (
        <span className={`w-fit rounded-full px-2 py-1 text-[10px] font-bold ${value ? 'bg-[#edf7ef] text-[#3f7849]' : 'bg-[#f2efec] text-[#817870]'} max-[760px]:col-start-1`}>
            {value ? trueLabel : falseLabel}
        </span>
    );
}
