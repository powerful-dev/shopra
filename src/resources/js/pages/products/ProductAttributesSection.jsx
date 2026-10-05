import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { MediaDragHandle } from '../../components/admin/MediaCardControls';
import SearchableSelect from '../../components/admin/SearchableSelect';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import { createShopAttributeOption, getShopAttributes, getShopItemAttributes, syncShopItemAttributes } from '../../services/shopAttributes';
import CreateAttributeModal from './CreateAttributeModal';

const fieldClass = 'h-[41px] w-full rounded-[9px] border border-[#ddd5cf] bg-white px-[11px] text-[13px] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]';

const sortAttributes = (attributes) => [...attributes].sort((left, right) => (
    left.sort_order - right.sort_order || left.id - right.id
));

const emptyValueFor = (attribute) => {
    if (attribute?.type === 'multiselect') return [];
    if (attribute?.type === 'boolean') return false;

    return '';
};

const normalizeRowOrder = (rows) => rows.map((row, sortOrder) => ({ ...row, sortOrder }));

const rowsFromSavedAttributes = (savedAttributes) => normalizeRowOrder(
    [...savedAttributes]
        .sort((left, right) => left.sort_order - right.sort_order || left.id - right.id)
        .map((item) => ({
            id: `saved-${item.id}`,
            attributeId: item.attribute_id,
            value: item.value ?? '',
        })),
);

const mergeAttributes = (current, savedAttributes) => sortAttributes([
    ...current,
    ...savedAttributes
        .map((item) => item.attribute)
        .filter((attribute) => attribute && !current.some((item) => item.id === attribute.id)),
]);

