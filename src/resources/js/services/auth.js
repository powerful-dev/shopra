import { csrf, request } from './api';

export async function getCurrentUser() {
    const response = await request('/api/user');

    return response.data;
}

export async function login(credentials) {
    await csrf();

    const response = await request('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    return response.data;
}

export async function logout() {
    await csrf();
    await request('/api/logout', { method: 'POST' });
}
