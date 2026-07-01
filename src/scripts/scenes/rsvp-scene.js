import { eventConfig } from "../config/event-config.js?v=9";

const RSVP_SCENE_ID = "scene8";
const NEXT_SCENE_ID = "scene9";

export function createRsvpScene() {
  const root = document.querySelector("[data-scene='scene8']");
  const confirmButton = document.querySelector("[data-confirm-presence]");

  function prepareRsvpMessages() {
    if (!confirmButton) {
      return;
    }

    confirmButton.dataset.rsvpPhone = eventConfig.rsvp.phone;
    confirmButton.dataset.rsvpAffirmativeMessage = eventConfig.rsvp.affirmativeMessage;
    confirmButton.dataset.rsvpNegativeMessage = eventConfig.rsvp.negativeMessage;
  }

  return {
    id: RSVP_SCENE_ID,
    nextSceneId: NEXT_SCENE_ID,
    init({ sceneManager }) {
      confirmButton?.addEventListener("click", () => {
        sceneManager.nextScene();
      });
    },
    enter() {
      if (!root) {
        return;
      }

      prepareRsvpMessages();
      root.removeAttribute("hidden");
      root.classList.remove("is-revealed");

      window.requestAnimationFrame(() => {
        root.classList.add("is-revealed");
      });
    },
    exit() {
      root?.setAttribute("hidden", "");
      root?.classList.remove("is-revealed");
    },
  };
}
