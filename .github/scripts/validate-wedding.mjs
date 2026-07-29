import assert from "node:assert/strict";

class Element {
  attributes = new Map();
  classList = { add() {}, remove() {} };
  listeners = new Map();
  textContent = "";
  dataset = {};
  constructor(attributes = {}) { Object.entries(attributes).forEach(([key, value]) => this.attributes.set(key, value)); }
  addEventListener(name, listener) { this.listeners.set(name, listener); }
  hasAttribute(name) { return this.attributes.has(name); }
  removeAttribute(name) { this.attributes.delete(name); }
  setAttribute(name, value) { this.attributes.set(name, value); }
}

const ids = ["opening", "couple", "story", "date", "location", "gallery", "rsvp", "closing"];
const scenes = new Map(ids.map((id) => [id, new Element({ hidden: "" })]));
const fields = new Map();
const experience = new Element();
const description = new Element();
const status = new Element();
const actions = Array.from({ length: 6 }, () => new Element());

globalThis.document = {
  body: experience,
  readyState: "complete",
  title: "",
  querySelector(selector) {
    const sceneId = selector.match(/^\[data-scene='(.+)'\]$/)?.[1];
    if (sceneId) return scenes.get(sceneId) ?? null;
    if (selector === "[data-wedding-next]") return actions[0];
    if (selector === 'meta[name="description"]') return description;
    if (["main.experience", ".experience"].includes(selector)) return experience;
    if (selector === "[data-transition-status]") return status;
    return null;
  },
  querySelectorAll(selector) {
    const field = selector.match(/^\[data-event-field='(.+)'\]$/)?.[1];
    if (!field) return [];
    if (!fields.has(field)) fields.set(field, new Element());
    return [fields.get(field)];
  },
};
globalThis.Audio = class { play() { return Promise.resolve(); } };
globalThis.window = { clearTimeout, setTimeout, requestAnimationFrame: (callback) => callback() };

const [{ bootstrapPolaris }, { weddingTemplate }] = await Promise.all([
  import("../../src/scripts/polaris/bootstrap.js"),
  import("../../src/scripts/templates/wedding/template-manifest.js"),
]);
const testTemplate = {
  ...weddingTemplate,
  runtime: {
    ...weddingTemplate.runtime,
    transitionMs: 0,
    autoplay: { ...weddingTemplate.runtime.autoplay, delayMs: 1, retryDelayMs: 1 },
  },
};

bootstrapPolaris(testTemplate);
await new Promise((resolve) => setTimeout(resolve, 0));
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "opening");
assert.equal(document.title, "Wedding · Elena & Mateo");
await window.startPolarisJourney();
await new Promise((resolve) => setTimeout(resolve, 35));
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "rsvp", "Autoplay debe detenerse en RSVP.");
assert.equal(await window.PolarisEngine.sceneManager.nextScene(), true);
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "closing");
assert.equal(await window.PolarisEngine.sceneManager.previousScene(), true);
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "rsvp");
console.log("Wedding validado: bootstrap, contenido, navegación, autoplay, audio y cierre.");
