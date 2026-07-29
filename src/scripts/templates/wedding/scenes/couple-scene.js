import { createWeddingScene } from "./create-wedding-scene.js";

export function createCoupleScene() {
  return createWeddingScene("couple", "[data-wedding-next]");
}
