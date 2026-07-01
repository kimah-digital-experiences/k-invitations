const guestNameFallback = "un invitado especial";

export const eventConfig = {
  babyName: "Benjamin",
  hosts: "Daniel y Ana Josse",
  eventType: "Baby Shower",
  location: {
    name: "Colegio Médico de Honduras, Tegucigalpa",
    googleMapsUrl: "https://maps.app.goo.gl/5NxaTAyVFGXkBZ117?g_st=ic",
  },
  time: "3:00 pm",
  rsvp: {
    phone: "+50489089211",
    guestNameFallback,
    affirmativeMessage: `Hola, soy ${guestNameFallback}. Confirmo que asistiré al Baby Shower de Benjamin.`,
    negativeMessage: `Hola, soy ${guestNameFallback}. Con mucho cariño agradezco la invitación al Baby Shower de Benjamin, pero no podré acompañarlos. Les envío mis mejores deseos en esta etapa tan especial.`,
  },
  gifts: {
    text: "Se aceptan regalos para Benjamin, excepto zapatos y juguetes.",
  },
};
