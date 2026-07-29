import { bootstrapPolaris } from "../../src/scripts/polaris/bootstrap.js";
import { startPolaris } from "../../src/scripts/polaris/startup.js";
import { templateStarter } from "../../src/scripts/templates/template-starter/template-manifest.js";

startPolaris(() => bootstrapPolaris(templateStarter));
