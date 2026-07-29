const babyName = "Benjamín";
const hosts = "Daniel y Ana Josse";
const eventType = "Baby Shower";
const eventDate = "2 de agosto de 2026";
const eventTime = "4:00 pm – 7:00 pm";
const eventLocation = "Colegio Médico de Honduras, Tegucigalpa";
const googleMapsUrl = "https://maps.app.goo.gl/5NxaTAyVFGXkBZ117?g_st=ic";
const rsvpPhone = "+50489089211";
const guestNameFallback = "un invitado especial";

const eventTitle = `${eventType} de ${babyName}`;
const giftTitle = `🎁 Regalos para ${babyName}`;
const giftText =
  `Su presencia será nuestro mejor regalo. Si desea obsequiar algo a ${babyName}, ` +
  "que no sean zapatos ni juguetes.";

export const eventConfig = {
  babyName,
  hosts,
  eventType,
  eventTitle,
  date: eventDate,
  time: eventTime,
  location: {
    name: eventLocation,
    googleMapsUrl,
  },
  rsvp: {
    phone: rsvpPhone,
    guestNameFallback,
    affirmativeMessage:
      `Hola, soy ${guestNameFallback}. Confirmo con mucha alegría que asistiré al ` +
      `${eventTitle} el ${eventDate}.`,
    negativeMessage:
      `Hola, soy ${guestNameFallback}. Con mucho cariño agradezco la invitación al ` +
      `${eventTitle}. En esta ocasión no podré acompañarlos, pero les deseo un hermoso ` +
      `evento y muchas bendiciones para ${babyName}.`,
  },
  gifts: {
    title: giftTitle,
    text: giftText,
  },
  content: {
    babyName,
    hosts,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    starKicker: `La estrella de ${babyName}`,
    invitationTitle: `Acompáñanos a celebrar a ${babyName}`,
    invitationCopy:
      `${hosts} desean compartir este momento con las personas que hacen más luminosa ` +
      "su historia.",
    rsvpCopy:
      `Tu presencia hará más luminosa esta celebración. ${babyName} está por llegar, ` +
      "y nos emociona imaginar este momento acompañados por quienes queremos.",
    giftTitle,
    giftText,
    finaleTitle: `${babyName} los espera`,
    finaleHosts: `Con cariño, ${hosts}.`,
  },
  document: {
    title: "Baby Shower Space",
    description:
      "Primera escena interactiva de Baby Shower Space: una invitación espacial, cálida y cinematográfica.",
    ariaLabel: "Baby Shower Space",
  },
};
