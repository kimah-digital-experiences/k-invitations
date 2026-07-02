# Estimación de Ingeniería — Baby Shower Space v1.0

## Contexto actual

El proyecto Baby Shower Space ya cuenta con una base sólida para evolucionar hacia v1.0:

- Documentación principal creada.
- `AGENTS.md` aprobado como regla operativa.
- Creative Brief definido.
- UX Storyboard definido.
- Experience Blueprint definido.
- Proceso de revisión documentado.
- `SceneManager` implementado con estados, bloqueo de transición y ciclo de vida.
- Escena 1 implementada.
- Escena 2 implementada.
- Publicación Alpha v0.1 preparada para GitHub Pages.

Esta estimación contempla el trabajo restante para completar una versión 1.0 usable, emocional, responsive, revisable y publicable.

## Supuestos de estimación

- La versión 1.0 incluirá el flujo completo definido en `UX_STORYBOARD.md` y `EXPERIENCE_BLUEPRINT.md`.
- La experiencia final tendrá 9 escenas principales.
- El proyecto se mantendrá como experiencia web estática sin framework, salvo aprobación posterior.
- La confirmación de asistencia podrá resolverse inicialmente con un flujo simple aprobado por el Product Owner.
- Los datos finales del evento, textos definitivos y decisiones de sonido serán provistos o aprobados antes de implementación final.
- Las estimaciones incluyen implementación, revisión local, ajustes menores y documentación mínima por ticket.
- No incluyen rediseños completos posteriores a aprobación ni cambios mayores de arquitectura.

---

# Sprint 4 — Continuidad narrativa y escenas intermedias

## BS-EWI-010 — Escena 3: Señal desde el universo

- **Descripción:** Implementar la escena que introduce a Daniel y Ana Josse como anfitriones mediante una constelación narrativa elegante.
- **Dependencias:** Escena 1, Escena 2, `SceneManager`, textos aprobados para anfitriones.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 5 horas
- **Reutilización estimada:** 65%
- **Estado:** Pendiente

## BS-EWI-011 — Patrón reutilizable de escena narrativa

- **Descripción:** Extraer patrones repetibles para escenas de texto, entrada, salida, fondo espacial y control de avance sin alterar escenas existentes.
- **Dependencias:** Escenas 1, 2 y 3 implementadas.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 4 horas
- **Reutilización estimada:** 80%
- **Estado:** Pendiente

## BS-EWI-012 — Escena 4: La estrella de Benjamín

- **Descripción:** Implementar el momento emocional central donde Benjamín se presenta como nueva estrella, reforzando ternura y contemplación.
- **Dependencias:** Escena 3, patrón reutilizable de escena narrativa.
- **Complejidad:** Alta
- **Riesgo:** Alto
- **Tiempo estimado:** 7 horas
- **Reutilización estimada:** 60%
- **Estado:** Pendiente

## BS-EWI-013 — Revisión UX del primer bloque narrativo

- **Descripción:** Revisar continuidad emocional, timing, mobile first, legibilidad y coherencia entre Escenas 1 a 4.
- **Dependencias:** Escenas 1 a 4 implementadas.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 3 horas
- **Reutilización estimada:** 40%
- **Estado:** Pendiente

---

# Sprint 5 — Celebración e información del evento

## BS-EWI-014 — Escena 5: Celebración en órbita

- **Descripción:** Implementar la escena que transforma la revelación de Benjamín en una celebración elegante y cálida.
- **Dependencias:** Escena 4 aprobada.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 5 horas
- **Reutilización estimada:** 70%
- **Estado:** Pendiente

## BS-EWI-015 — Modelo de contenido del evento

- **Descripción:** Definir una estructura local reutilizable para datos del evento: fecha, hora, lugar, anfitriones, mensajes y textos principales.
- **Dependencias:** Datos finales del evento aprobados.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 4 horas
- **Reutilización estimada:** 85%
- **Estado:** Pendiente

## BS-EWI-016 — Escena 6: Coordenadas del encuentro

