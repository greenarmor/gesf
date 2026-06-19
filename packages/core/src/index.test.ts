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
import {
  loadFixHistory,
  appendFixHistory,
  clearFixHistory,
  createFixHistoryEntry,
} from "./fix-history/index.js";
import {
  loadFixAssignments,
  saveFixAssignments,
  createFixAssignment,
  addFixAssignment,
  updateFixAssignment,
  updateFixAssignmentStatus,
  findFixAssignment,
  findFixAssignmentById,
  findFixAssignmentsForRecord,
  resolveFixAssignment,
  deleteFixAssignment,
  unassignFix,
  findingKey,
  generateAssignmentId,
} from "./fix-assignments/index.js";
import {
  loadControlsFromDisk,
  getInstalledPackIds,
  loadControlOverrides,
  saveControlOverride,
  applyOverridesToControls,
  loadConfig,
  addFrameworkToConfig,
  removeFrameworkFromConfig,
} from "./controls/index.js";
import type { Control, ControlOverride } from "./types/index.js";
import {
  loadActivityLog,
  appendActivityLog,
  clearActivityLog,
  createActivityLogEntry,
  recordActivity,
} from "./activity-log/index.js";
import {
  recordAIRecommendation,
  loadAIRecommendations,
} from "./recommendations/index.js";

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

