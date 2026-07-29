const COORDINATES_SCENE_ID = "scene6";
const NEXT_SCENE_ID = "scene7";

export function createCoordinatesScene() {
  const root = document.querySelector("[data-scene='scene6']");
  const continueButton = document.querySelector("[data-continue-from-coordinates]");
  return {
    id: COORDINATES_SCENE_ID,
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