- **Descripción:** Implementar la escena de información práctica del Baby Shower con fecha, hora, lugar y anfitriones de forma clara y mobile first.
- **Dependencias:** Modelo de contenido del evento, datos finales aprobados.
- **Complejidad:** Media
- **Riesgo:** Alto
- **Tiempo estimado:** 6 horas
- **Reutilización estimada:** 70%
- **Estado:** Pendiente

## BS-EWI-017 — Acciones informativas aprobadas

- **Descripción:** Implementar acciones simples aprobadas para consultar ubicación o detalles, sin integrar mapas complejos salvo aprobación expresa.
- **Dependencias:** Escena 6, decisión del Product Owner sobre ubicación.
- **Complejidad:** Baja
- **Riesgo:** Medio
- **Tiempo estimado:** 3 horas
- **Reutilización estimada:** 60%
- **Estado:** Pendiente

---

# Sprint 6 — Invitación personal y confirmación

## BS-EWI-018 — Escena 7: Invitación personal

- **Descripción:** Implementar la escena emocional donde Daniel y Ana Josse invitan al usuario a acompañar a Benjamín.
- **Dependencias:** Escena 6 aprobada, texto emocional final aprobado.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 5 horas
- **Reutilización estimada:** 75%
- **Estado:** Pendiente

## BS-EWI-019 — Definición funcional del RSVP

- **Descripción:** Definir alcance exacto de confirmación: opciones, campos, validaciones, mensajes de estado y destino de la respuesta.
- **Dependencias:** Decisión del Product Owner sobre flujo RSVP.
- **Complejidad:** Media
- **Riesgo:** Alto
- **Tiempo estimado:** 3 horas
- **Reutilización estimada:** 50%
- **Estado:** Pendiente

## BS-EWI-020 — Escena 8: Confirmar presencia

- **Descripción:** Implementar el módulo de confirmación de asistencia con interacción clara, accesible y coherente con la narrativa.
- **Dependencias:** Definición funcional del RSVP.
- **Complejidad:** Alta
- **Riesgo:** Alto
- **Tiempo estimado:** 8 horas
- **Reutilización estimada:** 75%
- **Estado:** Pendiente

## BS-EWI-021 — Manejo de estado y validación RSVP

- **Descripción:** Implementar validaciones, mensajes de error, estados de envío y confirmación local o conectada según alcance aprobado.
- **Dependencias:** Escena 8, decisión técnica sobre almacenamiento o envío.
- **Complejidad:** Alta
- **Riesgo:** Alto
- **Tiempo estimado:** 6 horas
- **Reutilización estimada:** 70%
- **Estado:** Pendiente

---

# Sprint 7 — Cierre emocional y experiencia completa

## BS-EWI-022 — Escena 9: Gracias por acompañar a Benjamín

- **Descripción:** Implementar cierre emocional con gratitud, estado final de confirmación y acceso resumido a datos importantes.
- **Dependencias:** Escena 8, estado de RSVP definido.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 5 horas
- **Reutilización estimada:** 70%
- **Estado:** Pendiente

## BS-EWI-023 — Navegación completa y reversibilidad controlada

- **Descripción:** Ajustar navegación entre escenas, opciones de volver a detalles importantes y manejo de estados sin romper el recorrido cinematográfico.
- **Dependencias:** Escenas 1 a 9 implementadas.
- **Complejidad:** Alta
- **Riesgo:** Alto
- **Tiempo estimado:** 6 horas
- **Reutilización estimada:** 80%
- **Estado:** Pendiente

## BS-EWI-024 — Sistema de progreso narrativo

- **Descripción:** Definir e implementar una señal mínima de progreso o continuidad para que el usuario entienda que avanza por una experiencia.
- **Dependencias:** Navegación completa.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 4 horas
- **Reutilización estimada:** 75%
- **Estado:** Pendiente

## BS-EWI-025 — Pulido de microinteracciones

