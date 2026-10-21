import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { appName } from '../../adminConfig';
import Alert from '../../components/admin/Alert';
import BulkActionsBar from '../../components/admin/BulkActionsBar';
import ImageLightbox from '../../components/admin/ImageLightbox';
import SaveStatus from '../../components/admin/SaveStatus';
import Field from '../../components/form/Field';
import Select from '../../components/form/Select';
import CloseIcon from '../../components/icons/CloseIcon';
import ImageIcon from '../../components/icons/ImageIcon';
import InfoIcon from '../../components/icons/InfoIcon';
import LayersIcon from '../../components/icons/LayersIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import SaveIcon from '../../components/icons/SaveIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import useModalLayer from '../../hooks/useModalLayer';
import { getShopAttributes } from '../../services/shopAttributes';
import { getProductVariants, updateProductVariants } from '../../services/shopItems';
import CreateAttributeModal from './CreateAttributeModal';

const combinationLimit = 100;
const variantAttributeTypes = ['select', 'multiselect'];
let temporaryIdSequence = 0;

function temporaryId(type) {
    temporaryIdSequence += 1;
    return `new-${type}-${temporaryIdSequence}`;
}

function sameId(left, right) {
    return left !== null && left !== undefined && right !== null && right !== undefined && String(left) === String(right);
}

function sortedByOrder(items = []) {
    return items
        .map((item, index) => ({ item, index }))
        .sort((left, right) => (Number(left.item.sort_order ?? 0) - Number(right.item.sort_order ?? 0)) || left.index - right.index)
        .map(({ item }) => item);
}

function attributeValues(attribute) {
    return sortedByOrder(attribute?.options).map((option, sortOrder) => ({
        shopAttributeOptionId: option.id,
        label: option.value,
        sortOrder: option.sort_order ?? sortOrder,
    }));
}

function restoreVariantOptions(savedOptions = [], attributes = [], translate) {
    return sortedByOrder(savedOptions).map((savedOption, optionIndex) => {
        const attribute = attributes.find((item) => sameId(item.id, savedOption.shop_attribute_id));
        const availableValues = attributeValues(attribute);

        return {
            id: savedOption.id,
            shopAttributeId: savedOption.shop_attribute_id,
            localName: savedOption.name,
            name: savedOption.name ?? attribute?.name ?? translate('productEditPage.variantModal.fallbackOption', { id: savedOption.id }),
            type: attribute?.type ?? 'select',
            sortOrder: savedOption.sort_order ?? optionIndex,
            availableValues,
            values: sortedByOrder(savedOption.values).map((savedValue, valueIndex) => {
                const attributeValue = availableValues.find((item) => sameId(item.shopAttributeOptionId, savedValue.shop_attribute_option_id));

                return {
                    id: savedValue.id,
                    shopAttributeOptionId: savedValue.shop_attribute_option_id,
                    localValue: savedValue.value,
                    label: savedValue.value ?? attributeValue?.label ?? translate('productEditPage.variantModal.fallbackValue', { id: savedValue.id }),
                    sortOrder: savedValue.sort_order ?? valueIndex,
                };
            }),
        };
    });
}

function applyAttributeDetails(options, attributes) {
    return options.map((option) => {
        if (option.shopAttributeId === null || option.shopAttributeId === undefined) return option;

        const attribute = attributes.find((item) => sameId(item.id, option.shopAttributeId));
        if (!attribute) return option;

        const availableValues = attributeValues(attribute);
        return {
            ...option,
            name: attribute.name,
            type: attribute.type,
            availableValues,
            values: option.values.map((value) => {
                if (value.shopAttributeOptionId === null || value.shopAttributeOptionId === undefined) return value;

                const attributeValue = availableValues.find((item) => sameId(item.shopAttributeOptionId, value.shopAttributeOptionId));
                return attributeValue ? { ...value, label: attributeValue.label } : value;
            }),
        };
    });
}

function restoreVariantData(savedVariants = [], options = []) {
    const restoredData = {};

    for (const [variantIndex, savedVariant] of sortedByOrder(savedVariants).entries()) {
        const selections = (savedVariant.selections ?? []).map((selection) => {
            const option = options.find((item) => sameId(item.id, selection.option_id));
            const value = option?.values.find((item) => sameId(item.id, selection.value_id));

            return option && value ? { option, value } : null;
        });

        if (selections.length === 0 || selections.some((selection) => selection === null)) continue;

        restoredData[combinationKey(selections)] = {
            id: savedVariant.id,
            selections: (savedVariant.selections ?? []).map((selection) => ({
                id: selection.id,
                optionId: selection.option_id,
                valueId: selection.value_id,
            })),
            price: savedVariant.price,
            stock: String(savedVariant.quantity ?? 0),
            sku: savedVariant.sku ?? '',
            active: Boolean(savedVariant.is_active),
            sortOrder: savedVariant.sort_order ?? variantIndex,
        };
    }

    return restoredData;
}

function emptyPhotoState() {
    return {
        settingsId: null,
        enabled: false,
        selectedOptionId: '',
        mainValueIds: {},
        assignments: {},
        records: {},
    };
}

function restorePhotoState(settings = {}, savedPhotos = [], options = []) {
    const selectedOption = options.find((option) => sameId(option.id, settings.photo_option_id));
    const selectedOptionId = selectedOption ? String(selectedOption.id) : '';
    const defaultValue = selectedOption?.values.find((value) => sameId(value.id, settings.default_photo_value_id));
    const assignments = {};
    const records = {};

    for (const photo of sortedByOrder(savedPhotos)) {
        const option = options.find((item) => item.values.some((value) => sameId(value.id, photo.shop_item_variant_value_id)));
        if (!option) continue;

        const optionId = String(option.id);
        const valueId = String(photo.shop_item_variant_value_id);
        assignments[optionId] ??= {};
        assignments[optionId][valueId] ??= [];
        assignments[optionId][valueId].push(String(photo.shop_item_media_id));
        records[valueId] ??= {};
        records[valueId][String(photo.shop_item_media_id)] = {
            id: photo.id,
            sortOrder: photo.sort_order,
        };
    }

    return {
        settingsId: settings.id ?? null,
        enabled: Boolean(settings.photos_enabled),
        selectedOptionId,
        mainValueIds: defaultValue ? { [selectedOptionId]: String(defaultValue.id) } : {},
        assignments,
        records,
    };
}

function restoreProductVariantsState(data, attributes = [], translate) {
    const options = restoreVariantOptions(data.options, attributes, translate);

    return {
        options,
        variants: restoreVariantData(data.variants, options),
        separatePrices: Boolean(data.settings?.individual_prices_enabled),
        separatePricesInitialized: (data.variants ?? []).length > 0 || Boolean(data.settings?.individual_prices_enabled),
        photos: restorePhotoState(data.settings, data.photos, options),
    };
}

function photoAssignmentKey(optionId, valueId) {
    return `${String(optionId)}:${String(valueId)}`;
}

function dirtyPhotoAssignmentKeys(assignments = {}, savedAssignments = {}) {
    const keys = new Set();
    const optionIds = new Set([...Object.keys(assignments), ...Object.keys(savedAssignments)]);

    for (const optionId of optionIds) {
        const currentValues = assignments[optionId] ?? {};
        const savedValues = savedAssignments[optionId] ?? {};
        const valueIds = new Set([...Object.keys(currentValues), ...Object.keys(savedValues)]);

        for (const valueId of valueIds) {
            const currentImageIds = currentValues[valueId] ?? [];
            const savedImageIds = savedValues[valueId] ?? [];

            if (currentImageIds.length !== savedImageIds.length
                || currentImageIds.some((imageId, index) => String(imageId) !== String(savedImageIds[index]))) {
                keys.add(photoAssignmentKey(optionId, valueId));
            }
        }
    }

    return keys;
}

function validationMessages(error, fallbackMessage) {
    const messages = Object.values(error?.errors ?? {}).flat().filter(Boolean);
    return [...new Set(messages.length > 0 ? messages : [error?.message || fallbackMessage])];
}

function combinationKey(selections) {
    return JSON.stringify(selections
        .map(({ option, value }) => [String(option.id), String(value.id)])
        .sort(([leftOptionId], [rightOptionId]) => leftOptionId.localeCompare(rightOptionId)));
}

