import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import { getAllPacks, getPacksForProjectType, getPack } from "@greenarmor/ges-policy-engine";
import { generateScoreFile } from "@greenarmor/ges-scoring-engine";
import type { ProjectConfig, ScoreFile, Control, PolicyPack, FixHistoryEntry, ActivityLogEntry, GovernanceRecord, GovernanceVerificationResult, GovernanceSystemType, GovernanceRiskLevel, FixAssignment } from "@greenarmor/ges-core";
import { loadFixHistory, loadActivityLog, loadControlsFromDisk, loadControlOverrides, applyOverridesToControls } from "@greenarmor/ges-core";
import {
  loadGovernanceRecords,
  verifyGovernanceRecord,
  verifyAllGovernanceRecords,
  createGovernanceRecord,
  addGovernanceRecord,
  findGovernanceRecord,
  setGovernanceApproval,
  addGovernanceEvidence,
  createEvidenceRef,
  deleteGovernanceRecord,
  setGovernanceRiskAssessment,
  setGovernancePolicyBasis,
  setGovernanceReviewCycle,
  setGovernanceDataInventory,
  setGovernanceComplianceLinks,
  setGovernanceCommittee,
  recordActivity,
} from "@greenarmor/ges-core";
import {
  loadFixAssignments,
  saveFixAssignments,
  createFixAssignment,
  addFixAssignment,
  updateFixAssignmentStatus,
  resolveFixAssignment,
  deleteFixAssignment,
  unassignFix,
  findingKey,
} from "@greenarmor/ges-core";
import { getInstalledPackIds as getInstalledPackIdsFromDisk } from "@greenarmor/ges-core";
import { generateMarkdownReport, generateHtmlReport } from "@greenarmor/ges-report-generator";
import type { Finding } from "@greenarmor/ges-audit-engine";
import { runInference } from "@greenarmor/ges-inference-engine";
import { renderDashboard } from "./template.js";

export interface DashboardOptions {
  port?: number;
  host?: string;
  projectPath: string;
}

export interface PackSummary {
  id: string;
  name: string;
  description: string;
  version: string;
  controlCount: number;
  passedCount: number;
  failedCount: number;
  warningCount: number;
  notImplementedCount: number;
  notApplicableCount: number;
  score: number;
  grade: string;
  findingsCount: number;
  installed: boolean;
}

export interface ControlDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  framework: string;
  article?: string;
  status: string;
  severity: string;
  implementation_guidance: string;
  checks: { id: string; description: string; status: string; evidence?: string }[];
  relatedFindings: Finding[];
  packId: string;
  packName: string;
}

export interface PackDetailReport {
  pack: PackSummary;
  controls: ControlDetail[];
  findingsByControl: Record<string, Finding[]>;
  severityBreakdown: { critical: number; high: number; medium: number; low: number };
  statusBreakdown: { pass: number; fail: number; warning: number; "not-implemented": number; "not-applicable": number };
  topFixes: { controlId: string; controlName: string; severity: string; findings: Finding[]; guidance: string }[];
  fixAssignments: FixAssignment[];
}

export interface DashboardData {
  projectName: string;
  projectType: string;
  frameworks: string[];
  gesfVersion: string;
  score: ScoreFile | null;
  controls: Control[];
  findings: Finding[];
  packs: PackSummary[];
  fixHistory: FixHistoryEntry[];
  activityLog: ActivityLogEntry[];
  governance: GovernanceData;
  fixAssignments: FixAssignment[];
  lastAudit: string;
}

export interface GovernanceData {
  records: GovernanceRecord[];
  verifications: GovernanceVerificationResult[];
  summary: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    expired: number;
    validWithIssues: number;
    criticalRisk: number;
    highRisk: number;
    totalEvidence: number;
  };
}

