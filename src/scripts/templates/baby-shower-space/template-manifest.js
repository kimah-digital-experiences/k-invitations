import { eventConfig } from "./config/event-config.js?v=18";
import { resourcesManifest } from "./resources-manifest.js";
import { sceneRegistry } from "./scene-registry.js";

export const babyShowerSpaceTemplate = {
  eventConfig,
  resources: resourcesManifest,
  runtime: {
    initialSceneId: "opening",
    journeySceneId: "benjamin",
    transitionMs: 600,
    autoplay: {
      delayMs: 4000,
      retryDelayMs: 120,
      stopSceneId: "scene8",
    },
    audio: resourcesManifest.audio.backgroundMusic,
  },
  sceneRegistry,
};
