// REFERENCIAS AL HTML
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");

// Intentamos leer de LocalStorage, si no hay nada, empezamos con un array vacío []
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all';

// EVENTOS DE TECLADO
inputBox.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});
// FUNCIÓN PARA FILTRAR
function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
}
// AÑADIR TAREA La tarea es un OBJETO
function addTask(){
    if(inputBox.value === ''){
        alert("Por favor, escribe una tarea");
        return;
    }

    const newTask = {
        id: Date.now(), // Usamos la fecha actual como ID único
        text: inputBox.value,
        completed: false
    };

    tasks.push(newTask); // Guardamos en nuestra "base de datos" (el array)
    inputBox.value = "";
    saveAndRender();
}

// RENDERIZADO (Esta función dibuja la lista entera cada vez que algo cambia)
function renderTasks() {
    listContainer.innerHTML = "";

    // Filtramos las tareas según el botón pulsado
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; 
    });

    // Dibujamos solo las tareas filtradas
    filteredTasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = task.text;
        
        if (task.completed) {
            li.classList.add("checked");
        }

        // Marcar o desmarcar tarea
        li.onclick = () => toggleTask(task.id);

        // Botón para eliminar
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.onclick = (e) => {
            e.stopPropagation(); 
            deleteTask(task.id);
        };

        li.appendChild(span);
        listContainer.appendChild(li);
    });
    
    updateStats();
}

// LÓGICA DE ACTUALIZACIÓN
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

// ELIMINAR TODO
function clearAll() {
    if (confirm("¿Estás seguro de que quieres borrar todas las tareas?")) {
        tasks = [];
        currentFilter = 'all'; // Añade esta línea para que vuelva a la vista general
        saveAndRender();
    }
}

// (Guardar en LocalStorage)
function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// ESTADÍSTICAS
function updateStats(){
    const completed = tasks.filter(t => t.completed).length;
    
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
}

// ARRANQUE
renderTasks();