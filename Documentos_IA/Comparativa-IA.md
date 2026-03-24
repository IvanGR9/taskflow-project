# 🤖 Mi comparativa: ChatGPT vs Claude

En este apartado he querido poner a prueba a las dos IAs más conocidas para ver cuál me ayuda mejor con el código de mi proyecto TaskFlow. He hecho tres pruebas: teoría, buscar fallos y escribir funciones desde cero.

---

## 📚 Prueba 1: Conceptos técnicos (DOM, Event Loop y Hoisting)
Les pedí a los dos que me explicaran estos temas como si no supiera nada de programación.

### **Claude:**
* **Qué tal lo ha hecho:** Me ha gustado mucho porque usa ejemplos muy visuales. Me explicó el DOM como si fuera un árbol y el Event Loop como un sistema de turnos para que la web no se quede colgada.
* **Lo mejor:** Se nota que intenta que entiendas el "porqué" de las cosas. Me dio el consejo de usar siempre `let` y `const` para no tener problemas con el Hoisting, lo cual me pareció un detalle muy útil.

### **ChatGPT:**
* **Qué tal lo ha hecho:** Ha sido mucho más directo. En vez de enrollarse con explicaciones largas, me puso ejemplos de código muy cortitos.
* **Lo mejor:** Si tienes prisa, ChatGPT es genial porque vas al grano. El ejemplo del `console.log` para explicar el orden de ejecución del Event Loop se entiende a la primera.

> **Mi conclusión:** Para aprender algo de cero prefiero a **Claude** porque es más pausado, pero para una duda rápida de "cómo se hacía esto", **ChatGPT** me parece más cómodo.

---

## 🐛 Prueba 2: Cazando errores (Bugs)
Les pasé tres funciones que estaban mal a propósito: una que sumaba texto, una propiedad que no existía y un bucle que no llegaba a arrancar.

### **Claude:**
* **Resultado:** Ha pillado los tres errores al momento.
* **Opinión:** Me ha sorprendido que me explicara tan bien por qué el bucle `for` no funcionaba (por la condición de `i > 10`). Me puso hasta una tablita al final resumiendo el fallo y la solución, que me ha servido para verlo todo súper claro.

### **ChatGPT:**
* **Resultado:** También ha encontrado los tres fallos sin problemas.
* **Opinión:** Me ha gustado mucho el formato que usa con los iconos de ❌ y ✅. Me explicó que `undefined` significa simplemente que esa propiedad no existe en el objeto, algo que a veces te lía.

> **Mi conclusión:** Los dos son muy buenos detectores de errores. Quizás ChatGPT me ha parecido un poco más visual para corregir rápido, pero la explicación de Claude sobre el bucle me ha parecido más completa.

---

## 💻 Prueba 3: Escribir funciones para TaskFlow
Les pedí tres cosas: una función de par/impar, otra para cambiar el color de un botón y otra para guardar el nombre en el LocalStorage.

| Tarea | ¿Qué tal lo han hecho? |
| :--- | :--- |
| **Par o Impar** | Los dos han usado el `% 2` que es lo más normal. Código muy limpio. |
| **Color del botón** | Ambos han usado `addEventListener`. Claude explicó un poco mejor cómo conectarlo con el HTML. |
| **LocalStorage** | Los dos han usado `setItem` correctamente. Es un código muy estándar y funciona perfecto. |

---

## 🏆 Conclusión final de la comparativa
Después de probar los dos asistentes, creo que para seguir con mi proyecto voy a usar más a **ChatGPT** porque me gusta lo directo que es y cómo organiza las respuestas con iconos, que me ayuda a leerlo todo más rápido. Aun así, si me atranco con algo de teoría, volveré a **Claude** porque se ciñe mas a dar una explicación con muchos detalles.