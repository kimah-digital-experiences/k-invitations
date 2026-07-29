const guestOfHonor = "Benjamin";
const date = "Saturday · July 18";
const time = "4:00 PM";
const location = "Paradise Beach Club";

export const eventConfig = {
  guestOfHonor,
  date,
  time,
  location,
  colors: {
    turquoise: "#087f83",
    palm: "#194f42",
    sand: "#f3e8d0",
    coral: "#ec7968",
    white: "#fffdf8",
  },
  images: {
    opening: "../../assets/images/tropical/tropical-sunset.svg",
    message: "../../assets/images/tropical/palm-cove.svg",
    gallery: [
      "../../assets/images/tropical/tropical-table.svg",
      "../../assets/images/tropical/ocean-light.svg",
      "../../assets/images/tropical/monstera-detail.svg",
    ],
  },
  music: {
    src: "data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAACAgICAgICAgA==",
    volume: 0.08,
  },
  locationUrl: "https://maps.google.com/?q=Paradise+Beach+Club",
  rsvp: {
    phone: "50499999999",
    message: `Hi! I’m delighted to confirm my attendance at ${guestOfHonor}'s Tropical Birthday.`,
  },
  countdownTarget: "2037-07-18T16:00:00-06:00",
  content: {
    openingKicker: "Tropical Collection · 001",
    openingTitle: "Benjamin's Tropical Birthday",
    openingCopy: "An island celebration shaped by warm light, ocean air and unforgettable company.",
    countdownKicker: "Until paradise",
    countdownTitle: "Meet me under the palms",
    messageKicker: "A note from Benjamin",
    messageTitle: "Let's make waves",
    messageCopy: "Join me for an unforgettable tropical celebration filled with laughter, music, great food and amazing memories.",
    detailsKicker: "The island itinerary",
    date,
    time,
    location,
    dressKicker: "Dress Code",
    dressTitle: "Tropical Casual",
    dressCopy: "Relaxed tailoring, airy silhouettes and natural textures in sun-washed island tones.",
    dressNote: "Come ready for golden hour by the sea.",
    galleryKicker: "Paradise, framed",
    galleryTitle: "A taste of the celebration",
    galleryCopy: "Soft sand, glowing tables and palms moving gently in the evening breeze.",
    rsvpKicker: "Your place in paradise",
    rsvpTitle: "Say you'll be there",
    rsvpCopy: "Confirm your attendance and join Benjamin for a beautiful afternoon by the sea.",
    closingKicker: "Tropical Collection · MMXXXVII",
    closingTitle: "See you under the palms!",
    closingCopy: "With sunshine, music and a little island magic — Benjamin.",
  },
  document: {
    title: "Benjamin's Tropical Birthday",
    description: "An elegant tropical birthday celebration by the sea for Benjamin.",
    ariaLabel: "Benjamin's Tropical Birthday invitation experience",
  },
};
