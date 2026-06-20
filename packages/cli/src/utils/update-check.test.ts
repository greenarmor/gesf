import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const CACHE_DIR = path.join(os.homedir(), ".ges");
const CACHE_FILE = path.join(CACHE_DIR, "update-check.json");

let savedCache: string | null = null;

beforeEach(() => {
  if (fs.existsSync(CACHE_FILE)) {
    savedCache = fs.readFileSync(CACHE_FILE, "utf-8");
  } else {
    savedCache = null;
  }
});

afterEach(() => {
  if (savedCache !== null) {
    fs.writeFileSync(CACHE_FILE, savedCache);
  } else if (fs.existsSync(CACHE_FILE)) {
    fs.unlinkSync(CACHE_FILE);
  }
});

describe("compareVersions", () => {
  it("can be imported and compares versions", async () => {
    const mod = await import("./update-check.js");
    expect(mod.compareVersions("1.0.0", "1.0.0")).toBe(0);
    expect(mod.compareVersions("1.5.0", "1.5.4")).toBe(-1);
    expect(mod.compareVersions("2.0.0", "1.9.9")).toBe(1);
    expect(mod.compareVersions("1.10.0", "1.9.0")).toBe(1);
    expect(mod.compareVersions("v1.5.4", "1.5.4")).toBe(0);
  });
});

describe("dismissVersion", () => {
  it("writes dismissed version to cache", async () => {
    if (fs.existsSync(CACHE_FILE)) fs.unlinkSync(CACHE_FILE);
    const mod = await import("./update-check.js");
    mod.dismissVersion("9.9.9");
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    expect(cache.dismissed_versions).toContain("9.9.9");
  });

  it("does not duplicate already-dismissed versions", async () => {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      latest_version: null,
      checked_at: null,
      dismissed_versions: ["9.9.9"],
      disabled: false,
    }));
    const mod = await import("./update-check.js");
    mod.dismissVersion("9.9.9");
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    expect(cache.dismissed_versions.filter((v: string) => v === "9.9.9")).toHaveLength(1);
  });
});

describe("disable/enable update checks", () => {
  it("can disable and re-enable checks", async () => {
    if (fs.existsSync(CACHE_FILE)) fs.unlinkSync(CACHE_FILE);
    const mod = await import("./update-check.js");

    mod.disableUpdateChecks();
    let cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    expect(cache.disabled).toBe(true);

    mod.enableUpdateChecks();
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    expect(cache.disabled).toBe(false);
  });
});

describe("checkForUpdate with cache", () => {
  it("returns cached version without network call", async () => {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const future = new Date(Date.now() + 3600000).toISOString();
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      latest_version: "0.0.1",
      checked_at: future,
      dismissed_versions: [],
      disabled: false,
    }));

    const mod = await import("./update-check.js");
    const result = await mod.checkForUpdate();
    expect(result.latestVersion).toBe("0.0.1");
    expect(result.updateAvailable).toBe(false);
  });

  it("respects disabled flag", async () => {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const future = new Date(Date.now() + 3600000).toISOString();
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      latest_version: "99.0.0",
      checked_at: future,
      dismissed_versions: [],
      disabled: true,
    }));

    const mod = await import("./update-check.js");
    const result = await mod.checkForUpdate();
    expect(result.latestVersion).toBeNull();
    expect(result.updateAvailable).toBe(false);
  });

  it("marks dismissed versions", async () => {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const future = new Date(Date.now() + 3600000).toISOString();
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      latest_version: "99.0.0",
      checked_at: future,
      dismissed_versions: ["99.0.0"],
      disabled: false,
    }));

    const mod = await import("./update-check.js");
    const result = await mod.checkForUpdate();
    expect(result.latestVersion).toBe("99.0.0");
    expect(result.updateAvailable).toBe(true);
    expect(result.dismissed).toBe(true);
  });
});
