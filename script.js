// REFERENCIAS AL HTML
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");

// Intentamos leer de LocalStorage, si no hay nada, empezamos con un array vacío []
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// EVENTOS DE TECLADO
inputBox.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});

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

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = task.text;
        
        if (task.completed) {
            li.classList.add("checked");
        }

        // Al hacer clic, cambiamos el estado de completado
        li.onclick = () => toggleTask(task.id);

        // Botón de eliminar (la X)
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.onclick = (e) => {
            e.stopPropagation(); // Evita que al borrar se marque la tarea como completada
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