import { createRequire } from "node:module";
import * as url from "node:url";
import * as path from "node:path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const pkg = require(path.join(__dirname, "..", "..", "package.json"));

export const CLI_VERSION: string = pkg.version;
export const AUTHOR: string = "greenarmor";
export const RELEASE_DATE: string = "2026-06-20";
export const DONATE_URL: string = "https://ko-fi.com/greenarmor";
export const HOMEPAGE: string = "https://github.com/greenarmor/gesf";
