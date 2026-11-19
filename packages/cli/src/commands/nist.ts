import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { input, select } from "../utils/prompts.js";
import { banner, blank, divider, error, info, item, kv, statusBadge, success, warn } from "../utils/ui.js";
import {
  addBaselineCompensating,
  addBaselineExclusion,
  addBaselineInheritance,
  addNistEvidence,
  addNistFinding,
  addNistPoamItem,
  addNistPoamMilestone,
  addNistDeficiency,
  ASSESSMENT_DETERMINATIONS,
  ASSESSMENT_METHODS,
  closeNistFinding,
  completeNistPoamMilestone,
  computeSha256,
  createNistAssessment,
  deleteNistEvidence,
  EVIDENCE_KINDS,
  ensureNistWorkflow,
  getLatestNistAssessmentForControl,
  getNistAssessment,
  getNistPoamItem,
  getOverdueNistPoam,
  IMPLEMENTATION_STATUSES,
  loadConfig,
  loadNistAssessments,
  loadNistBaselineSelection,
  loadNistEvidence,
  loadNistFindings,
  loadNistPoam,
  loadNistWorkflow,
  POAM_STATUSES,
  recordActivity,
  recordNistDetermination,
  reviewNistEvidence,
  setNistBaselineSelection,
  setNistControlOwner,
  setNistPoamStatus,
  setNistWorkflowScope,
  summarizeNistAssessment,
  transitionNistWorkflow,
  updateNistAssessment,
  validateEvidenceReference,
  allowedTransitionsFrom,
  type NistAssessmentDetermination,
  type NistAssessmentMethodKind,
  type NistImplementationStatus,
  type NistWorkflowState,
} from "@greenarmor/ges-core";
import {
  getAllNistControls,
  getCatalogMetadata,
  getCatalogStats,
  getFamily,
  getNistBaseline,
  getNistBaselines,
  getNistControl,
  listFamilyCodes,
  normalizeNistControlId,
  resolveBaselineControlIds,
  searchNistControls,
} from "@greenarmor/ges-policy-engine";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  buildNistAssessmentJsonReport,
  generateNistAssessmentHtmlReport,
  generateNistAssessmentMarkdownReport,
  generateNistAssessmentPdfReport,
  type NistReportControlRow,
} from "@greenarmor/ges-report-generator";

function getProjectId(root: string): string {
  const config = loadConfig(root);
  return config?.project_name ?? "project";
}

function disallowStatusOption(): never {
  error('Invalid status. Use one of: ' + IMPLEMENTATION_STATUSES.join(", "));
  process.exit(1);
}

function pick<T extends string>(value: string | undefined, allowed: readonly T[], label: string): T | undefined {
  if (!value) return undefined;
  if (!allowed.includes(value as T)) {
    error(`Invalid ${label}: "${value}". Allowed: ${allowed.join(", ")}`);
    process.exit(1);
  }
  return value as T;
}

function buildReportRows(root: string): NistReportControlRow[] {
  const baseline = loadNistBaselineSelection(root);
  const evidence = loadNistEvidence(root);
  const findings = loadNistFindings(root).filter((f) => f.status === "open");
  const poam = loadNistPoam(root).filter((p) => !["closed", "completed", "accepted-risk"].includes(p.status));
  const excluded = new Set(baseline?.exclusions.map((e) => e.control_id) ?? []);
  const ids = (baseline?.control_ids ?? []).filter((id) => !excluded.has(id));
  const rows: NistReportControlRow[] = [];
  for (const id of ids) {
    const control = getNistControl(id);
    const assessment = getLatestNistAssessmentForControl(root, id);
    rows.push({
      id,
      title: control?.title ?? "(unknown control)",
      family: control?.family ?? id.slice(0, 2),
      implementation_status: assessment?.implementation_status,
      determination: assessment?.determination,
      assessor: assessment?.assessor,
      assessment_date: assessment?.assessment_date,
      owner: assessment?.control_owner,
      evidence_count: evidence.filter((e) => e.control_ids.includes(id)).length,
      open_findings: findings.filter((f) => f.control_id === id).length,
      open_poam: poam.filter((p) => p.control_id === id).length,
    });
  }
  return rows.sort((a, b) => a.id.localeCompare(b.id));
}

export const nistCommand = new Command("nist")
  .description("NIST SP 800-53 Rev. 5 control assessment and POA&M management")
  .action(async () => {
    if (!process.stdout.isTTY) {
      nistCommand.outputHelp();
      return;
    }
    banner("NIST SP 800-53 Assessment");
    const root = ensureGESInitialized();
    const baseline = loadNistBaselineSelection(root);
    const summary = summarizeNistAssessment(root);
    blank();
    kv("Baseline", baseline ? `${baseline.label} (${baseline.control_ids.length} controls)` : "none selected", 4);
    kv("Applicable controls", String(summary.applicable_controls), 4);
    kv("Assessed", `${summary.assessed} satisfied ${summary.satisfied} / OTS ${summary.other_than_satisfied}`, 4);
    kv("Open findings / POA&M", `${summary.open_findings} / ${summary.open_poam}`, 4);
    blank();
    info("GESF is a NIST-aligned assessment tool, not a NIST-certified product.");
    info("Assessment results are organization-recorded; they are not certification, accreditation, or authorization by NIST.");
    blank();
    const action = await select({
      message: "NIST assessment action:",
      choices: [
        { name: "Catalog — browse the 800-53 Rev. 5 control catalog", value: "catalog" },
        { name: "Baseline — select or tailor a baseline", value: "baseline" },
        { name: "Status — assessment summary and workflow state", value: "status" },
        { name: "Assess — create or update a control assessment", value: "assess" },
        { name: "Evidence — manage assessment evidence", value: "evidence" },
        { name: "Findings — manage assessment findings", value: "findings" },
        { name: "POA&M — plan of action and milestones", value: "poam" },
        { name: "Workflow — assessment lifecycle state", value: "workflow" },
        { name: "Report — generate assessment report", value: "report" },
        { name: "Exit", value: "exit" },
      ],
    });
    if (action === "exit") return;
    const { execSync } = await import("node:child_process");
    execSync(`ges nist ${action}`, { stdio: "inherit" });
  });

