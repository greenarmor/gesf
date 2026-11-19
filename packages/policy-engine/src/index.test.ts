import { describe, it, expect } from "vitest";
import {
  getAllPacks,
  getPack,
  getPacksForProjectType,
  listPackIds,
  listFamilyCodes,
  getAllNistControls,
  getNistControl,
  getCatalogMetadata,
  getCatalogStats,
  getNistBaseline,
  resolveBaselineControlIds,
  searchNistControls,
  getNistCrosswalkMappings,
  getCrosswalksForControl,
} from "./index.js";

describe("getAllPacks", () => {
  it("returns all 34 packs", () => {
    const packs = getAllPacks();
    expect(packs.length).toBe(34);
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
  it("returns all 34 pack ids", () => {
    const ids = listPackIds();
    expect(ids.length).toBe(34);
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

describe("NIST SP 800-53 Rev. 5 control catalog", () => {
  it("contains all 20 control families", () => {
    const codes = listFamilyCodes();
    expect(codes).toEqual([
      "AC", "AT", "AU", "CA", "CM", "CP", "IA", "IR", "MA", "MP",
      "PE", "PL", "PM", "PS", "PT", "RA", "SA", "SC", "SI", "SR",
    ]);
  });

  it("has unique control IDs across the entire catalog including enhancements", () => {
    const all = getAllNistControls();
    const ids = all.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(all.length).toBeGreaterThan(1000);
  });

  it("preserves official identifiers for base controls and enhancements", () => {
    const ac2 = getNistControl("AC-2");
    expect(ac2).toBeDefined();
    expect(ac2!.title).toBe("Account Management");
    expect(ac2!.enhancements!.length).toBeGreaterThan(0);
    const enh = getNistControl("AC-2(3)");
    expect(enh).toBeDefined();
    expect(enh!.is_enhancement).toBe(true);
    expect(enh!.parent_id).toBe("AC-2");
    expect(enh!.title).toBe("Disable Accounts");
  });

  it("normalizes user input in multiple forms", () => {
    expect(getNistControl("ac-2.3")!.id).toBe("AC-2(3)");
    expect(getNistControl("AC 2(3)")!.id).toBe("AC-2(3)");
    expect(getNistControl("ac-2")!.id).toBe("AC-2");
    expect(getNistControl("BOGUS-999")).toBeUndefined();
  });

  it("includes statements, guidance, objectives and SP 800-53A methods", () => {
    const ac2 = getNistControl("AC-2")!;
    expect(ac2.statement.length).toBeGreaterThan(50);
    expect(ac2.supplemental_guidance).toBeTruthy();
    expect(ac2.objectives!.length).toBeGreaterThan(5);
    const methodKinds = ac2.methods!.map((m) => m.method);
    expect(methodKinds).toContain("examine");
    expect(methodKinds).toContain("interview");
    expect(methodKinds).toContain("test");
    expect(ac2.parameters!.length).toBeGreaterThan(0);
  });

  it("records catalog provenance (revision, source, import date)", () => {
    const meta = getCatalogMetadata();
    expect(meta.oscal_version).toMatch(/^5\./);
    expect(meta.source).toContain("oscal-content");
    expect(meta.import_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("computes catalog statistics from the actual catalog", () => {
    const stats = getCatalogStats();
    expect(stats.families).toBe(20);
    expect(stats.base_controls).toBeGreaterThan(300);
    expect(stats.total_entries).toBe(stats.base_controls + stats.enhancements);
    expect(stats.objectives).toBeGreaterThan(1000);
  });

  it("resolves parameter inserts in statements", () => {
    const enh = getNistControl("AC-2(3)")!;
    expect(enh.statement).not.toContain("{{ insert: param");
  });
});

describe("NIST SP 800-53B baselines", () => {
  it("provides low, moderate and high baselines that fully resolve", () => {
    for (const name of ["low", "moderate", "high"] as const) {
      const baseline = getNistBaseline(name);
      expect(baseline.control_ids.length).toBeGreaterThan(100);
      const resolution = resolveBaselineControlIds(baseline.control_ids);
      expect(resolution.unknown).toEqual([]);
    }
  });

  it("moderate baseline is a superset of low, high a superset of moderate", () => {
    const low = new Set(getNistBaseline("low").control_ids);
    const moderate = new Set(getNistBaseline("moderate").control_ids);
    const high = new Set(getNistBaseline("high").control_ids);
    for (const id of low) expect(moderate.has(id)).toBe(true);
    for (const id of moderate) expect(high.has(id)).toBe(true);
  });

  it("includes parent base controls when an enhancement is selected", () => {
    const resolution = resolveBaselineControlIds(["AC-2(3)"]);
    expect(resolution.resolved).toContain("AC-2");
    expect(resolution.resolved).toContain("AC-2(3)");
  });

  it("reports unknown controls instead of silently dropping them", () => {
    const resolution = resolveBaselineControlIds(["AC-1", "ZZ-99"]);
    expect(resolution.unknown).toEqual(["ZZ-99"]);
    expect(resolution.resolved).toEqual(["AC-1"]);
  });

  it("searches controls by id and title", () => {
    expect(searchNistControls("AC-2").length).toBeGreaterThan(3);
    expect(searchNistControls("Account Management").some((c) => c.id === "AC-2")).toBe(true);
  });
});

describe("NIST crosswalk mappings", () => {
  it("maps NIST CSF 2.0 outcomes to SP 800-53 via informative references", () => {
    const mappings = getNistCrosswalkMappings();
    const csf = mappings.filter((m) => m.from_framework === "NIST-CSF-2.0");
    expect(csf.length).toBeGreaterThan(20);
    for (const mapping of csf) {
      expect(mapping.relationship).toBe("informative-reference");
      expect(getNistControl(mapping.to_id)).toBeDefined();
    }
  });

  it("maps GESF policy pack control IDs to official catalog IDs", () => {
    const mappings = getNistCrosswalkMappings().filter((m) => m.from_framework === "GESF");
    expect(mappings.length).toBeGreaterThan(50);
    expect(getCrosswalksForControl("AC-2").length).toBeGreaterThan(0);
  });
});
