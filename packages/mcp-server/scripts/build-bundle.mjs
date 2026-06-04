import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgJson = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf8"));

const outfile = join(__dirname, "..", "bundle", "server.js");

await build({
  entryPoints: [join(__dirname, "..", "src", "server.ts")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile,
  minify: false,
  sourcemap: false,
  define: {
    "import.meta.url": "import.meta.url",
  },
  logOverride: {
    "empty-import-meta": "silent",
  },
});

let content = readFileSync(outfile, "utf8");
if (content.startsWith("#!/usr/bin/env node\n")) {
  content = content.slice("#!/usr/bin/env node\n".length);
}
content = "#!/usr/bin/env node\n" + content;

content = content.replace(
  /var\s+pkg\s*=\s*require2?\([^)]*package\.json[^)]*\);/g,
  `var pkg = ${JSON.stringify({ version: pkgJson.version })};`
);

writeFileSync(outfile, content);

console.log("Bundle created: bundle/server.js");
