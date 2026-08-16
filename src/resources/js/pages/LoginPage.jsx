import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../services/api';
import Brand from '../components/admin/Brand/Brand';

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
        <main className="flex min-h-dvh items-center justify-center overflow-x-hidden bg-[radial-gradient(circle_at_86%_-10%,rgba(241,220,205,0.38),transparent_28rem)] px-4 py-8 font-sans sm:px-6">
            <section className="w-full max-w-[430px] rounded-[19px] border border-[color:var(--color-border)] bg-white px-6 py-8 shadow-[0_22px_70px_rgba(70,47,31,0.10)] sm:px-10 sm:py-10" aria-labelledby="login-title">
                <div className="flex justify-center">
                    <Brand />
                </div>

                <div className="mx-auto mt-8 max-w-[330px]">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[color:var(--color-accent)]">Панель управления</p>
                    <h1 id="login-title" className="text-[29px] font-bold leading-tight tracking-[-0.05em] text-[color:var(--color-primary)]">С возвращением</h1>
                    <p className="mt-2 text-[13px] leading-5 text-[color:var(--color-secondary)]">Войдите, чтобы управлять вашим магазином.</p>

                    {message && (
                        <div className="mt-5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-700" role="alert" aria-live="polite">
                            {message}
                        </div>
                    )}

                    <form className="mt-6" onSubmit={submit} noValidate>
                        <div>
                            <label className="mb-1.5 block text-[11px] font-bold text-[#504943]" htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`h-11 w-full rounded-[10px] border bg-white px-3.5 text-[13px] text-[color:var(--color-primary)] outline-none transition placeholder:text-[#a39b94] focus:border-[#ca8c69] focus:ring-3 focus:ring-[rgba(184,79,24,0.10)] ${errors.email ? 'border-red-400' : 'border-[#ddd6cf]'}`}
                                value={form.email}
                                onChange={updateField}
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                required
                            />
                            {errors.email && <p id="email-error" className="mt-1.5 text-[11px] text-red-600">{errors.email[0]}</p>}
                        </div>

                        <div className="mt-4">
                            <label className="mb-1.5 block text-[11px] font-bold text-[#504943]" htmlFor="password">Пароль</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={`h-11 w-full rounded-[10px] border bg-white px-3.5 text-[13px] text-[color:var(--color-primary)] outline-none transition placeholder:text-[#a39b94] focus:border-[#ca8c69] focus:ring-3 focus:ring-[rgba(184,79,24,0.10)] ${errors.password ? 'border-red-400' : 'border-[#ddd6cf]'}`}
                                value={form.password}
                                onChange={updateField}
                                autoComplete="current-password"
                                placeholder="Введите пароль"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                required
                            />
                            {errors.password && <p id="password-error" className="mt-1.5 text-[11px] text-red-600">{errors.password[0]}</p>}
                        </div>

                        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-[11px] text-[#5f5751]">
                            <input className="h-4 w-4 rounded border-[#cfc5bd] accent-[var(--color-accent)]" name="remember" type="checkbox" checked={form.remember} onChange={updateField} />
                            Запомнить меня
                        </label>

                        <button className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[color:var(--color-accent)] bg-[color:var(--color-accent)] px-4 text-[12px] font-bold text-white transition hover:border-[color:var(--color-accent-hover)] hover:bg-[color:var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
                            {isSubmitting ? 'Выполняем вход…' : 'Войти'}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
