import { createOpeningScene } from "./scenes/opening-scene.js";
import { createCoupleScene } from "./scenes/couple-scene.js";
import { createStoryScene } from "./scenes/story-scene.js";
import { createDateScene } from "./scenes/date-scene.js";
import { createLocationScene } from "./scenes/location-scene.js";
import { createGalleryScene } from "./scenes/gallery-scene.js";
import { createRsvpScene } from "./scenes/rsvp-scene.js";
import { createClosingScene } from "./scenes/closing-scene.js";

export const sceneRegistry = [
  { id: "opening", create: createOpeningScene, nextSceneId: "couple" },
  { id: "couple", create: createCoupleScene, nextSceneId: "story" },
  { id: "story", create: createStoryScene, nextSceneId: "date" },
  { id: "date", create: createDateScene, nextSceneId: "location" },
  { id: "location", create: createLocationScene, nextSceneId: "gallery" },
  { id: "gallery", create: createGalleryScene, nextSceneId: "rsvp" },
  { id: "rsvp", create: createRsvpScene, nextSceneId: "closing" },
  { id: "closing", create: createClosingScene, nextSceneId: null },
];
