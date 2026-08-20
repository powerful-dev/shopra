import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { csrf, request } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Field from '../../components/form/Field';
import SaveIcon from '../../components/icons/SaveIcon';
import BackIcon from '../../components/icons/BackIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import PlusIcon from '../../components/icons/PlusIcon';


export default function AdministratorEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', is_active: true });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [actionsOpen, setActionsOpen] = useState(false);
    const [modules, setModules] = useState([]);
    const { user } = useAuth();
    const isCurrentUser = !isNew && Number(id) === Number(user?.id);

    useEffect(() => {
        if (isNew || !id) return;
        (async () => {
            try {
                const { data: admin } = await request(`/api/admins/${id}`);
                setForm({ name: [admin.first_name, admin.last_name].filter(Boolean).join(' '), email: admin.email ?? '', password: '', password_confirmation: '', is_active: Boolean(admin.is_active) });
            } catch (error) {
                setMessageType('error');
                setMessage(error.message ?? 'Не удалось загрузить администратора.');
            }
        })();
    }, [id, isNew]);

    const updateField = ({ target }) => {
        const { name, value, type, checked } = target;
        setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
        setFormErrors((current) => ({ ...current, [name]: undefined }));
    };

    const saveData = async () => {
        setFormErrors({});
        setMessage('');
        if (form.password !== form.password_confirmation) return setFormErrors({ password_confirmation: ['Пароли не совпадают.'] });
        const nameParts = form.name.trim().split(/\s+/);
        if (nameParts.length < 2) return setFormErrors({ name: ['Укажите имя и фамилию.'] });

        setIsSubmitting(true);
        try {
            await csrf();
            const payload = { 
                first_name: nameParts.shift(), 
                last_name: nameParts.join(' '), 
                email: form.email, 
                password: form.password, 
                is_active: form.is_active,
                module_ids: moduleIds,
            };

            const response = await request(isNew ? '/api/admins' : `/api/admins/${id}`, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            setMessageType('success');
            setMessage(`Администратор «${response.data.full_name || response.data.email}» ${isNew ? 'создан' : 'сохранён'}.`);
            setForm((current) => ({ ...current, password: '', password_confirmation: '' }));
        } catch (error) {
            setFormErrors(error.errors ?? {});
            setMessageType('error');
            setMessage(error.message ?? 'Не удалось сохранить администратора.');
        } finally { setIsSubmitting(false); }
    };

    const nameError = formErrors.name || formErrors.first_name || formErrors.last_name;
    const title = isNew ? 'Создание администратора' : 'Редактирование администратора';

    // загружаем модули 
    useEffect(() => {
        (async () => {
            try {
                if (isNew) {
                    const { data } = await request('/api/sites/1/modules');

                    setModules(
                        data
                            .filter((module) => !module.is_required)
                            .map((module) => ({
                                ...module,
                                enabled: false,
                                locked: false,
                            }))
                    );

                    return;
                }

                const [{ data: admin }, { data: modules }] = await Promise.all([
                    request(`/api/admins/${id}`),
                    request(`/api/admins/${id}/modules`),
                ]);

                setForm({
                    name: [admin.first_name, admin.last_name]
                        .filter(Boolean)
                        .join(' '),
                    email: admin.email ?? '',
                    password: '',
                    password_confirmation: '',
                    is_active: Boolean(admin.is_active),
                });

                setModules(modules);
            } catch (error) {
                setMessageType('error');
                setMessage(error.message ?? 'Не удалось загрузить данные.');
            }
        })();
    }, [id, isNew]);

    const toggleModule = (moduleId) => {
        setModules((current) =>
            current.map((module) => {
                if (module.id !== moduleId || module.locked) {
                    return module;
                }

                return {
                    ...module,
                    enabled: !module.enabled,
                };
            })
        );
    };

    const moduleIds = modules
        .filter((module) => module.enabled)
        .map((module) => module.id);

    return <>

        <p class="mb-5 text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)] max-lg:hidden">Шопра · Панель управления</p>
        
        <section className="mb-5 flex w-full flex-wrap items-center gap-x-6 gap-y-3">

            <div className="flex min-w-0 flex-1 items-center gap-3 max-lg:gap-2">
                <button
                    type="button"
                    className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white p-0 text-[#615950]"
                    aria-label="Вернуться к администраторам"
                    onClick={() => navigate('/admin/administrators')}
                >
                    <BackIcon />
                </button>

                <h1 className="m-0 min-w-0 text-[32px] font-[760] leading-none tracking-[-0.05em] text-[color:var(--color-primary)] max-lg:text-[19px]">
                    {title}
                </h1>
            </div>

            <div className="ml-auto flex shrink-0 items-center justify-end">
                <button
                    className="button button--primary h-[40px] shrink-0 whitespace-nowrap px-[18px]"
                    type="submit"
                    form="administrator-edit-form"
                    disabled={isSubmitting}
                >
                    <SaveIcon />
                    {isSubmitting ? 'Сохранение…' : 'Сохранить'}
                </button>
            </div>

        </section>

        {message && (
            <div className={`alert alert--${messageType} h-[40px] mb-5 py-0 max-lg:col-span-2 max-lg:row-start-2 max-lg:justify-self-end`} role="status" aria-live="polite">
                <span className="alert__icon"><CheckIcon /></span>
                <span>{message}</span>
            </div>
        )}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)]">
            <section className="rounded-[16px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[var(--shadow-sm)]">
                <form id="administrator-edit-form" className="p-5 max-sm:p-4" noValidate onSubmit={(event) => { event.preventDefault(); saveData(); }}><div className="grid grid-cols-2 gap-x-4 gap-y-[18px] max-md:grid-cols-1">
                    <Field className="md:col-span-2" label="Имя и фамилия" error={nameError}><input className={`form-input ${nameError ? '!border-red-500' : ''}`} type="text" name="name" autoComplete="name" value={form.name} onChange={updateField} required /></Field>
                    <Field className="md:col-span-2" label="Email" error={formErrors.email}><input className={`form-input ${formErrors.email ? '!border-red-500' : ''}`} type="email" name="email" autoComplete="email" value={form.email} onChange={updateField} required /></Field>
                    <Field label={isNew ? 'Пароль' : 'Новый пароль'} error={formErrors.password}><input className={`form-input ${formErrors.password ? '!border-red-500' : ''}`} type="password" name="password" autoComplete="new-password" value={form.password} onChange={updateField} placeholder={isNew ? '' : 'Оставьте пустым, чтобы не менять'} required={isNew} /></Field>
                    <Field label={isNew ? 'Повтор пароля' : 'Повтор нового пароля'} error={formErrors.password_confirmation}><input className={`form-input ${formErrors.password_confirmation ? '!border-red-500' : ''}`} type="password" name="password_confirmation" autoComplete="new-password" value={form.password_confirmation} onChange={updateField} placeholder={isNew ? 'Повторите пароль' : 'Повторите новый пароль'} required={isNew || Boolean(form.password)} /></Field>
      
                    <div className="form-field md:col-span-2">
                        <span className="form-label">Активность</span>
                        <label className="switch self-start" aria-label="Активность администратора">
                            <input 
                                className="switch__input" 
                                type="checkbox" 
                                name="is_active" 
                                checked={form.is_active} 
                                disabled={isCurrentUser}
                                onChange={updateField} />
                            <span className="switch__track" />
                        </label>
                    </div>
                </div></form>
            </section>
            <AccessPanel modules={modules} onToggle={toggleModule} />
        </div>
    </>;
}

