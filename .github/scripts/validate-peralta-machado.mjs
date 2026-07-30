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
    if (resource.src !== null) {
      assert.match(resource.src, dataUriPattern, `El placeholder '${resource.id}' debe estar embebido.`);
    }
  }
  assert.ok(ids.includes(config.audio.resourceId), "El audio configurado debe existir en el manifiesto.");
  for (const id of config.gallery.imageResourceIds) assert.ok(ids.includes(id), `Falta el recurso de galería '${id}'.`);
  assert.ok(ids.includes("hero-portrait"), "Falta el slot de imagen principal.");
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

await Promise.all([access(htmlPath), access(mainPath), access(stylePath)]);
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
assert.doesNotMatch(html, /\.(?:jpe?g|png|webp|mp3|woff2?)(?:[?"'])/i, "PR-2 no debe incorporar assets reales.");
assert.ok(style.includes(".peralta-machado"), "El estilo diagnóstico debe estar aislado.");
assert.doesNotMatch(style, /url\(/i, "El estilo diagnóstico no debe cargar assets.");

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
  focus() { this.focusCount += 1; }
  querySelector(selector) {
    if (selector === "[data-next-scene]") return this.action;
    if (selector === "[data-scene-focus]") return this.focusTarget;
    return null;
  }
}

const controls = new Map(expectedScenes.map((id) => [id, id === "closing" ? null : new TestElement()]));
const focusTargets = new Map(expectedScenes.map((id) => [id, new TestElement()]));
const scenes = new Map(expectedScenes.map((id, index) => [id, new TestElement({
  hidden: index !== 0,
  action: controls.get(id),
  focus: focusTargets.get(id),
})]));
const experience = new TestElement();
const description = new TestElement();
const status = new TestElement();
const fields = new Map();

globalThis.document = {
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
window.PolarisEngine.autoPlay.stop();
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "hero");
for (const [index, expectedId] of expectedScenes.slice(2).entries()) {
  const activeId = expectedScenes[index + 1];
  const action = controls.get(activeId);
  assert.equal(action.listeners.size, 1, `${activeId}: debe existir un único listener de navegación.`);
  assert.equal(await action.listeners.get("click")(), true);
  assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), expectedId);
  assert.equal(focusTargets.get(expectedId).focusCount, 1, `${expectedId}: el encabezado debe recibir foco.`);
}
assert.equal(await window.PolarisEngine.sceneManager.nextScene(), false, "El cierre debe terminar el recorrido.");
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "closing");
for (const id of expectedScenes.slice(0, -1)) {
  assert.equal(scenes.get(id).hasAttribute("hidden"), true, `${id}: una escena inactiva debe quedar oculta.`);
}

console.log("Peralta–Machado PR-2 validado: contrato, shell semántico, rutas, foco y recorrido completo.");
