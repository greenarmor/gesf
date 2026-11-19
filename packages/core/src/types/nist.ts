/**
 * NIST SP 800-53 Rev. 5 assessment data model.
 *
 * Implementation status and assessment determination are deliberately kept
 * separate: an implementation status of "implemented" never implies an
 * assessment determination of "satisfied" (NIST SP 800-53A semantics).
 */

// ---------------------------------------------------------------------------
// Implementation status (Phase A) — how the organization implements a control
// ---------------------------------------------------------------------------
export type NistImplementationStatus =
  | "not-implemented"
  | "planned"
  | "partially-implemented"
  | "implemented"
  | "alternative-implementation"
  | "inherited"
  | "not-applicable";

// ---------------------------------------------------------------------------
// Assessment determination (Phase B) — assessor conclusion (SP 800-53A)
// ---------------------------------------------------------------------------
export type NistAssessmentDetermination =
  | "not-assessed"
  | "satisfied"
  | "other-than-satisfied"
  | "not-applicable";

// ---------------------------------------------------------------------------
// Assessment methods (SP 800-53A)
// ---------------------------------------------------------------------------
export type NistAssessmentMethodKind = "examine" | "interview" | "test";

// ---------------------------------------------------------------------------
// Baseline selection (SP 800-53B) and tailoring
// ---------------------------------------------------------------------------
export type NistBaselineKind = "low" | "moderate" | "high" | "tailored" | "custom";

export interface NistBaselineExclusion {
  control_id: string;
  justification: string;
}

export interface NistBaselineInherited {
  control_id: string;
  from_system: string;
  description: string;
}

export interface NistBaselineCompensating {
  control_id: string;
  alternative_implementation: string;
  description: string;
}

export interface NistBaselineSelection {
  kind: NistBaselineKind;
  label: string;
  /** Official baseline the selection was derived from, for tailored baselines. */
  derived_from?: "low" | "moderate" | "high";
  control_ids: string[];
  exclusions: NistBaselineExclusion[];
  inherited: NistBaselineInherited[];
  compensating: NistBaselineCompensating[];
  catalog_version: string;
  selected_at: string;
  selected_by?: string;
  previous_selections: NistBaselineSelection[];
}

// ---------------------------------------------------------------------------
// Assessment records
// ---------------------------------------------------------------------------
export interface NistObjectiveResult {
  objective_id: string;
  determination: NistAssessmentDetermination;
  notes?: string;
}

export interface NistDeficiency {
  id: string;
  description: string;
  objective_ids?: string[];
}

export interface NistAssessmentHistoryEntry {
  timestamp: string;
  actor?: string;
  action: string;
  from?: string;
  to?: string;
  reason?: string;
}

export interface NistAssessmentRecord {
  id: string;
  project_id: string;
  control_id: string;
  control_enhancement_id?: string;
  scope: string;
  implementation_status: NistImplementationStatus;
  determination: NistAssessmentDetermination;
  methods: NistAssessmentMethodKind[];
  assessment_objective: string;
  objectives: NistObjectiveResult[];
  assessor: string;
  control_owner: string;
  assessment_date: string;
  last_reviewed_date?: string;
  next_review_date?: string;
  notes?: string;
  deficiencies: NistDeficiency[];
  risk_rating?: NistRiskRating;
  evidence_ids: string[];
  finding_ids: string[];
  poam_ids: string[];
  inherited_from?: string;
  /** Organization-defined parameter assignments recorded for this control. */
  parameters?: Record<string, string>;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  history: NistAssessmentHistoryEntry[];
}

// ---------------------------------------------------------------------------
// Evidence management
// ---------------------------------------------------------------------------
export type NistEvidenceKind =
  | "policy"
  | "procedure"
  | "configuration"
  | "screenshot"
  | "audit-log"
  | "system-report"
  | "vulnerability-report"
  | "penetration-test"
  | "interview-record"
  | "test-result"
  | "certificate"
  | "contract"
  | "other";

export type NistEvidenceReviewStatus = "pending-review" | "approved" | "rejected" | "expired";

