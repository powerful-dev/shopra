class ApiError extends Error {
    constructor(response, payload) {
        super(payload.message ?? 'Request failed.');
        this.status = response.status;
        this.errors = payload.errors ?? {};
    }
}

function xsrfToken() {
    const cookie = document.cookie
        .split('; ')
        .find((item) => item.startsWith('XSRF-TOKEN='));

    return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
}

export async function csrf() {
    await fetch('/sanctum/csrf-cookie', { credentials: 'same-origin' });
}

export async function request(url, options = {}) {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');

    if (options.method && options.method !== 'GET') {
        const token = xsrfToken();

        if (token) {
            headers.set('X-XSRF-TOKEN', token);
        }
    }

    const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers,
    });
    const payload = response.status === 204 ? null : await response.json();

    if (!response.ok) {
        throw new ApiError(response, payload);
    }

    return payload;
}

export { ApiError };
