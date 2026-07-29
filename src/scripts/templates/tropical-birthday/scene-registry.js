import { createTropicalScene } from "./scenes/create-tropical-scene.js";

const scenes = [
  "opening", "countdown", "message", "details",
  "dress-code", "gallery", "rsvp", "closing",
];

export const sceneRegistry = scenes.map((id, index) => ({
  id,
  create: () => createTropicalScene(id),
  nextSceneId: scenes[index + 1] ?? null,
}));
