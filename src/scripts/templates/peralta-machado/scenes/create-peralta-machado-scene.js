export function createPeraltaMachadoScene(sceneId) {
  let root;

  function prepareContinuousJourney() {
    const experience = document.querySelector(".peralta-machado");
    const sections = document.querySelectorAll(".peralta-machado [data-scene]");

    sections.forEach((section, index) => {
      if (index > 0) section.removeAttribute("hidden");
    });
    experience?.setAttribute("data-invitation-state", "open");
    document.documentElement?.classList.remove("peralta-machado-is-gated");

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion && "IntersectionObserver" in window) {
      experience?.setAttribute("data-motion-ready", "");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -12%", threshold: 0.12 });
      sections.forEach((section) => observer.observe(section));
    } else {
      sections.forEach((section) => section.classList.add("is-in-view"));
    }
  }

  return {
    id: sceneId,
    init() {
      root = document.querySelector(`[data-scene='${sceneId}']`);
      if (sceneId === "opening") {
        document.documentElement?.classList.add("peralta-machado-is-gated");
      }
    },
    enter() {
      if (!root) return;

      root.removeAttribute("hidden");
      window.requestAnimationFrame(() => root.classList.add("is-revealed"));
      if (sceneId === "opening") {
        root.querySelector("[data-scene-focus]")?.focus({ preventScroll: true });
      } else if (sceneId === "hero") {
        prepareContinuousJourney();
        root.querySelector("[data-scene-focus]")?.focus({ preventScroll: true });
        root.scrollIntoView?.({ block: "start" });
      }
    },
    exit() {
      if (sceneId === "opening") root?.setAttribute("hidden", "");
    },
  };
}
