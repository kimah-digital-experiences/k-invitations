const OPENING_SCENE_ID = "opening";
const NEXT_SCENE_ID = "benjamin";
const TRANSITION_DURATION_MS = 1700;

export function createOpeningScene() {
  const root = document.querySelector("[data-scene='opening']");
  const startButton = document.querySelector("[data-start-journey]");
  const transitionStatus = document.querySelector("[data-transition-status]");
  const mvpMessage = document.querySelector("[data-mvp-message]");
  let transitionTimer;
  let isNavigating = false;

  function setTransitionStatus(message) {
    if (transitionStatus) {
      transitionStatus.textContent = message;
    }
  }

  function clearTransitionStatus() {
    setTransitionStatus("");
  }

  function waitForIdleSceneManager(sceneManager) {
    if (!sceneManager?.isTransitioning?.()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      window.setTimeout(resolve, 120);
    });
  }

  function showTemporaryMvpState() {
    if (!root || !startButton || !transitionStatus || !mvpMessage) {
      return Promise.resolve();
    }

    window.clearTimeout(transitionTimer);
    root.classList.add("is-preparing-transition");
    startButton.classList.add("is-transitioning");
    startButton.textContent = "Continuar viaje";
    mvpMessage.hidden = false;
    mvpMessage.classList.add("is-visible");
    transitionStatus.textContent =
      "El viaje continuará en la siguiente escena durante el desarrollo del MVP.";

    return new Promise((resolve) => {
      transitionTimer = window.setTimeout(() => {
        root.classList.remove("is-preparing-transition");
        startButton.classList.remove("is-transitioning");
        resolve();
      }, TRANSITION_DURATION_MS);
    });
  }

  async function startJourney(sceneManager) {
    if (isNavigating) {
      return;
    }

    isNavigating = true;

    try {
      await waitForIdleSceneManager(sceneManager);

      const didAdvance = await sceneManager.nextScene();

      if (didAdvance) {
        clearTransitionStatus();
        return;
      }

      setTransitionStatus("Preparando viaje...");

      const didFallbackAdvance = await sceneManager.showScene(NEXT_SCENE_ID, {
        direction: "forward",
      });

      if (!didFallbackAdvance) {
        setTransitionStatus("No se pudo iniciar el viaje. Recarga la página.");
      } else {
        clearTransitionStatus();
      }
    } catch {
      setTransitionStatus("No se pudo iniciar el viaje. Recarga la página.");
    } finally {
      isNavigating = false;
    }
  }

  return {
    id: OPENING_SCENE_ID,
    nextSceneId: NEXT_SCENE_ID,
    init({ sceneManager }) {
      startButton?.addEventListener("click", () => {
        startJourney(sceneManager);
      });
    },
    enter() {
      root?.removeAttribute("hidden");
    },
    exit() {
      root?.setAttribute("hidden", "");
    },
    onMissingNextScene: showTemporaryMvpState,
  };
}
