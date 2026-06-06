import { describe, it, expect } from "vitest";
import {
  ProjectTypeSchema,
  FrameworkNameSchema,
  DataClassificationSchema,
  ControlStatusSchema,
  ReportFormatSchema,
  ProjectConfigSchema,
} from "./schemas/index.js";
import {
  GESF_VERSION,
  PROJECT_TYPES,
  FRAMEWORKS,
  DEFAULT_FRAMEWORKS,
  PROJECT_TYPE_PACKS,
} from "./constants/index.js";

describe("GESF_VERSION", () => {
  it("is defined and looks like a semver", () => {
    expect(GESF_VERSION).toBeTruthy();
    expect(GESF_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});

describe("PROJECT_TYPES", () => {
  it("has 13 project types", () => {
    expect(PROJECT_TYPES.length).toBe(13);
  });

  it("all have value and label", () => {
    for (const pt of PROJECT_TYPES) {
      expect(pt.value).toBeTruthy();
      expect(pt.label).toBeTruthy();
    }
  });
});

describe("FRAMEWORKS", () => {
  it("includes GDPR, OWASP, CIS, NIST", () => {
    const values = FRAMEWORKS.map(f => f.value);
    expect(values).toContain("GDPR");
    expect(values).toContain("OWASP");
    expect(values).toContain("CIS");
    expect(values).toContain("NIST");
  });
});

describe("DEFAULT_FRAMEWORKS", () => {
  it("has 4 default frameworks", () => {
    expect(DEFAULT_FRAMEWORKS.length).toBe(4);
  });
});

describe("PROJECT_TYPE_PACKS", () => {
  it("every project type has at least one pack", () => {
    for (const [type, packs] of Object.entries(PROJECT_TYPE_PACKS)) {
      expect(packs.length).toBeGreaterThan(0);
    }
  });

  it("all project types include GDPR", () => {
    for (const packs of Object.values(PROJECT_TYPE_PACKS)) {
      expect(packs).toContain("gdpr");
    }
  });
});

describe("ProjectTypeSchema", () => {
  it("accepts valid project types", () => {
    expect(ProjectTypeSchema.safeParse("saas").success).toBe(true);
    expect(ProjectTypeSchema.safeParse("ai-application").success).toBe(true);
    expect(ProjectTypeSchema.safeParse("mcp-server").success).toBe(true);
  });

  it("rejects invalid project types", () => {
    expect(ProjectTypeSchema.safeParse("invalid").success).toBe(false);
  });
});

describe("FrameworkNameSchema", () => {
  it("accepts valid frameworks", () => {
    expect(FrameworkNameSchema.safeParse("GDPR").success).toBe(true);
    expect(FrameworkNameSchema.safeParse("OWASP").success).toBe(true);
    expect(FrameworkNameSchema.safeParse("ISO27001").success).toBe(true);
  });

  it("rejects invalid frameworks", () => {
    expect(FrameworkNameSchema.safeParse("PCI").success).toBe(false);
  });
});

describe("DataClassificationSchema", () => {
  it("accepts valid classifications", () => {
    for (const c of ["public", "internal", "confidential", "restricted"]) {
      expect(DataClassificationSchema.safeParse(c).success).toBe(true);
    }
  });

  it("rejects invalid classification", () => {
    expect(DataClassificationSchema.safeParse("top-secret").success).toBe(false);
  });
});

describe("ControlStatusSchema", () => {
  it("accepts valid statuses", () => {
    for (const s of ["pass", "fail", "warning", "not-applicable", "not-implemented"]) {
      expect(ControlStatusSchema.safeParse(s).success).toBe(true);
    }
  });
});

describe("ReportFormatSchema", () => {
  it("accepts valid formats", () => {
    for (const f of ["markdown", "html", "pdf"]) {
      expect(ReportFormatSchema.safeParse(f).success).toBe(true);
    }
  });
});

describe("ProjectConfigSchema", () => {
  const validConfig = {
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

  it("accepts a valid config", () => {
    const result = ProjectConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("rejects empty project name", () => {
    const result = ProjectConfigSchema.safeParse({ ...validConfig, project_name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects empty frameworks array", () => {
    const result = ProjectConfigSchema.safeParse({ ...validConfig, frameworks: [] });
    expect(result.success).toBe(false);
  });
});
