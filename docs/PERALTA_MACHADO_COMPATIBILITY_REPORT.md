# Compatibility spike: Peralta–Machado → Polaris

**Fecha del análisis:** 30 de julio de 2026<br>
**Repositorio de trabajo:** `k-invitations`<br>
**Baseline Polaris verificado:** `c7f92fb7b6eaaab98fef2eff32bf83803d20c5d7` (`work`, merge del PR #15)<br>
**Baseline BODA-PERALTA-MACHADO:** **no verificable; no se obtuvo ningún objeto Git del repositorio original**<br>
**Estado:** **compatibilidad parcial; migración no lista para comenzar**

## 1. Resumen ejecutivo

PR-0 queda completado con evidencia directa de ambos repositorios. El baseline original es `danielperaltaHN/BODA-PERALTA-MACHADO@e4e6afcd0698e279a2a7fcead11fb6b19ddbe4c9`; el baseline Polaris usado para cerrar el spike es `kimah-digital-experiences/k-invitations@17b0a53d54517643d8b2db5849b43be3fa0fb719`.

La invitación original es una SPA estática sin build ni dependencias declaradas: `index.html` concentra 3.972 líneas, seis bloques `<style>` y cinco bloques `<script>`. Su recorrido real incluye portada personalizada, apertura animada, música, hero y countdown, bendición/fecha, ceremonia y recepción, galería, itinerario, protocolo/regalos, RSVP por formulario y WhatsApp, y cierre.

Polaris puede alojar esta experiencia sin replatforming y sin alterar plantillas existentes. La arquitectura propuesta por el plan original es compatible en intención, pero las rutas y contratos deben ajustarse al patrón real de `experiences/<slug>/` y `src/scripts/templates/<slug>/`. Las capacidades específicas —apertura, guest context, countdown, galería, regalos, RSVP y controles de audio— deben permanecer locales a la plantilla hasta demostrar reutilización transversal.

### Hallazgos principales

1. **Viabilidad confirmada.** La experiencia cabe en Polaris como plantilla y ruta independientes.
2. **Paridad, no rediseño.** El DOM, CSS, recursos, narrativa y tiempos originales son el contrato visual inicial.
3. **Adaptación obligatoria.** El plan aspiracional usa nombres y contratos que no existen literalmente en Polaris; se mapearán a los contratos JavaScript reales.
4. **Integraciones aisladas.** RSVP, WhatsApp, Maps, regalos y personalización por URL requieren adaptadores locales y validación de privacidad.
5. **Veredicto: GO para PR-1.** Ya no existe un bloqueo de acceso. PR-1 puede fijar el contrato y validador sin publicar UI ni copiar assets.

## 2. Alcance, método y nivel de certeza

### 2.1 Baselines verificados

| Fuente | Baseline | Evidencia revisada |
| --- | --- | --- |
| Invitación original | `e4e6afcd0698e279a2a7fcead11fb6b19ddbe4c9` | `index.html`, plan de migración, recursos locales y referencias externas |
| Polaris | `17b0a53d54517643d8b2db5849b43be3fa0fb719` | motor, bootstrap, controladores, plantillas, rutas, estilos, validadores y experiencia `wedding` |

La lectura se hizo en referencias inmutables. No se modificó `BODA-PERALTA-MACHADO` ni se copiaron código o assets al repositorio principal.

### 2.2 Evidencia cuantitativa del original

- `index.html`: 137.117 caracteres y 3.972 líneas.
- Seis bloques CSS y cinco bloques JavaScript.
- Secciones: `inicio`, `fecha`, `lugares`, `galeria`, `itinerario`, `rsvp` y `confirmacion`.
- Recursos locales: `CANCION.mp3` y cinco fotografías bajo `assets/fotos/`.
- Integraciones observadas: Google Fonts, Maps, WhatsApp y Google Apps Script para RSVP.
- No existe `package.json`, bundler, lockfile, framework, suite de pruebas ni CI en el original.

### 2.3 Convenciones de certeza

- **[HECHO]** comprobado directamente en alguno de los baselines.
- **[INFERENCIA]** conclusión técnica derivada de hechos y explicitada como tal.
- **[DECISIÓN]** condición de producto, privacidad o licencia que debe resolverse antes de publicar la capacidad afectada.

## 3. Arquitectura real de Polaris

### 3.1 Topología ejecutable

**[HECHO]** El proyecto es un sitio estático sin dependencias npm de ejecución ni framework. Usa módulos ES nativos; `package.json` solo declara validaciones y la CLI. Cada experiencia tiene su propio `index.html` y `main.js` bajo `experiences/<slug>/`.

```text
experiences/<slug>/
  index.html                 # shell y DOM narrativo
  main.js                    # bootstrap de la plantilla
src/scripts/templates/<slug>/
  config/event-config.js     # instancia/contenido público
  resources-manifest.js      # audio, branding e imágenes
  scene-registry.js          # grafo lineal
  template-manifest.js       # composición y políticas runtime
  scenes/*.js                # adaptadores DOM por escena
src/scripts/polaris/         # runtime reutilizable
src/scripts/core/            # SceneManager
src/styles/<slug>.css        # identidad visual aislada
assets/                      # recursos versionados
```

**[HECHO]** El registro central `src/scripts/templates/index.js` alimenta el Showcase y actualmente contiene seis experiencias. La CI exige IDs únicos, destinos de escenas válidos y una ruta HTML existente por entrada.

### 3.2 Contratos reales (no aspiracionales)

| Contrato | Forma comprobada | Obligatorio en runtime | Validación actual | Limitación |
| --- | --- | --- | --- | --- |
| Plantilla | `{ eventConfig, resources, runtime, sceneRegistry }` | Sí, salvo que `resources` no es leído directamente por el motor | Parcial en `validate-polaris-platform.mjs` | Sin esquema/versionado |
| Runtime | `initialSceneId`, `journeySceneId`, `transitionMs`, `autoplay`, `audio` | Sí | IDs principales y stop ID | No valida números/rangos ni audio |
| Autoplay | `{ delayMs, retryDelayMs, stopSceneId }` | Sí | Solo existencia del stop ID | Un solo ritmo y parada |
| Audio | `{ src, volume }` | Sí para controlador actual | No genérica | Solo `start`, loop forzado, sin mute/pause |
| Registro | arreglo ordenado `{ id, create, nextSceneId }` | Sí | Unicidad, factory y destinos | Grafo esencialmente lineal |
| Escena | factory → `{ id, init?, enter?/show?, exit?/hide?, hooks? }` | `id` y hooks útiles | Factory, no el resultado | Sin `destroy`, contrato informal |
| Configuración | `{ content, document }` | Sí en bootstrap | Metadatos solo para Space | `Object.entries(content)` exige objeto |
| Documento | `{ title, description, ariaLabel }` | Sí | Sin validador común | Respaldos HTML manuales |
| Recursos | forma libre por plantilla; audio bajo `audio.backgroundMusic` | Audio sí | Referencias generales de CI | Sin licencia, peso, dimensiones o fallback |
| DOM | `[data-scene]`, `[data-event-field]`, `.experience`, estado opcional | Sí para comportamiento completo | Solo indirecta/específica | Contrato implícito en selectores |

### 3.3 Capacidades reutilizables comprobadas

- `SceneManager`: registro, estado, bloqueo de concurrencia, navegación directa/siguiente/anterior y hooks `before/after`.
- Bootstrap: metadatos, hidratación por `data-event-field`, creación del motor, apertura inicial y fallback de inicio.
- Transiciones: salida/entrada por clases CSS y tiempo global.
- Autoplay: inicio, pausa por presión, reanudación conservando tiempo y parada en escena.
- Audio: carga diferida tras gesto, loop, volumen y degradación silenciosa básica.
- Startup: espera idempotente de `DOMContentLoaded` por llamada.
- Showcase: catálogo declarativo con ruta e imagen.
- CLI: scaffold mínimo sin sobrescritura.
- CI: sintaxis, UTF-8, rutas relativas/recursos, posibles secretos, contratos básicos y smoke HTTP bajo subdirectorio de Pages.

### 3.4 Límites verificados del motor

- El bootstrap publica `window.PolarisEngine` y `window.startPolarisJourney`; son compatibilidad global, no una API formal.
- La selección `querySelector` usada en las escenas genéricas toma la primera acción coincidente; patrones con un selector repetido requieren cuidado.
- Los listeners no se eliminan y no existe `destroy`; rebootstrap puede duplicarlos.
- El autoplay no admite duración por escena, opt-out intermedio, pausa por visibilidad ni coordinación con `prefers-reduced-motion`.
- El audio no ofrece `pause`, `resume`, `stop`, mute, UI, persistencia ni múltiples pistas.
- No hay componente Polaris de RSVP, mapas, calendario, galería real, regalos, dress code, personalización por query string, modal o contador. Algunas plantillas implementan variantes propias, no contratos transversales.
- No hay gestión de foco al cambiar escena ni test E2E/a11y visual genérico.
- Las transiciones esperan siempre `transitionMs`, incluso cuando CSS reduce movimiento.
- CI no renderiza en navegador y el script `build` solo ejecuta la validación de Christmas Dinner; el workflow completo llama scripts por separado.

## 4. Invitación original y plan de migración

### 4.1 Inventario funcional verificado

| Área | Evidencia original | Destino recomendado |
| --- | --- | --- |
| Apertura | Overlay `#gate`, sobre/sello, invitado y cupos por query string | Primera escena u overlay local |
| Hero | `#inicio`, foto hexagonal, CTA, countdown y control musical | Escena hero local |
| Bendición y fecha | `#fecha`, padres, fecha, ciudad y cita | Escena de contenido |
| Lugares | `#lugares`, ceremonia/recepción y enlace Maps | Escena venues + enlace externo |
| Galería | `#galeria`, cuatro imágenes locales lazy | Escena gallery sin lightbox inventado |
| Itinerario | `#itinerario`, ocho hitos | Escena timeline local |
| Guía y regalos | `#rsvp`, dress code, política, modal y cuentas | Escena guidance + overlay accesible |
| Confirmación | `#confirmacion`, Sí/No, nombre, Apps Script y WhatsApp | Escena RSVP/closing con adaptador |
| Audio | `CANCION.mp3`, apertura por gesto y listeners duplicados | Servicio Polaris ampliado o wrapper local |
| Responsive | Breakpoints acumulados, safe areas y composición móvil | CSS namespaced validado contra baseline |

### 4.2 Assets, fuentes y dependencias

| Recurso | Estado | Tratamiento |
| --- | --- | --- |
| `CANCION.mp3` | Local; 7.348.393 bytes | No copiar hasta confirmar licencia y presupuesto |
| `FOTO-1/3/4/5.jpg` | Local; galería | Optimizar/versionar en PR-3 tras autorización |
| `FOTO-14.jpg` | Local; hero | Optimizar/versionar en PR-3 tras autorización |
| Playfair Display / Montserrat | Google Fonts remotas | Definir fallback o versionado con licencia |
| SVG decorativos | Inline en HTML | Extraer solo cuando mejore mantenibilidad |
| Apps Script RSVP | Endpoint cliente con `no-cors` | No declarar éxito sin respuesta verificable |
| Maps / WhatsApp | Enlaces externos | Configurar, codificar y anunciar salida externa |

### 4.3 Accesibilidad y metadatos

El original aporta semántica parcial de diálogo y teclado, pero conserva duplicación de `tabindex`/listeners, gestión de foco incompleta y ausencia de una política integral de reduced motion. PR-2 y PR-7 deben preservar la narrativa y corregir foco, roles, anuncios y movimiento reducido de forma verificable. Los metadatos estáticos y social preview deben definirse antes de Showcase.

## 5. Comparación del plan con la arquitectura real

| Propuesta del plan original | Evidencia Polaris | Clasificación | Resolución definitiva |
| --- | --- | --- | --- |
| Colección `peralta-machado` configurada por datos | Polaris separa experiencia y plantilla | Compatible con adaptación | Usar `experiences/peralta-machado/` y `src/scripts/templates/peralta-machado/` |
| `event-config.js` | Existe patrón `eventConfig`, no esquema formal | Requiere adaptación | Adoptar claves reales y validador específico |
| `resources-manifest.js` | Manifiestos JS y rutas relativas soportados | Compatible | Catalogar rutas exactas, tipo, peso y licencia |
| `scene-registry.js` con ocho escenas | Registro lineal soportado | Compatible | Mantener orden narrativo; overlays fuera del flujo cuando corresponda |
| `createCollectionScene` y servicios inyectados | No coincide literalmente con todos los contratos actuales | Requiere adaptación | Usar factories/contratos existentes; no inventar API |
| Reusar hero, countdown, gallery y overlay | `wedding` solo prueba el patrón estructural | Requiere adaptación | Componentes locales primero; elevar al motor solo con reutilización demostrada |
| Reusar transición y autoplay | Implementaciones lineales/globales disponibles | Requiere adaptación | Configuración local; extensión mínima solo con tests |
| Migrar una pista de audio | Controlador base existe, pero UI/pause no están completos | Requiere adaptación | Wrapper local o PR aislado del motor si el baseline lo exige |
| Personalización por URL | No hay contrato transversal | Requiere adaptación | Definir parser, encoding, privacidad y fallback en plantilla |
| RSVP por Apps Script | No hay transporte RSVP genérico | Bloqueado para publicación, no para PR-1 | Definir contrato sin endpoint operativo; resolver acuse/CORS en PR-5 |
| WhatsApp y Maps | Enlaces externos soportables | Compatible con adaptación | Configuración, encoding, seguridad y fallback |
| Regalos/modal bancario | Overlay genérico insuficiente para el caso completo | Requiere adaptación | Componente local accesible; revisar datos personales |
| Copiar assets originales | Rutas locales soportadas | Bloqueado hasta licencia | Inventario listo; autorización antes de PR-3/PR-6 |
| Portar React/Vite/TypeScript | Polaris actual es vanilla ES modules | Debe descartarse | No replatformar |
| Preservar la apariencia como contrato | CSS de experiencia aislable | Compatible | Scope namespaced y visual baseline |
| Roadmap original de nueve PR | Objetivos válidos, límites mezclados | Requiere adaptación | Adoptar roadmap reconciliado de §9 |

### Cierre del contraste

Todos los elementos relevantes del plan quedaron clasificados. Los bloqueos restantes afectan assets o integraciones futuras, no impiden crear en PR-1 el contrato, manifiesto, registro y validador sin UI publicada.

## 6. Inventario de reutilización

### 6.1 Reutilizar sin cambios

| Pieza | Uso futuro |
| --- | --- |
| `startPolaris` | Arranque seguro del entry point |
| `bootstrapPolaris` | Composición, hidratación y apertura, si el contrato de contenido alcanza |
| `createPolarisEngine` | Registro y controladores base |
| `SceneManager` | Flujo de escenas lineal y navegación |
| Transiciones cinematográficas | Envoltura base, conservando CSS específico |
| Autoplay/hold | Solo si el comportamiento original coincide |
| Controlador de audio | Solo si basta una pista en loop sin UI |
| Registro del Showcase | Descubrimiento de la nueva experiencia |
| Validaciones de plataforma/rutas | Guardrails comunes |
| Estructura de `template-starter` | Scaffold conceptual |

### 6.2 Adaptar para Peralta–Machado

- `event-config.js`: claves exactas derivadas del original, sin distribuir datos personales por escenas.
- `resources-manifest.js`: catálogo real, metadatos de procedencia/licencia y presupuesto documentado.
- `scene-registry.js`: IDs semánticos y orden idéntico al recorrido original.
- factories de escenas: adaptadores DOM propios; no copiar textos ni look de `wedding`.
- `index.html`: estructura semántica, metadatos estáticos y contratos DOM de la invitación.
- CSS propio: tokens, fuentes, layout, capas, animaciones, safe areas y breakpoints basados en el original.
- validador específico: contenido, rutas, grafo, recursos e invariantes de la experiencia.

### 6.3 Crear solo si el original lo exige

- componentes de cuenta regresiva, RSVP real, mapa/enlace de ubicación, calendario, regalos, dress code, galería/lightbox, control musical o personalización;
- políticas de duración por escena o escenas manuales fuera de autoplay;
- soporte de navegación no lineal;
- gestión de foco/anuncios al cambiar escena;
- pruebas de navegador y comparación visual.

La preferencia es crear capacidades dentro de la plantilla primero. Solo deben elevarse a `src/scripts/polaris/` cuando sean agnósticas, estén probadas y exista reutilización real, evitando convertir necesidades específicas en deuda del motor.

### 6.4 No reutilizar

- identidad, contenido, CSS y ambient audio silencioso de `wedding`;
- nombres ficticios Elena/Mateo;
- galería decorativa de tres `span` como sustituto de una galería real;
- supuestos históricos documentados para Baby Shower Space;
- rutas absolutas, assets remotos o dependencias no aprobadas.

## 7. Preservación de apariencia y comportamiento

### 7.1 Principio

La migración debe ser un **port de comportamiento**, no un rediseño. Polaris aportará composición y ciclo de vida; el DOM, CSS, recursos, narrativa, curvas, ritmos y affordances se reproducirán desde un baseline aprobado. Cualquier mejora se separará después en otro PR creativo.

### 7.2 Baseline requerido antes de escribir escenas

1. Fijar SHA y URL de la versión original.
2. Ejecutarla con su toolchain original sin actualizar dependencias.
3. Registrar video de un recorrido completo con audio y punteros visibles.
4. Capturar cada estado estable y transición clave en 360×800, 390×844, 768×1024 y 1440×900; añadir landscape si el original lo soporta.
5. Inventariar por escena: DOM visible, texto, asset, z-index, fuente, color, espacio, duración, easing, trigger, destino y fallback.
6. Guardar resultados de interacciones, URLs externas, teclado, reduced motion, offline/asset failure y consola.
7. Obtener aprobación humana del baseline; no “corregir” peculiaridades sin autorización.

### 7.3 Estrategia de paridad

- **Visual:** screenshots del original y Polaris en el mismo navegador/viewport; overlay y pixel diff con máscaras solo para contenido dinámico aprobado. Umbral inicial por definir después de observar antialiasing y fuentes.
- **Funcional:** matriz Given/When/Then por interacción, escena y salida externa; comparar secuencia, bloqueos, doble click/tap, retorno y fallbacks.
- **Temporal:** medir inicio/fin de animación, transición, autoplay y sincronía musical; tolerancia aprobada, no asumida.
- **Responsive:** comparar todos los viewports baseline, orientación, zoom 200 %, notch/safe areas, teclado virtual y contenido largo.
- **Accesibilidad:** navegación por teclado, nombre/rol/estado, foco, contraste, reduced motion, anuncios y target táctil; registrar diferencias históricas y mejoras propuestas por separado.
- **Performance:** bytes por tipo, solicitudes, LCP/CLS/INP y reproducción en conexión móvil simulada. Presupuesto fijado después del inventario original.
- **Compatibilidad:** Chromium, Firefox y WebKit actuales en desktop/mobile emulado; al menos un iPhone Safari y un Android Chrome reales antes de aprobación final.

## 8. Riesgos, dependencias, supuestos y decisiones

| Riesgo/dependencia | Estado | Impacto | Mitigación/puerta |
| --- | --- | --- | --- |
| Acceso al original y plan | Resuelto | — | Baseline SHA registrado |
| Arquitectura monolítica original | Confirmado | Alto | Port por escenas; no copiar monolito |
| Audio con listeners duplicados | Confirmado | Alto | Una sola máquina de estado/control |
| Countdown con hora local | Confirmado | Alto | ISO `2026-03-28T17:00:00-06:00`; aclarar uso histórico/plantilla |
| RSVP `no-cors` | Confirmado | Alto | Adapter con acuse verificable antes de producción |
| Datos bancarios/personales en cliente | Confirmado | Alto | Aprobación explícita y minimización |
| Licencia de audio/fotos/fonts | Pendiente | Crítico para PR-3/6 | No copiar antes de autorización |
| CSS acumulado y 362 `!important` | Confirmado en plan/original | Alto | Port de estilos efectivos, namespaced |
| Sin baseline visual automatizado | Confirmado | Alto | Capturas y harness antes de afirmar paridad |
| Motor sin teardown/foco completo | Confirmado | Medio | Adaptadores locales y pruebas |
| Fecha del evento ya transcurrida | Confirmado al 29-07-2026 | Producto | Decidir preservación histórica, plantilla o reutilización |

### Decisiones pendientes del equipo humano

1. Si el producto preservará la boda del 28-03-2026, la convertirá en plantilla o actualizará contenido.
2. Licencias y política de optimización de fotografías, audio y fuentes.
3. Si las mejoras accesibles pueden diferir del comportamiento histórico.
4. Tratamiento de nombres, cupos, teléfonos, cuentas y endpoint RSVP.
5. Navegadores/dispositivos mínimos y tolerancias visuales.
6. Momento de aparición en Showcase.

Estas decisiones no bloquean PR-1 porque ese PR define contratos y fixtures no publicados; sí son puertas explícitas para PR-3, PR-5, PR-6 y PR-8.

## 9. Roadmap definitivo de implementación

### PR-1 — Contrato y validador, sin UI publicada

- Crear `src/scripts/templates/peralta-machado/` con configuración, manifiesto y registro.
- Usar datos ficticios o campos no operativos donde exista información sensible.
- Añadir un validador específico sin incorporar dependencias ni modificar Polaris.
- No copiar assets, no registrar en Showcase y no exponer endpoint RSVP.
- **Aceptación:** IDs únicos; orden narrativo completo; rutas POSIX relativas; fecha con zona `-06:00`; inventario cubierto; cero secretos; validadores existentes pasan.

### PR-2 — Shell y recorrido semántico

- Crear ruta y escenas con DOM semántico y estilo diagnóstico.
- Validar navegación, foco, metadata, errores de consola y publicación bajo subdirectorio.
- Sin reclamar paridad visual.

### PR-3 — Assets autorizados y estados visuales

- Incorporar únicamente fotos/fonts autorizadas y optimizadas.
- Portar tokens, layout, ornamentos y responsive con CSS namespaced.
- Comparar estados estables en viewports acordados.

### PR-4 — Apertura, movimiento y transiciones

- Reproducir sobre, reveals, timings y reduced motion.
- Extender Polaris solo si una incompatibilidad concreta queda probada y cubierta por tests.

### PR-5 — Integraciones y datos

- Implementar personalización, Maps, WhatsApp, regalos y RSVP aprobados.
- Separar integraciones complejas en PR adicionales si crecen.
- Exigir privacidad, sanitización, acuse real y fallbacks.

### PR-6 — Audio

- Incorporar pista solo con licencia.
- Implementar gesto, play/pause y manejo de bloqueo/error accesible.

### PR-7 — Paridad y hardening

- Automatizar matriz visual, funcional, responsive, accesible y de rendimiento.
- Cerrar diferencias contra el baseline aprobado.

### PR-8 — Showcase y publicación

- Registrar una sola entrada, preview y documentación.
- Publicar únicamente después de aprobación humana de paridad.

## 10. Recomendación final

### Decisión: GO para PR-1

PR-0 está cerrado: ambas fuentes fueron leídas en referencias inmutables, la invitación quedó inventariada, las propuestas del plan fueron contrastadas con los contratos reales de Polaris y existe un único roadmap.

PR-1 puede comenzar con alcance estricto de contrato y validador, sin UI publicada, assets, datos sensibles ni cambios al motor. Las licencias, la fecha histórica y las integraciones siguen siendo puertas de PR posteriores, no un motivo para mantener el NO-GO técnico.

## 11. Checklist de cierre PR-0

- [x] SHA inmutable del original registrado.
- [x] SHA de Polaris usado para el contraste registrado.
- [x] Plan original leído y contrastado.
- [x] Estructura, escenas, integraciones, assets y responsive inventariados.
- [x] Propuestas clasificadas como compatibles, adaptables, bloqueadas o descartadas.
- [x] Roadmaps reconciliados en una secuencia única.
- [x] Criterios concretos de aceptación definidos para PR-1.
- [x] Afirmaciones obsoletas de falta de acceso eliminadas.
- [x] Repositorio original sin modificaciones.
- [x] Sin código de producción ni assets copiados.
- [x] Veredicto explícito: GO para PR-1.
