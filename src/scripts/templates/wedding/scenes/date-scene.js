import { createWeddingScene } from "./create-wedding-scene.js";

export function createDateScene() {
  return createWeddingScene("date", "[data-wedding-next]");
}
