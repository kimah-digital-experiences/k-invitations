import { bootstrapPolaris } from "../../src/scripts/polaris/bootstrap.js";
import { startPolaris } from "../../src/scripts/polaris/startup.js";
import { santoriniBirthdayTemplate } from "../../src/scripts/templates/santorini-birthday/template-manifest.js";

startPolaris(() => bootstrapPolaris(santoriniBirthdayTemplate));
