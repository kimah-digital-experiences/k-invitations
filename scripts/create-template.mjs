#!/usr/bin/env node
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const slug = process.argv[2];
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!slug || !validSlug.test(slug)) {
  console.error("Uso: node scripts/create-template.mjs <nombre-en-kebab-case>");
  process.exit(1);
}

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatesRoot = path.join(repositoryRoot, "src", "scripts", "templates");
const templateRoot = path.join(templatesRoot, slug);

try {
  await access(templateRoot);
  console.error(`La plantilla \"${slug}\" ya existe. No se modificó ningún archivo.`);
  process.exit(1);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const displayName = slug
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
const exportName = slug.replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase()) + "Template";
const files = {
  "config/event-config.js": `export const eventConfig = {\n  content: {\n    openingTitle: "${displayName}",\n    messageText: "Tu historia comienza aquí.",\n    closingTitle: "Gracias por acompañarnos",\n  },\n  document: {\n    title: "${displayName}",\n    description: "Una experiencia creada con Polaris.",\n    ariaLabel: "Experiencia ${displayName}",\n  },\n};\n`,
  "resources-manifest.js": `const silentAudio =\n  "data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAACAgICAgICAgA==";\n\nexport const resourcesManifest = {\n  audio: { backgroundMusic: { src: silentAudio, volume: 0 } },\n  branding: { name: "${displayName}", stylesheet: null },\n};\n`,
  "scenes/create-scene.js": `export function createScene(id) {\n  const root = document.querySelector(\`[data-scene='\${id}']\`);\n  return {\n    id,\n    enter() { root?.removeAttribute("hidden"); },\n    exit() { root?.setAttribute("hidden", ""); },\n  };\n}\n`,
  "scenes/opening-scene.js": `import { createScene } from "./create-scene.js";\nexport function createOpeningScene() { return createScene("opening"); }\n`,
  "scenes/message-scene.js": `import { createScene } from "./create-scene.js";\nexport function createMessageScene() { return createScene("message"); }\n`,
  "scenes/closing-scene.js": `import { createScene } from "./create-scene.js";\nexport function createClosingScene() { return createScene("closing"); }\n`,
  "scene-registry.js": `import { createClosingScene } from "./scenes/closing-scene.js";\nimport { createMessageScene } from "./scenes/message-scene.js";\nimport { createOpeningScene } from "./scenes/opening-scene.js";\n\nexport const sceneRegistry = [\n  { id: "opening", create: createOpeningScene, nextSceneId: "message" },\n  { id: "message", create: createMessageScene, nextSceneId: "closing" },\n  { id: "closing", create: createClosingScene, nextSceneId: null },\n];\n`,
  "template-manifest.js": `import { eventConfig } from "./config/event-config.js";\nimport { resourcesManifest } from "./resources-manifest.js";\nimport { sceneRegistry } from "./scene-registry.js";\n\nexport const ${exportName} = {\n  eventConfig,\n  resources: resourcesManifest,\n  runtime: {\n    initialSceneId: "opening",\n    journeySceneId: "message",\n    transitionMs: 300,\n    autoplay: { delayMs: 3000, retryDelayMs: 100, stopSceneId: "closing" },\n    audio: resourcesManifest.audio.backgroundMusic,\n  },\n  sceneRegistry,\n};\n`,
  "README.md": `# ${displayName}\n\nPlantilla generada con la CLI de Polaris.\n\n## Próximos pasos\n\n1. Personaliza \`config/event-config.js\`.\n2. Implementa el marcado con escenas \`opening\`, \`message\` y \`closing\`.\n3. Añade recursos propios en \`resources-manifest.js\`.\n4. Registra la experiencia una sola vez en \`src/scripts/templates/index.js\`.\n5. Ejecuta las validaciones del repositorio.\n`,
};

await mkdir(templateRoot, { recursive: false });
for (const [relativePath, contents] of Object.entries(files)) {
  const destination = path.join(templateRoot, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents, "utf8");
}

console.log(`Plantilla creada en src/scripts/templates/${slug}/`);
console.log("Regístrala en src/scripts/templates/index.js para mostrarla en Polaris Showcase.");
