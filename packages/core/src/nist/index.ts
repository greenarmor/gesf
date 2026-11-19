/**
 * NIST SP 800-53 assessment lifecycle storage and business rules.
 *
 * All data is persisted under `<projectPath>/.ges/` using atomic writes
 * (safeWriteJson). Business rules enforce NIST SP 800-53A semantics:
 * implementation status and assessment determination are independent, and a
 * "satisfied" determination requires an authorized assessor, at least one
 * assessment method, and a documented rationale.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import type {
  NistAssessmentCampaign,
  NistAssessmentDetermination,
  NistAssessmentMethodKind,
  NistAssessmentRecord,
  NistBaselineKind,
  NistBaselineSelection,
  NistControlOwner,
  NistEvidenceItem,
  NistEvidenceKind,
  NistEvidenceReviewStatus,
  NistFinding,
  NistImplementationStatus,
  NistPoamItem,
  NistPoamMilestone,
  NistPoamStatus,
  NistRiskMatrix,
  NistRiskRating,
  NistWorkflowState,
  NistWorkflowTransition,
} from "../types/index.js";
import { safeWriteJson } from "../utils/index.js";

const BASELINE_FILE = "nist-baseline.json";
const ASSESSMENTS_FILE = "nist-assessments.json";
const EVIDENCE_FILE = "nist-evidence.json";
const FINDINGS_FILE = "nist-findings.json";
const POAM_FILE = "nist-poam.json";
const WORKFLOW_FILE = "nist-assessment-workflow.json";
const OWNERS_FILE = "nist-control-owners.json";
const RISK_MATRIX_FILE = "nist-risk-matrix.json";

function readJsonArray<T>(projectPath: string, file: string): T[] {
  try {
    const raw = fs.readFileSync(path.join(projectPath, ".ges", file), "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

function writeJsonArray<T>(projectPath: string, file: string, data: T[]): void {
  safeWriteJson(path.join(projectPath, ".ges", file), data);
}

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------
let counter = 0;

function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function generateNistId(prefix: string): string {
  return nextId(prefix);
}

// ---------------------------------------------------------------------------
// Baseline selection (Phase 3)
// ---------------------------------------------------------------------------

export interface SetBaselineInput {
  kind: NistBaselineKind;
  label: string;
  control_ids: string[];
  derived_from?: "low" | "moderate" | "high";
  catalog_version: string;
  selected_by?: string;
  /** Carry over exclusions/inherited/compensating decisions that still apply. */
  exclusions?: NistBaselineSelection["exclusions"];
  inherited?: NistBaselineSelection["inherited"];
  compensating?: NistBaselineSelection["compensating"];
}

export function loadNistBaselineSelection(projectPath: string): NistBaselineSelection | null {
  try {
    const raw = fs.readFileSync(path.join(projectPath, ".ges", BASELINE_FILE), "utf-8");
    return JSON.parse(raw) as NistBaselineSelection;
  } catch {
    return null;
  }
}

function carryOver<T extends { control_id: string }>(entries: T[] | undefined, controlIds: Set<string>): T[] {
  return (entries ?? []).filter((entry) => controlIds.has(entry.control_id));
}

/**
 * Selects a baseline. Never silently discards data: the previous selection is
 * preserved in `previous_selections`, and tailoring decisions (exclusions,
 * inherited, compensating) that still apply are carried over. Setting a
 * baseline never marks controls implemented or assessed.
 */
export function setNistBaselineSelection(projectPath: string, input: SetBaselineInput): NistBaselineSelection {
  const previous = loadNistBaselineSelection(projectPath);
  const controlIdSet = new Set(input.control_ids);
  const selection: NistBaselineSelection = {
    kind: input.kind,
    label: input.label,
    ...(input.derived_from ? { derived_from: input.derived_from } : {}),
    control_ids: [...input.control_ids],
    exclusions: carryOver(
      input.exclusions ?? previous?.exclusions,
      controlIdSet,
    ),
    inherited: carryOver(input.inherited ?? previous?.inherited, controlIdSet),
    compensating: carryOver(
      input.compensating ?? previous?.compensating,
      controlIdSet,
    ),
    catalog_version: input.catalog_version,
    selected_at: new Date().toISOString(),
    ...(input.selected_by ? { selected_by: input.selected_by } : {}),
    previous_selections: previous ? [previous, ...previous.previous_selections].slice(0, 20) : [],
  };
  safeWriteJson(path.join(projectPath, ".ges", BASELINE_FILE), selection);
  return selection;
}

export function addBaselineExclusion(
  projectPath: string,
  controlId: string,
  justification: string,
): NistBaselineSelection | null {
  const selection = loadNistBaselineSelection(projectPath);
  if (!selection) return null;
  const existing = selection.exclusions.filter((e) => e.control_id !== controlId);
  selection.exclusions = [...existing, { control_id: controlId, justification }];
  safeWriteJson(path.join(projectPath, ".ges", BASELINE_FILE), selection);
  return selection;
}

