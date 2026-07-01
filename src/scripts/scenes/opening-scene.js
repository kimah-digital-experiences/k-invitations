const OPENING_SCENE_ID = "opening";
const NEXT_SCENE_ID = "benjamin";
const TRANSITION_DURATION_MS = 1700;

export function createOpeningScene() {
  const root = document.querySelector("[data-scene='opening']");
  const startButton = document.querySelector("[data-start-journey]");
  const transitionStatus = document.querySelector("[data-transition-status]");
  const mvpMessage = document.querySelector("[data-mvp-message]");
  let transitionTimer;

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

  return {
    id: OPENING_SCENE_ID,
    nextSceneId: NEXT_SCENE_ID,
    init({ sceneManager }) {
      startButton?.addEventListener("click", () => {
        sceneManager.nextScene();
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
