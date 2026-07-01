import { SceneManager } from "./core/scene-manager.js";
import { createOpeningScene } from "./scenes/opening-scene.js";
import { createBenjaminScene } from "./scenes/benjamin-scene.js";
import { createSignalScene } from "./scenes/signal-scene.js";
import { createStarScene } from "./scenes/star-scene.js";
import { createCelebrationScene } from "./scenes/celebration-scene.js";
import { createCoordinatesScene } from "./scenes/coordinates-scene.js";
import { createInvitationScene } from "./scenes/invitation-scene.js";

const sceneManager = new SceneManager();

sceneManager.registerScene(createOpeningScene());
sceneManager.registerScene(createBenjaminScene());
sceneManager.registerScene(createSignalScene());
sceneManager.registerScene(createStarScene());
sceneManager.registerScene(createCelebrationScene());
sceneManager.registerScene(createCoordinatesScene());
sceneManager.registerScene(createInvitationScene());
await sceneManager.showScene("opening");

window.PolarisEngine = {
  sceneManager,
};
