import { createCollectionScene } from "../../shared/scenes/create-collection-scene.js";
import { eventConfig } from "../config/event-config.js";

const colorVariables = {
  turquoise: "--turquoise",
  palm: "--palm",
  sand: "--sand",
  coral: "--coral",
  white: "--white",
};

export function createTropicalScene(sceneId) {
  return createCollectionScene(sceneId, eventConfig, colorVariables);
}
