import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import { getAllPacks, getPacksForProjectType, getPack } from "@greenarmor/ges-policy-engine";
import { generateScoreFile } from "@greenarmor/ges-scoring-engine";
import type { ProjectConfig, ScoreFile, Control, PolicyPack, FixHistoryEntry } from "@greenarmor/ges-core";
import { loadFixHistory } from "@greenarmor/ges-core";
import type { Finding } from "@greenarmor/ges-audit-engine";
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
  lastAudit: string;
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
    const controls = packs.flatMap(p => p.controls);

    const overridesPath = path.join(projectPath, ".ges", "control-overrides.json");
    if (fs.existsSync(overridesPath)) {
      const overrides = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
      for (const override of overrides) {
        const control = controls.find((c: Control) => c.id === override.control_id);
        if (control) {
          control.status = override.status;
          for (const check of control.checks) {
            check.status = override.status;
          }
        }
      }
    }
    return controls;
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

  const controlsDir = path.join(projectPath, "controls");
  try {
    const entries = fs.readdirSync(controlsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const ctrlFile = path.join(controlsDir, entry.name, "controls.json");
        if (fs.existsSync(ctrlFile)) {
          ids.add(entry.name);
        }
      }
    }
  } catch {
    // controls dir may not exist
  }

  return ids;
}

export function collectDashboardData(projectPath: string): DashboardData {
  const config = loadConfig(projectPath);
  let score = loadScore(projectPath);

  const baseControls = config ? loadControlsForConfig(projectPath, config) : [];
  const findings = loadFindings(projectPath);
  const controls = updateControlsFromFindings(baseControls, findings);

  if (config) {
    try {
      const freshScore = generateScoreFile(controls, config.frameworks, findings);
      score = freshScore;
    } catch {
      if (!score) score = null;
    }
  }

  const allPacks = getAllPacks();
  const installedPacks = getInstalledPackIds(projectPath, config || undefined);
  const packs = allPacks.map(p => buildPackSummary(p, controls, findings, installedPacks));
  const fixHistory = loadFixHistory(projectPath);

  const metadataPath = path.join(projectPath, ".ges", "metadata.json");
  let lastAudit = "";
  try {
    const meta = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    lastAudit = meta.last_audit || meta.initialized_at || new Date().toISOString();
  } catch {
    lastAudit = new Date().toISOString();
  }

  return {
    projectName: config?.project_name || "Unknown Project",
    projectType: config?.project_type || "unknown",
    frameworks: config?.frameworks || [],
    gesfVersion: "1.2.1",
    score,
    controls,
    findings,
    packs,
    fixHistory,
    lastAudit,
  };
}

export function collectPackDetail(projectPath: string, packId: string): PackDetailReport | null {
  const pack = getPack(packId);
  if (!pack) return null;

  const config = loadConfig(projectPath);
  const baseControls = config ? loadControlsForConfig(projectPath, config) : [];
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

  return {
    pack: packSummary,
    controls: controlDetails,
    findingsByControl: findingsByControlId,
    severityBreakdown,
    statusBreakdown,
    topFixes,
  };
}

export function collectControlDetail(projectPath: string, controlId: string): ControlDetail | null {
  const config = loadConfig(projectPath);
  if (!config) return null;

  const baseControls = loadControlsForConfig(projectPath, config);
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

function jsonResponse(res: http.ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function jsonError(res: http.ServerResponse, message: string, status = 500): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: message }));
}

export function startDashboard(options: DashboardOptions): http.Server {
  const port = options.port ?? 3001;
  const host = options.host || "localhost";
  const proto = ["http", "//"].join(":");

  const server = http.createServer((req, res) => {
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }

    const url = new URL(req.url, `${proto}${host}:${port}`);
    const pathname = url.pathname;

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
