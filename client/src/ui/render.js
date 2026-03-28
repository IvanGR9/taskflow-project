/**
 * Capa de presentación: solo DOM y estado visual.
 * No contiene llamadas de red ni acceso a APIs.
 */

/**
 * @param {object} params
 * @param {Array<{id:number,title:string,completed:boolean}>} params.tasks
 * @param {'all'|'pending'|'completed'|''} params.currentFilter
 * @param {HTMLElement} params.listContainer
 * @param {(id: number) => void} params.onToggle
 * @param {(id: number) => void} params.onDelete
 */
export function renderTaskList({
    tasks,
    currentFilter,
    listContainer,
    onToggle,
    onDelete,
}) {
    listContainer.innerHTML = '';

    const filteredTasks = tasks.filter((task) => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach((task) => {
        const li = createTaskElement(task, onToggle, onDelete);
        listContainer.appendChild(li);
    });
}

/**
 * @param {{id:number,title:string,completed:boolean}} task
 * @param {(id: number) => void} onToggle
 * @param {(id: number) => void} onDelete
 */
export function createTaskElement(task, onToggle, onDelete) {
    const li = document.createElement('li');
    const done = task.completed === true;

    const baseClasses = `
        relative list-none text-[17px] p-[12px_15px_12px_50px]
        cursor-pointer select-none text-[#333] dark:text-gray-200
        flex items-center justify-between transition-all duration-300
        rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50
        ${done ? 'line-through text-gray-400' : ''}
    `
        .replace(/\s+/g, ' ')
        .trim();

    li.className = baseClasses;
    if (task.completed === true) {
        li.classList.add('checked');
    }

    li.innerHTML = `
        <div class="flex items-center gap-3 flex-1">
            <span>${escapeHtml(task.title)}</span>
        </div>
    `;

    li.onclick = () => onToggle(task.id);

    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = '\u00d7';
    deleteBtn.className = `
        w-9 h-9 text-2xl text-gray-500 dark:text-gray-400
        flex items-center justify-center rounded-full
        hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors ml-2
    `
        .replace(/\s+/g, ' ')
        .trim();

    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        onDelete(task.id);
    };

    li.appendChild(deleteBtn);

    return li;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * @param {Array<{completed:boolean}>} tasks
 * @param {{ totalTasks: HTMLElement, completedTasks: HTMLElement, pendingTasks: HTMLElement }} elements
 */
export function updateStats(tasks, { totalTasks, completedTasks, pendingTasks }) {
    const completed = tasks.filter((t) => t.completed).length;
    totalTasks.textContent = String(tasks.length);
    completedTasks.textContent = String(completed);
    pendingTasks.textContent = String(tasks.length - completed);
}

