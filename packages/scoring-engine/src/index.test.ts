import { describe, it, expect } from "vitest";
import {
  scoreByFramework,
  computeOverallScore,
  computeAuditImpact,
  generateScoreFile,
  formatScoreOutput,
  computeGrade,
  SEVERITY_WEIGHTS,
} from "./index.js";
import type { Control, FrameworkName } from "@greenarmor/ges-core";

function makeControl(
  overrides: Partial<Control> & { id: string; framework: FrameworkName; severity: Control["severity"]; status: Control["status"] },
): Control {
  return {
    name: overrides.id,
    description: `Description for ${overrides.id}`,
    category: "security",
    article: "ART32",
    checks: [{ id: `${overrides.id}-CHK1`, description: "Check", status: overrides.status }],
    implementation_guidance: "Implement this control.",
    ...overrides,
  };
}

describe("computeGrade", () => {
  it("assigns A for >= 90", () => {
    expect(computeGrade(100)).toBe("A");
    expect(computeGrade(90)).toBe("A");
  });

  it("assigns B for 80-89", () => {
    expect(computeGrade(89)).toBe("B");
    expect(computeGrade(80)).toBe("B");
  });

  it("assigns C for 65-79", () => {
    expect(computeGrade(79)).toBe("C");
    expect(computeGrade(65)).toBe("C");
  });

  it("assigns D for 50-64", () => {
    expect(computeGrade(64)).toBe("D");
    expect(computeGrade(50)).toBe("D");
  });

  it("assigns F for < 50", () => {
    expect(computeGrade(49)).toBe("F");
    expect(computeGrade(0)).toBe("F");
  });
});

describe("scoreByFramework", () => {
  it("skips framework with no controls", () => {
    const result = scoreByFramework([], ["GDPR"]);
    expect(result.GDPR).toBeUndefined();
  });

  it("gives 100% when all controls pass", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "C2", framework: "GDPR", severity: "high", status: "pass" }),
      makeControl({ id: "C3", framework: "GDPR", severity: "medium", status: "pass" }),
    ];
    const result = scoreByFramework(controls, ["GDPR"]);
    expect(result.GDPR.score).toBe(100);
    expect(result.GDPR.grade).toBe("A");
    expect(result.GDPR.passed_controls).toBe(3);
  });

  it("gives 100% when all controls are not-applicable", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "not-applicable" }),
    ];
    const result = scoreByFramework(controls, ["GDPR"]);
    expect(result.GDPR.score).toBe(100);
  });

  it("gives 0% when all controls fail", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "fail" }),
      makeControl({ id: "C2", framework: "GDPR", severity: "low", status: "fail" }),
    ];
    const result = scoreByFramework(controls, ["GDPR"]);
    expect(result.GDPR.score).toBe(0);
    expect(result.GDPR.grade).toBe("F");
    expect(result.GDPR.critical_failures).toBe(1);
  });

  it("gives 0% when all controls are not-implemented", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "high", status: "not-implemented" }),
    ];
    const result = scoreByFramework(controls, ["GDPR"]);
    expect(result.GDPR.score).toBe(0);
    expect(result.GDPR.not_implemented).toBe(1);
  });

  it("gives partial credit for warnings (50%)", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "high", status: "warning" }),
      makeControl({ id: "C2", framework: "GDPR", severity: "high", status: "pass" }),
    ];
    const result = scoreByFramework(controls, ["GDPR"]);
    expect(result.GDPR.score).toBe(75);
    expect(result.GDPR.warning_controls).toBe(1);
  });

  it("weights critical controls heavier than low controls", () => {
    const criticalFailLowPass: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "fail" }),
      makeControl({ id: "C2", framework: "GDPR", severity: "low", status: "pass" }),
    ];
    const lowFailCriticalPass: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "C2", framework: "GDPR", severity: "low", status: "fail" }),
    ];

    const r1 = scoreByFramework(criticalFailLowPass, ["GDPR"]);
    const r2 = scoreByFramework(lowFailCriticalPass, ["GDPR"]);

    expect(r2.GDPR.score).toBeGreaterThan(r1.GDPR.score);
  });

  it("applies critical failure cap", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "low", status: "pass" }),
      makeControl({ id: "C2", framework: "GDPR", severity: "low", status: "pass" }),
      makeControl({ id: "C3", framework: "GDPR", severity: "critical", status: "fail" }),
    ];
    const result = scoreByFramework(controls, ["GDPR"]);

    expect(result.GDPR.critical_failures).toBe(1);
    expect(result.GDPR.score).toBeLessThanOrEqual(67);
  });

  it("produces severity breakdown", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "C2", framework: "GDPR", severity: "critical", status: "fail" }),
      makeControl({ id: "C3", framework: "GDPR", severity: "high", status: "warning" }),
      makeControl({ id: "C4", framework: "GDPR", severity: "medium", status: "pass" }),
    ];
    const result = scoreByFramework(controls, ["GDPR"]);
    const sb = result.GDPR.severity_breakdown;

    expect(sb.critical.total).toBe(2);
    expect(sb.critical.passed).toBe(1);
    expect(sb.critical.failed).toBe(1);
    expect(sb.high.total).toBe(1);
    expect(sb.high.warning).toBe(1);
    expect(sb.medium.total).toBe(1);
    expect(sb.medium.passed).toBe(1);
    expect(sb.low.total).toBe(0);
  });

  it("separates controls by framework", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "C2", framework: "OWASP", severity: "critical", status: "fail" }),
    ];
    const result = scoreByFramework(controls, ["GDPR", "OWASP"]);

    expect(result.GDPR.score).toBe(100);
    expect(result.OWASP.score).toBe(0);
  });
});

