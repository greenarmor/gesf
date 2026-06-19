export type ProjectType =
  | "saas"
  | "ai-application"
  | "mcp-server"
  | "blockchain"
  | "wallet"
  | "government-system"
  | "healthcare-system"
  | "event-platform"
  | "photo-storage-platform"
  | "vulnerability-scanner"
  | "generic-web-application"
  | "api-backend"
  | "mobile-application";

export type FrameworkName =
  | "GDPR"
  | "OWASP"
  | "CIS"
  | "NIST"
  | "NIST-800-53"
  | "ISO27001"
  | "ISO27701"
  | "HIPAA"
  | "PRIVACY-CORE"
  | "UK-GDPR"
  | "LGPD"
  | "PDPA-SG"
  | "DPA-PH"
  | "PDPA-TH"
  | "APPI"
  | "PIPA"
  | "PIPL"
  | "PDPO-HK"
  | "PIPEDA"
  | "CPRA"
  | "POPIA"
  | "PDPL-UAE"
  | "PDPL-SA"
  | "DPDPA"
  | "FADP"
  | "PDPA-MY"
  | "PDP-ID"
  | "PDP-VN"
  | "NDPA-NG"
  | "DPA-KE"
  | "PDPA-QA";

export type DataClassification = "public" | "internal" | "confidential" | "restricted";

export type SeverityLevel = "critical" | "high" | "medium" | "low";

export type ControlStatus = "pass" | "fail" | "warning" | "not-applicable" | "not-implemented";

export type ReportFormat = "markdown" | "html" | "pdf";

export interface ProjectConfig {
  project_name: string;
  project_type: ProjectType;
  frameworks: FrameworkName[];
  country?: string;
  requirements: Requirements;
  created_at: string;
  version: string;
}

export interface Requirements {
  encryption: RequirementConfig;
  mfa: RequirementConfig;
  audit_logs: RequirementConfig;
  backups: RequirementConfig;
  retention_policy: RequirementConfig;
  vulnerability_scanning: RequirementConfig;
  authentication: RequirementConfig;
  authorization: RequirementConfig;
  secrets_management: RequirementConfig;
  logging: RequirementConfig;
  monitoring: RequirementConfig;
  data_classification: RequirementConfig;
  disaster_recovery: RequirementConfig;
  incident_response: RequirementConfig;
  privacy_controls: RequirementConfig;
}

export interface RequirementConfig {
  required: boolean;
  level?: "mandatory" | "recommended" | "optional";
  notes?: string;
}

export interface Control {
  id: string;
  name: string;
  description: string;
  category: string;
  framework: FrameworkName;
  article?: string;
  status: ControlStatus;
  severity: SeverityLevel;
  implementation_guidance: string;
  checks: ControlCheck[];
}

export interface ControlCheck {
  id: string;
  description: string;
  status: ControlStatus;
  evidence?: string;
}

export type ComplianceGrade = "A" | "B" | "C" | "D" | "F";

export interface SeverityBreakdown {
  critical: { total: number; passed: number; failed: number; warning: number; not_implemented: number };
  high: { total: number; passed: number; failed: number; warning: number; not_implemented: number };
  medium: { total: number; passed: number; failed: number; warning: number; not_implemented: number };
  low: { total: number; passed: number; failed: number; warning: number; not_implemented: number };
}

export interface ComplianceScore {
  framework: FrameworkName;
  score: number;
  grade: ComplianceGrade;
  total_controls: number;
  passed_controls: number;
  failed_controls: number;
  warning_controls: number;
  not_applicable: number;
  not_implemented: number;
  severity_breakdown: SeverityBreakdown;
  critical_failures: number;
  max_possible_score: number;
  evaluated_at: string;
}

export interface AuditImpact {
  total_deduction: number;
  critical_findings: number;
  high_findings: number;
  medium_findings: number;
  low_findings: number;
}

export interface ScoreFile {
  overall: number;
  overall_grade: ComplianceGrade;
  frameworks: Record<string, ComplianceScore>;
  audit_impact?: AuditImpact;
  evaluated_at: string;
}

export interface AuditEntry {
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  metadata?: Record<string, unknown>;
}

export interface PolicyPack {
  id: string;
  name: string;
  description: string;
  version: string;
  project_types: ProjectType[];
  controls: Control[];
  frameworks: FrameworkName[];
}

export interface FrameworkVersion {
  gesf_version: string;
  packs: Record<string, string>;
}

export interface Metadata {
  project_name: string;
  project_type: ProjectType;
  initialized_at: string;
  gesf_version: string;
  last_audit?: string;
  last_score?: string;
}

export interface ReportOptions {
  format: ReportFormat;
  title: string;
  include_executive_summary: boolean;
  include_risk_assessment: boolean;
  include_compliance: boolean;
  include_security: boolean;
}

export interface ControlOverride {
  control_id: string;
  status: ControlStatus;
  reason: string;
}

export interface FixHistoryEntry {
  id: string;
  timestamp: string;
  source: "cli" | "mcp";
  actor_name?: string;
  actor_role?: string;
  dry_run: boolean;
  finding: {
    rule_id: string;
    severity: SeverityLevel;
    category: string;
    title: string;
    file: string;
    line?: number;
    evidence: string;
    description: string;
  };
  controls: {
    id: string;
    name: string;
    framework: string;
    article?: string;
    status: ControlStatus;
  }[];
  fix: {
    action_type: "create" | "modify" | "append" | "npm-install";
    file_path: string;
    description: string;
    guidance: string;
    applied: boolean;
    error?: string;
  };
  compliance_impact: {
    frameworks_affected: string[];
    controls_addressed: number;
    severity_resolved: SeverityLevel;
  };
}

