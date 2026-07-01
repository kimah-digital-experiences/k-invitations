const INVITATION_SCENE_ID = "scene7";

export function createInvitationScene() {
  const root = document.querySelector("[data-scene='scene7']");

  return {
    id: INVITATION_SCENE_ID,
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
