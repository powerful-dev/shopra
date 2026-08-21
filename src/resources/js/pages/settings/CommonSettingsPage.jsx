import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from '../../components/form/Field';
import SaveIcon from '../../components/icons/SaveIcon';
import BackIcon from '../../components/icons/BackIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import { csrf, request } from '../../services/api';


export default function CommonSettingsPage() {
    const [form, setForm] = useState({
        site_name: '',
        admin_language_id: '',
        site_language_id: '',
    });
    const [adminLanguages, setAdminLanguages] = useState([]);
    const [siteLanguages, setSiteLanguages] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await request('/api/settings/common');

                setForm({
                    site_name: data.site_name ?? '',
                    admin_language_id: data.admin_language_id ?? '',
                    site_language_id: data.site_language_id ?? '',
                });
                setAdminLanguages(data.admin_languages ?? []);
                setSiteLanguages(data.site_languages ?? []);
            } catch (error) {
                setMessageType('error');
                setMessage(error.message ?? 'Не удалось загрузить основные настройки.');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const updateField = ({ target }) => {
        setForm((current) => ({ ...current, [target.name]: target.value }));
        setFormErrors((current) => ({ ...current, [target.name]: undefined }));
    };

    const saveData = async () => {
        setFormErrors({});
        setMessage('');
        setIsSubmitting(true);

        try {
            await csrf();
            const { data } = await request('/api/settings/common', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            setForm({
                site_name: data.site_name ?? '',
                admin_language_id: data.admin_language_id ?? '',
                site_language_id: data.site_language_id ?? '',
            });
            setAdminLanguages(data.admin_languages ?? []);
            setSiteLanguages(data.site_languages ?? []);
            setMessageType('success');
            setMessage('Основные настройки сохранены.');
        } catch (error) {
            setFormErrors(error.errors ?? {});
            setMessageType('error');
            setMessage(error.message ?? 'Не удалось сохранить основные настройки.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <p className="mb-5 text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)] max-lg:hidden">
                Шопра · Панель управления
            </p>

            <section className="mb-5 flex w-full flex-wrap items-center gap-x-6 gap-y-3">
            
                <div className="flex min-w-0 flex-1 items-center gap-3 max-lg:gap-2">
                    <button
                        type="button"
                        className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white p-0 text-[#615950]"
    
                        onClick={() => navigate('/admin/settings')}
                    >
                        <BackIcon />
                    </button>
    
                    <h1 className="m-0 min-w-0 text-[32px] font-[760] leading-none tracking-[-0.05em] text-[color:var(--color-primary)] max-lg:text-[19px]">
                        Основные настройки
                    </h1>
                </div>
    
                <div className="ml-auto flex shrink-0 items-center justify-end">
                    <button
                        className="button button--primary h-[40px] shrink-0 whitespace-nowrap px-[18px]"
                        type="submit"
                        form="common-settings-form"
                        disabled={isLoading || isSubmitting}
                    >
                        <SaveIcon />
                        {isSubmitting ? 'Сохранение…' : 'Сохранить'}
                    </button>
                </div>
    
            </section>

            {message && (
                <div className={`alert alert--${messageType} mb-5 h-[40px] py-0`} role="status" aria-live="polite">
                    <span className="alert__icon"><CheckIcon /></span>
                    <span>{message}</span>
                </div>
            )}

            <section className="rounded-[16px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[var(--shadow-sm)]">
                <form id="common-settings-form" className="p-5 max-sm:p-4" noValidate onSubmit={(event) => { event.preventDefault(); saveData(); }}>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-[18px] max-md:grid-cols-1">
                        <h2 className="m-0 text-[16px] font-[760] text-[color:var(--color-primary)] md:col-span-2">
                            Основные настройки
                        </h2>

                        <Field className="md:col-span-2" label="Название сайта" error={formErrors.site_name}>
                            <input
                                className={`form-input ${formErrors.site_name ? '!border-red-500' : ''}`}
                                type="text"
                                name="site_name"
                                value={form.site_name}
                                onChange={updateField}
                                disabled={isLoading}
                                required
                            />
                        </Field>

                        <Field label="Язык админки" error={formErrors.admin_language_id}>
                            <select
                                className={`form-select ${formErrors.admin_language_id ? '!border-red-500' : ''}`}
                                name="admin_language_id"
                                value={form.admin_language_id}
                                onChange={updateField}
                                disabled={isLoading}
                                required
                            >
                                <option value="">Выберите язык</option>
                                {adminLanguages.map((language) => (
                                    <option key={language.id} value={language.id}>{language.name}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Язык сайта" error={formErrors.site_language_id}>
                            <select
                                className={`form-select ${formErrors.site_language_id ? '!border-red-500' : ''}`}
                                name="site_language_id"
                                value={form.site_language_id}
                                onChange={updateField}
                                disabled={isLoading}
                                required
                            >
                                <option value="">Выберите язык</option>
                                {siteLanguages.map((language) => (
                                    <option key={language.id} value={language.id}>{language.name}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                </form>
            </section>
        </>
    );
}
