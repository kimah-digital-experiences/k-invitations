const guestNameFallback = "un invitado especial";

export const eventConfig = {
  babyName: "Benjamin",
  hosts: "Daniel y Ana Josse",
  eventType: "Baby Shower",
  date: "2 de agosto de 2026",
  location: {
    name: "Colegio Médico de Honduras, Tegucigalpa",
    googleMapsUrl: "https://maps.app.goo.gl/5NxaTAyVFGXkBZ117?g_st=ic",
  },
  time: "3:00 p.m.",
  rsvp: {
    phone: "+50489089211",
    guestNameFallback,
    affirmativeMessage: `Hola, soy ${guestNameFallback}. Confirmo con mucha alegría que asistiré al Baby Shower de Benjamin el 2 de agosto de 2026.`,
    negativeMessage: `Hola, soy ${guestNameFallback}. Con mucho cariño agradezco la invitación al Baby Shower de Benjamin. En esta ocasión no podré acompañarlos, pero les deseo un hermoso evento y muchas bendiciones para Benjamin.`,
  },
  gifts: {
    title: "🎁 Regalos para Benjamin",
    text:
      "Si desean obsequiar algo a Benjamin, con mucho cariño les pedimos evitar zapatos y juguetes. Cualquier otro regalo será recibido con enorme gratitud y alegría.",
  },
};
