import { eventConfig } from "./config/event-config.js";
import { resourcesManifest } from "./resources-manifest.js";
import { sceneRegistry } from "./scene-registry.js";

export const templateStarter = {
  eventConfig,
  resources: resourcesManifest,
  runtime: {
    initialSceneId: "opening",
    journeySceneId: "message",
    transitionMs: 300,
    autoplay: {
      delayMs: 3000,
      retryDelayMs: 100,
      stopSceneId: "closing",
    },
    audio: resourcesManifest.audio.backgroundMusic,
  },
  sceneRegistry,
};
