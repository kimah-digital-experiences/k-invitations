export function createAutoPlayController(sceneManager, {
  delayMs,
  retryDelayMs,
  stopSceneId,
}) {
  let isRunning = false;
  let isPaused = false;
  let timerId;
  let targetTime = 0;
  let remainingDelay = delayMs;

  function clearTimer() {
    window.clearTimeout(timerId);
    timerId = null;
  }

  function isAtStopScene() {
    return sceneManager.getCurrentSceneId?.() === stopSceneId;
  }

  function stop() {
    isRunning = false;
    isPaused = false;
    remainingDelay = delayMs;
    clearTimer();
  }

  function scheduleNext(delay = delayMs) {
    clearTimer();

    if (!isRunning || isPaused) {
      return;
    }

    if (isAtStopScene()) {
      stop();
      return;
    }

    targetTime = Date.now() + delay;
    timerId = window.setTimeout(advance, delay);
  }

  async function advance() {
    clearTimer();

    if (!isRunning || isPaused) {
      return;
    }

    if (sceneManager.isTransitioning?.()) {
      scheduleNext(retryDelayMs);
      return;
    }

    if (isAtStopScene()) {
      stop();
      return;
    }

    const didAdvance = await sceneManager.nextScene({ direction: "forward" });

    if (!didAdvance || isAtStopScene()) {
      stop();
      return;
    }

    scheduleNext();
  }

  function start() {
    isRunning = true;
    isPaused = false;
    remainingDelay = delayMs;
    scheduleNext();
  }

  function pause() {
    if (!isRunning || isPaused) {
      return;
    }

    remainingDelay = Math.max(0, targetTime - Date.now());
    isPaused = true;
    clearTimer();
  }

  function resume() {
    if (!isRunning || !isPaused) {
      return;
    }

    isPaused = false;
    scheduleNext(remainingDelay || delayMs);
  }

  return { start, stop, pause, resume };
}

export function bindAutoPlayHoldControls(autoPlay) {
  const experience = document.querySelector(".experience") ?? document.body;

  ["pointerdown", "touchstart"].forEach((eventName) => {
    experience.addEventListener(eventName, () => {
      autoPlay.pause();
    }, { passive: true });
  });

  ["pointerup", "pointercancel", "touchend", "touchcancel"].forEach((eventName) => {
    experience.addEventListener(eventName, () => {
      autoPlay.resume();
    }, { passive: true });
  });
}
