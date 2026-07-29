import { eventConfig } from "./config/event-config.js";
import { resourcesManifest } from "./resources-manifest.js";
import { sceneRegistry } from "./scene-registry.js";

export const santoriniBirthdayTemplate = {
  eventConfig,
  resources: resourcesManifest,
  runtime: {
    initialSceneId: "opening",
    journeySceneId: "welcome",
    transitionMs: 700,
    autoplay: { delayMs: 7000, retryDelayMs: 140, stopSceneId: "rsvp" },
    audio: resourcesManifest.audio.backgroundMusic,
  },
  sceneRegistry,
};