export function addBaselineInheritance(
  projectPath: string,
  controlId: string,
  fromSystem: string,
  description: string,
): NistBaselineSelection | null {
  const selection = loadNistBaselineSelection(projectPath);
  if (!selection) return null;
  const existing = selection.inherited.filter((e) => e.control_id !== controlId);
  selection.inherited = [...existing, { control_id: controlId, from_system: fromSystem, description }];
  safeWriteJson(path.join(projectPath, ".ges", BASELINE_FILE), selection);
  return selection;
}

export function addBaselineCompensating(
  projectPath: string,
  controlId: string,
  alternativeImplementation: string,
  description: string,
): NistBaselineSelection | null {
  const selection = loadNistBaselineSelection(projectPath);
  if (!selection) return null;
  const existing = selection.compensating.filter((e) => e.control_id !== controlId);
  selection.compensating = [
    ...existing,
    { control_id: controlId, alternative_implementation: alternativeImplementation, description },
  ];
  safeWriteJson(path.join(projectPath, ".ges", BASELINE_FILE), selection);
  return selection;
}

// ---------------------------------------------------------------------------
// Control ownership (Phase 6, step 3)
// ---------------------------------------------------------------------------

export function loadNistControlOwners(projectPath: string): NistControlOwner[] {
  return readJsonArray<NistControlOwner>(projectPath, OWNERS_FILE);
}

export function setNistControlOwner(
  projectPath: string,
  controlId: string,
  owner: string,
  department?: string,
  assignedBy?: string,
): NistControlOwner {
  const owners = loadNistControlOwners(projectPath).filter((o) => o.control_id !== controlId);
  const entry: NistControlOwner = {
    control_id: controlId,
    owner,
    ...(department ? { department } : {}),
    assigned_at: new Date().toISOString(),
    ...(assignedBy ? { assigned_by: assignedBy } : {}),
  };
  writeJsonArray(projectPath, OWNERS_FILE, [...owners, entry]);
  return entry;
}

// ---------------------------------------------------------------------------
// Assessment records (Phase 4)
// ---------------------------------------------------------------------------

export const IMPLEMENTATION_STATUSES: NistImplementationStatus[] = [
  "not-implemented",
  "planned",
  "partially-implemented",
  "implemented",
  "alternative-implementation",
  "inherited",
  "not-applicable",
];

export const ASSESSMENT_DETERMINATIONS: NistAssessmentDetermination[] = [
  "not-assessed",
  "satisfied",
  "other-than-satisfied",
  "not-applicable",
];

export const ASSESSMENT_METHODS: NistAssessmentMethodKind[] = ["examine", "interview", "test"];

export function loadNistAssessments(projectPath: string): NistAssessmentRecord[] {
  return readJsonArray<NistAssessmentRecord>(projectPath, ASSESSMENTS_FILE);
}

export function getNistAssessment(projectPath: string, id: string): NistAssessmentRecord | undefined {
  return loadNistAssessments(projectPath).find((a) => a.id === id);
}

export function getLatestNistAssessmentForControl(
  projectPath: string,
  controlId: string,
): NistAssessmentRecord | undefined {
  const records = loadNistAssessments(projectPath).filter((a) => a.control_id === controlId);
  if (records.length === 0) return undefined;
  return records.reduce((latest, record) =>
    record.assessment_date > latest.assessment_date ? record : latest,
  );
}

export interface CreateAssessmentInput {
  project_id: string;
  control_id: string;
  control_enhancement_id?: string;
  scope: string;
  implementation_status: NistImplementationStatus;
  assessment_objective: string;
  assessor: string;
  control_owner: string;
  assessment_date?: string;
  methods?: NistAssessmentMethodKind[];
  notes?: string;
  inherited_from?: string;
  parameters?: Record<string, string>;
}

export function createNistAssessment(
  projectPath: string,
  input: CreateAssessmentInput,
): NistAssessmentRecord {
  const now = new Date().toISOString();
  const record: NistAssessmentRecord = {
    id: nextId("nist-assess"),
    project_id: input.project_id,
    control_id: input.control_id,
    ...(input.control_enhancement_id ? { control_enhancement_id: input.control_enhancement_id } : {}),
    scope: input.scope,
    implementation_status: input.implementation_status,
    determination: "not-assessed",
    methods: input.methods ?? [],
    assessment_objective: input.assessment_objective,
    objectives: [],
    assessor: input.assessor,
    control_owner: input.control_owner,
    assessment_date: input.assessment_date ?? now.slice(0, 10),
    ...(input.notes ? { notes: input.notes } : {}),
    deficiencies: [],
    evidence_ids: [],
    finding_ids: [],
    poam_ids: [],
    ...(input.inherited_from ? { inherited_from: input.inherited_from } : {}),
    ...(input.parameters ? { parameters: input.parameters } : {}),
    created_at: now,
    updated_at: now,
    history: [
      { timestamp: now, action: "created", to: "not-assessed" },
    ],
  };
  const assessments = loadNistAssessments(projectPath);
  writeJsonArray(projectPath, ASSESSMENTS_FILE, [...assessments, record]);
  return record;
}

