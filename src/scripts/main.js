import { eventConfig } from "./config/event-config.js?v=18";
import { SceneManager } from "./core/scene-manager.js?v=16";
import { createOpeningScene } from "./scenes/opening-scene.js?v=16";
import { createBenjaminScene } from "./scenes/benjamin-scene.js?v=16";
import { createSignalScene } from "./scenes/signal-scene.js?v=16";
import { createStarScene } from "./scenes/star-scene.js?v=16";
import { createCoordinatesScene } from "./scenes/coordinates-scene.js?v=18";
import { createInvitationScene } from "./scenes/invitation-scene.js?v=16";
import { createRsvpScene } from "./scenes/rsvp-scene.js?v=18";
import { createFinaleScene } from "./scenes/finale-scene.js?v=18";

const OPENING_SCENE_ID = "opening";
const BENJAMIN_SCENE_ID = "benjamin";
const RSVP_SCENE_ID = "scene8";
const AUTO_PLAY_DELAY_MS = 4000;
const SCENE_TRANSITION_MS = 600;
const BACKGROUND_MUSIC_SRC = "assets/audio/theme.mp3";
const BACKGROUND_MUSIC_VOLUME = 0.2;
let isStartingJourney = false;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getSceneElement(sceneId) {
  return document.querySelector(`[data-scene='${sceneId}']`);
}

function resetSceneTransition(sceneElement) {
  sceneElement?.classList.remove(
    "is-scene-transition-leaving",
    "is-scene-transition-entering",
    "is-scene-transition-active",
  );
}

function nextAnimationFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(resolve);
  });
}

function enableCinematicTransitions(sceneManager) {
  const showScene = sceneManager.showScene.bind(sceneManager);

  sceneManager.showScene = async function showSceneWithTransition(sceneId, context = {}) {
    const currentSceneId = sceneManager.getCurrentSceneId?.();
    const isInitialRender = !currentSceneId;

    if (isInitialRender || currentSceneId === sceneId || sceneManager.isTransitioning?.()) {
      return showScene(sceneId, context);
    }

    const leavingScene = getSceneElement(currentSceneId);
    const enteringScene = getSceneElement(sceneId);

    resetSceneTransition(leavingScene);
    resetSceneTransition(enteringScene);

    if (leavingScene) {
      leavingScene.classList.add("is-scene-transition-leaving");
      await wait(SCENE_TRANSITION_MS);
    }

    if (enteringScene) {
      enteringScene.classList.add("is-scene-transition-entering");
    }

    const didShow = await showScene(sceneId, context);

    resetSceneTransition(leavingScene);

    if (!didShow) {
      resetSceneTransition(enteringScene);
      return false;
    }

    if (enteringScene) {
      await nextAnimationFrame();
      enteringScene.classList.add("is-scene-transition-active");
      await wait(SCENE_TRANSITION_MS);
      resetSceneTransition(enteringScene);
    }

    return true;
  };
}

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

function createAutoPlayController(sceneManager) {
  let isRunning = false;
  let isPaused = false;
  let timerId;
  let targetTime = 0;
  let remainingDelay = AUTO_PLAY_DELAY_MS;

  function clearTimer() {
    window.clearTimeout(timerId);
    timerId = null;
  }

  function isAtStopScene() {
    return sceneManager.getCurrentSceneId?.() === RSVP_SCENE_ID;
  }

  function stop() {
    isRunning = false;
    isPaused = false;
    remainingDelay = AUTO_PLAY_DELAY_MS;
    clearTimer();
  }

  function scheduleNext(delay = AUTO_PLAY_DELAY_MS) {
    clearTimer();

    if (!isRunning || isPaused) {
      return;
    }

    if (isAtStopScene()) {
      stop();
      return;
    }

    targetTime = Date.now() + delay;
    timerId = window.setTimeout(advance, delay);
  }

  async function advance() {
    clearTimer();

    if (!isRunning || isPaused) {
      return;
    }

    if (sceneManager.isTransitioning?.()) {
      scheduleNext(120);
      return;
    }

    if (isAtStopScene()) {
      stop();
      return;
    }

    const didAdvance = await sceneManager.nextScene({ direction: "forward" });

    if (!didAdvance || isAtStopScene()) {
      stop();
      return;
    }

    scheduleNext();
  }

  function start() {
    isRunning = true;
    isPaused = false;
    remainingDelay = AUTO_PLAY_DELAY_MS;
    scheduleNext();
  }

  function pause() {
    if (!isRunning || isPaused) {
      return;
    }

    remainingDelay = Math.max(0, targetTime - Date.now());
    isPaused = true;
    clearTimer();
  }

  function resume() {
    if (!isRunning || !isPaused) {
      return;
    }

    isPaused = false;
    scheduleNext(remainingDelay || AUTO_PLAY_DELAY_MS);
  }

  return {
    start,
    stop,
    pause,
    resume,
  };
}

