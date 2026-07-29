import { SceneManager } from "../core/scene-manager.js?v=16";
import { createAutoPlayController } from "./autoplay-controller.js";
import { createBackgroundMusicController } from "./audio-controller.js";
import { enableCinematicTransitions } from "./cinematic-transitions.js";

export function createPolarisEngine({ audio, autoplay, sceneRegistry, transitionMs }) {
  const sceneManager = new SceneManager();
  const autoPlay = createAutoPlayController(sceneManager, autoplay);
  const backgroundMusic = createBackgroundMusicController(audio);

  sceneRegistry.forEach(({ create, id, nextSceneId }) => {
    sceneManager.registerScene({ ...create(), id, nextSceneId });
  });

  enableCinematicTransitions(sceneManager, transitionMs);

  return { autoPlay, backgroundMusic, sceneManager };
}
