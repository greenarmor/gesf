import { z } from "zod";

export const ProjectTypeSchema = z.enum([
  "saas",
  "ai-application",
  "mcp-server",
  "blockchain",
  "wallet",
  "government-system",
  "healthcare-system",
  "event-platform",
  "photo-storage-platform",
  "vulnerability-scanner",
  "generic-web-application",
  "api-backend",
  "mobile-application",
]);

export const FrameworkNameSchema = z.enum([
  "GDPR",
  "OWASP",
  "CIS",
  "NIST",
  "NIST-800-53",
  "ISO27001",
  "ISO27701",
  "HIPAA",
  "PRIVACY-CORE",
  "UK-GDPR",
  "LGPD",
  "PDPA-SG",
  "DPA-PH",
  "PDPA-TH",
  "APPI",
  "PIPA",
  "PIPL",
  "PDPO-HK",
  "PIPEDA",
  "CPRA",
  "POPIA",
  "PDPL-UAE",
  "PDPL-SA",
  "DPDPA",
  "FADP",
  "PDPA-MY",
  "PDP-ID",
  "PDP-VN",
  "NDPA-NG",
  "DPA-KE",
  "PDPA-QA",
]);

export const DataClassificationSchema = z.enum([
  "public",
  "internal",
  "confidential",
  "restricted",
]);

export const ControlStatusSchema = z.enum([
  "pass",
  "fail",
  "warning",
  "not-applicable",
  "not-implemented",
]);

export const ReportFormatSchema = z.enum(["markdown", "html", "pdf"]);

export const RequirementConfigSchema = z.object({
  required: z.boolean(),
  level: z.enum(["mandatory", "recommended", "optional"]).optional(),
  notes: z.string().optional(),
});

export const ProjectConfigSchema = z.object({
  project_name: z.string().min(1),
  project_type: ProjectTypeSchema,
  frameworks: z.array(FrameworkNameSchema).min(1),
  country: z.string().optional(),
  requirements: z.object({
    encryption: RequirementConfigSchema,
    mfa: RequirementConfigSchema,
    audit_logs: RequirementConfigSchema,
    backups: RequirementConfigSchema,
    retention_policy: RequirementConfigSchema,
    vulnerability_scanning: RequirementConfigSchema,
    authentication: RequirementConfigSchema,
    authorization: RequirementConfigSchema,
    secrets_management: RequirementConfigSchema,
    logging: RequirementConfigSchema,
    monitoring: RequirementConfigSchema,
    data_classification: RequirementConfigSchema,
    disaster_recovery: RequirementConfigSchema,
    incident_response: RequirementConfigSchema,
    privacy_controls: RequirementConfigSchema,
  }),
  created_at: z.string(),
  version: z.string(),
});

export const ControlCheckSchema = z.object({
  id: z.string(),
  description: z.string(),
  status: ControlStatusSchema,
  evidence: z.string().optional(),
});

export const ControlSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  framework: FrameworkNameSchema,
  article: z.string().optional(),
  status: ControlStatusSchema.default("not-implemented"),
  severity: z.enum(["critical", "high", "medium", "low"]),
  implementation_guidance: z.string(),
  checks: z.array(ControlCheckSchema),
});

