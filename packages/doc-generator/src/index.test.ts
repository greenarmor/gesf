import { describe, it, expect } from "vitest";
import {
  generateComplianceDocs,
  generateSecurityDocs,
  generateConfigJson,
  generateConfigYaml,
  generateMetadataJson,
  generateFrameworkVersionJson,
  generateScoreJson,
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

describe("generateComplianceDocs", () => {
  const docs = generateComplianceDocs("TestApp", "saas");

  it("generates 7 compliance documents", () => {
    expect(docs.length).toBe(7);
  });

  it("includes GDPR document", () => {
    expect(docs.some(d => d.filePath.includes("gdpr.md"))).toBe(true);
  });

  it("includes data inventory", () => {
    expect(docs.some(d => d.filePath.includes("data-inventory.md"))).toBe(true);
  });

  it("includes retention policy", () => {
    expect(docs.some(d => d.filePath.includes("retention-policy.md"))).toBe(true);
  });

  it("all documents have content", () => {
    for (const doc of docs) {
      expect(doc.content.length).toBeGreaterThan(0);
    }
  });

  it("all documents include project name", () => {
    for (const doc of docs) {
      expect(doc.content).toContain("TestApp");
    }
  });
});

describe("generateSecurityDocs", () => {
  const docs = generateSecurityDocs("TestApp", "saas");

  it("generates security documents", () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  it("includes threat model", () => {
    expect(docs.some(d => d.filePath.includes("threat-model.md"))).toBe(true);
  });

  it("includes incident response", () => {
    expect(docs.some(d => d.filePath.includes("incident-response.md"))).toBe(true);
  });

  it("includes encryption standard", () => {
    expect(docs.some(d => d.filePath.includes("encryption-standard.md"))).toBe(true);
  });
});

describe("generateConfigJson", () => {
  it("generates valid JSON config", () => {
    const result = generateConfigJson(testConfig);
    expect(result.filePath).toContain("config.json");
    const parsed = JSON.parse(result.content);
    expect(parsed.project_name).toBe("TestApp");
    expect(parsed.project_type).toBe("saas");
  });
});

describe("generateConfigYaml", () => {
  it("generates YAML config with project name", () => {
    const result = generateConfigYaml(testConfig);
    expect(result.filePath).toContain("config.yaml");
    expect(result.content).toContain("TestApp");
  });
});

describe("generateMetadataJson", () => {
  it("generates valid metadata", () => {
    const result = generateMetadataJson(testConfig);
    expect(result.filePath).toContain("metadata.json");
    const parsed = JSON.parse(result.content);
    expect(parsed.project_name).toBe("TestApp");
  });
});

describe("generateFrameworkVersionJson", () => {
  it("generates framework version file", () => {
    const result = generateFrameworkVersionJson();
    expect(result.filePath).toContain("framework-version.json");
    const parsed = JSON.parse(result.content);
    expect(parsed.gesf_version).toBeTruthy();
  });
});

describe("generateScoreJson", () => {
  it("generates score file", () => {
    const result = generateScoreJson();
    expect(result.filePath).toContain("score.json");
    const parsed = JSON.parse(result.content);
    expect(parsed).toHaveProperty("overall");
  });
});
