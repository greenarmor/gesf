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
  frameworks: ["GDPR", "OWASP", "CIS", "NIST"],
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
    expect(wf.content).toContain("name: Compliance Gate");
  });

  it("includes ges audit --ci command", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("ges audit --ci");
  });

  it("includes ges init step (required in CI)", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("ges init");
    expect(wf.content).toContain("--force");
  });

  it("does NOT include ges scan (uses native actions instead)", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).not.toContain("ges scan");
  });

  it("uses config project type in init", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("--type \"saas\"");
  });

  it("uses config frameworks in init", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("--frameworks \"GDPR,OWASP,CIS,NIST\"");
  });

  it("uses auto-aware default branch for badge steps", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("github.event.repository.default_branch");
  });

  it("does not hardcode main or master branches", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).not.toContain("branches: [main");
    expect(wf.content).not.toContain("branches: [master");
  });

  it("includes compliance badge generation", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("ges badge");
  });

  it("installs specific GESF version", () => {
    const wf = generateComplianceWorkflow(testConfig);
    expect(wf.content).toContain("@greenarmor/ges@");
  });
});

describe("generateSecurityWorkflow", () => {
  it("generates security.yml", () => {
    const wf = generateSecurityWorkflow(testConfig);
    expect(wf.filePath).toContain("security.yml");
    expect(wf.content).toContain("Security Gate");
  });

  it("includes Semgrep SAST scanning", () => {
    const wf = generateSecurityWorkflow(testConfig);
    expect(wf.content).toContain("semgrep");
    expect(wf.content).toContain("returntocorp/semgrep-action");
  });

  it("does NOT include ges commands (uses native action)", () => {
    const wf = generateSecurityWorkflow(testConfig);
    expect(wf.content).not.toContain("ges scan");
    expect(wf.content).not.toContain("ges init");
  });

  it("does not hardcode branch names", () => {
    const wf = generateSecurityWorkflow(testConfig);
    expect(wf.content).not.toContain("branches: [main");
    expect(wf.content).not.toContain("branches: [master");
  });
});

describe("generateDependencyScanWorkflow", () => {
  it("generates dependency-scan.yml", () => {
    const wf = generateDependencyScanWorkflow(testConfig);
    expect(wf.filePath).toContain("dependency-scan.yml");
    expect(wf.content).toContain("Dependency Gate");
  });

  it("includes Trivy with exit-code for gating", () => {
    const wf = generateDependencyScanWorkflow(testConfig);
    expect(wf.content).toContain("exit-code: '1'");
    expect(wf.content).toContain("aquasecurity/trivy-action");
  });

  it("includes npm audit without continue-on-error (is a gate)", () => {
    const wf = generateDependencyScanWorkflow(testConfig);
    expect(wf.content).toContain("npm audit");
    expect(wf.content).not.toContain("continue-on-error: true");
  });
});

describe("generateSecretScanWorkflow", () => {
  it("generates secret-scan.yml", () => {
    const wf = generateSecretScanWorkflow(testConfig);
    expect(wf.filePath).toContain("secret-scan.yml");
    expect(wf.content).toContain("Secret Gate");
  });

  it("uses Gitleaks with full git history", () => {
    const wf = generateSecretScanWorkflow(testConfig);
    expect(wf.content).toContain("gitleaks-action");
    expect(wf.content).toContain("fetch-depth: 0");
  });
});

describe("generateSbomWorkflow", () => {
  it("generates sbom-scan.yml", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.filePath).toContain("sbom-scan.yml");
  });

  it("includes Syft for filesystem SBOM", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.content).toContain("sbom-action");
    expect(wf.content).toContain("sbom-filesystem.json");
  });

  it("includes Grype for vulnerability scanning", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.content).toContain("scan-action");
    expect(wf.content).toContain("fail-build: true");
  });

  it("includes container image scan (conditional on Dockerfile)", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.content).toContain("container-scan");
    expect(wf.content).toContain("docker/build-push-action");
    expect(wf.content).toContain("hashFiles('Dockerfile'");
  });

  it("includes IaC config scan (conditional on K8s/Terraform files)", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.content).toContain("iac-scan");
    expect(wf.content).toContain("scan-type: 'config'");
    expect(wf.content).toContain("'k8s/**'");
    expect(wf.content).toContain("'terraform/**'");
  });

  it("uses SARIF output for Security tab integration", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.content).toContain("sarif");
  });

  it("container scan uses exit-code for gating", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.content).toContain("exit-code: '1'");
  });

  it("does not hardcode branch names", () => {
    const wf = generateSbomWorkflow(testConfig);
    expect(wf.content).not.toContain("branches: [main");
    expect(wf.content).not.toContain("branches: [master");
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

  it("no workflow hardcodes branch names", () => {
    const wfs = generateAllWorkflows(testConfig);
    for (const wf of wfs) {
      expect(wf.content).not.toContain("branches: [main");
      expect(wf.content).not.toContain("branches: [master");
      expect(wf.content).not.toContain("branches: [develop");
    }
  });

  it("gate workflows include GATE_HEADER with branch protection instructions", () => {
    const wfs = generateAllWorkflows(testConfig);
    const gateWorkflows = wfs.filter(w =>
      w.content.includes("Security Gate") ||
      w.content.includes("Compliance Gate") ||
      w.content.includes("Dependency Gate") ||
      w.content.includes("Secret Gate")
    );
    expect(gateWorkflows.length).toBe(4);
    for (const wf of gateWorkflows) {
      expect(wf.content).toContain("Branch protection");
    }
  });

  it("only compliance workflow runs ges commands (no redundancy)", () => {
    const wfs = generateAllWorkflows(testConfig);
    for (const wf of wfs) {
      const isCompliance = wf.filePath.includes("compliance.yml");
      const hasGes = wf.content.includes("ges audit") || wf.content.includes("ges scan");
      if (hasGes) {
        expect(isCompliance).toBe(true);
      }
    }
  });

  it("no workflow includes ges scan (uses native actions)", () => {
    const wfs = generateAllWorkflows(testConfig);
    for (const wf of wfs) {
      expect(wf.content).not.toContain("ges scan");
    }
  });
});