export function updateNistAssessment(
  projectPath: string,
  id: string,
  updates: Partial<NistAssessmentRecord>,
  updatedBy?: string,
): NistAssessmentRecord | null {
  const assessments = loadNistAssessments(projectPath);
  const index = assessments.findIndex((a) => a.id === id);
  if (index === -1) return null;
  // Determination changes must go through recordNistDetermination.
  const { determination: _excluded, history: _history, ...safeUpdates } = updates;
  const current = assessments[index];
  const updated: NistAssessmentRecord = {
    ...current,
    ...safeUpdates,
    updated_at: new Date().toISOString(),
    ...(updatedBy ? { updated_by: updatedBy } : {}),
  };
  assessments[index] = updated;
  writeJsonArray(projectPath, ASSESSMENTS_FILE, assessments);
  return updated;
}

export interface RecordDeterminationInput {
  determination: NistAssessmentDetermination;
  rationale: string;
  methods: NistAssessmentMethodKind[];
  assessor?: string;
  actor?: string;
  objective_results?: Array<{ objective_id: string; determination: NistAssessmentDetermination; notes?: string }>;
}

/**
 * Records an authorized assessment determination.
 *
 * A "satisfied" determination requires:
 *  - a non-empty rationale,
 *  - at least one assessment method (SP 800-53A),
 *  - an implementation status that supports the claim (not "not-implemented"/"planned").
 * Changing the implementation status alone can never set a determination.
 */
export function recordNistDetermination(
  projectPath: string,
  assessmentId: string,
  input: RecordDeterminationInput,
): { record: NistAssessmentRecord | null; error?: string } {
  if (!input.rationale || input.rationale.trim().length === 0) {
    return { record: null, error: "A documented rationale is required for every determination." };
  }
  if (!Array.isArray(input.methods) || input.methods.length === 0) {
    return { record: null, error: "At least one assessment method (examine, interview, test) is required." };
  }
  if (input.determination === "satisfied") {
    const blocking: NistImplementationStatus[] = ["not-implemented", "planned"];
    const assessments = loadNistAssessments(projectPath);
    const record = assessments.find((a) => a.id === assessmentId);
    if (!record) {
      return { record: null, error: `Assessment ${assessmentId} not found.` };
    }
    if (blocking.includes(record.implementation_status)) {
      return {
        record: null,
        error: `Cannot record "satisfied": implementation status is "${record.implementation_status}". A determination of satisfied requires an implemented, alternative, inherited, or at least partially implemented control.`,
      };
    }
  }
  const assessments = loadNistAssessments(projectPath);
  const index = assessments.findIndex((a) => a.id === assessmentId);
  if (index === -1) {
    return { record: null, error: `Assessment ${assessmentId} not found.` };
  }
  const current = assessments[index];
  const now = new Date().toISOString();
  const historyEntry = {
    timestamp: now,
    ...(input.actor ? { actor: input.actor } : {}),
    action: "determination",
    from: current.determination,
    to: input.determination,
    reason: input.rationale,
  };
  const updated: NistAssessmentRecord = {
    ...current,
    determination: input.determination,
    methods: [...new Set([...current.methods, ...input.methods])],
    ...(input.assessor ? { assessor: input.assessor } : {}),
    objectives: input.objective_results ?? current.objectives,
    last_reviewed_date: now.slice(0, 10),
    updated_at: now,
    history: [...current.history, historyEntry],
  };
  assessments[index] = updated;
  writeJsonArray(projectPath, ASSESSMENTS_FILE, assessments);
  return { record: updated };
}

export function addNistDeficiency(
  projectPath: string,
  assessmentId: string,
  description: string,
  objectiveIds: string[] = [],
): NistAssessmentRecord | null {
  const assessments = loadNistAssessments(projectPath);
  const index = assessments.findIndex((a) => a.id === assessmentId);
  if (index === -1) return null;
  const current = assessments[index];
  const deficiency = {
    id: nextId("nist-def"),
    description,
    ...(objectiveIds.length > 0 ? { objective_ids: objectiveIds } : {}),
  };
  const updated: NistAssessmentRecord = {
    ...current,
    deficiencies: [...current.deficiencies, deficiency],
    updated_at: new Date().toISOString(),
  };
  assessments[index] = updated;
  writeJsonArray(projectPath, ASSESSMENTS_FILE, assessments);
  return updated;
}

// ---------------------------------------------------------------------------
// Evidence management (Phase 5)
// ---------------------------------------------------------------------------

export const EVIDENCE_KINDS: NistEvidenceKind[] = [
  "policy",
  "procedure",
  "configuration",
  "screenshot",
  "audit-log",
  "system-report",
  "vulnerability-report",
  "penetration-test",
  "interview-record",
  "test-result",
  "certificate",
  "contract",
  "other",
];

