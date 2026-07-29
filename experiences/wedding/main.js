import { bootstrapPolaris } from "../../src/scripts/polaris/bootstrap.js";
import { startPolaris } from "../../src/scripts/polaris/startup.js";
import { weddingTemplate } from "../../src/scripts/templates/wedding/template-manifest.js";

startPolaris(() => bootstrapPolaris(weddingTemplate));
