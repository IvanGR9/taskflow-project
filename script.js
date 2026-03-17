const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all';

// Gestión de añadir tareas
function addTask(){
    const categorySelect = document.getElementById("category-select");
    
    if(inputBox.value === ''){
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

// Renderizado de la lista
function renderTasks() {
    listContainer.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; 
    });

    filteredTasks.forEach(task => {
        let li = document.createElement("li");
        if (task.completed) li.classList.add("checked");
        
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                <small class="category-badge">${task.category || 'General'}</small>
            </div>
        `;
        
        li.onclick = () => toggleTask(task.id);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.classList.add("delete-btn");
        span.onclick = (e) => {
            e.stopPropagation(); 
            deleteTask(task.id);
        };

        li.appendChild(span);
        listContainer.appendChild(li);
    });
    
    updateStats();
}

// Funciones de estado
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function completeAllTasks() {
    if (tasks.length === 0) return;
    tasks = tasks.map(task => ({ ...task, completed: true }));
    saveAndRender();
}

function clearAll() {
    if (confirm("¿Estás seguro de que quieres borrar todas las tareas?")) {
        tasks = [];
        currentFilter = 'all';
        saveAndRender();
    }
}

// Filtros y persistencia
function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Estadísticas e Interfaz
function updateStats(){
    const completed = tasks.filter(t => t.completed).length;
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const btn = document.getElementById("theme-toggle");
    btn.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

// Listeners
inputBox.addEventListener("keypress", (e) => {
    if(e.key === "Enter") addTask();
});

renderTasks();