import { bootstrapPolaris } from "./polaris/bootstrap.js";
import { startPolaris } from "./polaris/startup.js";
import { babyShowerSpaceTemplate } from "./templates/baby-shower-space/template-manifest.js";

startPolaris(() => bootstrapPolaris(babyShowerSpaceTemplate));
