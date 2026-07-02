import { eventConfig } from "../config/event-config.js?v=11";

const RSVP_SCENE_ID = "scene8";
const NEXT_SCENE_ID = "scene9";

export function createRsvpScene() {
  const root = document.querySelector("[data-scene='scene8']");
  const responseButtons = Array.from(document.querySelectorAll("[data-rsvp-response]"));
  const giftMessage = root?.querySelector(".rsvp-actions + .rsvp-note");

  function formatWhatsappPhone(phone) {
    return phone.replace(/\D/g, "");
  }

  function buildWhatsappUrl(message) {
    const phone = formatWhatsappPhone(eventConfig.rsvp.phone);

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  function prepareRsvpMessages() {
    responseButtons.forEach((button) => {
      const message =
        button.dataset.rsvpResponse === "no"
          ? eventConfig.rsvp.negativeMessage
          : eventConfig.rsvp.affirmativeMessage;

      button.dataset.rsvpPhone = eventConfig.rsvp.phone;
      button.dataset.rsvpMessage = message;
      button.dataset.rsvpUrl = buildWhatsappUrl(message);
    });
  }

  function hydrateGiftMessage() {
    if (!giftMessage) {
      return;
    }

    giftMessage.replaceChildren();

    const title = document.createElement("strong");
    title.textContent = eventConfig.gifts.title;

    const lineBreak = document.createElement("br");
    const copy = document.createTextNode(eventConfig.gifts.text);

    giftMessage.append(title, lineBreak, copy);
  }

  return {
    id: RSVP_SCENE_ID,
    nextSceneId: NEXT_SCENE_ID,
    init({ sceneManager }) {
      responseButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const message = button.dataset.rsvpMessage || eventConfig.rsvp.affirmativeMessage;
          const whatsappUrl = button.dataset.rsvpUrl || buildWhatsappUrl(message);

          try {
            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
          } finally {
            sceneManager.nextScene();
          }
        });
      });
    },
    enter() {
      if (!root) {
        return;
      }

      prepareRsvpMessages();
      hydrateGiftMessage();
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
