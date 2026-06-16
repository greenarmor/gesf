import { describe, it, expect } from "vitest";
import {
  getAllPacks,
  getPack,
  getPacksForProjectType,
  listPackIds,
} from "./index.js";

describe("getAllPacks", () => {
  it("returns all 11 packs", () => {
    const packs = getAllPacks();
    expect(packs.length).toBe(11);
  });

  it("includes GDPR, OWASP, CIS, NIST, AI, blockchain, government, ISO 27001, ISO 27701, HIPAA", () => {
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
    expect(ids).toContain("hipaa");
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
  it("returns all 11 pack ids", () => {
    const ids = listPackIds();
    expect(ids.length).toBe(11);
    expect(ids).toContain("gdpr");
    expect(ids).toContain("owasp");
    expect(ids).toContain("iso27001");
    expect(ids).toContain("iso27701");
    expect(ids).toContain("hipaa");
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

describe("HIPAA pack", () => {
  it("exists and is loadable", () => {
    const pack = getPack("hipaa");
    expect(pack).toBeDefined();
  });

  it("has 10 controls covering HIPAA Security and Privacy Rules", () => {
    const pack = getPack("hipaa");
    expect(pack!.controls.length).toBe(10);
  });

  it("all control IDs are unique", () => {
    const pack = getPack("hipaa");
    const ids = pack!.controls.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all controls reference HIPAA framework", () => {
    const pack = getPack("hipaa");
    for (const control of pack!.controls) {
      expect(control.framework).toBe("HIPAA");
    }
  });

  it("covers 164.312 technical safeguards", () => {
    const pack = getPack("hipaa");
    const ids = pack!.controls.map(c => c.id);
    expect(ids).toContain("HIPAA-164.312-a");
    expect(ids).toContain("HIPAA-164.312-b");
    expect(ids).toContain("HIPAA-164.312-c");
    expect(ids).toContain("HIPAA-164.312-d");
    expect(ids).toContain("HIPAA-164.312-e");
  });

  it("all controls have implementation guidance and checks", () => {
    const pack = getPack("hipaa");
    for (const control of pack!.controls) {
      expect(control.implementation_guidance).toBeTruthy();
      expect(control.checks.length).toBeGreaterThan(0);
    }
  });
});
