import { bootstrapPolaris } from "../../src/scripts/polaris/bootstrap.js";
import { startPolaris } from "../../src/scripts/polaris/startup.js";
import { peraltaMachadoTemplate } from "../../src/scripts/templates/peralta-machado/template-manifest.js";

startPolaris(() => bootstrapPolaris(peraltaMachadoTemplate));
