const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('🚀 Servidor de TaskFlow en marcha');
});

// Middleware de error global (Fase C del ejercicio)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor');
});

app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});