import { eventConfig } from "./config/event-config.js";
import { resourcesManifest } from "./resources-manifest.js";
import { sceneRegistry } from "./scene-registry.js";

export const christmasDinnerTemplate = {
  eventConfig,
  resources: resourcesManifest,
  runtime: {
    initialSceneId: "opening",
    journeySceneId: "countdown",
    transitionMs: 850,
    autoplay: { delayMs: 7500, retryDelayMs: 140, stopSceneId: "rsvp" },
    audio: resourcesManifest.audio.backgroundMusic,
  },
  sceneRegistry,
};
