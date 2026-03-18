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
function addTask(){
    const categorySelect = document.getElementById("category-select");
    if(inputBox.value.trim() === ''){
        alert("Por favor, escribe una tarea");
        return;
    }
    const newTask = {
        id: Date.now(),
        text: inputBox.value,
        completed: false,
        category: categorySelect.value
    };
    tasks.push(newTask);
    inputBox.value = "";
    saveAndRender();
}

// Dibuja la lista en el HTML aplicando el filtro actual
function renderTasks() {
    listContainer.innerHTML = "";
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; 
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `relative list-none text-[17px] p-[12px_15px_12px_50px] cursor-pointer select-none text-[#333] dark:text-gray-200 flex items-center justify-between transition-all duration-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 ${task.completed ? 'line-through text-gray-400' : ''}`;
        
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
        li.onclick = () => toggleTask(task.id);

        const span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.className = "w-9 h-9 text-2xl text-gray-500 dark:text-gray-400 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors ml-2";
        span.onclick = (e) => {
            e.stopPropagation(); 
            deleteTask(task.id);
        };
        li.appendChild(span);
        listContainer.appendChild(li);
    });
    updateStats();
    updateFilterStyles();
}

// Cambia el estado (hecho/pendiente) de una tarea
function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveAndRender();
}

// Elimina una tarea por su ID
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

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
function updateFilterStyles() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const activeClasses = ['bg-[#ff5945]', 'text-white', 'border-[#ff5945]', 'shadow-md'];
    const inactiveClasses = ['bg-white', 'text-black', 'font-bold', 'border-[#ddd]', 'hover:bg-gray-200', 'dark:bg-slate-700', 'dark:text-gray-300', 'dark:border-slate-600'];

    filterButtons.forEach(btn => {
        btn.classList.remove(...activeClasses);
        btn.classList.add(...inactiveClasses);
    });

    const ids = { all: 'filter-all', pending: 'filter-pending', completed: 'filter-completed' };
    if (currentFilter && ids[currentFilter]) {
        const activeBtn = document.getElementById(ids[currentFilter]);
        if (activeBtn) {
            activeBtn.classList.remove(...inactiveClasses);
            activeBtn.classList.add(...activeClasses);
        }
    }
}

// Persistencia en LocalStorage y actualización visual
function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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