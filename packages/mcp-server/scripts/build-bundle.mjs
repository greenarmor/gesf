import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
writeFileSync(outfile, content);

console.log("Bundle created: bundle/server.js");
