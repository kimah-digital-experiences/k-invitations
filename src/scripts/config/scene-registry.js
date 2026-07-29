import { createOpeningScene } from "../scenes/opening-scene.js?v=16";
import { createBenjaminScene } from "../scenes/benjamin-scene.js?v=16";
import { createSignalScene } from "../scenes/signal-scene.js?v=16";
import { createStarScene } from "../scenes/star-scene.js?v=16";
import { createCoordinatesScene } from "../scenes/coordinates-scene.js?v=18";
import { createInvitationScene } from "../scenes/invitation-scene.js?v=16";
import { createRsvpScene } from "../scenes/rsvp-scene.js?v=18";
import { createFinaleScene } from "../scenes/finale-scene.js?v=18";

export const sceneRegistry = [
  {
    id: "opening",
    create: createOpeningScene,
    nextSceneId: "benjamin",
  },
  {
    id: "benjamin",
    create: createBenjaminScene,
    nextSceneId: "signal",
  },
  {
    id: "signal",
    create: createSignalScene,
    nextSceneId: "star",
  },
  {
    id: "star",
    create: createStarScene,
    nextSceneId: "scene6",
  },
  {
    id: "scene6",
    create: createCoordinatesScene,
    nextSceneId: "scene7",
  },
  {
    id: "scene7",
    create: createInvitationScene,
    nextSceneId: "scene8",
  },
  {
    id: "scene8",
    create: createRsvpScene,
    nextSceneId: "scene9",
  },
  {
    id: "scene9",
    create: createFinaleScene,
    nextSceneId: null,
  },
];
