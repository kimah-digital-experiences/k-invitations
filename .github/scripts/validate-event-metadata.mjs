import { readFile } from "node:fs/promises";
import { eventConfig } from "../../src/scripts/config/event-config.js?v=18";

const htmlPath = process.argv[2] ?? "index.html";
const html = await readFile(htmlPath, "utf8");

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function getAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`\\b${attributeName}\\s*=\\s*(["'])(.*?)\\1`, "is"));
  return match ? decodeHtml(match[2].trim()) : undefined;
}

const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
const metaDescriptionTag = Array.from(html.matchAll(/<meta\b[^>]*>/gi)).find(
  ([tag]) => getAttribute(tag, "name")?.toLowerCase() === "description",
)?.[0];
const mainExperienceTag = Array.from(html.matchAll(/<main\b[^>]*>/gi)).find(([tag]) =>
  (getAttribute(tag, "class") ?? "").split(/\s+/).includes("experience"),
)?.[0];

const checks = [
  {
    label: "title",
    found: titleMatch ? decodeHtml(titleMatch[1].trim()) : undefined,
    expected: eventConfig.document.title,
  },
  {
    label: 'meta[name="description"]',
    found: metaDescriptionTag ? getAttribute(metaDescriptionTag, "content") : undefined,
    expected: eventConfig.document.description,
  },
  {
    label: "main.experience aria-label",
    found: mainExperienceTag ? getAttribute(mainExperienceTag, "aria-label") : undefined,
    expected: eventConfig.document.ariaLabel,
  },
];

let failed = false;

for (const { label, found, expected } of checks) {
  if (found === expected) {
    continue;
  }

  failed = true;
  const foundValue = found === undefined || found === "" ? "<faltante>" : JSON.stringify(found);
  console.error(
    `::error file=${htmlPath}::Metadato estático divergente (${label}). ` +
      `Encontrado: ${foundValue}. Esperado: ${JSON.stringify(expected)}.`,
  );
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("Los metadatos estáticos de index.html coinciden con eventConfig.document.");
}
