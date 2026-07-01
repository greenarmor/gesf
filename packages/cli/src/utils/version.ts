// When compiled with bun build --compile, GESF_CLI_VERSION is injected at build time.
// When running via node/npm, it falls back to reading package.json.
declare var GESF_CLI_VERSION: string | undefined;

import { createRequire } from "node:module";
import * as url from "node:url";
import * as path from "node:path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let pkgVersion = "";
try {
  pkgVersion = require(path.join(__dirname, "..", "..", "package.json")).version;
} catch {
  // ignore — compiled binary won't have package.json on disk
}

export const CLI_VERSION: string = (typeof GESF_CLI_VERSION !== "undefined" ? GESF_CLI_VERSION : "") || pkgVersion || "0.0.0";
export const AUTHOR: string = "greenarmor";
export const RELEASE_DATE: string = "2026-06-20";
export const DONATE_URL: string = "https://ko-fi.com/greenarmor";
export const HOMEPAGE: string = "https://github.com/greenarmor/gesf";
