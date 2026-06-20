import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { input, select } from "../utils/prompts.js";
import {
  banner,
  divider,
  blank,
  success,
  error,
  warn,
  info,
  kv,
  label,
  item,
  statusBadge,
  severityBadge,
  BOLD,
  CYAN,
  DIM,
  GREEN,
  RED,
  YELLOW,
  GRAY,
} from "../utils/ui.js";
import {
  loadGovernanceRecords,
  createGovernanceRecord,
  addGovernanceRecord,
  findGovernanceRecord,
  setGovernanceApproval,
  addGovernanceEvidence,
  createEvidenceRef,
  verifyGovernanceRecord,
  deleteGovernanceRecord,
  setGovernanceRiskAssessment,
  setGovernancePolicyBasis,
  setGovernanceReviewCycle,
  setGovernanceDataInventory,
  setGovernanceComplianceLinks,
  setGovernanceCommittee,
} from "@greenarmor/ges-core";
import { recordActivity } from "@greenarmor/ges-core";
import type {
  GovernanceRecord,
  GovernanceSystemType,
  GovernanceRiskLevel,
  EvidenceType,
  EvidenceSourceSystem,
} from "@greenarmor/ges-core";

const STATUS_BADGE: Record<string, string> = {
  draft: "○",
  "pending-review": "◐",
  approved: "●",
  rejected: "✕",
  conditional: "◔",
  expired: "⚠",
  revoked: "✕",
};

const RISK_COLOR: Record<string, string> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
  critical: "CRITICAL",
};

function printRecordSummary(record: GovernanceRecord): void {
  console.log(`  ${statusBadge(record.status)} ${BOLD(record.system_name)}`);
  console.log(`     ${DIM("ID")}     ${record.id}`);
  console.log(`     ${DIM("Type")}   ${record.system_type}  ${GRAY("|")}  ${DIM("Risk")} ${severityBadge(record.risk_level)}`);
  if (record.approval) {
    console.log(`     ${DIM("By")}     ${record.approval.approver_name} (${record.approval.approver_role})`);
    console.log(`     ${DIM("Valid")} ${record.approval.valid_from} ${GRAY("→")} ${record.approval.valid_until || "indefinite"}`);
  } else {
    console.log(`     ${DIM("By")}     ${GRAY("NOT RECORDED")}`);
  }
  console.log(`     ${DIM("Ev")}     ${record.evidence.length} reference(s)`);
}

async function showGovernanceNextAction(
  root: string,
  records: GovernanceRecord[],
  lastShownId?: string,
): Promise<void> {
  if (process.stdin.isTTY !== true || process.stdout.isTTY !== true) return;

  const choices: { name: string; value: string }[] = [];

  if (lastShownId) {
    choices.push({ name: `Verify this record ${DIM("— check provenance completeness")}`, value: `ges governance verify ${lastShownId}` });
    if (records.length > 1) {
      choices.push({ name: `Show another record ${DIM("— pick from list")}`, value: `__pick_show__` });
    }
    choices.push({ name: `Record an approval ${DIM("— add approval decision")}`, value: `ges governance approve ${lastShownId}` });
    choices.push({ name: `Add evidence reference ${DIM("— link to Jira/Confluence/etc")}`, value: `ges governance evidence ${lastShownId}` });
    choices.push({ name: `Link risk assessment ${DIM("— assessor, methodology, score")}`, value: `ges governance risk-assessment ${lastShownId}` });
    choices.push({ name: `Document policy basis ${DIM("— which policy applies")}`, value: `ges governance policy-basis ${lastShownId}` });
  } else if (records.length > 0) {
    choices.push({ name: `Show a record's full provenance chain ${DIM("— all dimensions in detail")}`, value: `__pick_show__` });
    choices.push({ name: `Verify a record's completeness ${DIM("— check all 8 dimensions")}`, value: `__pick_verify__` });
  }

  choices.push({ name: `Create a new governance record ${DIM("— start a new approval chain")}`, value: `ges governance add` });

  if (records.length === 0) {
    choices.length = 0;
    choices.push({ name: `Create a new governance record ${DIM("— start a new approval chain")}`, value: `ges governance add` });
  }

  choices.push({ name: `${YELLOW("Exit")} ${DIM("— return to terminal")}`, value: `exit` });

  divider();
  label("What would you like to do next?");

  const answer = await select({
    message: "Choose your next action:",
    choices,
  });

  if (answer === "exit") {
    blank();
    return;
  }

  let cmd = answer;

  if (answer === "__pick_show__" || answer === "__pick_verify__") {
    let recordChoice: string;
    if (records.length === 1) {
      recordChoice = records[0].id;
    } else {
      recordChoice = await select({
        message: "Select a record:",
        choices: records.map(r => ({
          name: `${r.system_name} ${GRAY(`(${r.status}, ${r.risk_level})`)}`,
          value: r.id,
        })),
      });
    }
    const sub = answer === "__pick_show__" ? "show" : "verify";
    cmd = `ges governance ${sub} ${recordChoice}`;
  }

  blank();
  info("Running", GREEN(cmd));
  divider();
  blank();

  const { execSync } = await import("node:child_process");
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch {
    process.exit(1);
  }
}

