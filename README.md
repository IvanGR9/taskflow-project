# 🚀 TaskFlow: Gestión de Tareas Profesional (Full-Stack)

TaskFlow ha evolucionado. Lo que empezó como una lista de tareas sencilla en el navegador, ahora es una aplicación completa con su propio **servidor (Backend)**. El objetivo es que la gestión de tareas sea robusta, segura y escalable.

## 🏗️ Diseño y Arquitectura de la App

He dividido el proyecto en dos grandes bloques para que el código sea limpio y profesional:

### 1. El Servidor (Backend - `/server`)
Es el "cerebro" donde vive la verdad de los datos. 
- **Estructura por capas:** He separado las rutas (los caminos), los controladores (los que mandan) y los servicios (los que guardan los datos).
- **Seguridad:** El servidor comprueba que los datos sean correctos (por ejemplo, que el título tenga al menos 3 letras) antes de aceptarlos.
- **API Real:** Funciona con rutas profesionales como `/api/v1/tasks`.

### 2. La Web (Frontend - `/client`)
Es la cara de la app, rediseñada para trabajar en tiempo real con el servidor.
- **Adiós LocalStorage:** Ya no guardamos nada en el navegador. La web le pregunta todo al servidor.
- **Gestión de Red:** He añadido pantallas de "Cargando..." y avisos de error por si el servidor se cae o internet falla.
- **Modularización:** El código está repartido en piezas (módulos) para que sea fácil de mantener.

## 🛠️ Tecnologías utilizadas
- **Frontend:** HTML5, CSS3 (con diseño adaptable para móviles) y JavaScript Moderno (ES6+).
- **Backend:** Node.js y Express.
- **Pruebas:** Postman (para certificar que la API no falla).

## ✅ Lo que he aprendido en esta fase
- **Sincronización:** Cómo hacer que la web y el servidor se entiendan sin fallos.
- **Estados de carga:** Entender que la red no es instantánea y hay que avisar al usuario mientras espera.
- **Validación defensiva:** Programar el servidor para que no acepte "datos basura".
- **Limpieza de código:** Usar el principio de "separación de responsabilidades" para que cada archivo haga solo una cosa.

## 🚀 Cómo ponerlo en marcha
1. Ve a la carpeta `server` y ejecuta `npm run dev` para encender el servidor.
2. Abre el `index.html` de la carpeta `client` con una extensión tipo "Live Server".
3. ¡Ya puedes gestionar tus tareas conectadas al servidor!