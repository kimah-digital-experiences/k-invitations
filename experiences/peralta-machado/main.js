import { eventConfig } from "../../src/scripts/templates/peralta-machado/config/event-config.js";

const page = document.documentElement;
const opening = document.querySelector("[data-scene='opening']");
const openButton = document.querySelector("[data-open-invitation]");
const journey = document.querySelector("[data-scene='hero']");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function hydrateDocument() {
  document.title = eventConfig.document.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", eventConfig.document.description);
  document.querySelector("main.experience")?.setAttribute("aria-label", eventConfig.document.ariaLabel);
  document.querySelectorAll("[data-event-field]").forEach((element) => {
    const value = eventConfig.content[element.dataset.eventField];
    if (value) element.textContent = value;
  });
}

function revealOnScroll() {
  const sections = document.querySelectorAll("[data-scene]:not([data-scene='opening'])");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -12%", threshold: 0.08 });
  sections.forEach((section) => observer.observe(section));
}

function openInvitation() {
  opening.classList.add("is-opening");
  page.classList.remove("invitation-is-locked");
  window.setTimeout(() => {
    opening.hidden = true;
    journey.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    journey.querySelector("[data-scene-focus]")?.focus({ preventScroll: true });
  }, reducedMotion.matches ? 0 : 650);
}

hydrateDocument();
revealOnScroll();
page.classList.add("invitation-is-locked");
openButton?.addEventListener("click", openInvitation, { once: true });