const ProductAttributesSection = forwardRef(function ProductAttributesSection({ productId }, ref) {
    const [attributes, setAttributes] = useState([]);
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isValuesLoading, setIsValuesLoading] = useState(Boolean(productId));
    const [loadError, setLoadError] = useState('');
    const [valuesError, setValuesError] = useState('');
    const [saveError, setSaveError] = useState('');
    const [optionError, setOptionError] = useState('');
    const [creatingForRow, setCreatingForRow] = useState(null);
    const [creatingOptionRowIds, setCreatingOptionRowIds] = useState(() => new Set());
    const [draggedRowId, setDraggedRowId] = useState(null);
    const [rowDropTarget, setRowDropTarget] = useState(null);
    const nextRowIdRef = useRef(1);
    const lastSavedProductIdRef = useRef(null);
    const productIdRef = useRef(productId);
    const rowsRef = useRef([]);
    const draggedRowIdRef = useRef(null);
    const valuesLoadPromiseRef = useRef(null);
    const creatingOptionRowIdsRef = useRef(new Set());
    productIdRef.current = productId;

    const updateRows = (value) => {
        setRows((current) => {
            const next = normalizeRowOrder(typeof value === 'function' ? value(current) : value);
            rowsRef.current = next;

            return next;
        });
    };

    useEffect(() => {
        const controller = new AbortController();

        getShopAttributes({ signal: controller.signal })
            .then((loadedAttributes) => {
                setAttributes(sortAttributes(loadedAttributes));
                setLoadError('');
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Unable to load product attributes.', error);
                    setLoadError('Не удалось загрузить справочник характеристик.');
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!productId) {
            updateRows([]);
            setValuesError('');
            setSaveError('');
            setOptionError('');
            creatingOptionRowIdsRef.current.clear();
            setCreatingOptionRowIds(new Set());
            setIsValuesLoading(false);
            valuesLoadPromiseRef.current = null;

            return undefined;
        }

        if (lastSavedProductIdRef.current === String(productId)) {
            lastSavedProductIdRef.current = null;
            setIsValuesLoading(false);

            return undefined;
        }

        const controller = new AbortController();
        setIsValuesLoading(true);
        setValuesError('');

        const loadPromise = getShopItemAttributes(productId, { signal: controller.signal })
            .then((savedAttributes) => {
                if (controller.signal.aborted) return false;

                setAttributes((current) => mergeAttributes(current, savedAttributes));
                updateRows(rowsFromSavedAttributes(savedAttributes));

                return true;
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Unable to load product attribute values.', error);
                    setValuesError('Не удалось загрузить характеристики товара.');
                }

                return false;
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsValuesLoading(false);
                if (valuesLoadPromiseRef.current === loadPromise) valuesLoadPromiseRef.current = null;
            });
        valuesLoadPromiseRef.current = loadPromise;

        return () => controller.abort();
    }, [productId]);

    useImperativeHandle(ref, () => ({
        preserveForProduct: (savedProductId) => {
            lastSavedProductIdRef.current = String(savedProductId);
        },
        save: async (savedProductId) => {
            setSaveError('');

            try {
                if (valuesLoadPromiseRef.current && ! await valuesLoadPromiseRef.current) {
                    throw new Error('Не удалось загрузить характеристики товара перед сохранением.');
                }

                const savedAttributes = await syncShopItemAttributes(savedProductId, rowsRef.current
                    .filter((row) => row.attributeId !== null)
                    .map((row) => ({
                        attribute_id: row.attributeId,
                        value: row.value,
                        sort_order: row.sortOrder,
                    })));

                lastSavedProductIdRef.current = productIdRef.current ? null : String(savedProductId);
                setAttributes((current) => mergeAttributes(current, savedAttributes));
                updateRows(rowsFromSavedAttributes(savedAttributes));

                return savedAttributes;
            } catch (error) {
                console.error('Unable to save product attribute values.', error);
                setSaveError(error.message || 'Не удалось сохранить характеристики товара.');
                throw error;
            }
        },
    }), []);

    const attributesById = useMemo(() => new Map(
        attributes.map((attribute) => [attribute.id, attribute]),
    ), [attributes]);

    const addRow = () => {
        const id = nextRowIdRef.current;
        nextRowIdRef.current += 1;
        updateRows((current) => [...current, { id, attributeId: null, value: '' }]);
    };

    const updateRowAttribute = (rowId, attributeId) => {
        const attribute = attributesById.get(attributeId);

        updateRows((current) => current.map((row) => row.id === rowId
            ? { ...row, attributeId, value: emptyValueFor(attribute) }
            : row));
    };

    const updateRowValue = (rowId, value) => {
        updateRows((current) => current.map((row) => row.id === rowId ? { ...row, value } : row));
    };

    const handleCreated = (attribute) => {
        setAttributes((current) => sortAttributes([
            ...current.filter((item) => item.id !== attribute.id),
            attribute,
        ]));
        updateRows((current) => current.map((row) => row.id === creatingForRow?.rowId
            ? { ...row, attributeId: attribute.id, value: emptyValueFor(attribute) }
            : row));
        setCreatingForRow(null);
    };

    const createOptionForRow = async (rowId, attribute, value) => {
        const options = attribute.options ?? [];
        const normalizedValue = value.trim().toLocaleLowerCase();

        if (options.some((option) => option.value.trim().toLocaleLowerCase() === normalizedValue)) {
            setOptionError(`Значение «${value.trim()}» уже существует.`);

            return false;
        }

        if (creatingOptionRowIdsRef.current.has(rowId)) return false;

        const sortOrder = options.reduce((highest, option) => Math.max(highest, option.sort_order), -1) + 1;

        creatingOptionRowIdsRef.current.add(rowId);
        setCreatingOptionRowIds(new Set(creatingOptionRowIdsRef.current));
        setOptionError('');

        try {
            const option = await createShopAttributeOption(attribute.id, {
                value,
                sort_order: sortOrder,
            });

            setAttributes((current) => current.map((item) => item.id === attribute.id
                ? { ...item, options: [...(item.options ?? []), option] }
                : item));
            updateRows((current) => current.map((row) => {
                if (row.id !== rowId) return row;

                return {
                    ...row,
                    value: attribute.type === 'multiselect'
                        ? [...new Set([...(Array.isArray(row.value) ? row.value : []), option.id])]
                        : option.id,
                };
            }));

            return true;
        } catch (error) {
            console.error('Unable to create product attribute option.', error);
            setOptionError(Object.values(error.errors ?? {}).flat()[0]
                || error.message
                || 'Не удалось создать значение характеристики.');

            return false;
        } finally {
            creatingOptionRowIdsRef.current.delete(rowId);
            setCreatingOptionRowIds(new Set(creatingOptionRowIdsRef.current));
        }
    };

    const endRowDrag = () => {
        draggedRowIdRef.current = null;
        setDraggedRowId(null);
        setRowDropTarget(null);
    };

    const moveRow = (event, targetRow) => {
        const draggedId = draggedRowIdRef.current;

        if (draggedId === null || draggedId === targetRow.id || isValuesLoading) return;

        event.preventDefault();
        const currentRows = rowsRef.current;
        const draggedRow = currentRows.find((row) => row.id === draggedId);
        const reorderedRows = currentRows.filter((row) => row.id !== draggedId);
        const targetIndex = reorderedRows.findIndex((row) => row.id === targetRow.id);
        const targetRect = event.currentTarget.getBoundingClientRect();
        const position = event.clientY < targetRect.top + targetRect.height / 2 ? 'before' : 'after';

        if (!draggedRow || targetIndex < 0) {
            endRowDrag();

            return;
        }

        reorderedRows.splice(targetIndex + (position === 'after' ? 1 : 0), 0, draggedRow);
        endRowDrag();
        updateRows(reorderedRows);
    };

    const isBusy = isLoading || isValuesLoading;

    return (
        <div>
            <div className="mb-3 flex items-start justify-between gap-4 max-sm:flex-col">
                <div>
                    <strong className="block text-[12px] text-[#554e48]">Характеристики товара</strong>
                    <p className="mb-0 mt-1 text-[12px] leading-[1.45] text-[#918880]">Добавьте параметры, по которым покупатели смогут сравнивать товары.</p>
                </div>
                <button type="button" className="button button--outline min-h-9 shrink-0 max-sm:w-full" disabled={isValuesLoading} onClick={addRow}>
                    <PlusIcon width="15" height="15" />Добавить характеристику
                </button>
            </div>

            {loadError && <p className="mb-3 mt-0 rounded-lg bg-[#fff5ef] px-3 py-2 text-[12px] text-[#9a3b12]" role="alert">{loadError}</p>}
            {valuesError && <p className="mb-3 mt-0 rounded-lg bg-[#fff5ef] px-3 py-2 text-[12px] text-[#9a3b12]" role="alert">{valuesError}</p>}
            {saveError && <p className="mb-3 mt-0 rounded-lg bg-[#fff5ef] px-3 py-2 text-[12px] text-[#9a3b12]" role="alert">{saveError}</p>}
            {optionError && <p className="mb-3 mt-0 rounded-lg bg-[#fff5ef] px-3 py-2 text-[12px] text-[#9a3b12]" role="alert">{optionError}</p>}

            {rows.length === 0 ? (
                <div className="rounded-[11px] border border-dashed border-[#ded6d0] bg-[#fcfbfa] px-4 py-5 text-center text-[12px] text-[#918880]">
                    {isValuesLoading ? 'Загрузка характеристик…' : 'Характеристики ещё не добавлены.'}
                </div>
            ) : (
                <div className="space-y-2.5">
                    {rows.map((row) => {
                        const attribute = attributesById.get(row.attributeId);
                        const selectedByOtherRows = new Set(rows
                            .filter((item) => item.id !== row.id && item.attributeId !== null)
                            .map((item) => item.attributeId));
                        const attributeOptions = attributes.map((item) => ({
                            value: item.id,
                            label: item.name,
                            disabled: selectedByOtherRows.has(item.id),
                        }));

                        return (
                            <article
                                className={`relative grid grid-cols-[30px_minmax(180px,.9fr)_minmax(220px,1.1fr)_38px] items-start gap-2.5 rounded-[12px] border bg-[#fcfbfa] p-3 transition-[border-color,box-shadow,opacity,transform] max-md:grid-cols-[30px_minmax(0,1fr)_38px] ${draggedRowId === row.id ? 'scale-[.99] border-[color:var(--color-accent)] opacity-45' : 'border-[#e3dcd6]'} ${rowDropTarget?.id === row.id ? 'border-[color:var(--color-accent)] ring-2 ring-[rgba(184,79,24,.12)]' : ''}`}
                                key={row.id}
                                data-attribute-row
                                onDragOver={(event) => {
                                    if (draggedRowIdRef.current === null || isValuesLoading) return;

                                    event.preventDefault();
                                    const rect = event.currentTarget.getBoundingClientRect();
                                    const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
                                    event.dataTransfer.dropEffect = draggedRowIdRef.current === row.id ? 'none' : 'move';
                                    setRowDropTarget(draggedRowIdRef.current === row.id ? null : { id: row.id, position });
                                }}
                                onDrop={(event) => moveRow(event, row)}
                            >
                                <MediaDragHandle
                                    className={`mt-[24px] !grid h-[41px] w-[30px] shrink-0 place-items-center rounded-[8px] border border-transparent text-[#9a918a] hover:border-[#ddd3cc] hover:bg-white hover:text-[color:var(--color-accent)] ${isValuesLoading ? '!cursor-not-allowed opacity-50' : '!cursor-grab'} ${draggedRowId === row.id ? '!cursor-grabbing' : ''} max-md:col-start-1 max-md:row-start-1`}
                                    aria-label="Изменить порядок характеристики"
                                    title="Перетащить"
                                    draggable={!isValuesLoading}
                                    onDragStart={(event) => {
                                        if (isValuesLoading) {
                                            event.preventDefault();

                                            return;
                                        }

                                        draggedRowIdRef.current = row.id;
                                        setDraggedRowId(row.id);
                                        event.dataTransfer.effectAllowed = 'move';
                                        event.dataTransfer.setData('application/x-shopra-attribute-row-id', String(row.id));
                                        event.dataTransfer.setDragImage(event.currentTarget.closest('[data-attribute-row]'), 20, 20);
                                    }}
                                    onDragEnd={endRowDrag}
                                />
                                <div className="max-md:col-span-2 max-md:col-start-2 max-md:row-start-1">
                                    <span className="mb-1.5 block text-[11px] font-bold text-[#756d66]">Характеристика</span>
                                    <SearchableSelect
                                        options={attributeOptions}
                                        value={row.attributeId}
                                        onChange={(attributeId) => updateRowAttribute(row.id, attributeId)}
                                        placeholder={isBusy ? 'Загрузка…' : 'Выберите характеристику'}
                                        searchPlaceholder="Поиск характеристики"
                                        emptyMessage="Характеристики не найдены"
                                        ariaLabel="Выберите характеристику"
                                        ariaBusy={isBusy}
                                        disabled={isBusy}
                                        actionLabel="Создать характеристику"
                                        onAction={(query) => setCreatingForRow({ rowId: row.id, initialName: query })}
                                    />
                                </div>
                                <div className="max-md:col-span-2 max-md:col-start-1 max-md:row-start-2">
                                    <span className="mb-1.5 block text-[11px] font-bold text-[#756d66]">Значение</span>
                                    <AttributeValueControl
                                        attribute={attribute}
                                        value={row.value}
                                        disabled={isValuesLoading}
                                        isCreatingOption={creatingOptionRowIds.has(row.id)}
                                        onChange={(value) => updateRowValue(row.id, value)}
                                        onCreateOption={(value) => createOptionForRow(row.id, attribute, value)}
                                    />
                                </div>
                                <button type="button" className="mt-[24px] grid h-[41px] w-[38px] cursor-pointer place-items-center rounded-[9px] border border-[#e2d9d3] bg-white text-[#8b8179] hover:border-[#e1b9ad] hover:text-[#b7483f] disabled:cursor-wait disabled:opacity-50 max-md:col-start-3 max-md:row-start-2 max-md:mt-[22px]" disabled={isValuesLoading} onClick={() => updateRows((current) => current.filter((item) => item.id !== row.id))} aria-label="Удалить характеристику">
                                    <TrashIcon />
                                </button>
                                {rowDropTarget?.id === row.id && (
                                    <span className={`pointer-events-none absolute inset-x-2 z-10 h-0.5 rounded-full bg-[color:var(--color-accent)] ${rowDropTarget.position === 'before' ? 'top-0' : 'bottom-0'}`} aria-hidden="true" />
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            <CreateAttributeModal
                isOpen={creatingForRow !== null}
                initialName={creatingForRow?.initialName}
                onClose={() => setCreatingForRow(null)}
                onCreated={handleCreated}
            />
        </div>
    );
});

export default ProductAttributesSection;

function AttributeValueControl({ attribute, value, disabled, isCreatingOption, onChange, onCreateOption }) {
    if (!attribute) {
        return <div className="flex h-[41px] items-center rounded-[9px] border border-dashed border-[#ddd5cf] bg-white px-[11px] text-[12px] text-[#aaa19a]">Сначала выберите характеристику</div>;
    }

    const options = (attribute.options ?? []).map((option) => ({
        value: option.id,
        label: option.value,
    }));

    if (attribute.type === 'select') {
        return (
            <SearchableSelect
                options={options}
                value={value || null}
                onChange={onChange}
                placeholder={isCreatingOption ? 'Создание…' : (options.length > 0 ? 'Выберите значение' : 'Введите новое значение')}
                searchPlaceholder="Поиск значения"
                emptyMessage="Значения не найдены"
                ariaLabel={`Значение ${attribute.name}`}
                ariaBusy={isCreatingOption}
                disabled={disabled}
                actionLabel={(query) => `Создать «${query}»`}
                actionRequiresQuery
                actionWhenNoResults
                onAction={onCreateOption}
                createActionLabel="Добавить новое значение"
                createInputPlaceholder="Новое значение"
                createSubmitLabel="Добавить"
                createCancelLabel="Отмена"
                createPending={isCreatingOption}
                onCreate={onCreateOption}
            />
        );
    }

    if (attribute.type === 'multiselect') {
        return (
            <SearchableSelect
                options={options}
                value={Array.isArray(value) ? value : []}
                onChange={onChange}
                placeholder={isCreatingOption ? 'Создание…' : (options.length > 0 ? 'Выберите значения' : 'Введите новое значение')}
                searchPlaceholder="Поиск значений"
                emptyMessage="Значения не найдены"
                ariaLabel={`Значения ${attribute.name}`}
                ariaBusy={isCreatingOption}
                disabled={disabled}
                multiple
                closeOnSelect={false}
                actionLabel={(query) => `Создать «${query}»`}
                actionRequiresQuery
                actionWhenNoResults
                onAction={onCreateOption}
                createActionLabel="Добавить новое значение"
                createInputPlaceholder="Новое значение"
                createSubmitLabel="Добавить"
                createCancelLabel="Отмена"
                createPending={isCreatingOption}
                onCreate={onCreateOption}
            />
        );
    }

    if (attribute.type === 'number') {
        return (
            <div className="relative">
                <input className={`${fieldClass} ${attribute.unit ? 'pr-[58px]' : ''}`} type="number" step="any" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
                {attribute.unit && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[12px] font-bold text-[#817870]">{attribute.unit}</span>}
            </div>
        );
    }

    if (attribute.type === 'boolean') {
        return (
            <div className="flex h-[41px] items-center gap-2.5 rounded-[9px] border border-[#ddd5cf] bg-white px-[11px]">
                <label className="switch">
                    <input className="switch__input" type="checkbox" checked={Boolean(value)} disabled={disabled} aria-label={`${attribute.name}: ${value ? 'Да' : 'Нет'}`} onChange={(event) => onChange(event.target.checked)} />
                    <span className="switch__track" />
                </label>
                <span className="text-[12px] font-bold text-[#554e48]">{value ? 'Да' : 'Нет'}</span>
            </div>
        );
    }

    return <input className={fieldClass} type="text" value={value} placeholder="Введите значение" disabled={disabled} onChange={(event) => onChange(event.target.value)} />;
}
