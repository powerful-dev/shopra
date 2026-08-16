import { useEffect, useState } from 'react';
import { csrf, request } from '../services/api';
import PageContainer from '../components/admin/PageContainer';

export default function CreateShopPage() {
    const [themes, setThemes] = useState([]);
    const [form, setForm] = useState({ name: '', logo: null, theme: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        request('/api/shop-themes')
            .then((response) => setThemes(response.data))
            .catch(() => setMessage('Unable to load shop themes.'));
    }, []);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const updateLogo = (event) => {
        setForm((current) => ({ ...current, logo: event.target.files[0] ?? null }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setErrors({});
        setMessage('');
        setIsSubmitting(true);

        const payload = new FormData();
        payload.append('name', form.name);
        payload.append('theme', form.theme);

        if (form.logo) {
            payload.append('logo', form.logo);
        }

        try {
            await csrf();
            const response = await request('/api/shops', { method: 'POST', body: payload });
            setMessage(`Shop “${response.data.name}” was created.`);
            setForm({ name: '', logo: null, theme: '' });
            event.target.reset();
        } catch (error) {
            setErrors(error.errors ?? {});
            setMessage(error.errors?.name?.[0] ?? error.message ?? 'Unable to create the shop.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <div className="shopra-create-shop">
                <section className="shopra-dashboard-card">
                    <h1 className="text-2xl font-bold">Create shop</h1>
                    {message && <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800"><p>{message}</p></div>}
                    <form onSubmit={submit} noValidate>
                        <div className="mt-4">
                            <label className="mb-1.5 block text-sm font-semibold" htmlFor="name">Name</label>
                            <input id="name" name="name" className={`w-full rounded-lg border bg-white px-3 py-2 outline-none ${errors.name ? 'border-red-500' : 'border-[color:var(--color-border)]'}`} value={form.name} onChange={updateField} required />
                            {errors.name && <div className="mt-1 text-xs text-red-600">{errors.name[0]}</div>}
                        </div>
                        <div className="mt-4">
                            <label className="mb-1.5 block text-sm font-semibold" htmlFor="theme">Theme</label>
                            <select id="theme" name="theme" className={`w-full rounded-lg border bg-white px-3 py-2 outline-none ${errors.theme ? 'border-red-500' : 'border-[color:var(--color-border)]'}`} value={form.theme} onChange={updateField} required>
                                <option value="">Select a theme</option>
                                {themes.map((theme) => <option key={theme.value} value={theme.value}>{theme.label}</option>)}
                            </select>
                            {errors.theme && <div className="mt-1 text-xs text-red-600">{errors.theme[0]}</div>}
                        </div>
                        <div className="mt-4">
                            <label className="mb-1.5 block text-sm font-semibold" htmlFor="logo">Logo</label>
                            <input id="logo" name="logo" className="block w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm" type="file" accept="image/png,image/jpeg,image/webp" onChange={updateLogo} />
                            {errors.logo && <div className="mt-1 text-xs text-red-600">{errors.logo[0]}</div>}
                        </div>
                        <button className="mt-4 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create shop'}</button>
                    </form>
                </section>
            </div>
        </PageContainer>
    );
}
