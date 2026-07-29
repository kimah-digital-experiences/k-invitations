import { bootstrapPolaris } from "../../src/scripts/polaris/bootstrap.js";
import { startPolaris } from "../../src/scripts/polaris/startup.js";
import { babyShowerSpaceTemplate } from "../../src/scripts/templates/baby-shower-space/template-manifest.js";

const publishedTemplate = {
  ...babyShowerSpaceTemplate,
  runtime: {
    ...babyShowerSpaceTemplate.runtime,
    audio: {
      ...babyShowerSpaceTemplate.runtime.audio,
      src: new URL("../../assets/audio/theme.mp3", import.meta.url).href,
    },
  },
};

startPolaris(() => bootstrapPolaris(publishedTemplate));
