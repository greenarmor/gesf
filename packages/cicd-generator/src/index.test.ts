import { describe, it, expect } from "vitest";
import {
  generateComplianceWorkflow,
  generateSecurityWorkflow,
  generateDependencyScanWorkflow,
  generateSecretScanWorkflow,
  generateSbomWorkflow,
  generateAllWorkflows,
} from "./index.js";
import type { ProjectConfig } from "@greenarmor/ges-core";

const testConfig: ProjectConfig = {
  project_name: "TestApp",
  project_type: "saas",
  frameworks: ["GDPR", "OWASP"],
  requirements: {
    encryption: { required: true },
    mfa: { required: true },
    audit_logs: { required: true },
    backups: { required: true },
    retention_policy: { required: true },
    vulnerability_scanning: { required: true },
    authentication: { required: true },
    authorization: { required: true },
    secrets_management: { required: true },
    logging: { required: true },
    monitoring: { required: true },
    data_classification: { required: true },
    disaster_recovery: { required: true },
    incident_response: { required: true },
    privacy_controls: { required: true },
  },
  created_at: "2025-01-01",
  version: "1.0.0",
};

describe("generateComplianceWorkflow", () => {
  it("generates compliance.yml", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.filePath).toContain("compliance.yml");
    expect(wf.content).toContain("name: Compliance");
  });

  it("includes ges audit command", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("ges audit");
  });

  it("uses ubuntu-latest runner", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("ubuntu-latest");
  });
});

describe("generateSecurityWorkflow", () => {
  it("generates security.yml", () => {
    const wf = generateSecurityWorkflow(testConfig);
    expect(wf.filePath).toContain("security.yml");
  });

  it("includes security scanning", () => {
    const wf = generateSecurityWorkflow(testConfig);
    expect(wf.content.length).toBeGreaterThan(0);
  });
});

describe("generateDependencyScanWorkflow", () => {
  it("generates dependency-scan.yml", () => {
    const wf = generateDependencyScanWorkflow(testConfig);
    expect(wf.filePath).toContain("dependency-scan.yml");
  });
});

describe("generateSecretScanWorkflow", () => {
  it("generates secret-scan.yml", () => {
    const wf = generateSecretScanWorkflow(testConfig);
    expect(wf.filePath).toContain("secret-scan.yml");
  });
});

describe("generateSbomWorkflow", () => {
  it("generates sbom-scan.yml", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.filePath).toContain("sbom-scan.yml");
  });
});

describe("generateAllWorkflows", () => {
  it("generates all 5 workflows", () => {
    const wfs = generateAllWorkflows(testConfig);
    expect(wfs.length).toBe(5);
  });

  it("includes all workflow files", () => {
    const wfs = generateAllWorkflows(testConfig);
    const paths = wfs.map(w => w.filePath);
    expect(paths.some(p => p.includes("compliance.yml"))).toBe(true);
    expect(paths.some(p => p.includes("security.yml"))).toBe(true);
    expect(paths.some(p => p.includes("dependency-scan.yml"))).toBe(true);
    expect(paths.some(p => p.includes("secret-scan.yml"))).toBe(true);
    expect(paths.some(p => p.includes("sbom-scan.yml"))).toBe(true);
  });

  it("all workflows have content", () => {
    const wfs = generateAllWorkflows(testConfig);
    for (const wf of wfs) {
      expect(wf.content.length).toBeGreaterThan(0);
    }
  });

  it("all workflows are valid YAML with name field", () => {
    const wfs = generateAllWorkflows(testConfig);
    for (const wf of wfs) {
      expect(wf.content).toContain("name:");
    }
  });
});
