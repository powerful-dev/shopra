import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BulkActionsBar from '../../components/admin/BulkActionsBar';
import ImageLightbox from '../../components/admin/ImageLightbox';
import Select from '../../components/form/Select';
import CloseIcon from '../../components/icons/CloseIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import SaveIcon from '../../components/icons/SaveIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import { getShopAttributes } from '../../services/shopAttributes';

const combinationLimit = 100;

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
        })),
    };
}

function Icon({ children, size = 16, className = '' }) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

function PhotoTile({ image, onOpen, ariaLabel }) {
    return (
        <button type="button" data-media-id={image.id} onClick={onOpen} className="relative h-[66px] w-[54px] shrink-0 cursor-zoom-in overflow-hidden rounded-[8px] border border-[#d9d1cb] bg-[#f5f1ee] p-0" aria-label={ariaLabel}>
            <img className="h-full w-full object-cover" src={image.small_url} alt="" draggable={false} />
        </button>
    );
}

function OptionRow({ option, onAddValue, onDeleteOption, onDeleteValue }) {
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
            setValueError('Введите значение.');
            return;
        }

        const normalizedValue = trimmedValue.toLocaleLowerCase();
        if (option.values.some((value) => value.label.trim().toLocaleLowerCase() === normalizedValue)) {
            setValueError('Такое значение уже добавлено.');
            return;
        }

        onAddValue(option.id, trimmedValue);
        closeValueForm();
    };

    return (
        <div className="flex flex-col gap-[7px]">
            <article className="grid grid-cols-[18px_112px_minmax(0,1fr)_30px] items-center gap-3 rounded-[11px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[10px_11px] max-sm:grid-cols-[18px_minmax(0,1fr)_30px]">
                <Icon size={15} className="text-[#aaa19a]"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></Icon>
                <div><small className="block text-[11px] text-[#a19992]">Опция</small><strong className="text-[12px]">{option.name}</strong></div>
                <div className="flex flex-wrap gap-[5px] max-sm:col-start-2">
                    {option.values.map((value) => (
                        <button key={value.id} type="button" onClick={() => onDeleteValue(option.id, value.id, option.name, value.label)} className="inline-flex min-h-[29px] items-center gap-[6px] rounded-full border border-[#ddd5cf] bg-[#f8f4f0] px-[10px] text-[11px] text-[#5d554f]" aria-label={`Удалить значение ${value.label}`}>
                            {value.label}<CloseIcon width={11} height={11} />
                        </button>
                    ))}
                    <button type="button" className="inline-flex min-h-[29px] items-center gap-[5px] rounded-[7px] border border-dashed border-[#d2aaa0] bg-white px-2 text-[11px] font-bold text-[color:var(--color-accent)]" onClick={() => setIsValueFormOpen(true)} aria-expanded={isValueFormOpen}><PlusIcon width={12} height={12} />Добавить значение</button>
                </div>
                <button type="button" className="grid h-[29px] w-[29px] place-items-center rounded-[8px] border border-[#e3d7d0] bg-white text-[#c24820]" aria-label={`Удалить опцию ${option.name}`} onClick={() => onDeleteOption(option.id)}><TrashIcon size={14} /></button>
            </article>
            {isValueFormOpen && <form className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-end gap-[8px] rounded-[11px] border border-[#dfb596] bg-[linear-gradient(120deg,#fff8f3,#fff)] p-[11px_12px] shadow-[0_8px_22px_rgba(80,49,29,.05)] max-sm:grid-cols-1" onSubmit={addValue}>
                <label className="flex min-w-0 flex-col gap-[5px]"><span className="text-[12px] font-bold text-[#514943]">Добавить значение в «{option.name}»</span><input autoFocus className="h-[38px] rounded-[8px] border border-[#d8d0ca] bg-white px-[10px] text-[12px] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]" value={newValue} onChange={(event) => { setNewValue(event.target.value); setValueError(''); }} placeholder="Новое значение" aria-invalid={Boolean(valueError)} />{valueError && <small className="text-[11px] text-[#a6402b]" role="alert">{valueError}</small>}</label>
                <button type="submit" className="button button--primary min-h-[38px] justify-center" disabled={!newValue.trim()}><PlusIcon width={13} height={13} />Добавить</button>
                <button type="button" className="grid h-[38px] w-[38px] place-items-center rounded-[8px] border border-[#d8d0ca] bg-white text-[#847a73] max-sm:w-full" onClick={closeValueForm} aria-label={`Закрыть добавление значения в ${option.name}`}><CloseIcon width={15} height={15} /></button>
            </form>}
        </div>
    );
}