describe("computeOverallScore", () => {
  it("returns 0 for empty scores", () => {
    expect(computeOverallScore({})).toBe(0);
  });

  it("returns the score when only one framework", () => {
    const scores = {
      GDPR: {
        framework: "GDPR" as FrameworkName,
        score: 85,
        grade: "B" as const,
        total_controls: 10,
        passed_controls: 8,
        failed_controls: 1,
        warning_controls: 1,
        not_applicable: 0,
        not_implemented: 0,
        severity_breakdown: { critical: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, high: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, medium: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, low: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 } },
        critical_failures: 0,
        max_possible_score: 0,
        evaluated_at: new Date().toISOString(),
      },
    };
    expect(computeOverallScore(scores)).toBe(85);
  });

  it("weights by control count", () => {
    const scores = {
      GDPR: {
        framework: "GDPR" as FrameworkName,
        score: 100,
        grade: "A" as const,
        total_controls: 22,
        passed_controls: 22,
        failed_controls: 0,
        warning_controls: 0,
        not_applicable: 0,
        not_implemented: 0,
        severity_breakdown: { critical: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, high: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, medium: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, low: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 } },
        critical_failures: 0,
        max_possible_score: 0,
        evaluated_at: new Date().toISOString(),
      },
      OWASP: {
        framework: "OWASP" as FrameworkName,
        score: 50,
        grade: "D" as const,
        total_controls: 6,
        passed_controls: 3,
        failed_controls: 3,
        warning_controls: 0,
        not_applicable: 0,
        not_implemented: 0,
        severity_breakdown: { critical: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, high: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, medium: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 }, low: { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 } },
        critical_failures: 0,
        max_possible_score: 0,
        evaluated_at: new Date().toISOString(),
      },
    };

    const overall = computeOverallScore(scores);
    expect(overall).toBeGreaterThan(50);
    expect(overall).toBeLessThan(100);
  });
});

describe("computeAuditImpact", () => {
  it("returns 0 deduction for no findings", () => {
    const impact = computeAuditImpact([]);
    expect(impact.total_deduction).toBe(0);
    expect(impact.critical_findings).toBe(0);
  });

  it("deducts more for critical findings than low", () => {
    const criticalImpact = computeAuditImpact([{ severity: "critical" }]);
    const lowImpact = computeAuditImpact([{ severity: "low" }]);

    expect(criticalImpact.total_deduction).toBeGreaterThan(lowImpact.total_deduction);
  });

  it("caps deduction at 100", () => {
    const manyCritical = Array(20).fill({ severity: "critical" });
    const impact = computeAuditImpact(manyCritical);
    expect(impact.total_deduction).toBe(100);
  });

  it("counts findings by severity", () => {
    const impact = computeAuditImpact([
      { severity: "critical" },
      { severity: "critical" },
      { severity: "high" },
      { severity: "medium" },
      { severity: "low" },
    ]);
    expect(impact.critical_findings).toBe(2);
    expect(impact.high_findings).toBe(1);
    expect(impact.medium_findings).toBe(1);
    expect(impact.low_findings).toBe(1);
  });
});

