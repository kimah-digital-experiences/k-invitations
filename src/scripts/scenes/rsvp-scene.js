const RSVP_SCENE_ID = "scene8";
const NEXT_SCENE_ID = "scene9";

export function createRsvpScene() {
  const root = document.querySelector("[data-scene='scene8']");
  const confirmButton = document.querySelector("[data-confirm-presence]");

  return {
    id: RSVP_SCENE_ID,
    nextSceneId: NEXT_SCENE_ID,
    init({ sceneManager }) {
      confirmButton?.addEventListener("click", () => {
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
