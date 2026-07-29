import { createChristmasScene } from "./scenes/create-christmas-scene.js";

const scenes = [
  "opening", "countdown", "message", "details",
  "dress-code", "gallery", "rsvp", "closing",
];

export const sceneRegistry = scenes.map((id, index) => ({
  id,
  create: () => createChristmasScene(id),
  nextSceneId: scenes[index + 1] ?? null,
}));
