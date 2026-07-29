const FINALE_SCENE_ID = "scene9";

export function createFinaleScene() {
  const root = document.querySelector("[data-scene='scene9']");

  return {
    id: FINALE_SCENE_ID,
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
