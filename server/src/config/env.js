require('dotenv').config();

const config = {
    // Usamos PORT en mayúsculas para que coincida con la importación de tu index.js
    PORT: process.env.PORT || 3000
};

// Validación defensiva (Requisito Fase 3)
// Si no hay .env, avisamos por consola pero permitimos que el servidor use el 3000
if (!process.env.PORT) {
    console.warn("⚠️  Aviso: El puerto no está definido en las variables de entorno (.env). Usando 3000 por defecto.");
}

module.exports = config;