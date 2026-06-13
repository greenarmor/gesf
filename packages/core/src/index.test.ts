import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
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
import { loadFixHistory, appendFixHistory, clearFixHistory, createFixHistoryEntry } from "./fix-history/index.js";

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

describe("fix-history", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-fixhist-test-"));
    fs.mkdirSync(path.join(tmpDir, ".ges"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("loads empty history when no file exists", () => {
    const history = loadFixHistory(tmpDir);
    expect(history).toEqual([]);
  });

  it("appends and loads fix history entries", () => {
    const entry = createFixHistoryEntry({
      source: "cli",
      dry_run: false,
      finding: {
        ruleId: "SECRETS-001",
        severity: "critical",
        category: "secrets",
        title: "Hardcoded key",
        file: "src/config.ts",
        line: 10,
        evidence: "API_KEY = 'abc'",
        description: "Found hardcoded key",
        controlIds: ["GDPR-ART32-001"],
        fix: "Move to env var",
      },
      action: {
        type: "modify",
        filePath: "src/config.ts",
        description: "Replace hardcoded key",
        ruleId: "SECRETS-001",
      },
      controls: [
        { id: "GDPR-ART32-001", name: "Encryption at Rest", framework: "GDPR", article: "Article 32", status: "fail" },
      ],
      applied: true,
    });

    expect(entry.id).toBeTruthy();
    expect(entry.timestamp).toBeTruthy();
    expect(entry.source).toBe("cli");
    expect(entry.finding.rule_id).toBe("SECRETS-001");
    expect(entry.controls[0].id).toBe("GDPR-ART32-001");
    expect(entry.fix.applied).toBe(true);
    expect(entry.compliance_impact.frameworks_affected).toContain("GDPR");
    expect(entry.compliance_impact.controls_addressed).toBe(1);

    appendFixHistory(tmpDir, [entry]);

    const loaded = loadFixHistory(tmpDir);
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe(entry.id);
    expect(loaded[0].finding.rule_id).toBe("SECRETS-001");
    expect(loaded[0].fix.file_path).toBe("src/config.ts");
  });

  it("appends multiple entries over time", () => {
    const entry1 = createFixHistoryEntry({
      source: "mcp", dry_run: false,
      finding: { ruleId: "R1", severity: "high", category: "test", title: "T1", file: "a.ts", evidence: "", description: "", controlIds: [], fix: "fix1" },
      action: { type: "create", filePath: "a.ts", description: "d1", ruleId: "R1" },
      controls: [], applied: true,
    });
    const entry2 = createFixHistoryEntry({
      source: "cli", dry_run: false,
      finding: { ruleId: "R2", severity: "low", category: "test", title: "T2", file: "b.ts", evidence: "", description: "", controlIds: [], fix: "fix2" },
      action: { type: "modify", filePath: "b.ts", description: "d2", ruleId: "R2" },
      controls: [], applied: false, error: "failed",
    });

    appendFixHistory(tmpDir, [entry1]);
    appendFixHistory(tmpDir, [entry2]);

    const loaded = loadFixHistory(tmpDir);
    expect(loaded.length).toBe(2);
    expect(loaded[0].source).toBe("mcp");
    expect(loaded[1].source).toBe("cli");
    expect(loaded[1].fix.error).toBe("failed");
  });

  it("clears fix history", () => {
    const entry = createFixHistoryEntry({
      source: "cli", dry_run: false,
      finding: { ruleId: "R1", severity: "medium", category: "test", title: "T1", file: "a.ts", evidence: "", description: "", controlIds: [], fix: "fix" },
      action: { type: "create", filePath: "a.ts", description: "d1", ruleId: "R1" },
      controls: [], applied: true,
    });
    appendFixHistory(tmpDir, [entry]);
    expect(loadFixHistory(tmpDir).length).toBe(1);

    clearFixHistory(tmpDir);
    expect(loadFixHistory(tmpDir).length).toBe(0);
  });

  it("records dry run entries correctly", () => {
    const entry = createFixHistoryEntry({
      source: "mcp", dry_run: true,
      finding: { ruleId: "CONFIG-001", severity: "high", category: "config", title: "Missing helmet", file: "app.ts", evidence: "", description: "", controlIds: ["OWASP-CONFIG-001"], fix: "Install helmet" },
      action: { type: "create", filePath: "src/security.ts", description: "Add helmet", ruleId: "CONFIG-001" },
      controls: [{ id: "OWASP-CONFIG-001", name: "Security Headers", framework: "OWASP", status: "fail" }],
      applied: false,
    });

    expect(entry.dry_run).toBe(true);
    expect(entry.fix.applied).toBe(false);
  });
});
