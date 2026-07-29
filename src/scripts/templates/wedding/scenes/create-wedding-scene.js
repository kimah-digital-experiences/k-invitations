export function createWeddingScene(sceneId, actionSelector) {
  const root = document.querySelector(`[data-scene='${sceneId}']`);
  const action = actionSelector ? document.querySelector(actionSelector) : null;

  return {
    id: sceneId,
    init({ sceneManager }) {
      action?.addEventListener("click", () => sceneManager.nextScene());
    },
    enter() {
      if (!root) return;
      root.removeAttribute("hidden");
      window.requestAnimationFrame(() => root.classList.add("is-revealed"));
    },
    exit() {
      root?.setAttribute("hidden", "");
      root?.classList.remove("is-revealed");
    },
  };
}
