import { eventConfig } from "./config/event-config.js";
import { resourcesManifest } from "./resources-manifest.js";
import { sceneRegistry } from "./scene-registry.js";

export const peraltaMachadoTemplate = {
  eventConfig,
  resources: resourcesManifest,
  runtime: {
    initialSceneId: "opening",
    journeySceneId: "hero",
    transitionMs: 500,
    autoplay: {
      delayMs: 5000,
      retryDelayMs: 120,
      stopSceneId: "rsvp",
    },
    audio: resourcesManifest.audio.backgroundMusic,
  },
  sceneRegistry,
};
