const BENJAMIN_SCENE_ID = "benjamin";

export function createBenjaminScene() {
  const root = document.querySelector("[data-scene='benjamin']");

  return {
    id: BENJAMIN_SCENE_ID,
    init() {},
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
