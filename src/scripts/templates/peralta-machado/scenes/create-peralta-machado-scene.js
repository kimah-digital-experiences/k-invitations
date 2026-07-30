export function createPeraltaMachadoScene(sceneId) {
  let root;

  return {
    id: sceneId,
    init({ sceneManager }) {
      root = document.querySelector(`[data-scene='${sceneId}']`);
      root?.querySelector("[data-next-scene]")?.addEventListener(
        "click",
        () => sceneManager.nextScene(),
      );
    },
    enter() {
      if (!root) return;

      root.removeAttribute("hidden");
      window.requestAnimationFrame(() => root.classList.add("is-revealed"));
      root.querySelector("[data-scene-focus]")?.focus({ preventScroll: true });
    },
    exit() {
      root?.setAttribute("hidden", "");
      root?.classList.remove("is-revealed");
    },
  };
}
