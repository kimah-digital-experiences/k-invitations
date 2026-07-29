import { createWeddingScene } from "./create-wedding-scene.js";

export function createRsvpScene() {
  return createWeddingScene("rsvp", "[data-wedding-next]");
}
