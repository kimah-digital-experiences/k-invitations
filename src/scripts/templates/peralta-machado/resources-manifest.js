const silentAudio =
  "data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAACAgICAgICAgA==";

export const resourcesManifest = {
  version: 1,
  audio: {
    backgroundMusic: {
      id: "background-music",
      type: "audio",
      src: silentAudio,
      mimeType: "audio/wav",
      volume: 0,
      status: "placeholder",
      required: false,
    },
  },
  branding: {
    name: "Peralta–Machado",
    stylesheet: null,
  },
  images: [
    ["hero-portrait", "./assets/images/foto-5.webp"],
    ["gallery-portrait-01", "./assets/images/foto-3.webp"],
    ["gallery-portrait-02", "./assets/images/foto-1.webp"],
    ["gallery-portrait-03", "./assets/images/foto-4.webp"],
    ["gallery-portrait-04", "./assets/images/foto-5.webp"],
  ].map(([id, src]) => ({ id, type: "image", src, mimeType: "image/webp", status: "authorized-local", required: true })),
  fonts: [
    {
      id: "display-font",
      type: "font",
      family: "Playfair Display",
      src: "./assets/fonts/playfair-display-400.woff2",
      fallback: "Georgia, serif",
      status: "authorized-local",
      required: true,
    },
    {
      id: "body-font",
      type: "font",
      family: "Montserrat",
      src: "./assets/fonts/montserrat-400.woff2",
      fallback: "Arial, sans-serif",
      status: "authorized-local",
      required: true,
    },
  ],
};
