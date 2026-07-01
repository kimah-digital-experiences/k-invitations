# Proceso Oficial de Revisión — Proyecto Polaris

## 1. Objetivo de una revisión

Una revisión tiene como objetivo validar que una tarea cumple con los criterios definidos por el Proyecto Polaris antes de considerarse aprobada.

La revisión debe confirmar que el trabajo realizado:

- Cumple el objetivo del ticket.
- Respeta `AGENTS.md`.
- Mantiene la calidad esperada del proyecto.
- No introduce cambios fuera del alcance aprobado.
- Está listo para avanzar a la siguiente fase sin comprometer la experiencia, la arquitectura o la mantenibilidad.

Una revisión no debe usarse para rediseñar el ticket desde cero. Si aparecen nuevas necesidades, deben documentarse como observaciones o como un nuevo ticket.

## 2. Tipos de revisión

### Revisión de Ejecución

Valida que el ticket fue ejecutado según las instrucciones recibidas.

Debe confirmar:

- Que se modificaron únicamente los archivos permitidos.
- Que no se realizaron acciones prohibidas.
- Que no se omitieron entregables solicitados.
- Que el resultado corresponde al alcance aprobado.

### Revisión de Contenido

Valida la calidad, claridad y coherencia del contenido producido.

Debe confirmar:

- Que el contenido está escrito en español cuando corresponde.
- Que el tono es coherente con el proyecto.
- Que no existen contradicciones internas.
- Que la información es suficiente para el propósito del documento o entregable.

### Revisión Técnica

Valida la calidad técnica del trabajo cuando exista implementación.

Debe confirmar:

- Que no hay errores de consola.
- Que no se introducen dependencias sin autorización.
- Que el código es limpio, legible y mantenible.
- Que no hay duplicidad innecesaria.
- Que la solución funciona correctamente en dispositivos móviles.

### Revisión UX

Valida que la experiencia del usuario se mantenga clara, emocional y mobile first.

Debe confirmar:

- Que la interacción es intuitiva.
- Que el flujo respeta la intención emocional del proyecto.
- Que la experiencia no se siente infantil.
- Que el resultado es elegante, premium y coherente con Baby Shower Space.
- Que los elementos visuales o narrativos tienen propósito.

### Revisión de Arquitectura

Valida que el trabajo respeta la estructura y dirección técnica del proyecto.

Debe confirmar:

- Que no se cambió arquitectura sin aprobación.
- Que los archivos están ubicados en carpetas correctas.
- Que la solución es escalable y reutilizable.
- Que no se crearon abstracciones, carpetas o patrones innecesarios.
- Que no se rompieron límites definidos por el Arquitecto del Proyecto.

## 3. Roles participantes

### Product Owner

Responsable de aprobar si el resultado cumple la intención del producto, la prioridad del proyecto y las expectativas del evento.

Puede:

- Aprobar tickets.
- Solicitar cambios.
- Rechazar entregables.
- Definir prioridades.
- Autorizar operaciones de Git cuando correspondan.

### Arquitecto

Responsable de validar la coherencia estructural, técnica y estratégica del proyecto.

Puede:

- Aprobar decisiones de arquitectura.
- Solicitar ajustes estructurales.
- Definir lineamientos técnicos.
- Bloquear cambios que comprometan escalabilidad o mantenibilidad.

### Codex

Responsable de ejecutar tareas aprobadas con excelencia y documentar claramente lo realizado.

Debe:

- Respetar `AGENTS.md`.
- Mantenerse dentro del alcance del ticket.
- Preparar cambios locales.
- Explicar decisiones y riesgos.
- Esperar aprobación antes de continuar.

Codex no debe:

- Actuar como Product Owner.
- Actuar como Arquitecto.
- Publicar cambios sin autorización.
- Realizar commits, push, merges o Pull Requests automáticamente.

## 4. Estados posibles

### Pendiente

El ticket o entregable aún no ha sido revisado.

### Aprobado

El ticket cumple todos los criterios de aceptación y no requiere cambios.

### Aprobado con observaciones

El ticket puede aceptarse, pero existen recomendaciones, detalles menores o mejoras futuras que deben quedar documentadas.

### Requiere cambios

El ticket no cumple uno o más criterios de aceptación y debe corregirse antes de ser aprobado.

## 5. Plantilla oficial para futuros archivos de revisión

```markdown
# Revisión — [ID del ticket]

## Información general

- Ticket:
- Fecha:
- Revisor:
- Tipo de revisión:
- Estado:

## Alcance revisado

Describir brevemente qué archivos, documentos, pantallas o entregables fueron revisados.

## Criterios evaluados

- [ ] Cumple el objetivo del ticket.
- [ ] Respeta el alcance aprobado.
- [ ] No modifica archivos fuera del alcance.
- [ ] Respeta `AGENTS.md`.
- [ ] Mantiene coherencia visual, técnica o documental.
- [ ] No introduce riesgos no aprobados.
- [ ] Está listo para revisión o aprobación final.

## Observaciones

Registrar hallazgos, recomendaciones o detalles relevantes.

## Cambios requeridos

Listar los cambios necesarios si el estado es "Requiere cambios".

## Decisión

Indicar el estado final:

- Pendiente
- Aprobado
- Aprobado con observaciones
- Requiere cambios

## Próximo paso

Indicar qué debe ocurrir después de esta revisión.
```

## 6. Criterios para aprobar un ticket

Un ticket puede aprobarse cuando:

- Cumple todos los criterios de aceptación.
- Respeta el alcance definido.
- No modifica archivos no autorizados.
- No introduce funcionalidades, dependencias o decisiones no aprobadas.
- No rompe funcionalidades existentes.
- Mantiene coherencia con `AGENTS.md`.
- Está documentado si corresponde.
- Funciona correctamente en móviles cuando aplica.
- No genera errores de consola cuando aplica.
- Mantiene coherencia visual, UX, técnica y arquitectónica según el tipo de tarea.
- Está listo para ser revisado por el Product Owner o el Arquitecto.

## 7. Criterios para rechazar un ticket

Un ticket debe rechazarse o marcarse como "Requiere cambios" cuando:

- No cumple el objetivo principal del ticket.
- Omite entregables solicitados.
- Modifica archivos fuera del alcance aprobado.
- Introduce código, dependencias o arquitectura sin autorización.
- Rompe reglas definidas en `AGENTS.md`.
- Genera errores visibles, técnicos o de consola cuando aplica.
- Deteriora la experiencia móvil.
- Afecta funcionalidades existentes sin aprobación.
- Presenta inconsistencias importantes de contenido, diseño, UX o arquitectura.
- Publica cambios mediante commit, push, merge o Pull Request sin autorización.
