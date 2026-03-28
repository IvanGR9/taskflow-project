let tasks = [
    { id: 1, title: 'Aprender la arquitectura del servidor', completed: false },
    { id: 2, title: 'Configurar Express con éxito', completed: true }
];

const getAllTasks = () => {
    return tasks;
};

const createTask = (data) => {
    const newTask = {
        id: Date.now(),
        title: data.title,
        completed: false
    };
    tasks.push(newTask);
    return newTask;
};

const deleteTask = (id) => {
    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
        throw new Error('NOT_FOUND');
    }
    tasks.splice(index, 1);
    return true;
};

const updateTask = (id, updates) => {
    const index = tasks.findIndex(t => t.id === parseInt(id, 10));
    if (index === -1) {
        throw new Error('NOT_FOUND');
    }
    if (typeof updates.completed === 'boolean') {
        tasks[index].completed = updates.completed;
    }
    return tasks[index];
};

module.exports = {
    getAllTasks,
    createTask,
    deleteTask,
    updateTask
};