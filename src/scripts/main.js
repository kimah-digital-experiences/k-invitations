import { SceneManager } from "./core/scene-manager.js?v=8";
import { createOpeningScene } from "./scenes/opening-scene.js?v=8";
import { createBenjaminScene } from "./scenes/benjamin-scene.js?v=8";
import { createSignalScene } from "./scenes/signal-scene.js?v=8";
import { createStarScene } from "./scenes/star-scene.js?v=8";
import { createCelebrationScene } from "./scenes/celebration-scene.js?v=8";
import { createCoordinatesScene } from "./scenes/coordinates-scene.js?v=8";
import { createInvitationScene } from "./scenes/invitation-scene.js?v=8";
import { createRsvpScene } from "./scenes/rsvp-scene.js?v=8";
import { createFinaleScene } from "./scenes/finale-scene.js?v=8";

const OPENING_SCENE_ID = "opening";
const BENJAMIN_SCENE_ID = "benjamin";
let isStartingJourney = false;

function getTransitionStatus() {
  return document.querySelector("[data-transition-status]");
}

function setTransitionStatus(message) {
  const transitionStatus = getTransitionStatus();

  if (transitionStatus) {
    transitionStatus.textContent = message;
  }
}

function isBenjaminVisible() {
  const benjaminScene = document.querySelector(`[data-scene='${BENJAMIN_SCENE_ID}']`);

  return benjaminScene ? !benjaminScene.hasAttribute("hidden") : false;
}

function showBootstrapError() {
  setTransitionStatus("No se pudo iniciar el viaje. Recarga la página.");
}

function revealBenjaminManually() {
  const openingScene = document.querySelector(`[data-scene='${OPENING_SCENE_ID}']`);
  const benjaminScene = document.querySelector(`[data-scene='${BENJAMIN_SCENE_ID}']`);

  if (!benjaminScene) {
    return false;
  }

  openingScene?.setAttribute("hidden", "");
  benjaminScene.removeAttribute("hidden");
  benjaminScene.classList.add("is-revealed");

  return true;
}

async function forceBenjaminScene(sceneManager) {
  if (isBenjaminVisible()) {
    return true;
  }

  try {
    if (await sceneManager?.nextScene?.()) {
      return true;
    }
  } catch {
    // Continue to the direct scene fallback.
  }

  setTransitionStatus("Intentando navegar...");

  try {
    if (await sceneManager?.showScene?.(BENJAMIN_SCENE_ID, { direction: "forward" })) {
      return true;
    }
  } catch {
    // Continue to the final DOM fallback.
  }

  return revealBenjaminManually();
}

function exposeStartJourneyFallback(sceneManager) {
  document.body.setAttribute("data-start-fallback-ready", "true");

  window.startPolarisJourney = async function startPolarisJourney(event) {
    event?.preventDefault?.();

    if (isStartingJourney || isBenjaminVisible()) {
      return;
    }

    isStartingJourney = true;
    setTransitionStatus("Iniciando viaje...");

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 0);
      });
      setTransitionStatus("Intentando navegar...");

      const didStart = await forceBenjaminScene(sceneManager);

      if (didStart) {
        setTransitionStatus("");
      } else {
        setTransitionStatus("No se pudo iniciar el viaje. Recarga la página.");
      }
    } finally {
      isStartingJourney = false;
    }
  };
}

function bootstrapPolarisEngine() {
  document.body.classList.add("js-ready");
  setTransitionStatus("JS listo");

  const sceneManager = new SceneManager();

  sceneManager.registerScene(createOpeningScene());
  sceneManager.registerScene(createBenjaminScene());
  sceneManager.registerScene(createSignalScene());
  sceneManager.registerScene(createStarScene());
  sceneManager.registerScene(createCelebrationScene());
  sceneManager.registerScene(createCoordinatesScene());
  sceneManager.registerScene(createInvitationScene());
  sceneManager.registerScene(createRsvpScene());
  sceneManager.registerScene(createFinaleScene());

  window.PolarisEngine = {
    sceneManager,
  };

  exposeStartJourneyFallback(sceneManager);

  if (document.querySelector("[data-start-journey]")) {
    setTransitionStatus("JS listo · Botón detectado");
  }

  sceneManager.showScene("opening").catch(showBootstrapError);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapPolarisEngine, { once: true });
} else {
  bootstrapPolarisEngine();
}
