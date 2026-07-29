import { babyShowerSpaceTemplate } from "./baby-shower-space/template-manifest.js";
import { christmasDinnerTemplate } from "./christmas-dinner/template-manifest.js";
import { santoriniBirthdayTemplate } from "./santorini-birthday/template-manifest.js";
import { tropicalBirthdayTemplate } from "./tropical-birthday/template-manifest.js";
import { templateStarter } from "./template-starter/template-manifest.js";
import { weddingTemplate } from "./wedding/template-manifest.js";

const placeholder = (label, background, accent) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="${background}"/><circle cx="600" cy="260" r="120" fill="none" stroke="${accent}" stroke-width="3"/><text x="600" y="465" text-anchor="middle" fill="${accent}" font-family="serif" font-size="58">${label}</text></svg>`,
  )}`;

export const templates = [
  {
    id: "christmas-dinner",
    name: "Christmas Dinner",
    description: "Una cena navideña íntima entre luz de velas, tradición europea y elegancia atemporal.",
    image: "assets/images/christmas/christmas-tree.svg",
    launchUrl: "experiences/christmas-dinner/",
    manifest: christmasDinnerTemplate,
  },
  {
    id: "baby-shower-space",
    name: "Baby Shower Space",
    description: "Una travesía espacial cálida y cinematográfica para celebrar una nueva vida.",
    image: placeholder("Baby Shower Space", "#071426", "#d8c28c"),
    launchUrl: "experiences/baby-shower-space/",
    manifest: babyShowerSpaceTemplate,
  },
  {
    id: "wedding",
    name: "Wedding",
    description: "Una historia de amor íntima narrada con elegancia, luz y movimiento.",
    image: placeholder("Wedding", "#211814", "#d9b77e"),
    launchUrl: "experiences/wedding/",
    manifest: weddingTemplate,
  },
  {
    id: "santorini-birthday",
    name: "Santorini Birthday",
    description: "Lujo discreto, luz del Egeo y diseño editorial para celebrar una nueva vuelta al sol.",
    image: "assets/images/santorini/caldera.svg",
    launchUrl: "experiences/santorini-birthday/",
    manifest: santoriniBirthdayTemplate,
  },
  {
    id: "tropical-birthday",
    name: "Tropical Birthday",
    description: "Una celebración isleña sofisticada entre palmeras, luz coral y mar turquesa.",
    image: "assets/images/tropical/tropical-sunset.svg",
    launchUrl: "experiences/tropical-birthday/",
    manifest: tropicalBirthdayTemplate,
  },
  {
    id: "template-starter",
    name: "Template Starter",
    description: "La base mínima para comenzar una experiencia nueva con Polaris.",
    image: placeholder("Template Starter", "#111827", "#93c5fd"),
    launchUrl: "experiences/template-starter/",
    manifest: templateStarter,
  },
];
