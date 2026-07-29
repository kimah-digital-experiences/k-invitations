import { eventConfig } from "./config/event-config.js";

export const resourcesManifest = {
  audio: { backgroundMusic: eventConfig.music },
  branding: {
    collection: "Mediterranean Collection",
    name: "Santorini Birthday",
    stylesheet: "../../src/styles/santorini-birthday.css",
    colors: eventConfig.colors,
  },
  images: eventConfig.images,
};
