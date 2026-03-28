const API_URL = 'http://localhost:3000/api/v1/tasks';

function taskUrl(id) {
    return id != null ? `${API_URL}/${id}` : API_URL;
}

/** Intenta leer JSON; si el cuerpo no es JSON (p. ej. HTML de error), devuelve null. */
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
 * Petición HTTP centralizada. `id` opcional para rutas /tasks/:id
 * @param {string} method
 * @param {object|undefined} body - Cuerpo JSON (omitir en GET/DELETE)
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

    let response;
    try {
        response = await fetch(url, init);
    } catch (error) {
        console.error('Fallo al conectar con el Backend:', error);
        throw error;
    }

    const data = await readJson(response);

    if (!response.ok) {
        const message =
            (data && data.error) ||
            response.statusText ||
            `Error ${response.status}`;
        throw new Error(message);
    }

    return data;
}

export const taskClient = {
    async getAll() {
        return request('GET');
    },

    async create(title) {
        return request('POST', { title });
    },

    async update(id, patch) {
        return request('PATCH', patch, id);
    },

    async delete(id) {
        await request('DELETE', undefined, id);
        return true;
    },
};
