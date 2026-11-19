import { describe, it, expect } from "vitest";
import { generateMarkdownReport, generateHtmlReport, generatePdfReport } from "./index.js";
import type { Control, ScoreFile, ReportOptions } from "@greenarmor/ges-core";
import type { Finding } from "@greenarmor/ges-audit-engine";

const emptyBucket = { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 };

const testScore: ScoreFile = {
  overall: 75,
  overall_grade: "C",
  frameworks: {
    GDPR: {
      framework: "GDPR",
      score: 75,
      grade: "C",
      total_controls: 10,
      passed_controls: 7,
      failed_controls: 2,
      warning_controls: 1,
      not_applicable: 0,
      not_implemented: 0,
      severity_breakdown: { critical: emptyBucket, high: emptyBucket, medium: emptyBucket, low: emptyBucket },
      critical_failures: 1,
      max_possible_score: 100,
      evaluated_at: "2025-01-01",
    },
  },
  evaluated_at: "2025-01-01",
};

const testOptions: ReportOptions = {
  format: "markdown",
  title: "Test Report",
  include_executive_summary: true,
  include_risk_assessment: true,
  include_compliance: true,
  include_security: true,
};

const testControls: Control[] = [
  {
    id: "GDPR-ART32-001",
    name: "Test Control",
    description: "Test",
    category: "encryption",
    framework: "GDPR",
    article: "Article 32",
    status: "pass",
    severity: "critical",
    implementation_guidance: "Test",
    checks: [{ id: "C1", description: "Check", status: "pass" }],
  },
];

const testFindings: Finding[] = [
  {
    ruleId: "SECRETS-001",
    severity: "critical",
    category: "secrets",
    title: "Hardcoded password",
    description: "Test",
    file: "app.ts",
    line: 1,
    evidence: "pass***",
    controlIds: ["GDPR-ART32-002"],
    fix: "Move to env var",
  },
];

describe("generateMarkdownReport", () => {
  it("generates a markdown report", () => {
    const report = generateMarkdownReport(testOptions, testScore, testControls);
    expect(report.length).toBeGreaterThan(0);
  });

  it("includes report title", () => {
    const report = generateMarkdownReport(testOptions, testScore, testControls);
    expect(report).toContain("# Test Report");
  });

  it("includes executive summary when enabled", () => {
    const report = generateMarkdownReport(testOptions, testScore, testControls);
    expect(report).toContain("Executive Summary");
  });

  it("excludes executive summary when disabled", () => {
    const opts = { ...testOptions, include_executive_summary: false };
    const report = generateMarkdownReport(opts, testScore, testControls);
    expect(report).not.toContain("Executive Summary");
  });

  it("includes findings when provided", () => {
    const report = generateMarkdownReport(testOptions, testScore, testControls, testFindings);
    expect(report).toContain("Hardcoded password");
  });

  it("includes overall score", () => {
    const report = generateMarkdownReport(testOptions, testScore, testControls);
    expect(report).toContain("75%");
  });

  it("includes recommendations section", () => {
    const report = generateMarkdownReport(testOptions, testScore, testControls);
    expect(report).toContain("Recommendations");
  });
});

describe("generateHtmlReport", () => {
  it("generates an HTML report", () => {
    const report = generateHtmlReport(testOptions, testScore, testControls);
    expect(report.length).toBeGreaterThan(0);
  });

  it("includes HTML structure", () => {
    const report = generateHtmlReport(testOptions, testScore, testControls);
    expect(report).toContain("<html");
    expect(report).toContain("</html>");
  });

  it("includes report title", () => {
    const report = generateHtmlReport(testOptions, testScore, testControls);
    expect(report).toContain("Test Report");
  });

  it("includes executive summary when enabled", () => {
    const report = generateHtmlReport(testOptions, testScore, testControls);
    expect(report).toContain("Executive Summary");
  });
});