function buildCombinations(options) {
    const optionsWithValues = options.filter((option) => option.values.length > 0);
    if (optionsWithValues.length === 0) return { combinations: [], totalCount: 0 };

    const totalCount = optionsWithValues.reduce((count, option) => count * option.values.length, 1);
    let selectionsList = [[]];

    for (const option of optionsWithValues) {
        const nextSelections = [];

        for (const selections of selectionsList) {
            for (const value of option.values) {
                if (nextSelections.length >= combinationLimit) break;
                nextSelections.push([...selections, { option, value }]);
            }
            if (nextSelections.length >= combinationLimit) break;
        }

        selectionsList = nextSelections;
    }

    return {
        totalCount,
        combinations: selectionsList.map((selections) => ({
            key: combinationKey(selections),
            label: selections.map(({ value }) => value.label).join(' / '),
            selections,
        })),
    };
}

function buildProductVariantsPayload({ options, combinations, variantData, separatePrices, photoState, basePrice }) {
    const photoOption = options.find((option) => String(option.id) === photoState.selectedOptionId) ?? options[0] ?? null;
    const configuredMainValueId = photoOption ? photoState.mainValueIds[String(photoOption.id)] : null;
    const defaultPhotoValue = photoOption?.values.find((value) => String(value.id) === configuredMainValueId)
        ?? photoOption?.values[0]
        ?? null;
    const photos = [];

    for (const option of options) {
        for (const value of option.values) {
            const valueId = String(value.id);
            const assignedImageIds = photoState.assignments[String(option.id)]?.[valueId] ?? [];

            assignedImageIds.forEach((imageId, sortOrder) => {
                photos.push({
                    id: photoState.records[valueId]?.[String(imageId)]?.id ?? null,
                    shop_item_variant_value_id: value.id,
                    shop_item_media_id: Number(imageId),
                    sort_order: sortOrder,
                });
            });
        }
    }

    return {
        settings: {
            id: photoState.settingsId,
            individual_prices_enabled: separatePrices,
            photos_enabled: photoState.enabled,
            photo_option_id: photoOption?.id ?? null,
            default_photo_value_id: defaultPhotoValue?.id ?? null,
        },
        options: options.map((option, sortOrder) => ({
            id: option.id,
            shop_attribute_id: option.shopAttributeId ?? null,
            name: option.shopAttributeId === null || option.shopAttributeId === undefined ? (option.localName ?? option.name) : null,
            sort_order: sortOrder,
            values: option.values.map((value, valueSortOrder) => ({
                id: value.id,
                shop_attribute_option_id: value.shopAttributeOptionId ?? null,
                value: value.shopAttributeOptionId === null || value.shopAttributeOptionId === undefined ? (value.localValue ?? value.label) : null,
                sort_order: valueSortOrder,
            })),
        })),
        variants: combinations.map((combination, sortOrder) => {
            const data = variantData[combination.key] ?? {};

            return {
                id: data.id ?? null,
                selections: combination.selections.map(({ option, value }) => {
                    const savedSelection = data.selections?.find((selection) => sameId(selection.optionId, option.id) && sameId(selection.valueId, value.id));

                    return {
                        id: savedSelection?.id ?? null,
                        option_id: option.id,
                        value_id: value.id,
                    };
                }),
                price: Object.hasOwn(data, 'price') ? data.price : basePrice,
                quantity: data.stock ?? '0',
                sku: data.sku?.trim() || null,
                is_active: data.active ?? true,
                sort_order: data.sortOrder ?? sortOrder,
            };
        }),
        photos,
    };
}

function Icon({ children, size = 16, className = '' }) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

function handleToggleAreaClick(event, onToggle) {
    const nestedControl = event.target.closest('button, input, select, textarea, a, label, [role="button"], [role="switch"]');
    if (nestedControl && nestedControl !== event.currentTarget) return;

    onToggle();
}