- **Descripción:** Refinar hover, touch, foco, respuestas visuales y transiciones menores sin agregar efectos decorativos innecesarios.
- **Dependencias:** Flujo completo implementado.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 5 horas
- **Reutilización estimada:** 65%
- **Estado:** Pendiente

---

# Sprint 8 — Sonido, accesibilidad y rendimiento

## BS-EWI-026 — Decisión e integración de sonido opcional

- **Descripción:** Definir e implementar comportamiento de sonido opcional, silencioso por defecto o activable, respetando uso desde WhatsApp y móviles.
- **Dependencias:** Decisión del Product Owner, recurso sonoro aprobado.
- **Complejidad:** Media
- **Riesgo:** Alto
- **Tiempo estimado:** 5 horas
- **Reutilización estimada:** 55%
- **Estado:** Pendiente

## BS-EWI-027 — Accesibilidad y reducción de movimiento

- **Descripción:** Revisar contraste, foco, `aria-live`, navegación por teclado, tamaños táctiles y experiencia con `prefers-reduced-motion`.
- **Dependencias:** Flujo completo implementado.
- **Complejidad:** Media
- **Riesgo:** Alto
- **Tiempo estimado:** 6 horas
- **Reutilización estimada:** 70%
- **Estado:** Pendiente

## BS-EWI-028 — Optimización de performance móvil

- **Descripción:** Revisar animaciones, repaints, tamaño de CSS/JS, carga inicial, FPS percibido y estabilidad en dispositivos móviles.
- **Dependencias:** Flujo completo implementado.
- **Complejidad:** Alta
- **Riesgo:** Alto
- **Tiempo estimado:** 7 horas
- **Reutilización estimada:** 65%
- **Estado:** Pendiente

## BS-EWI-029 — Compatibilidad cross-browser móvil

- **Descripción:** Validar y ajustar comportamiento en Chrome Android, Safari iOS y navegadores embebidos de WhatsApp.
- **Dependencias:** Performance móvil optimizada.
- **Complejidad:** Alta
- **Riesgo:** Alto
- **Tiempo estimado:** 6 horas
- **Reutilización estimada:** 50%
- **Estado:** Pendiente

---

# Sprint 9 — Calidad, revisión y release v1.0

## BS-EWI-030 — QA funcional completo

- **Descripción:** Ejecutar revisión completa de flujo, navegación, estados, validaciones, errores de consola y comportamiento responsive.
- **Dependencias:** Flujo completo y optimizaciones terminadas.
- **Complejidad:** Media
- **Riesgo:** Alto
- **Tiempo estimado:** 6 horas
- **Reutilización estimada:** 45%
- **Estado:** Pendiente

## BS-EWI-031 — Revisión de contenido final

- **Descripción:** Validar textos finales, ortografía, tono, datos del evento y coherencia emocional con Product Owner y Arquitecto.
- **Dependencias:** Textos finales cargados en experiencia.
- **Complejidad:** Baja
- **Riesgo:** Medio
- **Tiempo estimado:** 3 horas
- **Reutilización estimada:** 30%
- **Estado:** Pendiente

## BS-EWI-032 — Documentación de release v1.0

- **Descripción:** Actualizar documentación de versión, alcance, ejecución local, publicación y notas de release sin alterar arquitectura.
- **Dependencias:** QA funcional aprobado.
- **Complejidad:** Baja
- **Riesgo:** Bajo
- **Tiempo estimado:** 3 horas
- **Reutilización estimada:** 60%
- **Estado:** Pendiente

## BS-EWI-033 — Preparación final GitHub Pages

- **Descripción:** Verificar rutas, archivos necesarios, publicación estática, cache, metadatos básicos y pasos manuales para release.
- **Dependencias:** Documentación de release, QA aprobado.
- **Complejidad:** Baja
- **Riesgo:** Medio
- **Tiempo estimado:** 3 horas
- **Reutilización estimada:** 65%
- **Estado:** Pendiente

## BS-EWI-034 — Revisión formal v1.0

