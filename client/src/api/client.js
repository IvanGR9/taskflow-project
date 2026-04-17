const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/v1/tasks' 
    : 'https://tu-backend-en-vercel.vercel.app/api/v1/tasks';

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

function taskUrl(id) {
    return id != null ? `${API_URL}/${id}` : API_URL;
}

async function readJson(response) {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

/**
 * Punto único de red para toda la app.
 * @param {string} method
 * @param {object|undefined} body
 * @param {string|number|undefined} id
 */
async function request(method, body, id) {
    const url = taskUrl(id);
    const init = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (body !== undefined && method !== 'GET' && method !== 'DELETE') {
        init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);
    const data = await readJson(response);

    if (!response.ok) {
        const message = (data && data.error) || response.statusText || `Error HTTP ${response.status}`;
        throw new ApiError(response.status, message);
    }

    return data;
}

export const taskClient = {
    getAll() {
        return request('GET');
    },

    create(title) {
        return request('POST', { title });
    },

    update(id, patch) {
        return request('PATCH', patch, id);
    },

    async delete(id) {
        await request('DELETE', undefined, id);
        return true;
    },
};
