import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import SearchableSelect from '../../components/admin/SearchableSelect';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import { getShopAttributes, getShopItemAttributes, syncShopItemAttributes } from '../../services/shopAttributes';
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

const rowsFromSavedAttributes = (savedAttributes) => savedAttributes.map((item) => ({
    id: `saved-${item.id}`,
    attributeId: item.attribute_id,
    value: item.value ?? '',
}));

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
    const [creatingForRow, setCreatingForRow] = useState(null);
    const nextRowIdRef = useRef(1);
    const lastSavedProductIdRef = useRef(null);
    const productIdRef = useRef(productId);
    const rowsRef = useRef([]);
    const valuesLoadPromiseRef = useRef(null);
    productIdRef.current = productId;

    const updateRows = (value) => {
        setRows((current) => {
            const next = typeof value === 'function' ? value(current) : value;
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
                    .map((row) => ({ attribute_id: row.attributeId, value: row.value })));

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
                            <article className="grid grid-cols-[minmax(180px,.9fr)_minmax(220px,1.1fr)_38px] items-start gap-2.5 rounded-[12px] border border-[#e3dcd6] bg-[#fcfbfa] p-3 max-md:grid-cols-[minmax(0,1fr)_38px]" key={row.id}>
                                <div className="max-md:col-span-2">
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
                                <div>
                                    <span className="mb-1.5 block text-[11px] font-bold text-[#756d66]">Значение</span>
                                    <AttributeValueControl attribute={attribute} value={row.value} disabled={isValuesLoading} onChange={(value) => updateRowValue(row.id, value)} />
                                </div>
                                <button type="button" className="mt-[24px] grid h-[41px] w-[38px] cursor-pointer place-items-center rounded-[9px] border border-[#e2d9d3] bg-white text-[#8b8179] hover:border-[#e1b9ad] hover:text-[#b7483f] disabled:cursor-wait disabled:opacity-50 max-md:mt-[22px]" disabled={isValuesLoading} onClick={() => updateRows((current) => current.filter((item) => item.id !== row.id))} aria-label="Удалить характеристику">
                                    <TrashIcon />
                                </button>
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

function AttributeValueControl({ attribute, value, disabled, onChange }) {
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
                placeholder={options.length > 0 ? 'Выберите значение' : 'Нет вариантов'}
                searchPlaceholder="Поиск значения"
                emptyMessage="Значения не найдены"
                ariaLabel={`Значение ${attribute.name}`}
                disabled={disabled || options.length === 0}
            />
        );
    }

    if (attribute.type === 'multiselect') {
        return (
            <SearchableSelect
                options={options}
                value={Array.isArray(value) ? value : []}
                onChange={onChange}
                placeholder={options.length > 0 ? 'Выберите значения' : 'Нет вариантов'}
                searchPlaceholder="Поиск значений"
                emptyMessage="Значения не найдены"
                ariaLabel={`Значения ${attribute.name}`}
                disabled={disabled || options.length === 0}
                multiple
                closeOnSelect={false}
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
