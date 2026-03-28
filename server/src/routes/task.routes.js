const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// Definimos los caminos (endpoints)
router.get('/', taskController.getTasks);       // Ver todas
router.post('/', taskController.createNewTask); // Crear una
router.patch('/:id', taskController.patchTask); // Actualizar (p. ej. completado)
router.delete('/:id', taskController.removeTask); // Borrar una por ID

module.exports = router;