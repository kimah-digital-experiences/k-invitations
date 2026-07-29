const SCENE_ID = "closing";

export function createClosingScene() {
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
