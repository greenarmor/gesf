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
  | "ISO27001"
  | "ISO27701"
  | "HIPAA";

export type DataClassification = "public" | "internal" | "confidential" | "restricted";

export type SeverityLevel = "critical" | "high" | "medium" | "low";

export type ControlStatus = "pass" | "fail" | "warning" | "not-applicable" | "not-implemented";

export type ReportFormat = "markdown" | "html" | "pdf";

export interface ProjectConfig {
  project_name: string;
  project_type: ProjectType;
  frameworks: FrameworkName[];
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
