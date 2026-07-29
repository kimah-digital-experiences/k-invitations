import { createCollectionScene } from "../../shared/scenes/create-collection-scene.js";
import { eventConfig } from "../config/event-config.js";

const colorVariables = {
  forest: "--forest",
  burgundy: "--burgundy",
  gold: "--gold",
  ivory: "--ivory",
  midnight: "--midnight",
};

export function createChristmasScene(sceneId) {
  return createCollectionScene(sceneId, eventConfig, colorVariables);
}