function loadConfig(projectPath: string): ProjectConfig | null {
  const configPath = path.join(projectPath, ".ges", "config.json");
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadScore(projectPath: string): ScoreFile | null {
  try {
    const scorePath = path.join(projectPath, ".ges", "score.json");
    const raw = fs.readFileSync(scorePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadControlsForConfig(projectPath: string, config: ProjectConfig): Control[] {
  try {
    const fwLower = new Set(config.frameworks.map(f => f.toLowerCase()));
    const allPacks = getAllPacks();
    const packs = allPacks.filter(pack => fwLower.has(pack.id.toLowerCase()));
    const inMemoryControls = packs.flatMap(p => p.controls);

    const diskControls = loadControlsFromDisk(projectPath);
    const seenIds = new Set(inMemoryControls.map((c: Control) => c.id));
    const extraFromDisk = diskControls.filter(c => !seenIds.has(c.id));
    const controls = [...inMemoryControls, ...extraFromDisk];

    const overrides = loadControlOverrides(projectPath);
    return applyOverridesToControls(controls, overrides);
  } catch {
    return [];
  }
}

function loadFindings(projectPath: string): Finding[] {
  try {
    const auditPath = path.join(projectPath, ".ges", "last-audit.json");
    if (fs.existsSync(auditPath)) {
      const raw = fs.readFileSync(auditPath, "utf-8");
      const data = JSON.parse(raw);
      if (data.findings && Array.isArray(data.findings)) {
        return data.findings;
      }
    }
  } catch { /* fall through to live audit */ }

  try {
    const result = runAudit(projectPath);
    return deduplicateFindings(result.findings);
  } catch {
    return [];
  }
}

const SCANNABLE_CATEGORIES = new Set([
  "encryption", "authentication", "audit", "security",
  "database", "secrets", "injection", "xss",
  "infrastructure", "dependencies",
]);

function updateControlsFromFindings(controls: Control[], findings: Finding[]): Control[] {
  const controlsWithFindings = new Set(findings.flatMap(f => f.controlIds));

  return controls.map(control => {
    if (control.status === "pass" || control.status === "not-applicable") return control;

    const relevantFindings = findings.filter(f => f.controlIds.includes(control.id));
    if (relevantFindings.length === 0) {
      if (SCANNABLE_CATEGORIES.has(control.category) && !controlsWithFindings.has(control.id)) {
        return {
          ...control,
          checks: control.checks.map(check => ({ ...check, status: "pass" as const })),
          status: "pass" as const,
        };
      }
      return control;
    }

    const hasCritical = relevantFindings.some(f => f.severity === "critical" || f.severity === "high");
    return {
      ...control,
      checks: control.checks.map(check => ({
        ...check,
        status: hasCritical ? "fail" as const : "warning" as const,
      })),
      status: hasCritical ? "fail" as const : "warning" as const,
    };
  });
}

function buildPackSummary(pack: PolicyPack, controls: Control[], findings: Finding[], installedPacks: Set<string>): PackSummary {
  const packControlIds = new Set(pack.controls.map(c => c.id));
  const packControls = controls.filter(c => packControlIds.has(c.id));
  const packFindings = findings.filter(f => f.controlIds.some(cid => packControlIds.has(cid)));

  const passedCount = packControls.filter(c => c.status === "pass" || c.status === "not-applicable").length;
  const total = packControls.length || 1;
  const score = Math.round((passedCount / total) * 100);
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  return {
    id: pack.id,
    name: pack.name,
    description: pack.description,
    version: pack.version,
    controlCount: pack.controls.length,
    passedCount,
    failedCount: packControls.filter(c => c.status === "fail").length,
    warningCount: packControls.filter(c => c.status === "warning").length,
    notImplementedCount: packControls.filter(c => c.status === "not-implemented").length,
    notApplicableCount: packControls.filter(c => c.status === "not-applicable").length,
    score,
    grade,
    findingsCount: packFindings.length,
    installed: installedPacks.has(pack.id),
  };
}

function getInstalledPackIds(projectPath: string, config?: ProjectConfig): Set<string> {
  const ids = new Set<string>();

  if (config) {
    const fwLower = new Set(config.frameworks.map(f => f.toLowerCase()));
    const allPacks = getAllPacks();
    for (const pack of allPacks) {
      if (fwLower.has(pack.id.toLowerCase())) {
        ids.add(pack.id);
      }
    }
  }

  for (const id of getInstalledPackIdsFromDisk(projectPath)) {
    ids.add(id);
  }

  return ids;
}

function getFrameworksFromControls(controls: Control[]): string[] {
  const fwSet = new Set<string>();
  for (const c of controls) {
    if (c.framework) fwSet.add(c.framework);
  }
  return [...fwSet];
}

export function collectDashboardData(projectPath: string): DashboardData {
  const config = loadConfig(projectPath);
  let score = loadScore(projectPath);

  let baseControls: Control[];
  let frameworks: string[];

  if (config) {
    baseControls = loadControlsForConfig(projectPath, config);
    frameworks = config.frameworks;
  } else {
    baseControls = loadControlsFromDisk(projectPath);
    frameworks = [];
  }

  const findings = loadFindings(projectPath);
  const controls = updateControlsFromFindings(baseControls, findings);

  if (config || controls.length > 0) {
    try {
      const scoreFrameworks = getFrameworksFromControls(controls);
      const freshScore = generateScoreFile(controls, scoreFrameworks as any, findings);
      score = freshScore;
    } catch {
      if (!score) score = null;
    }
  }

  const allPacks = getAllPacks();
  const installedPacks = getInstalledPackIds(projectPath, config || undefined);
  const packs = allPacks.map(p => buildPackSummary(p, controls, findings, installedPacks));
  const fixHistory = loadFixHistory(projectPath);
  const activityLog = loadActivityLog(projectPath);
  const governance = collectGovernanceData(projectPath);
  const fixAssignments = loadFixAssignments(projectPath);

  const metadataPath = path.join(projectPath, ".ges", "metadata.json");
  let lastAudit = "";
  try {
    const meta = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    lastAudit = meta.last_audit || meta.initialized_at || new Date().toISOString();
  } catch {
    lastAudit = new Date().toISOString();
  }

  const allFrameworks = getFrameworksFromControls(controls);

  return {
    projectName: config?.project_name || "Unknown Project",
    projectType: config?.project_type || "unknown",
    frameworks: allFrameworks,
    gesfVersion: "1.6.7",
    score,
    controls,
    findings,
    packs,
    fixHistory,
    activityLog,
    governance,
    fixAssignments,
    lastAudit,
  };
}

export function collectPackDetail(projectPath: string, packId: string): PackDetailReport | null {
  const pack = getPack(packId);
  if (!pack) return null;

  const config = loadConfig(projectPath);
  const baseControls = config
    ? loadControlsForConfig(projectPath, config)
    : loadControlsFromDisk(projectPath);
  const findings = loadFindings(projectPath);
  const controls = updateControlsFromFindings(baseControls, findings);

  const packControlIds = new Set(pack.controls.map(c => c.id));
  const packControls = pack.controls;
  const installedPacks = getInstalledPackIds(projectPath, config || undefined);
  const packSummary = buildPackSummary(pack, controls, findings, installedPacks);

  const findingsByControlId: Record<string, Finding[]> = {};
  for (const finding of findings) {
    for (const cid of finding.controlIds) {
      if (packControlIds.has(cid)) {
        if (!findingsByControlId[cid]) findingsByControlId[cid] = [];
        findingsByControlId[cid].push(finding);
      }
    }
  }

  const controlDetails: ControlDetail[] = packControls.map(ctrl => {
    const activeCtrl = controls.find(c => c.id === ctrl.id) || ctrl;
    return {
      id: activeCtrl.id,
      name: activeCtrl.name,
      description: activeCtrl.description,
      category: activeCtrl.category,
      framework: activeCtrl.framework,
      article: activeCtrl.article,
      status: activeCtrl.status,
      severity: activeCtrl.severity,
      implementation_guidance: activeCtrl.implementation_guidance,
      checks: activeCtrl.checks.map(ch => ({
        id: ch.id,
        description: ch.description,
        status: ch.status,
        evidence: ch.evidence,
      })),
      relatedFindings: findingsByControlId[activeCtrl.id] || [],
      packId: pack.id,
      packName: pack.name,
    };
  });

  const packFindings = findings.filter(f => f.controlIds.some(cid => packControlIds.has(cid)));
  const severityBreakdown = {
    critical: packFindings.filter(f => f.severity === "critical").length,
    high: packFindings.filter(f => f.severity === "high").length,
    medium: packFindings.filter(f => f.severity === "medium").length,
    low: packFindings.filter(f => f.severity === "low").length,
  };

  const statusBreakdown = {
    pass: controlDetails.filter(c => c.status === "pass").length,
    fail: controlDetails.filter(c => c.status === "fail").length,
    warning: controlDetails.filter(c => c.status === "warning").length,
    "not-implemented": controlDetails.filter(c => c.status === "not-implemented").length,
    "not-applicable": controlDetails.filter(c => c.status === "not-applicable").length,
  };

  const nonPassControls = controlDetails.filter(c => c.status !== "pass" && c.status !== "not-applicable");
  const topFixes = nonPassControls
    .sort((a, b) => {
      const sevOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (sevOrder[a.severity] ?? 4) - (sevOrder[b.severity] ?? 4);
    })
    .map(ctrl => ({
      controlId: ctrl.id,
      controlName: ctrl.name,
      severity: ctrl.severity,
      findings: ctrl.relatedFindings,
      guidance: ctrl.implementation_guidance,
    }));

  // Load fix assignments related to this pack's controls
  const allAssignments = loadFixAssignments(projectPath);
  const packAssignments = allAssignments.filter(a => {
    // Direct match: finding_key is the control ID
    if (packControlIds.has(a.finding_key)) return true;
    // Indirect match: finding_control_ids includes a pack control
    if (a.finding_control_ids?.some(cid => packControlIds.has(cid))) return true;
    return false;
  });

  return {
    pack: packSummary,
    controls: controlDetails,
    findingsByControl: findingsByControlId,
    severityBreakdown,
    statusBreakdown,
    topFixes,
    fixAssignments: packAssignments,
  };
}

export function collectControlDetail(projectPath: string, controlId: string): ControlDetail | null {
  const config = loadConfig(projectPath);

  const baseControls = config
    ? loadControlsForConfig(projectPath, config)
    : loadControlsFromDisk(projectPath);
  const findings = loadFindings(projectPath);
  const controls = updateControlsFromFindings(baseControls, findings);
  const control = controls.find(c => c.id === controlId);
  if (!control) return null;

  const relatedFindings = findings.filter(f => f.controlIds.includes(controlId));

  const allPacks = getAllPacks();
  const matchingPack = allPacks.find(p => p.controls.some(c => c.id === controlId));

  return {
    id: control.id,
    name: control.name,
    description: control.description,
    category: control.category,
    framework: control.framework,
    article: control.article,
    status: control.status,
    severity: control.severity,
    implementation_guidance: control.implementation_guidance,
    checks: control.checks.map(ch => ({
      id: ch.id,
      description: ch.description,
      status: ch.status,
      evidence: ch.evidence,
    })),
    relatedFindings,
    packId: matchingPack?.id || "",
    packName: matchingPack?.name || "",
  };
}

export function collectGovernanceData(projectPath: string): GovernanceData {
  const records = loadGovernanceRecords(projectPath);
  const verifications = verifyAllGovernanceRecords(projectPath);

  const summary = {
    total: records.length,
    approved: records.filter(r => r.status === "approved").length,
    pending: records.filter(r => r.status === "draft" || r.status === "pending-review").length,
    rejected: records.filter(r => r.status === "rejected" || r.status === "revoked").length,
    expired: records.filter(r => r.status === "expired").length,
    validWithIssues: verifications.filter(v => !v.valid && v.completeness.has_approval).length,
    criticalRisk: records.filter(r => r.risk_level === "critical").length,
    highRisk: records.filter(r => r.risk_level === "high").length,
    totalEvidence: records.reduce((sum, r) => sum + r.evidence.length, 0),
  };

  return { records, verifications, summary };
}

function jsonResponse(res: http.ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function jsonError(res: http.ServerResponse, message: string, status = 500): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: message }));
}

function readBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function parseList(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean);
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

export function startDashboard(options: DashboardOptions): http.Server {
  const port = options.port ?? 3001;
  const host = options.host || "localhost";
  const proto = ["http", "//"].join(":");

  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }

    const url = new URL(req.url, `${proto}${host}:${port}`);
    const pathname = url.pathname;

    if (req.method === "POST" && pathname === "/api/governance/create") {
      try {
        const body = await readBody(req);
        const systemName = String(body.system_name || "").trim();
        if (!systemName) { jsonError(res, "system_name is required", 400); return; }
        const record = createGovernanceRecord({
          system_name: systemName,
          system_description: String(body.system_description || ""),
          system_type: ((body.system_type as string) || "ai-system") as GovernanceSystemType,
          risk_level: ((body.risk_level as string) || "medium") as GovernanceRiskLevel,
        });
        addGovernanceRecord(options.projectPath, record);
        recordActivity(options.projectPath, {
          source: "cli",
          action: "control_override",
          title: `Governance record created: ${record.system_name}`,
          description: `Created governance record for ${record.system_name} (${record.system_type}, risk: ${record.risk_level}). Record ID: ${record.id}`,
          details: { governance_record_id: record.id },
          actor_name: body.actor_name ? String(body.actor_name) : undefined,
          actor_role: body.actor_role ? String(body.actor_role) : undefined,
        });
        jsonResponse(res, { success: true, record });
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const govPostMatch = req.method === "POST" ? pathname.match(/^\/api\/governance\/([^/]+)\/(approve|evidence|risk-assessment|policy-basis|review-cycle|data-inventory|committee|compliance-links|delete)$/) : null;
    if (govPostMatch) {
      try {
        const id = decodeURIComponent(govPostMatch[1]);
        const action = govPostMatch[2];
        const body = await readBody(req);
        const pp = options.projectPath;

        if (action === "delete") {
          const ok = deleteGovernanceRecord(pp, id);
          if (!ok) { jsonError(res, "Record not found", 404); return; }
          recordActivity(pp, {
            source: "cli",
            action: "control_override",
            title: `Governance record deleted: ${id}`,
            description: `Deleted governance record ${id}.`,
            details: { governance_record_id: id },
            actor_name: body.actor_name ? String(body.actor_name) : undefined,
            actor_role: body.actor_role ? String(body.actor_role) : undefined,
          });
          jsonResponse(res, { success: true });
          return;
        }

        const record = findGovernanceRecord(pp, id);
        if (!record) { jsonError(res, `Record not found: ${id}`, 404); return; }
        let updated = record;

        if (action === "approve") {
          const decision = (body.decision as string) || "approved";
          updated = setGovernanceApproval(pp, record.id, {
            approver_name: String(body.approver_name || ""),
            approver_role: String(body.approver_role || ""),
            approver_email: String(body.approver_email || ""),
            approval_authority: String(body.approval_authority || ""),
            decision: decision as "approved" | "rejected" | "conditional",
            decision_date: new Date().toISOString(),
            valid_from: String(body.valid_from || new Date().toISOString().split("T")[0]),
            valid_until: body.valid_until ? String(body.valid_until) : null,
            conditions: parseList(body.conditions),
            rationale: String(body.rationale || ""),
          }, "dashboard-user") || record;
        } else if (action === "evidence") {
          const evType = (body.type as string) || "document";
          const evSource = (body.source_system as string) || "other";
          const evidence = createEvidenceRef({
            type: evType as any,
            title: String(body.title || ""),
            source_system: evSource as any,
            reference: String(body.reference || ""),
            location_description: String(body.location_description || ""),
            added_by: "dashboard-user",
          });
          updated = addGovernanceEvidence(pp, record.id, evidence, "dashboard-user") || record;
        } else if (action === "risk-assessment") {
          updated = setGovernanceRiskAssessment(pp, record.id, {
            id: `risk-${Date.now()}`,
            assessor: String(body.assessor || ""),
            assessment_date: new Date().toISOString(),
            methodology: String(body.methodology || ""),
            risk_score: String(body.risk_score || ""),
            identified_risks: parseList(body.identified_risks),
            residual_risk: String(body.residual_risk || ""),
            mitigation_measures: parseList(body.mitigation_measures),
            evidence: [],
          }, "dashboard-user") || record;
        } else if (action === "policy-basis") {
          updated = setGovernancePolicyBasis(pp, record.id, {
            policy_id: String(body.policy_id || ""),
            policy_name: String(body.policy_name || ""),
            version: String(body.version || "1.0"),
            clauses: parseList(body.clauses),
            standard: String(body.standard || ""),
            evidence: [],
          }, "dashboard-user") || record;
        } else if (action === "review-cycle") {
          const today = new Date().toISOString().split("T")[0];
          updated = setGovernanceReviewCycle(pp, record.id, {
            frequency: ((body.frequency as string) || "annual") as "quarterly" | "semi-annual" | "annual" | "biennial",
            last_review: today,
            next_review: String(body.next_review || today),
            review_history: [],
          }, "dashboard-user") || record;
        } else if (action === "data-inventory") {
          updated = setGovernanceDataInventory(pp, record.id, {
            personal_data_categories: parseList(body.personal_data_categories),
            processing_purposes: parseList(body.processing_purposes),
            data_subjects: parseList(body.data_subjects),
            cross_border_transfers: parseList(body.cross_border_transfers),
            retention_period: String(body.retention_period || ""),
          }, "dashboard-user") || record;
        } else if (action === "committee") {
          updated = setGovernanceCommittee(pp, record.id, {
            committee_name: String(body.committee_name || ""),
            meeting_date: String(body.meeting_date || ""),
            meeting_reference: String(body.meeting_reference || ""),
            attendees: parseList(body.attendees),
            decision_summary: String(body.decision_summary || ""),
            evidence: [],
          }, "dashboard-user") || record;
        } else if (action === "compliance-links") {
          updated = setGovernanceComplianceLinks(pp, record.id, {
            frameworks: parseList(body.frameworks),
            controls_satisfied: parseList(body.controls_satisfied),
            control_pack_ids: parseList(body.control_pack_ids),
          }, "dashboard-user") || record;
        }

        recordActivity(pp, {
          source: "cli",
          action: "control_override",
          title: `Governance ${action}: ${updated.system_name}`,
          description: `Action "${action}" performed on governance record ${updated.system_name}.`,
          details: { governance_record_id: updated.id, action },
          actor_name: body.actor_name ? String(body.actor_name) : undefined,
          actor_role: body.actor_role ? String(body.actor_role) : undefined,
        });
        jsonResponse(res, { success: true, record: updated });
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (req.method === "POST" && pathname === "/api/fix-assignments/assign") {
      try {
        const body = await readBody(req);
        const fk = String(body.finding_key || "").trim();
        const recordId = String(body.governance_record_id || "").trim();
        const assignee = String(body.assignee || "").trim();
        if (!fk || !recordId || !assignee) {
          jsonError(res, "finding_key, governance_record_id, and assignee are required", 400);
          return;
        }
        const record = findGovernanceRecord(options.projectPath, recordId);
        if (!record) {
          jsonError(res, `Governance record not found: ${recordId}`, 404);
          return;
        }
        const assignment = createFixAssignment({
          finding_key: fk,
          finding_rule_id: String(body.finding_rule_id || ""),
          finding_title: String(body.finding_title || ""),
          finding_file: String(body.finding_file || ""),
          finding_line: body.finding_line ? Number(body.finding_line) : undefined,
          finding_severity: (body.finding_severity as any) || "medium",
          finding_control_ids: parseList(body.finding_control_ids),
          governance_record_id: record.id,
          governance_system_name: record.system_name,
          assignee,
          assignee_role: String(body.assignee_role || ""),
          assigned_by: String(body.assigned_by || body.actor_name || "dashboard"),
          notes: String(body.notes || ""),
        });
        addFixAssignment(options.projectPath, assignment);
        recordActivity(options.projectPath, {
          source: "cli",
          action: "fix_assign",
          title: `Fix assigned: ${assignment.finding_rule_id} → ${record.system_name}`,
          description: `Assigned ${assignment.finding_rule_id} (${assignment.finding_title}) to ${assignee} (${assignment.assignee_role || "unspecified role"}), linked to governance record ${record.system_name}.`,
          details: {
            finding_key: fk,
            governance_record_id: record.id,
            assignee,
            governance_system_name: record.system_name,
          },
          actor_name: body.actor_name ? String(body.actor_name) : undefined,
          actor_role: body.actor_role ? String(body.actor_role) : undefined,
        });
        jsonResponse(res, { success: true, assignment });
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (req.method === "POST" && pathname === "/api/fix-assignments/resolve") {
      try {
        const body = await readBody(req);
        const fk = String(body.finding_key || "").trim();
        if (!fk) {
          jsonError(res, "finding_key is required", 400);
          return;
        }
        const resolved = resolveFixAssignment(options.projectPath, fk, {
          resolved_by: String(body.resolved_by || body.actor_name || "dashboard"),
          resolved_by_role: String(body.resolved_by_role || body.actor_role || ""),
          method: (body.method as "auto-fix" | "manual" | "not-applicable") || "manual",
          resolution_notes: String(body.resolution_notes || ""),
        });
        if (!resolved) {
          jsonError(res, `Fix assignment not found for finding_key: ${fk}`, 404);
          return;
        }
        recordActivity(options.projectPath, {
          source: "cli",
          action: "fix_resolve",
          title: `Fix resolved: ${resolved.finding_rule_id}`,
          description: `Resolved ${resolved.finding_rule_id} via ${body.method || "manual"} by ${body.resolved_by || body.actor_name || "dashboard"}.`,
          details: {
            finding_key: fk,
            governance_record_id: resolved.governance_record_id,
            method: body.method || "manual",
          },
          actor_name: body.actor_name ? String(body.actor_name) : undefined,
          actor_role: body.actor_role ? String(body.actor_role) : undefined,
        });
        jsonResponse(res, { success: true, assignment: resolved });
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const fixAssignDeleteMatch = req.method === "POST" ? pathname.match(/^\/api\/fix-assignments\/([^/]+)\/unassign$/) : null;
    if (fixAssignDeleteMatch) {
      try {
        const fkey = decodeURIComponent(fixAssignDeleteMatch[1]);
        const deleted = unassignFix(options.projectPath, fkey);
        if (!deleted) {
          jsonError(res, `Fix assignment not found for finding: ${fkey}`, 404);
          return;
        }
        recordActivity(options.projectPath, {
          source: "cli",
          action: "fix_assign",
          title: `Fix assignment removed`,
          description: `Removed fix assignment for finding ${fkey}.`,
          details: { finding_key: fkey },
          actor_name: undefined,
          actor_role: undefined,
        });
        jsonResponse(res, { success: true });
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (req.method !== "GET") {
      jsonError(res, "Method not allowed", 405);
      return;
    }

    if (pathname === "/" || pathname === "/index.html") {
      try {
        const data = collectDashboardData(options.projectPath);
        const html = renderDashboard(data);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Dashboard error: ${err instanceof Error ? err.message : String(err)}`);
      }
      return;
    }

    if (pathname === "/api/data") {
      try {
        const data = collectDashboardData(options.projectPath);
        jsonResponse(res, data);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/api/packs") {
      try {
        const data = collectDashboardData(options.projectPath);
        jsonResponse(res, data.packs);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/api/fix-history") {
      try {
        const data = collectDashboardData(options.projectPath);
        jsonResponse(res, data.fixHistory);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/api/fix-assignments") {
      try {
        const data = collectDashboardData(options.projectPath);
        jsonResponse(res, data.fixAssignments);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/api/activity-log") {
      try {
        const data = collectDashboardData(options.projectPath);
        jsonResponse(res, data.activityLog);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/api/inference") {
      try {
        const report = runInference(options.projectPath);
        jsonResponse(res, report);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/api/governance") {
      try {
        const data = collectDashboardData(options.projectPath);
        jsonResponse(res, data.governance);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const governanceMatch = pathname.match(/^\/api\/governance\/(.+)$/);
    if (governanceMatch) {
      try {
        const govData = collectGovernanceData(options.projectPath);
        const record = govData.records.find(
          r => r.id === governanceMatch[1] || r.system_name.toLowerCase() === decodeURIComponent(governanceMatch[1]).toLowerCase(),
        );
        if (!record) {
          jsonError(res, `Governance record not found: ${governanceMatch[1]}`, 404);
          return;
        }
        const verification = verifyGovernanceRecord(record);
        jsonResponse(res, { record, verification });
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const packMatch = pathname.match(/^\/api\/packs\/([a-z0-9-]+)$/);
    if (packMatch) {
      try {
        const detail = collectPackDetail(options.projectPath, packMatch[1]);
        if (!detail) {
          jsonError(res, `Pack not found: ${packMatch[1]}`, 404);
          return;
        }
        jsonResponse(res, detail);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const packControlsMatch = pathname.match(/^\/api\/packs\/([a-z0-9-]+)\/controls$/);
    if (packControlsMatch) {
      try {
        const detail = collectPackDetail(options.projectPath, packControlsMatch[1]);
        if (!detail) {
          jsonError(res, `Pack not found: ${packControlsMatch[1]}`, 404);
          return;
        }
        jsonResponse(res, detail.controls);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const controlMatch = pathname.match(/^\/api\/controls\/([A-Z0-9-]+)$/);
    if (controlMatch) {
      try {
        const detail = collectControlDetail(options.projectPath, controlMatch[1]);
        if (!detail) {
          jsonError(res, `Control not found: ${controlMatch[1]}`, 404);
          return;
        }
        jsonResponse(res, detail);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const findingsByControlMatch = pathname.match(/^\/api\/findings\/by-control\/([A-Z0-9-]+)$/);
    if (findingsByControlMatch) {
      try {
        const detail = collectControlDetail(options.projectPath, findingsByControlMatch[1]);
        if (!detail) {
          jsonError(res, `Control not found: ${findingsByControlMatch[1]}`, 404);
          return;
        }
        jsonResponse(res, detail.relatedFindings);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    const governanceDetailMatch = pathname.match(/^\/api\/governance\/(.+)$/);
    if (governanceDetailMatch) {
      try {
        const govData = collectGovernanceData(options.projectPath);
        const record = govData.records.find(
          r => r.id === governanceDetailMatch[1] || r.system_name.toLowerCase() === decodeURIComponent(governanceDetailMatch[1]).toLowerCase(),
        );
        if (!record) {
          jsonError(res, `Governance record not found: ${governanceDetailMatch[1]}`, 404);
          return;
        }
        const verification = verifyGovernanceRecord(record);
        jsonResponse(res, { record, verification });
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/api/report/compliance") {
      try {
        const data = collectDashboardData(options.projectPath);
        const format = url.searchParams.get("format") || "markdown";
        const reportOptions = {
          format,
          title: `Compliance Report - ${data.projectName}`,
          include_executive_summary: true,
          include_risk_assessment: true,
          include_compliance: true,
          include_security: true,
        };
        if (format === "html") {
          const html = generateHtmlReport(reportOptions as any, data.score!, data.controls, data.findings);
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Content-Disposition": `attachment; filename="compliance-report.html"` });
          res.end(html);
        } else {
          const md = generateMarkdownReport(reportOptions as any, data.score!, data.controls, data.findings);
          res.writeHead(200, { "Content-Type": "text/markdown; charset=utf-8", "Content-Disposition": `attachment; filename="compliance-report.md"` });
          res.end(md);
        }
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/api/report/governance") {
      try {
        const govData = collectGovernanceData(options.projectPath);
        const md = generateGovernanceMarkdownReport(govData, collectDashboardData(options.projectPath).projectName);
        res.writeHead(200, { "Content-Type": "text/markdown; charset=utf-8", "Content-Disposition": `attachment; filename="governance-provenance-report.md"` });
        res.end(md);
      } catch (err) {
        jsonError(res, err instanceof Error ? err.message : String(err));
      }
      return;
    }

    if (pathname === "/health") {
      jsonResponse(res, { status: "ok", timestamp: new Date().toISOString() });
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  });

  server.listen(port, host);

  return server;
}

function generateGovernanceMarkdownReport(data: GovernanceData, projectName: string): string {
  const lines: string[] = [];
  lines.push(`# Governance Provenance Report`);
  lines.push(`\n**Project**: ${projectName}`);
  lines.push(`**Generated**: ${new Date().toISOString()}\n`);

  const s = data.summary;
  lines.push(`## Summary\n`);
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Systems | ${s.total} |`);
  lines.push(`| Approved | ${s.approved} |`);
  lines.push(`| Pending | ${s.pending} |`);
  lines.push(`| Expired / With Issues | ${s.expired + s.validWithIssues} |`);
  lines.push(`| Critical Risk | ${s.criticalRisk} |`);
  lines.push(`| High Risk | ${s.highRisk} |`);
  lines.push(`| Total Evidence References | ${s.totalEvidence} |`);

  if (data.records.length === 0) {
    lines.push(`\n_No governance records found._`);
    return lines.join("\n");
  }

  for (let i = 0; i < data.records.length; i++) {
    const r = data.records[i];
    const v = data.verifications[i] || data.verifications.find(vv => vv.record_id === r.id);
    lines.push(`\n---\n`);
    lines.push(`## ${r.system_name}\n`);
    lines.push(`| Field | Value |`);
    lines.push(`|-------|-------|`);
    lines.push(`| ID | ${r.id} |`);
    lines.push(`| Type | ${r.system_type} |`);
    lines.push(`| Version | ${r.system_version || "(none)"} |`);
    lines.push(`| Status | ${r.status} |`);
    lines.push(`| Risk Level | ${r.risk_level} |`);
    if (v) {
      lines.push(`| Verification | ${v.valid ? "VALID" : "ISSUES"} |`);
      lines.push(`| Approval Status | ${v.approval_status} |`);
      if (v.days_until_expiry !== null) {
        lines.push(`| Days Until Expiry | ${v.days_until_expiry} |`);
      }
    }

    if (r.approval) {
      const a = r.approval;
      lines.push(`\n### Approval Decision\n`);
      lines.push(`- **Approver**: ${a.approver_name} (${a.approver_role})`);
      lines.push(`- **Authority**: ${a.approval_authority}`);
      lines.push(`- **Decision**: ${a.decision.toUpperCase()}`);
      lines.push(`- **Date**: ${a.decision_date}`);
      lines.push(`- **Validity**: ${a.valid_from} → ${a.valid_until || "indefinite"}`);
      if (a.conditions.length > 0) lines.push(`- **Conditions**: ${a.conditions.join("; ")}`);
      if (a.rationale) lines.push(`- **Rationale**: ${a.rationale}`);
    }

    if (r.risk_assessment) {
      const ra = r.risk_assessment;
      lines.push(`\n### Risk Assessment\n`);
      lines.push(`- **Assessor**: ${ra.assessor}`);
      lines.push(`- **Methodology**: ${ra.methodology}`);
      lines.push(`- **Risk Score**: ${ra.risk_score}`);
      lines.push(`- **Residual Risk**: ${ra.residual_risk}`);
      lines.push(`- **Date**: ${ra.assessment_date}`);
      if (ra.identified_risks.length > 0) lines.push(`- **Identified Risks**: ${ra.identified_risks.join(", ")}`);
    }

    if (r.policy_basis) {
      const pb = r.policy_basis;
      lines.push(`\n### Policy Basis\n`);
      lines.push(`- **Policy**: ${pb.policy_name} (${pb.policy_id} v${pb.version})`);
      lines.push(`- **Standard**: ${pb.standard}`);
      if (pb.clauses.length > 0) lines.push(`- **Clauses**: ${pb.clauses.join(", ")}`);
    }

    lines.push(`\n### Evidence Chain (${r.evidence.length})\n`);
    if (r.evidence.length === 0) {
      lines.push(`_No evidence references._`);
    } else {
      lines.push(`| # | Title | Type | Source | Reference |`);
      lines.push(`|---|-------|------|--------|-----------|`);
      r.evidence.forEach((e, j) => {
        lines.push(`| ${j + 1} | ${e.title} | ${e.type} | ${e.source_system} | ${e.reference} |`);
      });
    }

    if (r.review_cycle) {
      const rc = r.review_cycle;
      lines.push(`\n### Review Cycle\n`);
      lines.push(`- **Frequency**: ${rc.frequency}`);
      lines.push(`- **Last Review**: ${rc.last_review}`);
      lines.push(`- **Next Review**: ${rc.next_review}`);
    }

    if (r.committee) {
      const c = r.committee;
      lines.push(`\n### Committee Approval\n`);
      lines.push(`- **Committee**: ${c.committee_name}`);
      lines.push(`- **Meeting**: ${c.meeting_date} (${c.meeting_reference})`);
      if (c.attendees.length > 0) lines.push(`- **Attendees**: ${c.attendees.join(", ")}`);
    }

    if (v && v.issues.length > 0) {
      lines.push(`\n### Blocking Issues\n`);
      for (const iss of v.issues) lines.push(`- ${iss}`);
    }
    if (v && v.warnings.length > 0) {
      lines.push(`\n### Warnings\n`);
      for (const w of v.warnings) lines.push(`- ${w}`);
    }

    lines.push(`\n_Created: ${r.created_at} by ${r.created_by} | Updated: ${r.updated_at} by ${r.updated_by} (v${r.record_version})_`);
  }

  return lines.join("\n");
}
