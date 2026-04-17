const express = require('express');
const cors = require('cors');
const { performance } = require('node:perf_hooks');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

// Middlewares (Los porteros)
app.use(cors());
app.use(express.json());

// Middleware de Auditoría (Fase C)
app.use((req, res, next) => {
    const inicio = performance.now();
    res.on('finish', () => {
        const duracion = performance.now() - inicio;
        console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`);
    });
    next();
});

// Conectamos las rutas
app.use('/api/v1/tasks', taskRoutes);

// Ruta de bienvenida simple
app.get('/', (req, res) => {
    res.send('🚀 API de TaskFlow funcionando');
});

// Manejo Global de Excepciones (Fase C)
app.use((err, req, res, next) => {
    console.error(`[Error interno]: ${err.message}`);

    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: "El recurso solicitado no existe." });
    }

    res.status(500).json({ error: "Error interno del servidor" });
});

// --- ARREGLO DEL PUERTO ---
// Si PORT es undefined o null, usamos el 3000 por defecto
const finalPort = PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(finalPort, () => {
        console.log(`✅ Servidor en http://localhost:${finalPort}`);
    });
}

module.exports = app;