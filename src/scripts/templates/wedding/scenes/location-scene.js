import { createWeddingScene } from "./create-wedding-scene.js";

export function createLocationScene() {
  return createWeddingScene("location", "[data-wedding-next]");
}