function AccessPanel({ modules, onToggle }) {
    const enabledModules = modules.filter((module) => module.enabled);
    const disabledModules = modules.filter((module) => !module.enabled);

    return (
        <aside className="access-panel" aria-label="Доступы администратора">

            <section className="access-panel__section">
                <h2 className="access-panel__title">
                    Доступ разрешен
                </h2>

                <div className="access-list">
                    {enabledModules.map((module) => (
                        <button
                            key={module.id}
                            type="button"
                            className="access-list__item access-list__item--granted"
                            disabled={module.locked}
                            onClick={() => onToggle(module.id)}
                        >
                            <span className="access-list__icon">
                                {module.locked ? (
                                    <PlusIcon width={12} height={12} />
                                ) : (
                                    <CheckIcon />
                                )}
                            </span>

                            <span>{module.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="access-panel__section">
                <h2 className="access-panel__title">
                    Добавить доступ
                </h2>

                <div className="access-list">
                    {disabledModules.map((module) => (
                        <button
                            key={module.id}
                            type="button"
                            className="access-list__item access-list__item--action"
                            onClick={() => onToggle(module.id)}
                        >
                            <span className="access-list__icon">
                                <PlusIcon width={12} height={12} />
                            </span>

                            <span>{module.name}</span>
                        </button>
                    ))}
                </div>
            </section>

        </aside>
    );
}
