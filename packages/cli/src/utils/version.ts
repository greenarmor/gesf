// When compiled with bun build --compile --define GESF_CLI_VERSION:"1.2.3",
// bun replaces the GESF_CLI_VERSION identifier with the version string.
// In npm/node mode (no --define), GESF_CLI_VERSION stays undefined and
// the code falls through to read package.json at runtime.

import { createRequire } from "node:module";
import * as url from "node:url";
import * as path from "node:path";

declare var GESF_CLI_VERSION: string | undefined;

function readVersionFromPackageJson(): string {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const require = createRequire(import.meta.url);
  return require(path.join(__dirname, "..", "..", "package.json")).version;
}

export const CLI_VERSION: string =
  typeof GESF_CLI_VERSION !== "undefined" ? GESF_CLI_VERSION : readVersionFromPackageJson();

export const AUTHOR: string = "greenarmor";
export const RELEASE_DATE: string = "2026-06-20";
export const DONATE_URL: string = "https://ko-fi.com/greenarmor";
export const HOMEPAGE: string = "https://github.com/greenarmor/gesf";
