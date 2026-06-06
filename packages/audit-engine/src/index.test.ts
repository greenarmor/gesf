import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { deduplicateFindings, runAuditIncremental } from "./index.js";
import type { Finding } from "./scanners/types.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

function makeFinding(overrides: Partial<Finding>): Finding {
  return {
    ruleId: "SECRETS-001",
    severity: "critical",
    category: "secrets",
    title: "Test finding",
    description: "Test",
    file: "app.ts",
    line: 1,
    evidence: "password***",
    controlIds: ["GDPR-ART32-002"],
    fix: "Move to env var",
    ...overrides,
  };
}

describe("deduplicateFindings", () => {
  it("removes exact duplicate findings", () => {
    const f1 = makeFinding({});
    const f2 = makeFinding({});
    const result = deduplicateFindings([f1, f2]);
    expect(result.length).toBe(1);
  });

  it("keeps findings with different files", () => {
    const f1 = makeFinding({ file: "a.ts" });
    const f2 = makeFinding({ file: "b.ts" });
    const result = deduplicateFindings([f1, f2]);
    expect(result.length).toBe(2);
  });

  it("keeps findings with different lines", () => {
    const f1 = makeFinding({ line: 1 });
    const f2 = makeFinding({ line: 5 });
    const result = deduplicateFindings([f1, f2]);
    expect(result.length).toBe(2);
  });

  it("keeps findings with different rule IDs", () => {
    const f1 = makeFinding({ ruleId: "SECRETS-001" });
    const f2 = makeFinding({ ruleId: "CRYPTO-001" });
    const result = deduplicateFindings([f1, f2]);
    expect(result.length).toBe(2);
  });

  it("handles empty array", () => {
    expect(deduplicateFindings([])).toEqual([]);
  });

  it("dedupes by ruleId:file:line:evidence key", () => {
    const f1 = makeFinding({ ruleId: "X-001", file: "a.ts", line: 1, evidence: "abc" });
    const f2 = makeFinding({ ruleId: "X-001", file: "a.ts", line: 1, evidence: "abc", title: "Different title" });
    const result = deduplicateFindings([f1, f2]);
    expect(result.length).toBe(1);
  });
});

describe("runAuditIncremental", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-incr-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns findings on first run with no cache", () => {
    fs.writeFileSync(path.join(tmpDir, "app.ts"), 'const password = "secret123";');
    const result = runAuditIncremental(tmpDir);
    expect(result.scannedFiles).toBeGreaterThan(0);
    expect(result.changedFiles).toBeGreaterThan(0);
    expect(result.findings.length).toBeGreaterThanOrEqual(1);
  });

  it("returns same findings on second run with cache (0 changed)", () => {
    fs.writeFileSync(path.join(tmpDir, "app.ts"), 'const password = "secret123";');
    const first = runAuditIncremental(tmpDir);
    const second = runAuditIncremental(tmpDir, first.newCache);
    expect(second.changedFiles).toBe(0);
    expect(second.findings.length).toBe(first.findings.length);
  });

  it("detects new findings when a file changes", () => {
    fs.writeFileSync(path.join(tmpDir, "clean.ts"), 'const x = 1;');
    const first = runAuditIncremental(tmpDir);

    fs.writeFileSync(path.join(tmpDir, "bad.ts"), 'const password = "newsecret456";');
    const second = runAuditIncremental(tmpDir, first.newCache);
    expect(second.changedFiles).toBe(1);
    expect(second.findings.length).toBeGreaterThan(first.findings.length);
  });
});
