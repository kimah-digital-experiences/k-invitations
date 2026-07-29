import { createSantoriniScene } from "./scenes/create-santorini-scene.js";

const scenes = [
  "opening", "welcome", "birthday", "quote", "details",
  "dress-code", "countdown", "gallery", "rsvp", "closing",
];

export const sceneRegistry = scenes.map((id, index) => ({
  id,
  create: () => createSantoriniScene(id),
  nextSceneId: scenes[index + 1] ?? null,
}));
