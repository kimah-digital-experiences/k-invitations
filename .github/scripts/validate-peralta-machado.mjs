import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { eventConfig } from "../../src/scripts/templates/peralta-machado/config/event-config.js";
import { resourcesManifest } from "../../src/scripts/templates/peralta-machado/resources-manifest.js";
import { sceneRegistry } from "../../src/scripts/templates/peralta-machado/scene-registry.js";

const expectedScenes = ["opening", "hero", "date", "venues", "gallery", "itinerary", "guidance", "rsvp", "closing"];
const root = new URL("../../", import.meta.url);
const html = await readFile(new URL("experiences/peralta-machado/index.html", root), "utf8");
const main = await readFile(new URL("experiences/peralta-machado/main.js", root), "utf8");
const style = await readFile(new URL("src/styles/peralta-machado.css", root), "utf8");

assert.deepEqual(sceneRegistry.map(({ id }) => id), expectedScenes, "El contrato debe conservar las nueve escenas y su orden.");
assert.deepEqual([...html.matchAll(/data-scene="([^"]+)"/g)].map(([, id]) => id), expectedScenes, "El DOM debe conservar el orden narrativo.");
assert.equal((html.match(/Abrir invitación/g) ?? []).length, 1, "Debe existir una única apertura.");
assert.doesNotMatch(html, />\s*Continuar(?:\s|<)/i, "No deben existir botones Continuar.");
assert.doesNotMatch(html, /data-next-scene|\sanimations?\s*=|scroll-snap-type/, "La experiencia no debe usar navegación paginada ni scroll-jacking.");
for (const id of expectedScenes.slice(1)) {
  assert.doesNotMatch(html, new RegExp(`data-scene="${id}"[^>]*\\shidden`), `${id} debe permanecer en el DOM visible sin JavaScript.`);
}
assert.match(main, /data-open-invitation/, "La apertura debe depender de un gesto válido.");
assert.match(main, /focus\(\{ preventScroll: true \}\)/, "La apertura debe gestionar el foco.");
assert.match(main, /IntersectionObserver/, "Las revelaciones deben evitar listeners de scroll costosos.");
assert.match(style, /prefers-reduced-motion/, "Debe respetarse movimiento reducido.");
assert.match(style, /focus-visible/, "El foco de teclado debe ser visible.");
assert.match(style, /env\(safe-area-inset-top\)/, "Debe respetar áreas seguras móviles.");
assert.doesNotMatch(html, /(?:href|src)="\//, "Las rutas deben funcionar bajo el subdirectorio de Pages.");
assert.doesNotMatch(`${html}\n${main}`, /(?:wa\.me|maps\.google|script\.google|googletagmanager|analytics|tel:|https?:\/\/)/i, "No debe haber integraciones externas activas.");
assert.equal(eventConfig.rsvp.endpoint, null);
assert.equal(eventConfig.whatsapp.phone, null);
assert.equal(eventConfig.gifts.accountDetails, null);
assert.equal(eventConfig.audio.enabled, false, "El audio debe permanecer inactivo hasta verificar la licencia de la pista original.");
assert.equal(resourcesManifest.audio.backgroundMusic.src, null);
assert.doesNotMatch(JSON.stringify(resourcesManifest), /placeholder/i, "El manifiesto no debe declarar placeholders engañosos.");

const resources = [...resourcesManifest.images, ...resourcesManifest.fonts];
assert.equal(new Set(resources.map(({ id }) => id)).size, resources.length, "Los IDs de recursos deben ser únicos.");
for (const resource of resources) {
  assert.match(resource.src, /^\.\.\/\.\.\/\.\.\/\.\.\//, `${resource.id} debe usar una ruta relativa POSIX.`);
  await access(new URL(resource.src, new URL("src/scripts/templates/peralta-machado/", root)));
}
assert.ok(style.includes(".peralta-machado"), "Los estilos deben estar aislados.");
assert.doesNotMatch(style, /(?:^|})\s*(?:body|main|section|button|h[1-6])\s*[{,]/m, "No se permiten selectores globales de elementos.");
assert.doesNotMatch(`${html}\n${main}\n${style}`, /(?:[A-Z]:\\|OneDrive|\/Users\/|\/home\/)/, "No se permiten rutas locales.");
console.log("Peralta–Machado validado: nueve escenas verticales, apertura, foco, privacidad, recursos y aislamiento.");