function AttributePicker({ attributes, addedAttributeIds, isLoading, error, onAdd, onClose }) {
    return (
        <section className="rounded-[12px] border border-[#dfb596] bg-[linear-gradient(120deg,#fff8f3,#fff)] p-[13px] shadow-[0_12px_30px_rgba(80,49,29,.06)]">
            <header className="mb-[11px] flex items-start justify-between gap-3">
                <div className="flex items-start gap-[9px]">
                    <span className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[9px] bg-[#f9eee7] text-[color:var(--color-accent)]"><Icon size={15}><path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3zM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15z" /></Icon></span>
                    <p className="m-0 flex flex-col"><strong className="text-[13px]">Характеристики из справочника</strong><small className="mt-[3px] text-[12px] text-[#8e857e]">Добавьте только то, что действительно нужно этому товару.</small></p>
                </div>
                <button type="button" onClick={onClose} className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[8px] border border-[#e2d8d1] bg-white text-[#847a73]" aria-label="Закрыть выбор характеристик"><CloseIcon width={15} height={15} /></button>
            </header>
            {isLoading && <p className="m-0 rounded-[10px] border border-[color:var(--color-border)] bg-white px-3 py-4 text-center text-[12px] text-[#8f867f]" role="status">Загрузка доступных характеристик…</p>}
            {error && <p className="m-0 rounded-[10px] border border-[#e5c3bd] bg-[#fff7f5] px-3 py-3 text-[12px] text-[#9f3f2b]" role="alert">{error}</p>}
            {!isLoading && !error && attributes.length === 0 && <p className="m-0 rounded-[10px] border border-dashed border-[#ded6d0] bg-white px-3 py-4 text-center text-[12px] text-[#918880]">Характеристики типов «Список» и «Множественный список» ещё не созданы.</p>}
            {!isLoading && !error && attributes.length > 0 && <div className="grid grid-cols-2 gap-[7px] max-sm:grid-cols-1">
                {attributes.map((attribute) => {
                    const isAdded = addedAttributeIds.has(attribute.id);
                    const values = (attribute.options ?? []).map((option) => option.value);

                    return (
                        <button key={attribute.id} type="button" disabled={isAdded} onClick={() => onAdd(attribute.id)} className="grid min-h-[76px] grid-cols-[30px_minmax(0,1fr)] items-center gap-x-[9px] rounded-[10px] border border-[#ddd5cf] bg-white p-[10px] text-left text-[#544c46] transition-colors hover:border-[#d6a88d] disabled:cursor-default disabled:bg-[#f6f3f0] disabled:opacity-70">
                            <span className={`row-span-2 grid h-[30px] w-[30px] place-items-center rounded-[8px] ${isAdded ? 'bg-[#e9f4ec] text-[#3c8354]' : 'bg-[#f9eee7] text-[color:var(--color-accent)]'}`}>{isAdded ? <Icon size={14}><path d="m20 6-11 11-5-5" /></Icon> : <PlusIcon width={14} height={14} />}</span>
                            <p className="m-0 min-w-0"><strong className="block text-[12px]">{attribute.name}</strong><small className="block text-[11px] text-[#8f867f]">{attribute.type === 'multiselect' ? 'Множественный список' : 'Список'}</small></p>
                            <em className={`col-start-2 block truncate text-[11px] not-italic ${isAdded ? 'text-[#a06745]' : 'text-[#8f867f]'}`}>{isAdded ? 'Добавлено' : (values.join(', ') || 'Нет значений')}</em>
                        </button>
                    );
                })}
            </div>}
        </section>
    );
}

function PhotoPicker({ valueLabel, images, selectedImageIds, onToggle, onCancel, onApply, t }) {
    const selectedImageIdSet = new Set(selectedImageIds);

    return (
        <section className="mt-[10px] rounded-[10px] border border-[#dfc0ac] bg-white p-[10px] shadow-[0_12px_28px_rgba(70,45,29,.07)]">
            <header className="flex items-start justify-between gap-3">
                <p className="m-0 flex flex-col"><strong className="text-[12px]">{t('productEditPage.variantPhotos.pickerTitle', { value: valueLabel })}</strong><small className="mt-0.5 text-[11px] text-[#91877f]">{t('productEditPage.variantPhotos.pickerHint')}</small></p>
                <button type="button" onClick={onCancel} className="grid h-[27px] w-[27px] shrink-0 place-items-center rounded-[7px] border-0 bg-[#f7f3f0] text-[#81766e]" aria-label={t('productEditPage.variantPhotos.closePicker')}><CloseIcon width={14} height={14} /></button>
            </header>
            {images.length > 0 ? <div className="mt-[9px] grid grid-cols-7 gap-[6px] max-md:grid-cols-4 max-sm:grid-cols-3">
                {images.map((image, index) => {
                    const imageId = String(image.id);
                    const isSelected = selectedImageIdSet.has(imageId);

                    return <button key={image.id} type="button" data-media-id={image.id} aria-pressed={isSelected} aria-label={t('productEditPage.variantPhotos.selectPhoto', { number: index + 1 })} onClick={() => onToggle(imageId)} className={`relative min-w-0 cursor-pointer overflow-hidden rounded-[8px] border-2 bg-[#f4f1ee] p-0 aspect-[.8] ${isSelected ? 'border-[color:var(--color-accent)]' : 'border-transparent'}`}><img className="h-full w-full object-cover" src={image.small_url} alt="" draggable={false} /><b className="absolute bottom-1 left-1 grid h-[17px] min-w-[17px] place-items-center rounded-[5px] bg-white/95 text-[11px] text-[#594f48]">{index + 1}</b>{isSelected && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--color-accent)] text-white"><Icon size={12}><path d="m20 6-11 11-5-5" /></Icon></span>}</button>;
                })}
            </div> : <p className="my-3 rounded-[8px] border border-dashed border-[#d9d0c9] px-3 py-5 text-center text-[11px] text-[#958b83]">{t('productEditPage.variantPhotos.noProductPhotos')}</p>}
            <footer className="mt-[9px] flex items-center justify-between border-t border-[#f0ece8] pt-2 text-[11px] text-[#847a72]"><span>{t('productEditPage.variantPhotos.selectedCount', { count: selectedImageIds.length })}</span><button type="button" onClick={onApply} className="min-h-[31px] rounded-[8px] border-0 bg-[color:var(--color-accent)] px-3 text-[11px] font-bold text-white">{t('productEditPage.variantPhotos.done')}</button></footer>
        </section>
    );
}

function PhotosSection({ options, images, onOpenImage }) {
    const { t } = useTranslation();
    const [areVariantPhotosEnabled, setAreVariantPhotosEnabled] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState('');
    const [mainValueIds, setMainValueIds] = useState({});
    const [photoAssignments, setPhotoAssignments] = useState({});
    const [openPicker, setOpenPicker] = useState(null);
    const [draftImageIds, setDraftImageIds] = useState([]);
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
        setSelectedOptionId((current) => options.length === 0 || options.some((option) => String(option.id) === current)
            ? current
            : String(options[0].id));
    }, [options]);

    useEffect(() => {
        const orderedImageIds = images.map((image) => String(image.id));

        setPhotoAssignments((current) => {
            let hasChanges = false;
            const next = Object.fromEntries(Object.entries(current).map(([optionId, valueAssignments]) => [
                optionId,
                Object.fromEntries(Object.entries(valueAssignments).map(([valueId, assignedIds]) => {
                    const assignedIdSet = new Set(assignedIds);
                    const nextIds = orderedImageIds.filter((imageId) => assignedIdSet.has(imageId));
                    if (nextIds.length !== assignedIds.length || nextIds.some((imageId, index) => imageId !== assignedIds[index])) hasChanges = true;
                    return [valueId, nextIds];
                })),
            ]));

            return hasChanges ? next : current;
        });
        setDraftImageIds((current) => {
            const selectedIdSet = new Set(current);
            const next = orderedImageIds.filter((imageId) => selectedIdSet.has(imageId));
            return next.length !== current.length || next.some((imageId, index) => imageId !== current[index]) ? next : current;
        });
    }, [images]);

    const setMainValue = (valueId) => {
        if (!selectedOption) return;

        setMainValueIds((current) => ({
            ...current,
            [selectedOptionValue]: String(valueId),
        }));
    };
    const openPhotoPicker = (valueId) => {
        const normalizedValueId = String(valueId);
        setOpenPicker({ optionId: selectedOptionValue, valueId: normalizedValueId });
        setDraftImageIds([...(photoAssignments[selectedOptionValue]?.[normalizedValueId] ?? [])]);
    };
    const closePhotoPicker = () => {
        setOpenPicker(null);
        setDraftImageIds([]);
    };
    const toggleDraftImage = (imageId) => {
        setDraftImageIds((current) => current.includes(imageId)
            ? current.filter((currentId) => currentId !== imageId)
            : [...current, imageId]);
    };
    const applyPhotoPicker = () => {
        if (!openPicker) return;

        const selectedImageIdSet = new Set(draftImageIds);
        const orderedImageIds = images.map((image) => String(image.id)).filter((imageId) => selectedImageIdSet.has(imageId));
        setPhotoAssignments((current) => ({
            ...current,
            [openPicker.optionId]: {
                ...current[openPicker.optionId],
                [openPicker.valueId]: orderedImageIds,
            },
        }));
        closePhotoPicker();
    };
    const removeAssignedPhoto = (valueId, imageId) => {
        const normalizedValueId = String(valueId);
        const normalizedImageId = String(imageId);
        setPhotoAssignments((current) => ({
            ...current,
            [selectedOptionValue]: {
                ...current[selectedOptionValue],
                [normalizedValueId]: (current[selectedOptionValue]?.[normalizedValueId] ?? []).filter((assignedId) => assignedId !== normalizedImageId),
            },
        }));
        if (openPicker?.optionId === selectedOptionValue && openPicker.valueId === normalizedValueId) {
            setDraftImageIds((current) => current.filter((assignedId) => assignedId !== normalizedImageId));
        }
    };

    if (options.length === 0) return null;

    return (
        <section className="overflow-hidden rounded-[13px] border border-[color:var(--color-border)] bg-white">
            <header className={`grid min-h-[76px] items-center gap-4 bg-[linear-gradient(100deg,#fff8f3,#fff)] px-[16px] py-3 ${areVariantPhotosEnabled ? 'grid-cols-[48px_minmax(0,1fr)_220px] border-b border-[color:var(--color-border)] max-sm:grid-cols-[48px_minmax(0,1fr)]' : 'grid-cols-[48px_minmax(0,1fr)]'}`}>
                <button type="button" className="switch-control switch-control--strong" role="switch" aria-checked={areVariantPhotosEnabled} onClick={() => setAreVariantPhotosEnabled((current) => !current)} aria-label={t('productEditPage.variantPhotos.toggleAria')}><i aria-hidden="true"><Icon size={14}><path d="m20 6-11 11-5-5" /></Icon></i></button>
                <p className="m-0"><strong className="block text-[13px]">{t('productEditPage.variantPhotos.title')}</strong><small className="mt-[3px] block max-w-[620px] text-[12px] leading-[1.45] text-[#8d847d]">{t('productEditPage.variantPhotos.description')}</small></p>
                {areVariantPhotosEnabled && <label className="flex flex-col gap-1 max-sm:col-span-full"><span className="text-[11px] font-bold text-[#716861]">{t('productEditPage.variantPhotos.dependsOn')}</span><Select className="!h-[40px] !px-[10px] !text-[12px] !font-bold" value={selectedOptionValue} onChange={(event) => setSelectedOptionId(event.target.value)}>{options.map((option) => <option key={option.id} value={String(option.id)}>{option.name}</option>)}</Select></label>}
            </header>
            {areVariantPhotosEnabled && <>
                <div className="grid grid-cols-[minmax(190px,.7fr)_minmax(0,1.3fr)_auto] items-center gap-3 border-b border-[color:var(--color-border)] bg-[#faf8f6] px-[16px] py-3 max-md:grid-cols-1"><div><strong className="block text-[12px]">{t('productEditPage.variantPhotos.galleryTitle')}</strong><small className="mt-[3px] block text-[11px] text-[#8f867f]">{t('productEditPage.variantPhotos.galleryDescription')}</small></div>{images.length > 0 ? <><div className="flex gap-[7px] overflow-x-auto">{images.map((image, index) => <PhotoTile key={image.id} image={image} onOpen={() => onOpenImage(index)} ariaLabel={t('productEditPage.variantPhotos.openPhoto', { number: index + 1 })} />)}</div><div className="flex gap-2 text-[11px]"><span className="rounded-full bg-[#eaf4ec] px-2 py-1 font-bold text-[#3c8354]">{t('productEditPage.variantPhotos.assignedCount', { count: assignedImageCount })}</span><span className="rounded-full bg-[#fff0e7] px-2 py-1 font-bold text-[color:var(--color-accent)]">{t('productEditPage.variantPhotos.unassignedCount', { count: images.length - assignedImageCount })}</span></div></> : <p className="col-span-2 m-0 rounded-[8px] border border-dashed border-[#d9d0c9] bg-white px-3 py-4 text-center text-[11px] text-[#958b83] max-md:col-span-1">{t('productEditPage.variantPhotos.noProductPhotos')}</p>}</div>
                <div className="flex flex-col gap-[9px] p-[13px_14px]">
                    {selectedOption && selectedValues.length === 0 && <div className="rounded-[11px] border border-dashed border-[#d9d0c9] bg-[#fcfbfa] px-4 py-8 text-center"><strong className="block text-[12px] text-[#665e57]">{t('productEditPage.variantPhotos.noOptionValues')}</strong></div>}
                    {selectedValues.map((value) => {
                        const valueId = String(value.id);
                        const isMain = valueId === mainValueId;
                        const assignedImageIdSet = new Set(selectedOptionAssignments[valueId] ?? []);
                        const assignedImages = images.filter((image) => assignedImageIdSet.has(String(image.id)));
                        const pickerIsOpen = openPicker?.optionId === selectedOptionValue && openPicker.valueId === valueId;

                        return <article key={value.id} className={`rounded-[11px] border p-[8px_10px] ${isMain ? 'border-[#dcae92] bg-[#fffaf7]' : 'border-[color:var(--color-border)] bg-[#fcfbfa]'}`}><div className="flex flex-wrap items-center gap-x-[10px] gap-y-[7px]"><span className="min-w-[105px] shrink-0"><strong className="block text-[12px]">{value.label}</strong>{assignedImages.length > 0 && <small className="text-[11px] text-[#928981]">{t('productEditPage.variantPhotos.valuePhotoCount', { count: assignedImages.length })}</small>}</span><div className="flex min-w-[150px] flex-1 flex-wrap items-center gap-[6px]">{assignedImages.map((image, index) => { const galleryIndex = images.findIndex((galleryImage) => galleryImage.id === image.id); return <div key={image.id} data-media-id={image.id} className="relative h-[54px] w-[44px] shrink-0 overflow-hidden rounded-[7px] border border-[#d9d1cb] bg-[#f5f1ee]"><button type="button" className="block h-full w-full cursor-zoom-in border-0 bg-transparent p-0" onClick={() => onOpenImage(galleryIndex)} aria-label={t('productEditPage.variantPhotos.openPhoto', { number: galleryIndex + 1 })}><img className="h-full w-full object-cover" src={image.small_url} alt="" draggable={false} /><b className="absolute bottom-[3px] left-[3px] grid h-[16px] min-w-[16px] place-items-center rounded-[4px] bg-white/95 text-[10px] text-[#594f48]">{index + 1}</b></button><button type="button" onClick={() => removeAssignedPhoto(valueId, image.id)} className="absolute right-[2px] top-[2px] grid h-[18px] w-[18px] place-items-center rounded-full border-0 bg-white/95 text-[#766b63]" aria-label={t('productEditPage.variantPhotos.removePhoto', { value: value.label })}><CloseIcon width={10} height={10} /></button></div>; })}<button type="button" onClick={() => openPhotoPicker(valueId)} className="inline-flex min-h-[54px] items-center justify-center gap-[6px] rounded-[7px] border border-dashed border-[#d0b09d] bg-white px-[10px] text-[11px] font-bold text-[color:var(--color-accent)]"><PlusIcon size={13} />{t('productEditPage.variantPhotos.addPhoto')}</button></div><button type="button" onClick={() => setMainValue(valueId)} className={`ml-auto inline-flex min-h-[30px] shrink-0 items-center gap-[5px] rounded-[8px] px-2 text-[11px] font-bold ${isMain ? 'border border-[#c4531c] bg-[#fff4ec] text-[color:var(--color-accent)]' : 'border border-transparent bg-transparent text-[#8d837b]'}`}><Icon size={13} className={isMain ? 'fill-current' : ''}><path d="m12 2.5 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6 6.5-.9 3-6Z" /></Icon>{isMain ? t('productEditPage.variantPhotos.mainValue') : t('productEditPage.variantPhotos.setMainValue')}</button></div>{pickerIsOpen && <PhotoPicker valueLabel={value.label} images={images} selectedImageIds={draftImageIds} onToggle={toggleDraftImage} onCancel={closePhotoPicker} onApply={applyPhotoPicker} t={t} />}</article>;
                    })}
                </div>
            </>}
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
            {showPriceSettings && <section className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-[12px] border border-[#e0b292] bg-[#fffaf7] p-[14px_16px]">
                <button type="button" className="switch-control switch-control--strong" role="switch" aria-checked={separatePrices} onClick={onTogglePrices} aria-label="Использовать отдельные цены"><i aria-hidden="true"><Icon size={14}><path d="m20 6-11 11-5-5" /></Icon></i></button><div><strong className="block text-[13px]">Цены отличаются для разных вариантов</strong><small className="mt-[3px] block text-[12px] text-[#8c837c]">Включите, если цвет или размер влияет на стоимость товара.</small></div>
            </section>}
            {totalCount > combinationLimit && <div className="flex items-start gap-2 rounded-[10px] border border-[#ebc8a6] bg-[#fff8ed] p-[11px_13px] text-[#7c5228]"><Icon size={17} className="mt-0.5 shrink-0"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.4 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" /></Icon><p className="m-0 text-[11px] leading-[1.45]"><strong className="block text-[12px] text-[#5d4430]">Превышен лимит: {totalCount} комбинаций</strong>Созданы первые {combinationLimit}. Удалите лишние значения опций, чтобы вернуться в пределы лимита.</p></div>}
            <section className="overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-white">
                <header className="flex min-h-[58px] items-center gap-3 border-b border-[color:var(--color-border)] bg-[#faf8f6] px-[12px]"><div><div className="flex items-center gap-2"><strong className="text-[13px]">Модификации</strong><span className="rounded-full bg-[#eee9e5] px-2 py-1 text-[10px] font-bold text-[#746b64]">{totalCount > combinationLimit ? `${combinations.length} из ${totalCount}` : combinations.length} комбинаций</span></div><small className="text-[11px] text-[#978f88]">Комбинации автоматически обновляются при изменении опций.</small></div></header>
                {visibleSelected.length > 0 && <div className="border-b border-[#ead6ca] bg-[#fff7f1] px-[12px] py-[7px]">
                    <BulkActionsBar
                        selectedCount={visibleSelected.length}
                        countLabel={(count) => t('productEditPage.variantBulk.selectedCount', { count })}
                        className="!min-h-[34px]"
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
                {combinations.length === 0 ? <div className="px-4 py-8 text-center"><strong className="block text-[12px] text-[#665e57]">Модификаций пока нет</strong><small className="mt-1 block text-[11px] text-[#978f88]">Добавьте опцию со значениями, чтобы сформировать комбинации.</small></div> : <div className="overflow-x-auto"><div className="min-w-[820px]"><div className="grid min-h-[34px] grid-cols-[34px_minmax(250px,1.5fr)_120px_100px_130px_70px] items-center gap-[8px] bg-[#f7f4f1] px-[10px] text-[10px] font-bold uppercase text-[#918981]"><input ref={selectAllRef} type="checkbox" className="checkbox-control" checked={allSelected} onChange={() => setSelected(allSelected ? [] : combinationKeys)} aria-label={t('productEditPage.variantBulk.selectAll')} /><span>Модификация</span><span>Цена</span><span>Остаток</span><span>SKU</span><span>Активна</span></div>{combinations.map((combination) => {
                        const data = variantData[combination.key];

                        return <div key={combination.key} className="grid min-h-[50px] grid-cols-[34px_minmax(250px,1.5fr)_120px_100px_130px_70px] items-center gap-[8px] border-t border-[#f0ece8] px-[10px]"><input type="checkbox" className="checkbox-control" checked={visibleSelected.includes(combination.key)} onChange={() => toggleRow(combination.key)} aria-label={`Выбрать ${combination.label}`} /><strong className="truncate text-[11px]"><i className="mr-2 inline-block h-[9px] w-[9px] rounded-full bg-[#a9683e]" />{combination.label}</strong><label className="relative"><input className="h-[32px] w-full rounded-[7px] border border-[color:var(--color-border)] px-2 pr-9 text-[11px] disabled:bg-[#f2efec]" value={separatePrices ? (data?.price ?? basePrice) : basePrice} disabled={!separatePrices} onChange={(event) => onVariantChange(combination.key, { price: event.target.value })} /><b className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#9a928b]">UAH</b></label><input className="h-[32px] rounded-[7px] border border-[color:var(--color-border)] px-2 text-[11px]" value={data?.stock ?? '0'} onChange={(event) => onVariantChange(combination.key, { stock: event.target.value })} /><input className="h-[32px] rounded-[7px] border border-[color:var(--color-border)] px-2 text-[11px]" value={data?.sku ?? ''} onChange={(event) => onVariantChange(combination.key, { sku: event.target.value })} /><label className="switch" aria-label={`Активность ${combination.label}`}><input className="switch__input" type="checkbox" checked={data?.active ?? true} onChange={(event) => onVariantChange(combination.key, { active: event.target.checked })} /><span className="switch__track" /></label></div>;
                    })}</div></div>}
            </section>
        </>
    );
}

export default function ProductVariantsModal({ isOpen, onClose, basePrice = '', media = [] }) {
    const [separatePrices, setSeparatePrices] = useState(false);
    const [areSeparatePricesInitialized, setAreSeparatePricesInitialized] = useState(false);
    const [showOptionPicker, setShowOptionPicker] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [addedOptions, setAddedOptions] = useState([]);
    const [isAttributesLoading, setIsAttributesLoading] = useState(false);
    const [attributesError, setAttributesError] = useState('');
    const [variantData, setVariantData] = useState({});
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const images = useMemo(() => media.filter((item) => item.type === 'image'), [media]);
    const lightboxImages = useMemo(() => images.map((item) => ({ id: item.id, src: item.large_url, alt: '' })), [images]);
    const { combinations, totalCount } = useMemo(() => buildCombinations(addedOptions), [addedOptions]);
    const normalizedBasePrice = basePrice === null || basePrice === undefined ? '' : String(basePrice);
    usePageScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen || images.length === 0) setIsLightboxOpen(false);
    }, [images.length, isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const controller = new AbortController();
        setShowOptionPicker(false);
        setDeleteWarning(null);
        setAttributes([]);
        setAttributesError('');
        setIsAttributesLoading(true);

        getShopAttributes({ signal: controller.signal })
            .then((loadedAttributes) => {
                if (controller.signal.aborted) return;

                setAttributes(loadedAttributes.filter((attribute) => ['select', 'multiselect'].includes(attribute.type)));
            })
            .catch((error) => {
                if (error.name === 'AbortError') return;

                console.error('Unable to load product attributes for variants.', error);
                setAttributesError('Не удалось загрузить характеристики. Закройте и откройте окно, чтобы повторить попытку.');
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsAttributesLoading(false);
            });

        return () => controller.abort();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return;
            if (isLightboxOpen) {
                setIsLightboxOpen(false);
                return;
            }

            onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, isOpen, onClose]);

    useEffect(() => {
        if (combinations.length === 0) return;

        setVariantData((current) => {
            let next = current;

            for (const combination of combinations) {
                if (Object.hasOwn(current, combination.key)) continue;
                if (next === current) next = { ...current };
                next[combination.key] = { price: normalizedBasePrice, stock: '0', sku: '', active: true };
            }

            return next;
        });
    }, [combinations, normalizedBasePrice]);

    if (!isOpen) return null;

    const addedAttributeIds = new Set(addedOptions.map((option) => option.id));
    const selectedValuesCount = addedOptions.reduce((count, option) => count + option.values.length, 0);
    const addAttribute = (attributeId) => {
        const attribute = attributes.find((item) => item.id === attributeId);
        if (!attribute || addedAttributeIds.has(attribute.id)) return;

        const attributeValues = (attribute.options ?? []).map((option) => ({ id: option.id, label: option.value }));
        setAddedOptions((current) => [...current, {
            id: attribute.id,
            name: attribute.name,
            type: attribute.type,
            availableValues: attributeValues,
            values: attributeValues,
        }]);
    };
    const removeAttribute = (attributeId) => {
        setAddedOptions((current) => current.filter((option) => option.id !== attributeId));
        setDeleteWarning(null);
    };
    const addOptionValue = (attributeId, valueLabel) => {
        const trimmedValue = valueLabel.trim();
        if (!trimmedValue) return;

        const normalizedValue = trimmedValue.toLocaleLowerCase();
        setAddedOptions((current) => current.map((option) => {
            if (option.id !== attributeId || option.values.some((value) => value.label.trim().toLocaleLowerCase() === normalizedValue)) return option;

            const sourceValue = option.availableValues.find((value) => value.label.trim().toLocaleLowerCase() === normalizedValue);
            return {
                ...option,
                values: [...option.values, sourceValue ?? { id: `local-${option.id}-${normalizedValue}`, label: trimmedValue }],
            };
        }));
    };
    const removeOptionValue = (attributeId, valueId) => {
        setAddedOptions((current) => current.map((option) => option.id === attributeId
            ? { ...option, values: option.values.filter((value) => value.id !== valueId) }
            : option));
        setDeleteWarning(null);
    };
    const updateVariant = (key, fields) => {
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
    return (
        <>
            <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
                <section className="modal-dialog flex h-[min(900px,calc(100vh-40px))] !w-[min(1380px,100%)] flex-col bg-[#fbfaf8] max-sm:h-full max-sm:!w-full" role="dialog" aria-modal="true" aria-labelledby="variant-manager-title" onMouseDown={(event) => event.stopPropagation()}>
                <header className="flex shrink-0 items-start justify-between gap-[18px] border-b border-[color:var(--color-border)] bg-white px-7 pb-[18px] pt-5 max-sm:px-4"><div><small className="text-[11px] font-bold uppercase tracking-[.05em] text-[color:var(--color-accent)]">Товар · Дополнительные настройки</small><h2 id="variant-manager-title" className="mb-1 mt-[3px] text-[28px] font-[770] tracking-[-.045em] text-[#252525] max-sm:text-[22px]">Модификации товара</h2><p className="m-0 text-[12px] text-[#887f78]">Опции, фотографии, цены и остатки собраны отдельно, чтобы основная карточка оставалась простой.</p></div><button type="button" className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#716861]" onClick={onClose} aria-label="Закрыть модификации"><CloseIcon width={20} height={20} /></button></header>
                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-[20px] max-sm:px-[14px]"><div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch"><div><strong className="block text-[13px]">Опции товара</strong><small className="text-[12px] text-[#968e87]">Добавьте характеристики типа «Список» или «Множественный список».</small></div><button type="button" className="button button--secondary min-h-[40px] shrink-0 justify-center" onClick={() => setShowOptionPicker((current) => !current)} aria-expanded={showOptionPicker}><PlusIcon width={15} height={15} />Добавить опцию</button></div>
                    {showOptionPicker && <AttributePicker attributes={attributes} addedAttributeIds={addedAttributeIds} isLoading={isAttributesLoading} error={attributesError} onAdd={addAttribute} onClose={() => setShowOptionPicker(false)} />}
                    {addedOptions.map((option) => <OptionRow key={option.id} option={option} onAddValue={addOptionValue} onDeleteOption={removeAttribute} onDeleteValue={(optionId, valueId, optionName, valueName) => setDeleteWarning({ optionId, valueId, optionName, valueName })} />)}
                    {deleteWarning && <div className="flex items-start gap-3 rounded-[10px] border border-[#e5c3bd] bg-[#fff7f5] p-[11px_13px] text-[#a6402b]" role="alert"><TrashIcon /><p className="m-0 flex-1 text-[11px] leading-[1.45]"><strong className="block text-[12px] text-[#633b33]">Значение «{deleteWarning.valueName}» связано с модификациями</strong>Модификации с этим значением опции «{deleteWarning.optionName}» будут удалены вместе с ним.</p><div className="flex shrink-0 gap-2 max-sm:flex-col"><button type="button" className="rounded-[7px] border border-[#d9c9bf] bg-white px-2 py-1.5 text-[11px] font-bold text-[#5d554f]" onClick={() => setDeleteWarning(null)}>Отмена</button><button type="button" className="rounded-[7px] border border-[#d79d8e] bg-white px-2 py-1.5 text-[11px] font-bold text-[#a6402b]" onClick={() => removeOptionValue(deleteWarning.optionId, deleteWarning.valueId)}>Удалить значение</button></div></div>}
                    <PhotosSection options={addedOptions} images={images} onOpenImage={(index) => { setLightboxIndex(index); setIsLightboxOpen(true); }} />
                    <VariantsSection combinations={combinations} totalCount={totalCount} variantData={variantData} basePrice={normalizedBasePrice} separatePrices={separatePrices} showPriceSettings={addedOptions.length > 0} onTogglePrices={toggleSeparatePrices} onVariantChange={updateVariant} />
                </div></div>
                <footer className="flex min-h-[76px] shrink-0 items-center gap-3 border-t border-[color:var(--color-border)] bg-white px-7 py-[11px] max-sm:grid max-sm:grid-cols-2 max-sm:px-[14px]"><div className="flex flex-1 flex-col max-sm:col-span-full"><span className="text-[12px] font-bold">{addedOptions.length} опции · {selectedValuesCount} значений</span><small className="text-[11px] text-[#928981]">Модификации появятся в карточке товара только после сохранения.</small></div><button type="button" className="button button--secondary min-h-[42px] justify-center" onClick={onClose}>Закрыть</button><button type="button" className="button button--primary min-h-[42px] justify-center" onClick={onClose}><SaveIcon size={16} />Сохранить модификации</button></footer>
                </section>
            </div>
            <ImageLightbox images={lightboxImages} index={lightboxIndex} open={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} onIndexChange={setLightboxIndex} />
        </>
    );
}
