# Santorini Birthday

Primera experiencia de **Mediterranean Collection**. Su narrativa recorre diez
escenas editoriales desde la apertura en la caldera hasta la confirmación y el cierre.

## Personalización

`config/event-config.js` es la única fuente de datos del evento: identidad, edad,
fecha, hora, ubicación, mensajes, dress code, RSVP, imágenes, música y colores.
Los componentes y el HTML no deben editarse para crear una instancia de cliente.

## Integración

- `template-manifest.js` conecta configuración, recursos y runtime.
- `scene-registry.js` declara el recorrido y detiene el autoplay en RSVP.
- `resources-manifest.js` expone recursos propios de la colección.
- `experiences/santorini-birthday/` permite ejecutarla de forma independiente.
- El registro central la publica automáticamente en Polaris Showcase.
