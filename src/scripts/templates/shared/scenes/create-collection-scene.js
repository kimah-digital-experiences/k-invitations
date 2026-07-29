function setConfiguredResources(root, images) {
  root?.querySelectorAll("[data-event-image]").forEach((image) => {
    const [group, index] = image.dataset.eventImage.split(".");
    const resource = index === undefined ? images[group] : images[group]?.[Number(index)];
    if (resource) image.src = resource;
  });
}

function setConfiguredColors(colors, colorVariables) {
  Object.entries(colorVariables).forEach(([color, variable]) => {
    const value = colors[color];
    if (value) document.documentElement?.style.setProperty(variable, value);
  });
}

function setCountdown(root, countdownTarget) {
  const remaining = Math.max(0, new Date(countdownTarget).getTime() - Date.now());
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

function setLinks(root, eventConfig) {
  const mapLink = root?.querySelector("[data-location-link]");
  if (mapLink) mapLink.href = eventConfig.locationUrl;

  const rsvpLink = root?.querySelector("[data-rsvp-link]");
  if (rsvpLink) {
    const message = encodeURIComponent(eventConfig.rsvp.message);
    rsvpLink.href = `https://wa.me/${eventConfig.rsvp.phone}?text=${message}`;
  }
}

export function createCollectionScene(sceneId, eventConfig, colorVariables) {
  const root = document.querySelector(`[data-scene='${sceneId}']`);

  return {
    id: sceneId,
    init({ sceneManager }) {
      setConfiguredColors(eventConfig.colors, colorVariables);
      setConfiguredResources(root, eventConfig.images);
      setLinks(root, eventConfig);
      root?.querySelector("[data-next-scene]")
        ?.addEventListener("click", () => sceneManager.nextScene());
    },
    enter() {
      setCountdown(root, eventConfig.countdownTarget);
      root?.removeAttribute("hidden");
      window.requestAnimationFrame(() => root?.classList.add("is-revealed"));
    },
    exit() {
      root?.setAttribute("hidden", "");
      root?.classList.remove("is-revealed");
    },
  };
}
