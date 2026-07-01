import { SceneManager } from "./core/scene-manager.js";
import { createOpeningScene } from "./scenes/opening-scene.js";
import { createBenjaminScene } from "./scenes/benjamin-scene.js";

const sceneManager = new SceneManager();

sceneManager.registerScene(createOpeningScene());
sceneManager.registerScene(createBenjaminScene());
await sceneManager.showScene("opening");

window.PolarisEngine = {
  sceneManager,
};
