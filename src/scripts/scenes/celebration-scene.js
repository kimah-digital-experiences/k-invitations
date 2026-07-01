const CELEBRATION_SCENE_ID = "scene5";
const NEXT_SCENE_ID = "scene6";

export function createCelebrationScene() {
  const root = document.querySelector("[data-scene='scene5']");
  const continueButton = document.querySelector("[data-continue-from-celebration]");

  return {
    id: CELEBRATION_SCENE_ID,
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
