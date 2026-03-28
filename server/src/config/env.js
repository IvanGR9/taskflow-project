require('dotenv').config();

// Validación manual estricta
if (!process.env.PORT) {
    // Si no hay puerto, lanzamos un error y cerramos el proceso (exit 1)
    console.error('❌ ERROR: La variable PORT no está definida en el archivo .env');
    process.exit(1); 
}

module.exports = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV || 'development'
};