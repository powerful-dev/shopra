import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Field from '../../components/form/Field';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import CloseIcon from '../../components/icons/CloseIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import { createShopAttributeWithOptions } from '../../services/shopAttributes';

const attributeTypes = [
    ['text', 'Текст'],
    ['number', 'Число'],
    ['boolean', 'Да / Нет'],
    ['select', 'Список'],
    ['multiselect', 'Множественный список'],
];

const emptyForm = (name = '') => ({
    name,
    type: 'text',
    unit: '',
    options: [],
});

export default function CreateAttributeModal({ isOpen, initialName = '', onClose, onCreated }) {
    const [form, setForm] = useState(() => emptyForm());
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const nameRef = useRef(null);
    const isListType = form.type === 'select' || form.type === 'multiselect';
    usePageScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen) return;

        setForm(emptyForm(initialName));
        setErrors({});
        setMessage('');
        setIsSaving(false);
        window.requestAnimationFrame(() => nameRef.current?.focus());
    }, [initialName, isOpen]);

    if (!isOpen) return null;

    const updateType = (type) => {
        const nextIsListType = type === 'select' || type === 'multiselect';

        setForm((current) => ({
            ...current,
            type,
            unit: type === 'number' ? current.unit : '',
            options: nextIsListType
                ? (current.options.length > 0 ? current.options : [''])
                : [],
        }));
        setErrors({});
        setMessage('');
    };

    const updateOption = (index, value) => {
        setForm((current) => ({
            ...current,
            options: current.options.map((option, optionIndex) => optionIndex === index ? value : option),
        }));
    };

    const removeOption = (index) => {
        setForm((current) => ({
            ...current,
            options: current.options.filter((option, optionIndex) => optionIndex !== index),
        }));
    };

    const submit = async (event) => {
        event.preventDefault();
        const name = form.name.trim();

        if (!name) {
            setErrors({ name: ['Введите название характеристики.'] });
            nameRef.current?.focus();
            return;
        }

        setErrors({});
        setMessage('');
        setIsSaving(true);

        try {
            const attribute = await createShopAttributeWithOptions({
                name,
                type: form.type,
                unit: form.type === 'number' && form.unit.trim() ? form.unit.trim() : null,
            }, isListType ? form.options.map((value) => value.trim()).filter(Boolean) : []);

            onCreated(attribute);
        } catch (error) {
            setErrors(error.errors ?? {});
            setMessage(error.message || 'Не удалось создать характеристику.');
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
                aria-labelledby="create-attribute-modal-title"
                aria-busy={isSaving}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border)] bg-white px-5 py-4">
                    <div>
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.12em] text-[color:var(--color-accent)]">Справочник</p>
                        <h2 id="create-attribute-modal-title" className="mb-0 mt-1 text-[21px] font-[760] tracking-[-.035em] text-[#312d29]">Новая характеристика</h2>
                    </div>
                    <button type="button" className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-[9px] border border-[color:var(--color-border)] bg-white text-[#706861] hover:text-[color:var(--color-accent)]" disabled={isSaving} onClick={close} aria-label="Закрыть">
                        <CloseIcon width="17" height="17" />
                    </button>
                </header>

                <form id="create-attribute-form" className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5" onSubmit={submit}>
                    {message && <p className="m-0 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700" role="alert">{message}</p>}
                    <Field label="Название" error={errors.name}>
                        <Input ref={nameRef} value={form.name} disabled={isSaving} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                    </Field>
                    <div className={`grid gap-3 ${form.type === 'number' ? 'sm:grid-cols-[minmax(0,1fr)_160px]' : ''}`}>
                        <Field label="Тип" error={errors.type}>
                            <Select value={form.type} disabled={isSaving} onChange={(event) => updateType(event.target.value)}>
                                {attributeTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </Select>
                        </Field>
                        {form.type === 'number' && (
                            <Field label="Единица" error={errors.unit}>
                                <Input value={form.unit} placeholder="шт., кг, см" disabled={isSaving} onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))} />
                            </Field>
                        )}
                    </div>

                    {isListType && (
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-[12px] font-bold text-[#554e48]">Варианты значений</span>
                                <button type="button" className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[12px] font-bold text-[color:var(--color-accent)]" disabled={isSaving} onClick={() => setForm((current) => ({ ...current, options: [...current.options, ''] }))}>
                                    <PlusIcon width="15" height="15" />Добавить вариант
                                </button>
                            </div>
                            <div className="space-y-2">
                                {form.options.map((option, index) => (
                                    <div className="grid grid-cols-[minmax(0,1fr)_36px] gap-2" key={index}>
                                        <Input value={option} placeholder={`Вариант ${index + 1}`} disabled={isSaving} onChange={(event) => updateOption(index, event.target.value)} />
                                        <button type="button" className="grid h-[42px] w-[36px] cursor-pointer place-items-center rounded-[9px] border border-[#e2d9d3] bg-white text-[#8b8179] hover:border-[#e1b9ad] hover:text-[#b7483f]" disabled={isSaving} onClick={() => removeOption(index)} aria-label={`Удалить вариант ${index + 1}`}>
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
                    <button type="submit" form="create-attribute-form" className="button button--primary" disabled={isSaving}>{isSaving ? 'Создание…' : 'Создать'}</button>
                </footer>
            </section>
        </div>,
        document.body,
    );
}
