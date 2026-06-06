import { describe, it, expect } from "vitest";
import {
  createGDPRControls,
  createArticle5Controls,
  createArticle25Controls,
  createArticle30Controls,
  createArticle32Controls,
  createArticle33Controls,
  createArticle34Controls,
  evaluateControl,
} from "./index.js";
import type { Control } from "@greenarmor/ges-core";

describe("createGDPRControls", () => {
  const controls = createGDPRControls();

  it("creates all GDPR controls", () => {
    expect(controls.length).toBe(22);
  });

  it("all controls have GDPR framework", () => {
    for (const c of controls) {
      expect(c.framework).toBe("GDPR");
    }
  });

  it("all controls default to not-implemented", () => {
    for (const c of controls) {
      expect(c.status).toBe("not-implemented");
    }
  });

  it("all controls have unique IDs", () => {
    const ids = controls.map(c => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all controls have severity", () => {
    for (const c of controls) {
      expect(["critical", "high", "medium", "low"]).toContain(c.severity);
    }
  });
});

describe("Article 5 controls", () => {
  it("creates 6 controls for data processing principles", () => {
    const controls = createArticle5Controls();
    expect(controls.length).toBe(6);
  });
});

describe("Article 25 controls", () => {
  it("creates 2 controls for privacy by design", () => {
    const controls = createArticle25Controls();
    expect(controls.length).toBe(2);
  });
});

describe("Article 30 controls", () => {
  it("creates 2 controls for processing records", () => {
    const controls = createArticle30Controls();
    expect(controls.length).toBe(2);
  });
});

describe("Article 32 controls", () => {
  it("creates 9 controls for security measures", () => {
    const controls = createArticle32Controls();
    expect(controls.length).toBe(9);
  });

  it("includes encryption at rest control", () => {
    const controls = createArticle32Controls();
    expect(controls.some(c => c.name.includes("Encryption at Rest"))).toBe(true);
  });

  it("includes audit logging control", () => {
    const controls = createArticle32Controls();
    expect(controls.some(c => c.name.includes("Audit Logging"))).toBe(true);
  });
});

describe("Article 33 controls", () => {
  it("creates 2 controls for breach notification", () => {
    const controls = createArticle33Controls();
    expect(controls.length).toBe(2);
  });
});

describe("Article 34 controls", () => {
  it("creates 1 control for breach communication", () => {
    const controls = createArticle34Controls();
    expect(controls.length).toBe(1);
  });
});

describe("evaluateControl", () => {
  function makeControl(checkStatuses: string[]): Control {
    return {
      id: "TEST-001",
      name: "Test",
      description: "Test",
      category: "test",
      framework: "GDPR",
      article: "Test",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Test",
      checks: checkStatuses.map((status, i) => ({
        id: `TEST-001-C${i + 1}`,
        description: `Check ${i + 1}`,
        status: status as "pass" | "fail" | "not-implemented",
      })),
    };
  }

  it("returns pass when all checks pass", () => {
    const control = evaluateControl(makeControl(["pass", "pass"]));
    expect(control.status).toBe("pass");
  });

  it("returns warning when some checks pass", () => {
    const control = evaluateControl(makeControl(["pass", "fail"]));
    expect(control.status).toBe("warning");
  });

  it("returns not-implemented when no checks pass and status was not-implemented", () => {
    const control = evaluateControl(makeControl(["not-implemented", "not-implemented"]));
    expect(control.status).toBe("not-implemented");
  });

  it("returns fail when no checks pass and status was not not-implemented", () => {
    const control = evaluateControl(makeControl(["fail", "fail"]));
    const modified = { ...control, status: "fail" as const };
    const result = evaluateControl({ ...modified });
    expect(result.status).toBe("fail");
  });
});
