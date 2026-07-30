# Compatibility spike: Peralta–Machado → Polaris

**Fecha del análisis:** 30 de julio de 2026<br>
**Repositorio de trabajo:** `k-invitations`<br>
**Baseline Polaris verificado:** `c7f92fb7b6eaaab98fef2eff32bf83803d20c5d7` (`work`, merge del PR #15)<br>
**Baseline BODA-PERALTA-MACHADO:** **no verificable; no se obtuvo ningún objeto Git del repositorio original**<br>
**Estado:** **compatibilidad parcial; migración no lista para comenzar**

## 1. Resumen ejecutivo

Polaris ya ofrece una base técnicamente adecuada para alojar una invitación de boda como una experiencia estática independiente: ruta publicable, manifiesto de plantilla, configuración de contenido, manifiesto de recursos, registro ordenado de escenas, ciclo de vida, transiciones, autoplay, audio, hidratación de metadatos y registro en el Showcase. La experiencia `wedding` existente confirma el patrón de integración, pero es una demo editorial mínima y **no** demuestra paridad con Peralta–Machado.

El spike no puede cerrar todavía la compatibilidad específica. En la reevaluación del 30 de julio de 2026, el repositorio de referencia y, por tanto, `docs/MIGRATION_PLAN_PERALTA_MACHADO.md`, continuaron inaccesibles desde este entorno: el clon y las lecturas HTTPS fueron rechazados por el proxy con `CONNECT tunnel failed, response 403`; la herramienta de consulta web respondió `401 Unauthorized`. También se comprobó que no existe una copia, bundle, objeto Git alcanzable ni recurso MCP del original en el entorno. En consecuencia, este informe no inventa su SHA, estructura, funciones, dependencias, assets ni propuestas del plan.

### Hallazgos principales

1. **La integración base sí es viable.** Una nueva experiencia puede vivir en `experiences/peralta-machado/` y componerse desde `src/scripts/templates/peralta-machado/`, sin modificar ni sustituir plantillas existentes.
2. **No existe un esquema formal versionado.** Los “contratos” reales son objetos JavaScript y convenciones validadas parcialmente en CI; no hay TypeScript, JSON Schema ni validador genérico de contenido/recursos.
3. **El motor tiene límites relevantes.** Audio solo expone `start`; autoplay es lineal y global; el bootstrap exige `document` y `content`; las transiciones asumen escenas DOM; no hay teardown, foco gestionado, estado persistente, personalización por invitado ni pruebas visuales de navegador.
4. **`wedding` es reutilizable como referencia estructural, no como diseño.** Copiar su CSS, textos o escenas comprometería la preservación de la invitación original.
5. **La decisión de inicio es “no-go condicionado”.** Antes de desarrollar se requiere un snapshot accesible e inmutable del repositorio original, el plan de migración y una captura de baseline visual/funcional aprobada.

## 2. Alcance, método y nivel de certeza

### 2.1 Fuentes verificadas

- Todos los archivos versionados de `k-invitations` en el baseline indicado.
- Documentación arquitectónica y de contenido de Polaris.
- Motor, bootstrap, controladores, plantillas, rutas, estilos y validadores existentes.
- La plantilla `wedding` como análogo estructural más cercano.
- Inventario y tamaño de assets versionados.

### 2.2 Fuente bloqueada

No se pudo verificar el contenido de `BODA-PERALTA-MACHADO`, incluido su plan. Los intentos realizados fueron de solo lectura y no modificaron ningún repositorio:

```text
git clone --depth 1 https://github.com/danielperaltaHN/BODA-PERALTA-MACHADO.git
→ CONNECT tunnel failed, response 403

curl -L https://raw.githubusercontent.com/.../docs/MIGRATION_PLAN_PERALTA_MACHADO.md
→ CONNECT tunnel failed, response 403

consulta web/GitHub
→ 401 Unauthorized
```

La búsqueda de copias locales (`/workspace`, `/root` y `/opt`), recursos MCP y objetos Git del repositorio de trabajo tampoco encontró el original. Desactivar el proxy no constituye una alternativa: el entorno no resuelve `github.com` sin él. Por ello, **no se registra un SHA especulativo**; el campo de baseline del original permanece explícitamente sin verificar.

> **Bloqueo de PR-0:** esta no es una decisión pendiente de producto, sino una dependencia técnica externa. Para completar las acciones 1–9 se necesita que el repositorio original sea legible desde el entorno (por red, checkout o bundle Git que conserve el SHA). Un ZIP sin metadatos permitiría auditar archivos, pero no demostrar el commit exacto solicitado.

### 2.3 Convenciones de certeza

- **[HECHO]** comprobado directamente en el código local.
- **[INFERENCIA]** conclusión técnica razonable derivada de hechos, pendiente de contrastar con el original.
- **[PENDIENTE]** requiere el repositorio original, el plan o una decisión humana.

Esta clasificación evita presentar como auditoría completa lo que el entorno no permitió observar.

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

### 4.1 Lo que puede afirmarse

**[HECHO]** La única información comprobable desde la solicitud es que existe un repositorio de referencia llamado `BODA-PERALTA-MACHADO` y que debería contener `docs/MIGRATION_PLAN_PERALTA_MACHADO.md`.

### 4.2 Lo que no puede afirmarse todavía

**[PENDIENTE]** Deben inventariarse desde el original:

- framework, bundler, versiones y dependencias;
- árbol de rutas y estrategia de publicación;
- estructura DOM, secciones y orden narrativo;
- interacciones, temporizadores, animaciones y estados;
- reproducción musical, controles y política de autoplay;
- RSVP, mapas, calendario, regalos, enlaces y servicios externos;
- personalización por invitado o parámetros;
- fonts, imágenes, video, audio, iconos, licencias y tamaños;
- breakpoints, orientación, viewport, safe areas y reduced motion;
- accesibilidad, SEO, social preview y analytics;
- contenido definitivo y datos personales;
- comportamiento de errores y navegadores soportados;
- cada afirmación y propuesta del plan de migración.

**[INFERENCIA]** Por tratarse de una invitación de boda, `wedding` es el análogo semántico más cercano, pero no se presupone que las secciones, flujo o integraciones coincidan.

## 5. Comparación del plan con la arquitectura real

No es responsable clasificar líneas concretas de un documento que no se pudo leer. La siguiente matriz es el **marco definitivo de contraste** que debe completarse en PR-0 con citas al plan y al código original.

| Propuesta posible del plan | Compatibilidad real Polaris | Clasificación provisional | Corrección/condición |
| --- | --- | --- | --- |
| Crear ruta estática dedicada | Soportada por `experiences/<slug>/` | Compatible | Usar rutas relativas POSIX |
| Crear manifiesto de plantilla | Patrón obligatorio de facto | Compatible | Incluir las cinco claves reales |
| Centralizar contenido | `eventConfig.content/document` | Compatible con adaptación | Mantener respaldos HTML sincronizados |
| Registrar escenas | `sceneRegistry` lineal | Compatible si el flujo es lineal | Modelar bifurcaciones fuera del motor o ampliarlo primero |
| Reusar transiciones | Tiempo global + clases DOM | Compatible parcial | Ritmos/curvas por escena requieren extensión |
| Reusar autoplay | Delay global y stop único | Compatible parcial | No sirve para tiempos heterogéneos sin cambio aislado |
| Migrar una pista de fondo | `{ src, volume }`, loop forzado | Compatible parcial | Controles/múltiples pistas requieren extensión |
| Reusar “Wedding” | Solo patrón estructural | Debe corregirse | Crear template propio para no alterar diseño existente |
| Copiar assets del original | Assets locales admitidos | Pendiente legal/técnico | Verificar licencia, peso, formato y rutas antes |
| RSVP/Maps/Calendar | No hay API transversal completa | No implementable como “reuso” hoy | Adaptador propio o PR previo de capacidad |
| Galería avanzada/lightbox | Demo decorativa solamente | No implementable como componente existente | Caracterizar y crear módulo propio reutilizable |
| Personalización por URL | No existe contrato | No implementable todavía | Definir privacidad, encoding, fallback y tests |
| React/Vite/u otro framework | Polaris actual es vanilla y sin build | Cambio arquitectónico | Requiere aprobación; preferir port a ES modules/DOM |
| TypeScript/interfaces existentes | No existen | Incorrecto si el plan lo afirma | Tratar contratos JS actuales como fuente real |
| JSON Schema existente | No existe | Incorrecto si el plan lo afirma | Proponer validación JS sin dependencia o PR aprobado |
| Tests visuales existentes | No existen | Incorrecto | Crear baseline y harness en PR separado |

### Criterio para cerrar la comparación

Cada punto del plan deberá marcarse como:

1. **Compatible:** encaja sin cambiar contratos ni experiencia existente.
2. **Corregir:** la intención es válida, pero ruta, forma de datos o capacidad no coincide.
3. **Bloqueado:** necesita una decisión, asset, permiso o capacidad ausente.
4. **Descartar:** duplicaría, rompería o reemplazaría Polaris sin beneficio aprobado.

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

| Riesgo/dependencia | Estado | Impacto | Mitigación/decisión requerida |
| --- | --- | --- | --- |
| Original y plan inaccesibles | Confirmado | Crítico | Proveer acceso o snapshot verificable |
| Baseline visual no capturado | Confirmado | Crítico | PR-0 antes de migrar |
| Derechos/licencias de assets/fonts/audio | Pendiente | Crítico | Inventario y autorización explícita |
| Dependencias originales desconocidas | Pendiente | Alto | Lockfile + auditoría, sin instalar aún |
| Datos personales/URLs externas | Pendiente | Alto | Definir exposición y fuente pública aprobada |
| Flujo quizá no lineal | Pendiente | Alto | Contrastar con `SceneManager`; ampliar aisladamente |
| Autoplay y audio quizá difieran | Pendiente | Alto | Caracterización antes de reusar controladores |
| CORS/terceros/embeds | Pendiente | Alto | Preferir enlaces y fallbacks; aprobar servicios |
| Fuentes remotas | Pendiente | Alto | Versionar solo con licencia o fallback métrico |
| Peso multimedia | Pendiente | Alto móvil | Presupuesto y formatos antes de copiar |
| Metadatos/social cards | Parcial | Medio | Definir Open Graph; Polaris solo hidrata tres campos |
| Ausencia de E2E visual | Confirmado | Alto | Añadir harness pequeño y reversible |
| Listeners sin teardown | Confirmado | Medio | Evitar rebootstrap; extensión solo si se necesita |
| Reduced motion no coordina runtime | Confirmado | Medio | Definir paridad vs mejora accesible |
| Cambios concurrentes en Polaris | Posible | Medio | Rebase y ejecutar suite completa por PR |

### Decisiones pendientes del equipo humano

1. SHA/versión publicada que será la fuente visual y funcional.
2. Si paridad significa reproducción exacta o permite mejoras accesibles inmediatas.
3. Alcance de RSVP, mapas, calendario, regalos, música y personalización.
4. Navegadores/dispositivos mínimos y tolerancias visuales/temporales.
5. Derechos y política de optimización de cada recurso.
6. Contenido definitivo y tratamiento de datos personales.
7. Si la nueva experiencia aparece en Showcase desde el primer PR ejecutable o tras aprobación de paridad.
8. Si capacidades genéricas descubiertas se incorporan al motor o permanecen locales a la plantilla.

## 9. Plan definitivo de implementación por PR

Los PR son secuenciales, pequeños y reversibles. Ninguno modifica el repositorio original ni reemplaza experiencias existentes.

### PR-0 — Desbloquear y cerrar el spike

- **Objetivo:** convertir los pendientes críticos en hechos verificables.
- **Alcance:** incorporar al informe el SHA del original, auditoría completa, citas del plan, matriz propuesta-a-realidad, inventario de assets/dependencias y baseline aprobado. No copiar código de producción.
- **Áreas:** `docs/PERALTA_MACHADO_COMPATIBILITY_REPORT.md`; artefactos de evidencia en ubicación acordada y ligera.
- **Dependencias:** acceso de solo lectura al original y decisión sobre almacenamiento de capturas.
- **Pruebas:** checksums/inventario, enlaces/rutas, reproducción local del original, revisión manual del recorrido.
- **Aceptación:** ninguna sección específica queda como desconocida; cada punto del plan se clasifica y cita; Product Owner confirma baseline.
- **Reversibilidad:** documentación aislada.

### PR-1 — Contrato y validador de la plantilla (sin UI publicada)

- **Objetivo:** fijar datos, recursos, escenas y políticas antes del port visual.
- **Alcance:** crear configuración/manifiestos/registro con datos aprobados y un validador específico; factories inicialmente mínimas o fixtures no publicadas.
- **Áreas:** `src/scripts/templates/peralta-machado/`, `.github/scripts/validate-peralta-machado.mjs`, workflow.
- **Dependencias:** PR-0; contenido y licencias confirmados.
- **Pruebas:** `node --check`, validador de IDs/destinos/campos/rutas/rangos, suite Polaris completa.
- **Aceptación:** contrato reproduce el inventario; no hay secretos/rutas locales; todas las experiencias previas pasan; no aparece aún en Showcase.
- **Reversibilidad:** eliminar carpeta y paso CI restaura baseline sin tocar motor.

### PR-2 — Shell y recorrido funcional sin identidad final

- **Objetivo:** comprobar composición y navegación end-to-end con DOM semántico.
- **Alcance:** ruta, entry point, secciones, hidratación y escenas; estilo de diagnóstico mínimo, sin reclamar paridad visual.
- **Áreas:** `experiences/peralta-machado/`, escenas de la plantilla, stylesheet propio inicial.
- **Dependencias:** PR-1.
- **Pruebas:** bootstrap, orden, siguiente/anterior, stop, doble interacción, metadata, smoke HTTP bajo subdirectorio.
- **Aceptación:** recorrido y textos coinciden con matriz; cero errores de consola; rutas Pages relativas; existentes sin cambios.
- **Reversibilidad:** ruta y adaptadores aislados.

### PR-3 — Assets y composición visual estática

- **Objetivo:** portar identidad, layout y estados estables sin añadir movimiento.
- **Alcance:** assets autorizados/optimizados, fuentes/fallbacks, tokens, capas, responsive y estados por escena.
- **Áreas:** `assets/images/peralta-machado/`, audio/fonts solo si aprobados, CSS y resources manifest.
- **Dependencias:** PR-0 de licencias, PR-2.
- **Pruebas:** referencias/case/UTF-8, tamaños y dimensiones, screenshot por escena/viewport, contraste y zoom.
- **Aceptación:** estados estables aprobados contra baseline; presupuesto móvil cumplido; sin recursos remotos no aprobados.
- **Reversibilidad:** recursos namespaced y CSS aislado.

### PR-4 — Movimiento, transición y narrativa temporal

- **Objetivo:** reproducir animaciones, triggers, tiempos y comportamiento responsive.
- **Alcance:** clases/keyframes y coordinación con hooks existentes; si el motor no alcanza, una extensión agnóstica mínima en commit separado dentro del mismo PR o un PR-4A previo.
- **Áreas:** CSS, escenas; `src/scripts/polaris/` solo con evidencia y pruebas de regresión.
- **Dependencias:** PR-3 y tabla temporal aprobada.
- **Pruebas:** videos comparativos, temporización automatizada, interacción rápida, reduced motion, suite completa.
- **Aceptación:** secuencia/ritmo dentro de tolerancia aprobada; no regresiones; reduced motion usable.
- **Reversibilidad:** flags/config local o revert del módulo aislado.

### PR-5 — Integraciones funcionales

- **Objetivo:** implementar únicamente RSVP/mapa/calendario/regalos/galería/personalización confirmados.
- **Alcance:** un PR por integración si hay más de una compleja; adaptadores locales por defecto, sanitización, fallbacks y privacidad.
- **Áreas:** config, escenas/componentes locales, HTML y tests; motor solo si la capacidad es genuinamente transversal.
- **Dependencias:** decisiones 2–6 y endpoints/URLs definitivos.
- **Pruebas:** URL exacta y encoding, popup bloqueado, offline, teclado, datos faltantes, dominios permitidos y mobile.
- **Aceptación:** paridad funcional verificable, ningún secreto, salida externa anunciada, fallback seguro.
- **Reversibilidad:** integración desacoplada y deshabilitable desde configuración.

### PR-6 — Música y control de reproducción

- **Objetivo:** igualar la experiencia sonora respetando políticas del navegador.
- **Alcance:** pista autorizada/optimizada, gesto inicial, controles requeridos, errores y preferencias. Extender audio controller solo si el baseline exige más que `start`.
- **Áreas:** audio namespaced, resources, controlador/escena de UI y tests.
- **Dependencias:** licencia, archivo maestro, comportamiento baseline.
- **Pruebas:** play permitido/denegado, pause/resume/mute si aplica, retorno de pestaña, ausencia de audio, móvil.
- **Aceptación:** no hay autoplay ilegal, control accesible, volumen/loop aprobados, fallo no bloquea recorrido.
- **Reversibilidad:** recurso/config y extensión aislados.

### PR-7 — Paridad y hardening

- **Objetivo:** cerrar paridad visual, funcional, responsive, accesible y de rendimiento.
- **Alcance:** harness de navegador, escenarios, screenshots, thresholds acordados y correcciones dentro del alcance de fidelidad.
- **Áreas:** tests/evidencias y ajustes específicos; sin rediseño.
- **Dependencias:** PR-2 a PR-6.
- **Pruebas:** matriz completa de §7.3, suite CI, HTTP Pages, browsers/dispositivos acordados.
- **Aceptación:** cero diferencias no explicadas; criterios medibles pasan; revisión humana firma paridad.
- **Reversibilidad:** tests aditivos y fixes atómicos.

### PR-8 — Publicación en Showcase (sin deploy)

- **Objetivo:** hacer descubrible la experiencia aprobada.
- **Alcance:** registrar una entrada e imagen de preview; actualizar conteo/expectativas del validador evitando números rígidos cuando se apruebe.
- **Áreas:** `src/scripts/templates/index.js`, preview, validador y documentación.
- **Dependencias:** PR-7 aprobado.
- **Pruebas:** Showcase, enlace, teclado, imagen, suite completa y smoke HTTP.
- **Aceptación:** una sola entrada, ruta correcta, experiencias existentes intactas, sin merge/deploy automático.
- **Reversibilidad:** revert de entrada y preview.

## 10. Recomendación final

### Decisión: NO-GO para implementación; GO para PR-0

La arquitectura base de Polaris **probablemente puede alojar** Peralta–Machado sin replatforming, pero la migración no está lista para comenzar porque faltan las dos fuentes que definen el alcance real: código original y plan. Empezar ahora obligaría a asumir contratos, dependencias y comportamiento, contraviniendo la preservación solicitada.

El siguiente paso recomendado es proporcionar acceso de solo lectura o un archive inmutable del repositorio original (incluido historial/lockfile cuando aplique), ejecutar PR-0 y solicitar aprobación del baseline. Solo después debe autorizarse PR-1. No se recomienda modificar el motor Polaris hasta que el contraste demuestre una incompatibilidad concreta y cubierta por pruebas.

## 11. Checklist de consistencia con el repositorio

- [x] La topología descrita existe en el baseline.
- [x] Las claves de manifiesto coinciden con las seis plantillas reales.
- [x] Los contratos del registro coinciden con el validador de plataforma.
- [x] Las capacidades declaradas coinciden con `SceneManager` y los controladores Polaris.
- [x] Las limitaciones de `wedding` coinciden con su HTML, CSS, escenas y test.
- [x] La estrategia conserva rutas relativas y publicación bajo subdirectorio.
- [x] El plan no elimina, reemplaza ni modifica funcionalidades existentes.
- [x] No se atribuyeron al original hechos no observados.
- [ ] Comparación línea por línea con `MIGRATION_PLAN_PERALTA_MACHADO.md` (bloqueada por acceso).
- [ ] Inventario y baseline del original (bloqueados por acceso).