describe("controls utilities", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-ctrl-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const sampleControl: Control = {
    id: "AI-001",
    name: "Prompt Logging",
    description: "Log all AI prompts",
    category: "ai",
    framework: "GDPR" as any,
    status: "not-implemented",
    severity: "high",
    implementation_guidance: "Log all prompts to audit trail",
    checks: [{ id: "AI-001-C1", description: "Prompt log exists", status: "not-implemented" }],
  };

  describe("loadControlsFromDisk", () => {
    it("returns empty when controls/ does not exist", () => {
      expect(loadControlsFromDisk(tmpDir)).toEqual([]);
    });

    it("reads controls from installed packs", () => {
      const packDir = path.join(tmpDir, "controls", "ai");
      fs.mkdirSync(packDir, { recursive: true });
      fs.writeFileSync(
        path.join(packDir, "controls.json"),
        JSON.stringify([sampleControl], null, 2),
      );

      const controls = loadControlsFromDisk(tmpDir);
      expect(controls.length).toBe(1);
      expect(controls[0].id).toBe("AI-001");
    });

    it("reads from multiple pack directories", () => {
      for (const packId of ["gdpr", "owasp"]) {
        const d = path.join(tmpDir, "controls", packId);
        fs.mkdirSync(d, { recursive: true });
        fs.writeFileSync(path.join(d, "controls.json"), JSON.stringify([
          { ...sampleControl, id: `${packId.toUpperCase()}-001` },
        ], null, 2));
      }

      const controls = loadControlsFromDisk(tmpDir);
      expect(controls.length).toBe(2);
    });

    it("skips malformed controls.json", () => {
      const d = path.join(tmpDir, "controls", "bad");
      fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, "controls.json"), "not json");
      expect(loadControlsFromDisk(tmpDir)).toEqual([]);
    });
  });

  describe("getInstalledPackIds", () => {
    it("returns empty when controls/ does not exist", () => {
      expect(getInstalledPackIds(tmpDir).size).toBe(0);
    });

    it("returns pack IDs for directories with controls.json", () => {
      for (const packId of ["gdpr", "ai", "owasp"]) {
        const d = path.join(tmpDir, "controls", packId);
        fs.mkdirSync(d, { recursive: true });
        fs.writeFileSync(path.join(d, "controls.json"), "[]");
      }
      const ids = getInstalledPackIds(tmpDir);
      expect(ids.size).toBe(3);
      expect(ids.has("gdpr")).toBe(true);
      expect(ids.has("ai")).toBe(true);
      expect(ids.has("owasp")).toBe(true);
    });

    it("ignores directories without controls.json", () => {
      fs.mkdirSync(path.join(tmpDir, "controls", "empty"), { recursive: true });
      expect(getInstalledPackIds(tmpDir).size).toBe(0);
    });
  });

  describe("saveControlOverride / loadControlOverrides", () => {
    it("returns empty when no overrides file", () => {
      expect(loadControlOverrides(tmpDir)).toEqual([]);
    });

    it("saves and loads an override", () => {
      saveControlOverride(tmpDir, "GDPR-ART32-002", "pass", "Auto-implemented");
      const overrides = loadControlOverrides(tmpDir);
      expect(overrides.length).toBe(1);
      expect(overrides[0].control_id).toBe("GDPR-ART32-002");
      expect(overrides[0].status).toBe("pass");
      expect(overrides[0].reason).toBe("Auto-implemented");
    });

    it("updates existing override instead of duplicating", () => {
      saveControlOverride(tmpDir, "GDPR-ART32-002", "pass", "First");
      saveControlOverride(tmpDir, "GDPR-ART32-002", "not-applicable", "Updated");
      const overrides = loadControlOverrides(tmpDir);
      expect(overrides.length).toBe(1);
      expect(overrides[0].status).toBe("not-applicable");
      expect(overrides[0].reason).toBe("Updated");
    });
  });

  describe("applyOverridesToControls", () => {
    it("returns controls unchanged when no overrides", () => {
      const controls = [{ ...sampleControl }];
      const result = applyOverridesToControls(controls, []);
      expect(result[0].status).toBe("not-implemented");
    });

    it("applies override status and evidence to control and checks", () => {
      const controls = [{ ...sampleControl }];
      const overrides: ControlOverride[] = [
        { control_id: "AI-001", status: "pass", reason: "Done" },
      ];
      const result = applyOverridesToControls(controls, overrides);
      expect(result[0].status).toBe("pass");
      expect(result[0].checks[0].status).toBe("pass");
    });

    it("leaves controls without matching override unchanged", () => {
      const controls = [{ ...sampleControl }];
      const overrides: ControlOverride[] = [
        { control_id: "OTHER-001", status: "pass", reason: "Done" },
      ];
      const result = applyOverridesToControls(controls, overrides);
      expect(result[0].status).toBe("not-implemented");
    });
  });

  describe("addFrameworkToConfig / removeFrameworkFromConfig", () => {
    function writeConfig(dir: string, frameworks: string[]) {
      const gesDir = path.join(dir, ".ges");
      fs.mkdirSync(gesDir, { recursive: true });
      fs.writeFileSync(
        path.join(gesDir, "config.json"),
        JSON.stringify({ project_name: "Test", project_type: "saas", frameworks, requirements: {}, created_at: "2025-01-01", version: "1.0.0" }, null, 2),
      );
    }

    it("adds framework when not present", () => {
      writeConfig(tmpDir, ["GDPR", "OWASP"]);
      const added = addFrameworkToConfig(tmpDir, "AI");
      expect(added).toBe(true);
      const config = loadConfig(tmpDir);
      expect(config!.frameworks).toContain("AI" as any);
      expect(config!.frameworks.length).toBe(3);
    });

    it("returns false when framework already present", () => {
      writeConfig(tmpDir, ["GDPR", "AI"]);
      const added = addFrameworkToConfig(tmpDir, "AI");
      expect(added).toBe(false);
    });

    it("removes framework when present", () => {
      writeConfig(tmpDir, ["GDPR", "AI", "OWASP"]);
      const removed = removeFrameworkFromConfig(tmpDir, "AI");
      expect(removed).toBe(true);
      const config = loadConfig(tmpDir);
      expect(config!.frameworks).not.toContain("AI" as any);
      expect(config!.frameworks.length).toBe(2);
    });

    it("returns false when removing non-existent framework", () => {
      writeConfig(tmpDir, ["GDPR"]);
      const removed = removeFrameworkFromConfig(tmpDir, "AI");
      expect(removed).toBe(false);
    });
  });
});