function handleToggleAreaKeyDown(event, onToggle) {
    if (event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;

    event.preventDefault();
    onToggle();
}

function PhotoTile({ image, onOpen, ariaLabel }) {
    return (
        <button type="button" data-media-id={image.id} onClick={onOpen} className="relative h-[66px] w-[54px] shrink-0 cursor-zoom-in overflow-hidden rounded-[8px] border border-[#d9d1cb] bg-[#f5f1ee] p-0" aria-label={ariaLabel}>
            <img className="h-full w-full object-cover" src={image.small_url} alt="" draggable={false} />
        </button>
    );
}

function OptionRow({ option, onAddValue, onDeleteOption, onDeleteValue }) {
    const { t } = useTranslation();
    const [isValueFormOpen, setIsValueFormOpen] = useState(false);
    const [newValue, setNewValue] = useState('');
    const [valueError, setValueError] = useState('');

    const closeValueForm = () => {
        setIsValueFormOpen(false);
        setNewValue('');
        setValueError('');
    };
    const addValue = (event) => {
        event.preventDefault();
        const trimmedValue = newValue.trim();

        if (!trimmedValue) {
            setValueError(t('productEditPage.variantModal.optionValueRequired'));
            return;
        }

        const normalizedValue = trimmedValue.toLocaleLowerCase();
        if (option.values.some((value) => value.label.trim().toLocaleLowerCase() === normalizedValue)) {
            setValueError(t('productEditPage.variantModal.optionValueDuplicate'));
            return;
        }

        onAddValue(option.id, trimmedValue);
        closeValueForm();
    };

    return (
        <div className="flex min-w-0 flex-col gap-[7px]">
            <article className="grid min-w-0 grid-cols-[18px_112px_minmax(0,1fr)_30px] items-center gap-3 rounded-[11px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[10px_11px] max-sm:grid-cols-[18px_minmax(0,1fr)_30px]">
                <Icon size={15} className="text-[#aaa19a]"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></Icon>
                <div className="min-w-0"><small className="block text-[11px] text-[#a19992]">{t('productEditPage.variantModal.option')}</small><strong className="block break-words text-[12px]">{option.name}</strong></div>
                <div className="flex min-w-0 flex-wrap gap-[5px] max-sm:col-start-2">
                    {option.values.map((value) => (
                        <button key={value.id} type="button" onClick={() => onDeleteValue(option.id, value.id, option.name, value.label)} className="inline-flex min-h-[29px] max-w-full min-w-0 cursor-pointer items-center gap-[6px] break-words rounded-full border border-[#ddd5cf] bg-[#f8f4f0] px-[10px] text-left text-[11px] text-[#5d554f]" aria-label={t('productEditPage.variantModal.deleteValueAria', { value: value.label })}>
                            {value.label}<CloseIcon width={11} height={11} />
                        </button>
                    ))}
                    <button type="button" className="inline-flex min-h-[29px] cursor-pointer items-center gap-[5px] rounded-[7px] border border-dashed border-[#d2aaa0] bg-white px-2 text-[11px] font-bold text-[color:var(--color-accent)]" onClick={() => setIsValueFormOpen(true)} aria-expanded={isValueFormOpen}><PlusIcon width={12} height={12} />{t('productEditPage.variantModal.addValue')}</button>
                </div>
                <button type="button" className="grid h-[29px] w-[29px] cursor-pointer place-items-center rounded-[8px] border border-[#e3d7d0] bg-white text-[#c24820]" aria-label={t('productEditPage.variantModal.deleteOptionAria', { option: option.name })} onClick={() => onDeleteOption(option.id)}><TrashIcon size={14} /></button>
            </article>
            {isValueFormOpen && <form className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-end gap-[8px] rounded-[11px] border border-[#dfb596] bg-[linear-gradient(120deg,#fff8f3,#fff)] p-[11px_12px] shadow-[0_8px_22px_rgba(80,49,29,.05)] max-sm:grid-cols-1" onSubmit={addValue}>
                <label className="flex min-w-0 flex-col gap-[5px]"><span className="text-[12px] font-bold text-[#514943]">{t('productEditPage.variantModal.addValueTo', { option: option.name })}</span><input autoFocus className="h-[38px] rounded-[8px] border border-[#d8d0ca] bg-white px-[10px] text-[12px] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]" value={newValue} onChange={(event) => { setNewValue(event.target.value); setValueError(''); }} placeholder={t('productEditPage.variantModal.newValue')} aria-invalid={Boolean(valueError)} />{valueError && <small className="text-[11px] text-[#a6402b]" role="alert">{valueError}</small>}</label>
                <button type="submit" className="button button--primary min-h-[38px] justify-center" disabled={!newValue.trim()}><PlusIcon width={13} height={13} />{t('productEditPage.actions.add')}</button>
                <button type="button" className="grid h-[38px] w-[38px] place-items-center rounded-[8px] border border-[#d8d0ca] bg-white text-[#847a73] max-sm:w-full" onClick={closeValueForm} aria-label={t('productEditPage.variantModal.closeAddValue', { option: option.name })}><CloseIcon width={15} height={15} /></button>
            </form>}
        </div>
    );
}

function AttributePicker({ attributes, addedAttributeIds, createAttributeButtonRef, isLoading, error, onAdd, onClose, onCreateAttribute }) {
    const { t } = useTranslation();

    return (
        <section className="min-w-0 rounded-[12px] border border-[#dfb596] bg-[linear-gradient(120deg,#fff8f3,#fff)] p-[13px] shadow-[0_12px_30px_rgba(80,49,29,.06)]">
            <header className="mb-[11px] flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-[9px]">
                    <span className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[9px] bg-[#f9eee7] text-[color:var(--color-accent)]"><Icon size={15}><path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3zM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15z" /></Icon></span>
                    <p className="m-0 flex min-w-0 flex-col break-words"><strong className="text-[13px]">{t('productEditPage.variantModal.attributePickerTitle')}</strong><small className="mt-[3px] text-[12px] text-[#8e857e]">{t('productEditPage.variantModal.attributePickerHint')}</small></p>
                </div>
                <button type="button" onClick={onClose} className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[8px] border border-[#e2d8d1] bg-white text-[#847a73]" aria-label={t('productEditPage.variantModal.closeAttributePicker')}><CloseIcon width={15} height={15} /></button>
            </header>
            {isLoading && <p className="m-0 rounded-[10px] border border-[color:var(--color-border)] bg-white px-3 py-4 text-center text-[12px] text-[#8f867f]" role="status">{t('productEditPage.variantModal.attributesLoading')}</p>}
            {error && <p className="m-0 rounded-[10px] border border-[#e5c3bd] bg-[#fff7f5] px-3 py-3 text-[12px] text-[#9f3f2b]" role="alert">{error}</p>}
            {!isLoading && !error && attributes.length === 0 && <p className="m-0 rounded-[10px] border border-dashed border-[#ded6d0] bg-white px-3 py-4 text-center text-[12px] text-[#918880]">{t('productEditPage.variantModal.attributesEmpty')}</p>}
            {!isLoading && !error && attributes.length > 0 && <div className="grid grid-cols-2 gap-[7px] max-sm:grid-cols-1">
                {attributes.map((attribute) => {
                    const isAdded = addedAttributeIds.has(attribute.id);
                    const values = (attribute.options ?? []).map((option) => option.value);

                    return (
                        <button key={attribute.id} type="button" disabled={isAdded} onClick={() => onAdd(attribute.id)} className="grid min-h-[76px] cursor-pointer grid-cols-[30px_minmax(0,1fr)] items-center gap-x-[9px] rounded-[10px] border border-[#ddd5cf] bg-white p-[10px] text-left text-[#544c46] transition-colors hover:border-[#d6a88d] disabled:cursor-default disabled:bg-[#f6f3f0] disabled:opacity-70">
                            <span className={`row-span-2 grid h-[30px] w-[30px] place-items-center rounded-[8px] ${isAdded ? 'bg-[#e9f4ec] text-[#3c8354]' : 'bg-[#f9eee7] text-[color:var(--color-accent)]'}`}>{isAdded ? <Icon size={14}><path d="m20 6-11 11-5-5" /></Icon> : <PlusIcon width={14} height={14} />}</span>
                            <p className="m-0 min-w-0 break-words"><strong className="block text-[12px]">{attribute.name}</strong><small className="block text-[11px] text-[#8f867f]">{t(`productEditPage.variantModal.${attribute.type === 'multiselect' ? 'multiselectType' : 'selectType'}`)}</small></p>
                            <em className={`col-start-2 block truncate text-[11px] not-italic ${isAdded ? 'text-[#a06745]' : 'text-[#8f867f]'}`}>{isAdded ? t('productEditPage.variantModal.attributeAdded') : (values.join(', ') || t('productEditPage.variantModal.noValues'))}</em>
                        </button>
                    );
                })}
            </div>}
            <div className="mt-[11px] flex justify-end border-t border-[#eaded6] pt-[11px]">
                <button ref={createAttributeButtonRef} type="button" className="button button--secondary min-h-[36px] cursor-pointer text-[12px] text-[color:var(--color-accent)]" onClick={onCreateAttribute}><PlusIcon width={14} height={14} />{t('productEditPage.variantModal.customOption')}</button>
            </div>
        </section>
    );
}

function PhotoPicker({ valueLabel, images, selectedImageIds, onToggle, onClose, t }) {
    const selectedImageIdSet = new Set(selectedImageIds);

    return (
        <section className="mt-[10px] min-w-0 rounded-[10px] border border-[#dfc0ac] bg-white p-[10px] shadow-[0_12px_28px_rgba(70,45,29,.07)]">
            <header className="flex items-start justify-between gap-3">
                <p className="m-0 flex min-w-0 flex-col break-words"><strong className="text-[12px]">{t('productEditPage.variantPhotos.pickerTitle', { value: valueLabel })}</strong><small className="mt-0.5 text-[11px] text-[#91877f]">{t('productEditPage.variantPhotos.pickerHint')}</small></p>
                <button type="button" onClick={onClose} className="grid h-[27px] w-[27px] shrink-0 place-items-center rounded-[7px] border-0 bg-[#f7f3f0] text-[#81766e]" aria-label={t('productEditPage.variantPhotos.closePicker')}><CloseIcon width={14} height={14} /></button>
            </header>
            {images.length > 0 ? <div className="mt-[9px] grid grid-cols-7 gap-[6px] max-md:grid-cols-4 max-sm:grid-cols-3">
                {images.map((image, index) => {
                    const imageId = String(image.id);
                    const isSelected = selectedImageIdSet.has(imageId);

                    return <button key={image.id} type="button" data-media-id={image.id} aria-pressed={isSelected} aria-label={t('productEditPage.variantPhotos.selectPhoto', { number: index + 1 })} onClick={() => onToggle(imageId)} className={`relative min-w-0 cursor-pointer overflow-hidden rounded-[8px] border-2 bg-[#f4f1ee] p-0 aspect-[.8] ${isSelected ? 'border-[color:var(--color-accent)]' : 'border-transparent'}`}><img className="h-full w-full object-cover" src={image.small_url} alt="" draggable={false} /><b className="absolute bottom-1 left-1 grid h-[17px] min-w-[17px] place-items-center rounded-[5px] bg-white/95 text-[11px] text-[#594f48]">{index + 1}</b>{isSelected && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--color-accent)] text-white"><Icon size={12}><path d="m20 6-11 11-5-5" /></Icon></span>}</button>;
                })}
            </div> : <p className="my-3 rounded-[8px] border border-dashed border-[#d9d0c9] px-3 py-5 text-center text-[11px] text-[#958b83]">{t('productEditPage.variantPhotos.noProductPhotos')}</p>}
            <footer className="mt-[9px] flex items-center justify-between border-t border-[#f0ece8] pt-2 text-[11px] text-[#847a72]"><span>{t('productEditPage.variantPhotos.selectedCount', { count: selectedImageIds.length })}</span><button type="button" onClick={onClose} className="min-h-[31px] rounded-[8px] border-0 bg-[color:var(--color-accent)] px-3 text-[11px] font-bold text-white">{t('productEditPage.variantPhotos.done')}</button></footer>
        </section>
    );
}

function PhotosSection({ options, images, photoState, setPhotoState, dirtyAssignmentKeys, onOpenImage, onChange }) {
    const { t } = useTranslation();
    const [openPicker, setOpenPicker] = useState(null);
    const areVariantPhotosEnabled = photoState.enabled;
    const selectedOptionId = photoState.selectedOptionId;
    const mainValueIds = photoState.mainValueIds;
    const photoAssignments = photoState.assignments;
    const selectedOption = options.find((option) => String(option.id) === selectedOptionId) ?? options[0] ?? null;
    const selectedOptionValue = selectedOption ? String(selectedOption.id) : '';
    const selectedValues = selectedOption?.values ?? [];
    const selectedOptionAssignments = photoAssignments[selectedOptionValue] ?? {};
    const assignedImageIdSet = new Set(Object.values(selectedOptionAssignments).flat());
    const assignedImageCount = images.filter((image) => assignedImageIdSet.has(String(image.id))).length;
    const configuredMainValueId = selectedOption ? mainValueIds[selectedOptionValue] : null;
    const mainValueId = selectedValues.some((value) => String(value.id) === configuredMainValueId)
        ? configuredMainValueId
        : String(selectedValues[0]?.id ?? '');

    useEffect(() => {
        setPhotoState((current) => {
            const selectedId = options.length === 0 || options.some((option) => String(option.id) === current.selectedOptionId)
                ? current.selectedOptionId
                : String(options[0].id);

            return selectedId === current.selectedOptionId ? current : { ...current, selectedOptionId: selectedId };
        });
    }, [options, setPhotoState]);

    useEffect(() => {
        const orderedImageIds = images.map((image) => String(image.id));

        setPhotoState((current) => {
            let hasChanges = false;
            const assignments = Object.fromEntries(Object.entries(current.assignments).map(([optionId, valueAssignments]) => [
                optionId,
                Object.fromEntries(Object.entries(valueAssignments).map(([valueId, assignedIds]) => {
                    const assignedIdSet = new Set(assignedIds);
                    const nextIds = orderedImageIds.filter((imageId) => assignedIdSet.has(imageId));
                    if (nextIds.length !== assignedIds.length || nextIds.some((imageId, index) => imageId !== assignedIds[index])) hasChanges = true;
                    return [valueId, nextIds];
                })),
            ]));

            return hasChanges ? { ...current, assignments } : current;
        });
    }, [images, setPhotoState]);

    const setMainValue = (valueId) => {
        if (!selectedOption) return;

        onChange();
        setPhotoState((current) => ({
            ...current,
            mainValueIds: {
                ...current.mainValueIds,
                [selectedOptionValue]: String(valueId),
            },
        }));
    };
    const openPhotoPicker = (valueId) => {
        const normalizedValueId = String(valueId);
        setOpenPicker({ optionId: selectedOptionValue, valueId: normalizedValueId });
    };
    const closePhotoPicker = () => {
        setOpenPicker(null);
    };
    const toggleAssignedPhoto = (valueId, imageId) => {
        const normalizedValueId = String(valueId);
        const normalizedImageId = String(imageId);
        onChange();
        setPhotoState((current) => {
            const assignedIds = current.assignments[selectedOptionValue]?.[normalizedValueId] ?? [];
            const selectedImageIdSet = new Set(assignedIds);

            if (selectedImageIdSet.has(normalizedImageId)) {
                selectedImageIdSet.delete(normalizedImageId);
            } else {
                selectedImageIdSet.add(normalizedImageId);
            }

            const orderedImageIds = images
                .map((image) => String(image.id))
                .filter((currentImageId) => selectedImageIdSet.has(currentImageId));

            return {
                ...current,
                assignments: {
                    ...current.assignments,
                    [selectedOptionValue]: {
                        ...current.assignments[selectedOptionValue],
                        [normalizedValueId]: orderedImageIds,
                    },
                },
            };
        });
    };
    const removeAssignedPhoto = (valueId, imageId) => {
        const normalizedValueId = String(valueId);
        const normalizedImageId = String(imageId);
        onChange();
        setPhotoState((current) => ({
            ...current,
            assignments: {
                ...current.assignments,
                [selectedOptionValue]: {
                    ...current.assignments[selectedOptionValue],
                    [normalizedValueId]: (current.assignments[selectedOptionValue]?.[normalizedValueId] ?? []).filter((assignedId) => assignedId !== normalizedImageId),
                },
            },
        }));
    };
    const toggleVariantPhotos = () => {
        onChange();
        setPhotoState((current) => ({ ...current, enabled: !current.enabled }));
    };

    if (options.length === 0) return null;

    return (
        <section className="min-w-0 overflow-hidden rounded-[13px] border border-[color:var(--color-border)] bg-white">
            <header className={`grid min-h-[76px] cursor-pointer items-center gap-4 bg-[linear-gradient(100deg,#fff8f3,#fff)] px-[16px] py-3 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(184,79,24,.18)] ${areVariantPhotosEnabled ? 'grid-cols-[48px_minmax(0,1fr)_220px] border-b border-[color:var(--color-border)] max-sm:grid-cols-[48px_minmax(0,1fr)]' : 'grid-cols-[48px_minmax(0,1fr)]'}`} role="switch" tabIndex={0} aria-checked={areVariantPhotosEnabled} aria-label={t('productEditPage.variantPhotos.toggleAria')} onClick={(event) => handleToggleAreaClick(event, toggleVariantPhotos)} onKeyDown={(event) => handleToggleAreaKeyDown(event, toggleVariantPhotos)}>
                <button type="button" className="switch-control switch-control--strong" role="switch" aria-checked={areVariantPhotosEnabled} onClick={toggleVariantPhotos} aria-label={t('productEditPage.variantPhotos.toggleAria')}><i aria-hidden="true"><Icon size={14}><path d="m20 6-11 11-5-5" /></Icon></i></button>
                <p className="m-0 min-w-0 break-words"><strong className="block text-[13px]">{t('productEditPage.variantPhotos.title')}</strong><small className="mt-[3px] block max-w-[620px] text-[12px] leading-[1.45] text-[#8d847d]">{t('productEditPage.variantPhotos.description')}</small></p>
                {areVariantPhotosEnabled && <Field className="max-sm:col-span-full" label={t('productEditPage.variantPhotos.dependsOn')}><Select className="font-bold" value={selectedOptionValue} onChange={(event) => { onChange(); setPhotoState((current) => ({ ...current, selectedOptionId: event.target.value })); }}>{options.map((option) => <option key={option.id} value={String(option.id)}>{option.name}</option>)}</Select></Field>}
            </header>
            {areVariantPhotosEnabled && (images.length === 0
                ? <div className="grid min-h-[220px] place-items-center bg-[#fcfbfa] px-6 py-10 text-center"><div className="flex max-w-[520px] flex-col items-center"><span className="grid h-12 w-12 place-items-center rounded-[13px] bg-[#f9eee7] text-[color:var(--color-accent)]"><ImageIcon /></span><strong className="mt-3 block text-[14px] text-[#514943]">{t('productEditPage.variantPhotos.addProductPhotosFirst')}</strong><p className="mb-0 mt-1.5 text-[12px] leading-[1.5] text-[#8d847d]">{t('productEditPage.variantPhotos.addProductPhotosFirstHint')}</p></div></div>
                : <>
                <div className="grid min-w-0 grid-cols-[minmax(190px,.7fr)_minmax(0,1.3fr)_auto] items-center gap-3 border-b border-[color:var(--color-border)] bg-[#faf8f6] px-[16px] py-3 max-md:grid-cols-1"><div className="min-w-0 break-words"><strong className="block text-[12px]">{t('productEditPage.variantPhotos.galleryTitle')}</strong><small className="mt-[3px] block text-[11px] text-[#8f867f]">{t('productEditPage.variantPhotos.galleryDescription')}</small></div><div className="flex min-w-0 gap-[7px] overflow-x-auto">{images.map((image, index) => <PhotoTile key={image.id} image={image} onOpen={() => onOpenImage(index)} ariaLabel={t('productEditPage.variantPhotos.openPhoto', { number: index + 1 })} />)}</div><div className="flex min-w-0 flex-wrap gap-2 text-[11px]"><span className="rounded-full bg-[#eaf4ec] px-2 py-1 font-bold text-[#3c8354]">{t('productEditPage.variantPhotos.assignedCount', { count: assignedImageCount })}</span><span className="rounded-full bg-[#fff0e7] px-2 py-1 font-bold text-[color:var(--color-accent)]">{t('productEditPage.variantPhotos.unassignedCount', { count: images.length - assignedImageCount })}</span></div></div>
                <div className="flex flex-col gap-[9px] p-[13px_14px]">
                    {selectedOption && selectedValues.length === 0 && <div className="rounded-[11px] border border-dashed border-[#d9d0c9] bg-[#fcfbfa] px-4 py-8 text-center"><strong className="block text-[12px] text-[#665e57]">{t('productEditPage.variantPhotos.noOptionValues')}</strong></div>}
                    {selectedValues.map((value) => {
                        const valueId = String(value.id);
                        const isMain = valueId === mainValueId;
                        const assignedImageIdSet = new Set(selectedOptionAssignments[valueId] ?? []);
                        const assignedImages = images.filter((image) => assignedImageIdSet.has(String(image.id)));
                        const pickerIsOpen = openPicker?.optionId === selectedOptionValue && openPicker.valueId === valueId;
                        const hasUnsavedPhotoChanges = dirtyAssignmentKeys.has(photoAssignmentKey(selectedOptionValue, valueId));

                        return <article key={value.id} className={`min-w-0 rounded-[11px] border p-[8px_10px] ${isMain ? 'border-[#dcae92] bg-[#fffaf7]' : 'border-[color:var(--color-border)] bg-[#fcfbfa]'}`}><div className="flex min-w-0 flex-wrap items-center gap-x-[10px] gap-y-[7px]"><span className="min-w-[105px] max-w-full shrink-0 break-words"><strong className="block text-[12px]">{value.label}</strong>{assignedImages.length > 0 && <small className="text-[11px] text-[#928981]">{t('productEditPage.variantPhotos.valuePhotoCount', { count: assignedImages.length })}</small>}</span><div className="flex min-w-[150px] flex-1 flex-col items-start gap-[6px]"><div className="flex min-w-0 flex-wrap items-center gap-[6px]">{assignedImages.map((image, index) => { const galleryIndex = images.findIndex((galleryImage) => galleryImage.id === image.id); return <div key={image.id} data-media-id={image.id} className="relative h-[54px] w-[44px] shrink-0 overflow-hidden rounded-[7px] border border-[#d9d1cb] bg-[#f5f1ee]"><button type="button" className="block h-full w-full cursor-zoom-in border-0 bg-transparent p-0" onClick={() => onOpenImage(galleryIndex)} aria-label={t('productEditPage.variantPhotos.openPhoto', { number: galleryIndex + 1 })}><img className="h-full w-full object-cover" src={image.small_url} alt="" draggable={false} /><b className="absolute bottom-[3px] left-[3px] grid h-[16px] min-w-[16px] place-items-center rounded-[4px] bg-white/95 text-[10px] text-[#594f48]">{index + 1}</b></button><button type="button" onClick={() => removeAssignedPhoto(valueId, image.id)} className="absolute right-[2px] top-[2px] grid h-[18px] w-[18px] place-items-center rounded-full border-0 bg-white/95 text-[#766b63]" aria-label={t('productEditPage.variantPhotos.removePhoto', { value: value.label })}><CloseIcon width={10} height={10} /></button></div>; })}<button type="button" onClick={() => openPhotoPicker(valueId)} className="inline-flex min-h-[54px] max-w-full min-w-0 cursor-pointer items-center justify-center gap-[6px] break-words rounded-[7px] border border-dashed border-[#d0b09d] bg-white px-[10px] text-[11px] font-bold text-[color:var(--color-accent)]"><PlusIcon size={13} />{t('productEditPage.variantPhotos.addPhoto')}</button></div>{hasUnsavedPhotoChanges && <span className="flex max-w-full items-center gap-[5px] break-words text-[11px] font-medium text-[#a56f4f]" role="status"><span className="shrink-0" aria-hidden="true"><InfoIcon /></span>{t('productEditPage.variantPhotos.unsavedChanges')}</span>}</div><button type="button" onClick={() => setMainValue(valueId)} className={`ml-auto inline-flex min-h-[30px] max-w-full min-w-0 cursor-pointer items-center gap-[5px] break-words rounded-[8px] px-2 text-left text-[11px] font-bold ${isMain ? 'border border-[#c4531c] bg-[#fff4ec] text-[color:var(--color-accent)]' : 'border border-transparent bg-transparent text-[#8d837b]'}`}><Icon size={13} className={`shrink-0 ${isMain ? 'fill-current' : ''}`}><path d="m12 2.5 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6 6.5-.9 3-6Z" /></Icon>{isMain ? t('productEditPage.variantPhotos.mainValue') : t('productEditPage.variantPhotos.setMainValue')}</button></div>{pickerIsOpen && <PhotoPicker valueLabel={value.label} images={images} selectedImageIds={selectedOptionAssignments[valueId] ?? []} onToggle={(imageId) => toggleAssignedPhoto(valueId, imageId)} onClose={closePhotoPicker} t={t} />}</article>;
                    })}
                </div>
            </>)}
        </section>
    );
}

function EmptyVariantsState({ hasAvailableAttributes, createAttributeButtonRef, onAddOption, onCreateAttribute }) {
    const { t } = useTranslation();

    return (
        <section className="grid min-h-[220px] place-items-center rounded-[12px] border border-dashed border-[#d9d0c9] bg-white px-4 py-8 text-center">
            <div className="flex flex-col items-center">
                <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-[#f9eee7] text-[color:var(--color-accent)]"><LayersIcon /></span>
                <strong className="mt-3 block max-w-[520px] text-[14px] leading-[1.5] text-[#514943]">{t(`productEditPage.variantModal.${hasAvailableAttributes ? 'emptyOptionsTitle' : 'emptyAttributesTitle'}`)}</strong>
                {hasAvailableAttributes
                    ? <button type="button" className="button button--primary mt-4 cursor-pointer" onClick={onAddOption}><PlusIcon width={15} height={15} />{t('productEditPage.variantModal.addFirstOption')}</button>
                    : <button ref={createAttributeButtonRef} type="button" className="button button--primary mt-4 cursor-pointer" onClick={onCreateAttribute}><PlusIcon width={15} height={15} />{t('productEditPage.variantModal.createAttribute')}</button>}
            </div>
        </section>
    );
}

function VariantsSection({ combinations, totalCount, variantData, basePrice, separatePrices, showPriceSettings, onTogglePrices, onVariantChange }) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState([]);
    const [bulkEditor, setBulkEditor] = useState(null);
    const [bulkValue, setBulkValue] = useState('');
    const [bulkError, setBulkError] = useState('');
    const selectAllRef = useRef(null);
    const combinationKeys = combinations.map((combination) => combination.key);
    const visibleSelected = selected.filter((key) => combinationKeys.includes(key));
    const allSelected = combinations.length > 0 && visibleSelected.length === combinations.length;
    const toggleRow = (key) => setSelected((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
    const closeBulkEditor = () => {
        setBulkEditor(null);
        setBulkValue('');
        setBulkError('');
    };
    const openBulkEditor = (field) => {
        if (field === 'price' && !separatePrices) return;
        setBulkEditor(field);
        setBulkValue('');
        setBulkError('');
    };
    const clearSelection = () => {
        setSelected([]);
        closeBulkEditor();
    };
    const setSelectedActivity = (active) => {
        visibleSelected.forEach((key) => onVariantChange(key, { active }));
    };
    const applyBulkValue = (event) => {
        event.preventDefault();
        const value = bulkValue.trim();
        const numberValue = Number(value);
        const isValid = bulkEditor === 'price'
            ? value !== '' && Number.isFinite(numberValue) && numberValue >= 0
            : /^\d+$/.test(value);

        if (!isValid) {
            setBulkError(t(`productEditPage.variantBulk.${bulkEditor === 'price' ? 'priceError' : 'stockError'}`));
            return;
        }

        const nextValue = bulkEditor === 'stock' ? String(numberValue) : value;
        visibleSelected.forEach((key) => onVariantChange(key, { [bulkEditor]: nextValue }));
        closeBulkEditor();
    };

    useEffect(() => {
        if (selectAllRef.current) selectAllRef.current.indeterminate = visibleSelected.length > 0 && !allSelected;
    }, [allSelected, visibleSelected.length]);

    useEffect(() => {
        if (!separatePrices && bulkEditor === 'price') closeBulkEditor();
    }, [bulkEditor, separatePrices]);

    return (
        <>
            {showPriceSettings && <section className="grid min-w-0 cursor-pointer grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-[12px] border border-[#e0b292] bg-[#fffaf7] p-[14px_16px] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(184,79,24,.18)]" role="switch" tabIndex={0} aria-checked={separatePrices} aria-label={t('productEditPage.variantModal.separatePricesAria')} onClick={(event) => handleToggleAreaClick(event, onTogglePrices)} onKeyDown={(event) => handleToggleAreaKeyDown(event, onTogglePrices)}>
                <button type="button" className="switch-control switch-control--strong" role="switch" aria-checked={separatePrices} onClick={onTogglePrices} aria-label={t('productEditPage.variantModal.separatePricesAria')}><i aria-hidden="true"><Icon size={14}><path d="m20 6-11 11-5-5" /></Icon></i></button><div className="min-w-0 break-words"><strong className="block text-[13px]">{t('productEditPage.variantModal.separatePricesTitle')}</strong><small className="mt-[3px] block text-[12px] text-[#8c837c]">{t('productEditPage.variantModal.separatePricesHint')}</small></div>
            </section>}
            {totalCount > combinationLimit && <div className="flex items-start gap-2 rounded-[10px] border border-[#ebc8a6] bg-[#fff8ed] p-[11px_13px] text-[#7c5228]"><Icon size={17} className="mt-0.5 shrink-0"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.4 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" /></Icon><p className="m-0 text-[11px] leading-[1.45]"><strong className="block text-[12px] text-[#5d4430]">{t('productEditPage.variantModal.combinationLimitTitle', { count: totalCount })}</strong>{t('productEditPage.variantModal.combinationLimitHint', { limit: combinationLimit })}</p></div>}
            <section className="min-w-0 overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-white">
                <header className="flex min-h-[58px] min-w-0 items-center gap-3 border-b border-[color:var(--color-border)] bg-[#faf8f6] px-[12px]"><div className="min-w-0 break-words"><div className="flex min-w-0 flex-wrap items-center gap-2"><strong className="text-[13px]">{t('productEditPage.variantModal.combinationsTitle')}</strong><span className="rounded-full bg-[#eee9e5] px-2 py-1 text-[10px] font-bold text-[#746b64]">{t(totalCount > combinationLimit ? 'productEditPage.variantModal.combinationCountLimited' : 'productEditPage.variantModal.combinationCount', { count: combinations.length, total: totalCount })}</span></div><small className="text-[11px] text-[#978f88]">{t('productEditPage.variantModal.combinationsHint')}</small></div></header>
                {visibleSelected.length > 0 && <div className="border-b border-[#ead6ca] bg-[#fff7f1] px-[12px] py-[7px]">
                    <BulkActionsBar
                        selectedCount={visibleSelected.length}
                        countLabel={(count) => t('productEditPage.variantBulk.selectedCount', { count })}
                        className="!min-h-[34px] min-w-0 [&_.button]:max-w-full [&_.button]:min-w-0 [&_.button]:whitespace-normal"
                        actions={[
                            { key: 'price', label: t('productEditPage.variantBulk.editPrice'), disabled: !separatePrices, onClick: () => openBulkEditor('price') },
                            { key: 'stock', label: t('productEditPage.variantBulk.editStock'), onClick: () => openBulkEditor('stock') },
                            { key: 'enable', label: t('productEditPage.variantBulk.enable'), onClick: () => setSelectedActivity(true) },
                            { key: 'disable', label: t('productEditPage.variantBulk.disable'), onClick: () => setSelectedActivity(false) },
                            { key: 'clear', label: t('productEditPage.variantBulk.clearSelection'), onClick: clearSelection },
                        ]}
                    />
                    {bulkEditor && <form className="mt-[7px] flex flex-wrap items-end gap-[7px] border-t border-[#eadfd8] pt-[7px]" onSubmit={applyBulkValue}>
                        <label className="flex min-w-[180px] flex-1 flex-col gap-1"><span className="text-[11px] font-bold text-[#716861]">{t(`productEditPage.variantBulk.${bulkEditor === 'price' ? 'priceLabel' : 'stockLabel'}`)}</span><input autoFocus type="number" min="0" step={bulkEditor === 'price' ? '0.01' : '1'} className="h-[34px] rounded-[7px] border border-[#d8d0ca] bg-white px-[9px] text-[12px] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]" value={bulkValue} onChange={(event) => { setBulkValue(event.target.value); setBulkError(''); }} aria-invalid={Boolean(bulkError)} /></label>
                        <button type="submit" className="button button--primary min-h-[34px] justify-center">{t('productEditPage.variantBulk.apply')}</button>
                        <button type="button" className="button button--secondary min-h-[34px] justify-center" onClick={closeBulkEditor}>{t('productEditPage.variantBulk.cancel')}</button>
                        {bulkError && <small className="w-full text-[11px] text-[#a6402b]" role="alert">{bulkError}</small>}
                    </form>}
                </div>}
                {combinations.length === 0 ? <div className="px-4 py-8 text-center"><strong className="block text-[12px] text-[#665e57]">{t('productEditPage.variantModal.noCombinations')}</strong><small className="mt-1 block text-[11px] text-[#978f88]">{t('productEditPage.variantModal.noCombinationsHint')}</small></div> : <div className="max-w-full min-w-0 overflow-x-auto overscroll-x-contain"><div className="min-w-[820px]"><div className="grid min-h-[34px] grid-cols-[34px_minmax(250px,1.5fr)_120px_100px_130px_70px] items-center gap-[8px] bg-[#f7f4f1] px-[10px] text-[10px] font-bold uppercase text-[#918981]"><input ref={selectAllRef} type="checkbox" className="checkbox-control" checked={allSelected} onChange={() => setSelected(allSelected ? [] : combinationKeys)} aria-label={t('productEditPage.variantBulk.selectAll')} /><span>{t('productEditPage.variantModal.combination')}</span><span>{t('common.price')}</span><span>{t('common.stock')}</span><span>SKU</span><span>{t('productEditPage.variantModal.active')}</span></div>{combinations.map((combination) => {
                        const data = variantData[combination.key];

                        return <div key={combination.key} className="grid min-h-[50px] grid-cols-[34px_minmax(250px,1.5fr)_120px_100px_130px_70px] items-center gap-[8px] border-t border-[#f0ece8] px-[10px]"><input type="checkbox" className="checkbox-control" checked={visibleSelected.includes(combination.key)} onChange={() => toggleRow(combination.key)} aria-label={t('productEditPage.variantModal.selectCombination', { combination: combination.label })} /><strong className="truncate text-[11px]"><i className="mr-2 inline-block h-[9px] w-[9px] rounded-full bg-[#a9683e]" />{combination.label}</strong><label className="relative"><input className="h-[32px] w-full rounded-[7px] border border-[color:var(--color-border)] px-2 pr-9 text-[11px] disabled:bg-[#f2efec]" value={separatePrices ? (data?.price ?? basePrice) : basePrice} disabled={!separatePrices} onChange={(event) => onVariantChange(combination.key, { price: event.target.value })} /><b className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#9a928b]">UAH</b></label><input className="h-[32px] rounded-[7px] border border-[color:var(--color-border)] px-2 text-[11px]" value={data?.stock ?? '0'} onChange={(event) => onVariantChange(combination.key, { stock: event.target.value })} /><input className="h-[32px] rounded-[7px] border border-[color:var(--color-border)] px-2 text-[11px]" value={data?.sku ?? ''} onChange={(event) => onVariantChange(combination.key, { sku: event.target.value })} /><label className="switch" aria-label={t('productEditPage.variantModal.combinationActivity', { combination: combination.label })}><input className="switch__input" type="checkbox" checked={data?.active ?? true} onChange={(event) => onVariantChange(combination.key, { active: event.target.checked })} /><span className="switch__track" /></label></div>;
                    })}</div></div>}
            </section>
        </>
    );
}

export default function ProductVariantsModal({
    isOpen,
    onClose,
    onSaved,
    productId = null,
    basePrice = '',
    media = [],
    productContextVersion = 0,
    isProductContextCurrent = () => true,
}) {
    const { t } = useTranslation();
    const [separatePrices, setSeparatePrices] = useState(false);
    const [areSeparatePricesInitialized, setAreSeparatePricesInitialized] = useState(false);
    const [showOptionPicker, setShowOptionPicker] = useState(false);
    const [isCreateAttributeOpen, setIsCreateAttributeOpen] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const attributesRef = useRef([]);
    const [addedOptions, setAddedOptions] = useState([]);
    const [isAttributesLoading, setIsAttributesLoading] = useState(false);
    const [attributesError, setAttributesError] = useState('');
    const [isVariantsLoading, setIsVariantsLoading] = useState(false);
    const [variantsError, setVariantsError] = useState('');
    const [variantsRequestVersion, setVariantsRequestVersion] = useState(0);
    const [variantData, setVariantData] = useState({});
    const [photoState, setPhotoState] = useState(emptyPhotoState);
    const [savedPhotoAssignments, setSavedPhotoAssignments] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveErrors, setSaveErrors] = useState([]);
    const [saveStatus, setSaveStatus] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const saveOperationRef = useRef(null);
    const addOptionButtonRef = useRef(null);
    const createAttributeButtonRef = useRef(null);
    const images = useMemo(() => media.filter((item) => item.type === 'image'), [media]);
    const lightboxImages = useMemo(() => images.map((item) => ({ id: item.id, src: item.large_url, alt: '' })), [images]);
    const { combinations, totalCount } = useMemo(() => buildCombinations(addedOptions), [addedOptions]);
    const dirtyPhotoAssignments = useMemo(() => dirtyPhotoAssignmentKeys(photoState.assignments, savedPhotoAssignments), [photoState.assignments, savedPhotoAssignments]);
    const normalizedBasePrice = basePrice === null || basePrice === undefined ? '' : String(basePrice);
    const { isTopModal, layerStyle } = useModalLayer(isOpen);

    useEffect(() => {
        if (!isOpen || images.length === 0) setIsLightboxOpen(false);
    }, [images.length, isOpen]);

    useEffect(() => {
        saveOperationRef.current = null;
        setIsSaving(false);
        setSaveStatus(null);
        setSavedPhotoAssignments({});
    }, [productContextVersion]);

    useEffect(() => {
        if (!isOpen) setSaveStatus(null);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !productId) {
            setIsVariantsLoading(false);
            setVariantsError('');
            return undefined;
        }

        let isCurrentRequest = true;
        setIsVariantsLoading(true);
        setVariantsError('');

        getProductVariants(productId)
            .then((loadedVariants) => {
                if (!isCurrentRequest) return;

                const restoredState = restoreProductVariantsState(loadedVariants, attributesRef.current, t);

                setAddedOptions(restoredState.options);
                setVariantData(restoredState.variants);
                setSeparatePrices(restoredState.separatePrices);
                setAreSeparatePricesInitialized(restoredState.separatePricesInitialized);
                setPhotoState(restoredState.photos);
                setSavedPhotoAssignments(restoredState.photos.assignments);
                setSaveErrors([]);
            })
            .catch((error) => {
                if (!isCurrentRequest) return;

                console.error('Unable to load product variants.', error);
                setVariantsError(t('productEditPage.variantModal.variantsLoadError'));
            })
            .finally(() => {
                if (isCurrentRequest) setIsVariantsLoading(false);
            });

        return () => {
            isCurrentRequest = false;
        };
    }, [isOpen, productId, variantsRequestVersion]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const controller = new AbortController();
        setShowOptionPicker(false);
        setIsCreateAttributeOpen(false);
        setDeleteWarning(null);
        setAttributes([]);
        attributesRef.current = [];
        setAttributesError('');
        setSaveErrors([]);
        setSaveStatus(null);
        setIsAttributesLoading(true);

        getShopAttributes({ signal: controller.signal })
            .then((loadedAttributes) => {
                if (controller.signal.aborted) return;

                const supportedAttributes = loadedAttributes.filter((attribute) => variantAttributeTypes.includes(attribute.type));
                attributesRef.current = supportedAttributes;
                setAttributes(supportedAttributes);
                setAddedOptions((current) => applyAttributeDetails(current, supportedAttributes));
            })
            .catch((error) => {
                if (error.name === 'AbortError') return;

                console.error('Unable to load product attributes for variants.', error);
                setAttributesError(t('productEditPage.variantModal.attributesLoadError'));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsAttributesLoading(false);
            });

        return () => controller.abort();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKeyDown = (event) => {
            if (event.key !== 'Escape' || !isTopModal) return;
            if (isLightboxOpen) {
                setIsLightboxOpen(false);
                return;
            }
            if (isSaving) return;

            onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, isOpen, isSaving, isTopModal, onClose]);

    useEffect(() => {
        if (isVariantsLoading || combinations.length === 0) return;

        setVariantData((current) => {
            let next = current;

            for (const [sortOrder, combination] of combinations.entries()) {
                if (Object.hasOwn(current, combination.key)) continue;
                if (next === current) next = { ...current };
                next[combination.key] = { price: normalizedBasePrice, stock: '0', sku: '', active: true, sortOrder };
            }

            return next;
        });
    }, [combinations, isVariantsLoading, normalizedBasePrice]);

    if (!isOpen) return null;

    const addedAttributeIds = new Set(addedOptions
        .map((option) => option.shopAttributeId)
        .filter((attributeId) => attributeId !== null && attributeId !== undefined));
    const selectedValuesCount = addedOptions.reduce((count, option) => count + option.values.length, 0);
    const markVariantsChanged = () => {
        setSaveStatus((current) => current === 'success' ? null : current);
    };
    const addAttributeToOptions = (attribute) => {
        if (!attribute) return;

        const availableValues = attributeValues(attribute);
        markVariantsChanged();
        setAddedOptions((current) => current.some((option) => sameId(option.shopAttributeId, attribute.id))
            ? current
            : [...current, {
                id: temporaryId('option'),
                shopAttributeId: attribute.id,
                localName: null,
                name: attribute.name,
                type: attribute.type,
                sortOrder: current.length,
                availableValues,
                values: availableValues.map((value, sortOrder) => ({
                    id: temporaryId('value'),
                    shopAttributeOptionId: value.shopAttributeOptionId,
                    localValue: null,
                    label: value.label,
                    sortOrder,
                })),
            }]);
    };
    const addAttribute = (attributeId) => {
        addAttributeToOptions(attributes.find((item) => sameId(item.id, attributeId)));
    };
    const handleAttributeCreated = (createdAttribute) => {
        if (!variantAttributeTypes.includes(createdAttribute.type)) return;

        const nextAttributes = [
            ...attributes.filter((attribute) => !sameId(attribute.id, createdAttribute.id)),
            createdAttribute,
        ];

        attributesRef.current = nextAttributes;
        setAttributes(nextAttributes);
        addAttributeToOptions(createdAttribute);
        setShowOptionPicker(false);
        setIsCreateAttributeOpen(false);
    };
    const removeAttribute = (attributeId) => {
        markVariantsChanged();
        setAddedOptions((current) => current.filter((option) => option.id !== attributeId));
        setDeleteWarning(null);
    };
    const addOptionValue = (attributeId, valueLabel) => {
        const trimmedValue = valueLabel.trim();
        if (!trimmedValue) return;

        markVariantsChanged();
        const normalizedValue = trimmedValue.toLocaleLowerCase();
        setAddedOptions((current) => current.map((option) => {
            if (option.id !== attributeId || option.values.some((value) => value.label.trim().toLocaleLowerCase() === normalizedValue)) return option;

            const sourceValue = option.availableValues.find((value) => value.label.trim().toLocaleLowerCase() === normalizedValue);
            return {
                ...option,
                values: [...option.values, {
                    id: temporaryId('value'),
                    shopAttributeOptionId: sourceValue?.shopAttributeOptionId ?? null,
                    localValue: sourceValue ? null : trimmedValue,
                    label: sourceValue?.label ?? trimmedValue,
                    sortOrder: option.values.length,
                }],
            };
        }));
    };
    const removeOptionValue = (attributeId, valueId) => {
        markVariantsChanged();
        setAddedOptions((current) => current.map((option) => option.id === attributeId
            ? { ...option, values: option.values.filter((value) => value.id !== valueId) }
            : option));
        setDeleteWarning(null);
    };
    const updateVariant = (key, fields) => {
        markVariantsChanged();
        setVariantData((current) => ({
            ...current,
            [key]: {
                price: normalizedBasePrice,
                stock: '0',
                sku: '',
                active: true,
                ...current[key],
                ...fields,
            },
        }));
    };
    const toggleSeparatePrices = () => {
        markVariantsChanged();
        if (!separatePrices && !areSeparatePricesInitialized) {
            setVariantData((current) => {
                const next = { ...current };

                for (const combination of combinations) {
                    next[combination.key] = {
                        stock: '0',
                        sku: '',
                        active: true,
                        ...current[combination.key],
                        price: normalizedBasePrice,
                    };
                }

                return next;
            });
            setAreSeparatePricesInitialized(true);
        }

        setSeparatePrices((current) => !current);
    };
    const saveVariants = async () => {
        if (!productId) return;

        const contextVersion = productContextVersion;
        if (saveOperationRef.current?.contextVersion === contextVersion) return;

        const operation = { contextVersion };
        saveOperationRef.current = operation;
        setIsSaving(true);
        setSaveErrors([]);
        setSaveStatus(null);

        try {
            const savedProductId = productId;

            if (!isProductContextCurrent(contextVersion, savedProductId)) return;

            const savedVariants = await updateProductVariants(savedProductId, buildProductVariantsPayload({
                options: addedOptions,
                combinations,
                variantData,
                separatePrices,
                photoState,
                basePrice: normalizedBasePrice,
            }));

            if (!isProductContextCurrent(contextVersion, savedProductId)) return;

            const restoredState = restoreProductVariantsState(savedVariants, attributesRef.current, t);

            setAddedOptions(restoredState.options);
            setVariantData(restoredState.variants);
            setSeparatePrices(restoredState.separatePrices);
            setAreSeparatePricesInitialized(restoredState.separatePricesInitialized);
            setPhotoState(restoredState.photos);
            setSavedPhotoAssignments(restoredState.photos.assignments);
            setSaveStatus('success');
            onSaved?.(savedVariants);
        } catch (error) {
            if (!isProductContextCurrent(contextVersion)) return;

            console.error('Unable to save product variants.', error);
            setSaveErrors(validationMessages(error, t('productEditPage.variantModal.saveFallbackError')));
            setSaveStatus(null);
        } finally {
            if (saveOperationRef.current === operation) {
                saveOperationRef.current = null;
                if (isProductContextCurrent(contextVersion)) setIsSaving(false);
            }
        }
    };
    return (
        <>
            <div className="modal-overlay" style={layerStyle} role="presentation" onMouseDown={isSaving || !isTopModal ? undefined : onClose}>
                <section className="modal-dialog flex h-[min(900px,calc(100vh-40px))] max-w-full min-w-0 !w-[min(1380px,100%)] flex-col bg-[#fbfaf8] max-sm:h-full max-sm:!w-full" role="dialog" aria-modal={isTopModal ? 'true' : undefined} aria-labelledby="variant-manager-title" aria-hidden={isTopModal ? undefined : 'true'} inert={!isTopModal} onMouseDown={(event) => event.stopPropagation()}>
                <header className="flex min-w-0 shrink-0 items-start justify-between gap-[18px] border-b border-[color:var(--color-border)] bg-white px-7 pb-[18px] pt-5 max-sm:px-4"><div className="min-w-0 break-words"><small className="text-[11px] font-bold uppercase tracking-[.05em] text-[color:var(--color-accent)]">{t('productEditPage.variantModal.eyebrow', { product: t('common.product') })}</small><h2 id="variant-manager-title" className="mb-1 mt-[3px] text-[28px] font-[770] tracking-[-.045em] text-[#252525] max-sm:text-[22px]">{t('productEditPage.sections.variants')}</h2><p className="m-0 text-[12px] text-[#887f78]">{t('productEditPage.variantModal.description')}</p></div><button type="button" className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#716861] disabled:cursor-wait disabled:opacity-60" onClick={onClose} disabled={isSaving} aria-label={t('productEditPage.variantModal.closeAria')}><CloseIcon width={20} height={20} /></button></header>
                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-7 py-[20px] max-sm:px-[14px]"><div className="flex min-w-0 flex-col gap-3" aria-busy={isVariantsLoading || isSaving}>
                    {isVariantsLoading && <div className="grid min-h-[180px] place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#f8f5f2]" role="status" aria-label={t('productEditPage.variantModal.loadingAria')}><span className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#d8cbc2] border-t-[color:var(--color-accent)]" aria-hidden="true" /></div>}
                    {!isVariantsLoading && variantsError && <Alert variant="error"><span className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2"><span>{variantsError}</span><button type="button" className="button button--secondary min-h-[32px] shrink-0 justify-center" onClick={() => setVariantsRequestVersion((current) => current + 1)}>{t('productEditPage.variantModal.retry')}</button></span></Alert>}
                    {!isVariantsLoading && !variantsError && <>
                    {saveErrors.length > 0 && <Alert variant="error" className="items-start"><span className="min-w-0"><strong className="block">{t('productEditPage.variantModal.saveErrorTitle')}</strong>{saveErrors.map((message) => <span key={message} className="mt-0.5 block font-medium text-[#766d66]">{message}</span>)}</span></Alert>}
                    <div className="flex min-w-0 items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch"><div className="min-w-0 break-words"><strong className="block text-[13px]">{t('productEditPage.variantModal.optionsTitle')}</strong><small className="text-[12px] text-[#968e87]">{t('productEditPage.variantModal.optionsDescription', { appName })}</small></div>{addedOptions.length > 0 && <button ref={addOptionButtonRef} type="button" className="button button--primary min-h-[40px] min-w-0 shrink-0 cursor-pointer justify-center whitespace-normal" onClick={() => setShowOptionPicker((current) => !current)} aria-expanded={showOptionPicker}><PlusIcon width={15} height={15} />{t('productEditPage.variantModal.addOption')}</button>}</div>
                    {showOptionPicker && <AttributePicker attributes={attributes} addedAttributeIds={addedAttributeIds} createAttributeButtonRef={createAttributeButtonRef} isLoading={isAttributesLoading} error={attributesError} onAdd={addAttribute} onClose={() => setShowOptionPicker(false)} onCreateAttribute={() => setIsCreateAttributeOpen(true)} />}
                    {addedOptions.map((option) => <OptionRow key={option.id} option={option} onAddValue={addOptionValue} onDeleteOption={removeAttribute} onDeleteValue={(optionId, valueId, optionName, valueName) => setDeleteWarning({ optionId, valueId, optionName, valueName })} />)}
                    {deleteWarning && <div className="flex min-w-0 items-start gap-3 rounded-[10px] border border-[#e5c3bd] bg-[#fff7f5] p-[11px_13px] text-[#a6402b] max-sm:grid max-sm:grid-cols-[20px_minmax(0,1fr)]" role="alert"><TrashIcon /><p className="m-0 min-w-0 flex-1 break-words text-[11px] leading-[1.45]"><strong className="block text-[12px] text-[#633b33]">{t('productEditPage.variantModal.deleteValueTitle', { value: deleteWarning.valueName })}</strong>{t('productEditPage.variantModal.deleteValueWarning', { option: deleteWarning.optionName })}</p><div className="flex min-w-0 shrink-0 gap-2 max-sm:col-start-2 max-sm:flex-wrap"><button type="button" className="max-w-full min-w-0 rounded-[7px] border border-[#d9c9bf] bg-white px-2 py-1.5 text-[11px] font-bold text-[#5d554f]" onClick={() => setDeleteWarning(null)}>{t('productEditPage.actions.cancel')}</button><button type="button" className="max-w-full min-w-0 rounded-[7px] border border-[#d79d8e] bg-white px-2 py-1.5 text-[11px] font-bold text-[#a6402b]" onClick={() => removeOptionValue(deleteWarning.optionId, deleteWarning.valueId)}>{t('productEditPage.variantModal.deleteValue')}</button></div></div>}
                    {addedOptions.length === 0 && !showOptionPicker && <EmptyVariantsState hasAvailableAttributes={isAttributesLoading || Boolean(attributesError) || attributes.length > 0} createAttributeButtonRef={createAttributeButtonRef} onAddOption={() => setShowOptionPicker(true)} onCreateAttribute={() => setIsCreateAttributeOpen(true)} />}
                    {addedOptions.length > 0 && <><PhotosSection options={addedOptions} images={images} photoState={photoState} setPhotoState={setPhotoState} dirtyAssignmentKeys={dirtyPhotoAssignments} onOpenImage={(index) => { setLightboxIndex(index); setIsLightboxOpen(true); }} onChange={markVariantsChanged} /><VariantsSection combinations={combinations} totalCount={totalCount} variantData={variantData} basePrice={normalizedBasePrice} separatePrices={separatePrices} showPriceSettings onTogglePrices={toggleSeparatePrices} onVariantChange={updateVariant} /></>}
                    </>}
                </div></div>
                <footer className="flex min-h-[76px] min-w-0 shrink-0 items-center gap-3 border-t border-[color:var(--color-border)] bg-white px-7 py-[11px] max-sm:grid max-sm:grid-cols-1 max-sm:px-[14px] max-sm:pb-[calc(11px+env(safe-area-inset-bottom))]"><div className="flex min-w-0 flex-1 flex-col max-sm:col-span-full"><span className="break-words text-[12px] font-bold">{t('productEditPage.variants.optionCount', { count: addedOptions.length })} · {t('productEditPage.variants.valueCount', { count: selectedValuesCount })}</span><small className="break-words text-[11px] text-[#928981]">{t('productEditPage.variantModal.footerHint')}</small></div><SaveStatus status={isSaving ? 'saving' : saveStatus} className="max-sm:col-span-full" /><button type="button" className="button button--secondary min-h-[42px] min-w-0 justify-center whitespace-normal max-sm:w-full" onClick={onClose} disabled={isSaving}>{t('productEditPage.variantModal.close')}</button><button type="button" className="button button--primary min-h-[42px] min-w-0 justify-center whitespace-normal disabled:cursor-wait disabled:opacity-70 max-sm:w-full" onClick={() => void saveVariants()} disabled={!productId || isSaving || isVariantsLoading || Boolean(variantsError)}>{isSaving ? <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : <SaveIcon />}{isSaving ? t('common.saveStatus.saving') : t('productEditPage.variantModal.save')}</button></footer>
                </section>
            </div>
            <CreateAttributeModal
                isOpen={isCreateAttributeOpen}
                initialType="select"
                allowedTypes={variantAttributeTypes}
                returnFocusRef={createAttributeButtonRef}
                fallbackFocusRef={addOptionButtonRef}
                onClose={() => setIsCreateAttributeOpen(false)}
                onCreated={handleAttributeCreated}
            />
            <ImageLightbox images={lightboxImages} index={lightboxIndex} open={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} onIndexChange={setLightboxIndex} />
        </>
    );
}
