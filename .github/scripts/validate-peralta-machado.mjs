import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { eventConfig } from "../../src/scripts/templates/peralta-machado/config/event-config.js";
import { resourcesManifest } from "../../src/scripts/templates/peralta-machado/resources-manifest.js";
import { sceneRegistry } from "../../src/scripts/templates/peralta-machado/scene-registry.js";
import { peraltaMachadoTemplate } from "../../src/scripts/templates/peralta-machado/template-manifest.js";
import { templates } from "../../src/scripts/templates/index.js";

const expectedScenes = [
  "opening", "hero", "date", "venues", "gallery", "itinerary", "guidance", "rsvp", "closing",
];
const requiredSections = [
  "event", "couple", "guest", "opening", "audio", "countdown", "date", "gallery", "itinerary",
  "locations", "gifts", "rsvp", "whatsapp", "content", "document",
];
const dataUriPattern = /^data:(?:audio|image)\/[a-z0-9.+-]+(?:;[^,]+)?,/i;
const htmlPath = "experiences/peralta-machado/index.html";
const mainPath = "experiences/peralta-machado/main.js";
const stylePath = "src/styles/peralta-machado.css";
const assetPaths = [
  "experiences/peralta-machado/assets/images/foto-1.webp",
  "experiences/peralta-machado/assets/images/foto-3.webp",
  "experiences/peralta-machado/assets/images/foto-4.webp",
  "experiences/peralta-machado/assets/images/foto-5.webp",
  "experiences/peralta-machado/assets/images/paper-texture.webp",
  "experiences/peralta-machado/assets/fonts/playfair-display-400.woff2",
  "experiences/peralta-machado/assets/fonts/playfair-display-600.woff2",
  "experiences/peralta-machado/assets/fonts/montserrat-400.woff2",
  "experiences/peralta-machado/assets/fonts/montserrat-600.woff2",
];

