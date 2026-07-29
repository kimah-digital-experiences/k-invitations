import { access, readFile } from "node:fs/promises";
import { eventConfig } from "../../src/scripts/templates/tropical-birthday/config/event-config.js";
import { tropicalBirthdayTemplate } from "../../src/scripts/templates/tropical-birthday/template-manifest.js";

const htmlPath = "experiences/tropical-birthday/index.html";
const html = await readFile(htmlPath, "utf8");
const expectedScenes = ["opening", "countdown", "message", "details", "dress-code", "gallery", "rsvp", "closing"];
const registeredScenes = tropicalBirthdayTemplate.sceneRegistry.map(({ id }) => id);
const htmlScenes = [...html.matchAll(/data-scene="([^"]+)"/g)].map(([, id]) => id);
const requiredFields = ["openingTitle", "messageCopy", "date", "time", "location", "dressTitle", "closingTitle"];
const failures = [];
const registered = (await import("../../src/scripts/templates/index.js")).templates
  .find(({ id }) => id === "tropical-birthday");

if (!registered) failures.push("la experiencia no está registrada en Polaris Showcase");

if (JSON.stringify(registeredScenes) !== JSON.stringify(expectedScenes)) failures.push("el registro de escenas no respeta el recorrido aprobado");
if (JSON.stringify(htmlScenes) !== JSON.stringify(expectedScenes)) failures.push("el HTML no contiene todas las escenas en el orden aprobado");
if (tropicalBirthdayTemplate.runtime.autoplay.stopSceneId === "closing") failures.push("autoplay debe detenerse antes del cierre interactivo");
for (const field of requiredFields) {
  if (!eventConfig.content[field] || !html.includes(`data-event-field="${field}"`)) failures.push(`falta el contenido enlazado '${field}'`);
}
for (const resource of [eventConfig.images.opening, eventConfig.images.message, ...eventConfig.images.gallery]) {
  await access(new URL(`../../experiences/tropical-birthday/${resource}`, import.meta.url));
}
if (!html.includes("prefers-reduced-motion") && !(await readFile("src/styles/tropical-birthday.css", "utf8")).includes("prefers-reduced-motion")) failures.push("falta soporte para movimiento reducido");

if (failures.length) {
  failures.forEach((failure) => console.error(`::error file=${htmlPath}::${failure}.`));
  process.exitCode = 1;
} else {
  console.log("Tropical Birthday conserva el contrato Polaris, sus ocho escenas y todos sus recursos locales.");
}