describe("generateScoreFile", () => {
  it("produces a complete score file without findings", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "C2", framework: "OWASP", severity: "high", status: "pass" }),
    ];
    const file = generateScoreFile(controls, ["GDPR", "OWASP"]);

    expect(file.overall).toBeGreaterThan(0);
    expect(file.overall_grade).toBe("A");
    expect(file.frameworks.GDPR).toBeDefined();
    expect(file.frameworks.OWASP).toBeDefined();
    expect(file.audit_impact).toBeUndefined();
    expect(file.evaluated_at).toBeTruthy();
  });

  it("deducts score when findings are present", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "pass" }),
    ];
    const findings = [
      { severity: "critical" },
      { severity: "critical" },
      { severity: "high" },
    ];

    const fileWithoutFindings = generateScoreFile(controls, ["GDPR"]);
    const fileWithFindings = generateScoreFile(controls, ["GDPR"], findings);

    expect(fileWithFindings.overall).toBeLessThan(fileWithoutFindings.overall);
    expect(fileWithFindings.audit_impact).toBeDefined();
    expect(fileWithFindings.audit_impact!.critical_findings).toBe(2);
    expect(fileWithFindings.audit_impact!.high_findings).toBe(1);
  });

  it("never goes below 0", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "fail" }),
    ];
    const findings = Array(20).fill({ severity: "critical" });
    const file = generateScoreFile(controls, ["GDPR"], findings);

    expect(file.overall).toBeGreaterThanOrEqual(0);
  });
});

describe("formatScoreOutput", () => {
  it("produces formatted output with grades", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "C2", framework: "GDPR", severity: "high", status: "pass" }),
    ];
    const file = generateScoreFile(controls, ["GDPR"]);
    const output = formatScoreOutput(file);

    expect(output).toContain("COMPLIANCE SCORE REPORT");
    expect(output).toContain("GDPR");
    expect(output).toContain("%");
    expect(output).toContain("[A]");
    expect(output).toContain("Overall");
  });

  it("shows audit impact when present", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "pass" }),
    ];
    const file = generateScoreFile(controls, ["GDPR"], [{ severity: "critical" }]);
    const output = formatScoreOutput(file);

    expect(output).toContain("Audit Findings Impact");
    expect(output).toContain("deduction");
  });

  it("shows critical failure warning", () => {
    const controls: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "fail" }),
    ];
    const file = generateScoreFile(controls, ["GDPR"]);
    const output = formatScoreOutput(file);

    expect(output).toContain("critical control(s) failed");
  });
});

describe("severity weighting realism", () => {
  it("a single failing critical control drags score below failing low control", () => {
    const criticalFails: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "critical", status: "fail" }),
      ...Array.from({ length: 9 }, (_, i) =>
        makeControl({ id: `PASS-${i}`, framework: "GDPR", severity: "high", status: "pass" }),
      ),
    ];

    const lowFails: Control[] = [
      makeControl({ id: "C1", framework: "GDPR", severity: "low", status: "fail" }),
      ...Array.from({ length: 9 }, (_, i) =>
        makeControl({ id: `PASS-${i}`, framework: "GDPR", severity: "high", status: "pass" }),
      ),
    ];

    const r1 = scoreByFramework(criticalFails, ["GDPR"]);
    const r2 = scoreByFramework(lowFails, ["GDPR"]);

    expect(r2.GDPR.score).toBeGreaterThan(r1.GDPR.score);
  });

  it("reflects realistic project state: mixed pass/fail with severity", () => {
    const controls: Control[] = [
      makeControl({ id: "GDPR-1", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "GDPR-2", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "GDPR-3", framework: "GDPR", severity: "critical", status: "pass" }),
      makeControl({ id: "GDPR-4", framework: "GDPR", severity: "high", status: "pass" }),
      makeControl({ id: "GDPR-5", framework: "GDPR", severity: "high", status: "warning" }),
      makeControl({ id: "GDPR-6", framework: "GDPR", severity: "medium", status: "not-implemented" }),
      makeControl({ id: "GDPR-7", framework: "GDPR", severity: "low", status: "pass" }),
    ];

    const result = scoreByFramework(controls, ["GDPR"]);

    expect(result.GDPR.score).toBeGreaterThan(40);
    expect(result.GDPR.score).toBeLessThanOrEqual(85);
    expect(result.GDPR.total_controls).toBe(7);
    expect(result.GDPR.passed_controls).toBe(5);
    expect(result.GDPR.warning_controls).toBe(1);
    expect(result.GDPR.not_implemented).toBe(1);
    expect(result.GDPR.severity_breakdown.critical.passed).toBe(3);
    expect(result.GDPR.severity_breakdown.medium.not_implemented).toBe(1);
  });
});
