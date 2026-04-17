require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    // Añade aquí otras variables si las tienes
};

// Validación defensiva (Requisito Fase 3)
if (!process.env.PORT) {
    console.error("❌ ERROR: El puerto no está definido en las variables de entorno (.env)");
    throw new Error('El puerto no está definido');
}

module.exports = config;