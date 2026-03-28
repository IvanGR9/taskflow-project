const taskService = require('../services/task.service');

const getTasks = (req, res) => {
    const tasks = taskService.getAllTasks();
    res.status(200).json(tasks);
};

const createNewTask = (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({ error: "El título debe tener al menos 3 caracteres" });
    }

    const newTask = taskService.createTask({ title });
    res.status(201).json(newTask);
};

const removeTask = (req, res) => {
    try {
        const { id } = req.params;
        taskService.deleteTask(id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }
        res.status(500).json({ error: "Error interno" });
    }
};

const patchTask = (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        if (typeof completed !== 'boolean') {
            return res.status(400).json({ error: "El campo 'completed' debe ser un booleano" });
        }

        const updated = taskService.updateTask(id, { completed });
        res.status(200).json(updated);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }
        res.status(500).json({ error: "Error interno" });
    }
};

module.exports = {
    getTasks,
    createNewTask,
    removeTask,
    patchTask
};