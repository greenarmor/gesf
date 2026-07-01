import { createRequire } from "node:module";
import * as url from "node:url";
import * as path from "node:path";

// GESF_VERSION_PLACEHOLDER is replaced by sed in CI before bun build --compile.
// In npm/node mode, it stays as-is and the code reads package.json instead.
const INJECTED = "GESF_VERSION_PLACEHOLDER";

let version = "";

if (INJECTED !== "GESF_VERSION_PLACEHOLDER") {
  version = INJECTED;
} else {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const require = createRequire(import.meta.url);
  version = require(path.join(__dirname, "..", "..", "package.json")).version;
}

export const CLI_VERSION: string = version;
export const AUTHOR: string = "greenarmor";
export const RELEASE_DATE: string = "2026-06-20";
export const DONATE_URL: string = "https://ko-fi.com/greenarmor";
export const HOMEPAGE: string = "https://github.com/greenarmor/gesf";
