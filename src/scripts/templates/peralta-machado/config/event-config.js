const eventDateTime = "2027-03-20T17:00:00-06:00";

export const eventConfig = {
  event: {
    type: "wedding",
    title: "Boda de Valeria y Nicolás",
    dateTime: eventDateTime,
    timeZone: "America/Tegucigalpa",
    locale: "es-HN",
  },
  couple: {
    partners: [
      { displayName: "Valeria", role: "bride" },
      { displayName: "Nicolás", role: "groom" },
    ],
    hosts: ["Familia Robles", "Familia Flores"],
  },
  guest: {
    fallbackName: "Invitado especial",
    defaultPartySize: 1,
    queryParameters: {
      name: "guest",
      partySize: "passes",
    },
  },
  opening: {
    eyebrow: "Una celebración para recordar",
    title: "Valeria & Nicolás",
    actionLabel: "Abrir invitación",
  },
  audio: {
    enabled: false,
    resourceId: "background-music",
    startOnOpeningGesture: true,
    loop: true,
  },
  countdown: {
    targetDateTime: eventDateTime,
    labels: {
      days: "Días",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
    },
  },
  date: {
    heading: "Reserva la fecha",
    blessing: "Con gratitud, celebraremos el comienzo de este nuevo capítulo.",
    displayDate: "20 de marzo de 2027",
    displayTime: "5:00 p. m.",
    city: "Tegucigalpa, Honduras",
  },
  gallery: {
    heading: "Nuestra historia",
    imageResourceIds: [
      "gallery-portrait-01",
      "gallery-portrait-02",
      "gallery-portrait-03",
      "gallery-portrait-04",
    ],
  },
  itinerary: {
    heading: "Itinerario",
    items: [
      { id: "ceremony", time: "5:00 p. m.", label: "Ceremonia" },
      { id: "reception", time: "6:30 p. m.", label: "Recepción" },
      { id: "dinner", time: "7:30 p. m.", label: "Cena" },
      { id: "celebration", time: "9:00 p. m.", label: "Celebración" },
    ],
  },
  locations: [
    {
      id: "ceremony",
      type: "ceremony",
      name: "Capilla del Bosque",
      address: "Dirección ficticia, Tegucigalpa",
      externalUrl: "https://example.com/maps/ceremony",
      externalLabel: "Abrir ubicación de la ceremonia",
    },
    {
      id: "reception",
      type: "reception",
      name: "Jardín del Alba",
      address: "Dirección ficticia, Tegucigalpa",
      externalUrl: "https://example.com/maps/reception",
      externalLabel: "Abrir ubicación de la recepción",
    },
  ],
  gifts: {
    heading: "Regalos",
    message: "Su compañía es nuestro mejor regalo.",
    registryUrl: "https://example.com/gifts",
    accountDetails: null,
  },
  rsvp: {
    enabled: false,
    deadline: "2027-02-20",
    transport: "unconfigured",
    endpoint: null,
    attendanceOptions: ["attending", "not-attending"],
  },
  whatsapp: {
    enabled: false,
    phone: null,
    messageTemplate: "Hola, soy {guestName}. Deseo confirmar mi asistencia.",
  },
  content: {
    openingEyebrow: "Una celebración para recordar",
    openingTitle: "Valeria & Nicolás",
    heroTitle: "Nuestra celebración",
    dateHeading: "Reserva la fecha",
    dateBlessing: "Con gratitud, celebraremos el comienzo de este nuevo capítulo.",
    eventDate: "20 de marzo de 2027",
    eventTime: "5:00 p. m.",
    eventCity: "Tegucigalpa, Honduras",
    galleryHeading: "Nuestra historia",
    itineraryHeading: "Itinerario",
    guidanceHeading: "Indicaciones para celebrar",
    giftMessage: "Su compañía es nuestro mejor regalo.",
    rsvpHeading: "Confirmación",
    closingTitle: "Gracias por acompañarnos",
  },
  document: {
    title: "Valeria & Nicolás · Invitación de boda",
    description: "Una invitación ficticia de boda creada como contrato declarativo para Polaris.",
    ariaLabel: "Invitación de boda ficticia de Valeria y Nicolás",
    language: "es-HN",
  },
};
