/**
 * Orquestación de la app: estado + eventos + red.
 * Red centralizada en taskClient; renderizado puro en render.js.
 */

import { taskClient } from './src/api/client.js';
import { renderTaskList, updateStats } from './src/ui/render.js';

let inputBox;
let taskList;
let totalTasks;
let completedTasks;
let pendingTasks;

let tasks = [];
let currentFilter = 'all';
let uiState = 'idle';

function clearTopError() {
    const el = document.getElementById('app-error');
    if (el) el.classList.add('hidden');
}

function getHttpErrorMessage(error, fallbackMessage) {
    if (typeof error?.status === 'number') {
        if (error.status === 404) return 'Recurso no encontrado (404).';
        if (error.status === 500) return 'Error de servidor (500).';
        if (error.status === 400) return 'Datos inválidos enviados al servidor (400).';
        return `${fallbackMessage} (HTTP ${error.status}).`;
    }
    if (error instanceof TypeError) {
        return 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.';
    }
    return error?.message || fallbackMessage;
}

function renderLoadingState(message = 'Cargando tareas...') {
    if (!taskList) return;
    taskList.innerHTML = `
        <li class="loading-state">
            <div class="loading-state__spinner" aria-hidden="true"></div>
            <p>${message}</p>
        </li>
    `;
}

function renderErrorState(message, onRetry) {
    if (!taskList) return;
    taskList.innerHTML = `
        <li class="error-state">
            <p class="error-state__title">No se pudo completar la operación</p>
            <p class="error-state__message">${message}</p>
            <button type="button" id="retry-network-action" class="error-state__retry">Reintentar</button>
        </li>
    `;
    document.getElementById('retry-network-action')?.addEventListener('click', () => {
        if (typeof onRetry === 'function') onRetry();
    });
}

function setUiState(nextState) {
    uiState = nextState;
}

/**
 * Ejecuta cualquier operación de red bajo un flujo estricto:
 * loading -> success/error -> finally.
 */
async function runNetworkOperation({
    operation,
    onSuccess,
    loadingMessage,
    fallbackErrorMessage,
    onRetry,
}) {
    setUiState('loading');
    renderLoadingState(loadingMessage);
    clearTopError();

    try {
        const result = await operation();
        setUiState('success');
        if (typeof onSuccess === 'function') {
            await onSuccess(result);
        }
    } catch (error) {
        console.error(error);
        setUiState('error');
        const message = getHttpErrorMessage(error, fallbackErrorMessage);
        renderErrorState(message, onRetry);
    } finally {
        if (uiState !== 'error') {
            clearTopError();
        }
    }
}

async function refreshTasks() {
    const data = await taskClient.getAll();
    tasks = Array.isArray(data) ? data : [];
    renderView();
}

function renderView() {
    renderTaskList({
        tasks,
        currentFilter,
        listContainer: taskList,
        onToggle: (id) => void toggleTask(id),
        onDelete: (id) => void deleteTask(id),
    });
    updateStats(tasks, { totalTasks, completedTasks, pendingTasks });
    updateFilterVisuals(filterStateToActiveButtonId());
}

function updateFilterVisuals(activeId) {
    document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active-filter'));
    const target = document.getElementById(activeId);
    if (target) target.classList.add('active-filter');
}

function filterStateToActiveButtonId() {
    if (!currentFilter || currentFilter === 'all') return 'filter-all';
    if (currentFilter === 'pending') return 'filter-pending';
    if (currentFilter === 'completed') return 'filter-completed';
    return 'filter-all';
}

function filterTasks(filter) {
    currentFilter = currentFilter === filter ? '' : filter;
    renderView();
}

function loadTasks() {
    return runNetworkOperation({
        operation: () => taskClient.getAll(),
        loadingMessage: 'Cargando tareas desde el servidor...',
        fallbackErrorMessage: 'No se pudieron cargar las tareas.',
        onSuccess: (data) => {
            tasks = Array.isArray(data) ? data : [];
            renderView();
        },
        onRetry: () => void loadTasks(),
    });
}

function addTask() {
    const trimmedText = inputBox?.value.trim() || '';
    if (trimmedText.length < 3) {
        renderErrorState('La tarea debe tener al menos 3 caracteres.', () => void addTask());
        setUiState('error');
        return;
    }

    void runNetworkOperation({
        operation: () => taskClient.create(trimmedText),
        loadingMessage: 'Creando tarea...',
        fallbackErrorMessage: 'No se pudo crear la tarea.',
        onSuccess: async () => {
            inputBox.value = '';
            await refreshTasks();
        },
        onRetry: () => void addTask(),
    });
}

function deleteTask(taskId) {
    void runNetworkOperation({
        operation: () => taskClient.delete(taskId),
        loadingMessage: 'Eliminando tarea...',
        fallbackErrorMessage: 'No se pudo eliminar la tarea.',
        onSuccess: async () => {
            await refreshTasks();
        },
        onRetry: () => void deleteTask(taskId),
    });
}

function toggleTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    void runNetworkOperation({
        operation: () => taskClient.update(taskId, { completed: !task.completed }),
        loadingMessage: 'Actualizando tarea...',
        fallbackErrorMessage: 'No se pudo actualizar la tarea.',
        onSuccess: async () => {
            await refreshTasks();
        },
        onRetry: () => void toggleTask(taskId),
    });
}

function completeAllTasks() {
    const pending = tasks.filter((t) => !t.completed);
    if (pending.length === 0) return;

    void runNetworkOperation({
        operation: () => Promise.all(pending.map((t) => taskClient.update(t.id, { completed: true }))),
        loadingMessage: 'Marcando tareas como completadas...',
        fallbackErrorMessage: 'No se pudieron marcar todas las tareas.',
        onSuccess: async () => {
            await refreshTasks();
        },
        onRetry: () => void completeAllTasks(),
    });
}

function clearAll() {
    if (tasks.length === 0) return;
    if (!window.confirm('¿Estás seguro de que quieres borrar todas las tareas?')) return;

    void runNetworkOperation({
        operation: () => Promise.all(tasks.map((t) => taskClient.delete(t.id))),
        loadingMessage: 'Eliminando todas las tareas...',
        fallbackErrorMessage: 'No se pudieron eliminar todas las tareas.',
        onSuccess: async () => {
            currentFilter = 'all';
            await refreshTasks();
        },
        onRetry: () => void clearAll(),
    });
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
    taskList = document.getElementById('task-list');
    totalTasks = document.getElementById('total-tasks');
    completedTasks = document.getElementById('completed-tasks');
    pendingTasks = document.getElementById('pending-tasks');
}

function wireEvents() {
    document.getElementById('btn-add-task')?.addEventListener('click', addTask);
    inputBox?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    document.getElementById('complete-all')?.addEventListener('click', completeAllTasks);
    document.getElementById('clear-all')?.addEventListener('click', clearAll);
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
