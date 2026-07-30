export const resourcesManifest = {
  version: 1,
  audio: {
    backgroundMusic: {
      id: "background-music",
      type: "audio",
      src: null,
      mimeType: null,
      volume: 0.35,
      status: "pending-license-verification",
      required: false,
    },
  },
  branding: {
    name: "Peralta–Machado",
    stylesheet: "../../../../src/styles/peralta-machado.css",
  },
  images: [
    ["hero-portrait", "../../../../experiences/peralta-machado/assets/images/foto-5.webp"],
    ["gallery-portrait-01", "../../../../experiences/peralta-machado/assets/images/foto-3.webp"],
    ["gallery-portrait-02", "../../../../experiences/peralta-machado/assets/images/foto-1.webp"],
    ["gallery-portrait-03", "../../../../experiences/peralta-machado/assets/images/foto-4.webp"],
    ["gallery-portrait-04", "../../../../experiences/peralta-machado/assets/images/foto-5.webp"],
    ["paper-texture", "../../../../experiences/peralta-machado/assets/images/paper-texture.webp"],
  ].map(([id, src]) => ({ id, type: "image", src, mimeType: "image/webp", status: "authorized-local", required: true })),
  fonts: [
    ["display-regular", "Playfair Display", "../../../../experiences/peralta-machado/assets/fonts/playfair-display-400.woff2"],
    ["display-semibold", "Playfair Display", "../../../../experiences/peralta-machado/assets/fonts/playfair-display-600.woff2"],
    ["body-regular", "Montserrat", "../../../../experiences/peralta-machado/assets/fonts/montserrat-400.woff2"],
    ["body-semibold", "Montserrat", "../../../../experiences/peralta-machado/assets/fonts/montserrat-600.woff2"],
  ].map(([id, family, src]) => ({ id, type: "font", family, src, mimeType: "font/woff2", status: "licensed-local", required: true })),
};
