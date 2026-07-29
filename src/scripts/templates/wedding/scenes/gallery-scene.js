import { createWeddingScene } from "./create-wedding-scene.js";

export function createGalleryScene() {
  return createWeddingScene("gallery", "[data-wedding-next]");
}
