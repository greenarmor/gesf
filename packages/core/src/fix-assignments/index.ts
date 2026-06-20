import * as fs from "node:fs";
import * as path from "node:path";
import type { FixAssignment, FixAssignmentStatus, SeverityLevel } from "../types/index.js";
import { safeWriteJson } from "../utils/index.js";

const ASSIGNMENTS_FILE = "fix-assignments.json";

function assignmentsPath(projectPath: string): string {
  return path.join(projectPath, ".ges", ASSIGNMENTS_FILE);
}

export function loadFixAssignments(projectPath: string): FixAssignment[] {
  const aPath = assignmentsPath(projectPath);
  try {
    const raw = fs.readFileSync(aPath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveFixAssignments(projectPath: string, assignments: FixAssignment[]): void {
  safeWriteJson(assignmentsPath(projectPath), assignments);
}

let assignmentCounter = 0;

export function generateAssignmentId(): string {
  assignmentCounter++;
  return `fa-${Date.now()}-${assignmentCounter}`;
}

export function findingKey(opts: {
  ruleId: string;
  file: string;
  line?: number;
}): string {
  return `${opts.ruleId}:${opts.file}:${opts.line || 0}`;
}

export interface CreateFixAssignmentInput {
  finding_key: string;
  finding_rule_id: string;
  finding_title: string;
  finding_file: string;
  finding_line?: number;
  finding_severity: SeverityLevel;
  finding_control_ids: string[];
  governance_record_id: string;
  governance_system_name: string;
  assignee: string;
  assignee_role: string;
  assigned_by: string;
  notes?: string;
}

export function createFixAssignment(opts: CreateFixAssignmentInput): FixAssignment {
  const now = new Date().toISOString();
  const id = generateAssignmentId();
  return {
    id,
    finding_key: opts.finding_key,
    finding_rule_id: opts.finding_rule_id,
    finding_title: opts.finding_title,
    finding_file: opts.finding_file,
    finding_line: opts.finding_line,
    finding_severity: opts.finding_severity,
    finding_control_ids: opts.finding_control_ids,
    governance_record_id: opts.governance_record_id,
    governance_system_name: opts.governance_system_name,
    assignee: opts.assignee,
    assignee_role: opts.assignee_role,
    assigned_at: now,
    assigned_by: opts.assigned_by,
    status: "assigned",
    notes: opts.notes || "",
    resolution: null,
    created_at: now,
    updated_at: now,
  };
}

export function addFixAssignment(projectPath: string, assignment: FixAssignment): FixAssignment {
  const assignments = loadFixAssignments(projectPath);
  const existingIdx = assignments.findIndex(a => a.finding_key === assignment.finding_key);
  if (existingIdx !== -1) {
    assignments[existingIdx] = assignment;
  } else {
    assignments.push(assignment);
  }
  saveFixAssignments(projectPath, assignments);
  return assignment;
}

export function updateFixAssignment(
  projectPath: string,
  id: string,
  updates: Partial<FixAssignment>,
): FixAssignment | null {
  const assignments = loadFixAssignments(projectPath);
  const idx = assignments.findIndex(a => a.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  assignments[idx] = {
    ...assignments[idx],
    ...updates,
    updated_at: now,
  };
  saveFixAssignments(projectPath, assignments);
  return assignments[idx];
}

export function updateFixAssignmentStatus(
  projectPath: string,
  findingKey: string,
  status: FixAssignmentStatus,
): FixAssignment | null {
  const assignments = loadFixAssignments(projectPath);
  const idx = assignments.findIndex(a => a.finding_key === findingKey);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  assignments[idx] = {
    ...assignments[idx],
    status,
    updated_at: now,
  };
  saveFixAssignments(projectPath, assignments);
  return assignments[idx];
}

export function findFixAssignment(projectPath: string, findingKey: string): FixAssignment | null {
  const assignments = loadFixAssignments(projectPath);
  return assignments.find(a => a.finding_key === findingKey) || null;
}

export function findFixAssignmentById(projectPath: string, id: string): FixAssignment | null {
  const assignments = loadFixAssignments(projectPath);
  return assignments.find(a => a.id === id) || null;
}

export function findFixAssignmentsForRecord(projectPath: string, governanceRecordId: string): FixAssignment[] {
  const assignments = loadFixAssignments(projectPath);
  return assignments.filter(a => a.governance_record_id === governanceRecordId);
}

export function resolveFixAssignment(
  projectPath: string,
  findingKey: string,
  resolution: {
    resolved_by: string;
    resolved_by_role: string;
    method: "auto-fix" | "manual" | "not-applicable";
    resolution_notes: string;
  },
): FixAssignment | null {
  const assignments = loadFixAssignments(projectPath);
  const idx = assignments.findIndex(a => a.finding_key === findingKey);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  assignments[idx] = {
    ...assignments[idx],
    status: "fixed",
    resolution: {
      resolved_at: now,
      resolved_by: resolution.resolved_by,
      resolved_by_role: resolution.resolved_by_role,
      method: resolution.method,
      resolution_notes: resolution.resolution_notes,
    },
    updated_at: now,
  };
  saveFixAssignments(projectPath, assignments);
  return assignments[idx];
}

export function deleteFixAssignment(projectPath: string, id: string): boolean {
  const assignments = loadFixAssignments(projectPath);
  const filtered = assignments.filter(a => a.id !== id);
  if (filtered.length === assignments.length) return false;
  saveFixAssignments(projectPath, filtered);
  return true;
}

export function unassignFix(projectPath: string, findingKey: string): boolean {
  const assignments = loadFixAssignments(projectPath);
  const filtered = assignments.filter(a => a.finding_key !== findingKey);
  if (filtered.length === assignments.length) return false;
  saveFixAssignments(projectPath, filtered);
  return true;
}
