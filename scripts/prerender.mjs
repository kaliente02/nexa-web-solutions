// Renders the React app to static HTML and injects it into dist/index.html,
// so search engines and no-JS visitors get the full page content.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = path.join(root, "dist", "index.html");
const ssrDir = path.join(root, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.mjs")).href);

const template = fs.readFileSync(distIndex, "utf8");

if (!template.includes("<!--app-html-->")) {
  console.error("ERROR: <!--app-html--> placeholder missing from dist/index.html.");
  process.exit(1);
}

fs.writeFileSync(distIndex, template.replace("<!--app-html-->", render()));
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log("Prerendered dist/index.html");