export const AuditEntrySchema = z.object({
  userId: z.string(),
  action: z.string(),
  resource: z.string(),
  timestamp: z.string(),
  ipAddress: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ReportOptionsSchema = z.object({
  format: ReportFormatSchema,
  title: z.string(),
  include_executive_summary: z.boolean(),
  include_risk_assessment: z.boolean(),
  include_compliance: z.boolean(),
  include_security: z.boolean(),
});

// NIST SP 800-53 assessment schemas
const nistImplementationStatusSchema = z.enum([
  "not-implemented",
  "planned",
  "partially-implemented",
  "implemented",
  "alternative-implementation",
  "inherited",
  "not-applicable",
]);

const nistDeterminationSchema = z.enum([
  "not-assessed",
  "satisfied",
  "other-than-satisfied",
  "not-applicable",
]);

const nistMethodSchema = z.enum(["examine", "interview", "test"]);

const nistEvidenceKindSchema = z.enum([
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
]);

const nistPoamStatusSchema = z.enum([
  "open",
  "assigned",
  "in-progress",
  "pending-verification",
  "completed",
  "accepted-risk",
  "closed",
]);

const nistWorkflowStateSchema = z.enum([
  "draft",
  "in-progress",
  "ready-for-assessment",
  "under-assessment",
  "assessment-completed",
  "remediation-required",
  "closed",
]);

export const NistBaselineSelectionSchema = z.object({
  kind: z.enum(["low", "moderate", "high", "tailored", "custom"]),
  label: z.string().min(1),
  derived_from: z.enum(["low", "moderate", "high"]).optional(),
  control_ids: z.array(z.string()),
  exclusions: z.array(z.object({ control_id: z.string(), justification: z.string() })),
  inherited: z.array(
    z.object({ control_id: z.string(), from_system: z.string(), description: z.string() }),
  ),
  compensating: z.array(
    z.object({
      control_id: z.string(),
      alternative_implementation: z.string(),
      description: z.string(),
    }),
  ),
  catalog_version: z.string(),
  selected_at: z.string(),
  selected_by: z.string().optional(),
  previous_selections: z.array(z.unknown()),
});

export const NistAssessmentRecordSchema = z.object({
  id: z.string().min(1),
  project_id: z.string().min(1),
  control_id: z.string().min(1),
  control_enhancement_id: z.string().optional(),
  scope: z.string(),
  implementation_status: nistImplementationStatusSchema,
  determination: nistDeterminationSchema,
  methods: z.array(nistMethodSchema).min(1),
  assessment_objective: z.string(),
  objectives: z.array(
    z.object({
      objective_id: z.string(),
      determination: nistDeterminationSchema,
      notes: z.string().optional(),
    }),
  ),
  assessor: z.string().min(1),
  control_owner: z.string(),
  assessment_date: z.string(),
  last_reviewed_date: z.string().optional(),
  next_review_date: z.string().optional(),
  notes: z.string().optional(),
  deficiencies: z.array(
    z.object({ id: z.string(), description: z.string(), objective_ids: z.array(z.string()).optional() }),
  ),
  risk_rating: z.unknown().optional(),
  evidence_ids: z.array(z.string()),
  finding_ids: z.array(z.string()),
  poam_ids: z.array(z.string()),
  inherited_from: z.string().optional(),
  parameters: z.record(z.string(), z.string()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
  updated_by: z.string().optional(),
  history: z.array(z.unknown()),
});

export const NistEvidenceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  evidence_type: nistEvidenceKindSchema,
  control_ids: z.array(z.string()),
  assessment_ids: z.array(z.string()),
  source_system: z.string(),
  file_reference: z.string().optional(),
  url: z.string().optional(),
  collected_at: z.string(),
  collection_method: z.string(),
  collected_by: z.string(),
  owner: z.string(),
  review_status: z.enum(["pending-review", "approved", "rejected", "expired"]),
  reviewed_by: z.string().optional(),
  reviewed_at: z.string().optional(),
  classification: z.enum(["public", "internal", "confidential", "restricted"]),
  retention: z.string().optional(),
  expires_at: z.string().optional(),
  sha256: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const NistPoamItemSchema = z.object({
  id: z.string().min(1),
  control_id: z.string().min(1),
  assessment_id: z.string().optional(),
  finding_id: z.string().optional(),
  title: z.string().min(1),
  description: z.string(),
  root_cause: z.string().optional(),
  security_impact: z.string().optional(),
  likelihood: z.string().optional(),
  risk_level: z.enum(["critical", "high", "medium", "low"]).optional(),
  remediation_strategy: z.string().min(1),
  corrective_actions: z.array(z.string()),
  owner: z.string().min(1),
  department: z.string().optional(),
  planned_start_date: z.string().optional(),
  target_completion_date: z.string().optional(),
  actual_completion_date: z.string().optional(),
  milestones: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      due_date: z.string(),
      status: z.enum(["planned", "in-progress", "completed", "cancelled"]),
      completed_date: z.string().optional(),
    }),
  ),
  status: nistPoamStatusSchema,
  residual_risk: z.string().optional(),
  risk_acceptance_authority: z.string().optional(),
  risk_acceptance_rationale: z.string().optional(),
  closure_evidence_ids: z.array(z.string()),
  verification_date: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export {
  nistImplementationStatusSchema,
  nistDeterminationSchema,
  nistMethodSchema,
  nistEvidenceKindSchema,
  nistPoamStatusSchema,
  nistWorkflowStateSchema,
};
