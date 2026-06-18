import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { runAudit } from "../index.js";

function setupProject(dir: string, opts: { governancePack?: boolean; records?: unknown[] } = {}): void {
  fs.mkdirSync(path.join(dir, ".ges"), { recursive: true });
  fs.mkdirSync(path.join(dir, "controls"), { recursive: true });

  fs.writeFileSync(
    path.join(dir, ".ges", "config.json"),
    JSON.stringify({ project_name: "Test", project_type: "saas", frameworks: ["GDPR"] }),
  );

  if (opts.governancePack) {
    fs.mkdirSync(path.join(dir, "controls", "governance"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "controls", "governance", "controls.json"),
      JSON.stringify({ pack_id: "governance", controls: [] }),
    );
  }

  if (opts.records !== undefined) {
    fs.writeFileSync(
      path.join(dir, ".ges", "governance-records.json"),
      JSON.stringify(opts.records),
    );
  }
}

function makeRecord(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "gov-test-1",
    system_name: "Test System",
    system_description: "A test system",
    system_type: "api",
    system_version: "1.0.0",
    risk_level: "high",
    status: "draft",
    created_by: "test",
    created_at: new Date().toISOString(),
    updated_by: "test",
    updated_at: new Date().toISOString(),
    record_version: 1,
    approval: null,
    committee: null,
    risk_assessment: null,
    policy_basis: null,
    evidence: [],
    review_cycle: null,
    data_inventory: null,
    compliance: null,
    ...overrides,
  };
}

describe("GovernanceScanner", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ges-gov-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("produces no findings when governance pack is not installed", () => {
    setupProject(tmpDir);
    const result = runAudit(tmpDir);
    const govFindings = result.findings.filter((f) => f.category === "governance");
    expect(govFindings).toHaveLength(0);
  });

  it("produces GOVP-001 when pack installed but no records", () => {
    setupProject(tmpDir, { governancePack: true });
    const result = runAudit(tmpDir);
    const govFindings = result.findings.filter((f) => f.category === "governance");
    expect(govFindings).toHaveLength(1);
    expect(govFindings[0].ruleId).toBe("GOVP-001");
    expect(govFindings[0].severity).toBe("high");
  });

  it("detects missing dimensions on a draft record", () => {
    setupProject(tmpDir, { governancePack: true, records: [makeRecord()] });
    const result = runAudit(tmpDir);
    const govFindings = result.findings.filter((f) => f.category === "governance");
    const ruleIds = govFindings.map((f) => f.ruleId).sort();
    expect(ruleIds).toEqual(
      ["GOVP-002", "GOVP-003", "GOVP-004", "GOVP-005", "GOVP-007", "GOVP-009", "GOVP-010", "GOVP-011"].sort(),
    );
  });

  it("produces zero findings for a fully valid record", () => {
    const futureDate = "2999-01-01";
    const record = makeRecord({
      status: "approved",
      approval: {
        approver_name: "Jane",
        approver_role: "CISO",
        approver_email: "",
        approval_authority: "Board",
        decision: "approved",
        decision_date: new Date().toISOString(),
        valid_from: new Date().toISOString().split("T")[0],
        valid_until: futureDate,
        conditions: [],
        rationale: "",
      },
      risk_assessment: {
        id: "risk-1",
        assessor: "John",
        assessment_date: new Date().toISOString(),
        methodology: "NIST RMF",
        risk_score: "6/10",
        residual_risk: "medium",
        identified_risks: [],
        mitigation_measures: [],
        evidence: [],
      },
      policy_basis: {
        policy_id: "ISP-001",
        policy_name: "InfoSec",
        version: "1.0",
        clauses: [],
        standard: "ISO 27001",
        evidence: [],
      },
      evidence: [
        {
          id: "ev-1",
          type: "document",
          title: "DPIA",
          source_system: "jira",
          reference: "DPIA-001",
          location_description: "Jira",
          added_by: "test",
          added_at: new Date().toISOString(),
        },
      ],
      review_cycle: {
        frequency: "annual",
        last_review: new Date().toISOString().split("T")[0],
        next_review: futureDate,
        review_history: [],
      },
      data_inventory: {
        personal_data_categories: ["emails"],
        processing_purposes: ["analytics"],
        data_subjects: [],
        cross_border_transfers: [],
        retention_period: "2 years",
      },
      compliance: {
        frameworks: ["GDPR"],
        controls_satisfied: [],
        control_pack_ids: [],
      },
    });

    setupProject(tmpDir, { governancePack: true, records: [record] });
    const result = runAudit(tmpDir);
    const govFindings = result.findings.filter((f) => f.category === "governance");
    expect(govFindings).toHaveLength(0);
  });

  it("detects expired approval", () => {
    const record = makeRecord({
      status: "approved",
      approval: {
        approver_name: "Jane",
        approver_role: "CISO",
        approver_email: "",
        approval_authority: "Board",
        decision: "approved",
        decision_date: "2020-01-01",
        valid_from: "2020-01-01",
        valid_until: "2020-12-31",
        conditions: [],
        rationale: "",
      },
      risk_assessment: {
        id: "risk-1",
        assessor: "John",
        assessment_date: "2020-01-01",
        methodology: "NIST RMF",
        risk_score: "6/10",
        residual_risk: "medium",
        identified_risks: [],
        mitigation_measures: [],
        evidence: [],
      },
      policy_basis: {
        policy_id: "ISP-001",
        policy_name: "InfoSec",
        version: "1.0",
        clauses: [],
        standard: "ISO 27001",
        evidence: [],
      },
      evidence: [
        {
          id: "ev-1",
          type: "document",
          title: "DPIA",
          source_system: "jira",
          reference: "DPIA-001",
          location_description: "Jira",
          added_by: "test",
          added_at: "2020-01-01",
        },
      ],
      review_cycle: {
        frequency: "annual",
        last_review: "2020-01-01",
        next_review: "2025-01-01",
        review_history: [],
      },
    });

    setupProject(tmpDir, { governancePack: true, records: [record] });
    const result = runAudit(tmpDir);
    const govFindings = result.findings.filter((f) => f.category === "governance");
    const expired = govFindings.find((f) => f.ruleId === "GOVP-008" && f.severity === "critical");
    expect(expired).toBeDefined();
    expect(expired!.title).toContain("Expired approval");
  });
});
