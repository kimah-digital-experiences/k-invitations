import { bindAutoPlayHoldControls } from "./autoplay-controller.js";
import { createPolarisEngine } from "./engine.js";

let isStartingJourney = false;

function setEventText(fieldName, value) {
  document.querySelectorAll(`[data-event-field='${fieldName}']`).forEach((element) => {
    element.textContent = value;
  });
}

function applyEventConfig(eventConfig) {
  document.title = eventConfig.document.title;
  document.querySelector('meta[name="description"]')
    ?.setAttribute("content", eventConfig.document.description);
  document.querySelector("main.experience")
    ?.setAttribute("aria-label", eventConfig.document.ariaLabel);

  Object.entries(eventConfig.content).forEach(([fieldName, value]) => {
    setEventText(fieldName, value);
  });
}

function getTransitionStatus() {
  return document.querySelector("[data-transition-status]");
}

function setTransitionStatus(message) {
  const transitionStatus = getTransitionStatus();
  if (transitionStatus) transitionStatus.textContent = message;
}

function isSceneVisible(sceneId) {
  const scene = document.querySelector(`[data-scene='${sceneId}']`);
  return scene ? !scene.hasAttribute("hidden") : false;
}

function revealSceneManually(initialSceneId, journeySceneId) {
  const initialScene = document.querySelector(`[data-scene='${initialSceneId}']`);
  const journeyScene = document.querySelector(`[data-scene='${journeySceneId}']`);

  if (!journeyScene) return false;
  initialScene?.setAttribute("hidden", "");
  journeyScene.removeAttribute("hidden");
  journeyScene.classList.add("is-revealed");
  return true;
}

async function forceJourneyScene(sceneManager, initialSceneId, journeySceneId, continuous) {
  if (!continuous && isSceneVisible(journeySceneId)) return true;

  try {
    if (await sceneManager?.nextScene?.()) return true;
  } catch {
    // Continue to the direct scene fallback.
  }

  setTransitionStatus("Intentando navegar...");

  try {
    if (await sceneManager?.showScene?.(journeySceneId, { direction: "forward" })) return true;
  } catch {
    // Continue to the final DOM fallback.
  }

  return revealSceneManually(initialSceneId, journeySceneId);
}

function exposeStartJourneyFallback(engine, runtime) {
  const { autoPlay, backgroundMusic, sceneManager } = engine;
  const { initialSceneId, journeySceneId } = runtime;
  const continuous = runtime.navigation?.mode === "continuous";

  window.startPolarisJourney = async function startPolarisJourney(event) {
    event?.preventDefault?.();

    if (isStartingJourney || (continuous
      ? sceneManager.getCurrentSceneId?.() === journeySceneId
      : isSceneVisible(journeySceneId))) return;

    isStartingJourney = true;
    backgroundMusic.start();
    setTransitionStatus("Iniciando viaje...");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
      setTransitionStatus("Intentando navegar...");
      const didStart = await forceJourneyScene(sceneManager, initialSceneId, journeySceneId, continuous);

      if (didStart) {
        setTransitionStatus("");
        if (runtime.autoplay.enabled !== false) autoPlay.start();
      } else {
        setTransitionStatus("No se pudo iniciar el viaje. Recarga la página.");
      }
    } finally {
      isStartingJourney = false;
    }
  };
}

export function bootstrapPolaris({ eventConfig, runtime, sceneRegistry }) {
  applyEventConfig(eventConfig);
  const engine = createPolarisEngine({ ...runtime, sceneRegistry });

  window.PolarisEngine = { ...engine, eventConfig };
  bindAutoPlayHoldControls(engine.autoPlay);
  exposeStartJourneyFallback(engine, runtime);
  engine.sceneManager.showScene(runtime.initialSceneId).catch(() => {
    setTransitionStatus("No se pudo iniciar el viaje. Recarga la página.");
  });
}
