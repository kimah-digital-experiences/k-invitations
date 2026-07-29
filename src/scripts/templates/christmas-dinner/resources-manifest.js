import { eventConfig } from "./config/event-config.js";

export const resourcesManifest = {
  audio: { backgroundMusic: eventConfig.music },
  branding: {
    collection: "Christmas Collection",
    name: "Christmas Dinner",
    stylesheet: "../../src/styles/christmas-dinner.css",
    colors: eventConfig.colors,
  },
  images: eventConfig.images,
};
