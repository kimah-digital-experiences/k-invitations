# Modelo de contenido de Polaris

## Datos del cliente y del evento

`src/scripts/config/event-config.js` es la única fuente oficial para personalizar una instancia de Baby Shower Space. Allí se definen el nombre del bebé, anfitriones, tipo y título del evento, fecha, horario, lugar, enlace de Google Maps, teléfono y mensajes de RSVP, textos de regalos, textos finales y metadatos del documento.

Los textos que combinan narrativa con nombres o datos del evento también se construyen en esa configuración. El HTML conserva únicamente marcadores `data-event-field`; el motor los completa al iniciar la experiencia.

## Contenido de la plantilla

Pertenecen a la plantilla Baby Shower Space la narrativa espacial no personalizada, los títulos genéricos, las instrucciones de interacción, las etiquetas de fecha, hora, lugar y anfitriones, y el orden dramático de las escenas. Este contenido permanece en `index.html` porque forma parte de la experiencia reutilizable y no cambia entre clientes.

## Configuración del motor

Pertenecen al motor Polaris el registro e identificación interna de escenas, las transiciones, los tiempos de autoplay, la pausa por presión, la navegación, los estados de respaldo y la reproducción de música. Estos elementos viven en `src/scripts/main.js`, `src/scripts/core/` y `src/scripts/scenes/` y no deben editarse para crear una nueva invitación.

Los estilos de `src/styles/` y el audio de `assets/` son recursos visuales o sonoros de la experiencia, no datos del cliente.

## Crear una nueva instancia

Para crear otra invitación basada en esta experiencia, se debe modificar únicamente `src/scripts/config/event-config.js`. Los valores derivados reutilizan las constantes principales para evitar fechas, nombres, anfitriones o lugares divergentes.

## Pendiente para POLARIS-002

Esta fase conserva deliberadamente nombres internos ligados a la implementación actual, como `BenjaminScene`, selectores CSS, IDs de escena y funciones auxiliares. POLARIS-002 deberá evaluar la neutralización de esos nombres, la separación del registro de escenas y otros límites de plantilla y motor, sin asumir cambios de arquitectura ni alterar la experiencia publicada.
