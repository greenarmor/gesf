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
  | "ISO27701";

export type DataClassification = "public" | "internal" | "confidential" | "restricted";

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
  severity: "critical" | "high" | "medium" | "low";
  implementation_guidance: string;
  checks: ControlCheck[];
}

export interface ControlCheck {
  id: string;
  description: string;
  status: ControlStatus;
  evidence?: string;
}

export interface ComplianceScore {
  framework: FrameworkName;
  score: number;
  total_controls: number;
  passed_controls: number;
  failed_controls: number;
  warning_controls: number;
  not_applicable: number;
  evaluated_at: string;
}

export interface ScoreFile {
  overall: number;
  frameworks: Record<string, ComplianceScore>;
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
