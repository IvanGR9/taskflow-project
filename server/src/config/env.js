require('dotenv').config();

const config = {
    PORT: process.env.PORT || 3000
};

// Validación manual que pide el ejercicio
if (!process.env.PORT) {
    throw new Error('El puerto no está definido en el archivo .env');
}

module.exports = config;