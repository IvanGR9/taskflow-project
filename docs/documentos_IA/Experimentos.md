# Registro de Experimentos con Cursor

Aquí voy anotando las pruebas que he hecho con la IA de Cursor para ver cómo exprimirla más allá de lo básico.

---

### Experimento 1: Uso de Cursor Tab (Predicción)
**Qué probé:** Intentar escribir el código de los filtros dejando que la IA me sugiriera el siguiente paso antes de teclearlo.
**Resultado:** Muy top. Con solo poner "const" o empezar el nombre de la función, Cursor ya te marca en gris lo que cree que vas a escribir. Si le das al Tabulador, te lo hace solo. Ahorra muchísimo tiempo de picar código repetitivo.

### Experimento 2: Consultas al @Codebase (Chat)
**Qué probé:** Usé el chat de Cursor (`Ctrl + L`) con el comando `@Codebase` para preguntarle: "¿Dónde se gestiona el cambio de color de las categorías?".
**Resultado:** Me ahorró tener que buscar por todo el JS. Me mandó directo a la función `renderTasks` (antes de refactorizarla) y me explicó qué líneas tocaban el CSS. Es como tener a alguien que se conoce tu código de memoria.

### Experimento 3: Edición rápida con Ctrl + K
**Qué probé:** Cambiar varios estilos de Tailwind a la vez en el HTML seleccionando bloques grandes de código.
**Resultado:** Mucho más rápido que ir clase por clase. Le pides "ponme todos los botones redondeados y con sombra" y te cambia diez etiquetas de golpe sin fallar en ninguna clase.

### Experimento 4: Limpieza de comentarios y JSDoc
**Qué probé:** Pedirle que documentara funciones complejas para ver si entendía la lógica.
**Resultado:** El resultado es muy limpio. Te genera los bloques de comentario explicando qué hace cada parámetro y qué devuelve la función, lo que hace que el código parezca mucho más profesional.