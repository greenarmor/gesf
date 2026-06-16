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
  metadata: z.record(z.unknown()).optional(),
});

export const ReportOptionsSchema = z.object({
  format: ReportFormatSchema,
  title: z.string(),
  include_executive_summary: z.boolean(),
  include_risk_assessment: z.boolean(),
  include_compliance: z.boolean(),
  include_security: z.boolean(),
});