export type FixAssignmentStatus = "assigned" | "in-progress" | "fixed" | "verified" | "rejected";

export interface FixAssignment {
  id: string;
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
  assigned_at: string;
  assigned_by: string;
  status: FixAssignmentStatus;
  notes: string;
  resolution: null | {
    resolved_at: string;
    resolved_by: string;
    resolved_by_role: string;
    method: "auto-fix" | "manual" | "not-applicable";
    resolution_notes: string;
  };
  created_at: string;
  updated_at: string;
}

export type ActivityAction =
  | "init"
  | "audit"
  | "fix"
  | "policy_install"
  | "policy_remove"
  | "control_override"
  | "implement_control"
  | "score"
  | "scan"
  | "validate"
  | "generate"
  | "hooks_install"
  | "hooks_uninstall"
  | "dashboard_start"
  | "badge_generate"
  | "fix_assign"
  | "fix_resolve";

export type ActivityStatus = "success" | "partial" | "failed" | "info";

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  source: "cli" | "mcp";
  actor_name?: string;
  actor_role?: string;
  action: ActivityAction;
  title: string;
  description: string;
  status: ActivityStatus;
  details: {
    packs_affected?: string[];
    controls_affected?: string[];
    files_created?: string[];
    files_modified?: string[];
    findings_count?: number;
    fixes_applied?: number;
    score?: number;
    frameworks_added?: string[];
    [key: string]: unknown;
  };
}

// ============================================================
// GOVERNANCE APPROVAL PROVENANCE CHAIN
// ============================================================

export type GovernanceSystemType =
  | "ai-system"
  | "application"
  | "data-process"
  | "api"
  | "model"
  | "infrastructure"
  | "third-party-service";

export type GovernanceStatus =
  | "draft"
  | "pending-review"
  | "approved"
  | "rejected"
  | "conditional"
  | "expired"
  | "revoked";

export type GovernanceRiskLevel = "low" | "medium" | "high" | "critical";

export type EvidenceType =
  | "document"
  | "ticket"
  | "meeting-record"
  | "email"
  | "report"
  | "certificate"
  | "log"
  | "dashboard"
  | "contract"
  | "other";

export type EvidenceSourceSystem =
  | "jira"
  | "servicenow"
  | "confluence"
  | "sharepoint"
  | "grc-platform"
  | "email"
  | "git"
  | "file"
  | "url"
  | "other";

export interface EvidenceRef {
  id: string;
  type: EvidenceType;
  title: string;
  source_system: EvidenceSourceSystem;
  reference: string;
  location_description: string;
  added_by: string;
  added_at: string;
}

export interface ApprovalDecision {
  approver_name: string;
  approver_role: string;
  approver_email: string;
  approval_authority: string;
  decision: "approved" | "rejected" | "conditional";
  decision_date: string;
  valid_from: string;
  valid_until: string | null;
  conditions: string[];
  rationale: string;
}

export interface RiskAssessmentRef {
  id: string;
  assessor: string;
  assessment_date: string;
  methodology: string;
  risk_score: string;
  identified_risks: string[];
  residual_risk: string;
  mitigation_measures: string[];
  evidence: EvidenceRef[];
}

export interface PolicyBasisRef {
  policy_id: string;
  policy_name: string;
  version: string;
  clauses: string[];
  standard: string;
  evidence: EvidenceRef[];
}

export interface CommitteeApprovalRef {
  committee_name: string;
  meeting_date: string;
  meeting_reference: string;
  attendees: string[];
  decision_summary: string;
  evidence: EvidenceRef[];
}

export interface ReviewCycleEntry {
  date: string;
  reviewer: string;
  outcome: "continued" | "modified" | "revoked" | "expired";
  notes: string;
}

export interface ReviewCycle {
  frequency: "quarterly" | "semi-annual" | "annual" | "biennial";
  last_review: string;
  next_review: string;
  review_history: ReviewCycleEntry[];
}

export interface GovernanceDataInventory {
  personal_data_categories: string[];
  processing_purposes: string[];
  data_subjects: string[];
  cross_border_transfers: string[];
  retention_period: string;
}

export interface GovernanceComplianceLinks {
  frameworks: string[];
  controls_satisfied: string[];
  control_pack_ids: string[];
}

export interface GovernanceRecord {
  id: string;
  system_name: string;
  system_description: string;
  system_type: GovernanceSystemType;
  system_version: string;
  status: GovernanceStatus;
  risk_level: GovernanceRiskLevel;

  approval: ApprovalDecision | null;
  risk_assessment: RiskAssessmentRef | null;
  policy_basis: PolicyBasisRef | null;
  committee: CommitteeApprovalRef | null;
  evidence: EvidenceRef[];
  review_cycle: ReviewCycle | null;
  data_inventory: GovernanceDataInventory | null;
  compliance: GovernanceComplianceLinks | null;

  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  record_version: number;
}

export interface GovernanceVerificationResult {
  record_id: string;
  system_name: string;
  valid: boolean;
  issues: string[];
  warnings: string[];
  completeness: {
    has_approval: boolean;
    has_risk_assessment: boolean;
    has_policy_basis: boolean;
    has_evidence: boolean;
    has_review_cycle: boolean;
    has_data_inventory: boolean;
    has_compliance_links: boolean;
    evidence_count: number;
    is_current: boolean;
  };
  approval_status: "valid" | "expired" | "pending" | "none";
  days_until_expiry: number | null;
}