describe("generatePdfReport", () => {
  it("generates a valid PDF", () => {
    const pdf = generatePdfReport(testOptions, testScore, testControls);
    expect(pdf).toContain("%PDF-1.4");
    expect(pdf).toContain("%%EOF");
  });

  it("contains catalog and page objects", () => {
    const pdf = generatePdfReport(testOptions, testScore, testControls);
    expect(pdf).toContain("/Type /Catalog");
    expect(pdf).toContain("/Type /Pages");
    expect(pdf).toContain("/Type /Page");
  });

  it("contains font references", () => {
    const pdf = generatePdfReport(testOptions, testScore, testControls);
    expect(pdf).toContain("/Type /Font");
    expect(pdf).toContain("Helvetica");
  });

  it("has an xref table", () => {
    const pdf = generatePdfReport(testOptions, testScore, testControls);
    expect(pdf).toContain("xref");
    expect(pdf).toContain("trailer");
    expect(pdf).toContain("startxref");
  });
});

// ---------------------------------------------------------------------------
// NIST SP 800-53 assessment reports
// ---------------------------------------------------------------------------
import {
  sanitizeEvidenceForReport,
  generateNistAssessmentMarkdownReport,
  generateNistAssessmentHtmlReport,
  buildNistAssessmentJsonReport,
} from "./index.js";
import type { NistReportInput } from "./index.js";
import type {
  NistAssessmentSummary,
  NistEvidenceItem,
  NistFinding,
  NistPoamItem,
} from "@greenarmor/ges-core";

const summary: NistAssessmentSummary = {
  baseline_label: "Moderate Baseline",
  baseline_kind: "moderate",
  applicable_controls: 3,
  assessed: 2,
  satisfied: 1,
  other_than_satisfied: 1,
  not_assessed: 1,
  not_applicable: 0,
  awaiting_evidence: 1,
  open_findings: 1,
  open_poam: 1,
  overdue_poam: 0,
  implementation_status_counts: {
    "not-implemented": 1,
    planned: 0,
    "partially-implemented": 1,
    implemented: 1,
    "alternative-implementation": 0,
    inherited: 0,
    "not-applicable": 0,
  },
  determination_counts: {
    "not-assessed": 1,
    satisfied: 1,
    "other-than-satisfied": 1,
    "not-applicable": 0,
  },
};

const evidence: NistEvidenceItem[] = [
  {
    id: "nist-evid-1",
    title: "Public access policy",
    description: "Public wiki page.",
    evidence_type: "policy",
    control_ids: ["AC-1"],
    assessment_ids: [],
    source_system: "wiki",
    url: "https://wiki.example.test/ac-policy",
    collected_at: "2026-06-01",
    collection_method: "export",
    collected_by: "auditor",
    owner: "security",
    review_status: "approved",
    classification: "public",
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "nist-evid-2",
    title: "Restricted pentest report",
    description: "Confidential vendor report.",
    evidence_type: "penetration-test",
    control_ids: ["RA-5"],
    assessment_ids: [],
    source_system: "vendor portal",
    file_reference: "evidence/pentest-2026.pdf",
    collected_at: "2026-06-02",
    collection_method: "vendor delivery",
    collected_by: "vendor",
    owner: "security",
    review_status: "approved",
    classification: "restricted",
    created_at: "2026-06-02T00:00:00Z",
    updated_at: "2026-06-02T00:00:00Z",
  },
];

const findings: NistFinding[] = [
  {
    id: "nist-find-1",
    control_id: "AC-3",
    title: "Access enforcement gap",
    description: "Policy not enforced on staging.",
    severity: "high",
    evidence_ids: [],
    status: "open",
    created_at: "2026-06-03T00:00:00Z",
    updated_at: "2026-06-03T00:00:00Z",
  },
];

const poam: NistPoamItem[] = [
  {
    id: "nist-poam-1",
    control_id: "AC-3",
    finding_id: "nist-find-1",
    title: "Enforce access policy on staging",
    description: "Staging bypasses the policy enforcement point.",
    remediation_strategy: "Route staging through the enforcement point.",
    corrective_actions: ["Update ingress"],
    owner: "platform",
    milestones: [{ id: "nist-mile-1", title: "Ingress update", due_date: "2099-01-01", status: "planned" }],
    status: "in-progress",
    closure_evidence_ids: [],
    created_at: "2026-06-03T00:00:00Z",
    updated_at: "2026-06-03T00:00:00Z",
  },
];

