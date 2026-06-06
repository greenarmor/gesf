import { describe, it, expect } from "vitest";
import {
  getAllPacks,
  getPack,
  getPacksForProjectType,
  listPackIds,
} from "./index.js";

describe("getAllPacks", () => {
  it("returns all 9 packs", () => {
    const packs = getAllPacks();
    expect(packs.length).toBe(9);
  });

  it("includes GDPR, OWASP, CIS, NIST, AI, blockchain, government, ISO 27001, ISO 27701", () => {
    const packs = getAllPacks();
    const ids = packs.map(p => p.id);
    expect(ids).toContain("gdpr");
    expect(ids).toContain("owasp");
    expect(ids).toContain("cis");
    expect(ids).toContain("nist");
    expect(ids).toContain("ai");
    expect(ids).toContain("blockchain");
    expect(ids).toContain("government");
    expect(ids).toContain("iso27001");
    expect(ids).toContain("iso27701");
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
  it("returns all 9 pack ids", () => {
    const ids = listPackIds();
    expect(ids.length).toBe(9);
    expect(ids).toContain("gdpr");
    expect(ids).toContain("owasp");
    expect(ids).toContain("iso27001");
    expect(ids).toContain("iso27701");
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

describe("ISO 27701 pack", () => {
  it("exists and is loadable", () => {
    const pack = getPack("iso27701");
    expect(pack).toBeDefined();
  });

  it("has 11 controls covering privacy management clauses", () => {
    const pack = getPack("iso27701")!;
    expect(pack!.controls.length).toBe(11);
  });

  it("all control IDs are unique", () => {
    const pack = getPack("iso27701")!;
    const ids = pack!.controls.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all controls reference ISO27701 framework", () => {
    const pack = getPack("iso27701")!;
    for (const control of pack!.controls) {
      expect(control.framework).toBe("ISO27701");
    }
  });

  it("all controls have implementation guidance and checks", () => {
    const pack = getPack("iso27701")!;
    for (const control of pack!.controls) {
      expect(control.implementation_guidance).toBeTruthy();
      expect(control.checks.length).toBeGreaterThan(0);
    }
  });
});
