const INVITATION_SCENE_ID = "scene7";
const NEXT_SCENE_ID = "scene8";

export function createInvitationScene() {
  const root = document.querySelector("[data-scene='scene7']");
  const continueButton = document.querySelector("[data-continue-from-invitation]");

  return {
    id: INVITATION_SCENE_ID,
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