- **Descripción:** Ejecutar revisión final según `REVIEW_PROCESS.md` y documentar estado de aprobación, observaciones o cambios requeridos.
- **Dependencias:** Todos los tickets de v1.0 completados.
- **Complejidad:** Media
- **Riesgo:** Medio
- **Tiempo estimado:** 4 horas
- **Reutilización estimada:** 50%
- **Estado:** Pendiente

---

# Estimación total

## Tiempo total estimado para completar v1.0

| Sprint | Horas estimadas |
| --- | ---: |
| Sprint 4 — Continuidad narrativa y escenas intermedias | 19 |
| Sprint 5 — Celebración e información del evento | 18 |
| Sprint 6 — Invitación personal y confirmación | 22 |
| Sprint 7 — Cierre emocional y experiencia completa | 20 |
| Sprint 8 — Sonido, accesibilidad y rendimiento | 24 |
| Sprint 9 — Calidad, revisión y release v1.0 | 19 |
| **Total estimado** | **122 horas** |

Rango recomendado de planificación: **110 a 145 horas**, considerando iteraciones de diseño, revisión móvil y posibles ajustes de RSVP.

## Ruta crítica del proyecto

1. Aprobación de textos y datos definitivos del evento.
2. Implementación de Escenas 3 a 6.
3. Definición funcional del RSVP.
4. Implementación de Escena 8 y validación RSVP.
5. Implementación de Escena 9.
6. Navegación completa y reversibilidad controlada.
7. Optimización móvil.
8. QA funcional completo.
9. Revisión formal v1.0.
10. Preparación final de publicación.

## Riesgos principales

- **Datos del evento no definidos:** fecha, hora, lugar y textos finales pueden bloquear Escena 6 y revisión final.
- **RSVP no definido:** el destino de confirmación puede cambiar complejidad, seguridad y validación.
- **Performance móvil:** animaciones espaciales pueden degradarse en navegadores embebidos de WhatsApp si no se optimizan.
- **Alcance visual creciente:** nuevas ideas visuales pueden aumentar tiempos si se tratan como cambios dentro de tickets existentes.
- **Sonido:** la política de autoplay móvil y el contexto de WhatsApp pueden limitar la experiencia sonora.
- **Accesibilidad y reducción de movimiento:** deben considerarse antes del cierre para evitar retrabajo.
- **Diferencias entre storyboard y v1.0 real:** la Escena 2 implementada actualmente ya revela Benjamín, mientras el storyboard original distribuía esa revelación más adelante; cualquier ajuste narrativo futuro debe aprobarse explícitamente.

## Recomendaciones para acelerar el desarrollo

- Aprobar cuanto antes datos del evento y textos finales.
- Definir RSVP antes de implementar Escena 8.
- Mantener el proyecto sin frameworks hasta v1.0 para evitar costo de migración.
- Crear patrones reutilizables después de Escena 3, no antes, para evitar abstracción prematura.
- Revisar en móvil real al final de cada sprint, no solo al final del proyecto.
- Congelar alcance visual por sprint para evitar cambios cruzados.
- Priorizar performance y accesibilidad desde la implementación de cada escena.
- Usar revisiones formales ligeras por bloque de escenas para reducir retrabajo.

## Oportunidades de reutilización para futuros proyectos de Polaris Engine

- `SceneManager` con ciclo de vida, bloqueo de transición y navegación reversible.
- Patrón de escena narrativa con entrada, salida y estado activo.
- Fondos espaciales generados por CSS reutilizables como tema.
- Sistema de contenido por evento para anfitriones, protagonista, fecha, hora y lugar.
- Módulo RSVP reutilizable para invitaciones futuras.
- Patrones de accesibilidad para experiencias cinematográficas móviles.
- Plantilla de documentación: Creative Brief, UX Storyboard, Experience Blueprint y Review Process.
- Pipeline de publicación estática en GitHub Pages.
- Checklist de QA mobile first para experiencias compartidas por WhatsApp.