export function loadNistEvidence(projectPath: string): NistEvidenceItem[] {
  return readJsonArray<NistEvidenceItem>(projectPath, EVIDENCE_FILE);
}

export function getNistEvidence(projectPath: string, id: string): NistEvidenceItem | undefined {
  return loadNistEvidence(projectPath).find((e) => e.id === id);
}

/**
 * Validates an evidence reference. Local file references must resolve inside
 * the project directory (path traversal is rejected). URL references must use
 * http(s). Evidence files are never executed by GESF.
 */
export function validateEvidenceReference(
  projectPath: string,
  reference: { file_reference?: string; url?: string },
): { valid: boolean; error?: string } {
  const hasFile = typeof reference.file_reference === "string" && reference.file_reference.length > 0;
  const hasUrl = typeof reference.url === "string" && reference.url.length > 0;
  if (!hasFile && !hasUrl) {
    return { valid: false, error: "Evidence needs a file reference or a URL." };
  }
  if (hasUrl) {
    try {
      const parsed = new URL(reference.url as string);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { valid: false, error: "Only http(s) URLs are supported." };
      }
    } catch {
      return { valid: false, error: "Invalid URL." };
    }
  }
  if (hasFile) {
    const fileRef = reference.file_reference as string;
    if (path.isAbsolute(fileRef)) {
      return { valid: false, error: "File references must be relative to the project directory." };
    }
    const resolvedRoot = path.resolve(projectPath);
    const resolvedRef = path.resolve(resolvedRoot, fileRef);
    if (resolvedRef !== resolvedRoot && !resolvedRef.startsWith(resolvedRoot + path.sep)) {
      return { valid: false, error: "File reference escapes the project directory." };
    }
  }
  return { valid: true };
}

export interface AddEvidenceInput {
  title: string;
  description: string;
  evidence_type: NistEvidenceKind;
  control_ids: string[];
  assessment_ids?: string[];
  source_system: string;
  file_reference?: string;
  url?: string;
  collected_at?: string;
  collection_method: string;
  collected_by: string;
  owner: string;
  classification: NistEvidenceItem["classification"];
  retention?: string;
  expires_at?: string;
  sha256?: string;
}

export function addNistEvidence(
  projectPath: string,
  input: AddEvidenceInput,
): { evidence: NistEvidenceItem | null; error?: string } {
  const referenceCheck = validateEvidenceReference(projectPath, input);
  if (!referenceCheck.valid) {
    return { evidence: null, error: referenceCheck.error };
  }
  const now = new Date().toISOString();
  const evidence: NistEvidenceItem = {
    id: nextId("nist-evid"),
    title: input.title,
    description: input.description,
    evidence_type: input.evidence_type,
    control_ids: input.control_ids,
    assessment_ids: input.assessment_ids ?? [],
    source_system: input.source_system,
    ...(input.file_reference ? { file_reference: input.file_reference } : {}),
    ...(input.url ? { url: input.url } : {}),
    collected_at: input.collected_at ?? now.slice(0, 10),
    collection_method: input.collection_method,
    collected_by: input.collected_by,
    owner: input.owner,
    review_status: "pending-review",
    classification: input.classification,
    ...(input.retention ? { retention: input.retention } : {}),
    ...(input.expires_at ? { expires_at: input.expires_at } : {}),
    ...(input.sha256 ? { sha256: input.sha256 } : {}),
    created_at: now,
    updated_at: now,
  };
  const items = loadNistEvidence(projectPath);
  writeJsonArray(projectPath, EVIDENCE_FILE, [...items, evidence]);
  return { evidence };
}

export function reviewNistEvidence(
  projectPath: string,
  id: string,
  status: NistEvidenceReviewStatus,
  reviewedBy: string,
): NistEvidenceItem | null {
  const items = loadNistEvidence(projectPath);
  const index = items.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const now = new Date().toISOString();
  items[index] = {
    ...items[index],
    review_status: status,
    reviewed_by: reviewedBy,
    reviewed_at: now,
    updated_at: now,
  };
  writeJsonArray(projectPath, EVIDENCE_FILE, items);
  return items[index];
}

/**
 * Evidence deletion is guarded: approved evidence requires an explicit
 * authorization flag so it cannot be removed by accident or silently.
 */
export function deleteNistEvidence(
  projectPath: string,
  id: string,
  options: { authorized_by: string; force?: boolean },
): { deleted: boolean; error?: string } {
  const items = loadNistEvidence(projectPath);
  const index = items.findIndex((e) => e.id === id);
  if (index === -1) {
    return { deleted: false, error: `Evidence ${id} not found.` };
  }
  const item = items[index];
  if (item.review_status === "approved" && !options.force) {
    return {
      deleted: false,
      error: `Evidence ${id} is approved. Deletion requires explicit authorization (force) with an authorized_by record.`,
    };
  }
  items.splice(index, 1);
  writeJsonArray(projectPath, EVIDENCE_FILE, items);
  return { deleted: true };
}

