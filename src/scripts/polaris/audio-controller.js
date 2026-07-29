export function createBackgroundMusicController({ src, volume }) {
  let audio;
  let isUnavailable = false;

  function ensureAudio() {
    if (!audio) {
      audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = volume;
    }

    return audio;
  }

  function start() {
    if (isUnavailable) {
      return;
    }

    const backgroundMusic = ensureAudio();
    const playAttempt = backgroundMusic.play();

    if (playAttempt?.catch) {
      playAttempt.catch((error) => {
        if (backgroundMusic.error || error?.name === "NotSupportedError") {
          isUnavailable = true;
        }
      });
    }
  }

  return { start };
}
