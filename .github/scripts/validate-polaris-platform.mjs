import assert from "node:assert/strict";
import { access, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { templates } from "../../src/scripts/templates/index.js";

assert.equal(templates.length, 6, "Polaris debe registrar seis experiencias.");
assert.equal(new Set(templates.map(({ id }) => id)).size, templates.length, "Los IDs deben ser únicos.");

for (const template of templates) {
  const { manifest } = template;
  const ids = manifest.sceneRegistry.map(({ id }) => id);
  assert.ok(ids.includes(manifest.runtime.initialSceneId), `${template.id}: initialSceneId inválido.`);
  assert.ok(ids.includes(manifest.runtime.journeySceneId), `${template.id}: journeySceneId inválido.`);
  assert.ok(ids.includes(manifest.runtime.autoplay.stopSceneId), `${template.id}: stopSceneId inválido.`);
  assert.equal(new Set(ids).size, ids.length, `${template.id}: IDs de escena duplicados.`);
  manifest.sceneRegistry.forEach(({ create, nextSceneId }) => {
    assert.equal(typeof create, "function", `${template.id}: fábrica inválida.`);
    assert.ok(nextSceneId === null || ids.includes(nextSceneId), `${template.id}: destino inválido.`);
  });
  await access(path.join(process.cwd(), template.launchUrl, "index.html"));
}

const showcaseSource = await readFile("src/scripts/showcase.js", "utf8");
assert.ok(showcaseSource.includes('from "./templates/index.js"'), "Showcase debe consumir el registro.");
for (const { name } of templates) {
  assert.equal(showcaseSource.includes(name), false, "Showcase no debe duplicar nombres de experiencias.");
}

const slug = `validation-event-${process.pid}`;
const generatedRoot = path.join(process.cwd(), "src", "scripts", "templates", slug);
try {
  const result = spawnSync(process.execPath, [path.resolve("scripts/create-template.mjs"), slug], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  await access(path.join(generatedRoot, "template-manifest.js"));
  const duplicate = spawnSync(process.execPath, [path.resolve("scripts/create-template.mjs"), slug], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.notEqual(duplicate.status, 0, "La CLI no debe sobrescribir una plantilla existente.");
} finally {
  await rm(generatedRoot, { recursive: true, force: true });
}

console.log("Polaris Platform validado: registro, manifiestos, rutas, Showcase y CLI.");
