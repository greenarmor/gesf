import type { DataClassification } from "@greenarmor/ges-core";

export interface ClassificationRule {
  classification: DataClassification;
  requiresEncryption: boolean;
  requiresAccessControls: boolean;
  requiresAuditLogging: boolean;
  description: string;
}

export const CLASSIFICATION_RULES: Record<DataClassification, ClassificationRule> = {
  public: {
    classification: "public",
    requiresEncryption: false,
    requiresAccessControls: false,
    requiresAuditLogging: false,
    description: "Information that can be freely disclosed to the public.",
  },
  internal: {
    classification: "internal",
    requiresEncryption: false,
    requiresAccessControls: true,
    requiresAuditLogging: false,
    description: "Information for internal use that is not intended for public disclosure.",
  },
  confidential: {
    classification: "confidential",
    requiresEncryption: true,
    requiresAccessControls: true,
    requiresAuditLogging: true,
    description: "Sensitive business information that requires protection.",
  },
  restricted: {
    classification: "restricted",
    requiresEncryption: true,
    requiresAccessControls: true,
    requiresAuditLogging: true,
    description: "Highly sensitive data (PII, health, financial) requiring the strictest controls.",
  },
};

export interface AuthRule {
  name: string;
  approved: boolean;
  description: string;
}

export const APPROVED_AUTH_METHODS: AuthRule[] = [
  { name: "Argon2id", approved: true, description: "Recommended password hashing algorithm." },
  { name: "MFA", approved: true, description: "Multi-factor authentication is mandatory." },
  { name: "Passkey", approved: true, description: "WebAuthn/FIDO2 passkey support required." },
  { name: "Session Expiration", approved: true, description: "Automatic session timeout required." },
  { name: "Rate Limiting", approved: true, description: "Rate limiting on authentication endpoints." },
];

export const REJECTED_AUTH_METHODS: AuthRule[] = [
  { name: "MD5", approved: false, description: "Cryptographically broken. Never use for passwords." },
  { name: "SHA1", approved: false, description: "Cryptographically weak. Not suitable for passwords." },
  { name: "Plain Text", approved: false, description: "Passwords must never be stored in plain text." },
];

export interface EncryptionRule {
  algorithm: string;
  approved: boolean;
  description: string;
}

export const APPROVED_ENCRYPTION: EncryptionRule[] = [
  { algorithm: "AES-256-GCM", approved: true, description: "Approved symmetric encryption." },
  { algorithm: "ChaCha20-Poly1305", approved: true, description: "Approved symmetric encryption." },
  { algorithm: "TLS 1.3", approved: true, description: "Preferred for data in transit." },
  { algorithm: "TLS 1.2", approved: true, description: "Minimum for data in transit." },
];

export interface SecretsRule {
  practice: string;
  allowed: boolean;
  description: string;
}

export const SECRETS_RULES: SecretsRule[] = [
  { practice: "Passwords in source code", allowed: false, description: "Never hardcode passwords." },
  { practice: "Private keys in Git", allowed: false, description: "Never commit private keys." },
  { practice: "API keys in repositories", allowed: false, description: "Never commit API keys." },
  { practice: "HashiCorp Vault", allowed: true, description: "Recommended secrets management." },
  { practice: "AWS KMS", allowed: true, description: "Supported secrets management." },
  { practice: "Azure Key Vault", allowed: true, description: "Supported secrets management." },
  { practice: "GCP Secret Manager", allowed: true, description: "Supported secrets management." },
  { practice: "Encrypted Environment Files", allowed: true, description: "Acceptable for development." },
];

export interface LoggingRule {
  event: string;
  mustLog: boolean;
  mustNotLog: boolean;
}

export const LOGGING_RULES: LoggingRule[] = [
  { event: "Authentication events", mustLog: true, mustNotLog: false },
  { event: "Authorization decisions", mustLog: true, mustNotLog: false },
  { event: "Data exports", mustLog: true, mustNotLog: false },
  { event: "Role changes", mustLog: true, mustNotLog: false },
  { event: "Administrative actions", mustLog: true, mustNotLog: false },
  { event: "Passwords", mustLog: false, mustNotLog: true },
  { event: "Tokens", mustLog: false, mustNotLog: true },
  { event: "Private keys", mustLog: false, mustNotLog: true },
  { event: "Sensitive personal data", mustLog: false, mustNotLog: true },
];

export interface DBStandard {
  requirement: string;
  mandatory: boolean;
  description: string;
}

export const DB_STANDARDS: DBStandard[] = [
  { requirement: "Primary Keys", mandatory: true, description: "Every table must have a primary key." },
  { requirement: "Foreign Keys", mandatory: true, description: "Referential integrity via foreign keys." },
  { requirement: "Audit Columns", mandatory: true, description: "created_at, updated_at, deleted_at, created_by, updated_by." },
  { requirement: "Soft Delete", mandatory: true, description: "Use deleted_at instead of hard deletes." },
];

export interface APIStandard {
  requirement: string;
  mandatory: boolean;
  description: string;
}

export const API_STANDARDS: APIStandard[] = [
  { requirement: "Input Validation", mandatory: true, description: "Validate all input data server-side." },
  { requirement: "Output Validation", mandatory: true, description: "Sanitize and validate all output data." },
  { requirement: "Authentication", mandatory: true, description: "All endpoints require authentication." },
  { requirement: "Authorization", mandatory: true, description: "Enforce RBAC on all endpoints." },
  { requirement: "Rate Limiting", mandatory: true, description: "Rate limit all API endpoints." },
  { requirement: "Audit Logging", mandatory: true, description: "Log all API access and mutations." },
];

export interface StorageRule {
  provider: string;
  rules: string[];
}

export const STORAGE_RULES: StorageRule[] = [
  { provider: "MinIO", rules: ["Private by default", "Signed URLs", "Encryption enabled", "Versioning enabled"] },
  { provider: "S3", rules: ["Private by default", "Signed URLs", "Encryption enabled", "Versioning enabled"] },
  { provider: "Azure Blob", rules: ["Private by default", "SAS tokens", "Encryption enabled", "Versioning enabled"] },
  { provider: "Google Storage", rules: ["Private by default", "Signed URLs", "Encryption enabled", "Versioning enabled"] },
];