export interface NistEvidenceItem {
  id: string;
  title: string;
  description: string;
  evidence_type: NistEvidenceKind;
  control_ids: string[];
  assessment_ids: string[];
  source_system: string;
  /** Local file reference, validated to stay inside the project directory. */
  file_reference?: string;
  /** External URL reference. */
  url?: string;
  collected_at: string;
  collection_method: string;
  collected_by: string;
  owner: string;
  review_status: NistEvidenceReviewStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  classification: "public" | "internal" | "confidential" | "restricted";
  retention?: string;
  expires_at?: string;
  /** Integrity digest against a known reference. Not a proof of authenticity. */
  sha256?: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Findings
// ---------------------------------------------------------------------------
export interface NistFinding {
  id: string;
  control_id: string;
  assessment_id?: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  /** Optional link to a GESF scanner finding key (ruleId:file:line). */
  related_scanner_finding_key?: string;
  evidence_ids: string[];
  status: "open" | "resolved";
  resolution_assessment_id?: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Plan of Action and Milestones (POA&M)
// ---------------------------------------------------------------------------
export type NistPoamStatus =
  | "open"
  | "assigned"
  | "in-progress"
  | "pending-verification"
  | "completed"
  | "accepted-risk"
  | "closed";

export interface NistPoamMilestone {
  id: string;
  title: string;
  due_date: string;
  status: "planned" | "in-progress" | "completed" | "cancelled";
  completed_date?: string;
}

export interface NistPoamItem {
  id: string;
  control_id: string;
  assessment_id?: string;
  finding_id?: string;
  title: string;
  description: string;
  root_cause?: string;
  security_impact?: string;
  likelihood?: string;
  risk_level?: "critical" | "high" | "medium" | "low";
  remediation_strategy: string;
  corrective_actions: string[];
  owner: string;
  department?: string;
  planned_start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  milestones: NistPoamMilestone[];
  status: NistPoamStatus;
  residual_risk?: string;
  risk_acceptance_authority?: string;
  risk_acceptance_rationale?: string;
  closure_evidence_ids: string[];
  verification_date?: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Assessment workflow (system-level campaign state)
// ---------------------------------------------------------------------------
export type NistWorkflowState =
  | "draft"
  | "in-progress"
  | "ready-for-assessment"
  | "under-assessment"
  | "assessment-completed"
  | "remediation-required"
  | "closed";

export interface NistWorkflowTransition {
  timestamp: string;
  from: NistWorkflowState;
  to: NistWorkflowState;
  actor?: string;
  notes?: string;
}

export interface NistAssessmentCampaign {
  id: string;
  project_id: string;
  scope: string;
  state: NistWorkflowState;
  transitions: NistWorkflowTransition[];
  assessor?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// ---------------------------------------------------------------------------
// Risk assessment (organizational, explicitly not an official NIST formula)
// ---------------------------------------------------------------------------
export interface NistRiskRating {
  likelihood: string;
  impact: string;
  score: number;
  rating: "low" | "moderate" | "high" | "critical";
  treatment?: "mitigate" | "transfer" | "avoid" | "accept";
  inherent_risk?: string;
  existing_safeguards?: string;
  residual_risk?: string;
  risk_owner?: string;
  matrix_name?: string;
}

export interface NistRiskMatrix {
  name: string;
  likelihood_levels: string[];
  impact_levels: string[];
  scores: number[][];
  rating_bands: Array<{ rating: "low" | "moderate" | "high" | "critical"; max_score: number }>;
}

// ---------------------------------------------------------------------------
// Control ownership
// ---------------------------------------------------------------------------
export interface NistControlOwner {
  control_id: string;
  owner: string;
  department?: string;
  assigned_at: string;
  assigned_by?: string;
}

// ---------------------------------------------------------------------------
// Crosswalk mappings (informational, never proof of compliance)
// ---------------------------------------------------------------------------
export type NistCrosswalkFramework =
  | "NIST-800-53"
  | "NIST-CSF-2.0"
  | "CIS"
  | "ISO27001"
  | "OWASP"
  | "GESF";

export type NistCrosswalkRelationship = "informative-reference" | "related";

export interface NistCrosswalkMapping {
  from_framework: NistCrosswalkFramework;
  from_id: string;
  to_framework: NistCrosswalkFramework;
  to_id: string;
  relationship: NistCrosswalkRelationship;
  source: string;
}
