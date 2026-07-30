import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../services/api';

export default function LoginPage() {
    const { login, user } = useAuth();
    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const updateField = (event) => {
        const { checked, name, type, value } = event.target;
        setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setErrors({});
        setMessage('');
        setIsSubmitting(true);

        try {
            await login(form);
        } catch (error) {
            if (error instanceof ApiError) {
                setErrors(error.errors);
                setMessage(error.errors.email?.[0] ?? error.message);
            } else {
                setMessage('Unable to contact the server. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="shopra-login-page">
            <div className="shopra-login-card uk-card uk-card-default">
                <div className="shopra-login-brand"><span className="shopra-brand-mark"><span uk-icon="icon: bag; ratio: 1" /><b>S</b></span><span>Shopra</span></div>
                <section className="shopra-login-form">
                    <p className="shopra-login-kicker">Панель управления</p>
                    <h1>С возвращением</h1>
                    <p>Войдите, чтобы управлять вашим магазином.</p>
                    {message && <div className="shopra-login-alert uk-alert-danger" uk-alert="true"><p>{message}</p></div>}
                    <form onSubmit={submit} noValidate>
                        <div className="uk-margin">
                            <label className="shopra-login-label" htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" className={`uk-input shopra-login-input ${errors.email ? 'uk-form-danger' : ''}`} value={form.email} onChange={updateField} autoComplete="email" placeholder="you@example.com" required />
                            {errors.email && <div className="uk-text-danger uk-text-small uk-margin-small-top">{errors.email[0]}</div>}
                        </div>
                        <div className="uk-margin">
                            <label className="shopra-login-label" htmlFor="password">Пароль</label>
                            <input id="password" name="password" type="password" className={`uk-input shopra-login-input ${errors.password ? 'uk-form-danger' : ''}`} value={form.password} onChange={updateField} autoComplete="current-password" placeholder="Введите пароль" required />
                            {errors.password && <div className="uk-text-danger uk-text-small uk-margin-small-top">{errors.password[0]}</div>}
                        </div>
                        <div className="uk-margin">
                            <label className="shopra-remember"><input className="uk-checkbox" name="remember" type="checkbox" checked={form.remember} onChange={updateField} /> Запомнить меня</label>
                        </div>
                        <button className="uk-button shopra-login-submit uk-width-1-1" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Выполняем вход…' : 'Войти'}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
