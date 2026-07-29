const SCENE_ID = "message";

export function createMessageScene() {
  const root = document.querySelector(`[data-scene='${SCENE_ID}']`);

  return {
    id: SCENE_ID,
    enter() {
      root?.removeAttribute("hidden");
    },
    exit() {
      root?.setAttribute("hidden", "");
    },
  };
}
