import { Command } from "commander";
import * as fs from "node:fs";
import * as path from "node:path";
import { ensureGESInitialized } from "../utils/project.js";
import { input, select } from "../utils/prompts.js";
import {
  banner,
  divider,
  blank,
  success,
  error as errorOut,
  warn,
  info,
  kv,
  statusBadge,
  severityBadge,
  BOLD,
  CYAN,
  DIM,
  GREEN,
  RED,
  YELLOW,
} from "../utils/ui.js";
import {
  loadFixAssignments,
  createFixAssignment,
  addFixAssignment,
  resolveFixAssignment,
  unassignFix,
  findingKey,
  loadGovernanceRecords,
  recordActivity,
} from "@greenarmor/ges-core";
import type { Finding } from "@greenarmor/ges-audit-engine";

export const assignCommand = new Command("assign")
  .description("Assign pending fixes to governance provenance records")
  .option("--finding <key>", "Finding key (ruleId:file:line) to assign")
  .option("--record <id>", "Governance record ID or system name")
  .option("--assignee <name>", "Person assigned to fix this")
  .option("--assignee-role <role>", "Role of the assignee")
  .option("--notes <notes>", "Notes for this assignment")
  .option("--actor <name>", "Your name (for audit trail)")
  .option("--actor-role <role>", "Your role (for audit trail)")
  .option("--list", "List all fix assignments")
  .option("--resolve <key>", "Resolve a fix assignment by finding key")
  .option("--by <name>", "Who resolved the fix (for --resolve)")
  .option("--by-role <role>", "Role of resolver (for --resolve)")
  .option("--method <method>", "Resolution method: auto-fix, manual, not-applicable")
  .option("--resolution-notes <notes>", "Notes about the resolution")
  .action(async (options) => {
    const root = ensureGESInitialized();
    if (!root) return;

    if (options.list) {
      listAssignments(root);
      return;
    }

    if (options.resolve) {
      resolveAssignment(root, options.resolve, options);
      return;
    }

    await assignFinding(root, options);
  });

function loadFindingsForAssign(root: string): Finding[] {
  const auditPath = path.join(root, ".ges", "last-audit.json");
  try {
    const raw = fs.readFileSync(auditPath, "utf-8");
    const data = JSON.parse(raw);
    if (data.findings && Array.isArray(data.findings)) {
      return data.findings;
    }
  } catch {
    // no audit yet
  }
  return [];
}

function listAssignments(root: string): void {
  banner("Fix Assignments", "Pending fixes linked to governance provenance records");

  const assignments = loadFixAssignments(root);
  if (assignments.length === 0) {
    warn("No fix assignments found.", "Run `ges assign` to assign a pending fix to a governance record.");
    blank();
    return;
  }

  blank();
  for (const a of assignments) {
    const statusIcon = a.status === "fixed" || a.status === "verified" ? "●" : a.status === "in-progress" ? "◐" : "○";
    const statusColor = a.status === "fixed" || a.status === "verified" ? GREEN : a.status === "in-progress" ? CYAN : YELLOW;
    console.log(`  ${statusColor(statusIcon)} ${BOLD(a.finding_rule_id)} — ${a.finding_title}`);
    kv("Finding Key", a.finding_key);
    kv("Location", `${a.finding_file}${a.finding_line ? ":" + a.finding_line : ""}`);
    kv("Governance Record", a.governance_system_name);
    kv("Assignee", `${a.assignee}${a.assignee_role ? " (" + a.assignee_role + ")" : ""}`);
    kv("Status", a.status);
    kv("Assigned By", a.assigned_by);
    kv("Assigned At", new Date(a.assigned_at).toLocaleString());
    if (a.resolution) {
      kv("Resolved By", `${a.resolution.resolved_by}${a.resolution.resolved_by_role ? " (" + a.resolution.resolved_by_role + ")" : ""}`);
      kv("Method", a.resolution.method);
      kv("Resolved At", new Date(a.resolution.resolved_at).toLocaleString());
      if (a.resolution.resolution_notes) kv("Resolution Notes", a.resolution.resolution_notes);
    }
    if (a.notes) kv("Notes", a.notes);
    blank();
  }

  divider();
  info("Total assignments", String(assignments.length));
  blank();
}

