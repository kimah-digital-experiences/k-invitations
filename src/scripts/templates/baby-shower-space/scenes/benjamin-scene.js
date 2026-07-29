const BENJAMIN_SCENE_ID = "benjamin";
const NEXT_SCENE_ID = "signal";

export function createBenjaminScene() {
  const root = document.querySelector("[data-scene='benjamin']");
  const continueButton = document.querySelector("[data-continue-from-benjamin]");

  return {
    id: BENJAMIN_SCENE_ID,
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
