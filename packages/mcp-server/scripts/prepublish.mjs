import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgPath = join(__dirname, "..", "package.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

pkg.dependencies = {};
pkg.devDependencies = {};
pkg.scripts = {
  start: "node bundle/server.js",
};

delete pkg.prepublishOnly;

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log("Stripped workspace deps for publish");
