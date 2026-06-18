import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { input, select } from "../utils/prompts.js";
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
  const badge = STATUS_BADGE[record.status] || "?";
  console.log(`  ${badge} ${record.id}  ${record.system_name}`);
  console.log(`     Type: ${record.system_type}  |  Risk: ${RISK_COLOR[record.risk_level] || record.risk_level}  |  Status: ${record.status}`);
  if (record.approval) {
    console.log(`     Approved by: ${record.approval.approver_name} (${record.approval.approver_role})`);
    console.log(`     Valid: ${record.approval.valid_from} → ${record.approval.valid_until || "indefinite"}`);
  } else {
    console.log(`     Approval: NOT RECORDED`);
  }
  console.log(`     Evidence: ${record.evidence.length} reference(s)`);
}

export const governanceCommand = new Command("governance")
  .description("Manage governance approval provenance chains")
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

        console.log(`\n  [✓] Governance record created`);
        console.log(`      ID: ${record.id}`);
        printRecordSummary(record);
        console.log(`\n  Next steps:`);
        console.log(`    ges governance approve ${record.id}     — Record approval decision`);
        console.log(`    ges governance evidence ${record.id}    — Add evidence reference`);
        console.log(`    ges governance verify ${record.id}      — Verify provenance chain\n`);

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

        const approverName = options.approver || await input({ message: "Approver name:", default: "" });
        const approverRole = options.role || await input({ message: "Approver role:", default: "" });
        const approverEmail = options.email || await input({ message: "Approver email:", default: "" });
        const authority = options.authority || await input({ message: "Approval authority:", default: "" });
        const decision = (options.decision || await select({
          message: "Decision:",
          choices: [
            { name: "Approved", value: "approved" },
            { name: "Conditional", value: "conditional" },
            { name: "Rejected", value: "rejected" },
          ],
        })) as "approved" | "rejected" | "conditional";

        const validFrom = options.validFrom || new Date().toISOString().split("T")[0];
        const validUntil = options.validUntil || await input({ message: "Valid until (YYYY-MM-DD, or blank for indefinite):", default: "" });
        const conditionsStr = options.conditions || await input({ message: "Conditions (comma-separated):", default: "" });
        const rationale = options.rationale || await input({ message: "Rationale:", default: "" });

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

        console.log(`\n  [✓] Approval recorded for ${updated.system_name}`);
        console.log(`      Decision: ${decision.toUpperCase()}`);
        console.log(`      Approver: ${approverName} (${approverRole})`);
        console.log(`      Valid: ${validFrom} → ${validUntil || "indefinite"}\n`);

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

        const title = options.title || await input({ message: "Evidence title:", default: "" });
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

        const reference = options.reference || await input({ message: "Reference (ticket ID, URL, doc name):", default: "" });
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
        const locationDesc = await input({ message: "Location description:", default: "" });

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

        console.log(`\n  [✓] Evidence added to ${updated.system_name}`);
        console.log(`      ${evidence.title}`);
        console.log(`      Source: ${evidence.source_system}  |  Ref: ${evidence.reference}`);
        console.log(`      Total evidence: ${updated.evidence.length} reference(s)\n`);

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
      .action(() => {
        const root = ensureGESInitialized();
        const records = loadGovernanceRecords(root);
        if (records.length === 0) {
          console.log(`\n  No governance records found.`);
          console.log(`  Create one with: ges governance add\n`);
          return;
        }
        console.log(`\n  Governance Records (${records.length}):\n`);
        records.forEach(r => {
          printRecordSummary(r);
          console.log("");
        });
      }),
  )
  .addCommand(
    new Command("show")
      .description("Show full provenance chain for a governance record")
      .argument("<id>", "Record ID or system name")
      .action((id: string) => {
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
      }),
  )
  .addCommand(
    new Command("verify")
      .description("Verify the provenance chain completeness of a governance record")
      .argument("<id>", "Record ID or system name")
      .action((id: string) => {
        const root = ensureGESInitialized();
        const record = findGovernanceRecord(root, id);
        if (!record) {
          console.error(`  Error: Governance record "${id}" not found.`);
          process.exit(1);
        }

        const result = verifyGovernanceRecord(record);
        console.log(`\n  ═══════════════════════════════════════════════════`);
        console.log(`  VERIFICATION: ${record.system_name}`);
        console.log(`  ═══════════════════════════════════════════════════\n`);

        console.log(`  Overall: ${result.valid ? "✓ VALID" : "✕ ISSUES FOUND"}`);
        console.log(`  Approval Status: ${result.approval_status.toUpperCase()}`);
        if (result.days_until_expiry !== null) {
          const dayLabel = result.days_until_expiry < 0 ? `${Math.abs(result.days_until_expiry)} days AGO` : `${result.days_until_expiry} days remaining`;
          console.log(`  Expiry: ${dayLabel}`);
        }
        console.log(`  Evidence Count: ${result.completeness.evidence_count}`);
        console.log(`\n  Completeness Checklist:`);
        console.log(`    ${result.completeness.has_approval ? "✓" : "✕"} Approval Decision`);
        console.log(`    ${result.completeness.has_risk_assessment ? "✓" : "✕"} Risk Assessment`);
        console.log(`    ${result.completeness.has_policy_basis ? "✓" : "✕"} Policy Basis`);
        console.log(`    ${result.completeness.has_evidence ? "✓" : "✕"} Evidence Chain`);
        console.log(`    ${result.completeness.has_review_cycle ? "✓" : "△"} Review Cycle`);
        console.log(`    ${result.completeness.has_data_inventory ? "✓" : "△"} Data Inventory`);
        console.log(`    ${result.completeness.has_compliance_links ? "✓" : "△"} Compliance Links`);
        console.log(`    ${result.completeness.is_current ? "✓" : "✕"} Currently Valid`);

        if (result.issues.length > 0) {
          console.log(`\n  BLOCKING ISSUES:`);
          result.issues.forEach(i => console.log(`    ✕ ${i}`));
        }
        if (result.warnings.length > 0) {
          console.log(`\n  WARNINGS:`);
          result.warnings.forEach(w => console.log(`    △ ${w}`));
        }
        console.log("");
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
          console.log(`\n  [✓] Deleted governance record: ${record.system_name} (${record.id})\n`);
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

        const assessor = options.assessor || await input({ message: "Assessor name:", default: "" });
        const methodology = options.methodology || await input({ message: "Methodology:", default: "" });
        const score = options.score || await input({ message: "Risk score:", default: "" });
        const residual = options.residual || await input({ message: "Residual risk level:", default: "" });
        const risksStr = await input({ message: "Identified risks (comma-separated):", default: "" });
        const mitigationsStr = await input({ message: "Mitigation measures (comma-separated):", default: "" });

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
        console.log(`\n  [✓] Risk assessment linked to ${updated.system_name}`);
        console.log(`      Assessor: ${assessor}  |  Score: ${score}  |  Residual: ${residual}\n`);
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

        const policyId = options.policyId || await input({ message: "Policy ID:", default: "" });
        const policyName = options.policyName || await input({ message: "Policy name:", default: "" });
        const version = options.pv || await input({ message: "Policy version:", default: "1.0" });
        const standard = options.standard || await input({ message: "Standard:", default: "" });
        const clausesStr = await input({ message: "Applicable clauses (comma-separated):", default: "" });

        const updated = setGovernancePolicyBasis(root, record.id, {
          policy_id: policyId,
          policy_name: policyName,
          version,
          clauses: clausesStr ? clausesStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          standard,
          evidence: [],
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        console.log(`\n  [✓] Policy basis documented for ${updated.system_name}`);
        console.log(`      ${policyName} (${policyId} v${version}) — ${standard}\n`);
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
        console.log(`\n  [✓] Review cycle set for ${updated.system_name}`);
        console.log(`      Frequency: ${frequency}  |  Next review: ${nextReview}\n`);
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

        const categoriesStr = options.categories || await input({ message: "Personal data categories (comma-separated):", default: "" });
        const purposesStr = options.purposes || await input({ message: "Processing purposes (comma-separated):", default: "" });
        const subjectsStr = await input({ message: "Data subjects (comma-separated):", default: "" });
        const transfersStr = await input({ message: "Cross-border transfers (comma-separated):", default: "" });
        const retention = options.retention || await input({ message: "Retention period:", default: "" });

        const updated = setGovernanceDataInventory(root, record.id, {
          personal_data_categories: categoriesStr ? categoriesStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          processing_purposes: purposesStr ? purposesStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          data_subjects: subjectsStr ? subjectsStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          cross_border_transfers: transfersStr ? transfersStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          retention_period: retention,
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        console.log(`\n  [✓] Data inventory documented for ${updated.system_name}\n`);
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

        const committeeName = options.committee || await input({ message: "Committee name:", default: "" });
        const meetingRef = options.meetingRef || await input({ message: "Meeting reference:", default: "" });
        const meetingDate = options.meetingDate || await input({ message: "Meeting date (YYYY-MM-DD):", default: "" });
        const attendeesStr = await input({ message: "Attendees (comma-separated):", default: "" });
        const summary = await input({ message: "Decision summary:", default: "" });

        const updated = setGovernanceCommittee(root, record.id, {
          committee_name: committeeName,
          meeting_date: meetingDate,
          meeting_reference: meetingRef,
          attendees: attendeesStr ? attendeesStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          decision_summary: summary,
          evidence: [],
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        console.log(`\n  [✓] Committee approval recorded for ${updated.system_name}`);
        console.log(`      ${committeeName} — ${meetingDate} (${meetingRef})\n`);
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

        const frameworksStr = options.frameworks || await input({ message: "Frameworks (comma-separated):", default: "" });
        const controlsStr = options.controls || await input({ message: "Controls satisfied (comma-separated):", default: "" });
        const packsStr = await input({ message: "Control pack IDs (comma-separated):", default: "" });

        const updated = setGovernanceComplianceLinks(root, record.id, {
          frameworks: frameworksStr ? frameworksStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          controls_satisfied: controlsStr ? controlsStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
          control_pack_ids: packsStr ? packsStr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        }, "cli-user");

        if (!updated) { console.error(`  Error: Failed to update.`); process.exit(1); }
        console.log(`\n  [✓] Compliance links mapped for ${updated.system_name}\n`);
        recordActivity(root, { source: "cli", action: "control_override", title: `Compliance links added: ${updated.system_name}`, description: `Compliance frameworks mapped for ${updated.system_name}.`, details: { governance_record_id: updated.id }, actor_name: options.actor, actor_role: options.actorRole });
      }),
  );
