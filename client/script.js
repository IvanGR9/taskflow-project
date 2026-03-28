/**
 * Orquestación de la aplicación: estado, eventos y llamadas al API.
 * El renderizado puro vive en src/ui/render.js; la red en src/api/client.js
 */

import { taskClient } from './src/api/client.js';
import { renderTaskList, updateStats } from './src/ui/render.js';

// --- Referencias DOM (se asignan tras DOMContentLoaded) ---
let inputBox;
let listContainer;
let totalTasks;
let completedTasks;
let pendingTasks;

/** Copia local de la verdad del servidor (se sincroniza con loadTasksFromServer). */
let tasks = [];
let currentFilter = 'all';

// --- UX: carga y errores ---

function toggleLoading(show) {
    const el = document.getElementById('app-loader');
    if (!el) return;
    el.classList.toggle('hidden', !show);
    el.setAttribute('aria-busy', show ? 'true' : 'false');
}

let errorHideTimeoutId = 0;

function handleError(message) {
    const el = document.getElementById('app-error');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    clearTimeout(errorHideTimeoutId);
    errorHideTimeoutId = window.setTimeout(() => {
        el.classList.add('hidden');
    }, 6000);
}

// --- Red + render (separación: solo refresh local tras éxito) ---

async function loadTasksFromServer() {
    const data = await taskClient.getAll();
    tasks = Array.isArray(data) ? data : [];
    renderView();
}

async function loadTasks() {
    try {
        toggleLoading(true);
        await loadTasksFromServer();
    } catch (error) {
        console.error(error);
        handleError(error.message || 'No se pudieron cargar las tareas.');
    } finally {
        toggleLoading(false);
    }
}

async function addTask() {
    const trimmedText = inputBox.value.trim();

    if (trimmedText.length < 3) {
        handleError('La tarea debe tener al menos 3 caracteres.');
        return;
    }

    try {
        toggleLoading(true);
        await taskClient.create(trimmedText);
        inputBox.value = '';
        await loadTasksFromServer();
    } catch (error) {
        console.error(error);
        handleError(error.message || 'No se pudo crear la tarea.');
    } finally {
        toggleLoading(false);
    }
}

async function deleteTask(taskId) {
    try {
        toggleLoading(true);
        await taskClient.delete(taskId);
        await loadTasksFromServer();
    } catch (error) {
        console.error(error);
        handleError(error.message || 'No se pudo eliminar la tarea.');
    } finally {
        toggleLoading(false);
    }
}

async function toggleTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
        toggleLoading(true);
        await taskClient.update(taskId, { completed: !task.completed });
        await loadTasksFromServer();
    } catch (error) {
        console.error(error);
        handleError(error.message || 'No se pudo actualizar la tarea.');
    } finally {
        toggleLoading(false);
    }
}

async function completeAllTasks() {
    if (tasks.length === 0) return;
    const pending = tasks.filter((t) => !t.completed);
    if (pending.length === 0) return;

    try {
        toggleLoading(true);
        await Promise.all(pending.map((t) => taskClient.update(t.id, { completed: true })));
        await loadTasksFromServer();
    } catch (error) {
        console.error(error);
        handleError(error.message || 'No se pudieron marcar todas las tareas.');
    } finally {
        toggleLoading(false);
    }
}

async function clearAll() {
    if (tasks.length === 0) return;
    if (!window.confirm('¿Estás seguro de que quieres borrar todas las tareas?')) return;

    try {
        toggleLoading(true);
        await Promise.all(tasks.map((t) => taskClient.delete(t.id)));
        currentFilter = 'all';
        await loadTasksFromServer();
    } catch (error) {
        console.error(error);
        handleError(error.message || 'No se pudieron eliminar todas las tareas.');
    } finally {
        toggleLoading(false);
    }
}

// --- Solo presentación (usa módulo render) ---

function renderView() {
    renderTaskList({
        tasks,
        currentFilter,
        listContainer,
        onToggle: (id) => {
            void toggleTask(id);
        },
        onDelete: (id) => {
            void deleteTask(id);
        },
    });

    updateStats(tasks, { totalTasks, completedTasks, pendingTasks });
    updateFilterVisuals(filterStateToActiveButtonId());
}

/**
 * Resalta el botón de filtro cuyo `id` coincide con `activeId`.
 * @param {string} activeId - Ej.: 'filter-all', 'filter-pending', 'filter-completed'
 */
function updateFilterVisuals(activeId) {
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.classList.remove('active-filter');
    });
    const target = document.getElementById(activeId);
    if (target) {
        target.classList.add('active-filter');
    }
}

/** Mapea el estado de filtro actual al id del botón que debe verse activo. */
function filterStateToActiveButtonId() {
    if (!currentFilter || currentFilter === 'all') {
        return 'filter-all';
    }
    if (currentFilter === 'pending') return 'filter-pending';
    if (currentFilter === 'completed') return 'filter-completed';
    return 'filter-all';
}

function filterTasks(filter) {
    if (currentFilter === filter) {
        currentFilter = '';
    } else {
        currentFilter = filter;
    }
    renderView();
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    }
}

function initDomRefs() {
    inputBox = document.getElementById('input-box');
    listContainer = document.getElementById('list-container');
    totalTasks = document.getElementById('total-tasks');
    completedTasks = document.getElementById('completed-tasks');
    pendingTasks = document.getElementById('pending-tasks');
}

function wireEvents() {
    document.getElementById('btn-add-task')?.addEventListener('click', () => void addTask());
    inputBox?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') void addTask();
    });

    document.getElementById('complete-all')?.addEventListener('click', () => void completeAllTasks());
    document.getElementById('clear-all')?.addEventListener('click', () => void clearAll());

    document.getElementById('filter-all')?.addEventListener('click', () => filterTasks('all'));
    document.getElementById('filter-pending')?.addEventListener('click', () => filterTasks('pending'));
    document.getElementById('filter-completed')?.addEventListener('click', () => filterTasks('completed'));

    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    initDomRefs();
    wireEvents();
    updateFilterVisuals('filter-all');
    void loadTasks();
});
