function createContractScene(id) {
  return () => ({ id });
}

const narrative = [
  "opening",
  "hero",
  "date",
  "venues",
  "gallery",
  "itinerary",
  "guidance",
  "rsvp",
  "closing",
];

export const sceneRegistry = narrative.map((id, index) => ({
  id,
  create: createContractScene(id),
  nextSceneId: narrative[index + 1] ?? null,
}));
