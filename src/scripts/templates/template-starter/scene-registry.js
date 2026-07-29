import { createClosingScene } from "./scenes/closing-scene.js";
import { createMessageScene } from "./scenes/message-scene.js";
import { createOpeningScene } from "./scenes/opening-scene.js";

export const sceneRegistry = [
  {
    id: "opening",
    create: createOpeningScene,
    nextSceneId: "message",
  },
  {
    id: "message",
    create: createMessageScene,
    nextSceneId: "closing",
  },
  {
    id: "closing",
    create: createClosingScene,
    nextSceneId: null,
  },
];