export function linkEvidenceToControl(
  projectPath: string,
  evidenceId: string,
  controlId: string,
): NistEvidenceItem | null {
  const items = loadNistEvidence(projectPath);
  const index = items.findIndex((e) => e.id === evidenceId);
  if (index === -1) return null;
  if (!items[index].control_ids.includes(controlId)) {
    items[index] = {
      ...items[index],
      control_ids: [...items[index].control_ids, controlId],
      updated_at: new Date().toISOString(),
    };
    writeJsonArray(projectPath, EVIDENCE_FILE, items);
  }
  return items[index];
}

/** Evidence existence for a control. Sufficiency is an assessor judgment, not a file count. */
export function hasEvidenceForControl(projectPath: string, controlId: string): boolean {
  return loadNistEvidence(projectPath).some((e) => e.control_ids.includes(controlId));
}

export function getExpiringNistEvidence(
  projectPath: string,
  withinDays = 30,
  today = new Date(),
): NistEvidenceItem[] {
  const cutoff = today.getTime() + withinDays * 24 * 60 * 60 * 1000;
  return loadNistEvidence(projectPath).filter((e) => {
    if (!e.expires_at) return false;
    const expiry = Date.parse(e.expires_at);
    return !Number.isNaN(expiry) && expiry <= cutoff;
  });
}

