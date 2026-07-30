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
                <section className="shopra-dashboard-card uk-card uk-card-default">
                    <h1 className="uk-card-title">Create shop</h1>
                    {message && <div className="uk-alert-primary" uk-alert="true"><p>{message}</p></div>}
                    <form onSubmit={submit} noValidate>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="name">Name</label>
                            <input id="name" name="name" className={`uk-input ${errors.name ? 'uk-form-danger' : ''}`} value={form.name} onChange={updateField} required />
                            {errors.name && <div className="uk-text-danger uk-text-small uk-margin-small-top">{errors.name[0]}</div>}
                        </div>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="theme">Theme</label>
                            <select id="theme" name="theme" className={`uk-select ${errors.theme ? 'uk-form-danger' : ''}`} value={form.theme} onChange={updateField} required>
                                <option value="">Select a theme</option>
                                {themes.map((theme) => <option key={theme.value} value={theme.value}>{theme.label}</option>)}
                            </select>
                            {errors.theme && <div className="uk-text-danger uk-text-small uk-margin-small-top">{errors.theme[0]}</div>}
                        </div>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="logo">Logo</label>
                            <div uk-form-custom="target: true"><input id="logo" name="logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={updateLogo} /><input className="uk-input uk-form-width-medium" type="text" placeholder="Select file" disabled /></div>
                            {errors.logo && <div className="uk-text-danger uk-text-small uk-margin-small-top">{errors.logo[0]}</div>}
                        </div>
                        <button className="uk-button uk-button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create shop'}</button>
                    </form>
                </section>
            </div>
        </PageContainer>
    );
}
