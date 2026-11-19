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
import { safeWriteJson, safeWriteFile, safeReadJson } from "./utils/index.js";
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

describe("safeWriteJson / safeWriteFile / safeReadJson", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-safewrite-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("safeWriteJson", () => {
    it("writes valid JSON that can be read back", () => {
      const filePath = path.join(tmpDir, "data.json");
      const data = { name: "test", values: [1, 2, 3], nested: { a: true } };
      safeWriteJson(filePath, data);
      const raw = fs.readFileSync(filePath, "utf-8");
      const loaded = JSON.parse(raw);
      expect(loaded.name).toBe("test");
      expect(loaded.values).toEqual([1, 2, 3]);
      expect(loaded.nested.a).toBe(true);
    });

    it("creates parent directories if they do not exist", () => {
      const filePath = path.join(tmpDir, "deeply", "nested", "dir", "data.json");
      safeWriteJson(filePath, { ok: true });
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("overwrites existing file atomically", () => {
      const filePath = path.join(tmpDir, "overwrite.json");
      safeWriteJson(filePath, { version: 1 });
      safeWriteJson(filePath, { version: 2 });
      const raw = fs.readFileSync(filePath, "utf-8");
      expect(JSON.parse(raw).version).toBe(2);
    });

    it("does not leave temp file after successful write", () => {
      const filePath = path.join(tmpDir, "clean.json");
      safeWriteJson(filePath, { data: "test" });
      expect(fs.existsSync(filePath + ".tmp")).toBe(false);
    });

    it("handles empty objects and arrays", () => {
      const filePath = path.join(tmpDir, "empty.json");
      safeWriteJson(filePath, {});
      const raw = fs.readFileSync(filePath, "utf-8");
      expect(JSON.parse(raw)).toEqual({});

      safeWriteJson(filePath, []);
      const raw2 = fs.readFileSync(filePath, "utf-8");
      expect(JSON.parse(raw2)).toEqual([]);
    });

    it("handles null and undefined values", () => {
      const filePath = path.join(tmpDir, "nulls.json");
      safeWriteJson(filePath, { a: null, b: undefined, c: "keep" });
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      expect(parsed.a).toBeNull();
      expect(parsed.c).toBe("keep");
    });
  });

  describe("safeWriteFile", () => {
    it("writes string content", () => {
      const filePath = path.join(tmpDir, "file.txt");
      safeWriteFile(filePath, "hello world");
      expect(fs.readFileSync(filePath, "utf-8")).toBe("hello world");
    });

    it("creates parent directories", () => {
      const filePath = path.join(tmpDir, "a", "b", "c.txt");
      safeWriteFile(filePath, "nested");
      expect(fs.readFileSync(filePath, "utf-8")).toBe("nested");
    });

    it("overwrites existing file", () => {
      const filePath = path.join(tmpDir, "ow.txt");
      safeWriteFile(filePath, "first");
      safeWriteFile(filePath, "second");
      expect(fs.readFileSync(filePath, "utf-8")).toBe("second");
    });

    it("handles empty string", () => {
      const filePath = path.join(tmpDir, "empty.txt");
      safeWriteFile(filePath, "");
      expect(fs.readFileSync(filePath, "utf-8")).toBe("");
    });

    it("handles multi-line content", () => {
      const filePath = path.join(tmpDir, "multi.txt");
      const content = "line1\nline2\nline3\n";
      safeWriteFile(filePath, content);
      expect(fs.readFileSync(filePath, "utf-8")).toBe(content);
    });
  });

  describe("safeReadJson", () => {
    it("reads valid JSON file", () => {
      const filePath = path.join(tmpDir, "read.json");
      fs.writeFileSync(filePath, JSON.stringify({ key: "value" }));
      const result = safeReadJson(filePath, null);
      expect(result).toEqual({ key: "value" });
    });

    it("returns fallback for missing file", () => {
      const result = safeReadJson(path.join(tmpDir, "missing.json"), { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it("returns fallback for malformed JSON", () => {
      const filePath = path.join(tmpDir, "bad.json");
      fs.writeFileSync(filePath, "not valid json {{{");
      const fallback = { default: "value" };
      const result = safeReadJson(filePath, fallback);
      expect(result).toEqual(fallback);
    });

    it("returns fallback for empty file", () => {
      const filePath = path.join(tmpDir, "empty.json");
      fs.writeFileSync(filePath, "");
      const result = safeReadJson(filePath, []);
      expect(result).toEqual([]);
    });

    it("preserves type of fallback", () => {
      const result1 = safeReadJson(path.join(tmpDir, "x.json"), "default-string");
      expect(typeof result1).toBe("string");

      const result2 = safeReadJson(path.join(tmpDir, "y.json"), 42);
      expect(typeof result2).toBe("number");

      const result3 = safeReadJson(path.join(tmpDir, "z.json"), null);
      expect(result3).toBeNull();
    });
  });

  describe("atomic write guarantee", () => {
    it("temp file is cleaned up on rename failure", () => {
      const filePath = path.join(tmpDir, "guarded.json");
      safeWriteJson(filePath, { first: true });

      const readOnlyDir = path.join(tmpDir, "readonly");
      fs.mkdirSync(readOnlyDir, { recursive: true });
      fs.chmodSync(readOnlyDir, 0o444);

      const impossiblePath = path.join(readOnlyDir, "subdir", "fail.json");

      let threw = false;
      try {
        safeWriteJson(impossiblePath, { will: "fail" });
      } catch {
        threw = true;
      }

      fs.chmodSync(readOnlyDir, 0o755);

      expect(threw).toBe(true);
    });

    it("original file is not corrupted when write succeeds", () => {
      const filePath = path.join(tmpDir, "integrity.json");
      const original = { critical: "data", count: 42 };
      safeWriteJson(filePath, original);

      const updated = { critical: "updated", count: 43, extra: true };
      safeWriteJson(filePath, updated);

      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      expect(parsed.critical).toBe("updated");
      expect(parsed.count).toBe(43);
      expect(parsed.extra).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// NIST SP 800-53 assessment module (Phase 14 tests)
// ---------------------------------------------------------------------------
import {
  loadNistBaselineSelection,
  setNistBaselineSelection,
  addBaselineExclusion,
  addBaselineInheritance,
  addBaselineCompensating,
  loadNistControlOwners,
  setNistControlOwner,
  createNistAssessment,
  updateNistAssessment,
  recordNistDetermination,
  addNistDeficiency,
  getLatestNistAssessmentForControl,
  loadNistEvidence,
  addNistEvidence,
  validateEvidenceReference,
  reviewNistEvidence,
  deleteNistEvidence,
  linkEvidenceToControl,
  hasEvidenceForControl,
  getExpiringNistEvidence,
  computeSha256,
  loadNistFindings,
  addNistFinding,
  closeNistFinding,
  addNistPoamItem,
  addNistPoamMilestone,
  completeNistPoamMilestone,
  getOverdueNistPoam,
  setNistPoamStatus,
  ensureNistWorkflow,
  loadNistWorkflow,
  setNistWorkflowScope,
  transitionNistWorkflow,
  isWorkflowTransitionAllowed,
  DEFAULT_RISK_MATRIX,
  scoreNistRisk,
  buildNistRiskRating,
  loadNistRiskMatrix,
  saveNistRiskMatrix,
  summarizeNistAssessment,
} from "./nist/index.js";
import {
  NistBaselineSelectionSchema,
  NistAssessmentRecordSchema,
  NistEvidenceItemSchema,
  NistPoamItemSchema,
} from "./schemas/index.js";

describe("NIST SP 800-53 assessment module", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-nist-test-"));
    fs.mkdirSync(path.join(tmpDir, ".ges"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const MODERATE_IDS = ["AC-2", "AC-3", "AU-2", "CA-7"];

  function setModerateBaseline(): void {
    setNistBaselineSelection(tmpDir, {
      kind: "moderate",
      label: "Moderate Baseline",
      control_ids: [...MODERATE_IDS],
      catalog_version: "5.2.0",
    });
  }

  function makeAssessment(controlId: string, status: Parameters<typeof createNistAssessment>[1]["implementation_status"]) {
    return createNistAssessment(tmpDir, {
      project_id: "proj-1",
      control_id: controlId,
      scope: "Full system boundary",
      implementation_status: status,
      assessment_objective: "Determine whether the control is implemented correctly and operating as intended.",
      assessor: "Assessor One",
      control_owner: "Control Owner",
    });
  }

  describe("baseline selection (SP 800-53B)", () => {
    it("persists low, moderate and high selections", () => {
      for (const kind of ["low", "moderate", "high"] as const) {
        const selection = setNistBaselineSelection(tmpDir, {
          kind,
          label: `${kind} baseline`,
          control_ids: ["AC-2", "AC-3"],
          catalog_version: "5.2.0",
        });
        expect(selection.kind).toBe(kind);
        expect(fs.existsSync(path.join(tmpDir, ".ges", "nist-baseline.json"))).toBe(true);
        const loaded = loadNistBaselineSelection(tmpDir);
        expect(loaded?.control_ids).toEqual(["AC-2", "AC-3"]);
      }
    });

    it("supports tailored baselines with derived_from", () => {
      const tailored = setNistBaselineSelection(tmpDir, {
        kind: "tailored",
        label: "Org tailored moderate",
        derived_from: "moderate",
        control_ids: [...MODERATE_IDS, "SI-4"],
        catalog_version: "5.2.0",
      });
      expect(tailored.kind).toBe("tailored");
      expect(tailored.derived_from).toBe("moderate");
      expect(tailored.control_ids).toContain("SI-4");
    });

    it("never marks controls as assessed when a baseline is set", () => {
      setModerateBaseline();
      expect(fs.existsSync(path.join(tmpDir, ".ges", "nist-assessments.json"))).toBe(false);
      const summary = summarizeNistAssessment(tmpDir);
      expect(summary.applicable_controls).toBe(MODERATE_IDS.length);
      expect(summary.assessed).toBe(0);
      expect(summary.not_assessed).toBe(MODERATE_IDS.length);
    });

    it("preserves the previous selection instead of silently discarding it", () => {
      setModerateBaseline();
      const second = setNistBaselineSelection(tmpDir, {
        kind: "high",
        label: "High Baseline",
        control_ids: [...MODERATE_IDS, "SC-8"],
        catalog_version: "5.2.0",
      });
      expect(second.previous_selections).toHaveLength(1);
      expect(second.previous_selections[0].label).toBe("Moderate Baseline");
      expect(second.previous_selections[0].control_ids).toEqual(MODERATE_IDS);
    });

    it("carries over tailoring decisions that still apply and drops the rest", () => {
      setModerateBaseline();
      addBaselineExclusion(tmpDir, "AC-3", "Not applicable to this system boundary.");
      addBaselineInheritance(tmpDir, "AU-2", "Corporate SIEM", "Audit logging inherited from central platform.");
      addBaselineCompensating(tmpDir, "CA-7", "Commercial CSPM tooling", "Alternative continuous monitoring stack.");

      const high = setNistBaselineSelection(tmpDir, {
        kind: "high",
        label: "High Baseline",
        control_ids: [...MODERATE_IDS, "SC-8"],
        catalog_version: "5.2.0",
      });
      expect(high.exclusions.map((e) => e.control_id)).toEqual(["AC-3"]);
      expect(high.inherited.map((i) => i.control_id)).toEqual(["AU-2"]);
      expect(high.compensating.map((c) => c.control_id)).toEqual(["CA-7"]);

      const low = setNistBaselineSelection(tmpDir, {
        kind: "low",
        label: "Low Baseline",
        control_ids: ["AC-2"],
        catalog_version: "5.2.0",
      });
      expect(low.exclusions).toHaveLength(0);
      expect(low.inherited).toHaveLength(0);
      expect(low.compensating).toHaveLength(0);
    });
  });

  describe("control ownership", () => {
    it("assigns and replaces a control owner", () => {
      setNistControlOwner(tmpDir, "AC-2", "alice", "Security", "cio");
      setNistControlOwner(tmpDir, "AC-3", "bob", "Platform", "cio");
      const replaced = setNistControlOwner(tmpDir, "AC-2", "carol", "Security", "cio");
      expect(replaced.owner).toBe("carol");
      const owners = loadNistControlOwners(tmpDir);
      expect(owners).toHaveLength(2);
      expect(owners.find((o) => o.control_id === "AC-2")?.owner).toBe("carol");
    });
  });

  describe("assessment records and determinations", () => {
    it("creates assessments as not-assessed regardless of implementation status", () => {
      const record = makeAssessment("AC-2", "implemented");
      expect(record.determination).toBe("not-assessed");
      expect(record.methods).toEqual([]);
      expect(record.history).toHaveLength(1);
      expect(record.history[0].action).toBe("created");
    });

    it("records a satisfied determination with examine/interview/test methods", () => {
      for (const methods of [["examine"], ["interview"], ["test"], ["examine", "interview", "test"]] as const) {
        const record = makeAssessment("AC-2", "implemented");
        const result = recordNistDetermination(tmpDir, record.id, {
          determination: "satisfied",
          rationale: "Examined policy, interviewed admins and tested enforcement end to end.",
          methods: [...methods],
          actor: "assessor-1",
        });
        expect(result.error).toBeUndefined();
        expect(result.record?.determination).toBe("satisfied");
        expect(result.record?.methods).toEqual([...methods]);
        expect(result.record?.history.at(-1)?.action).toBe("determination");
        expect(result.record?.history.at(-1)?.actor).toBe("assessor-1");
      }
    });

    it("rejects satisfied when implementation status is not-implemented or planned", () => {
      for (const status of ["not-implemented", "planned"] as const) {
        const record = makeAssessment("AC-3", status);
        const result = recordNistDetermination(tmpDir, record.id, {
          determination: "satisfied",
          rationale: "Claiming satisfaction anyway.",
          methods: ["examine"],
        });
        expect(result.record).toBeNull();
        expect(result.error).toContain("satisfied");
        const still = getLatestNistAssessmentForControl(tmpDir, "AC-3");
        expect(still?.determination).toBe("not-assessed");
      }
    });

    it("allows other-than-satisfied on not-implemented controls", () => {
      const record = makeAssessment("AU-2", "not-implemented");
      const result = recordNistDetermination(tmpDir, record.id, {
        determination: "other-than-satisfied",
        rationale: "No audit logging capability exists.",
        methods: ["examine"],
      });
      expect(result.record?.determination).toBe("other-than-satisfied");
    });

    it("requires a rationale and at least one method", () => {
      const record = makeAssessment("CA-7", "implemented");
      const noRationale = recordNistDetermination(tmpDir, record.id, {
        determination: "satisfied",
        rationale: "   ",
        methods: ["examine"],
      });
      expect(noRationale.error).toContain("rationale");
      const noMethods = recordNistDetermination(tmpDir, record.id, {
        determination: "satisfied",
        rationale: "Valid rationale.",
        methods: [],
      });
      expect(noMethods.error).toContain("method");
    });

    it("records per-objective determination results", () => {
      const record = makeAssessment("AC-2", "implemented");
      const result = recordNistDetermination(tmpDir, record.id, {
        determination: "other-than-satisfied",
        rationale: "One objective failed.",
        methods: ["test"],
        objective_results: [
          { objective_id: "AC-02.01", determination: "satisfied" },
          { objective_id: "AC-02.02", determination: "other-than-satisfied", notes: "Guest access not reviewed." },
        ],
      });
      expect(result.record?.objectives).toHaveLength(2);
      expect(result.record?.objectives[1].determination).toBe("other-than-satisfied");
    });

    it("blocks direct determination changes through updateNistAssessment", () => {
      const record = makeAssessment("AC-2", "implemented");
      const updated = updateNistAssessment(tmpDir, record.id, {
        determination: "satisfied",
      } as Parameters<typeof updateNistAssessment>[2]);
      expect(updated?.determination).toBe("not-assessed");
    });

    it("returns null when updating a missing assessment", () => {
      expect(updateNistAssessment(tmpDir, "missing", {})).toBeNull();
    });

    it("tracks deficiencies and latest assessment per control", () => {
      const first = makeAssessment("AC-2", "partially-implemented");
      const later = createNistAssessment(tmpDir, {
        project_id: "proj-1",
        control_id: "AC-2",
        scope: "Full system boundary",
        implementation_status: "implemented",
        assessment_objective: "Reassessment.",
        assessor: "Assessor Two",
        control_owner: "Control Owner",
        assessment_date: "2099-01-01",
      });
      const withDeficiency = addNistDeficiency(tmpDir, first.id, "Account review not performed.", ["AC-02.03"]);
      expect(withDeficiency?.deficiencies).toHaveLength(1);
      expect(withDeficiency?.deficiencies[0].objective_ids).toEqual(["AC-02.03"]);
      expect(getLatestNistAssessmentForControl(tmpDir, "AC-2")?.id).toBe(later.id);
    });
  });

  describe("evidence management", () => {
    it("adds evidence with a URL reference and defaults to pending review", () => {
      const { evidence, error } = addNistEvidence(tmpDir, {
        title: "Access control policy",
        description: "Latest AC policy from the governance wiki.",
        evidence_type: "policy",
        control_ids: ["AC-1", "AC-2"],
        source_system: "Confluence",
        url: "https://wiki.example.test/display/security/ac-policy",
        collection_method: "export",
        collected_by: "auditor",
        owner: "security-team",
        classification: "internal",
      });
      expect(error).toBeUndefined();
      expect(evidence?.review_status).toBe("pending-review");
      expect(evidence?.control_ids).toEqual(["AC-1", "AC-2"]);
      expect(hasEvidenceForControl(tmpDir, "AC-1")).toBe(true);
      expect(hasEvidenceForControl(tmpDir, "AC-2")).toBe(true);
    });

    it("adds evidence with a relative file reference inside the project", () => {
      const { evidence, error } = addNistEvidence(tmpDir, {
        title: "Firewall ruleset",
        description: "Exported perimeter rules.",
        evidence_type: "configuration",
        control_ids: ["SC-7"],
        source_system: "firewall",
        file_reference: "evidence/firewall-rules.txt",
        collection_method: "manual export",
        collected_by: "netops",
        owner: "netops",
        classification: "confidential",
      });
      expect(error).toBeUndefined();
      expect(evidence?.file_reference).toBe("evidence/firewall-rules.txt");
    });

    it("rejects path traversal in file references", () => {
      const { evidence, error } = addNistEvidence(tmpDir, {
        title: "Hostile",
        description: "Attempts to escape the project root.",
        evidence_type: "other",
        control_ids: ["AC-2"],
        source_system: "test",
        file_reference: "../../etc/passwd",
        collection_method: "manual",
        collected_by: "attacker",
        owner: "attacker",
        classification: "public",
      });
      expect(evidence).toBeNull();
      expect(error).toBeTruthy();
    });

    it("rejects absolute file references and non-http(s) URLs", () => {
      expect(
        validateEvidenceReference(tmpDir, { file_reference: "/etc/passwd" }).valid,
      ).toBe(false);
      expect(
        validateEvidenceReference(tmpDir, { url: "file:///etc/passwd" }).valid,
      ).toBe(false);
      expect(
        validateEvidenceReference(tmpDir, { url: "not a url" }).valid,
      ).toBe(false);
      expect(
        validateEvidenceReference(tmpDir, {}).valid,
      ).toBe(false);
      expect(
        validateEvidenceReference(tmpDir, { url: "https://example.test/evidence" }).valid,
      ).toBe(true);
    });

    it("requires explicit authorization to delete approved evidence", () => {
      const { evidence } = addNistEvidence(tmpDir, {
        title: "Pen test report",
        description: "Annual penetration test.",
        evidence_type: "penetration-test",
        control_ids: ["RA-5"],
        source_system: "pentest vendor",
        url: "https://example.test/pentest",
        collection_method: "vendor delivery",
        collected_by: "vendor",
        owner: "security-team",
        classification: "restricted",
      });
      const id = evidence?.id as string;
      reviewNistEvidence(tmpDir, id, "approved", "lead assessor");
      const blocked = deleteNistEvidence(tmpDir, id, { authorized_by: "someone" });
      expect(blocked.deleted).toBe(false);
      expect(blocked.error).toBeTruthy();
      const forced = deleteNistEvidence(tmpDir, id, { authorized_by: "ciso", force: true });
      expect(forced.deleted).toBe(true);
      expect(loadNistEvidence(tmpDir)).toHaveLength(0);
    });

    it("deletes pending-review evidence without force", () => {
      const { evidence } = addNistEvidence(tmpDir, {
        title: "Draft screenshot",
        description: "Wrong control.",
        evidence_type: "screenshot",
        control_ids: ["AC-2"],
        source_system: "laptop",
        url: "https://example.test/draft",
        collection_method: "screenshot",
        collected_by: "auditor",
        owner: "auditor",
        classification: "internal",
      });
      const result = deleteNistEvidence(tmpDir, evidence?.id as string, { authorized_by: "auditor" });
      expect(result.deleted).toBe(true);
    });

    it("links existing evidence to additional controls", () => {
      const { evidence } = addNistEvidence(tmpDir, {
        title: "Shared config",
        description: "Covers several controls.",
        evidence_type: "configuration",
        control_ids: ["CM-2"],
        source_system: "ansible",
        url: "https://example.test/config",
        collection_method: "export",
        collected_by: "ops",
        owner: "ops",
        classification: "internal",
      });
      const linked = linkEvidenceToControl(tmpDir, evidence?.id as string, "CM-6");
      expect(linked?.control_ids).toEqual(["CM-2", "CM-6"]);
      const again = linkEvidenceToControl(tmpDir, evidence?.id as string, "CM-6");
      expect(again?.control_ids).toEqual(["CM-2", "CM-6"]);
    });

    it("detects evidence approaching expiry", () => {
      const today = new Date("2026-06-15T00:00:00Z");
      const soon = "2026-06-25";
      const far = "2027-06-25";
      for (const expires_at of [soon, far]) {
        addNistEvidence(tmpDir, {
          title: `Scan ${expires_at}`,
          description: "Scanner output.",
          evidence_type: "vulnerability-report",
          control_ids: ["RA-5"],
          source_system: "scanner",
          url: `https://example.test/scan/${expires_at}`,
          collection_method: "automated",
          collected_by: "scanner",
          owner: "security-team",
          classification: "internal",
          expires_at,
        });
      }
      const expiring = getExpiringNistEvidence(tmpDir, 30, today);
      expect(expiring).toHaveLength(1);
      expect(expiring[0].expires_at).toBe(soon);
    });

    it("computes a SHA-256 integrity digest for known content", () => {
      const filePath = path.join(tmpDir, "evidence.txt");
      fs.writeFileSync(filePath, "gesf evidence integrity");
      const digest = computeSha256(filePath);
      expect(digest).toMatch(/^[a-f0-9]{64}$/);
      expect(computeSha256(path.join(tmpDir, "missing.txt"))).toBeNull();
    });
  });

  describe("findings", () => {
    it("creates findings and links them to the assessment", () => {
      const record = makeAssessment("AC-2", "partially-implemented");
      const finding = addNistFinding(tmpDir, {
        control_id: "AC-2",
        assessment_id: record.id,
        title: "Quarterly account review missing",
        description: "No evidence of quarterly reviews.",
        severity: "medium",
      });
      expect(finding.status).toBe("open");
      const linked = getLatestNistAssessmentForControl(tmpDir, "AC-2");
      expect(linked?.finding_ids).toContain(finding.id);
      expect(loadNistFindings(tmpDir)).toHaveLength(1);
    });

    it("refuses to close findings without a satisfied verification on the same control", () => {
      const original = makeAssessment("AC-2", "partially-implemented");
      const finding = addNistFinding(tmpDir, {
        control_id: "AC-2",
        assessment_id: original.id,
        title: "Deficiency",
        description: "Not fixed yet.",
        severity: "low",
      });

      const unassessed = makeAssessment("AC-2", "implemented");
      const blocked = closeNistFinding(tmpDir, finding.id, unassessed.id);
      expect(blocked.finding).toBeNull();
      expect(blocked.error).toContain("satisfied");

      const otherControl = makeAssessment("AC-3", "implemented");
      recordNistDetermination(tmpDir, otherControl.id, {
        determination: "satisfied",
        rationale: "AC-3 verified.",
        methods: ["examine"],
      });
      const wrongControl = closeNistFinding(tmpDir, finding.id, otherControl.id);
      expect(wrongControl.finding).toBeNull();
      expect(wrongControl.error).toContain("AC-3");
    });

    it("closes a finding after a verified reassessment", () => {
      const original = makeAssessment("AC-2", "partially-implemented");
      const finding = addNistFinding(tmpDir, {
        control_id: "AC-2",
        assessment_id: original.id,
        title: "Deficiency",
        description: "Fixed via POA&M remediation.",
        severity: "low",
      });
      const verification = makeAssessment("AC-2", "implemented");
      recordNistDetermination(tmpDir, verification.id, {
        determination: "satisfied",
        rationale: "Remediation verified by test.",
        methods: ["test"],
      });
      const closed = closeNistFinding(tmpDir, finding.id, verification.id);
      expect(closed.finding?.status).toBe("resolved");
      expect(closed.finding?.resolution_assessment_id).toBe(verification.id);
      expect(loadNistFindings(tmpDir)[0].status).toBe("resolved");
    });
  });

  describe("POA&M", () => {
    function addOverduePoam(): string {
      const item = addNistPoamItem(tmpDir, {
        control_id: "AU-2",
        title: "Deploy central audit logging",
        description: "Audit records are incomplete.",
        root_cause: "Logging never configured on staging.",
        security_impact: "Reduced investigative capability.",
        likelihood: "high",
        risk_level: "high",
        remediation_strategy: "Ship central logging agent to all hosts.",
        corrective_actions: ["Install agent", "Verify pipeline"],
        owner: "platform-team",
        department: "Engineering",
        target_completion_date: "2020-01-01",
        milestones: [{ title: "Agent rollout", due_date: "2019-12-01" }],
      });
      return item.id;
    }

    it("creates a POA&M item with milestones in open status", () => {
      const item = addNistPoamItem(tmpDir, {
        control_id: "CA-7",
        title: "Continuous monitoring gaps",
        description: "No alerting on privileged access.",
        remediation_strategy: "Deploy SIEM alert pack.",
        owner: "soc",
        milestones: [{ title: "Alert rules", due_date: "2099-01-01" }],
      });
      expect(item.status).toBe("open");
      expect(item.milestones).toHaveLength(1);
      expect(item.milestones[0].status).toBe("planned");
    });

    it("detects overdue milestones and target dates for active items", () => {
      const id = addOverduePoam();
      const overdue = getOverdueNistPoam(tmpDir);
      expect(overdue).toHaveLength(1);
      expect(overdue[0].item.id).toBe(id);
      expect(overdue[0].overdue_milestones).toHaveLength(1);
      expect(overdue[0].target_overdue).toBe(true);
    });

    it("clears overdue detection when the milestone is completed", () => {
      const id = addOverduePoam();
      const item = getOverdueNistPoam(tmpDir)[0].item;
      completeNistPoamMilestone(tmpDir, id, item.milestones[0].id);
      const stillOverdue = getOverdueNistPoam(tmpDir);
      expect(stillOverdue).toHaveLength(1);
      expect(stillOverdue[0].overdue_milestones).toHaveLength(0);
      expect(stillOverdue[0].target_overdue).toBe(true);
    });

    it("ignores completed, accepted-risk and closed items", () => {
      const id = addOverduePoam();
      for (const status of ["completed", "accepted-risk", "closed"] as const) {
        setNistPoamStatus(tmpDir, id, status);
        expect(getOverdueNistPoam(tmpDir)).toHaveLength(0);
      }
    });

    it("appends additional milestones", () => {
      const id = addOverduePoam();
      const updated = addNistPoamMilestone(tmpDir, id, "Pipeline verification", "2099-02-02");
      expect(updated?.milestones).toHaveLength(2);
    });
  });

  describe("assessment workflow", () => {
    it("creates a draft campaign once and reuses it", () => {
      const first = ensureNistWorkflow(tmpDir, "proj-1");
      expect(first.state).toBe("draft");
      const second = ensureNistWorkflow(tmpDir, "proj-1");
      expect(second.id).toBe(first.id);
      expect(setNistWorkflowScope(tmpDir, "Production system")?.scope).toBe("Production system");
    });

    it("walks the full lifecycle through allowed transitions", () => {
      ensureNistWorkflow(tmpDir, "proj-1");
      const chain = [
        "in-progress",
        "ready-for-assessment",
        "under-assessment",
        "assessment-completed",
        "remediation-required",
        "under-assessment",
        "assessment-completed",
        "closed",
      ] as const;
      for (const state of chain) {
        const result = transitionNistWorkflow(tmpDir, state, { actor: "pm" });
        expect(result.error).toBeUndefined();
        expect(result.campaign?.state).toBe(state);
      }
      const campaign = loadNistWorkflow(tmpDir);
      expect(campaign?.transitions).toHaveLength(chain.length);
      expect(campaign?.transitions[0].actor).toBe("pm");
    });

    it("rejects invalid transitions and repeats", () => {
      ensureNistWorkflow(tmpDir, "proj-1");
      const invalid = transitionNistWorkflow(tmpDir, "closed");
      expect(invalid.campaign).toBeNull();
      expect(invalid.error).toContain("not allowed");
      expect(isWorkflowTransitionAllowed("draft", "closed")).toBe(false);
      expect(isWorkflowTransitionAllowed("draft", "in-progress")).toBe(true);
      const repeat = transitionNistWorkflow(tmpDir, "draft");
      expect(repeat.error).toContain("already");
      expect(transitionNistWorkflow("/nonexistent-gesf-dir", "in-progress").campaign).toBeNull();
    });
  });

  describe("risk matrix", () => {
    it("scores risk with the default 5x5 organizational matrix", () => {
      expect(scoreNistRisk("moderate", "high")).toEqual({ score: 12, rating: "high" });
      expect(scoreNistRisk("very-low", "very-low")).toEqual({ score: 1, rating: "low" });
      expect(scoreNistRisk("very-high", "very-high")).toEqual({ score: 25, rating: "critical" });
      expect(scoreNistRisk("bogus", "high")).toBeNull();
    });

    it("builds risk ratings with treatment metadata", () => {
      const { rating, error } = buildNistRiskRating("high", "moderate", DEFAULT_RISK_MATRIX, {
        treatment: "mitigate",
        risk_owner: "ciso",
      });
      expect(error).toBeUndefined();
      expect(rating?.score).toBe(12);
      expect(rating?.rating).toBe("high");
      expect(rating?.matrix_name).toBe("default-5x5");
      expect(rating?.treatment).toBe("mitigate");
    });

    it("persists a custom organizational matrix", () => {
      const custom = {
        name: "org-3x3",
        likelihood_levels: ["low", "moderate", "high"],
        impact_levels: ["low", "moderate", "high"],
        scores: [
          [1, 2, 3],
          [2, 4, 6],
          [3, 6, 9],
        ],
        rating_bands: [
          { rating: "low", max_score: 3 },
          { rating: "moderate", max_score: 6 },
          { rating: "high", max_score: 9 },
        ],
      };
      saveNistRiskMatrix(tmpDir, custom);
      expect(loadNistRiskMatrix(tmpDir).name).toBe("org-3x3");
      expect(scoreNistRisk("high", "high", custom)).toEqual({ score: 9, rating: "high" });
    });

    it("falls back to the default matrix when none is saved", () => {
      expect(loadNistRiskMatrix(tmpDir).name).toBe(DEFAULT_RISK_MATRIX.name);
    });
  });

  describe("assessment summary", () => {
    it("counts determinations, evidence and open work accurately", () => {
      setModerateBaseline();
      const ac2 = makeAssessment("AC-2", "implemented");
      recordNistDetermination(tmpDir, ac2.id, {
        determination: "satisfied",
        rationale: "Verified.",
        methods: ["examine", "test"],
      });
      const ac3 = makeAssessment("AC-3", "not-implemented");
      recordNistDetermination(tmpDir, ac3.id, {
        determination: "other-than-satisfied",
        rationale: "Enforcement missing.",
        methods: ["test"],
      });
      addNistEvidence(tmpDir, {
        title: "AC-2 evidence",
        description: "Supports AC-2.",
        evidence_type: "policy",
        control_ids: ["AC-2"],
        source_system: "wiki",
        url: "https://example.test/ac2",
        collection_method: "export",
        collected_by: "auditor",
        owner: "security",
        classification: "internal",
      });
      addNistFinding(tmpDir, {
        control_id: "AC-3",
        assessment_id: ac3.id,
        title: "AC-3 deficiency",
        description: "Not enforced.",
        severity: "high",
      });
      addNistPoamItem(tmpDir, {
        control_id: "AC-3",
        title: "Remediate AC-3",
        description: "Enforce access policy.",
        remediation_strategy: "Implement policy enforcement point.",
        owner: "platform",
        target_completion_date: "2099-01-01",
      });

      const summary = summarizeNistAssessment(tmpDir);
      expect(summary.baseline_kind).toBe("moderate");
      expect(summary.applicable_controls).toBe(4);
      expect(summary.assessed).toBe(2);
      expect(summary.satisfied).toBe(1);
      expect(summary.other_than_satisfied).toBe(1);
      expect(summary.not_assessed).toBe(2);
      expect(summary.awaiting_evidence).toBe(1);
      expect(summary.open_findings).toBe(1);
      expect(summary.open_poam).toBe(1);
      expect(summary.overdue_poam).toBe(0);
    });

    it("excludes tailored-out controls from applicable scope", () => {
      setModerateBaseline();
      addBaselineExclusion(tmpDir, "AC-3", "Out of scope.");
      const summary = summarizeNistAssessment(tmpDir);
      expect(summary.applicable_controls).toBe(3);
    });
  });

  describe("schemas", () => {
    it("parses a persisted baseline selection", () => {
      setModerateBaseline();
      const selection = loadNistBaselineSelection(tmpDir);
      expect(() => NistBaselineSelectionSchema.parse(selection)).not.toThrow();
    });

    it("parses an assessment record after a determination", () => {
      const record = makeAssessment("AC-2", "implemented");
      recordNistDetermination(tmpDir, record.id, {
        determination: "satisfied",
        rationale: "Verified.",
        methods: ["examine"],
      });
      const stored = getLatestNistAssessmentForControl(tmpDir, "AC-2");
      expect(() => NistAssessmentRecordSchema.parse(stored)).not.toThrow();
    });

    it("parses evidence and POA&M items", () => {
      const { evidence } = addNistEvidence(tmpDir, {
        title: "Cert",
        description: "ISO certificate.",
        evidence_type: "certificate",
        control_ids: ["SA-9"],
        source_system: "vendor",
        url: "https://example.test/cert",
        collection_method: "vendor delivery",
        collected_by: "procurement",
        owner: "procurement",
        classification: "public",
      });
      expect(() => NistEvidenceItemSchema.parse(evidence)).not.toThrow();
      const item = addNistPoamItem(tmpDir, {
        control_id: "SA-9",
        title: "Vendor follow-up",
        description: "Renewal overdue.",
        remediation_strategy: "Chase vendor.",
        owner: "procurement",
      });
      expect(() => NistPoamItemSchema.parse(item)).not.toThrow();
    });
  });
});
