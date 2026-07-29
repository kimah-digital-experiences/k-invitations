import { bootstrapPolaris } from "../../src/scripts/polaris/bootstrap.js";
import { startPolaris } from "../../src/scripts/polaris/startup.js";
import { tropicalBirthdayTemplate } from "../../src/scripts/templates/tropical-birthday/template-manifest.js";

startPolaris(() => bootstrapPolaris(tropicalBirthdayTemplate));
