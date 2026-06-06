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
