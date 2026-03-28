# 🔧 Configuración de MCP (Model Context Protocol) - Punto 5

He configurado con éxito el servidor MCP de **Filesystem** en Cursor para que la IA tenga acceso total a mis archivos locales de DAM.

### 1. Proceso de instalación y resolución de errores
* **Incidencia:** Inicialmente, el comando `npx` no era reconocido por el sistema (error ENOENT).
* **Solución:** Instalé **Node.js (LTS)** en mi equipo y reinicié Cursor para actualizar las variables de entorno (PATH).
* **Configuración final:** El servidor está conectado y operativo en la ruta: `C:/Users/LuuKe/OneDrive/Escritorio/Practicas_DAM`.

### 2. Consultas de prueba
He verificado el funcionamiento del servidor realizando estas 5 consultas reales:
1. Análisis del número total de archivos en el repositorio.
2. Listado de directorios activos (docs, images, etc.).
3. Verificación de la integridad del archivo `index.html`.
4. Generación de un esquema del árbol de directorios del proyecto.
5. Comprobación de lectura del archivo de documentación `mcp-setup.md`.

### 3. Reflexión sobre la utilidad
El uso de MCP permite que la IA deje de "adivinar" y pase a "leer" el contexto real de mi disco duro. Esto es vital para proyectos con muchos archivos, ya que la IA puede navegar por todo el repositorio sin que yo tenga que abrir cada pestaña manualmente.