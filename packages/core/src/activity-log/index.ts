import * as fs from "node:fs";
import * as path from "node:path";
import type { ActivityLogEntry, ActivityAction, ActivityStatus } from "../types/index.js";

export function loadActivityLog(projectPath: string): ActivityLogEntry[] {
  const logPath = path.join(projectPath, ".ges", "activity-log.json");
  try {
    const raw = fs.readFileSync(logPath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function appendActivityLog(projectPath: string, entries: ActivityLogEntry[]): void {
  if (entries.length === 0) return;
  const gesDir = path.join(projectPath, ".ges");
  if (!fs.existsSync(gesDir)) {
    fs.mkdirSync(gesDir, { recursive: true });
  }
  const logPath = path.join(gesDir, "activity-log.json");
  const existing = loadActivityLog(projectPath);
  const updated = existing.concat(entries);
  fs.writeFileSync(logPath, JSON.stringify(updated, null, 2), "utf-8");
}

export function clearActivityLog(projectPath: string): void {
  const logPath = path.join(projectPath, ".ges", "activity-log.json");
  try {
    fs.unlinkSync(logPath);
  } catch {
    // ignore
  }
}

let activityCounter = 0;

export function createActivityLogEntry(opts: {
  source: "cli" | "mcp";
  action: ActivityAction;
  title: string;
  description: string;
  status?: ActivityStatus;
  details?: ActivityLogEntry["details"];
  actor_name?: string;
  actor_role?: string;
}): ActivityLogEntry {
  activityCounter++;
  return {
    id: `activity-${Date.now()}-${activityCounter}`,
    timestamp: new Date().toISOString(),
    source: opts.source,
    actor_name: opts.actor_name,
    actor_role: opts.actor_role,
    action: opts.action,
    title: opts.title,
    description: opts.description,
    status: opts.status || "success",
    details: opts.details || {},
  };
}

export function recordActivity(projectPath: string, opts: {
  source: "cli" | "mcp";
  action: ActivityAction;
  title: string;
  description: string;
  status?: ActivityStatus;
  details?: ActivityLogEntry["details"];
  actor_name?: string;
  actor_role?: string;
}): void {
  const entry = createActivityLogEntry(opts);
  try {
    appendActivityLog(projectPath, [entry]);
  } catch {
    // ignore persistence errors
  }
}
