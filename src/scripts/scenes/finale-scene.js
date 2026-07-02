import { eventConfig } from "../config/event-config.js?v=12";

const FINALE_SCENE_ID = "scene9";

export function createFinaleScene() {
  const root = document.querySelector("[data-scene='scene9']");
  const giftTitle = document.querySelector("[data-event-field='giftTitle']");
  const giftText = document.querySelector("[data-event-field='giftText']");

  function hydrateGiftPreferences() {
    if (giftTitle) {
      giftTitle.textContent = eventConfig.gifts.title;
    }

    if (giftText) {
      giftText.textContent = eventConfig.gifts.text;
    }
  }

  return {
    id: FINALE_SCENE_ID,
    enter() {
      if (!root) {
        return;
      }

      hydrateGiftPreferences();
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
