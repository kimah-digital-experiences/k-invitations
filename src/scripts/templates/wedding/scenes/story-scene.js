import { createWeddingScene } from "./create-wedding-scene.js";

export function createStoryScene() {
  return createWeddingScene("story", "[data-wedding-next]");
}