/** Computes a SHA-256 integrity digest. This verifies integrity against a known digest only; it is not proof of authenticity. */
export function computeSha256(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(content).digest("hex");
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Findings (Phase 7)
// ---------------------------------------------------------------------------

export function loadNistFindings(projectPath: string): NistFinding[] {
  return readJsonArray<NistFinding>(projectPath, FINDINGS_FILE);
}

export function addNistFinding(
  projectPath: string,
  input: {
    control_id: string;
    assessment_id?: string;
    title: string;
    description: string;
    severity: NistFinding["severity"];
    related_scanner_finding_key?: string;
    evidence_ids?: string[];
  },
): NistFinding {
  const now = new Date().toISOString();
  const finding: NistFinding = {
    id: nextId("nist-find"),
    control_id: input.control_id,
    ...(input.assessment_id ? { assessment_id: input.assessment_id } : {}),
    title: input.title,
    description: input.description,
    severity: input.severity,
    ...(input.related_scanner_finding_key
      ? { related_scanner_finding_key: input.related_scanner_finding_key }
      : {}),
    evidence_ids: input.evidence_ids ?? [],
    status: "open",
    created_at: now,
    updated_at: now,
  };
  const findings = loadNistFindings(projectPath);
  writeJsonArray(projectPath, FINDINGS_FILE, [...findings, finding]);

  if (input.assessment_id) {
    const assessments = loadNistAssessments(projectPath);
    const index = assessments.findIndex((a) => a.id === input.assessment_id);
    if (index !== -1 && !assessments[index].finding_ids.includes(finding.id)) {
      assessments[index] = {
        ...assessments[index],
        finding_ids: [...assessments[index].finding_ids, finding.id],
        updated_at: now,
      };
      writeJsonArray(projectPath, ASSESSMENTS_FILE, assessments);
    }
  }
  return finding;
}

/**
 * Closes a finding only after a recorded assessment verifies the correction
 * (determination satisfied or not-applicable). Fixing a scanner finding never
 * auto-resolves a NIST control deficiency.
 */
export function closeNistFinding(
  projectPath: string,
  findingId: string,
  verificationAssessmentId: string,
): { finding: NistFinding | null; error?: string } {
  const findings = loadNistFindings(projectPath);
  const index = findings.findIndex((f) => f.id === findingId);
  if (index === -1) {
    return { finding: null, error: `Finding ${findingId} not found.` };
  }
  const verification = getNistAssessment(projectPath, verificationAssessmentId);
  if (!verification) {
    return { finding: null, error: `Verification assessment ${verificationAssessmentId} not found.` };
  }
  if (verification.determination !== "satisfied" && verification.determination !== "not-applicable") {
    return {
      finding: null,
      error: `Verification assessment must have determination "satisfied" or "not-applicable" (current: "${verification.determination}").`,
    };
  }
  if (verification.control_id !== findings[index].control_id) {
    return {
      finding: null,
      error: `Verification assessment covers control ${verification.control_id}, but the finding is for ${findings[index].control_id}.`,
    };
  }
  const now = new Date().toISOString();
  findings[index] = {
    ...findings[index],
    status: "resolved",
    resolution_assessment_id: verificationAssessmentId,
    updated_at: now,
  };
  writeJsonArray(projectPath, FINDINGS_FILE, findings);
  return { finding: findings[index] };
}

// ---------------------------------------------------------------------------
// POA&M (Phase 7)
// ---------------------------------------------------------------------------

export const POAM_STATUSES: NistPoamStatus[] = [
  "open",
  "assigned",
  "in-progress",
  "pending-verification",
  "completed",
  "accepted-risk",
  "closed",
];

export function loadNistPoam(projectPath: string): NistPoamItem[] {
  return readJsonArray<NistPoamItem>(projectPath, POAM_FILE);
}

export function getNistPoamItem(projectPath: string, id: string): NistPoamItem | undefined {
  return loadNistPoam(projectPath).find((p) => p.id === id);
}

export interface AddPoamInput {
  control_id: string;
  assessment_id?: string;
  finding_id?: string;
  title: string;
  description: string;
  root_cause?: string;
  security_impact?: string;
  likelihood?: string;
  risk_level?: NistPoamItem["risk_level"];
  remediation_strategy: string;
  corrective_actions?: string[];
  owner: string;
  department?: string;
  planned_start_date?: string;
  target_completion_date?: string;
  milestones?: Array<{ title: string; due_date: string }>;
}

export function addNistPoamItem(projectPath: string, input: AddPoamInput): NistPoamItem {
  const now = new Date().toISOString();
  const item: NistPoamItem = {
    id: nextId("nist-poam"),
    control_id: input.control_id,
    ...(input.assessment_id ? { assessment_id: input.assessment_id } : {}),
    ...(input.finding_id ? { finding_id: input.finding_id } : {}),
    title: input.title,
    description: input.description,
    ...(input.root_cause ? { root_cause: input.root_cause } : {}),
    ...(input.security_impact ? { security_impact: input.security_impact } : {}),
    ...(input.likelihood ? { likelihood: input.likelihood } : {}),
    ...(input.risk_level ? { risk_level: input.risk_level } : {}),
    remediation_strategy: input.remediation_strategy,
    corrective_actions: input.corrective_actions ?? [],
    owner: input.owner,
    ...(input.department ? { department: input.department } : {}),
    ...(input.planned_start_date ? { planned_start_date: input.planned_start_date } : {}),
    ...(input.target_completion_date ? { target_completion_date: input.target_completion_date } : {}),
    milestones: (input.milestones ?? []).map((m) => ({
      id: nextId("nist-mile"),
      title: m.title,
      due_date: m.due_date,
      status: "planned" as const,
    })),
    status: "open",
    closure_evidence_ids: [],
    created_at: now,
    updated_at: now,
  };
  const items = loadNistPoam(projectPath);
  writeJsonArray(projectPath, POAM_FILE, [...items, item]);
  return item;
}

export function updateNistPoamItem(
  projectPath: string,
  id: string,
  updates: Partial<NistPoamItem>,
): NistPoamItem | null {
  const items = loadNistPoam(projectPath);
  const index = items.findIndex((p) => p.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
  writeJsonArray(projectPath, POAM_FILE, items);
  return items[index];
}

export function setNistPoamStatus(
  projectPath: string,
  id: string,
  status: NistPoamStatus,
): NistPoamItem | null {
  return updateNistPoamItem(projectPath, id, { status });
}

export function addNistPoamMilestone(
  projectPath: string,
  poamId: string,
  title: string,
  dueDate: string,
): NistPoamItem | null {
  const items = loadNistPoam(projectPath);
  const index = items.findIndex((p) => p.id === poamId);
  if (index === -1) return null;
  const milestone: NistPoamMilestone = {
    id: nextId("nist-mile"),
    title,
    due_date: dueDate,
    status: "planned",
  };
  items[index] = {
    ...items[index],
    milestones: [...items[index].milestones, milestone],
    updated_at: new Date().toISOString(),
  };
  writeJsonArray(projectPath, POAM_FILE, items);
  return items[index];
}

export function completeNistPoamMilestone(
  projectPath: string,
  poamId: string,
  milestoneId: string,
): NistPoamItem | null {
  const items = loadNistPoam(projectPath);
  const index = items.findIndex((p) => p.id === poamId);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    milestones: items[index].milestones.map((m) =>
      m.id === milestoneId
        ? { ...m, status: "completed" as const, completed_date: new Date().toISOString().slice(0, 10) }
        : m,
    ),
    updated_at: new Date().toISOString(),
  };
  writeJsonArray(projectPath, POAM_FILE, items);
  return items[index];
}

export interface OverduePoamResult {
  item: NistPoamItem;
  overdue_milestones: NistPoamMilestone[];
  target_overdue: boolean;
}

export function getOverdueNistPoam(
  projectPath: string,
  today = new Date().toISOString().slice(0, 10),
): OverduePoamResult[] {
  const activeStatuses: NistPoamStatus[] = ["open", "assigned", "in-progress", "pending-verification"];
  const results: OverduePoamResult[] = [];
  for (const item of loadNistPoam(projectPath)) {
    if (!activeStatuses.includes(item.status)) continue;
    const overdueMilestones = item.milestones.filter(
      (m) => (m.status === "planned" || m.status === "in-progress") && m.due_date < today,
    );
    const targetOverdue =
      Boolean(item.target_completion_date) && (item.target_completion_date as string) < today;
    if (overdueMilestones.length > 0 || targetOverdue) {
      results.push({ item, overdue_milestones: overdueMilestones, target_overdue: targetOverdue });
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Assessment workflow (Phase 6)
// ---------------------------------------------------------------------------

const ALLOWED_TRANSITIONS: Record<NistWorkflowState, NistWorkflowState[]> = {
  draft: ["in-progress"],
  "in-progress": ["ready-for-assessment"],
  "ready-for-assessment": ["under-assessment"],
  "under-assessment": ["assessment-completed"],
  "assessment-completed": ["remediation-required", "closed"],
  "remediation-required": ["under-assessment", "closed"],
  closed: [],
};

export function loadNistWorkflow(projectPath: string): NistAssessmentCampaign | null {
  try {
    const raw = fs.readFileSync(path.join(projectPath, ".ges", WORKFLOW_FILE), "utf-8");
    return JSON.parse(raw) as NistAssessmentCampaign;
  } catch {
    return null;
  }
}

export function ensureNistWorkflow(projectPath: string, projectId: string): NistAssessmentCampaign {
  const existing = loadNistWorkflow(projectPath);
  if (existing) return existing;
  const now = new Date().toISOString();
  const campaign: NistAssessmentCampaign = {
    id: nextId("nist-camp"),
    project_id: projectId,
    scope: "",
    state: "draft",
    transitions: [],
    created_at: now,
    updated_at: now,
  };
  safeWriteJson(path.join(projectPath, ".ges", WORKFLOW_FILE), campaign);
  return campaign;
}

export function setNistWorkflowScope(projectPath: string, scope: string): NistAssessmentCampaign | null {
  const campaign = loadNistWorkflow(projectPath);
  if (!campaign) return null;
  const updated: NistAssessmentCampaign = { ...campaign, scope, updated_at: new Date().toISOString() };
  safeWriteJson(path.join(projectPath, ".ges", WORKFLOW_FILE), updated);
  return updated;
}

export function isWorkflowTransitionAllowed(from: NistWorkflowState, to: NistWorkflowState): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionNistWorkflow(
  projectPath: string,
  to: NistWorkflowState,
  options: { actor?: string; notes?: string } = {},
): { campaign: NistAssessmentCampaign | null; error?: string } {
  const campaign = loadNistWorkflow(projectPath);
  if (!campaign) {
    return { campaign: null, error: "No assessment campaign exists. Initialize one first." };
  }
  if (campaign.state === to) {
    return { campaign, error: `Campaign is already in state "${to}".` };
  }
  if (!isWorkflowTransitionAllowed(campaign.state, to)) {
    return {
      campaign: null,
      error: `Transition "${campaign.state}" -> "${to}" is not allowed. Allowed: ${ALLOWED_TRANSITIONS[campaign.state].join(", ") || "none"}.`,
    };
  }
  const transition: NistWorkflowTransition = {
    timestamp: new Date().toISOString(),
    from: campaign.state,
    to,
    ...(options.actor ? { actor: options.actor } : {}),
    ...(options.notes ? { notes: options.notes } : {}),
  };
  const updated: NistAssessmentCampaign = {
    ...campaign,
    state: to,
    transitions: [...campaign.transitions, transition],
    updated_at: new Date().toISOString(),
  };
  safeWriteJson(path.join(projectPath, ".ges", WORKFLOW_FILE), updated);
  return { campaign: updated };
}

export function allowedTransitionsFrom(state: NistWorkflowState): NistWorkflowState[] {
  return ALLOWED_TRANSITIONS[state] ?? [];
}

// ---------------------------------------------------------------------------
// Risk assessment (Phase 8) — organizational, configurable matrix
// ---------------------------------------------------------------------------

export const DEFAULT_RISK_MATRIX: NistRiskMatrix = {
  name: "default-5x5",
  likelihood_levels: ["very-low", "low", "moderate", "high", "very-high"],
  impact_levels: ["very-low", "low", "moderate", "high", "very-high"],
  scores: [
    [1, 2, 3, 4, 5],
    [2, 4, 6, 8, 10],
    [3, 6, 9, 12, 15],
    [4, 8, 12, 16, 20],
    [5, 10, 15, 20, 25],
  ],
  rating_bands: [
    { rating: "low", max_score: 4 },
    { rating: "moderate", max_score: 9 },
    { rating: "high", max_score: 15 },
    { rating: "critical", max_score: 25 },
  ],
};

export function loadNistRiskMatrix(projectPath: string): NistRiskMatrix {
  try {
    const raw = fs.readFileSync(path.join(projectPath, ".ges", RISK_MATRIX_FILE), "utf-8");
    return JSON.parse(raw) as NistRiskMatrix;
  } catch {
    return DEFAULT_RISK_MATRIX;
  }
}

export function saveNistRiskMatrix(projectPath: string, matrix: NistRiskMatrix): void {
  safeWriteJson(path.join(projectPath, ".ges", RISK_MATRIX_FILE), matrix);
}

/**
 * Scores risk using a configurable organizational matrix. This is an
 * organizational risk decision aid, not an official NIST formula.
 */
export function scoreNistRisk(
  likelihood: string,
  impact: string,
  matrix: NistRiskMatrix = DEFAULT_RISK_MATRIX,
): { score: number; rating: NistRiskRating["rating"] } | null {
  const li = matrix.likelihood_levels.indexOf(likelihood);
  const ii = matrix.impact_levels.indexOf(impact);
  if (li === -1 || ii === -1) return null;
  const score = matrix.scores[li]?.[ii];
  if (typeof score !== "number") return null;
  const band = matrix.rating_bands.find((b) => score <= b.max_score) ?? matrix.rating_bands[matrix.rating_bands.length - 1];
  return { score, rating: band.rating };
}

export function buildNistRiskRating(
  likelihood: string,
  impact: string,
  matrix: NistRiskMatrix = DEFAULT_RISK_MATRIX,
  extras: Partial<NistRiskRating> = {},
): { rating: NistRiskRating | null; error?: string } {
  const scored = scoreNistRisk(likelihood, impact, matrix);
  if (!scored) {
    return {
      rating: null,
      error: `Unknown likelihood/impact. Likelihood: ${matrix.likelihood_levels.join(", ")}. Impact: ${matrix.impact_levels.join(", ")}.`,
    };
  }
  return {
    rating: {
      likelihood,
      impact,
      score: scored.score,
      rating: scored.rating,
      matrix_name: matrix.name,
      ...extras,
    },
  };
}

// ---------------------------------------------------------------------------
// Summary (dashboard / reports)
// ---------------------------------------------------------------------------

export interface NistAssessmentSummary {
  baseline_label: string | null;
  baseline_kind: NistBaselineKind | null;
  applicable_controls: number;
  assessed: number;
  satisfied: number;
  other_than_satisfied: number;
  not_assessed: number;
  not_applicable: number;
  awaiting_evidence: number;
  open_findings: number;
  open_poam: number;
  overdue_poam: number;
  implementation_status_counts: Record<NistImplementationStatus, number>;
  determination_counts: Record<NistAssessmentDetermination, number>;
}

export function summarizeNistAssessment(projectPath: string): NistAssessmentSummary {
  const baseline = loadNistBaselineSelection(projectPath);
  const assessments = loadNistAssessments(projectPath);
  const findings = loadNistFindings(projectPath);
  const poam = loadNistPoam(projectPath);

  const excluded = new Set(baseline?.exclusions.map((e) => e.control_id) ?? []);
  const applicable = (baseline?.control_ids ?? []).filter((id) => !excluded.has(id));

  const latestByControl = new Map<string, NistAssessmentRecord>();
  for (const record of assessments) {
    const existing = latestByControl.get(record.control_id);
    if (!existing || record.assessment_date > existing.assessment_date) {
      latestByControl.set(record.control_id, record);
    }
  }

  const determinationCounts: Record<NistAssessmentDetermination, number> = {
    "not-assessed": 0,
    satisfied: 0,
    "other-than-satisfied": 0,
    "not-applicable": 0,
  };
  const implementationCounts: Record<NistImplementationStatus, number> = {
    "not-implemented": 0,
    planned: 0,
    "partially-implemented": 0,
    implemented: 0,
    "alternative-implementation": 0,
    inherited: 0,
    "not-applicable": 0,
  };
  let awaitingEvidence = 0;

  for (const controlId of applicable) {
    const record = latestByControl.get(controlId);
    if (!record) {
      determinationCounts["not-assessed"] += 1;
      implementationCounts["not-implemented"] += 1;
      continue;
    }
    determinationCounts[record.determination] += 1;
    implementationCounts[record.implementation_status] += 1;
    if (!hasEvidenceForControl(projectPath, controlId)) {
      awaitingEvidence += 1;
    }
  }

  const assessed = applicable.filter((id) => {
    const record = latestByControl.get(id);
    return record && record.determination !== "not-assessed";
  }).length;

  return {
    baseline_label: baseline?.label ?? null,
    baseline_kind: baseline?.kind ?? null,
    applicable_controls: applicable.length,
    assessed,
    satisfied: determinationCounts.satisfied,
    other_than_satisfied: determinationCounts["other-than-satisfied"],
    not_assessed: determinationCounts["not-assessed"],
    not_applicable: determinationCounts["not-applicable"],
    awaiting_evidence: awaitingEvidence,
    open_findings: findings.filter((f) => f.status === "open").length,
    open_poam: poam.filter((p) => !["closed", "completed", "accepted-risk"].includes(p.status)).length,
    overdue_poam: getOverdueNistPoam(projectPath).length,
    implementation_status_counts: implementationCounts,
    determination_counts: determinationCounts,
  };
}