nistCommand
  .addCommand(
    new Command("catalog")
      .description("Show control catalog statistics, families, or a specific control")
      .argument("[target]", "Family code (AC), control ID (AC-2), or 'search <term>' handled via flags")
      .option("-s, --search <query>", "Search controls by ID, title, or statement")
      .action(async (target: string | undefined, options: { search?: string }) => {
        const stats = getCatalogStats();
        const meta = getCatalogMetadata();
        if (options.search) {
          const results = searchNistControls(options.search);
          blank();
          info(`Search results for "${options.search}" (${results.length}):`);
          for (const control of results) {
            item(control.id, control.title);
          }
          return;
        }
        if (!target) {
          banner("NIST SP 800-53 Rev. 5 Catalog");
          kv("Catalog version", `OSCAL ${meta.oscal_version} (${meta.oscal_title})`, 4);
          kv("Imported", meta.import_date, 4);
          kv("Source", meta.source, 4);
          blank();
          kv("Control families", String(stats.families), 4);
          kv("Base controls", String(stats.base_controls), 4);
          kv("Control enhancements", String(stats.enhancements), 4);
          kv("Total catalog entries", String(stats.total_entries), 4);
          kv("Assessment objectives", String(stats.objectives), 4);
          blank();
          info("Families");
          for (const code of listFamilyCodes()) {
            const family = getFamily(code);
            if (!family) continue;
            const enhancements = family.controls.reduce((sum, c) => sum + (c.enhancements?.length ?? 0), 0);
            item(code, `${family.name} — ${family.controls.length} controls, ${enhancements} enhancements`);
          }
          return;
        }
        const upper = target.trim().toUpperCase();
        if (listFamilyCodes().includes(upper)) {
          const family = getFamily(upper);
          if (!family) return;
          banner(`${family.code} — ${family.name}`);
          for (const control of family.controls) {
            item(control.id, control.title);
            for (const enhancement of control.enhancements ?? []) {
              item(`  ${enhancement.id}`, enhancement.title,);
            }
          }
          return;
        }
        const control = getNistControl(target);
        if (!control) {
          error(`Control "${target}" not found in the NIST SP 800-53 Rev. 5 catalog.`);
          process.exit(1);
        }
        banner(`${control.id} — ${control.title}`);
        kv("Family", `${control.family} (${getFamily(control.family)?.name ?? ""})`, 4);
        if (control.parent_id) kv("Enhancement of", control.parent_id, 4);
        if (control.implementation_level) kv("Implementation level", control.implementation_level, 4);
        blank();
        info("Statement");
        console.log(control.statement);
        if (control.supplemental_guidance) {
          blank();
          info("Supplemental guidance");
          console.log(control.supplemental_guidance);
        }
        if (control.objectives && control.objectives.length > 0) {
          blank();
          info("Assessment objectives");
          for (const objective of control.objectives) {
            item(objective.label, objective.text);
          }
        }
        if (control.methods && control.methods.length > 0) {
          blank();
          info("Assessment methods (SP 800-53A)");
          for (const method of control.methods) {
            item(method.method.toUpperCase(), method.label);
          }
        }
        if (control.related_controls && control.related_controls.length > 0) {
          blank();
          info("Related controls");
          console.log(control.related_controls.join(", "));
        }
      }),
  )
  .addCommand(
    new Command("baseline")
      .description("Show, select, or tailor the NIST SP 800-53B baseline")
      .argument("[action]", "show | set | exclude | inherit | compensate")
      .argument("[target]", "Baseline name (low/moderate/high) or control ID")
      .option("--controls <ids>", "Comma-separated control IDs for tailored/custom baselines")
      .option("--label <label>", "Label for tailored/custom baselines")
      .option("--derived-from <baseline>", "Official baseline a tailored baseline derives from")
      .option("--justification <text>", "Justification for exclusion")
      .option("--from <system>", "System controls are inherited from")
      .option("--alternative <text>", "Alternative implementation description")
      .option("--description <text>", "Description for inheritance or compensating control")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .option("--json", "Machine-readable output")
      .action(async (action: string | undefined, target: string | undefined, options) => {
        const root = ensureGESInitialized();
        const catalogVersion = getCatalogMetadata().oscal_version;

        if (!action || action === "show") {
          const selection = loadNistBaselineSelection(root);
          if (options.json) {
            console.log(JSON.stringify(selection, null, 2));
            return;
          }
          if (!selection) {
            warn("No baseline selected. Run: ges nist baseline set low|moderate|high");
            return;
          }
          banner("NIST SP 800-53B Baseline Selection");
          kv("Baseline", `${selection.label} (${selection.kind})`, 4);
          kv("Controls", String(selection.control_ids.length), 4);
          kv("Catalog version", selection.catalog_version, 4);
          kv("Selected at", selection.selected_at, 4);
          if (selection.selected_by) kv("Selected by", selection.selected_by, 4);
          if (selection.exclusions.length > 0) {
            blank(); info("Exclusions (documented)");
            for (const exclusion of selection.exclusions) {
              item(exclusion.control_id, exclusion.justification);
            }
          }
          if (selection.inherited.length > 0) {
            blank(); info("Inherited controls");
            for (const inherited of selection.inherited) {
              item(inherited.control_id, `from ${inherited.from_system}: ${inherited.description}`);
            }
          }
          if (selection.compensating.length > 0) {
            blank(); info("Compensating controls / alternative implementations");
            for (const compensating of selection.compensating) {
              item(compensating.control_id, compensating.alternative_implementation);
            }
          }
          if (selection.previous_selections.length > 0) {
            blank();
            info(`${selection.previous_selections.length} previous selection(s) preserved in history.`);
          }
          return;
        }

        if (action === "set") {
          const kindRaw = (target ?? "").toLowerCase();
          if (!["low", "moderate", "high", "tailored", "custom"].includes(kindRaw)) {
            error("Usage: ges nist baseline set low|moderate|high  |  ges nist baseline set tailored --controls AC-2,AC-3");
            process.exit(1);
          }
          const kind = kindRaw as "low" | "moderate" | "high" | "tailored" | "custom";
          let controlIds: string[];
          let label: string;
          let derivedFrom: "low" | "moderate" | "high" | undefined;
          if (kind === "low" || kind === "moderate" || kind === "high") {
            const baseline = getNistBaseline(kind);
            controlIds = baseline.control_ids;
            label = baseline.label;
          } else {
            if (!options.controls) {
              error('Tailored/custom baselines require --controls "AC-2,AC-3(1),..."');
              process.exit(1);
            }
            controlIds = options.controls.split(",").map((c: string) => c.trim()).filter(Boolean);
            label = options.label ?? (kind === "tailored" ? "Tailored Organizational Baseline" : "Custom Baseline");
            if (options.derivedFrom) {
              derivedFrom = options.derivedFrom as "low" | "moderate" | "high";
            }
          }
          const normalized = controlIds.map((id) => normalizeNistControlId(id));
          const resolution = resolveBaselineControlIds(normalized);
          if (resolution.unknown.length > 0) {
            error(`Unknown control IDs (not in catalog): ${resolution.unknown.join(", ")}`);
            process.exit(1);
          }
          const selection = setNistBaselineSelection(root, {
            kind,
            label,
            control_ids: resolution.resolved,
            ...(derivedFrom ? { derived_from: derivedFrom } : {}),
            catalog_version: catalogVersion,
            selected_by: options.actor,
          });
          ensureNistWorkflow(root, getProjectId(root));
          if (!options.json) {
            success(`Baseline selected: ${selection.label} (${selection.control_ids.length} controls)`);
            info("Baseline selection does not mark any control as implemented or assessed.");
          }
          recordActivity(root, {
            source: "cli",
            action: "nist_baseline",
            title: `NIST baseline selected: ${selection.label}`,
            description: `${selection.control_ids.length} controls selected from ${selection.kind} baseline (catalog ${catalogVersion}).`,
            details: { baseline_kind: selection.kind, control_count: selection.control_ids.length },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
          if (options.json) console.log(JSON.stringify(selection, null, 2));
          return;
        }

        if (action === "exclude" || action === "inherit" || action === "compensate") {
          if (!target) {
            error(`Usage: ges nist baseline ${action} <controlId>`);
            process.exit(1);
          }
          const controlId = normalizeNistControlId(target);
          if (action === "exclude") {
            const justification = options.justification ?? (await input({ message: "Justification for exclusion (required):", default: "" }));
            if (!justification.trim()) {
              error("Excluding a control requires a documented justification.");
              process.exit(1);
            }
            const selection = addBaselineExclusion(root, controlId, justification);
            if (!selection) {
              error("No baseline selected. Run: ges nist baseline set <name>");
              process.exit(1);
            }
            success(`Control ${controlId} excluded with documented justification.`);
          } else if (action === "inherit") {
            const from = options.from ?? (await input({ message: "Inherited from system/provider:", default: "" }));
            const description = options.description ?? (await input({ message: "Description:", default: "" }));
            const selection = addBaselineInheritance(root, controlId, from, description);
            if (!selection) {
              error("No baseline selected.");
              process.exit(1);
            }
            success(`Control ${controlId} marked inherited from ${from}.`);
          } else {
            const alternative = options.alternative ?? (await input({ message: "Alternative implementation:", default: "" }));
            const description = options.description ?? (await input({ message: "Description:", default: "" }));
            const selection = addBaselineCompensating(root, controlId, alternative, description);
            if (!selection) {
              error("No baseline selected.");
              process.exit(1);
            }
            success(`Compensating control recorded for ${controlId}.`);
          }
          recordActivity(root, {
            source: "cli",
            action: "nist_baseline",
            title: `Baseline tailoring: ${action} ${controlId}`,
            description: `Baseline tailoring action "${action}" applied to ${controlId}.`,
            details: { control_id: controlId, action },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
          return;
        }

        error(`Unknown baseline action "${action}". Use show | set | exclude | inherit | compensate.`);
        process.exit(1);
      }),
  )
  .addCommand(
    new Command("assess")
      .description("Create or update a control assessment; record determinations")
      .argument("[controlId]", "NIST control ID (e.g. AC-2 or AC-2(3))")
      .option("--status <status>", "Implementation status")
      .option("--scope <scope>", "Assessment scope")
      .option("--objective <text>", "Assessment objective")
      .option("--assessor <name>", "Assessor name")
      .option("--owner <name>", "Control owner (also stored as control owner)")
      .option("--date <date>", "Assessment date (YYYY-MM-DD)")
      .option("--inherited-from <system>", "System the control is inherited from")
      .option("--determination <determination>", "Assessment determination (satisfied, other-than-satisfied, not-applicable)")
      .option("--rationale <text>", "Rationale for the determination (required for any determination)")
      .option("--methods <methods>", "Comma-separated assessment methods (examine,interview,test)")
      .option("--deficiency <text>", "Record an identified deficiency")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .option("--json", "Machine-readable output")
      .action(async (controlId: string | undefined, options) => {
        const root = ensureGESInitialized();
        const projectId = getProjectId(root);

        if (!controlId) {
          const assessments = loadNistAssessments(root);
          const summary = summarizeNistAssessment(root);
          if (options.json) {
            console.log(JSON.stringify({ summary, assessments }, null, 2));
            return;
          }
          banner("NIST Control Assessments");
          kv("Applicable controls", String(summary.applicable_controls), 4);
          kv("Assessed", `${summary.assessed} (satisfied ${summary.satisfied}, other-than-satisfied ${summary.other_than_satisfied})`, 4);
          kv("Not assessed", String(summary.not_assessed), 4);
          kv("Awaiting evidence", String(summary.awaiting_evidence), 4);
          blank();
          if (assessments.length === 0) {
            warn("No assessment records. Create one: ges nist assess AC-2 --status planned");
            return;
          }
          info("Assessment records");
          for (const record of assessments) {
            const status = statusBadge(record.determination === "satisfied" ? "pass" : record.determination === "other-than-satisfied" ? "fail" : "warning");
            console.log(`  ${record.id}  ${record.control_id}  [${record.implementation_status}]  ${status}  ${record.determination}`);
          }
          return;
        }

        const normalizedId = normalizeNistControlId(controlId);
        const control = getNistControl(normalizedId);
        if (!control) {
          error(`Control "${controlId}" not found in the NIST catalog.`);
          process.exit(1);
        }

        const existing = getLatestNistAssessmentForControl(root, normalizedId);
        const status = pick(options.status, IMPLEMENTATION_STATUSES, "status") ??
          (existing?.implementation_status as NistImplementationStatus | undefined) ??
          "not-implemented";
        const scope = options.scope ?? existing?.scope ?? (await input({ message: "Assessment scope:", default: "Full system" }));
        const objective = options.objective ?? existing?.assessment_objective ?? `Determine whether ${normalizedId} is implemented correctly, operating as intended, and producing the desired outcome.`;
        const assessor = options.assessor ?? existing?.assessor ?? (await input({ message: "Assessor name:", default: "" }));
        const owner = options.owner ?? existing?.control_owner ?? (await input({ message: "Control owner:", default: "" }));

        let record = existing;
        if (!existing) {
          record = createNistAssessment(root, {
            project_id: projectId,
            control_id: control.parent_id ?? normalizedId,
            ...(control.parent_id ? { control_enhancement_id: normalizedId } : {}),
            scope,
            implementation_status: status,
            assessment_objective: objective,
            assessor: assessor || "unassigned",
            control_owner: owner || "unassigned",
            ...(options.date ? { assessment_date: options.date } : {}),
            ...(options.inheritedFrom ? { inherited_from: options.inheritedFrom } : {}),
          });
          if (owner && owner !== "unassigned") {
            setNistControlOwner(root, normalizedId, owner, undefined, options.actor);
          }
          if (!options.json) success(`Assessment created: ${record.id} for ${normalizedId}`);
        } else {
          const updated = updateNistAssessment(
            root,
            existing.id,
            {
              implementation_status: status,
              scope,
              assessment_objective: objective,
              ...(assessor ? { assessor } : {}),
              ...(owner ? { control_owner: owner } : {}),
            },
            options.actor,
          );
          record = updated ?? undefined;
          if (!options.json) success(`Assessment updated: ${record?.id} for ${normalizedId}`);
        }
        if (!record) {
          error("Failed to save assessment.");
          process.exit(1);
        }

        if (options.deficiency) {
          record = addNistDeficiency(root, record.id, options.deficiency) ?? record;
          if (!options.json) success("Deficiency recorded.");
        }

        if (options.determination) {
          const determination = pick(options.determination, ASSESSMENT_DETERMINATIONS, "determination") as NistAssessmentDetermination;
          const rationale = options.rationale ?? (await input({ message: "Determination rationale (required):", default: "" }));
          const methodsRaw = options.methods ?? (await input({ message: "Assessment methods (examine,interview,test):", default: "examine" }));
          const methods = methodsRaw.split(",").map((m: string) => m.trim()).filter(Boolean) as NistAssessmentMethodKind[];
          const invalidMethods = methods.filter((m) => !ASSESSMENT_METHODS.includes(m));
          if (invalidMethods.length > 0) {
            error(`Invalid methods: ${invalidMethods.join(", ")}. Allowed: examine, interview, test.`);
            process.exit(1);
          }
          const result = recordNistDetermination(root, record.id, {
            determination,
            rationale,
            methods,
            assessor: assessor || undefined,
            actor: options.actor,
          });
          if (!result.record || result.error) {
            error(result.error ?? "Determination rejected.");
            process.exit(1);
          }
          record = result.record;
          if (!options.json) success(`Determination recorded: ${determination}`);
        }

        recordActivity(root, {
          source: "cli",
          action: "nist_assess",
          title: `NIST assessment ${existing ? "updated" : "created"}: ${normalizedId}`,
          description: `Assessment ${record.id} for control ${normalizedId} (${record.implementation_status}, ${record.determination}).`,
          details: { control_id: normalizedId, assessment_id: record.id, determination: record.determination },
          actor_name: options.actor,
          actor_role: options.actorRole,
        });
        if (options.json) {
          console.log(JSON.stringify(record, null, 2));
        }
      }),
  )
  .addCommand(
    new Command("evidence")
      .description("Manage assessment evidence")
      .argument("[action]", "list | add | review | delete | hash")
      .argument("[id]", "Evidence ID or file path (for hash)")
      .option("--title <title>", "Evidence title")
      .option("--description <text>", "Evidence description")
      .option("--type <type>", "Evidence type")
      .option("--controls <ids>", "Comma-separated related control IDs")
      .option("--assessment <id>", "Related assessment ID")
      .option("--source <system>", "Source system")
      .option("--file <path>", "Local file reference (relative to project)")
      .option("--url <url>", "External URL reference")
      .option("--method <method>", "Collection method")
      .option("--collected-by <name>", "Collected by")
      .option("--owner <name>", "Evidence owner")
      .option("--classification <level>", "public | internal | confidential | restricted")
      .option("--expires <date>", "Expiration date (YYYY-MM-DD)")
      .option("--sha256 <hash>", "Known SHA-256 integrity digest")
      .option("--status <status>", "Review status (for review action)")
      .option("--by <name>", "Reviewer / authorizing person")
      .option("--force", "Force deletion of approved evidence")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .option("--json", "Machine-readable output")
      .action(async (action: string | undefined, id: string | undefined, options) => {
        const root = ensureGESInitialized();
        if (!action || action === "list") {
          const evidence = loadNistEvidence(root);
          if (options.json) {
            console.log(JSON.stringify(evidence, null, 2));
            return;
          }
          banner("Assessment Evidence");
          if (evidence.length === 0) {
            warn("No evidence recorded. Add evidence: ges nist evidence add --title ... --type policy --controls AC-1");
            return;
          }
          for (const item of evidence) {
            console.log(
              `  ${item.id}  [${item.evidence_type}]  ${item.title}  ${item.classification}  ${item.review_status}  (${item.control_ids.join(",") || "no controls"})`,
            );
          }
          return;
        }
        if (action === "add") {
          const title = options.title ?? (await input({ message: "Evidence title:", default: "" }));
          if (!title.trim()) {
            error("Evidence title is required.");
            process.exit(1);
          }
          const type = pick(options.type, EVIDENCE_KINDS, "type") ?? "other";
          const controls = (options.controls ?? (await input({ message: "Related control IDs (comma-separated):", default: "" })))
            .split(",")
            .map((c: string) => normalizeNistControlId(c.trim()))
            .filter(Boolean);
          const classification = pick(options.classification, ["public", "internal", "confidential", "restricted"] as const, "classification") ?? "internal";
          const result = addNistEvidence(root, {
            title,
            description: options.description ?? "",
            evidence_type: type,
            control_ids: controls,
            ...(options.assessment ? { assessment_ids: [options.assessment] } : {}),
            source_system: options.source ?? "manual",
            ...(options.file ? { file_reference: options.file } : {}),
            ...(options.url ? { url: options.url } : {}),
            collection_method: options.method ?? "manual",
            collected_by: options.collectedBy ?? options.actor ?? "unknown",
            owner: options.owner ?? options.actor ?? "unknown",
            classification,
            ...(options.expires ? { expires_at: options.expires } : {}),
            ...(options.sha256 ? { sha256: options.sha256 } : {}),
          });
          if (!result.evidence || result.error) {
            error(result.error ?? "Failed to add evidence.");
            process.exit(1);
          }
          if (!options.json) success(`Evidence added: ${result.evidence.id} (${result.evidence.title})`);
          recordActivity(root, {
            source: "cli",
            action: "nist_evidence",
            title: `NIST evidence added: ${title}`,
            description: `Evidence ${result.evidence.id} of type ${type} linked to controls: ${controls.join(", ") || "none"}.`,
            details: { evidence_id: result.evidence.id, evidence_type: type },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
          if (options.json) console.log(JSON.stringify(result.evidence, null, 2));
          return;
        }
        if (action === "review") {
          if (!id) {
            error("Usage: ges nist evidence review <id> --status approved --by <name>");
            process.exit(1);
          }
          const status = pick(options.status, ["pending-review", "approved", "rejected", "expired"] as const, "status");
          const reviewedBy = options.by ?? options.actor;
          if (!status || !reviewedBy) {
            error("--status and --by (reviewer) are required.");
            process.exit(1);
          }
          const item = reviewNistEvidence(root, id, status, reviewedBy);
          if (!item) {
            error(`Evidence ${id} not found.`);
            process.exit(1);
          }
          success(`Evidence ${id} review status: ${status}`);
          return;
        }
        if (action === "delete") {
          if (!id) {
            error("Usage: ges nist evidence delete <id> --by <name> [--force]");
            process.exit(1);
          }
          const authorizedBy = options.by ?? options.actor;
          if (!authorizedBy) {
            error("Deletion requires --by <authorizing person>.");
            process.exit(1);
          }
          const result = deleteNistEvidence(root, id, { authorized_by: authorizedBy, force: options.force });
          if (!result.deleted) {
            error(result.error ?? "Deletion failed.");
            process.exit(1);
          }
          warn(`Evidence ${id} deleted (authorized by ${authorizedBy}).`);
          recordActivity(root, {
            source: "cli",
            action: "nist_evidence",
            title: `NIST evidence deleted: ${id}`,
            description: `Evidence ${id} deleted with authorization from ${authorizedBy}.`,
            details: { evidence_id: id, deleted: true },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
          return;
        }
        if (action === "hash") {
          if (!id) {
            error("Usage: ges nist evidence hash <file>");
            process.exit(1);
          }
          const resolved = path.resolve(root, id);
          const digest = computeSha256(resolved);
          if (!digest) {
            error(`Cannot read file: ${id}`);
            process.exit(1);
          }
          kv("File", id, 4);
          kv("SHA-256", digest, 4);
          info("Integrity digest only — a hash match does not prove authenticity.");
          return;
        }
        error(`Unknown evidence action "${action}". Use list | add | review | delete | hash.`);
        process.exit(1);
      }),
  )
  .addCommand(
    new Command("findings")
      .description("Manage assessment findings")
      .argument("[action]", "list | add | close")
      .argument("[id]", "Finding ID (for close)")
      .option("--control <id>", "Related control ID")
      .option("--assessment <id>", "Related assessment ID")
      .option("--title <title>", "Finding title")
      .option("--description <text>", "Finding description")
      .option("--severity <severity>", "critical | high | medium | low")
      .option("--scanner-key <key>", "Related GESF scanner finding key (ruleId:file:line)")
      .option("--verification <assessmentId>", "Verification assessment for close")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .option("--json", "Machine-readable output")
      .action(async (action: string | undefined, id: string | undefined, options) => {
        const root = ensureGESInitialized();
        if (!action || action === "list") {
          const findings = loadNistFindings(root);
          if (options.json) {
            console.log(JSON.stringify(findings, null, 2));
            return;
          }
          banner("Assessment Findings");
          if (findings.length === 0) {
            info("No findings recorded.");
            return;
          }
          for (const finding of findings) {
            console.log(`  ${finding.id}  [${finding.severity}]  ${finding.control_id}  ${finding.status}  ${finding.title}`);
          }
          return;
        }
        if (action === "add") {
          const controlId = options.control ? normalizeNistControlId(options.control) : await input({ message: "Control ID:", default: "" });
          const title = options.title ?? (await input({ message: "Finding title:", default: "" }));
          const severity = pick(options.severity, ["critical", "high", "medium", "low"] as const, "severity") ?? "medium";
          const finding = addNistFinding(root, {
            control_id: controlId,
            ...(options.assessment ? { assessment_id: options.assessment } : {}),
            title,
            description: options.description ?? "",
            severity,
            ...(options.scannerKey ? { related_scanner_finding_key: options.scannerKey } : {}),
          });
          if (!options.json) {
            success(`Finding recorded: ${finding.id}`);
            info("Findings are resolved only after a reassessment verifies the correction (see: ges nist findings close).");
          }
          recordActivity(root, {
            source: "cli",
            action: "nist_finding",
            title: `NIST finding recorded: ${title}`,
            description: `Finding ${finding.id} (${severity}) for control ${controlId}.`,
            details: { finding_id: finding.id, control_id: controlId },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
          if (options.json) console.log(JSON.stringify(finding, null, 2));
          return;
        }
        if (action === "close") {
          if (!id || !options.verification) {
            error("Usage: ges nist findings close <findingId> --verification <assessmentId>");
            process.exit(1);
          }
          const result = closeNistFinding(root, id, options.verification);
          if (!result.finding || result.error) {
            error(result.error ?? "Failed to close finding.");
            process.exit(1);
          }
          success(`Finding ${id} closed after verified reassessment.`);
          recordActivity(root, {
            source: "cli",
            action: "nist_finding",
            title: `NIST finding closed: ${id}`,
            description: `Finding ${id} closed with verification assessment ${options.verification}.`,
            details: { finding_id: id, verification_assessment_id: options.verification },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
          if (options.json) console.log(JSON.stringify(result.finding, null, 2));
          return;
        }
        error(`Unknown findings action "${action}". Use list | add | close.`);
        process.exit(1);
      }),
  )
  .addCommand(
    new Command("poam")
      .description("Manage the Plan of Action and Milestones")
      .argument("[action]", "list | add | status | milestone | complete-milestone")
      .argument("[id]", "POA&M item ID")
      .option("--control <id>", "Related control ID")
      .option("--assessment <id>", "Related assessment ID")
      .option("--finding <id>", "Related finding ID")
      .option("--title <title>", "Item title")
      .option("--description <text>", "Deficiency description")
      .option("--root-cause <text>", "Root cause")
      .option("--strategy <text>", "Remediation strategy")
      .option("--actions <actions>", "Comma-separated corrective actions")
      .option("--owner <name>", "Responsible owner")
      .option("--department <name>", "Assigned department")
      .option("--risk-level <level>", "critical | high | medium | low")
      .option("--likelihood <level>", "Likelihood")
      .option("--target <date>", "Target completion date (YYYY-MM-DD)")
      .option("--start <date>", "Planned start date (YYYY-MM-DD)")
      .option("--status <status>", "POA&M status (for status action)")
      .option("--milestone-title <title>", "Milestone title")
      .option("--due <date>", "Milestone due date (YYYY-MM-DD)")
      .option("--milestone-id <id>", "Milestone ID (for complete-milestone)")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .option("--json", "Machine-readable output")
      .action(async (action: string | undefined, id: string | undefined, options) => {
        const root = ensureGESInitialized();
        if (!action || action === "list") {
          const items = loadNistPoam(root);
          const overdue = getOverdueNistPoam(root);
          if (options.json) {
            console.log(JSON.stringify({ items, overdue_count: overdue.length }, null, 2));
            return;
          }
          banner("Plan of Action and Milestones");
          if (items.length === 0) {
            warn("No POA&M items. Add one: ges nist poam add --control AC-2 --title ...");
            return;
          }
          for (const item of items) {
            const overdueItem = overdue.find((o) => o.item.id === item.id);
            const flag = overdueItem ? " [OVERDUE]" : "";
            console.log(`  ${item.id}  [${item.status}]  ${item.control_id}  ${item.title}${flag}`);
          }
          if (overdue.length > 0) {
            blank();
            error(`${overdue.length} POA&M item(s) have overdue milestones or targets.`);
          }
          return;
        }
        if (action === "add") {
          const controlId = options.control ? normalizeNistControlId(options.control) : await input({ message: "Control ID:", default: "" });
          const title = options.title ?? (await input({ message: "Finding / deficiency title:", default: "" }));
          const strategy = options.strategy ?? (await input({ message: "Remediation strategy:", default: "" }));
          const owner = options.owner ?? (await input({ message: "Responsible owner:", default: "" }));
          const item = addNistPoamItem(root, {
            control_id: controlId,
            ...(options.assessment ? { assessment_id: options.assessment } : {}),
            ...(options.finding ? { finding_id: options.finding } : {}),
            title,
            description: options.description ?? "",
            ...(options.rootCause ? { root_cause: options.rootCause } : {}),
            remediation_strategy: strategy,
            ...(options.actions ? { corrective_actions: options.actions.split(",").map((a: string) => a.trim()).filter(Boolean) } : {}),
            owner,
            ...(options.department ? { department: options.department } : {}),
            ...(pick(options.riskLevel, ["critical", "high", "medium", "low"] as const, "risk-level") ? { risk_level: options.riskLevel } : {}),
            ...(options.likelihood ? { likelihood: options.likelihood } : {}),
            ...(options.start ? { planned_start_date: options.start } : {}),
            ...(options.target ? { target_completion_date: options.target } : {}),
          });
          if (!options.json) success(`POA&M item created: ${item.id}`);
          recordActivity(root, {
            source: "cli",
            action: "nist_poam",
            title: `POA&M item created: ${title}`,
            description: `POA&M item ${item.id} for control ${controlId}.`,
            details: { poam_id: item.id, control_id: controlId },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
          if (options.json) console.log(JSON.stringify(item, null, 2));
          return;
        }
        if (action === "status") {
          if (!id) {
            error("Usage: ges nist poam status <id> --status <status>");
            process.exit(1);
          }
          const status = pick(options.status, POAM_STATUSES, "status");
          if (!status) {
            error(`--status required. Allowed: ${POAM_STATUSES.join(", ")}`);
            process.exit(1);
          }
          const item = setNistPoamStatus(root, id, status);
          if (!item) {
            error(`POA&M item ${id} not found.`);
            process.exit(1);
          }
          if (status === "completed") {
            item.actual_completion_date = new Date().toISOString().slice(0, 10);
          }
          success(`POA&M ${id} status: ${status}`);
          recordActivity(root, {
            source: "cli",
            action: "nist_poam",
            title: `POA&M status updated: ${id}`,
            description: `POA&M item ${id} moved to "${status}".`,
            details: { poam_id: id, status },
            actor_name: options.actor,
            actor_role: options.actorRole,
          });
          return;
        }
        if (action === "milestone") {
          if (!id) {
            error("Usage: ges nist poam milestone <poamId> --milestone-title <title> --due <date>");
            process.exit(1);
          }
          const title = options.milestoneTitle ?? (await input({ message: "Milestone title:", default: "" }));
          const due = options.due ?? (await input({ message: "Due date (YYYY-MM-DD):", default: "" }));
          const item = addNistPoamMilestone(root, id, title, due);
          if (!item) {
            error(`POA&M item ${id} not found.`);
            process.exit(1);
          }
          success(`Milestone added to ${id}.`);
          return;
        }
        if (action === "complete-milestone") {
          if (!id || !options.milestoneId) {
            error("Usage: ges nist poam complete-milestone <poamId> --milestone-id <milestoneId>");
            process.exit(1);
          }
          const item = completeNistPoamMilestone(root, id, options.milestoneId);
          if (!item) {
            error(`POA&M item or milestone not found.`);
            process.exit(1);
          }
          success(`Milestone ${options.milestoneId} completed.`);
          return;
        }
        error(`Unknown POA&M action "${action}". Use list | add | status | milestone | complete-milestone.`);
        process.exit(1);
      }),
  )
  .addCommand(
    new Command("workflow")
      .description("Show or transition the assessment lifecycle state")
      .argument("[state]", "Target workflow state (for transition)")
      .option("--scope <scope>", "Set the assessment scope")
      .option("--notes <notes>", "Transition notes")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .option("--json", "Machine-readable output")
      .action(async (state: string | undefined, options) => {
        const root = ensureGESInitialized();
        const campaign = ensureNistWorkflow(root, getProjectId(root));
        if (options.scope) {
          setNistWorkflowScope(root, options.scope);
          success(`Assessment scope set.`);
        }
        if (!state) {
          if (options.json) {
            console.log(JSON.stringify(campaign, null, 2));
            return;
          }
          banner("NIST Assessment Workflow");
          kv("Campaign", campaign.id, 4);
          kv("State", campaign.state, 4);
          kv("Scope", campaign.scope || "not set", 4);
          kv("Allowed transitions", allowedTransitionsFrom(campaign.state).join(", ") || "none (closed)", 4);
          if (campaign.transitions.length > 0) {
            blank();
            info("Transition history");
            for (const transition of campaign.transitions) {
              item(transition.timestamp, `${transition.from} -> ${transition.to}${transition.actor ? ` (${transition.actor})` : ""}`);
            }
          }
          return;
        }
        const target = pick(state, ["draft", "in-progress", "ready-for-assessment", "under-assessment", "assessment-completed", "remediation-required", "closed"] as const, "state") as NistWorkflowState;
        if (!target) disallowStatusOption();
        const result = transitionNistWorkflow(root, target, { actor: options.actor, notes: options.notes });
        if (!result.campaign || result.error) {
          error(result.error ?? "Transition failed.");
          process.exit(1);
        }
        success(`Workflow state: ${result.campaign.state}`);
        recordActivity(root, {
          source: "cli",
          action: "nist_workflow",
          title: `NIST assessment workflow: ${target}`,
          description: `Assessment campaign ${result.campaign.id} transitioned to "${target}".`,
          details: { campaign_id: result.campaign.id, state: target },
          actor_name: options.actor,
          actor_role: options.actorRole,
        });
        if (options.json) console.log(JSON.stringify(result.campaign, null, 2));
      }),
  )
  .addCommand(
    new Command("status")
      .description("Assessment summary: baseline, determinations, findings, POA&M")
      .option("--json", "Machine-readable output")
      .action(async (options) => {
        const root = ensureGESInitialized();
        const summary = summarizeNistAssessment(root);
        const workflow = loadNistWorkflow(root);
        if (options.json) {
          console.log(JSON.stringify({ summary, workflow }, null, 2));
          return;
        }
        banner("NIST SP 800-53 Assessment Status");
        kv("Baseline", summary.baseline_label ?? "none selected", 4);
        kv("Workflow state", workflow?.state ?? "not started", 4);
        blank();
        kv("Applicable controls", String(summary.applicable_controls), 4);
        kv("Assessed", `${summary.assessed} of ${summary.applicable_controls}`, 4);
        kv("Satisfied", String(summary.satisfied), 4);
        kv("Other than satisfied", String(summary.other_than_satisfied), 4);
        kv("Not assessed", String(summary.not_assessed), 4);
        kv("Not applicable", String(summary.not_applicable), 4);
        kv("Awaiting evidence", String(summary.awaiting_evidence), 4);
        kv("Open findings", String(summary.open_findings), 4);
        kv("Open POA&M items", String(summary.open_poam), 4);
        kv("Overdue POA&M items", String(summary.overdue_poam), 4);
        blank();
        if (summary.applicable_controls === 0) {
          warn("No baseline selected. Start with: ges nist baseline set moderate");
        }
        info("NIST-aligned tooling: results are organization-recorded assessments, not NIST certification or accreditation.");
      }),
  )
  .addCommand(
    new Command("report")
      .description("Generate the NIST SP 800-53 assessment report")
      .option("-f, --format <format>", "Report format: markdown | html | pdf | json", "markdown")
      .option("-o, --output <file>", "Output file path (default: reports/nist-assessment-report.<ext>)")
      .option("--assessor <name>", "Assessor name for the report")
      .option("--period-from <date>", "Assessment period start (YYYY-MM-DD)")
      .option("--period-to <date>", "Assessment period end (YYYY-MM-DD)")
      .option("--actor <name>", "Name of person performing this action")
      .option("--actor-role <role>", "Role of person performing this action")
      .action(async (options) => {
        const root = ensureGESInitialized();
        const format = pick(options.format, ["markdown", "html", "pdf", "json"] as const, "format");
        if (!format) process.exit(1);
        const summary = summarizeNistAssessment(root);
        const workflow = loadNistWorkflow(root);
        const config = loadConfig(root);
        const input = {
          system_name: config?.project_name ?? path.basename(root),
          scope: workflow?.scope ?? "",
          baseline_label: summary.baseline_label,
          catalog_version: getCatalogMetadata().oscal_version,
          ...(options.periodFrom || options.periodTo
            ? { assessment_period: { ...(options.periodFrom ? { from: options.periodFrom } : {}), ...(options.periodTo ? { to: options.periodTo } : {}) } }
            : {}),
          ...(options.assessor ? { assessor: options.assessor } : {}),
          generated_at: new Date().toISOString(),
          summary,
          workflow_state: workflow?.state ?? null,
          controls: buildReportRows(root),
          evidence: loadNistEvidence(root),
          findings: loadNistFindings(root),
          poam: loadNistPoam(root),
        };
        const extensions: Record<string, string> = { markdown: "md", html: "html", pdf: "pdf", json: "json" };
        const defaultPath = path.join(root, "reports", `nist-assessment-report.${extensions[format]}`);
        const outPath = options.output ? path.resolve(root, options.output) : defaultPath;
        const content =
          format === "markdown"
            ? generateNistAssessmentMarkdownReport(input)
            : format === "html"
              ? generateNistAssessmentHtmlReport(input)
              : format === "pdf"
                ? generateNistAssessmentPdfReport(input)
                : buildNistAssessmentJsonReport(input);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, content, format === "pdf" ? { encoding: "binary" } : "utf-8");
        success(`NIST assessment report written: ${path.relative(process.cwd(), outPath)}`);
        info("The report reflects recorded assessment data. It is not a certification of compliance.");
        recordActivity(root, {
          source: "cli",
          action: "generate",
          title: `NIST assessment report generated (${format})`,
          description: `NIST SP 800-53 assessment report generated in ${format} format.`,
          details: { format, output: outPath },
          actor_name: options.actor,
          actor_role: options.actorRole,
        });
      }),
  );
