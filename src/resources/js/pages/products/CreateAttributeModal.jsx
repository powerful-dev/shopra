import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Field from '../../components/form/Field';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import CloseIcon from '../../components/icons/CloseIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import { createShopAttributeWithOptions, getShopAttributeUnits, updateShopAttributeWithOptions } from '../../services/shopAttributes';

const attributeTypes = [
    ['text', 'Текст'],
    ['number', 'Число'],
    ['boolean', 'Да / Нет'],
    ['select', 'Список'],
    ['multiselect', 'Множественный список'],
];

const emptyForm = (name = '', attribute = null) => ({
    name: attribute?.name ?? name,
    type: attribute?.type ?? 'text',
    unit: attribute?.unit ?? '',
    options: (attribute?.options ?? []).map((option) => ({
        key: `option-${option.id}`,
        id: option.id,
        value: option.value,
    })),
    isVisible: attribute?.is_visible ?? true,
    isFilterable: attribute?.is_filterable ?? false,
});

export default function CreateAttributeModal({ isOpen, initialName = '', attribute = null, onClose, onCreated, onSaved }) {
    const { t } = useTranslation();
    const [form, setForm] = useState(() => emptyForm());
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [units, setUnits] = useState([]);
    const [areUnitsLoading, setAreUnitsLoading] = useState(false);
    const [unitsError, setUnitsError] = useState(null);
    const nameRef = useRef(null);
    const nextOptionKeyRef = useRef(1);
    const isEditing = attribute !== null;
    const isListType = form.type === 'select' || form.type === 'multiselect';
    usePageScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen) return;

        setForm(emptyForm(initialName, attribute));
        setErrors({});
        setMessage('');
        setIsSaving(false);
        window.requestAnimationFrame(() => nameRef.current?.focus());
    }, [attribute, initialName, isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const controller = new AbortController();

        setAreUnitsLoading(true);
        setUnitsError(null);
        getShopAttributeUnits({ signal: controller.signal })
            .then(setUnits)
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Unable to load product attribute units.', error);
                    setUnitsError([t('productEditPage.createAttribute.unitsLoadError')]);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setAreUnitsLoading(false);
            });

        return () => controller.abort();
    }, [isOpen, t]);

    if (!isOpen) return null;

    const updateType = (type) => {
        const nextIsListType = type === 'select' || type === 'multiselect';

        setForm((current) => ({
            ...current,
            type,
            unit: type === 'number' ? current.unit : '',
            options: nextIsListType
                ? (current.options.length > 0 ? current.options : [newOption(nextOptionKeyRef)])
                : [],
        }));
        setErrors({});
        setMessage('');
    };

    const updateOption = (key, value) => {
        setForm((current) => ({
            ...current,
            options: current.options.map((option) => option.key === key ? { ...option, value } : option),
        }));
    };

    const removeOption = (key) => {
        setForm((current) => ({
            ...current,
            options: current.options.filter((option) => option.key !== key),
        }));
    };

    const submit = async (event) => {
        event.preventDefault();
        const name = form.name.trim();
        const optionValues = isListType
            ? form.options.map((option) => ({ ...option, value: option.value.trim() })).filter((option) => option.value)
            : [];

        if (!name) {
            setErrors({ name: ['Введите название характеристики.'] });
            nameRef.current?.focus();
            return;
        }

        const normalizedOptions = optionValues.map((option) => option.value.toLocaleLowerCase());
        if (new Set(normalizedOptions).size !== normalizedOptions.length) {
            setErrors({ value: ['Значения вариантов не должны повторяться.'] });
            return;
        }

        setErrors({});
        setMessage('');
        setIsSaving(true);

        try {
            const attributeData = {
                name,
                unit: form.type === 'number' && form.unit.trim() ? form.unit.trim() : null,
                is_visible: form.isVisible,
                is_filterable: form.isFilterable,
            };
            const savedAttribute = isEditing
                ? await updateShopAttributeWithOptions(attribute, attributeData, optionValues.map(({ id, value }) => ({ id, value })))
                : await createShopAttributeWithOptions(
                    { ...attributeData, type: form.type },
                    optionValues.map((option) => option.value),
                );

            onSaved?.(savedAttribute);
            onCreated?.(savedAttribute);
        } catch (error) {
            setErrors(error.errors ?? {});
            setMessage(error.message || (isEditing ? 'Не удалось сохранить характеристику.' : 'Не удалось создать характеристику.'));
        } finally {
            setIsSaving(false);
        }
    };

    const close = () => {
        if (!isSaving) onClose();
    };

    return createPortal(
        <div className="modal-overlay" role="presentation" onMouseDown={close}>
            <section
                className="modal-dialog flex max-h-[min(720px,calc(100vh-44px))] max-w-[560px] flex-col bg-[#fbfaf8]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="attribute-form-modal-title"
                aria-busy={isSaving}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border)] bg-white px-5 py-4">
                    <div>
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.12em] text-[color:var(--color-accent)]">Справочник</p>
                        <h2 id="attribute-form-modal-title" className="mb-0 mt-1 text-[21px] font-[760] tracking-[-.035em] text-[#312d29]">{isEditing ? 'Редактирование характеристики' : 'Новая характеристика'}</h2>
                    </div>
                    <button type="button" className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-[9px] border border-[color:var(--color-border)] bg-white text-[#706861] hover:text-[color:var(--color-accent)]" disabled={isSaving} onClick={close} aria-label="Закрыть">
                        <CloseIcon width="17" height="17" />
                    </button>
                </header>

                <form id="attribute-form" className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5" onSubmit={submit}>
                    {message && <p className="m-0 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700" role="alert">{message}</p>}
                    <Field label="Название" error={errors.name}>
                        <Input ref={nameRef} value={form.name} disabled={isSaving} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                    </Field>
                    <div className={`grid gap-3 ${form.type === 'number' ? 'sm:grid-cols-[minmax(0,1fr)_160px]' : ''}`}>
                        <Field label="Тип" error={errors.type}>
                            <Select value={form.type} disabled={isSaving || isEditing} onChange={(event) => updateType(event.target.value)}>
                                {attributeTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </Select>
                            {isEditing && <span className="mt-1 text-[11px] leading-[1.4] text-[#918880]">Тип нельзя изменить после создания характеристики.</span>}
                        </Field>
                        {form.type === 'number' && (
                            <Field label={t('productEditPage.createAttribute.measurementUnit')} error={errors.unit ?? unitsError}>
                                <Select value={form.unit} disabled={isSaving || areUnitsLoading} onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}>
                                    <option value="">{t('productEditPage.createAttribute.withoutMeasurementUnit')}</option>
                                    {form.unit && !units.some((unit) => unit.value === form.unit) && (
                                        <option value={form.unit}>{form.unit}</option>
                                    )}
                                    {units.map((unit) => <option key={unit.value} value={unit.value}>{unit.name}</option>)}
                                </Select>
                            </Field>
                        )}
                    </div>

                    <div className="divide-y divide-[color:var(--color-border)] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-white">
                        <SwitchField
                            label={t('productEditPage.createAttribute.isVisible')}
                            checked={form.isVisible}
                            disabled={isSaving}
                            onChange={(isVisible) => setForm((current) => ({ ...current, isVisible }))}
                        />
                        <SwitchField
                            label={t('productEditPage.createAttribute.isFilterable')}
                            checked={form.isFilterable}
                            disabled={isSaving}
                            onChange={(isFilterable) => setForm((current) => ({ ...current, isFilterable }))}
                        />
                    </div>

                    {isListType && (
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-[12px] font-bold text-[#554e48]">Варианты значений</span>
                                <button type="button" className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[12px] font-bold text-[color:var(--color-accent)]" disabled={isSaving} onClick={() => setForm((current) => ({ ...current, options: [...current.options, newOption(nextOptionKeyRef)] }))}>
                                    <PlusIcon width="15" height="15" />Добавить вариант
                                </button>
                            </div>
                            <div className="space-y-2">
                                {form.options.map((option, index) => (
                                    <div className="grid grid-cols-[minmax(0,1fr)_36px] gap-2" key={option.key}>
                                        <Input value={option.value} placeholder={`Вариант ${index + 1}`} disabled={isSaving} onChange={(event) => updateOption(option.key, event.target.value)} />
                                        <button type="button" className="grid h-[42px] w-[36px] cursor-pointer place-items-center rounded-[9px] border border-[#e2d9d3] bg-white text-[#8b8179] hover:border-[#e1b9ad] hover:text-[#b7483f]" disabled={isSaving} onClick={() => removeOption(option.key)} aria-label={`Удалить вариант ${index + 1}`}>
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.value && <p className="mb-0 mt-1.5 text-[11px] text-red-600">{errors.value[0]}</p>}
                        </div>
                    )}
                </form>

                <footer className="flex items-center justify-end gap-2 border-t border-[color:var(--color-border)] bg-white px-5 py-3">
                    <button type="button" className="button button--secondary" disabled={isSaving} onClick={close}>Отмена</button>
                    <button type="submit" form="attribute-form" className="button button--primary" disabled={isSaving}>{isSaving ? 'Сохранение…' : (isEditing ? 'Сохранить' : 'Создать')}</button>
                </footer>
            </section>
        </div>,
        document.body,
    );
}

function newOption(nextOptionKeyRef) {
    const key = `new-option-${nextOptionKeyRef.current}`;
    nextOptionKeyRef.current += 1;

    return { key, id: null, value: '' };
}

function SwitchField({ label, checked, disabled, onChange }) {
    return (
        <div className="flex min-h-[48px] items-center justify-between gap-4 px-3 py-2.5">
            <span className="text-[12px] font-bold text-[#554e48]">{label}</span>
            <label className="switch shrink-0" aria-label={label}>
                <input
                    className="switch__input"
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.checked)}
                />
                <span className="switch__track" />
            </label>
        </div>
    );
}