describe("activity-log", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-actlog-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns empty array when no activity log exists", () => {
    expect(loadActivityLog(tmpDir)).toEqual([]);
  });

  it("creates activity log entry with correct fields", () => {
    const entry = createActivityLogEntry({
      source: "cli",
      action: "audit",
      title: "Audit completed",
      description: "Found 5 issues",
      details: { findings_count: 5 },
    });
    expect(entry.id).toBeTruthy();
    expect(entry.source).toBe("cli");
    expect(entry.action).toBe("audit");
    expect(entry.title).toBe("Audit completed");
    expect(entry.description).toBe("Found 5 issues");
    expect(entry.status).toBe("success");
    expect(entry.details.findings_count).toBe(5);
    expect(entry.timestamp).toBeTruthy();
  });

  it("defaults status to success when not provided", () => {
    const entry = createActivityLogEntry({
      source: "mcp",
      action: "fix",
      title: "Fix applied",
      description: "Fixed 3 issues",
    });
    expect(entry.status).toBe("success");
  });

  it("appends and loads entries", () => {
    const entry1 = createActivityLogEntry({ source: "cli", action: "audit", title: "Audit 1", description: "d1" });
    const entry2 = createActivityLogEntry({ source: "mcp", action: "fix", title: "Fix 1", description: "d2" });
    appendActivityLog(tmpDir, [entry1, entry2]);
    const loaded = loadActivityLog(tmpDir);
    expect(loaded.length).toBe(2);
    expect(loaded[0].title).toBe("Audit 1");
    expect(loaded[1].title).toBe("Fix 1");
  });

  it("appends to existing log without overwriting", () => {
    const entry1 = createActivityLogEntry({ source: "cli", action: "init", title: "Init", description: "d" });
    appendActivityLog(tmpDir, [entry1]);
    const entry2 = createActivityLogEntry({ source: "mcp", action: "audit", title: "Audit", description: "d" });
    appendActivityLog(tmpDir, [entry2]);
    const loaded = loadActivityLog(tmpDir);
    expect(loaded.length).toBe(2);
  });

  it("clears activity log", () => {
    const entry = createActivityLogEntry({ source: "cli", action: "audit", title: "A", description: "d" });
    appendActivityLog(tmpDir, [entry]);
    expect(loadActivityLog(tmpDir).length).toBe(1);
    clearActivityLog(tmpDir);
    expect(loadActivityLog(tmpDir).length).toBe(0);
  });

  it("recordActivity writes directly to disk", () => {
    recordActivity(tmpDir, {
      source: "cli",
      action: "audit",
      title: "Test audit",
      description: "Test description",
      status: "partial",
      details: { findings_count: 3, score: 75 },
    });
    const loaded = loadActivityLog(tmpDir);
    expect(loaded.length).toBe(1);
    expect(loaded[0].status).toBe("partial");
    expect(loaded[0].details.score).toBe(75);
  });

  it("creates .ges dir if not exists", () => {
    recordActivity(tmpDir, {
      source: "mcp",
      action: "policy_install",
      title: "Installed AI pack",
      description: "Added AI pack",
    });
    expect(fs.existsSync(path.join(tmpDir, ".ges", "activity-log.json"))).toBe(true);
  });
});

describe("AI recommendations", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-rec-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("recordAIRecommendation writes markdown to .dev-logs/ai-recommendations", () => {
    const rec = recordAIRecommendation(tmpDir, {
      category: "security",
      title: "Add rate limiting to login",
      description: "Login endpoint lacks rate limiting, enabling brute-force attacks.",
      severity: "high",
      affected_controls: ["GDPR-ART32-002"],
      affected_files: ["src/auth/login.ts"],
      suggested_action: "Add express-rate-limit middleware to /login route.",
    });
    expect(rec.id).toMatch(/^ai-rec-/);
    expect(rec.status).toBe("open");
    expect(rec.category).toBe("security");

    const recDir = path.join(tmpDir, ".dev-logs", "ai-recommendations");
    expect(fs.existsSync(recDir)).toBe(true);
    const files = fs.readdirSync(recDir).filter(f => f.endsWith(".md"));
    expect(files.length).toBe(1);

    const content = fs.readFileSync(path.join(recDir, files[0]), "utf-8");
    expect(content).toContain("Add rate limiting to login");
    expect(content).toContain("express-rate-limit");
    expect(content).toContain("GDPR-ART32-002");
  });

  it("creates .dev-logs dir if not exists", () => {
    expect(fs.existsSync(path.join(tmpDir, ".dev-logs"))).toBe(false);
    recordAIRecommendation(tmpDir, {
      category: "improvement",
      title: "Test",
      description: "desc",
      suggested_action: "action",
    });
    expect(fs.existsSync(path.join(tmpDir, ".dev-logs", "ai-recommendations"))).toBe(true);
  });

  it("loadAIRecommendations reads back recorded entries", () => {
    recordAIRecommendation(tmpDir, {
      category: "compliance",
      title: "Missing DPIA",
      description: "DPIA not documented for new data processing.",
      severity: "medium",
      suggested_action: "Create privacy-impact-assessment.md.",
    });
    recordAIRecommendation(tmpDir, {
      category: "bug",
      title: "Fix audit trail",
      description: "Audit trail missing ipAddress field.",
      severity: "high",
      suggested_action: "Add ipAddress to all log entries.",
    });

    const loaded = loadAIRecommendations(tmpDir);
    expect(loaded.length).toBe(2);
    expect(loaded.some(r => r.title === "Missing DPIA")).toBe(true);
    expect(loaded.some(r => r.title === "Fix audit trail")).toBe(true);
  });

  it("loadAIRecommendations returns empty when dir does not exist", () => {
    const loaded = loadAIRecommendations(tmpDir);
    expect(loaded).toEqual([]);
  });
});