export function validatePeraltaMachadoConfig(config) {
  assert.ok(config && typeof config === "object", "La configuración es obligatoria.");
  for (const section of requiredSections) assert.ok(config[section], `Falta la sección obligatoria '${section}'.`);
  assert.match(
    config.event.dateTime,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-06:00$/,
    "La fecha debe incluir la zona -06:00.",
  );
  assert.equal(config.countdown.targetDateTime, config.event.dateTime, "El countdown debe usar la fecha canónica.");
  assert.ok(config.event.timeZone, "La zona horaria IANA es obligatoria.");
  assert.equal(config.couple.partners.length, 2, "La pareja debe declarar dos integrantes.");
  assert.ok(config.locations.length >= 2, "Se requieren ceremonia y recepción.");
  assert.deepEqual(new Set(config.locations.map(({ type }) => type)), new Set(["ceremony", "reception"]));
  for (const location of config.locations) {
    assert.match(location.externalUrl, /^https:\/\//, "Los enlaces externos deben usar HTTPS.");
  }
  assert.equal(config.rsvp.endpoint, null, "PR-1 no debe exponer un endpoint RSVP.");
  assert.equal(config.whatsapp.phone, null, "PR-1 no debe incluir teléfonos.");
  assert.equal(config.gifts.accountDetails, null, "PR-1 no debe incluir datos bancarios.");
  for (const field of ["title", "description", "ariaLabel", "language"]) {
    assert.ok(config.document[field], `Falta document.${field}.`);
  }
  return true;
}

export function validatePeraltaMachadoResources(manifest, config) {
  assert.equal(manifest.version, 1, "El manifiesto debe declarar su versión.");
  const resources = [manifest.audio.backgroundMusic, ...manifest.images, ...manifest.fonts];
  const ids = resources.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length, "Los IDs de recursos deben ser únicos.");
  for (const resource of resources) {
    assert.ok(["audio", "image", "font"].includes(resource.type), `Tipo inválido para '${resource.id}'.`);
    assert.ok(resource.status, `Falta el estado de '${resource.id}'.`);
    if (resource.status === "placeholder") {
      assert.match(resource.src, dataUriPattern, `El placeholder '${resource.id}' debe estar embebido.`);
    } else {
      assert.match(resource.src, /^\.\/assets\//, `El recurso '${resource.id}' debe usar una ruta local relativa.`);
    }
  }
  assert.ok(ids.includes(config.audio.resourceId), "El audio configurado debe existir en el manifiesto.");
  for (const id of config.gallery.imageResourceIds) assert.ok(ids.includes(id), `Falta el recurso de galería '${id}'.`);
  assert.ok(ids.includes("hero-portrait"), "Falta el slot de imagen principal.");
  assert.equal(
    manifest.images.some(({ status }) => status === "placeholder"),
    false,
    "Las imágenes visibles no deben ser placeholders.",
  );
  return true;
}

validatePeraltaMachadoConfig(eventConfig);
validatePeraltaMachadoResources(resourcesManifest, eventConfig);
assert.equal(
  templates.some(({ id }) => id === "peralta-machado"),
  false,
  "PR-1 no debe publicar la plantilla en Showcase.",
);
assert.deepEqual(sceneRegistry.map(({ id }) => id), expectedScenes, "El registro debe preservar el orden narrativo.");
assert.equal(new Set(expectedScenes).size, expectedScenes.length, "Los IDs de escena deben ser únicos.");
sceneRegistry.forEach(({ id, create, nextSceneId }, index) => {
  assert.equal(typeof create, "function", `${id}: la fábrica es obligatoria.`);
  assert.equal(create().id, id, `${id}: la fábrica debe respetar el contrato de escena.`);
  assert.equal(nextSceneId, expectedScenes[index + 1] ?? null, `${id}: destino narrativo inválido.`);
});
assert.equal(peraltaMachadoTemplate.eventConfig, eventConfig);
assert.equal(peraltaMachadoTemplate.resources, resourcesManifest);
assert.equal(peraltaMachadoTemplate.runtime.audio, resourcesManifest.audio.backgroundMusic);
assert.ok(expectedScenes.includes(peraltaMachadoTemplate.runtime.initialSceneId));
assert.ok(expectedScenes.includes(peraltaMachadoTemplate.runtime.journeySceneId));
assert.ok(expectedScenes.includes(peraltaMachadoTemplate.runtime.autoplay.stopSceneId));
assert.equal(peraltaMachadoTemplate.runtime.autoplay.enabled, false, "El scroll continuo no debe usar autoplay.");

assert.throws(
  () => validatePeraltaMachadoConfig({ ...eventConfig, guest: undefined }),
  /guest/,
  "Debe rechazar secciones obligatorias ausentes.",
);
assert.throws(
  () => validatePeraltaMachadoConfig({ ...eventConfig, event: { ...eventConfig.event, dateTime: "2027-03-20" } }),
  /zona -06:00/,
  "Debe rechazar fechas sin zona horaria.",
);
assert.throws(
  () => validatePeraltaMachadoConfig({ ...eventConfig, whatsapp: { ...eventConfig.whatsapp, phone: "+50400000000" } }),
  /no debe incluir teléfonos/,
  "Debe rechazar teléfonos en el fixture de PR-1.",
);
assert.throws(
  () => validatePeraltaMachadoResources({
    ...resourcesManifest,
    images: resourcesManifest.images.filter(({ id }) => id !== "gallery-portrait-01"),
  }, eventConfig),
  /gallery-portrait-01/,
  "Debe rechazar manifiestos incompletos.",
);

await Promise.all([access(htmlPath), access(mainPath), access(stylePath), ...assetPaths.map((path) => access(path))]);
const [html, main, style] = await Promise.all([
  readFile(htmlPath, "utf8"),
  readFile(mainPath, "utf8"),
  readFile(stylePath, "utf8"),
]);
const htmlScenes = [...html.matchAll(/data-scene="([^"]+)"/g)].map(([, id]) => id);

assert.deepEqual(htmlScenes, expectedScenes, "El shell debe representar el orden declarativo completo.");
assert.equal(new Set(htmlScenes).size, htmlScenes.length, "El shell no debe duplicar IDs de escena.");
assert.match(main, /bootstrapPolaris\(peraltaMachadoTemplate\)/, "El módulo debe arrancar el manifiesto de PR-1.");
assert.match(main, /\.\.\/\.\.\/src\/scripts\/polaris\/bootstrap\.js/, "El bootstrap debe usar una ruta relativa.");
assert.match(html, /<title>Valeria &amp; Nicolás · Invitación de boda<\/title>/);
assert.match(html, new RegExp(`content="${eventConfig.document.description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
assert.match(html, new RegExp(`aria-label="${eventConfig.document.ariaLabel}"`));
assert.match(html, /<html lang="es-HN">/);
assert.doesNotMatch(html, /(?:href|src)="\//, "Las rutas locales no deben ser absolutas.");
assert.doesNotMatch(html, /https?:\/\//, "PR-2 no debe activar integraciones externas.");
assert.ok(style.includes(".peralta-machado"), "Los estilos visuales deben estar aislados.");
assert.doesNotMatch(style, /(?:^|})\s*(?:body|main|section|button|h[1-6])\s*[{,]/m, "PR-3 no debe introducir selectores globales.");
assert.doesNotMatch(style, /estilo diagnóstico|border:\s*0\.5rem\s+solid/i, "PR-3 debe retirar el estilo diagnóstico.");
assert.match(style, /prefers-reduced-motion/, "La experiencia debe respetar movimiento reducido.");
assert.match(style, /env\(safe-area-inset-top\)/, "El layout móvil debe respetar áreas seguras.");
assert.equal((style.match(/@font-face/g) ?? []).length, 4, "PR-3 debe cargar las cuatro variantes tipográficas locales.");
assert.match(style, /font-display:\s*swap/, "Las fuentes locales deben evitar bloquear el texto.");
assert.doesNotMatch(html, /Fotografía autorizada \d/, "La galería no debe conservar marcadores.");
for (const path of assetPaths) {
  const relativePath = path.replace("experiences/peralta-machado/", "");
  assert.match(`${html}\n${style}`, new RegExp(relativePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `El asset '${relativePath}' debe estar referenciado.`);
}
assert.match(html, /data-scene="gallery"[\s\S]*peralta-machado__gallery/, "La galería debe tener composición visual.");
assert.match(html, /data-scene="venues"[\s\S]*button type="button" disabled/, "Las ubicaciones deben seguir deshabilitadas.");
assert.match(html, /data-scene="rsvp"[\s\S]*No se enviará información/, "RSVP debe indicar que no transmite datos.");
assert.doesNotMatch(html, /data-next-scene|>\s*Continuar/i, "El recorrido vertical no debe incluir controles Continuar.");
assert.doesNotMatch(html, /data-scene="[^"]+"[^>]*\shidden(?:\s|>)/, "Las nueve secciones deben existir visibles en el DOM sin JavaScript.");
assert.match(style, /overflow:\s*clip/, "La experiencia debe evitar desbordamiento horizontal sin bloquear el scroll vertical.");
assert.match(style, /IntersectionObserver|data-motion-ready/, "Las apariciones deben degradarse sin ocultar contenido permanentemente.");
assert.doesNotMatch(html, /(?:tel:|https?:\/\/|wa\.me|maps\.google|forms\.gle|script\.google)/i, "PR-3 no debe activar integraciones reales.");
assert.doesNotMatch(`${html}\n${style}`, /(?:[A-Z]:\\|OneDrive|\/Users\/|\/home\/)/, "No se permiten rutas locales.");

class TestElement {
  attributes = new Map();
  classList = { add() {}, remove() {} };
  listeners = new Map();
  textContent = "";
  focusCount = 0;

  constructor({ hidden = false, action = null, focus = null } = {}) {
    if (hidden) this.attributes.set("hidden", "");
    this.action = action;
    this.focusTarget = focus;
  }

  addEventListener(name, listener) { this.listeners.set(name, listener); }
  hasAttribute(name) { return this.attributes.has(name); }
  removeAttribute(name) { this.attributes.delete(name); }
  setAttribute(name, value) { this.attributes.set(name, value); }
  scrollIntoView() { this.didScroll = true; }
  focus() { this.focusCount += 1; }
  querySelector(selector) {
    if (selector === "[data-next-scene]") return this.action;
    if (selector === "[data-scene-focus]") return this.focusTarget;
    return null;
  }
}

const focusTargets = new Map(expectedScenes.map((id) => [id, new TestElement()]));
const scenes = new Map(expectedScenes.map((id) => [id, new TestElement({
  hidden: false,
  focus: focusTargets.get(id),
})]));
const experience = new TestElement();
const description = new TestElement();
const status = new TestElement();
const fields = new Map();

globalThis.document = {
  documentElement: new TestElement(),
  body: experience,
  readyState: "complete",
  title: "",
  querySelector(selector) {
    const sceneId = selector.match(/^\[data-scene='(.+)'\]$/)?.[1];
    if (sceneId) return scenes.get(sceneId) ?? null;
    if (selector === 'meta[name="description"]') return description;
    if (["main.experience", ".experience"].includes(selector)) return experience;
    if (selector === "[data-transition-status]") return status;
    return null;
  },
  querySelectorAll(selector) {
    if (selector === ".peralta-machado [data-scene]") return [...scenes.values()];
    const field = selector.match(/^\[data-event-field='(.+)'\]$/)?.[1];
    if (!field) return [];
    if (!fields.has(field)) fields.set(field, new TestElement());
    return [fields.get(field)];
  },
};
globalThis.Audio = class { play() { return Promise.resolve(); } };
globalThis.window = {
  clearTimeout,
  setTimeout,
  requestAnimationFrame: (callback) => callback(),
};

const { bootstrapPolaris } = await import("../../src/scripts/polaris/bootstrap.js");
bootstrapPolaris({
  ...peraltaMachadoTemplate,
  runtime: { ...peraltaMachadoTemplate.runtime, transitionMs: 0 },
});
await new Promise((resolve) => setTimeout(resolve, 0));
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "opening");
assert.equal(focusTargets.get("opening").focusCount, 1, "La escena inicial debe recibir foco.");

await window.startPolarisJourney();
await new Promise((resolve) => setTimeout(resolve, 0));
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "hero");
assert.equal(focusTargets.get("hero").focusCount, 1, "La apertura debe llevar el foco al inicio del contenido.");
assert.equal(scenes.get("hero").didScroll, true, "La apertura debe situar el recorrido en la bienvenida.");
assert.equal(scenes.get("opening").hasAttribute("hidden"), true, "La portada debe retirarse después de abrir.");
for (const id of expectedScenes.slice(1)) assert.equal(scenes.get(id).hasAttribute("hidden"), false, `${id}: debe permanecer disponible para scroll natural.`);
await new Promise((resolve) => setTimeout(resolve, 10));
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "hero", "El recorrido vertical no debe avanzar automáticamente.");

console.log("Peralta–Machado PR-4 validado: apertura, nueve secciones continuas, movimiento reducido, privacidad y foco.");
