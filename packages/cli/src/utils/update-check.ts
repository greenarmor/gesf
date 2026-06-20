import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execSync } from "node:child_process";
import { CLI_VERSION } from "./version.js";

const CACHE_DIR = path.join(os.homedir(), ".ges");
const CACHE_FILE = path.join(CACHE_DIR, "update-check.json");
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 3000;
const NPM_PACKAGE = "@greenarmor/ges";

interface UpdateCache {
  latest_version: string | null;
  checked_at: string | null;
  dismissed_versions: string[];
  disabled: boolean;
}

function defaultCache(): UpdateCache {
  return {
    latest_version: null,
    checked_at: null,
    dismissed_versions: [],
    disabled: false,
  };
}

function readCache(): UpdateCache {
  try {
    if (!fs.existsSync(CACHE_FILE)) return defaultCache();
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    return { ...defaultCache(), ...data };
  } catch {
    return defaultCache();
  }
}

function writeCache(cache: UpdateCache): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + "\n");
  } catch {
    // best-effort cache — silent on failure
  }
}

export function compareVersions(a: string, b: string): number {
  const pa = a.replace(/^[v]/, "").split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.replace(/^[v]/, "").split(".").map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const va = pa[i] || 0;
    const vb = pb[i] || 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }
  return 0;
}

export function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}

function fetchLatestVersion(): string | null {
  try {
    const output: string = execSync(`npm view ${NPM_PACKAGE} version`, {
      stdio: ["ignore", "pipe", "ignore"],
      timeout: TIMEOUT_MS,
      encoding: "utf-8",
    });
    const version = output.trim().split("\n").pop()?.trim() || "";
    return version.match(/^\d+\.\d+\.\d+/) ? version : null;
  } catch {
    return null;
  }
}

export interface UpdateCheckResult {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  dismissed: boolean;
}

export async function checkForUpdate(force = false): Promise<UpdateCheckResult> {
  const cache = readCache();

  if (cache.disabled) {
    return { currentVersion: CLI_VERSION, latestVersion: null, updateAvailable: false, dismissed: false };
  }

  const now = Date.now();
  const checkedAt = cache.checked_at ? new Date(cache.checked_at).getTime() : 0;
  const isStale = now - checkedAt > CHECK_INTERVAL_MS;

  let latest = cache.latest_version;

  if (isStale || force) {
    const shouldFetch = force || isInteractive();
    if (shouldFetch) {
      latest = fetchLatestVersion();
      writeCache({
        ...cache,
        latest_version: latest ?? cache.latest_version,
        checked_at: new Date().toISOString(),
      });
    }
  }

  const updateAvailable = latest ? compareVersions(latest, CLI_VERSION) > 0 : false;
  const dismissed = latest ? cache.dismissed_versions.includes(latest) : false;

  return {
    currentVersion: CLI_VERSION,
    latestVersion: latest,
    updateAvailable,
    dismissed,
  };
}

export function dismissVersion(version: string): void {
  const cache = readCache();
  if (!cache.dismissed_versions.includes(version)) {
    cache.dismissed_versions.push(version);
    writeCache(cache);
  }
}

export function disableUpdateChecks(): void {
  const cache = readCache();
  cache.disabled = true;
  writeCache(cache);
}

export function enableUpdateChecks(): void {
  const cache = readCache();
  cache.disabled = false;
  writeCache(cache);
}

export { NPM_PACKAGE };
