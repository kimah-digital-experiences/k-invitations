const STAR_SCENE_ID = "star";
const NEXT_SCENE_ID = "scene6";

export function createStarScene() {
  const root = document.querySelector("[data-scene='star']");
  const continueButton = document.querySelector("[data-continue-from-star]");

  return {
    id: STAR_SCENE_ID,
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
