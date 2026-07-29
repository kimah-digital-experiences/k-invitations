const OPENING_SCENE_ID = "opening";
const NEXT_SCENE_ID = "benjamin";
const TRANSITION_DURATION_MS = 1700;
const FALLBACK_DELAY_MS = 2000;

export function createOpeningScene() {
  const root = document.querySelector("[data-scene='opening']");
  const startButton = document.querySelector("[data-start-journey]");
  const transitionStatus = document.querySelector("[data-transition-status]");
  const mvpMessage = document.querySelector("[data-mvp-message]");
  let transitionTimer;
  let fallbackTimer;
  let isFallbackActive = false;
  let isStarting = false;

  function setTransitionStatus(message) {
    if (transitionStatus) {
      transitionStatus.textContent = message;
    }
  }

  function clearTransitionStatus() {
    setTransitionStatus("");
  }

  function isBenjaminVisible(sceneManager) {
    const nextScene = document.querySelector(`[data-scene='${NEXT_SCENE_ID}']`);

    return (
      sceneManager?.getCurrentSceneId?.() === NEXT_SCENE_ID ||
      (nextScene ? !nextScene.hasAttribute("hidden") : false)
    );
  }

  function disableStatusFallback() {
    if (!transitionStatus) {
      return;
    }

    isFallbackActive = false;
    transitionStatus.setAttribute("role", "status");
    transitionStatus.removeAttribute("tabindex");
    transitionStatus.removeAttribute("data-start-fallback");
  }

  function enableStatusFallback(sceneManager) {
    if (!transitionStatus || isFallbackActive) {
      return;
    }

    isFallbackActive = true;
    transitionStatus.textContent = "Si no avanza, toca aquí para continuar";
    transitionStatus.setAttribute("role", "button");
    transitionStatus.setAttribute("tabindex", "0");
    transitionStatus.setAttribute("data-start-fallback", "true");

    function showBenjaminDirectly(event) {
      event?.preventDefault?.();
      sceneManager.showScene(NEXT_SCENE_ID, { direction: "forward" });
    }

    ["click", "pointerup", "touchend"].forEach((eventName) => {
      transitionStatus.addEventListener(eventName, showBenjaminDirectly, {
        once: true,
        passive: false,
      });
    });
    transitionStatus.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        sceneManager.showScene(NEXT_SCENE_ID, { direction: "forward" });
      }
    }, { once: true });
  }

  function clearFallbackTimer() {
    window.clearTimeout(fallbackTimer);
  }

  function scheduleFallback(sceneManager) {
    clearFallbackTimer();

    fallbackTimer = window.setTimeout(() => {
      if (!isBenjaminVisible(sceneManager)) {
        enableStatusFallback(sceneManager);
      }
    }, FALLBACK_DELAY_MS);
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

  async function startJourney(sceneManager, event) {
    event?.preventDefault?.();

    if (isStarting || sceneManager?.getCurrentSceneId?.() !== OPENING_SCENE_ID) {
      return;
    }

    isStarting = true;
    disableStatusFallback();
    setTransitionStatus("Iniciando viaje...");
    scheduleFallback(sceneManager);

    try {
      await waitForIdleSceneManager(sceneManager);

      const didAdvance = await sceneManager.nextScene();

      if (didAdvance) {
        clearFallbackTimer();
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
        clearFallbackTimer();
        clearTransitionStatus();
      }
    } catch {
      setTransitionStatus("No se pudo iniciar el viaje. Recarga la página.");
    } finally {
      isStarting = false;
    }
  }

  return {
    id: OPENING_SCENE_ID,
    nextSceneId: NEXT_SCENE_ID,
    init({ sceneManager }) {
      ["click", "pointerup", "touchend"].forEach((eventName) => {
        startButton?.addEventListener(eventName, (event) => {
          if (window.startPolarisJourney) {
            window.startPolarisJourney(event);
            return;
          }

          startJourney(sceneManager, event);
        }, { passive: false });
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
