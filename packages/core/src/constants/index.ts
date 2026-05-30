import type { ProjectType, FrameworkName } from "../types/index.js";

export const GESF_VERSION = "0.2.0";

export const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "saas", label: "SaaS" },
  { value: "ai-application", label: "AI Application" },
  { value: "mcp-server", label: "MCP Server" },
  { value: "blockchain", label: "Blockchain" },
  { value: "wallet", label: "Wallet" },
  { value: "government-system", label: "Government System" },
  { value: "healthcare-system", label: "Healthcare System" },
  { value: "event-platform", label: "Event Platform" },
  { value: "photo-storage-platform", label: "Photo Storage Platform" },
  { value: "vulnerability-scanner", label: "Vulnerability Scanner" },
  { value: "generic-web-application", label: "Generic Web Application" },
  { value: "api-backend", label: "API Backend" },
  { value: "mobile-application", label: "Mobile Application" },
];

export const FRAMEWORKS: { value: FrameworkName; label: string }[] = [
  { value: "GDPR", label: "GDPR" },
  { value: "OWASP", label: "OWASP ASVS / Top 10" },
  { value: "CIS", label: "CIS Controls" },
  { value: "NIST", label: "NIST Cybersecurity Framework" },
  { value: "ISO27001", label: "ISO 27001" },
  { value: "ISO27701", label: "ISO 27701" },
];

export const DEFAULT_FRAMEWORKS: FrameworkName[] = ["GDPR", "OWASP", "CIS", "NIST"];

export const PROJECT_TYPE_PACKS: Record<ProjectType, string[]> = {
  "saas": ["gdpr", "owasp", "cis", "nist"],
  "ai-application": ["gdpr", "owasp", "ai"],
  "mcp-server": ["gdpr", "ai"],
  "blockchain": ["gdpr", "blockchain"],
  "wallet": ["gdpr", "blockchain"],
  "government-system": ["gdpr", "government"],
  "healthcare-system": ["gdpr", "owasp", "cis"],
  "event-platform": ["gdpr", "owasp"],
  "photo-storage-platform": ["gdpr", "owasp"],
  "vulnerability-scanner": ["gdpr", "owasp"],
  "generic-web-application": ["gdpr", "owasp", "cis"],
  "api-backend": ["gdpr", "owasp"],
  "mobile-application": ["gdpr", "owasp"],
};

export const DATA_CLASSIFICATIONS = ["public", "internal", "confidential", "restricted"] as const;

export const APPROVED_ENCRYPTION = ["AES-256-GCM", "ChaCha20-Poly1305", "TLS 1.3", "TLS 1.2"] as const;

export const APPROVED_HASHING = ["Argon2id", "bcrypt", "scrypt"] as const;

export const REJECTED_HASHING = ["MD5", "SHA1", "plain-text"] as const;

export const AUDIT_LOG_FIELDS = ["userId", "action", "resource", "timestamp", "ipAddress"] as const;

export const MUST_LOG_EVENTS = [
  "authentication",
  "authorization",
  "data_export",
  "role_changes",
  "administrative_actions",
] as const;

export const MUST_NOT_LOG = ["passwords", "tokens", "private_keys", "sensitive_personal_data"] as const;

export const DB_AUDIT_COLUMNS = [
  "created_at",
  "updated_at",
  "deleted_at",
  "created_by",
  "updated_by",
] as const;

export const GES_DIR = ".ges";
export const COMPLIANCE_DIR = "compliance";
export const SECURITY_DIR = "security";
export const CONTROLS_DIR = "controls";
export const POLICIES_DIR = "policies";
export const CHECKLISTS_DIR = "checklists";
export const DOCS_DIR = "docs";
export const REPORTS_DIR = "reports";
