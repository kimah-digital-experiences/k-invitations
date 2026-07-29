import { eventConfig } from "./config/event-config.js";

export const resourcesManifest = {
  audio: { backgroundMusic: eventConfig.music },
  branding: {
    collection: "Tropical Collection",
    name: "Tropical Birthday",
    stylesheet: "../../src/styles/tropical-birthday.css",
    colors: eventConfig.colors,
  },
  images: eventConfig.images,
};
