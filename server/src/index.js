const express = require('express');
const cors = require('cors');
const { performance } = require('node:perf_hooks');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes'); // Importamos el mapa

const app = express();

// Middlewares (Los porteros)
app.use(cors());
app.use(express.json()); // Para que entienda los JSON que enviamos

// Middleware de Auditoría (Fase C)
app.use((req, res, next) => {
    const inicio = performance.now();
    res.on('finish', () => {
        const duracion = performance.now() - inicio;
        console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`);
    });
    next();
});

// Conectamos las rutas con un nombre profesional (/api/v1/tasks)
app.use('/api/v1/tasks', taskRoutes);

// Ruta de bienvenida simple
app.get('/', (req, res) => {
    res.send('🚀 API de TaskFlow funcionando');
});

// Manejo Global de Excepciones (Fase C)
app.use((err, req, res, next) => {
    console.error(`[Error interno]: ${err.message}`);

    // Mapeo semántico de errores
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: "El recurso solicitado no existe." });
    }

    // Error genérico 500 para no filtrar detalles técnicos sensibles
    res.status(500).json({ error: "Error interno del servidor" });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ Servidor en http://localhost:${PORT}`);
    });
}

module.exports = app;