function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getSceneElement(sceneId) {
  return document.querySelector(`[data-scene='${sceneId}']`);
}

function resetSceneTransition(sceneElement) {
  sceneElement?.classList.remove(
    "is-scene-transition-leaving",
    "is-scene-transition-entering",
    "is-scene-transition-active",
  );
}

function nextAnimationFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(resolve);
  });
}

export function enableCinematicTransitions(sceneManager, transitionMs) {
  const showScene = sceneManager.showScene.bind(sceneManager);

  sceneManager.showScene = async function showSceneWithTransition(sceneId, context = {}) {
    const currentSceneId = sceneManager.getCurrentSceneId?.();
    const isInitialRender = !currentSceneId;

    if (isInitialRender || currentSceneId === sceneId || sceneManager.isTransitioning?.()) {
      return showScene(sceneId, context);
    }

    const leavingScene = getSceneElement(currentSceneId);
    const enteringScene = getSceneElement(sceneId);

    resetSceneTransition(leavingScene);
    resetSceneTransition(enteringScene);

    if (leavingScene) {
      leavingScene.classList.add("is-scene-transition-leaving");
      await wait(transitionMs);
    }

    if (enteringScene) {
      enteringScene.classList.add("is-scene-transition-entering");
    }

    const didShow = await showScene(sceneId, context);
    resetSceneTransition(leavingScene);

    if (!didShow) {
      resetSceneTransition(enteringScene);
      return false;
    }

    if (enteringScene) {
      await nextAnimationFrame();
      enteringScene.classList.add("is-scene-transition-active");
      await wait(transitionMs);
      resetSceneTransition(enteringScene);
    }

    return true;
  };
}
