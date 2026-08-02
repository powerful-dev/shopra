import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/admin/PageContainer';
import DashboardCard from '../components/admin/DashboardCard';
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
                        {message && <div className="uk-alert uk-alert-primary uk-margin-small-bottom">{message}</div>}
                    </div>

                    <form noValidate>
                        <div className="uk-grid-small" uk-grid="true">
                            <div className="uk-width-1-2@s">
                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="first_name">Имя</label>
                                    <input id="first_name" name="first_name" className={`uk-input ${formErrors.first_name ? 'uk-form-danger' : ''}`} value={form.first_name} onChange={updateField} required />
                                    {formErrors.first_name && <div className="uk-text-danger uk-text-small uk-margin-small-top">{formErrors.first_name[0]}</div>}
                                </div>
                            </div>

                            <div className="uk-width-1-2@s">
                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="last_name">Фамилия</label>
                                    <input id="last_name" name="last_name" className={`uk-input ${formErrors.last_name ? 'uk-form-danger' : ''}`} value={form.last_name} onChange={updateField} required />
                                    {formErrors.last_name && <div className="uk-text-danger uk-text-small uk-margin-small-top">{formErrors.last_name[0]}</div>}
                                </div>
                            </div>

                            <div className="uk-width-1-2@s">
                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="email">Email</label>
                                    <input id="email" name="email" type="email" className={`uk-input ${formErrors.email ? 'uk-form-danger' : ''}`} value={form.email} onChange={updateField} required />
                                    {formErrors.email && <div className="uk-text-danger uk-text-small uk-margin-small-top">{formErrors.email[0]}</div>}
                                </div>
                            </div>

                            <div className="uk-width-1-2@s">
                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="password">Пароль</label>
                                    <input id="password" name="password" type="password" className={`uk-input ${formErrors.password ? 'uk-form-danger' : ''}`} value={form.password} onChange={updateField} placeholder={isNew ? '' : 'Оставьте пустым, чтобы не менять'} />
                                    {formErrors.password && <div className="uk-text-danger uk-text-small uk-margin-small-top">{formErrors.password[0]}</div>}
                                </div>
                            </div>

                            <div className="uk-width-1-1">
                                <div className="uk-margin">
                                    <label>
                                        <input name="is_active" className="uk-checkbox" type="checkbox" checked={form.is_active} onChange={updateField} />
                                        <span className="uk-margin-small-left">Активен</span>
                                    </label>
                                </div>
                            </div>

                            <div className="uk-width-1-1 uk-flex">
                                <button className="button button-primary" type="button" onClick={() => saveData(false)} disabled={isSubmitting}>{isSubmitting ? 'Сохранение…' : isNew ? 'Создать' : 'Сохранить'}</button>
                                <button className="button button-default uk-margin-small-left" type="button" onClick={() => saveData(true)} disabled={isSubmitting}>{isSubmitting ? 'Сохранение…' : 'Применить'}</button>
                            </div>
                        </div>
                    </form>
                </div>


            </DashboardCard>
        </PageContainer>
    );
}
