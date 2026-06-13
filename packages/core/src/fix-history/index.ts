import * as fs from "node:fs";
import * as path from "node:path";
import type { FixHistoryEntry, ControlStatus, SeverityLevel, Control } from "../types/index.js";

export function loadFixHistory(projectPath: string): FixHistoryEntry[] {
  const histPath = path.join(projectPath, ".ges", "fix-history.json");
  try {
    const raw = fs.readFileSync(histPath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function appendFixHistory(projectPath: string, entries: FixHistoryEntry[]): void {
  if (entries.length === 0) return;
  const gesDir = path.join(projectPath, ".ges");
  if (!fs.existsSync(gesDir)) {
    fs.mkdirSync(gesDir, { recursive: true });
  }
  const histPath = path.join(gesDir, "fix-history.json");
  const existing = loadFixHistory(projectPath);
  const updated = existing.concat(entries);
  fs.writeFileSync(histPath, JSON.stringify(updated, null, 2), "utf-8");
}

export function clearFixHistory(projectPath: string): void {
  const histPath = path.join(projectPath, ".ges", "fix-history.json");
  try {
    fs.unlinkSync(histPath);
  } catch {
    // ignore
  }
}

let entryCounter = 0;

export interface FindingLike {
  ruleId: string;
  severity: SeverityLevel | string;
  category: string;
  title: string;
  file: string;
  line?: number;
  evidence: string;
  description: string;
  controlIds: string[];
  fix: string;
}

export interface ControlLike {
  id: string;
  name: string;
  framework: string;
  article?: string;
  status: ControlStatus | string;
}

export interface FixActionLike {
  type: "create" | "modify" | "append" | "npm-install";
  filePath: string;
  description: string;
  ruleId: string;
}

export function createFixHistoryEntry(opts: {
  source: "cli" | "mcp";
  dry_run: boolean;
  finding: FindingLike;
  action: FixActionLike;
  controls: ControlLike[];
  applied: boolean;
  error?: string;
}): FixHistoryEntry {
  entryCounter++;
  const frameworksAffected = [...new Set(opts.controls.map(c => c.framework))];
  return {
    id: `fix-${Date.now()}-${entryCounter}`,
    timestamp: new Date().toISOString(),
    source: opts.source,
    dry_run: opts.dry_run,
    finding: {
      rule_id: opts.finding.ruleId,
      severity: opts.finding.severity as SeverityLevel,
      category: opts.finding.category,
      title: opts.finding.title,
      file: opts.finding.file,
      line: opts.finding.line,
      evidence: opts.finding.evidence,
      description: opts.finding.description,
    },
    controls: opts.controls.map(c => ({
      id: c.id,
      name: c.name,
      framework: c.framework,
      article: c.article,
      status: c.status as ControlStatus,
    })),
    fix: {
      action_type: opts.action.type,
      file_path: opts.action.filePath,
      description: opts.action.description,
      guidance: opts.finding.fix,
      applied: opts.applied,
      error: opts.error,
    },
    compliance_impact: {
      frameworks_affected: frameworksAffected,
      controls_addressed: opts.controls.length,
      severity_resolved: opts.finding.severity as SeverityLevel,
    },
  };
}
