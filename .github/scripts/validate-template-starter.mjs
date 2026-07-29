import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

class FakeClassList {
  values = new Set();

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.values.delete(name));
  }
}

class FakeElement {
  attributes = new Map();
  classList = new FakeClassList();
  listeners = new Map();
  textContent = "";

  constructor(attributes = {}) {
    Object.entries(attributes).forEach(([name, value]) => this.attributes.set(name, value));
  }

  addEventListener(name, listener) {
    this.listeners.set(name, listener);
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
}

const scenes = new Map(
  ["opening", "message", "closing"].map((id) => [
    id,
    new FakeElement({ "data-scene": id, hidden: "" }),
  ]),
);
const fields = new Map(
  ["openingTitle", "messageText", "closingTitle"].map((name) => [name, new FakeElement()]),
);
const experience = new FakeElement({ class: "experience" });
const description = new FakeElement({ name: "description" });
const transitionStatus = new FakeElement({ "data-transition-status": "" });

globalThis.document = {
  body: experience,
  readyState: "complete",
  querySelector(selector) {
    const sceneId = selector.match(/^\[data-scene='(.+)'\]$/)?.[1];
    if (sceneId) return scenes.get(sceneId) ?? null;
    if (selector === 'meta[name="description"]') return description;
    if (selector === "main.experience" || selector === ".experience") return experience;
    if (selector === "[data-transition-status]") return transitionStatus;
    return null;
  },
  querySelectorAll(selector) {
    const fieldName = selector.match(/^\[data-event-field='(.+)'\]$/)?.[1];
    return fieldName && fields.has(fieldName) ? [fields.get(fieldName)] : [];
  },
  title: "",
};

const audioInstances = [];
globalThis.Audio = class FakeAudio {
  constructor(src) {
    this.src = src;
    audioInstances.push(this);
  }

  play() {
    this.didPlay = true;
    return Promise.resolve();
  }
};

globalThis.window = {
  clearTimeout,
  requestAnimationFrame(callback) {
    callback();
  },
  setTimeout,
};

const [{ bootstrapPolaris }, { templateStarter }] = await Promise.all([
  import("../../src/scripts/polaris/bootstrap.js"),
  import("../../src/scripts/templates/template-starter/template-manifest.js"),
]);

assert.deepEqual(
  templateStarter.sceneRegistry.map(({ id, nextSceneId }) => ({ id, nextSceneId })),
  [
    { id: "opening", nextSceneId: "message" },
    { id: "message", nextSceneId: "closing" },
    { id: "closing", nextSceneId: null },
  ],
  "El registro debe declarar el grafo opening → message → closing.",
);

const testTemplate = {
  ...templateStarter,
  runtime: {
    ...templateStarter.runtime,
    transitionMs: 0,
    autoplay: {
      ...templateStarter.runtime.autoplay,
      delayMs: 1,
      retryDelayMs: 1,
    },
  },
};

bootstrapPolaris(testTemplate);
await new Promise((resolve) => setTimeout(resolve, 0));

assert.equal(document.title, templateStarter.eventConfig.document.title);
assert.equal(fields.get("openingTitle").textContent, "Template Starter");
assert.equal(window.PolarisEngine.sceneManager.getCurrentSceneId(), "opening");
assert.equal(scenes.get("opening").hasAttribute("hidden"), false);
assert.deepEqual(
  Object.keys(window.PolarisEngine).sort(),
  ["autoPlay", "backgroundMusic", "eventConfig", "sceneManager"],
  "El bootstrap debe conservar las APIs públicas de Polaris.",
);

await window.startPolarisJourney();
await new Promise((resolve) => setTimeout(resolve, 30));

const { autoPlay, backgroundMusic, sceneManager } = window.PolarisEngine;
assert.equal(sceneManager.getCurrentSceneId(), "closing", "El autoplay debe detenerse al cerrar.");
assert.equal(sceneManager.getStatus(), "idle");
assert.equal(audioInstances.length, 1, "El audio debe inicializarse con el recurso de la plantilla.");
assert.equal(audioInstances[0].src, templateStarter.resources.audio.backgroundMusic.src);
assert.equal(audioInstances[0].volume, 0);
assert.equal(audioInstances[0].loop, true);
assert.equal(audioInstances[0].didPlay, true);

assert.equal(await sceneManager.previousScene(), true);
assert.equal(sceneManager.getCurrentSceneId(), "message");
assert.equal(await sceneManager.showScene("opening"), true);
assert.equal(await sceneManager.nextScene(), true);
assert.equal(sceneManager.getCurrentSceneId(), "message");
assert.equal(await sceneManager.showScene("unknown"), false);

autoPlay.pause();
autoPlay.resume();
autoPlay.stop();
backgroundMusic.start();

const [mainSource, engineSource] = await Promise.all([
  readFile("src/scripts/main.js", "utf8"),
  readFile("src/scripts/polaris/engine.js", "utf8"),
]);
assert.equal(mainSource.includes("template-starter"), false, "El entry point publicado no debe cambiar.");
assert.equal(engineSource.includes("template-starter"), false, "El motor no debe depender de la plantilla.");

console.log(
  "Template Starter validado: bootstrap, registro, navegación, autoplay, transiciones, audio y APIs públicas.",
);
