const guestOfHonor = "Benjamin";
const date = "Friday · December 19";
const time = "7:00 PM";
const location = "Winter House";

export const eventConfig = {
  guestOfHonor,
  date,
  time,
  location,
  colors: {
    forest: "#173b2a",
    burgundy: "#681f2b",
    gold: "#c9a45d",
    ivory: "#f5efe3",
    midnight: "#111713",
  },
  images: {
    opening: "../../assets/images/christmas/christmas-tree.svg",
    message: "../../assets/images/christmas/fireplace.svg",
    gallery: [
      "../../assets/images/christmas/candle-table.svg",
      "../../assets/images/christmas/winter-house.svg",
      "../../assets/images/christmas/holly-detail.svg",
    ],
  },
  music: {
    src: "../../assets/audio/theme.mp3",
    volume: 0.07,
  },
  locationUrl: "https://maps.google.com/?q=Winter+House",
  rsvp: {
    phone: "50499999999",
    message: `Hello! I’m delighted to confirm my attendance at ${guestOfHonor}'s Christmas Dinner.`,
  },
  countdownTarget: "2031-12-19T19:00:00-06:00",
  content: {
    openingKicker: "Christmas Collection · 001",
    openingTitle: "Benjamin's Christmas Dinner",
    openingCopy: "An intimate Christmas evening illuminated by tradition, warmth and wonderful company.",
    countdownKicker: "Until we gather",
    countdownTitle: "The evening awaits",
    messageKicker: "A Christmas invitation",
    messageTitle: "Come in from the cold",
    messageCopy: "Celebrate the most wonderful season of the year with an evening of great food, meaningful conversations and unforgettable memories.",
    detailsKicker: "The evening",
    date,
    time,
    location,
    dressKicker: "Dress Code",
    dressTitle: "Holiday Elegance",
    dressCopy: "Refined evening wear in rich winter tones, timeless silhouettes and touches of festive gold.",
    dressNote: "Classic, warm and made for candlelight.",
    galleryKicker: "A glimpse inside",
    galleryTitle: "An evening aglow",
    galleryCopy: "A fireside table, winter greenery and the quiet magic of Christmas shared together.",
    rsvpKicker: "Your place at the table",
    rsvpTitle: "Join us for dinner",
    rsvpCopy: "Kindly confirm your attendance so a place can be prepared for you at Winter House.",
    closingKicker: "With warmest wishes",
    closingTitle: "May the warmth of Christmas stay with you throughout the year.",
    closingCopy: "Benjamin",
  },
  document: {
    title: "Benjamin's Christmas Dinner",
    description: "An elegant private Christmas dinner invitation at Winter House.",
    ariaLabel: "Benjamin's Christmas Dinner invitation experience",
  },
};
