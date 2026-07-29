import { eventConfig } from "../config/event-config.js";

function setConfiguredResources(root) {
  root?.querySelectorAll("[data-event-image]").forEach((image) => {
    const [group, index] = image.dataset.eventImage.split(".");
    const resource = index === undefined
      ? eventConfig.images[group]
      : eventConfig.images[group]?.[Number(index)];
    if (resource) image.src = resource;
  });
}

function setConfiguredColors() {
  const variables = {
    aegean: "--blue",
    sea: "--sea",
    bougainvillea: "--pink",
    sunset: "--sun",
    limestone: "--ivory",
  };
  Object.entries(variables).forEach(([color, variable]) => {
    document.documentElement?.style.setProperty(variable, eventConfig.colors[color]);
  });
}

function setCountdown(root) {
  const target = new Date(eventConfig.countdownTarget).getTime();
  const remaining = Math.max(0, target - Date.now());
  const units = {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
  };
  Object.entries(units).forEach(([unit, value]) => {
    const output = root?.querySelector(`[data-countdown='${unit}']`);
    if (output) output.textContent = String(value).padStart(2, "0");
  });
}

function setLinks(root) {
  const mapLink = root?.querySelector("[data-location-link]");
  if (mapLink) mapLink.href = eventConfig.locationUrl;

  const rsvpLink = root?.querySelector("[data-rsvp-link]");
  if (rsvpLink) {
    rsvpLink.href = `https://wa.me/${eventConfig.rsvp.phone}?text=${encodeURIComponent(eventConfig.rsvp.message)}`;
  }
}

export function createSantoriniScene(sceneId) {
  const root = document.querySelector(`[data-scene='${sceneId}']`);

  return {
    id: sceneId,
    init({ sceneManager }) {
      setConfiguredColors();
      setConfiguredResources(root);
      setLinks(root);
      root?.querySelector("[data-next-scene]")
        ?.addEventListener("click", () => sceneManager.nextScene());
    },
    enter() {
      setCountdown(root);
      root?.removeAttribute("hidden");
      window.requestAnimationFrame(() => root?.classList.add("is-revealed"));
    },
    exit() {
      root?.setAttribute("hidden", "");
      root?.classList.remove("is-revealed");
    },
  };
}
