import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");
const staging = join(root, ".publish-staging");

rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

cpSync(join(root, "bundle"), join(staging, "bundle"), { recursive: true });
cpSync(join(root, "dist"), join(staging, "dist"), { recursive: true });
cpSync(join(root, "README.md"), join(staging, "README.md"));

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const cleanPkg = {
  name: pkg.name,
  version: pkg.version,
  type: pkg.type,
  description: pkg.description,
  bin: pkg.bin,
  files: ["bundle", "dist"],
  scripts: { start: "node bundle/server.js" },
  publishConfig: pkg.publishConfig,
  engines: pkg.engines,
  keywords: pkg.keywords,
  license: pkg.license,
  repository: pkg.repository,
  homepage: pkg.homepage,
};

writeFileSync(join(staging, "package.json"), JSON.stringify(cleanPkg, null, 2) + "\n");

console.log("Publishing from staging directory...");
execSync("npm publish --access public", { cwd: staging, stdio: "inherit" });

rmSync(staging, { recursive: true, force: true });
console.log("Done. Staging cleaned up.");