async function assignFinding(root: string, options: any): Promise<void> {
  banner("Assign Fix to Governance Record", "Link a pending fix to a provenance chain");

  const findings = loadFindingsForAssign(root);
  if (findings.length === 0) {
    errorOut("No findings found.", "Run `ges audit` first to generate findings.");
    blank();
    return;
  }

  const records = loadGovernanceRecords(root);
  if (records.length === 0) {
    errorOut("No governance records found.", "Create one first with `ges governance add`.");
    blank();
    return;
  }

  const assignments = loadFixAssignments(root);
  const assignedKeys = new Set(assignments.map(a => a.finding_key));

  let selectedFinding: Finding | undefined;

  if (options.finding) {
    selectedFinding = findings.find(f => findingKey({ ruleId: f.ruleId, file: f.file, line: f.line }) === options.finding);
    if (!selectedFinding) {
      errorOut("Finding not found", `No finding with key: ${options.finding}`);
      blank();
      return;
    }
  } else {
    const choices = findings.map(f => {
      const fkey = findingKey({ ruleId: f.ruleId, file: f.file, line: f.line });
      const isAssigned = assignedKeys.has(fkey);
      return {
        name: `${f.severity.toUpperCase()} ${f.ruleId} — ${f.title} (${f.file}${f.line ? ":" + f.line : ""})${isAssigned ? " [ASSIGNED]" : ""}`,
        value: fkey,
        disabled: isAssigned,
      };
    });
    const fkey = await select<string>({ message: "Select a finding to assign:", choices });
    selectedFinding = findings.find(f => findingKey({ ruleId: f.ruleId, file: f.file, line: f.line }) === fkey);
  }

  if (!selectedFinding) {
    errorOut("No finding selected.");
    return;
  }

  const fkey = findingKey({ ruleId: selectedFinding.ruleId, file: selectedFinding.file, line: selectedFinding.line });

  if (assignedKeys.has(fkey)) {
    warn("This finding is already assigned.", "Use `ges assign --list` to see current assignments.");
    blank();
    return;
  }

  let recordId = options.record;
  let selectedRecord = recordId
    ? records.find(r => r.id === recordId || r.system_name.toLowerCase() === recordId.toLowerCase())
    : undefined;

  if (!selectedRecord) {
    if (recordId) {
      errorOut("Governance record not found", recordId);
      return;
    }
    const recordChoices = records.map(r => ({
      name: `${r.system_name} (${r.status}, ${r.risk_level} risk)`,
      value: r.id,
    }));
    recordId = await select<string>({ message: "Select governance record:", choices: recordChoices });
    selectedRecord = records.find(r => r.id === recordId);
  }

  if (!selectedRecord) {
    errorOut("Governance record not found.");
    return;
  }

  const assignee = options.assignee || await input({ message: "Assignee name (who will fix this):" });
  if (!assignee.trim()) {
    errorOut("Assignee name is required.", "Please provide the name of the person responsible for this fix.");
    return;
  }

  const assigneeRole = options.assigneeRole || await input({ message: "Assignee role (optional, e.g., 'Security Engineer'):", default: "" });
  const notes = options.notes || await input({ message: "Notes (optional, e.g., 'Urgent — fix before release'):", default: "" });
  const actorName = options.actor || await input({ message: "Your name (for audit trail):", default: "cli-user" });
  const actorRole = options.actorRole || await input({ message: "Your role (optional):", default: "" });

  const assignment = createFixAssignment({
    finding_key: fkey,
    finding_rule_id: selectedFinding.ruleId,
    finding_title: selectedFinding.title,
    finding_file: selectedFinding.file,
    finding_line: selectedFinding.line,
    finding_severity: selectedFinding.severity as any,
    finding_control_ids: selectedFinding.controlIds,
    governance_record_id: selectedRecord.id,
    governance_system_name: selectedRecord.system_name,
    assignee: assignee.trim(),
    assignee_role: assigneeRole.trim(),
    assigned_by: actorName.trim() || "cli",
    notes: notes.trim(),
  });

  addFixAssignment(root, assignment);

  recordActivity(root, {
    source: "cli",
    action: "fix_assign",
    title: `Fix assigned: ${selectedFinding.ruleId} → ${selectedRecord.system_name}`,
    description: `Assigned ${selectedFinding.ruleId} (${selectedFinding.title}) to ${assignee} (${assigneeRole || "unspecified role"}), linked to governance record ${selectedRecord.system_name}.`,
    details: {
      finding_key: fkey,
      governance_record_id: selectedRecord.id,
      assignee,
      governance_system_name: selectedRecord.system_name,
    },
    actor_name: actorName.trim() || undefined,
    actor_role: actorRole.trim() || undefined,
  });

  blank();
  success("Fix assigned to governance record");
  kv("Finding", `${selectedFinding.ruleId} — ${selectedFinding.title}`);
  kv("Location", `${selectedFinding.file}${selectedFinding.line ? ":" + selectedFinding.line : ""}`);
  kv("Governance Record", selectedRecord.system_name);
  kv("Assignee", `${assignee}${assigneeRole ? " (" + assigneeRole + ")" : ""}`);
  kv("Finding Key", fkey);
  blank();
  info("Provenance chain", `Fix → ${selectedRecord.system_name} → ${selectedRecord.approval ? selectedRecord.approval.approver_name + " (approved)" : "no approval yet"}`);
  blank();
}

function resolveAssignment(root: string, fkey: string, options: any): void {
  const existing = loadFixAssignments(root).find(a => a.finding_key === fkey);
  if (!existing) {
    errorOut("Fix assignment not found", `No assignment for finding key: ${fkey}`);
    blank();
    return;
  }

  const resolver = options.by || "cli";
  const resolverRole = options.byRole || "";
  const method = options.method || "manual";
  const notes = options.resolutionNotes || "";

  const resolved = resolveFixAssignment(root, fkey, {
    resolved_by: resolver,
    resolved_by_role: resolverRole,
    method: method as "auto-fix" | "manual" | "not-applicable",
    resolution_notes: notes,
  });

  if (!resolved) {
    errorOut("Failed to resolve assignment.");
    return;
  }

  recordActivity(root, {
    source: "cli",
    action: "fix_resolve",
    title: `Fix resolved: ${resolved.finding_rule_id}`,
    description: `Resolved ${resolved.finding_rule_id} via ${method} by ${resolver}.`,
    details: {
      finding_key: fkey,
      governance_record_id: resolved.governance_record_id,
      method,
    },
    actor_name: resolver,
    actor_role: resolverRole || undefined,
  });

  blank();
  success("Fix assignment resolved");
  kv("Finding", `${resolved.finding_rule_id} — ${resolved.finding_title}`);
  kv("Governance Record", resolved.governance_system_name);
  kv("Resolved By", `${resolver}${resolverRole ? " (" + resolverRole + ")" : ""}`);
  kv("Method", method);
  blank();
}
