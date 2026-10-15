import { useEffect, useMemo, useState } from 'react';
import CloseIcon from '../../components/icons/CloseIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import SaveIcon from '../../components/icons/SaveIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import Select from '../../components/form/Select';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import { getShopAttributes } from '../../services/shopAttributes';

const demoPhotos = [
    'bg-[linear-gradient(145deg,#b67b55,#5d3828)]',
    'bg-[linear-gradient(145deg,#9e6847,#43291f)]',
    'bg-[linear-gradient(145deg,#765040,#2f201a)]',
    'bg-[linear-gradient(145deg,#55504d,#211f1e)]',
    'bg-[linear-gradient(145deg,#c49775,#674634)]',
];

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

function PhotoTile({ index, removable = false }) {
    return (
        <div className={`relative h-[66px] w-[54px] shrink-0 overflow-hidden rounded-[8px] border border-[#d9d1cb] ${demoPhotos[index % demoPhotos.length]}`}>
            <i className="absolute inset-[25%] rounded-[35%_35%_18%_18%] border border-white/40 bg-[#39261f]/35" />
            {removable && <button type="button" className="absolute right-[3px] top-[3px] grid h-[19px] w-[19px] place-items-center rounded-full border-0 bg-white/95 text-[#766b63]" aria-label="Убрать фото"><CloseIcon width={11} height={11} /></button>}
            {!removable && <b className="absolute bottom-1 left-1 grid h-[17px] min-w-[17px] place-items-center rounded-[5px] bg-white/90 text-[11px] not-italic">{index + 1}</b>}
        </div>
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

function PhotosSection({ options }) {
    const [selectedOptionId, setSelectedOptionId] = useState('');
    const [mainValueIds, setMainValueIds] = useState({});
    const selectedOption = options.find((option) => String(option.id) === selectedOptionId) ?? options[0] ?? null;
    const selectedOptionValue = selectedOption ? String(selectedOption.id) : '';
    const selectedValues = selectedOption?.values ?? [];
    const configuredMainValueId = selectedOption ? mainValueIds[selectedOptionValue] : null;
    const mainValueId = selectedValues.some((value) => String(value.id) === configuredMainValueId)
        ? configuredMainValueId
        : String(selectedValues[0]?.id ?? '');

    useEffect(() => {
        setSelectedOptionId((current) => options.some((option) => String(option.id) === current)
            ? current
            : String(options[0]?.id ?? ''));
    }, [options]);

    const setMainValue = (valueId) => {
        if (!selectedOption) return;

        setMainValueIds((current) => ({
            ...current,
            [selectedOptionValue]: String(valueId),
        }));
    };

    return (
        <section className="overflow-hidden rounded-[13px] border border-[color:var(--color-border)] bg-white">
            <header className="grid min-h-[76px] grid-cols-[minmax(0,1fr)_220px] items-center gap-4 border-b border-[color:var(--color-border)] bg-[linear-gradient(100deg,#fff8f3,#fff)] px-[16px] py-3 max-sm:grid-cols-1">
                <div className="flex items-start gap-[10px]"><span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-[10px] bg-[#f9eee7] text-[color:var(--color-accent)]"><Icon size={18}><rect x="3" y="3" width="14" height="18" rx="2" /><path d="m3 16 4-4 3 3 3-3 4 4M20 5v6M17 8h6" /></Icon></span><p className="m-0"><strong className="block text-[13px]">Фотографии вариантов</strong><small className="mt-[3px] block max-w-[520px] text-[12px] leading-[1.45] text-[#8d847d]">Покупатель увидит фотографии выбранного значения, а не одну картинку на все варианты.</small></p></div>
                <label className="flex flex-col gap-1"><span className="text-[11px] font-bold text-[#716861]">Фото меняются по</span><Select className="!h-[40px] !px-[10px] !text-[12px] !font-bold" value={selectedOptionValue} disabled={options.length === 0} onChange={(event) => setSelectedOptionId(event.target.value)}>{options.length === 0 && <option value="">Нет доступных опций</option>}{options.map((option) => <option key={option.id} value={String(option.id)}>{option.name}</option>)}</Select></label>
            </header>
            {selectedOption && <div className="grid grid-cols-[minmax(190px,.7fr)_minmax(0,1.3fr)_auto] items-center gap-3 border-b border-[color:var(--color-border)] bg-[#faf8f6] px-[16px] py-3 max-md:grid-cols-1"><div><strong className="block text-[12px]">Общая галерея товара</strong><small className="mt-[3px] block text-[11px] text-[#8f867f]">Загрузите фото один раз и распределите по значениям.</small></div><div className="flex gap-[7px] overflow-x-auto">{demoPhotos.map((_, index) => <PhotoTile key={index} index={index} />)}</div><div className="flex gap-2 text-[11px]"><span className="rounded-full bg-[#eaf4ec] px-2 py-1 font-bold text-[#3c8354]">Фото назначено: 4</span><span className="rounded-full bg-[#fff0e7] px-2 py-1 font-bold text-[color:var(--color-accent)]">Фото не назначено: 1</span></div></div>}
            <div className="flex flex-col gap-[9px] p-[13px_14px]">
                {!selectedOption && <div className="rounded-[11px] border border-dashed border-[#d9d0c9] bg-[#fcfbfa] px-4 py-8 text-center"><strong className="block text-[12px] text-[#665e57]">Нет опций для распределения фотографий</strong><small className="mt-1 block text-[11px] text-[#978f88]">Добавьте опцию товара и её значения.</small></div>}
                {selectedOption && selectedValues.length === 0 && <div className="rounded-[11px] border border-dashed border-[#d9d0c9] bg-[#fcfbfa] px-4 py-8 text-center"><strong className="block text-[12px] text-[#665e57]">У опции «{selectedOption.name}» нет значений</strong><small className="mt-1 block text-[11px] text-[#978f88]">Добавьте значения, чтобы распределить между ними фотографии.</small></div>}
                {selectedValues.map((value, index) => {
                    const valueId = String(value.id);
                    const isMain = valueId === mainValueId;
                    const photos = index === 0 ? [0, 1] : (index === 1 ? [2, 3] : []);

                    return <article key={value.id} className={`rounded-[11px] border p-[11px] ${isMain ? 'border-[#dcae92] bg-[#fffaf7]' : 'border-[color:var(--color-border)] bg-[#fcfbfa]'}`}><header className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><i className={`h-[14px] w-[14px] rounded-full border-2 border-white shadow-[0_0_0_1px_#d6cec8] ${demoPhotos[index % demoPhotos.length]}`} /><span><strong className="block text-[12px]">{value.label}</strong><small className="text-[11px] text-[#928981]">{photos.length ? `${photos.length} фото` : 'Фотографии не распределены'}</small></span></div><button type="button" onClick={() => setMainValue(valueId)} className={`inline-flex min-h-[30px] items-center gap-[5px] rounded-[8px] px-2 text-[11px] font-bold ${isMain ? 'border border-[#c4531c] bg-[#fff4ec] text-[color:var(--color-accent)]' : 'border border-transparent bg-transparent text-[#8d837b]'}`}><Icon size={13} className={isMain ? 'fill-current' : ''}><path d="m12 2.5 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6 6.5-.9 3-6Z" /></Icon>{isMain ? 'Основное значение' : 'Сделать основным'}</button></header><div className="mt-[9px] flex min-h-[66px] gap-[7px] overflow-x-auto">{photos.length ? photos.map((photoIndex) => <PhotoTile key={photoIndex} index={photoIndex} removable />) : <p className="m-0 inline-flex min-w-[170px] items-center justify-center rounded-[8px] border border-dashed border-[#d9d0c9] px-3 text-[11px] text-[#958b83]">Фото не назначены</p>}<button type="button" className="inline-flex min-w-[118px] items-center justify-center gap-[6px] rounded-[8px] border border-dashed border-[#d0b09d] bg-white px-[10px] text-[11px] font-bold text-[color:var(--color-accent)]"><PlusIcon size={13} />Добавить фото</button></div></article>;
                })}
            </div>
        </section>
    );
}

function VariantsSection({ combinations, totalCount, variantData, basePrice, separatePrices, onTogglePrices, onVariantChange }) {
    const [selected, setSelected] = useState([]);
    const combinationKeys = combinations.map((combination) => combination.key);
    const visibleSelected = selected.filter((key) => combinationKeys.includes(key));
    const allSelected = combinations.length > 0 && visibleSelected.length === combinations.length;
    const toggleRow = (key) => setSelected((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
    const setSelectedActivity = (active) => {
        visibleSelected.forEach((key) => onVariantChange(key, { active }));
    };

    return (
        <>
            <section className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-[12px] border border-[#e0b292] bg-[#fffaf7] p-[14px_16px]">
                <button type="button" className="switch-control switch-control--strong" role="switch" aria-checked={separatePrices} onClick={onTogglePrices} aria-label="Использовать отдельные цены"><i aria-hidden="true"><Icon size={14}><path d="m20 6-11 11-5-5" /></Icon></i></button><div><strong className="block text-[13px]">Цены отличаются для разных вариантов</strong><small className="mt-[3px] block text-[12px] text-[#8c837c]">Включите, если цвет или размер влияет на стоимость товара.</small></div>
            </section>
            {totalCount > combinationLimit && <div className="flex items-start gap-2 rounded-[10px] border border-[#ebc8a6] bg-[#fff8ed] p-[11px_13px] text-[#7c5228]"><Icon size={17} className="mt-0.5 shrink-0"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.4 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" /></Icon><p className="m-0 text-[11px] leading-[1.45]"><strong className="block text-[12px] text-[#5d4430]">Превышен лимит: {totalCount} комбинаций</strong>Созданы первые {combinationLimit}. Удалите лишние значения опций, чтобы вернуться в пределы лимита.</p></div>}
            <section className="overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-white">
                <header className="flex min-h-[58px] items-center justify-between gap-3 border-b border-[color:var(--color-border)] bg-[#faf8f6] px-[12px]"><div><div className="flex items-center gap-2"><strong className="text-[13px]">Модификации</strong><span className="rounded-full bg-[#eee9e5] px-2 py-1 text-[10px] font-bold text-[#746b64]">{totalCount > combinationLimit ? `${combinations.length} из ${totalCount}` : combinations.length} комбинаций</span></div><small className="text-[11px] text-[#978f88]">Комбинации автоматически обновляются при изменении опций.</small></div><button type="button" disabled={!separatePrices} className="min-h-[32px] rounded-[8px] border border-[#d8d0ca] bg-white px-[10px] text-[12px] font-bold text-[color:var(--color-accent)] disabled:cursor-not-allowed disabled:bg-[#f1eeeb] disabled:text-[#9a918a]">Изменить все</button></header>
                {visibleSelected.length > 0 && <div className="flex min-h-[46px] items-center gap-2 border-b border-[#ead6ca] bg-[#fff7f1] px-[12px] text-[11px]"><strong className="mr-auto text-[12px]">Выбрано: {visibleSelected.length}</strong><button type="button" disabled={!separatePrices} className="rounded-[7px] border border-[#d9c9bf] bg-white px-2 py-1.5 font-bold disabled:cursor-not-allowed disabled:bg-[#f1eeeb] disabled:text-[#9a918a]">Изменить цену</button><button type="button" className="rounded-[7px] border border-[#d9c9bf] bg-white px-2 py-1.5 font-bold">Изменить остаток</button><button type="button" onClick={() => setSelectedActivity(false)} className="rounded-[7px] border border-[#e1b9ad] bg-white px-2 py-1.5 font-bold text-[#a6402b]">Отключить</button></div>}
                {combinations.length === 0 ? <div className="px-4 py-8 text-center"><strong className="block text-[12px] text-[#665e57]">Модификаций пока нет</strong><small className="mt-1 block text-[11px] text-[#978f88]">Добавьте опцию со значениями, чтобы сформировать комбинации.</small></div> : <div className="overflow-x-auto"><div className="min-w-[820px]"><div className="grid min-h-[34px] grid-cols-[34px_minmax(250px,1.5fr)_120px_100px_130px_70px] items-center gap-[8px] bg-[#f7f4f1] px-[10px] text-[10px] font-bold uppercase text-[#918981]"><input type="checkbox" className="checkbox-control" checked={allSelected} onChange={() => setSelected(allSelected ? [] : combinationKeys)} aria-label="Выбрать все" /><span>Модификация</span><span>Цена</span><span>Остаток</span><span>SKU</span><span>Активна</span></div>{combinations.map((combination) => {
                        const data = variantData[combination.key];

                        return <div key={combination.key} className="grid min-h-[50px] grid-cols-[34px_minmax(250px,1.5fr)_120px_100px_130px_70px] items-center gap-[8px] border-t border-[#f0ece8] px-[10px]"><input type="checkbox" className="checkbox-control" checked={visibleSelected.includes(combination.key)} onChange={() => toggleRow(combination.key)} aria-label={`Выбрать ${combination.label}`} /><strong className="truncate text-[11px]"><i className="mr-2 inline-block h-[9px] w-[9px] rounded-full bg-[#a9683e]" />{combination.label}</strong><label className="relative"><input className="h-[32px] w-full rounded-[7px] border border-[color:var(--color-border)] px-2 pr-9 text-[11px] disabled:bg-[#f2efec]" value={separatePrices ? (data?.price ?? basePrice) : basePrice} disabled={!separatePrices} onChange={(event) => onVariantChange(combination.key, { price: event.target.value })} /><b className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#9a928b]">UAH</b></label><input className="h-[32px] rounded-[7px] border border-[color:var(--color-border)] px-2 text-[11px]" value={data?.stock ?? '0'} onChange={(event) => onVariantChange(combination.key, { stock: event.target.value })} /><input className="h-[32px] rounded-[7px] border border-[color:var(--color-border)] px-2 text-[11px]" value={data?.sku ?? ''} onChange={(event) => onVariantChange(combination.key, { sku: event.target.value })} /><label className="switch" aria-label={`Активность ${combination.label}`}><input className="switch__input" type="checkbox" checked={data?.active ?? true} onChange={(event) => onVariantChange(combination.key, { active: event.target.checked })} /><span className="switch__track" /></label></div>;
                    })}</div></div>}
            </section>
        </>
    );
}

export default function ProductVariantsModal({ isOpen, onClose, basePrice = '' }) {
    const [separatePrices, setSeparatePrices] = useState(false);
    const [areSeparatePricesInitialized, setAreSeparatePricesInitialized] = useState(false);
    const [showOptionPicker, setShowOptionPicker] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [addedOptions, setAddedOptions] = useState([]);
    const [isAttributesLoading, setIsAttributesLoading] = useState(false);
    const [attributesError, setAttributesError] = useState('');
    const [variantData, setVariantData] = useState({});
    const { combinations, totalCount } = useMemo(() => buildCombinations(addedOptions), [addedOptions]);
    const normalizedBasePrice = basePrice === null || basePrice === undefined ? '' : String(basePrice);
    usePageScrollLock(isOpen);

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
        const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

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
        <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
            <section className="modal-dialog flex h-[min(900px,calc(100vh-40px))] !w-[min(1380px,100%)] flex-col bg-[#fbfaf8] max-sm:h-full max-sm:!w-full" role="dialog" aria-modal="true" aria-labelledby="variant-manager-title" onMouseDown={(event) => event.stopPropagation()}>
                <header className="flex shrink-0 items-start justify-between gap-[18px] border-b border-[color:var(--color-border)] bg-white px-7 pb-[18px] pt-5 max-sm:px-4"><div><small className="text-[11px] font-bold uppercase tracking-[.05em] text-[color:var(--color-accent)]">Товар · Дополнительные настройки</small><h2 id="variant-manager-title" className="mb-1 mt-[3px] text-[28px] font-[770] tracking-[-.045em] text-[#252525] max-sm:text-[22px]">Модификации товара</h2><p className="m-0 text-[12px] text-[#887f78]">Опции, фотографии, цены и остатки собраны отдельно, чтобы основная карточка оставалась простой.</p></div><button type="button" className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#716861]" onClick={onClose} aria-label="Закрыть модификации"><CloseIcon width={20} height={20} /></button></header>
                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-[20px] max-sm:px-[14px]"><div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch"><div><strong className="block text-[13px]">Опции товара</strong><small className="text-[12px] text-[#968e87]">Добавьте характеристики типа «Список» или «Множественный список».</small></div><button type="button" className="button button--secondary min-h-[40px] shrink-0 justify-center" onClick={() => setShowOptionPicker((current) => !current)} aria-expanded={showOptionPicker}><PlusIcon width={15} height={15} />Добавить опцию</button></div>
                    {showOptionPicker && <AttributePicker attributes={attributes} addedAttributeIds={addedAttributeIds} isLoading={isAttributesLoading} error={attributesError} onAdd={addAttribute} onClose={() => setShowOptionPicker(false)} />}
                    {addedOptions.map((option) => <OptionRow key={option.id} option={option} onAddValue={addOptionValue} onDeleteOption={removeAttribute} onDeleteValue={(optionId, valueId, optionName, valueName) => setDeleteWarning({ optionId, valueId, optionName, valueName })} />)}
                    {deleteWarning && <div className="flex items-start gap-3 rounded-[10px] border border-[#e5c3bd] bg-[#fff7f5] p-[11px_13px] text-[#a6402b]" role="alert"><TrashIcon /><p className="m-0 flex-1 text-[11px] leading-[1.45]"><strong className="block text-[12px] text-[#633b33]">Значение «{deleteWarning.valueName}» связано с модификациями</strong>Модификации с этим значением опции «{deleteWarning.optionName}» будут удалены вместе с ним.</p><div className="flex shrink-0 gap-2 max-sm:flex-col"><button type="button" className="rounded-[7px] border border-[#d9c9bf] bg-white px-2 py-1.5 text-[11px] font-bold text-[#5d554f]" onClick={() => setDeleteWarning(null)}>Отмена</button><button type="button" className="rounded-[7px] border border-[#d79d8e] bg-white px-2 py-1.5 text-[11px] font-bold text-[#a6402b]" onClick={() => removeOptionValue(deleteWarning.optionId, deleteWarning.valueId)}>Удалить значение</button></div></div>}
                    <PhotosSection options={addedOptions} />
                    <VariantsSection combinations={combinations} totalCount={totalCount} variantData={variantData} basePrice={normalizedBasePrice} separatePrices={separatePrices} onTogglePrices={toggleSeparatePrices} onVariantChange={updateVariant} />
                </div></div>
                <footer className="flex min-h-[76px] shrink-0 items-center gap-3 border-t border-[color:var(--color-border)] bg-white px-7 py-[11px] max-sm:grid max-sm:grid-cols-2 max-sm:px-[14px]"><div className="flex flex-1 flex-col max-sm:col-span-full"><span className="text-[12px] font-bold">{addedOptions.length} опции · {selectedValuesCount} значений</span><small className="text-[11px] text-[#928981]">Модификации появятся в карточке товара только после сохранения.</small></div><button type="button" className="button button--secondary min-h-[42px] justify-center" onClick={onClose}>Закрыть</button><button type="button" className="button button--primary min-h-[42px] justify-center" onClick={onClose}><SaveIcon size={16} />Сохранить модификации</button></footer>
            </section>
        </div>
    );
}