function bindAutoPlayHoldControls(autoPlay) {
  const experience = document.querySelector(".experience") ?? document.body;

  ["pointerdown", "touchstart"].forEach((eventName) => {
    experience.addEventListener(eventName, () => {
      autoPlay.pause();
    }, { passive: true });
  });

  ["pointerup", "pointercancel", "touchend", "touchcancel"].forEach((eventName) => {
    experience.addEventListener(eventName, () => {
      autoPlay.resume();
    }, { passive: true });
  });
}

function createBackgroundMusicController() {
  let audio;
  let isUnavailable = false;

  function ensureAudio() {
    if (!audio) {
      audio = new Audio(BACKGROUND_MUSIC_SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = BACKGROUND_MUSIC_VOLUME;
    }

    return audio;
  }

  function start() {
    if (isUnavailable) {
      return;
    }

    const backgroundMusic = ensureAudio();
    const playAttempt = backgroundMusic.play();

    if (playAttempt?.catch) {
      playAttempt.catch((error) => {
        if (backgroundMusic.error || error?.name === "NotSupportedError") {
          isUnavailable = true;
        }
      });
    }
  }

  return {
    start,
  };
}

function exposeStartJourneyFallback(sceneManager, autoPlay, backgroundMusic) {
  window.startPolarisJourney = async function startPolarisJourney(event) {
    event?.preventDefault?.();

    if (isStartingJourney || isBenjaminVisible()) {
      return;
    }

    isStartingJourney = true;
    backgroundMusic.start();
    setTransitionStatus("Iniciando viaje...");

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 0);
      });
      setTransitionStatus("Intentando navegar...");

      const didStart = await forceBenjaminScene(sceneManager);

      if (didStart) {
        setTransitionStatus("");
        autoPlay.start();
      } else {
        setTransitionStatus("No se pudo iniciar el viaje. Recarga la página.");
      }
    } finally {
      isStartingJourney = false;
    }
  };
}

function setEventText(fieldName, value) {
  document.querySelectorAll(`[data-event-field='${fieldName}']`).forEach((element) => {
    element.textContent = value;
  });
}

function applyEventConfig() {
  document.title = eventConfig.document.title;

  const description = document.querySelector('meta[name="description"]');
  description?.setAttribute("content", eventConfig.document.description);

  const experience = document.querySelector("main.experience");
  experience?.setAttribute("aria-label", eventConfig.document.ariaLabel);

  Object.entries(eventConfig.content).forEach(([fieldName, value]) => {
    setEventText(fieldName, value);
  });
}

function bootstrapPolarisEngine() {
  applyEventConfig();

  const sceneManager = new SceneManager();
  const autoPlay = createAutoPlayController(sceneManager);
  const backgroundMusic = createBackgroundMusicController();

  sceneManager.registerScene(createOpeningScene());
  sceneManager.registerScene(createBenjaminScene());
  sceneManager.registerScene(createSignalScene());
  sceneManager.registerScene(createStarScene());
  sceneManager.registerScene(createCoordinatesScene());
  sceneManager.registerScene(createInvitationScene());
  sceneManager.registerScene(createRsvpScene());
  sceneManager.registerScene(createFinaleScene());
  enableCinematicTransitions(sceneManager);

  window.PolarisEngine = {
    autoPlay,
    backgroundMusic,
    eventConfig,
    sceneManager,
  };

  bindAutoPlayHoldControls(autoPlay);
  exposeStartJourneyFallback(sceneManager, autoPlay, backgroundMusic);

  sceneManager.showScene("opening").catch(showBootstrapError);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapPolarisEngine, { once: true });
} else {
  bootstrapPolarisEngine();
}
