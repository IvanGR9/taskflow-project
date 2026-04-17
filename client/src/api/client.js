const API_URL = 'http://localhost:3000/api/v1/tasks';

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function readJson(response) {
    const text = await response.text();
    if (!text) return {}; // Devolvemos objeto vacío para evitar errores de lectura
    try {
        return JSON.parse(text);
    } catch {
        return {};
    }
}

async function request(method, body, id) {
    const url = id != null ? `${API_URL}/${id}` : API_URL;
    const init = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (body !== undefined && method !== 'GET' && method !== 'DELETE') {
        init.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, init);
        const data = await readJson(response);

        if (!response.ok) {
            // Buscamos el mensaje de error en el JSON o usamos el status text
            const message = data.error || response.statusText || `Error ${response.status}`;
            throw new ApiError(response.status, message);
        }

        return data;
    } catch (error) {
        if (!(error instanceof ApiError)) {
            throw new TypeError('NETWORK_ERROR');
        }
        throw error;
    }
}

export const taskClient = {
    getAll: () => request('GET'),
    create: (title) => request('POST', { title }),
    update: (id, patch) => request('PATCH', patch, id),
    delete: (id) => request('DELETE', undefined, id)
};