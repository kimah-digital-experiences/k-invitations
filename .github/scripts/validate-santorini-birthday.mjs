import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { eventConfig } from "../../src/scripts/templates/santorini-birthday/config/event-config.js";
import { santoriniBirthdayTemplate } from "../../src/scripts/templates/santorini-birthday/template-manifest.js";
import { templates } from "../../src/scripts/templates/index.js";

const expectedScenes = [
  "opening", "welcome", "birthday", "quote", "details",
  "dress-code", "countdown", "gallery", "rsvp", "closing",
];
const registered = templates.find(({ id }) => id === "santorini-birthday");
assert.ok(registered, "Santorini Birthday debe estar registrada en Showcase.");
assert.deepEqual(
  santoriniBirthdayTemplate.sceneRegistry.map(({ id }) => id),
  expectedScenes,
  "El registro debe preservar la narrativa mediterránea aprobada.",
);
assert.equal(santoriniBirthdayTemplate.runtime.autoplay.stopSceneId, "rsvp");
assert.equal(santoriniBirthdayTemplate.resources.audio.backgroundMusic, eventConfig.music);
assert.equal(santoriniBirthdayTemplate.resources.images, eventConfig.images);

const html = await readFile("experiences/santorini-birthday/index.html", "utf8");
for (const sceneId of expectedScenes) {
  assert.match(html, new RegExp(`data-scene=["']${sceneId}["']`), `Falta la escena ${sceneId}.`);
}
for (const image of [eventConfig.images.opening, eventConfig.images.architecture, ...eventConfig.images.gallery]) {
  await access(path.resolve("experiences/santorini-birthday", image));
}
assert.ok(html.includes("prefers-reduced-motion") === false, "La preferencia vive en la hoja de estilos.");
const css = await readFile("src/styles/santorini-birthday.css", "utf8");
assert.ok(css.includes("prefers-reduced-motion"), "La experiencia debe respetar movimiento reducido.");
assert.ok(css.includes("100svh"), "La composición debe adaptarse al viewport móvil.");

console.log("Santorini Birthday validado: configuración, recursos, escenas, Showcase y accesibilidad.");
