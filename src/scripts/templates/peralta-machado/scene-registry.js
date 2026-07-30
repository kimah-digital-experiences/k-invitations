import { createPeraltaMachadoScene } from "./scenes/create-peralta-machado-scene.js";

const narrative = [
  "opening",
  "hero",
  "date",
  "venues",
  "gallery",
  "itinerary",
  "guidance",
  "rsvp",
  "closing",
];

export const sceneRegistry = narrative.map((id, index) => ({
  id,
  create: () => createPeraltaMachadoScene(id),
  nextSceneId: narrative[index + 1] ?? null,
}));
