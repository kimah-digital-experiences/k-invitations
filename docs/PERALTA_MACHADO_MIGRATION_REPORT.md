# Migración controlada Peralta–Machado — PR-4

**Fecha:** 30 de julio de 2026  
**Base Polaris:** `44dddb2ec8d0927e7c576b5d9e9ecca584b33190`  
**Fuente original auditada:** `danielperaltaHN/BODA-PERALTA-MACHADO@e4e6afcd0698e279a2a7fcead11fb6b19ddbe4c9`

## Alcance y procedencia

Esta entrega corresponde a **PR-4 — apertura, movimiento y transiciones** del roadmap reconciliado. Parte del shell, contratos y estados visuales ya fusionados hasta PR-3. El código original sigue siendo el contrato de referencia documentado en el informe de compatibilidad: una SPA estática sin dependencias declaradas, cuyo HTML monolítico reúne presentación, estilos y comportamiento.

El entorno no permitió volver a descargar GitHub (el túnel devolvió HTTP 403). Por ello se usó la auditoría verificable y fijada por SHA en `PERALTA_MACHADO_COMPATIBILITY_REPORT.md`, además de los recursos autorizados que ya formaban parte de `main`. El PR #21 no se descargó, modificó, cerró ni fusionó; tampoco se utilizó su rama como base.

## Inventario y tratamiento

| Elemento original | Tratamiento en Polaris |
| --- | --- |
| Portada, sobre/sello y gesto de apertura | Adaptado a una portada modal local con un único botón y transición reversible por movimiento reducido. |
| Recorrido por secciones | Adaptado a scroll vertical nativo; todas las escenas posteriores permanecen en el DOM y son accesibles sin JavaScript. |
| Revelados visuales | Sustitución técnica por `IntersectionObserver`, sin listeners de scroll ni bloqueo de navegación. |
| Fotografías y textura | Se conservan los WebP autorizados ya integrados en PR-3 y se catalogan con rutas relativas reales. |
| Playfair Display y Montserrat | Se conservan los WOFF2 locales y sus licencias OFL ya integradas en PR-3. |
| Música `CANCION.mp3` | Pospuesta: el archivo no está presente en `main` y su licencia continúa pendiente de verificación. No se sustituyó por otra pista ni se simuló audio. |
| Apps Script, WhatsApp, Maps y cuentas | Descartados por privacidad y seguridad; la UI ficticia permanece deshabilitada y no transmite datos. |
| Dependencias externas | Retiradas/no migradas; la implementación usa módulos ES, CSS e interfaces nativas. |
| Datos reales | Sustituidos por la configuración ficticia y reutilizable de Valeria y Nicolás. |
| Analítica y seguimiento | No migrados. |

## Orden narrativo

1. `opening` — portada y apertura.
2. `hero` — bienvenida.
3. `date` — fecha.
4. `venues` — ubicación.
5. `gallery` — historia y fotografías.
6. `itinerary` — recorrido del evento.
7. `guidance` — regalos e indicaciones.
8. `rsvp` — confirmación ficticia.
9. `closing` — cierre.

Los IDs y el orden se preservan para compatibilidad con los contratos existentes. No existen controles “Continuar”, carrusel, autoplay narrativo, scroll-snap ni scroll-jacking.

## Diferencias y mejoras

La estructura editorial, paleta, tipografías, fotografías y textura provienen de los estados visuales autorizados basados en el original. La transición entre escenas se adapta al scroll natural exigido por Polaris. La apertura gestiona foco, el contenido funciona sin JavaScript, el foco visible se conserva y `prefers-reduced-motion` elimina revelados y desplazamiento suave. Las rutas son relativas al subdirectorio de GitHub Pages.

No se afirma paridad visual absoluta: no hubo navegador instalado ni acceso a la versión original para comparación simultánea. La revisión humana debe comparar composición, recortes, ritmo y transición en dispositivos reales. El audio, integraciones y publicación en Showcase permanecen pospuestos según roadmap.
