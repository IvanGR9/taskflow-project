// Referencias a elementos de la interfaz
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");

// Carga inicial de datos y estado del filtro
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all'; 

// Crea una nueva tarea y la guarda
/**
 * Añade una nueva tarea al listado, validando longitud mínima de texto,
 * limpiando espacios y capturando la categoría seleccionada.
 * Muestra mensajes de error específicos si no cumple los requisitos.
 */
function addTask() {
    const categorySelect = document.getElementById("category-select");
    const trimmedText = inputBox.value.trim();

    if (trimmedText.length < 3) {
        alert("La tarea debe tener al menos 3 caracteres.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: trimmedText,
        completed: false,
        category: categorySelect.value
    };

    tasks.push(newTask);
    inputBox.value = "";
    saveAndRender();
}

// Dibuja la lista en el HTML aplicando el filtro actual
/**
 * Renderiza las tareas actuales en la lista según el filtro activo.
 * Limpia el contenedor y añade cada tarea generada por createTaskElement().
 */
function renderTasks() {
    listContainer.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; 
    });

    filteredTasks.forEach(task => {
        const li = createTaskElement(task);
        listContainer.appendChild(li);
    });

    updateStats();
    updateFilterStyles();
}

/**
 * Crea y devuelve un elemento <li> visualizando una tarea específica.
 * @param {Object} task - La tarea a mostrar.
 * @param {number} task.id - Identificador único de la tarea.
 * @param {string} task.text - Texto de la tarea.
 * @param {boolean} task.completed - Estado de finalización.
 * @param {string} task.category - Categoría de la tarea.
 * @returns {HTMLLIElement} Elemento <li> que representa la tarea.
 */
function createTaskElement(task) {
    const li = document.createElement("li");

    const baseClasses = `
        relative list-none text-[17px] p-[12px_15px_12px_50px]
        cursor-pointer select-none text-[#333] dark:text-gray-200
        flex items-center justify-between transition-all duration-300
        rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50
        ${task.completed ? 'line-through text-gray-400' : ''}
    `.replace(/\s+/g, ' ').trim();

    li.className = baseClasses;

    const checkIcon = task.completed ? 'images/checked.png' : 'images/unchecked.png';
    li.style.backgroundImage = `url(${checkIcon})`;
    li.style.backgroundSize = '28px';
    li.style.backgroundRepeat = 'no-repeat';
    li.style.backgroundPosition = '8px center';

    li.innerHTML = `
        <div class="flex items-center gap-3 flex-1">
            <span>${task.text}</span>
            <small class="text-[10px] px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-wider">
                ${task.category}
            </small>
        </div>
    `;

    // Toggle completion al hacer click
    li.onclick = () => toggleTask(task.id);

    // Botón de eliminar tarea
    const deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "\u00d7";
    deleteBtn.className = `
        w-9 h-9 text-2xl text-gray-500 dark:text-gray-400
        flex items-center justify-center rounded-full
        hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors ml-2
    `.replace(/\s+/g, ' ').trim();

    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    };

    li.appendChild(deleteBtn);

    return li;
}

// Cambia el estado (hecho/pendiente) de una tarea
/**
 * Alterna el estado de completado de una tarea por su ID.
 * La función es inmutable y actualiza el estado de la lista de tareas.
 * @param {string|number} taskId - El ID único de la tarea a alternar.
 */
const toggleTask = (taskId) => {
    tasks = tasks.map(task =>
        task.id === taskId
            ? { ...task, completed: !task.completed }
            : task
    );
    saveAndRender();
};

/**
 * Elimina una tarea específica de la lista de tareas dado su ID.
 * Utiliza un enfoque inmutable para actualizar el array de tareas.
 * @param {string|number} taskId - El ID único de la tarea a eliminar.
 */
const deleteTask = (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    saveAndRender();
};

// Marca todas las tareas como completadas
function completeAllTasks() {
    if (tasks.length === 0) return;
    tasks = tasks.map(task => ({ ...task, completed: true }));
    saveAndRender();
}

// Borra todo el listado tras confirmar
function clearAll() {
    if (confirm("¿Estás seguro de que quieres borrar todas las tareas?")) {
        tasks = [];
        currentFilter = 'all';
        saveAndRender();
    }
}

// Gestiona qué filtro está activo (Sistema Toggle)
function filterTasks(filter) {
    if (currentFilter === filter) {
        currentFilter = ''; 
    } else {
        currentFilter = filter;
    }
    renderTasks();
}

// Aplica los colores (Rojo activo / Blanco inactivo) a los botones
/**
 * Actualiza los estilos visuales de los botones de filtro según el filtro activo.
 * Elimina la duplicidad de clases usando constantes para estilos 'active' e 'inactive'.
 * Aplica dinámicamente las clases de acuerdo al filtro seleccionado almacenado en currentFilter.
 */
function updateFilterStyles() {
    const FILTER_BUTTONS = document.querySelectorAll('.filter-btn');
    const FILTER_IDS = { all: 'filter-all', pending: 'filter-pending', completed: 'filter-completed' };
    const FILTER_CLASSES = {
        active: ['bg-[#ff5945]', 'text-white', 'border-[#ff5945]', 'shadow-md'],
        inactive: [
            'bg-white', 'text-black', 'font-bold', 'border-[#ddd]',
            'hover:bg-gray-200', 'dark:bg-slate-700', 'dark:text-gray-300', 'dark:border-slate-600'
        ]
    };

    FILTER_BUTTONS.forEach(btn => {
        btn.classList.remove(...FILTER_CLASSES.active);
        btn.classList.add(...FILTER_CLASSES.inactive);
    });

    if (currentFilter && FILTER_IDS[currentFilter]) {
        const activeBtn = document.getElementById(FILTER_IDS[currentFilter]);
        if (activeBtn) {
            activeBtn.classList.remove(...FILTER_CLASSES.inactive);
            activeBtn.classList.add(...FILTER_CLASSES.active);
        }
    }
}

// Persistencia en LocalStorage y actualización visual
/**
 * Guarda el array de tareas en localStorage y actualiza el renderizado en la interfaz.
 * Utiliza un bloque try/catch para capturar errores que pueden ocurrir,
 * como superar el límite de almacenamiento (cuota llena) o restricciones de privacidad del navegador.
 * Si ocurre un error, se muestra una alerta al usuario informando la situación.
 */
function saveAndRender() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
        alert(
            "No se pudo guardar las tareas en el almacenamiento local.\n" +
            "Esto puede deberse a un almacenamiento lleno o restricciones de privacidad del navegador."
        );
        // Opcional: también puedes registrar el error en la consola para depuración
        console.error("Error al guardar tareas en localStorage:", error);
    }
    renderTasks();
}

// Actualiza los contadores numéricos de la parte superior
function updateStats(){
    const completed = tasks.filter(t => t.completed).length;
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
}

// Cambia entre modo claro y oscuro
function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    const btn = document.getElementById("theme-toggle");
    btn.innerHTML = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
}

// Listener para añadir tareas con la tecla Enter
inputBox.addEventListener("keypress", (e) => {
    if(e.key === "Enter") addTask();
});

// Ejecución inicial
renderTasks();