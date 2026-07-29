const guestOfHonor = "Sofía";
const age = 30;
const date = "22 de agosto de 2026";
const time = "6:30 pm";
const location = "Casa Thalassa · Valle de Ángeles";

export const eventConfig = {
  guestOfHonor,
  age,
  date,
  time,
  location,
  colors: {
    aegean: "#174a66",
    sea: "#4f879b",
    bougainvillea: "#a94369",
    sunset: "#dc9b72",
    limestone: "#f5f0e7",
  },
  images: {
    opening: "../../assets/images/santorini/caldera.svg",
    architecture: "../../assets/images/santorini/architecture.svg",
    gallery: [
      "../../assets/images/santorini/terrace.svg",
      "../../assets/images/santorini/coast.svg",
      "../../assets/images/santorini/bougainvillea.svg",
    ],
  },
  music: {
    src: "data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAACAgICAgICAgA==",
    volume: 0.08,
  },
  locationUrl: "https://maps.google.com/?q=Valle+de+Angeles+Honduras",
  rsvp: {
    phone: "50499999999",
    deadline: "10 de agosto",
    message: `Hola, confirmo mi asistencia al cumpleaños de ${guestOfHonor}.`,
  },
  countdownTarget: "2026-08-22T18:30:00-06:00",
  content: {
    openingKicker: "Mediterranean Collection · 001",
    openingTitle: "Una tarde junto al Egeo",
    openingCopy: "El verano guarda una celebración inolvidable.",
    welcomeKicker: "Bienvenidos",
    welcomeTitle: "El horizonte nos reúne",
    welcomeCopy: "Entre muros de cal, brisa salina y luz dorada, celebremos la belleza de estar juntos.",
    birthdayKicker: "A summer celebration",
    guestOfHonor,
    birthdayCopy: `${age} vueltas al sol merecen una noche extraordinaria.`,
    age: String(age),
    quote: "La vida se mide en instantes que quisiéramos volver a vivir.",
    detailsKicker: "La cita",
    date,
    time,
    location,
    dressKicker: "Dress code",
    dressTitle: "Mediterranean chic",
    dressCopy: "Lino, siluetas fluidas y tonos inspirados en piedra, arena, olivo y mar.",
    dressNote: "Reservemos el blanco para la arquitectura.",
    countdownKicker: "Hasta encontrarnos",
    galleryKicker: "Postales del verano",
    galleryTitle: "Una isla en la memoria",
    galleryCopy: "Texturas, luz y horizontes que inspiran nuestra noche.",
    rsvpKicker: "Répondez s’il vous plaît",
    rsvpTitle: "Tu lugar está reservado",
    rsvpCopy: `Confirma antes del ${"10 de agosto"} y acompáñame a brindar junto al atardecer.`,
    closingKicker: "Santorini · Summer MMXXVI",
    closingTitle: "Nos vemos donde el cielo toca el mar",
    closingCopy: `Con cariño, ${guestOfHonor}.`,
  },
  document: {
    title: "Santorini Birthday · Sofía",
    description: "Una celebración mediterránea íntima, luminosa y cinematográfica.",
    ariaLabel: "Experiencia de cumpleaños mediterránea de Sofía",
  },
};
