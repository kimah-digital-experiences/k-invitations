import assert from "node:assert/strict";
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

console.log("Peralta–Machado PR-1 validado: contrato, datos ficticios, escenas y recursos declarativos.");
