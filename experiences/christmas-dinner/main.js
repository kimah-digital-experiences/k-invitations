import { bootstrapPolaris } from "../../src/scripts/polaris/bootstrap.js";
import { startPolaris } from "../../src/scripts/polaris/startup.js";
import { christmasDinnerTemplate } from "../../src/scripts/templates/christmas-dinner/template-manifest.js";

startPolaris(() => bootstrapPolaris(christmasDinnerTemplate));