describe("fix-assignments", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-fixassign-test-"));
    fs.mkdirSync(path.join(tmpDir, ".ges"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function makeAssignmentInput(overrides: Record<string, unknown> = {}) {
    return {
      finding_key: "SECRETS-001:src/auth.ts:42",
      finding_rule_id: "SECRETS-001",
      finding_title: "Hardcoded API key",
      finding_file: "src/auth.ts",
      finding_line: 42,
      finding_severity: "critical" as const,
      finding_control_ids: ["GDPR-ART32-002", "OWASP-AUTH-001"],
      governance_record_id: "gov-test-001",
      governance_system_name: "Customer Support Chatbot",
      assignee: "Bob Smith",
      assignee_role: "Security Engineer",
      assigned_by: "Jane Doe",
      ...overrides,
    };
  }

  describe("findingKey", () => {
    it("generates stable key from rule, file, and line", () => {
      const key = findingKey({ ruleId: "SECRETS-001", file: "src/auth.ts", line: 42 });
      expect(key).toBe("SECRETS-001:src/auth.ts:42");
    });

    it("uses 0 for missing line", () => {
      const key = findingKey({ ruleId: "R1", file: "f.ts" });
      expect(key).toBe("R1:f.ts:0");
    });

    it("same inputs produce same key", () => {
      const k1 = findingKey({ ruleId: "R1", file: "a.ts", line: 5 });
      const k2 = findingKey({ ruleId: "R1", file: "a.ts", line: 5 });
      expect(k1).toBe(k2);
    });
  });

  describe("generateAssignmentId", () => {
    it("produces unique IDs with fa- prefix", () => {
      const id1 = generateAssignmentId();
      const id2 = generateAssignmentId();
      expect(id1).toMatch(/^fa-\d+-\d+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("loadFixAssignments", () => {
    it("returns empty array when no file exists", () => {
      expect(loadFixAssignments(tmpDir)).toEqual([]);
    });

    it("returns empty array for malformed JSON", () => {
      fs.writeFileSync(
        path.join(tmpDir, ".ges", "fix-assignments.json"),
        "not json",
      );
      expect(loadFixAssignments(tmpDir)).toEqual([]);
    });

    it("returns empty array when file contains non-array", () => {
      fs.writeFileSync(
        path.join(tmpDir, ".ges", "fix-assignments.json"),
        JSON.stringify({ not: "array" }),
      );
      expect(loadFixAssignments(tmpDir)).toEqual([]);
    });
  });

  describe("saveFixAssignments", () => {
    it("creates .ges dir if missing then writes", () => {
      fs.rmSync(path.join(tmpDir, ".ges"), { recursive: true, force: true });
      const assignment = createFixAssignment(makeAssignmentInput());
      saveFixAssignments(tmpDir, [assignment]);
      expect(fs.existsSync(path.join(tmpDir, ".ges", "fix-assignments.json"))).toBe(true);
    });
  });

  describe("createFixAssignment", () => {
    it("creates a properly structured assignment", () => {
      const a = createFixAssignment(makeAssignmentInput());
      expect(a.id).toMatch(/^fa-/);
      expect(a.finding_key).toBe("SECRETS-001:src/auth.ts:42");
      expect(a.finding_rule_id).toBe("SECRETS-001");
      expect(a.finding_title).toBe("Hardcoded API key");
      expect(a.finding_file).toBe("src/auth.ts");
      expect(a.finding_line).toBe(42);
      expect(a.finding_severity).toBe("critical");
      expect(a.finding_control_ids).toEqual(["GDPR-ART32-002", "OWASP-AUTH-001"]);
      expect(a.governance_record_id).toBe("gov-test-001");
      expect(a.governance_system_name).toBe("Customer Support Chatbot");
      expect(a.assignee).toBe("Bob Smith");
      expect(a.assignee_role).toBe("Security Engineer");
      expect(a.assigned_by).toBe("Jane Doe");
      expect(a.assigned_at).toBeTruthy();
      expect(a.status).toBe("assigned");
      expect(a.notes).toBe("");
      expect(a.resolution).toBeNull();
      expect(a.created_at).toBeTruthy();
      expect(a.updated_at).toBeTruthy();
    });

    it("accepts optional notes", () => {
      const a = createFixAssignment(makeAssignmentInput({ notes: "Urgent fix" }));
      expect(a.notes).toBe("Urgent fix");
    });

    it("defaults notes to empty string", () => {
      const input = makeAssignmentInput();
      delete (input as any).notes;
      const a = createFixAssignment(input);
      expect(a.notes).toBe("");
    });
  });

  describe("addFixAssignment + load round-trip", () => {
    it("persists and reloads an assignment", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      const loaded = loadFixAssignments(tmpDir);
      expect(loaded.length).toBe(1);
      expect(loaded[0].id).toBe(a.id);
      expect(loaded[0].finding_key).toBe("SECRETS-001:src/auth.ts:42");
      expect(loaded[0].assignee).toBe("Bob Smith");
      expect(loaded[0].status).toBe("assigned");
    });

    it("upserts: assigning same finding_key replaces existing", () => {
      const a1 = createFixAssignment(makeAssignmentInput({ assignee: "Alice" }));
      addFixAssignment(tmpDir, a1);
      const a2 = createFixAssignment(makeAssignmentInput({ assignee: "Charlie" }));
      addFixAssignment(tmpDir, a2);
      const loaded = loadFixAssignments(tmpDir);
      expect(loaded.length).toBe(1);
      expect(loaded[0].assignee).toBe("Charlie");
    });

    it("preserves multiple distinct assignments", () => {
      const a1 = createFixAssignment(makeAssignmentInput());
      const a2 = createFixAssignment(
        makeAssignmentInput({
          finding_key: "R2:src/b.ts:10",
          finding_rule_id: "R2",
          finding_file: "src/b.ts",
          finding_line: 10,
          assignee: "Different Person",
        }),
      );
      addFixAssignment(tmpDir, a1);
      addFixAssignment(tmpDir, a2);
      const loaded = loadFixAssignments(tmpDir);
      expect(loaded.length).toBe(2);
    });
  });

  describe("updateFixAssignment", () => {
    it("updates fields by ID", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      const updated = updateFixAssignment(tmpDir, a.id, { status: "in-progress", notes: "Working on it" });
      expect(updated).not.toBeNull();
      expect(updated!.status).toBe("in-progress");
      expect(updated!.notes).toBe("Working on it");
      expect(updated!.updated_at).toBeTruthy();
    });

    it("returns null for non-existent ID", () => {
      expect(updateFixAssignment(tmpDir, "nonexistent", { notes: "x" })).toBeNull();
    });
  });

  describe("updateFixAssignmentStatus", () => {
    it("changes status by finding key", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      const updated = updateFixAssignmentStatus(tmpDir, a.finding_key, "verified");
      expect(updated).not.toBeNull();
      expect(updated!.status).toBe("verified");
    });

    it("returns null for non-existent finding key", () => {
      expect(updateFixAssignmentStatus(tmpDir, "missing", "fixed")).toBeNull();
    });
  });

  describe("findFixAssignment", () => {
    it("finds assignment by finding key", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      const found = findFixAssignment(tmpDir, "SECRETS-001:src/auth.ts:42");
      expect(found).not.toBeNull();
      expect(found!.id).toBe(a.id);
    });

    it("returns null for unknown finding key", () => {
      expect(findFixAssignment(tmpDir, "unknown")).toBeNull();
    });
  });

  describe("findFixAssignmentById", () => {
    it("finds assignment by ID", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      const found = findFixAssignmentById(tmpDir, a.id);
      expect(found).not.toBeNull();
      expect(found!.finding_key).toBe(a.finding_key);
    });

    it("returns null for unknown ID", () => {
      expect(findFixAssignmentById(tmpDir, "fake-id")).toBeNull();
    });
  });

  describe("findFixAssignmentsForRecord", () => {
    it("returns all assignments for a governance record", () => {
      const a1 = createFixAssignment(makeAssignmentInput());
      const a2 = createFixAssignment(
        makeAssignmentInput({
          finding_key: "R2:src/b.ts:1",
          finding_rule_id: "R2",
          finding_file: "src/b.ts",
        }),
      );
      const a3 = createFixAssignment(
        makeAssignmentInput({
          finding_key: "R3:src/c.ts:5",
          finding_rule_id: "R3",
          finding_file: "src/c.ts",
          governance_record_id: "gov-other",
        }),
      );
      addFixAssignment(tmpDir, a1);
      addFixAssignment(tmpDir, a2);
      addFixAssignment(tmpDir, a3);
      const forRecord = findFixAssignmentsForRecord(tmpDir, "gov-test-001");
      expect(forRecord.length).toBe(2);
      expect(forRecord.every(a => a.governance_record_id === "gov-test-001")).toBe(true);
    });

    it("returns empty for record with no assignments", () => {
      expect(findFixAssignmentsForRecord(tmpDir, "none")).toEqual([]);
    });
  });

  describe("resolveFixAssignment", () => {
    it("marks assignment as fixed with resolution details", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      const resolved = resolveFixAssignment(tmpDir, a.finding_key, {
        resolved_by: "Bob Smith",
        resolved_by_role: "Security Engineer",
        method: "auto-fix",
        resolution_notes: "Replaced hardcoded key with env var",
      });
      expect(resolved).not.toBeNull();
      expect(resolved!.status).toBe("fixed");
      expect(resolved!.resolution).not.toBeNull();
      expect(resolved!.resolution!.resolved_by).toBe("Bob Smith");
      expect(resolved!.resolution!.resolved_by_role).toBe("Security Engineer");
      expect(resolved!.resolution!.method).toBe("auto-fix");
      expect(resolved!.resolution!.resolution_notes).toBe("Replaced hardcoded key with env var");
      expect(resolved!.resolution!.resolved_at).toBeTruthy();
      expect(resolved!.updated_at).toBeTruthy();
    });

    it("supports manual resolution method", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      const resolved = resolveFixAssignment(tmpDir, a.finding_key, {
        resolved_by: "Manual User",
        resolved_by_role: "Dev",
        method: "manual",
        resolution_notes: "Fixed by hand",
      });
      expect(resolved!.resolution!.method).toBe("manual");
    });

    it("supports not-applicable resolution method", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      const resolved = resolveFixAssignment(tmpDir, a.finding_key, {
        resolved_by: "Jane",
        resolved_by_role: "CISO",
        method: "not-applicable",
        resolution_notes: "False positive",
      });
      expect(resolved!.resolution!.method).toBe("not-applicable");
    });

    it("returns null for unknown finding key", () => {
      expect(
        resolveFixAssignment(tmpDir, "missing", {
          resolved_by: "X",
          resolved_by_role: "",
          method: "manual",
          resolution_notes: "",
        }),
      ).toBeNull();
    });
  });

  describe("deleteFixAssignment", () => {
    it("removes assignment by ID", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      expect(deleteFixAssignment(tmpDir, a.id)).toBe(true);
      expect(loadFixAssignments(tmpDir).length).toBe(0);
    });

    it("returns false for unknown ID", () => {
      expect(deleteFixAssignment(tmpDir, "fake")).toBe(false);
    });
  });

  describe("unassignFix", () => {
    it("removes assignment by finding key", () => {
      const a = createFixAssignment(makeAssignmentInput());
      addFixAssignment(tmpDir, a);
      expect(unassignFix(tmpDir, a.finding_key)).toBe(true);
      expect(loadFixAssignments(tmpDir).length).toBe(0);
    });

    it("returns false for unknown finding key", () => {
      expect(unassignFix(tmpDir, "missing")).toBe(false);
    });

    it("does not affect other assignments", () => {
      const a1 = createFixAssignment(makeAssignmentInput());
      const a2 = createFixAssignment(
        makeAssignmentInput({
          finding_key: "R2:src/b.ts:1",
          finding_rule_id: "R2",
          finding_file: "src/b.ts",
        }),
      );
      addFixAssignment(tmpDir, a1);
      addFixAssignment(tmpDir, a2);
      unassignFix(tmpDir, a1.finding_key);
      const loaded = loadFixAssignments(tmpDir);
      expect(loaded.length).toBe(1);
      expect(loaded[0].id).toBe(a2.id);
    });
  });
});
