# 📚 Mis notas sobre el Backend y las herramientas

En esta fase del proyecto he dado el salto de una web sencilla a una aplicación conectada a un servidor real. Estas son las herramientas que he aprendido a usar y por qué son importantes en el día a día de un programador:

### 1. Postman (Mi banco de pruebas)
Postman ha sido fundamental para probar el "motor" de mi aplicación (el servidor) antes de conectarlo a la "carrocería" (la web). 
* **Lo que he hecho:** He usado Postman para enviarle datos al servidor y comprobar que responde bien. Por ejemplo, si intento crear una tarea con un nombre vacío, he programado el servidor para que me devuelva un error **400**, y con Postman he verificado que ese aviso llega correctamente.

### 2. Axios vs Fetch
Para hablar con el servidor desde la web, he usado `fetch`, que ya viene en el navegador. Sin embargo, he aprendido que en las empresas se usa mucho **Axios**. 
* **La diferencia:** Axios es como un `fetch` automático; te ahorra pasos como convertir los datos a JSON a mano y gestiona mejor los errores. Para proyectos más grandes, Axios es la opción que elegiría.

### 3. Sentry (El sistema de alertas)
Sentry es como tener un vigilante 24 horas. 
* **Para qué sirve:** Si mi código falla mientras alguien está usando la web, Sentry me manda un aviso al móvil o al correo diciéndome exactamente qué ha fallado. Así no tengo que esperar a que el usuario se queje para arreglar el problema.

### 4. Swagger (El manual de instrucciones)
Swagger sirve para que otros programadores entiendan mi código sin tener que leerlo entero. 
* **Su utilidad:** Crea una página web donde se ven todas las funciones de mi servidor (añadir, borrar, editar) y te permite probarlas ahí mismo. Es como el menú de un restaurante donde ves todo lo que puedes pedir.

---
*Nota: He pasado de guardar datos en mi propio ordenador (LocalStorage) a gestionar