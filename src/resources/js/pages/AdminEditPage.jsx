import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/admin/PageContainer';
import DashboardCard from '../components/admin/Dashboard/DashboardCard';
import { csrf, request } from '../services/api';

export default function AdminEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;

    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', is_active: true });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isNew && id) {
            (async () => {
                try {
                    const payload = await request(`/api/admins/${id}`);
                    const admin = payload.data;
                    setForm({
                        first_name: admin.first_name ?? '',
                        last_name: admin.last_name ?? '',
                        email: admin.email ?? '',
                        password: '',
                        is_active: Boolean(admin.is_active),
                    });
                } catch (err) {
                    setMessage(err.message ?? 'Unable to load administrator.');
                }
            })();
        }
    }, [id, isNew]);

    const updateField = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    };

    const saveData = async (apply = false) => {
        setFormErrors({});
        setIsSubmitting(true);
        setMessage('');

        try {
            await csrf();
            const payload = { ...form };

            if (!isNew) {
                const response = await request(`/api/admins/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const successMessage = `Администратор “${response.data.full_name || response.data.email}” сохранён.`;
                if (apply) {
                    navigate('/admin/administrators', { state: { message: successMessage } });
                    return;
                }
                setMessage(successMessage);
            } else {
                const response = await request('/api/admins', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const successMessage = `Администратор “${response.data.full_name || response.data.email}” создан.`;
                if (apply) {
                    navigate('/admin/administrators', { state: { message: successMessage } });
                    return;
                }
                setMessage(successMessage);
            }
        } catch (error) {
            setFormErrors(error.errors ?? {});
            setMessage(error.message ?? 'Unable to save the administrator.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <header className="shopra-hero">
                <div>
                    <p className="shopra-eyebrow">Shopra · Управление командой</p>
                    <h1>{isNew ? 'Создать администратора' : 'Редактировать администратора'}</h1>
                </div>
            </header>

            <DashboardCard title={isNew ? 'Новая карточка администратора' : 'Карточка администратора'} action={null}>

                <div className="shopra-card-body">

                    <div class="shopra-alert-inner">
                        {message && <div className="mb-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>}
                    </div>

                    <form noValidate>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="first_name">Имя</label>
                                    <input id="first_name" name="first_name" className={`w-full rounded-lg border bg-white px-3 py-2 outline-none ${formErrors.first_name ? 'border-red-500' : 'border-[color:var(--color-border)]'}`} value={form.first_name} onChange={updateField} required />
                                    {formErrors.first_name && <div className="mt-1 text-xs text-red-600">{formErrors.first_name[0]}</div>}
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="last_name">Фамилия</label>
                                    <input id="last_name" name="last_name" className={`w-full rounded-lg border bg-white px-3 py-2 outline-none ${formErrors.last_name ? 'border-red-500' : 'border-[color:var(--color-border)]'}`} value={form.last_name} onChange={updateField} required />
                                    {formErrors.last_name && <div className="mt-1 text-xs text-red-600">{formErrors.last_name[0]}</div>}
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">Email</label>
                                    <input id="email" name="email" type="email" className={`w-full rounded-lg border bg-white px-3 py-2 outline-none ${formErrors.email ? 'border-red-500' : 'border-[color:var(--color-border)]'}`} value={form.email} onChange={updateField} required />
                                    {formErrors.email && <div className="mt-1 text-xs text-red-600">{formErrors.email[0]}</div>}
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">Пароль</label>
                                    <input id="password" name="password" type="password" className={`w-full rounded-lg border bg-white px-3 py-2 outline-none ${formErrors.password ? 'border-red-500' : 'border-[color:var(--color-border)]'}`} value={form.password} onChange={updateField} placeholder={isNew ? '' : 'Оставьте пустым, чтобы не менять'} />
                                    {formErrors.password && <div className="mt-1 text-xs text-red-600">{formErrors.password[0]}</div>}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <div>
                                    <label>
                                        <input name="is_active" className="h-4 w-4 rounded border-gray-300 accent-[var(--color-accent)]" type="checkbox" checked={form.is_active} onChange={updateField} />
                                        <span className="ml-2">Активен</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex sm:col-span-2">
                                <button className="button button-primary" type="button" onClick={() => saveData(false)} disabled={isSubmitting}>{isSubmitting ? 'Сохранение…' : isNew ? 'Создать' : 'Сохранить'}</button>
                                <button className="button button-default ml-2" type="button" onClick={() => saveData(true)} disabled={isSubmitting}>{isSubmitting ? 'Сохранение…' : 'Применить'}</button>
                            </div>
                        </div>
                    </form>
                </div>


            </DashboardCard>
        </PageContainer>
    );
}
