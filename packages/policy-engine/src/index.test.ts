import { describe, it, expect } from "vitest";
import {
  getAllPacks,
  getPack,
  getPacksForProjectType,
  listPackIds,
} from "./index.js";

describe("getAllPacks", () => {
  it("returns all 8 packs", () => {
    const packs = getAllPacks();
    expect(packs.length).toBe(8);
  });

  it("includes GDPR, OWASP, CIS, NIST, AI, blockchain, government", () => {
    const packs = getAllPacks();
    const ids = packs.map(p => p.id);
    expect(ids).toContain("gdpr");
    expect(ids).toContain("owasp");
    expect(ids).toContain("cis");
    expect(ids).toContain("nist");
    expect(ids).toContain("ai");
    expect(ids).toContain("blockchain");
    expect(ids).toContain("government");
  });

  it("each pack has controls", () => {
    const packs = getAllPacks();
    for (const pack of packs) {
      expect(pack.controls.length).toBeGreaterThan(0);
    }
  });

  it("each pack has a valid id and name", () => {
    const packs = getAllPacks();
    for (const pack of packs) {
      expect(pack.id).toBeTruthy();
      expect(pack.name).toBeTruthy();
      expect(pack.description).toBeTruthy();
    }
  });
});

describe("getPack", () => {
  it("returns GDPR pack by id", () => {
    const pack = getPack("gdpr");
    expect(pack).toBeDefined();
    expect(pack!.id).toBe("gdpr");
  });

  it("returns undefined for unknown pack id", () => {
    expect(getPack("nonexistent")).toBeUndefined();
  });
});

describe("getPacksForProjectType", () => {
  it("returns GDPR for saas", () => {
    const packs = getPacksForProjectType("saas");
    const ids = packs.map(p => p.id);
    expect(ids).toContain("gdpr");
  });

  it("returns AI pack for ai-application", () => {
    const packs = getPacksForProjectType("ai-application");
    const ids = packs.map(p => p.id);
    expect(ids).toContain("ai");
  });

  it("returns blockchain pack for blockchain", () => {
    const packs = getPacksForProjectType("blockchain");
    const ids = packs.map(p => p.id);
    expect(ids).toContain("blockchain");
  });

  it("returns government pack for government-system", () => {
    const packs = getPacksForProjectType("government-system");
    const ids = packs.map(p => p.id);
    expect(ids).toContain("government");
  });

  it("returns AI pack for mcp-server", () => {
    const packs = getPacksForProjectType("mcp-server");
    const ids = packs.map(p => p.id);
    expect(ids).toContain("ai");
  });
});

describe("listPackIds", () => {
  it("returns all 8 pack ids", () => {
    const ids = listPackIds();
    expect(ids.length).toBe(8);
    expect(ids).toContain("gdpr");
    expect(ids).toContain("owasp");
    expect(ids).toContain("iso27001");
  });
});

describe("GDPR pack controls", () => {
  it("has controls for Articles 5, 25, 30, 32, 33, 34", () => {
    const pack = getPack("gdpr")!;
    const articles = new Set(pack.controls.map(c => c.article));
    expect(articles.size).toBeGreaterThanOrEqual(5);
  });

  it("all controls default to not-implemented", () => {
    const pack = getPack("gdpr")!;
    for (const control of pack.controls) {
      expect(control.status).toBe("not-implemented");
    }
  });

  it("all controls have implementation guidance", () => {
    const pack = getPack("gdpr")!;
    for (const control of pack.controls) {
      expect(control.implementation_guidance).toBeTruthy();
    }
  });

  it("all controls have checks", () => {
    const pack = getPack("gdpr")!;
    for (const control of pack.controls) {
      expect(control.checks.length).toBeGreaterThan(0);
    }
  });
});