const input: NistReportInput = {
  system_name: "TestApp",
  scope: "Production system boundary",
  baseline_label: "Moderate Baseline",
  catalog_version: "5.2.0",
  assessment_period: { from: "2026-06-01", to: "2026-06-30" },
  assessor: "Assessor A",
  generated_at: "2026-06-30T12:00:00Z",
  summary,
  workflow_state: "assessment-completed",
  controls: [
    {
      id: "AC-2",
      title: "Account Management",
      family: "AC",
      implementation_status: "implemented",
      determination: "satisfied",
      assessor: "Assessor A",
      assessment_date: "2026-06-10",
      owner: "identity-team",
      evidence_count: 1,
      open_findings: 0,
      open_poam: 0,
    },
    {
      id: "AC-3",
      title: "Access Enforcement",
      family: "AC",
      implementation_status: "partially-implemented",
      determination: "other-than-satisfied",
      assessor: "Assessor A",
      assessment_date: "2026-06-11",
      owner: "platform",
      evidence_count: 0,
      open_findings: 1,
      open_poam: 1,
    },
    {
      id: "AU-2",
      title: "Audit Events",
      family: "AU",
      implementation_status: undefined,
      determination: undefined,
      evidence_count: 0,
      open_findings: 0,
      open_poam: 0,
    },
  ],
  evidence,
  findings,
  poam,
};

describe("sanitizeEvidenceForReport", () => {
  it("keeps identification metadata only, dropping URLs and file references", () => {
    const sanitized = sanitizeEvidenceForReport(evidence);
    expect(sanitized).toHaveLength(2);
    for (const entry of sanitized) {
      expect(entry).not.toHaveProperty("url");
      expect(entry).not.toHaveProperty("file_reference");
      expect(entry).not.toHaveProperty("description");
    }
    expect(sanitized[0].classification).toBe("public");
    expect(sanitized[1].classification).toBe("restricted");
    expect(sanitized[1].control_ids).toEqual(["RA-5"]);
  });
});

describe("generateNistAssessmentMarkdownReport", () => {
  it("includes system context, coverage and unassessed controls", () => {
    const report = generateNistAssessmentMarkdownReport(input);
    expect(report).toContain("NIST SP 800-53 Control Assessment Report");
    expect(report).toContain("**System:** TestApp");
    expect(report).toContain("Moderate Baseline");
    expect(report).toContain("OSCAL 5.2.0");
    expect(report).toContain("Assessor A");
    expect(report).toContain("AC-2");
    expect(report).toContain("other-than-satisfied");
    expect(report).toContain("AU-2");
  });

  it("never leaks confidential evidence references into the report", () => {
    const report = generateNistAssessmentMarkdownReport(input);
    expect(report).not.toContain("evidence/pentest-2026.pdf");
    expect(report).not.toContain("vendor portal");
    expect(report).not.toContain("https://wiki.example.test/ac-policy");
    expect(report).toContain("references are withheld");
    expect(report).toContain("Restricted pentest report");
  });

  it("carries an explicit not-a-certification disclaimer", () => {
    const report = generateNistAssessmentMarkdownReport(input);
    expect(report).toContain("not a certification");
    expect(report).not.toContain("NIST certified");
    expect(report.toLowerCase()).not.toContain("nist-certified");
  });

  it("lists open findings and POA&M remediation milestones", () => {
    const report = generateNistAssessmentMarkdownReport(input);
    expect(report).toContain("Access enforcement gap");
    expect(report).toContain("Enforce access policy on staging");
    expect(report).toContain("Ingress update");
  });
});

describe("generateNistAssessmentHtmlReport", () => {
  it("produces HTML with the same safeguards", () => {
    const html = generateNistAssessmentHtmlReport(input);
    expect(html).toContain("<");
    expect(html).toContain("TestApp");
    expect(html).not.toContain("evidence/pentest-2026.pdf");
    expect(html).not.toContain("https://wiki.example.test/ac-policy");
  });
});

describe("buildNistAssessmentJsonReport", () => {
  it("exports machine-readable JSON with sanitized evidence", () => {
    const raw = buildNistAssessmentJsonReport(input);
    const parsed = JSON.parse(raw);
    expect(parsed.system_name).toBe("TestApp");
    expect(parsed.summary.satisfied).toBe(1);
    expect(Array.isArray(parsed.controls)).toBe(true);
    const evidenceEntries = JSON.stringify(parsed.evidence);
    expect(evidenceEntries).not.toContain("pentest-2026.pdf");
    expect(evidenceEntries).not.toContain("wiki.example.test");
    expect(parsed.disclaimer).toBeTruthy();
  });
});
