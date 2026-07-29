const SIGNAL_SCENE_ID = "signal";
const NEXT_SCENE_ID = "star";

export function createSignalScene() {
  const root = document.querySelector("[data-scene='signal']");
  const continueButton = document.querySelector("[data-continue-from-signal]");

  return {
    id: SIGNAL_SCENE_ID,
    nextSceneId: NEXT_SCENE_ID,
    init({ sceneManager }) {
      continueButton?.addEventListener("click", () => {
        sceneManager.nextScene();
      });
    },
    enter() {
      if (!root) {
        return;
      }

      root.removeAttribute("hidden");
      root.classList.remove("is-revealed");

      window.requestAnimationFrame(() => {
        root.classList.add("is-revealed");
      });
    },
    exit() {
      root?.setAttribute("hidden", "");
      root?.classList.remove("is-revealed");
    },
  };
}