export const governanceCommand = new Command("governance")
  .description("Manage governance approval provenance chains")
  .action(async () => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      governanceCommand.outputHelp();
      return;
    }

    banner("GESF Governance", "Provenance Chain Management");

    let root: string;
    try {
      root = ensureGESInitialized();
    } catch {
      error("GESF is not initialized.", "Run `ges init` first.");
      blank();
      return;
    }

    const records = loadGovernanceRecords(root);
    if (records.length > 0) {
      console.log(`  ${BOLD("Existing Records")} ${GRAY(`(${records.length})`)}`);
      records.forEach(r => printRecordSummary(r));
      console.log("");
    } else {
      warn("No governance records yet.", "Create one to start building a provenance chain.");
      blank();
    }

    const action = await select({
      message: "What would you like to do?",
      choices: [
        { name: `Create a new governance record ${DIM("— start a new approval chain")}`, value: "add" },
        ...(records.length > 0 ? [
          { name: `List all records ${DIM(`(${records.length} existing)`)}`, value: "list" },
          { name: `Show a record's full provenance chain ${DIM("— all dimensions in detail")}`, value: "show" },
          { name: `Verify a record's completeness ${DIM("— check all 8 dimensions")}`, value: "verify" },
          { name: `Record an approval decision ${DIM("— who approved, under what authority")}`, value: "approve" },
          { name: `Add an evidence reference ${DIM("— link to Jira, Confluence, etc.")}`, value: "evidence" },
          { name: `Link a risk assessment ${DIM("— assessor, methodology, score")}`, value: "risk-assessment" },
          { name: `Document the policy basis ${DIM("— which policy/standard applies")}`, value: "policy-basis" },
          { name: `Set up a review cycle ${DIM("— when to re-review")}`, value: "review-cycle" },
          { name: `Document data inventory ${DIM("— what personal data is processed")}`, value: "data-inventory" },
          { name: `Record committee approval ${DIM("— formal committee sign-off")}`, value: "committee" },
          { name: `Map compliance frameworks ${DIM("— GDPR, OWASP, etc.")}`, value: "compliance-links" },
          { name: `Delete a record ${DIM("— permanently remove")}`, value: "delete" },
        ] : []),
        { name: `${YELLOW("Exit")} ${DIM("— return to terminal")}`, value: "exit" },
      ],
    });

    if (action === "exit") {
      blank();
      return;
    }

    let cmd = `ges governance ${action}`;

    if (["show", "verify", "approve", "evidence", "risk-assessment", "policy-basis", "review-cycle", "data-inventory", "committee", "compliance-links", "delete"].includes(action)) {
      if (records.length === 0) {
        error("No records to work with.", "Create one first with: ges governance add");
        blank();
        return;
      }

      if (records.length === 1) {
        cmd += ` ${records[0].id}`;
      } else {
        const recordChoice = await select({
          message: "Select a record:",
          choices: [
            ...records.map(r => ({
              name: `${r.system_name} ${GRAY(`(${r.status}, ${r.risk_level})`)}`,
              value: r.id,
            })),
          ],
        });
        cmd += ` ${recordChoice}`;
      }
    }

    blank();
    info("Running", GREEN(cmd));
    divider();
    blank();

    const { execSync } = await import("node:child_process");
    try {
      execSync(cmd, { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  })
  .addCommand(
    new Command("add")
      .description("Create a new governance record")
      .option("-n, --name <name>", "System name")
      .option("--type <type>", "System type")
      .option("--risk <level>", "Risk level (low/medium/high/critical)")
      .option("--desc <description>", "System description")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (options) => {
        const name = options.name || await input({ message: "System name:", default: "" });
        if (!name) {
          console.error("  Error: System name is required.");
          process.exit(1);
        }

        const systemType = (options.type || await select({
          message: "System type:",
          choices: [
            { name: "AI System", value: "ai-system" },
            { name: "Application", value: "application" },
            { name: "Data Process", value: "data-process" },
            { name: "API", value: "api" },
            { name: "Model", value: "model" },
            { name: "Infrastructure", value: "infrastructure" },
            { name: "Third-Party Service", value: "third-party-service" },
          ],
        })) as GovernanceSystemType;

        const riskLevel = (options.risk || await select({
          message: "Risk level:",
          choices: [
            { name: "Low", value: "low" },
            { name: "Medium", value: "medium" },
            { name: "High", value: "high" },
            { name: "Critical", value: "critical" },
          ],
        })) as GovernanceRiskLevel;

        const description = options.desc || await input({ message: "System description:", default: "" });

        const root = ensureGESInitialized();
        const record = createGovernanceRecord({
          system_name: name,
          system_description: description,
          system_type: systemType,
          risk_level: riskLevel,
          created_by: "cli-user",
        });
        addGovernanceRecord(root, record);

        blank();
        success("Governance record created");
        kv("ID", record.id, 6);
        console.log();
        printRecordSummary(record);
        console.log(`\n  ${DIM("Next steps:")}`);
        console.log(`    ${GRAY("–")} ${GREEN("ges governance approve")} ${record.id}     ${DIM("Record approval decision")}`);
        console.log(`    ${GRAY("–")} ${GREEN("ges governance evidence")} ${record.id}    ${DIM("Add evidence reference")}`);
        console.log(`    ${GRAY("–")} ${GREEN("ges governance verify")} ${record.id}      ${DIM("Verify provenance chain")}\n`);

        recordActivity(root, {
          source: "cli",
          action: "control_override",
          title: `Governance record created: ${name}`,
          description: `Created governance record for ${name} (${systemType}, risk: ${riskLevel}). Record ID: ${record.id}`,
          details: { governance_record_id: record.id, system_type: systemType, risk_level: riskLevel },
          actor_name: options.actor,
          actor_role: options.actorRole,
        });
      }),
  )
  .addCommand(
    new Command("approve")
      .description("Record an approval decision for a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--approver <name>", "Approver name")
      .option("--role <role>", "Approver role")
      .option("--email <email>", "Approver email")
      .option("--authority <authority>", "Approval authority")
      .option("--decision <decision>", "Decision: approved, rejected, conditional")
      .option("--valid-from <date>", "Validity start date (YYYY-MM-DD)")
      .option("--valid-until <date>", "Validity end date (ISO 8601)")
      .option("--conditions <conditions>", "Conditions (comma-separated)")
      .option("--rationale <text>", "Rationale for the decision")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) {
          console.error(`  Error: Governance record "${id}" not found.`);
          process.exit(1);
        }

        const approverName = options.approver || await input({ message: "Approver full name:", default: "" });
        const approverRole = options.role || await input({ message: "Approver role/title (e.g., 'CISO', 'CTO'):", default: "" });
        const approverEmail = options.email || await input({ message: "Approver email (optional):", default: "" });
        const authority = options.authority || await input({ message: "Approval authority (e.g., 'AI Ethics Board', 'Security Committee'):", default: "" });
        const decision = (options.decision || await select({
          message: "Decision:",
          choices: [
            { name: "Approved", value: "approved" },
            { name: "Conditional", value: "conditional" },
            { name: "Rejected", value: "rejected" },
          ],
        })) as "approved" | "rejected" | "conditional";

        const validFrom = options.validFrom || new Date().toISOString().split("T")[0];
        const validUntil = options.validUntil || await input({ message: "Valid until YYYY-MM-DD (or press Enter for indefinite):", default: "" });
        const conditionsStr = options.conditions || await input({ message: "Conditions (comma-separated, or press Enter to skip):", default: "" });
        const rationale = options.rationale || await input({ message: "Rationale (why was this decision made?):", default: "" });

        const updated = setGovernanceApproval(root, record.id, {
          approver_name: approverName,
          approver_role: approverRole,
          approver_email: approverEmail,
          approval_authority: authority,
          decision,
          decision_date: new Date().toISOString(),
          valid_from: validFrom,
          valid_until: validUntil || null,
          conditions: conditionsStr ? conditionsStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          rationale,
        }, "cli-user");

        if (!updated) {
          console.error(`  Error: Failed to update record.`);
          process.exit(1);
        }

        blank();
        success("Approval recorded", `for ${updated.system_name}`);
        kv("Decision", decision.toUpperCase(), 6);
        kv("Approver", `${approverName} (${approverRole})`, 6);
        kv("Valid", `${validFrom} → ${validUntil || "indefinite"}`, 6);
        console.log();

        recordActivity(root, {
          source: "cli",
          action: "control_override",
          title: `Governance approval: ${updated.system_name} → ${decision}`,
          description: `${approverName} (${approverRole}) marked ${updated.system_name} as ${decision}. Valid until: ${validUntil || "indefinite"}.`,
          details: { governance_record_id: updated.id, decision },
          actor_name: options.actor,
          actor_role: options.actorRole,
        });
      }),
  )
  .addCommand(
    new Command("evidence")
      .description("Add an evidence reference to a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--title <title>", "Evidence title")
      .option("--source <system>", "Source system (jira, confluence, servicenow, etc.)")
      .option("--reference <ref>", "Reference (ticket ID, URL, document name)")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) {
          console.error(`  Error: Governance record "${id}" not found.`);
          process.exit(1);
        }

        const title = options.title || await input({ message: "Evidence title (e.g., 'DPIA Report Q4 2026'):", default: "" });
        const sourceSystem = (options.source || await select({
          message: "Source system:",
          choices: [
            { name: "Jira", value: "jira" },
            { name: "Confluence", value: "confluence" },
            { name: "ServiceNow", value: "servicenow" },
            { name: "SharePoint", value: "sharepoint" },
            { name: "GRC Platform", value: "grc-platform" },
            { name: "Git", value: "git" },
            { name: "File", value: "file" },
            { name: "URL", value: "url" },
            { name: "Email", value: "email" },
            { name: "Other", value: "other" },
          ],
        })) as EvidenceSourceSystem;

        const reference = options.reference || await input({ message: "Reference (ticket ID, URL, or document path):", default: "" });
        const evidenceType = await select({
          message: "Evidence type:",
          choices: [
            { name: "Document", value: "document" },
            { name: "Ticket", value: "ticket" },
            { name: "Meeting Record", value: "meeting-record" },
            { name: "Report", value: "report" },
            { name: "Certificate", value: "certificate" },
            { name: "Contract", value: "contract" },
            { name: "Log", value: "log" },
            { name: "Dashboard", value: "dashboard" },
            { name: "Email", value: "email" },
            { name: "Other", value: "other" },
          ],
        }) as EvidenceType;
        const locationDesc = await input({ message: "Location description (where to find it, optional):", default: "" });

        const evidence = createEvidenceRef({
          type: evidenceType,
          title,
          source_system: sourceSystem,
          reference,
          location_description: locationDesc,
          added_by: "cli-user",
        });

        const updated = addGovernanceEvidence(root, record.id, evidence, "cli-user");
        if (!updated) {
          console.error(`  Error: Failed to add evidence.`);
          process.exit(1);
        }

        blank();
        success("Evidence added", `to ${updated.system_name}`);
        console.log(`      ${BOLD(evidence.title)}`);
        kv("Source", evidence.source_system, 6);
        kv("Ref", evidence.reference, 6);
        kv("Total", `${updated.evidence.length} reference(s)`, 6);
        console.log();

        recordActivity(root, {
          source: "cli",
          action: "control_override",
          title: `Evidence added: ${evidence.title}`,
          description: `Added evidence reference "${evidence.title}" (${evidence.source_system}: ${evidence.reference}) to governance record ${updated.system_name}.`,
          details: { governance_record_id: updated.id, evidence_id: evidence.id, source: evidence.source_system },
          actor_name: options.actor,
          actor_role: options.actorRole,
        });
      }),
  )
  .addCommand(
    new Command("list")
      .description("List all governance records")
      .action(async () => {
        const root = ensureGESInitialized();
        const records = loadGovernanceRecords(root);
        if (records.length === 0) {
          info("No governance records found.");
          console.log(`  ${DIM("Create one with:")} ${GREEN("ges governance add")}\n`);
          await showGovernanceNextAction(root, records);
          return;
        }
        blank();
        console.log(`  ${BOLD("Governance Records")} ${GRAY(`(${records.length})`)}`);
        console.log();
        records.forEach(r => {
          printRecordSummary(r);
          console.log();
        });
        await showGovernanceNextAction(root, records);
      }),
  )
  .addCommand(
    new Command("show")
      .description("Show full provenance chain for a governance record")
      .argument("<id>", "Record ID or system name")
      .action(async (id: string) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) {
          console.error(`  Error: Governance record "${id}" not found.`);
          process.exit(1);
        }

        console.log(`\n  ═══════════════════════════════════════════════════`);
        console.log(`  GOVERNANCE RECORD: ${record.system_name}`);
        console.log(`  ═══════════════════════════════════════════════════\n`);

        console.log(`  SYSTEM IDENTITY`);
        console.log(`    ID:          ${record.id}`);
        console.log(`    Name:        ${record.system_name}`);
        console.log(`    Description: ${record.system_description || "(none)"}`);
        console.log(`    Type:        ${record.system_type}`);
        console.log(`    Version:     ${record.system_version || "(none)"}`);
        console.log(`    Status:      ${record.status}`);
        console.log(`    Risk Level:  ${record.risk_level}\n`);

        console.log(`  RISK ASSESSMENT`);
        if (record.risk_assessment) {
          const ra = record.risk_assessment;
          console.log(`    Assessor:      ${ra.assessor}`);
          console.log(`    Date:          ${ra.assessment_date}`);
          console.log(`    Methodology:   ${ra.methodology}`);
          console.log(`    Risk Score:    ${ra.risk_score}`);
          console.log(`    Residual Risk: ${ra.residual_risk}`);
          if (ra.identified_risks.length) console.log(`    Identified:    ${ra.identified_risks.join(", ")}`);
          if (ra.mitigation_measures.length) console.log(`    Mitigations:   ${ra.mitigation_measures.join(", ")}`);
        } else {
          console.log(`    ⚠ NOT RECORDED`);
        }
        console.log("");

        console.log(`  POLICY BASIS`);
        if (record.policy_basis) {
          const pb = record.policy_basis;
          console.log(`    Policy ID:   ${pb.policy_id}`);
          console.log(`    Name:        ${pb.policy_name}`);
          console.log(`    Version:     ${pb.version}`);
          console.log(`    Standard:    ${pb.standard}`);
          if (pb.clauses.length) console.log(`    Clauses:     ${pb.clauses.join(", ")}`);
        } else {
          console.log(`    ⚠ NOT RECORDED`);
        }
        console.log("");

        console.log(`  APPROVAL DECISION`);
        if (record.approval) {
          const a = record.approval;
          console.log(`    Approver:    ${a.approver_name} (${a.approver_role})`);
          console.log(`    Email:       ${a.approver_email || "(none)"}`);
          console.log(`    Authority:   ${a.approval_authority}`);
          console.log(`    Decision:    ${a.decision.toUpperCase()}`);
          console.log(`    Date:        ${a.decision_date}`);
          console.log(`    Valid From:  ${a.valid_from}`);
          console.log(`    Valid Until: ${a.valid_until || "indefinite"}`);
          if (a.conditions.length) console.log(`    Conditions:  ${a.conditions.join("; ")}`);
          if (a.rationale) console.log(`    Rationale:   ${a.rationale}`);
        } else {
          console.log(`    ⚠ NOT RECORDED`);
        }
        console.log("");

        console.log(`  COMMITTEE APPROVAL`);
        if (record.committee) {
          const c = record.committee;
          console.log(`    Committee:   ${c.committee_name}`);
          console.log(`    Meeting:     ${c.meeting_date} (${c.meeting_reference})`);
          if (c.attendees.length) console.log(`    Attendees:   ${c.attendees.join(", ")}`);
          console.log(`    Summary:     ${c.decision_summary}`);
        } else {
          console.log(`    (not required or not recorded)`);
        }
        console.log("");

        console.log(`  EVIDENCE CHAIN (${record.evidence.length})`);
        if (record.evidence.length === 0) {
          console.log(`    ⚠ NO EVIDENCE REFERENCES`);
        } else {
          record.evidence.forEach((e, i) => {
            console.log(`    [${i + 1}] ${e.title}`);
            console.log(`        Type: ${e.type}  |  Source: ${e.source_system}`);
            console.log(`        Ref:  ${e.reference}`);
            console.log(`        Loc:  ${e.location_description}`);
          });
        }
        console.log("");

        console.log(`  REVIEW CYCLE`);
        if (record.review_cycle) {
          const rc = record.review_cycle;
          console.log(`    Frequency:    ${rc.frequency}`);
          console.log(`    Last Review:  ${rc.last_review}`);
          console.log(`    Next Review:  ${rc.next_review}`);
          if (rc.review_history.length) {
            console.log(`    History:`);
            rc.review_history.forEach(h => {
              console.log(`      ${h.date} — ${h.outcome} (${h.reviewer}): ${h.notes}`);
            });
          }
        } else {
          console.log(`    ⚠ NOT DEFINED — continuous compliance not monitored`);
        }
        console.log("");

        console.log(`  DATA INVENTORY`);
        if (record.data_inventory) {
          const di = record.data_inventory;
          if (di.personal_data_categories.length) console.log(`    Data Categories: ${di.personal_data_categories.join(", ")}`);
          if (di.processing_purposes.length) console.log(`    Purposes:        ${di.processing_purposes.join(", ")}`);
          if (di.data_subjects.length) console.log(`    Data Subjects:   ${di.data_subjects.join(", ")}`);
          if (di.cross_border_transfers.length) console.log(`    Transfers:       ${di.cross_border_transfers.join(", ")}`);
          console.log(`    Retention:       ${di.retention_period}`);
        } else {
          console.log(`    (not documented)`);
        }
        console.log("");

        console.log(`  COMPLIANCE LINKS`);
        if (record.compliance) {
          const cl = record.compliance;
          if (cl.frameworks.length) console.log(`    Frameworks:      ${cl.frameworks.join(", ")}`);
          if (cl.controls_satisfied.length) console.log(`    Controls:        ${cl.controls_satisfied.join(", ")}`);
          if (cl.control_pack_ids.length) console.log(`    Control Packs:   ${cl.control_pack_ids.join(", ")}`);
        } else {
          console.log(`    (not mapped)`);
        }
        console.log(`\n  Created: ${record.created_at} by ${record.created_by}`);
        console.log(`  Updated: ${record.updated_at} by ${record.updated_by} (v${record.record_version})\n`);
        await showGovernanceNextAction(root, [record], record.id);
      }),
  )
  .addCommand(
    new Command("verify")
      .description("Verify the provenance chain completeness of a governance record")
      .argument("<id>", "Record ID or system name")
      .action(async (id: string) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) {
          console.error(`  Error: Governance record "${id}" not found.`);
          process.exit(1);
        }

        const result = verifyGovernanceRecord(record);
        banner("VERIFICATION", record.system_name);

        const overallText = result.valid ? GREEN(BOLD("✓ VALID")) : RED(BOLD("✕ ISSUES FOUND"));
        console.log(`  ${DIM("Overall:")}         ${overallText}`);
        console.log(`  ${DIM("Approval:")}       ${statusBadge(result.approval_status)}`);
        if (result.days_until_expiry !== null) {
          const dayLabel = result.days_until_expiry < 0
            ? RED(`${Math.abs(result.days_until_expiry)} days AGO`)
            : result.days_until_expiry <= 30
              ? YELLOW(`${result.days_until_expiry} days remaining`)
              : GREEN(`${result.days_until_expiry} days remaining`);
          console.log(`  ${DIM("Expiry:")}          ${dayLabel}`);
        }
        console.log(`  ${DIM("Evidence:")}       ${result.completeness.evidence_count} reference(s)`);

        console.log(`\n  ${BOLD("Completeness Checklist")}`);
        divider(40);
        const check = (ok: boolean, label: string, isWarning = false): void => {
          const icon = ok ? GREEN("✓") : isWarning ? YELLOW("△") : RED("✕");
          const text = ok ? label : isWarning ? YELLOW(label) : RED(label);
          console.log(`    ${icon} ${text}`);
        };
        check(result.completeness.has_approval, "Approval Decision");
        check(result.completeness.has_risk_assessment, "Risk Assessment");
        check(result.completeness.has_policy_basis, "Policy Basis");
        check(result.completeness.has_evidence, "Evidence Chain");
        check(result.completeness.has_review_cycle, "Review Cycle", true);
        check(result.completeness.has_data_inventory, "Data Inventory", true);
        check(result.completeness.has_compliance_links, "Compliance Links", true);
        check(result.completeness.is_current, "Currently Valid");

        if (result.issues.length > 0) {
          console.log(`\n  ${RED(BOLD("BLOCKING ISSUES"))}`);
          result.issues.forEach(i => console.log(`    ${RED("✕")} ${i}`));
        }
        if (result.warnings.length > 0) {
          console.log(`\n  ${YELLOW(BOLD("WARNINGS"))}`);
          result.warnings.forEach(w => console.log(`    ${YELLOW("△")} ${w}`));
        }
        console.log();
        await showGovernanceNextAction(root, [record], record.id);
      }),
  )
  .addCommand(
    new Command("delete")
      .description("Delete a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action((id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) {
          console.error(`  Error: Governance record "${id}" not found.`);
          process.exit(1);
        }
        const deleted = deleteGovernanceRecord(root, record.id);
        if (deleted) {
          blank();
          success("Deleted governance record", `${record.system_name} (${record.id})`);
          console.log();
          recordActivity(root, {
            source: "cli",
            action: "control_override",
            title: `Governance record deleted: ${record.system_name}`,
            description: `Deleted governance record ${record.system_name} (${record.id}).`,
            details: { governance_record_id: record.id },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
        } else {
          console.error(`  Error: Failed to delete record.`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command("risk-assessment")
      .description("Link a risk assessment to a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--assessor <name>", "Risk assessor name")
      .option("--methodology <text>", "Assessment methodology")
      .option("--score <score>", "Risk score (e.g., 7.5/10)")
      .option("--residual <level>", "Residual risk level")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) { console.error(`  Error: Governance record "${id}" not found.`); process.exit(1); }

        const assessor = options.assessor || await input({ message: "Risk assessor name:", default: "" });
        const methodology = options.methodology || await input({ message: "Methodology (e.g., 'NIST RMF', 'ISO 27005'):", default: "" });
        const score = options.score || await input({ message: "Risk score (e.g., '7.5/10', 'High'):", default: "" });
        const residual = options.residual || await input({ message: "Residual risk level (low/medium/high):", default: "" });
        const risksStr = await input({ message: "Identified risks (comma-separated, or Enter to skip):", default: "" });
        const mitigationsStr = await input({ message: "Mitigation measures (comma-separated, or Enter to skip):", default: "" });

        const updated = setGovernanceRiskAssessment(root, record.id, {
          id: `risk-${Date.now()}`,
          assessor,
          assessment_date: new Date().toISOString(),
          methodology,
          risk_score: score,
          identified_risks: risksStr ? risksStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          residual_risk: residual,
          mitigation_measures: mitigationsStr ? mitigationsStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          evidence: [],
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        blank();
        success("Risk assessment linked", `to ${updated.system_name}`);
        kv("Assessor", assessor, 6);
        kv("Score", score, 6);
        kv("Residual", residual, 6);
        console.log();
        recordActivity(root, { source: "cli", action: "control_override", title: `Risk assessment added: ${updated.system_name}`, description: `Risk assessment by ${assessor} linked to ${updated.system_name}. Score: ${score}, Residual: ${residual}.`, details: { governance_record_id: updated.id }, actor_name: options.actor, actor_role: options.actorRole });
      }),
  )
  .addCommand(
    new Command("policy-basis")
      .description("Document the policy basis for a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--policy-id <id>", "Policy ID")
      .option("--policy-name <name>", "Policy name")
      .option("--pv <version>", "Policy version")
      .option("--standard <std>", "Standard (e.g., GDPR, ISO 27001)")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) { console.error(`  Error: Governance record "${id}" not found.`); process.exit(1); }

        const policyId = options.policyId || await input({ message: "Policy ID (e.g., 'POL-SEC-001'):", default: "" });
        const policyName = options.policyName || await input({ message: "Policy name (e.g., 'Information Security Policy'):", default: "" });
        const version = options.pv || await input({ message: "Policy version:", default: "1.0" });
        const standard = options.standard || await input({ message: "Standard (e.g., 'GDPR', 'ISO 27001'):", default: "" });
        const clausesStr = await input({ message: "Applicable clauses (comma-separated, or Enter to skip):", default: "" });

        const updated = setGovernancePolicyBasis(root, record.id, {
          policy_id: policyId,
          policy_name: policyName,
          version,
          clauses: clausesStr ? clausesStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          standard,
          evidence: [],
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        blank();
        success("Policy basis documented", `for ${updated.system_name}`);
        kv("Policy", `${policyName} (${policyId} v${version})`, 6);
        kv("Standard", standard, 6);
        console.log();
        recordActivity(root, { source: "cli", action: "control_override", title: `Policy basis added: ${updated.system_name}`, description: `Policy ${policyName} (${policyId} v${version}) documented for ${updated.system_name}.`, details: { governance_record_id: updated.id }, actor_name: options.actor, actor_role: options.actorRole });
      }),
  )
  .addCommand(
    new Command("review-cycle")
      .description("Set up a review cycle for a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--frequency <freq>", "Frequency: quarterly, semi-annual, annual, biennial")
      .option("--next-review <date>", "Next review date (YYYY-MM-DD)")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) { console.error(`  Error: Governance record "${id}" not found.`); process.exit(1); }

        const frequency = (options.frequency || await select({
          message: "Review frequency:",
          choices: [
            { name: "Quarterly", value: "quarterly" },
            { name: "Semi-Annual", value: "semi-annual" },
            { name: "Annual", value: "annual" },
            { name: "Biennial", value: "biennial" },
          ],
        })) as "quarterly" | "semi-annual" | "annual" | "biennial";

        const today = new Date().toISOString().split("T")[0];
        const nextReview = options.nextReview || await input({ message: "Next review date (YYYY-MM-DD):", default: today });

        const updated = setGovernanceReviewCycle(root, record.id, {
          frequency,
          last_review: today,
          next_review: nextReview,
          review_history: [],
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        blank();
        success("Review cycle set", `for ${updated.system_name}`);
        kv("Frequency", frequency, 6);
        kv("Next review", nextReview, 6);
        console.log();
        recordActivity(root, { source: "cli", action: "control_override", title: `Review cycle set: ${updated.system_name}`, description: `Review cycle (${frequency}) set for ${updated.system_name}. Next review: ${nextReview}.`, details: { governance_record_id: updated.id }, actor_name: options.actor, actor_role: options.actorRole });
      }),
  )
  .addCommand(
    new Command("data-inventory")
      .description("Document the data inventory for a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--categories <cats>", "Personal data categories (comma-separated)")
      .option("--purposes <purp>", "Processing purposes (comma-separated)")
      .option("--retention <period>", "Retention period")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) { console.error(`  Error: Governance record "${id}" not found.`); process.exit(1); }

        const categoriesStr = options.categories || await input({ message: "Personal data categories (e.g., 'names,emails,IP addresses'):", default: "" });
        const purposesStr = options.purposes || await input({ message: "Processing purposes (e.g., 'user auth,analytics'):", default: "" });
        const subjectsStr = await input({ message: "Data subjects (e.g., 'customers,employees', or Enter to skip):", default: "" });
        const transfersStr = await input({ message: "Cross-border transfers (e.g., 'US,EU', or Enter to skip):", default: "" });
        const retention = options.retention || await input({ message: "Retention period (e.g., '2 years', '90 days'):", default: "" });

        const updated = setGovernanceDataInventory(root, record.id, {
          personal_data_categories: categoriesStr ? categoriesStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          processing_purposes: purposesStr ? purposesStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          data_subjects: subjectsStr ? subjectsStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          cross_border_transfers: transfersStr ? transfersStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          retention_period: retention,
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        blank();
        success("Data inventory documented", `for ${updated.system_name}`);
        console.log();
        recordActivity(root, { source: "cli", action: "control_override", title: `Data inventory added: ${updated.system_name}`, description: `Data inventory documented for ${updated.system_name}.`, details: { governance_record_id: updated.id }, actor_name: options.actor, actor_role: options.actorRole });
      }),
  )
  .addCommand(
    new Command("committee")
      .description("Record committee approval for a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--committee <name>", "Committee name")
      .option("--meeting-ref <ref>", "Meeting reference")
      .option("--meeting-date <date>", "Meeting date (YYYY-MM-DD)")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) { console.error(`  Error: Governance record "${id}" not found.`); process.exit(1); }

        const committeeName = options.committee || await input({ message: "Committee name (e.g., 'AI Ethics Board'):", default: "" });
        const meetingRef = options.meetingRef || await input({ message: "Meeting reference (e.g., 'MIN-2026-001'):", default: "" });
        const meetingDate = options.meetingDate || await input({ message: "Meeting date (YYYY-MM-DD):", default: "" });
        const attendeesStr = await input({ message: "Attendees (comma-separated names, or Enter to skip):", default: "" });
        const summary = await input({ message: "Decision summary (what was decided):", default: "" });

        const updated = setGovernanceCommittee(root, record.id, {
          committee_name: committeeName,
          meeting_date: meetingDate,
          meeting_reference: meetingRef,
          attendees: attendeesStr ? attendeesStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          decision_summary: summary,
          evidence: [],
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        blank();
        success("Committee approval recorded", `for ${updated.system_name}`);
        kv("Committee", committeeName, 6);
        kv("Meeting", `${meetingDate} (${meetingRef})`, 6);
        console.log();
        recordActivity(root, { source: "cli", action: "control_override", title: `Committee approval added: ${updated.system_name}`, description: `Committee ${committeeName} (${meetingRef}) recorded for ${updated.system_name}.`, details: { governance_record_id: updated.id }, actor_name: options.actor, actor_role: options.actorRole });
      }),
  )
  .addCommand(
    new Command("compliance-links")
      .description("Map compliance frameworks to a governance record")
      .argument("<id>", "Record ID or system name")
      .option("--frameworks <fw>", "Frameworks (comma-separated, e.g., GDPR,OWASP)")
      .option("--controls <ctrls>", "Controls satisfied (comma-separated)")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (id: string, options) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) { console.error(`  Error: Governance record "${id}" not found.`); process.exit(1); }

        const frameworksStr = options.frameworks || await input({ message: "Frameworks (e.g., 'GDPR,OWASP'):", default: "" });
        const controlsStr = options.controls || await input({ message: "Controls satisfied (e.g., 'GDPR-ART32-002', or Enter to skip):", default: "" });
        const packsStr = await input({ message: "Control pack IDs (comma-separated, or Enter to skip):", default: "" });

        const updated = setGovernanceComplianceLinks(root, record.id, {
          frameworks: frameworksStr ? frameworksStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          controls_satisfied: controlsStr ? controlsStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          control_pack_ids: packsStr ? packsStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        blank();
        success("Compliance links mapped", `for ${updated.system_name}`);
        console.log();
        recordActivity(root, { source: "cli", action: "control_override", title: `Compliance links added: ${updated.system_name}`, description: `Compliance frameworks mapped for ${updated.system_name}.`, details: { governance_record_id: updated.id }, actor_name: options.actor, actor_role: options.actorRole });
      }),
  );
