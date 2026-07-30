const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Crect width='1200' height='800' fill='%23eee8df'/%3E%3C/svg%3E";
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
    "hero-portrait",
    "gallery-portrait-01",
    "gallery-portrait-02",
    "gallery-portrait-03",
    "gallery-portrait-04",
  ].map((id) => ({
    id,
    type: "image",
    src: placeholderImage,
    mimeType: "image/svg+xml",
    alt: "Imagen ficticia pendiente de autorización",
    status: "placeholder",
    required: true,
  })),
  fonts: [
    {
      id: "display-font",
      type: "font",
      family: "serif",
      src: null,
      fallback: "Georgia, serif",
      status: "system-fallback",
      required: true,
    },
    {
      id: "body-font",
      type: "font",
      family: "sans-serif",
      src: null,
      fallback: "Arial, sans-serif",
      status: "system-fallback",
      required: true,
    },
  ],
};
