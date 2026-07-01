import { eventConfig } from "../config/event-config.js?v=9";

const COORDINATES_SCENE_ID = "scene6";
const NEXT_SCENE_ID = "scene7";

export function createCoordinatesScene() {
  const root = document.querySelector("[data-scene='scene6']");
  const continueButton = document.querySelector("[data-continue-from-coordinates]");
  const title = document.querySelector("[data-event-field='eventTitle']");
  const time = document.querySelector("[data-event-field='eventTime']");
  const location = document.querySelector("[data-event-field='eventLocation']");
  const hosts = document.querySelector("[data-event-field='hosts']");

  function hydrateEventDetails() {
    if (title) {
      title.textContent = `${eventConfig.eventType} de ${eventConfig.babyName}`;
    }

    if (time) {
      time.textContent = eventConfig.time;
    }

    if (location) {
      location.textContent = eventConfig.location.name;
    }

    if (hosts) {
      hosts.textContent = eventConfig.hosts;
    }
  }

  return {
    id: COORDINATES_SCENE_ID,
    nextSceneId: NEXT_SCENE_ID,
    init({ sceneManager }) {
      continueButton?.addEventListener("click", () => {
        sceneManager.nextScene();
      });
    },
    enter() {
      if (!root) {
        return;
      }

      hydrateEventDetails();
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
