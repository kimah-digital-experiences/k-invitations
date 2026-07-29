const SCENE_ID = "opening";

export function createOpeningScene() {
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
