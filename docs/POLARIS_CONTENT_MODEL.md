# Modelo de contenido de Polaris

## Propósito

`src/scripts/config/event-config.js` es la fuente oficial única durante la ejecución para los datos específicos de cada cliente y evento. Una nueva instancia de Baby Shower Space debe personalizarse principalmente en ese archivo, sin distribuir datos entre el HTML y los controladores de escenas.

## Datos del cliente y del evento

Las constantes principales de `event-config.js` reúnen el nombre del bebé, anfitriones, tipo de evento, fecha, horario, ubicación, enlace de Google Maps, teléfono de RSVP y nombre genérico del invitado. `eventConfig` expone esos datos con la estructura que consume la aplicación.

El título completo del evento, los mensajes afirmativo y negativo de WhatsApp y los textos de regalos se derivan de esas constantes. Así, cambiar un dato principal no deja copias divergentes dentro de la configuración.

## Contenido narrativo de la plantilla

`eventConfig.content` contiene los textos personalizados que se hidratan en los elementos declarados con `data-event-field`: nombre, anfitriones, título y coordenadas del evento, texto de la estrella, invitación, RSVP, regalos y cierre. Los textos narrativos estables que no dependen del cliente permanecen en `index.html` como parte de la plantilla aprobada.

`src/scripts/main.js` recorre el objeto `content` y aplica cada valor a todos los elementos cuyo `data-event-field` coincide con su clave. Los controladores de escenas se limitan a gestionar navegación, visibilidad, animaciones y, en RSVP, la preparación y apertura de WhatsApp.

## Metadatos del documento

`eventConfig.document` define el título del documento, su descripción y el nombre accesible de la experiencia. `applyEventConfig()` actualiza durante la ejecución `document.title`, `meta[name="description"]` y el `aria-label` de `main.experience`.

`index.html` conserva valores estáticos no vacíos para esos tres metadatos. Son respaldos deliberados para crawlers, vistas previas sociales, accesibilidad inicial y consumidores que no ejecutan JavaScript. No constituyen una segunda fuente editable: deben mantenerse sincronizados con `eventConfig.document`.

La integración continua ejecuta `.github/scripts/validate-event-metadata.mjs`, que importa `eventConfig`, extrae los tres respaldos de `index.html` y exige una coincidencia exacta. La validación falla con el valor encontrado y el esperado si falta un respaldo o existe una divergencia.

## Configuración del motor

Los tiempos de reproducción automática y transición, el volumen y ruta de la música, el orden de escenas y la integración con `SceneManager` pertenecen al motor. Estos valores permanecen fuera de `event-config.js` porque no son datos de personalización del cliente o del evento.

## Recursos visuales y sonoros

Los estilos, efectos visuales y animaciones viven en `src/styles/` y en los controladores correspondientes. La música se encuentra en `assets/audio/theme.mp3`. Crear otra instancia no requiere sustituirlos; cualquier cambio creativo o técnico en estos recursos necesita una tarea y aprobación independientes.

## Cómo crear otra instancia

1. Modificar las constantes principales de `src/scripts/config/event-config.js`.
2. Ajustar, cuando corresponda, los textos personalizados de `eventConfig.content` y los metadatos de `eventConfig.document`.
3. Sincronizar en `index.html` únicamente los respaldos estáticos de `title`, descripción y `aria-label` con `eventConfig.document`.
4. Ejecutar las validaciones del repositorio y recorrer la experiencia antes de solicitar revisión.

No se deben editar controladores de escenas para cambiar nombres, anfitriones, coordenadas, regalos o mensajes de la invitación.

## Pendientes para POLARIS-002

- Definir un proceso formal de creación y validación de nuevas instancias a partir del modelo.
- Evaluar la separación entre contenido narrativo reutilizable y variantes creativas aprobadas, sin alterar la narrativa publicada en esta tarea.
- Determinar si los recursos visuales y sonoros necesitarán un manifiesto configurable.
- Incorporar, si el equipo lo aprueba, pruebas de navegador para hidratación, accesibilidad y recorrido completo en viewport móvil.
- Revisar el tratamiento de enlaces configurables, incluido Google Maps, cuando exista una interacción aprobada que los consuma.
