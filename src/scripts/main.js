import { SceneManager } from "./core/scene-manager.js?v=4";
import { createOpeningScene } from "./scenes/opening-scene.js?v=4";
import { createBenjaminScene } from "./scenes/benjamin-scene.js?v=4";
import { createSignalScene } from "./scenes/signal-scene.js?v=4";
import { createStarScene } from "./scenes/star-scene.js?v=4";
import { createCelebrationScene } from "./scenes/celebration-scene.js?v=4";
import { createCoordinatesScene } from "./scenes/coordinates-scene.js?v=4";
import { createInvitationScene } from "./scenes/invitation-scene.js?v=4";

function showBootstrapError() {
  const transitionStatus = document.querySelector("[data-transition-status]");

  if (transitionStatus) {
    transitionStatus.textContent = "No se pudo iniciar el viaje. Recarga la página.";
  }
}

function bootstrapPolarisEngine() {
  document.body.classList.add("js-ready");

  const sceneManager = new SceneManager();

  sceneManager.registerScene(createOpeningScene());
  sceneManager.registerScene(createBenjaminScene());
  sceneManager.registerScene(createSignalScene());
  sceneManager.registerScene(createStarScene());
  sceneManager.registerScene(createCelebrationScene());
  sceneManager.registerScene(createCoordinatesScene());
  sceneManager.registerScene(createInvitationScene());

  window.PolarisEngine = {
    sceneManager,
  };

  sceneManager.showScene("opening").catch(showBootstrapError);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapPolarisEngine, { once: true });
} else {
  bootstrapPolarisEngine();
}
