import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { eventConfig } from "../../src/scripts/templates/christmas-dinner/config/event-config.js";
import { christmasDinnerTemplate } from "../../src/scripts/templates/christmas-dinner/template-manifest.js";
import { templates } from "../../src/scripts/templates/index.js";

const expectedScenes = ["opening", "countdown", "message", "details", "dress-code", "gallery", "rsvp", "closing"];
const htmlPath = "experiences/christmas-dinner/index.html";
const html = await readFile(htmlPath, "utf8");
const css = await readFile("src/styles/christmas-dinner.css", "utf8");
const registered = templates.find(({ id }) => id === "christmas-dinner");

assert.ok(registered, "Christmas Dinner debe estar registrada en Polaris.");
assert.deepEqual(christmasDinnerTemplate.sceneRegistry.map(({ id }) => id), expectedScenes);
assert.deepEqual([...html.matchAll(/data-scene="([^"]+)"/g)].map(([, id]) => id), expectedScenes);
assert.equal(christmasDinnerTemplate.runtime.autoplay.stopSceneId, "rsvp");
assert.equal(christmasDinnerTemplate.resources.audio.backgroundMusic, eventConfig.music);
assert.doesNotMatch(html, />[^<]*(?:Polaris|Showcase|Catálogo|Colecciones|Template Starter|Back to)[^<]*</i, "La invitación debe ser autocontenida.");
assert.doesNotMatch(html, /<a[^>]+href=["'][^"']*(?:index\.html|showcase)/i, "El cierre no debe navegar a páginas internas.");
assert.ok(css.includes("prefers-reduced-motion"), "La experiencia debe respetar movimiento reducido.");
assert.ok(css.includes("100svh"), "La composición debe adaptarse al viewport móvil.");
for (const id of expectedScenes) assert.match(html, new RegExp(`data-scene="${id}"`));
for (const resource of [eventConfig.images.opening, eventConfig.images.message, ...eventConfig.images.gallery, eventConfig.music.src]) {
  await access(path.resolve("experiences/christmas-dinner", resource));
}
console.log("Christmas Dinner validado: motor Polaris compartido, ocho escenas, recursos locales y cierre autocontenido.");
