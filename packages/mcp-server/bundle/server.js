#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import * as readline from "node:readline";
import * as fs2 from "node:fs";
import * as path3 from "node:path";

// ../compliance-engine/dist/article-5.js
function createArticle5Controls() {
  return [
    {
      id: "GDPR-ART5-001",
      name: "Lawfulness, Fairness, and Transparency",
      description: "Personal data must be processed lawfully, fairly, and in a transparent manner.",
      category: "data-processing",
      framework: "GDPR",
      article: "Article 5(1)(a)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement a consent management system. Maintain a record of legal bases for each processing activity. Provide clear privacy notices.",
      checks: [
        { id: "GDPR-ART5-001-C1", description: "Legal basis documented for each processing activity", status: "not-implemented" },
        { id: "GDPR-ART5-001-C2", description: "Privacy notice is clear and accessible", status: "not-implemented" },
        { id: "GDPR-ART5-001-C3", description: "Consent mechanism implemented where required", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART5-002",
      name: "Purpose Limitation",
      description: "Personal data must be collected for specified, explicit, and legitimate purposes.",
      category: "data-processing",
      framework: "GDPR",
      article: "Article 5(1)(b)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Document all purposes of data processing. Implement controls to prevent processing beyond declared purposes.",
      checks: [
        { id: "GDPR-ART5-002-C1", description: "Purpose of each data collection documented", status: "not-implemented" },
        { id: "GDPR-ART5-002-C2", description: "Technical controls prevent unauthorized purpose deviation", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART5-003",
      name: "Data Minimisation",
      description: "Personal data must be adequate, relevant, and limited to what is necessary.",
      category: "data-processing",
      framework: "GDPR",
      article: "Article 5(1)(c)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Review data collection forms and APIs to ensure only necessary data is collected. Remove unused data fields.",
      checks: [
        { id: "GDPR-ART5-003-C1", description: "Data collection reviewed for minimisation", status: "not-implemented" },
        { id: "GDPR-ART5-003-C2", description: "No unnecessary data fields in forms and APIs", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART5-004",
      name: "Accuracy",
      description: "Personal data must be accurate and, where necessary, kept up to date.",
      category: "data-quality",
      framework: "GDPR",
      article: "Article 5(1)(d)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement data validation on input. Provide user self-service for data updates. Schedule periodic data accuracy reviews.",
      checks: [
        { id: "GDPR-ART5-004-C1", description: "Input validation implemented for personal data", status: "not-implemented" },
        { id: "GDPR-ART5-004-C2", description: "Users can update their own data", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART5-005",
      name: "Storage Limitation",
      description: "Personal data must be kept in identifiable form no longer than necessary.",
      category: "data-retention",
      framework: "GDPR",
      article: "Article 5(1)(e)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Define retention periods per data category. Implement automated deletion or anonymisation. Document retention policies.",
      checks: [
        { id: "GDPR-ART5-005-C1", description: "Retention periods defined per data category", status: "not-implemented" },
        { id: "GDPR-ART5-005-C2", description: "Automated deletion or anonymisation implemented", status: "not-implemented" },
        { id: "GDPR-ART5-005-C3", description: "Retention policy documented", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART5-006",
      name: "Integrity and Confidentiality",
      description: "Personal data must be processed with appropriate security measures.",
      category: "security",
      framework: "GDPR",
      article: "Article 5(1)(f)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement encryption at rest and in transit. Use access controls. Ensure data integrity checks.",
      checks: [
        { id: "GDPR-ART5-006-C1", description: "Encryption at rest configured", status: "not-implemented" },
        { id: "GDPR-ART5-006-C2", description: "Encryption in transit enforced (TLS 1.2+)", status: "not-implemented" },
        { id: "GDPR-ART5-006-C3", description: "Access controls implemented", status: "not-implemented" }
      ]
    }
  ];
}

// ../compliance-engine/dist/article-25.js
function createArticle25Controls() {
  return [
    {
      id: "GDPR-ART25-001",
      name: "Data Protection by Design",
      description: "Implement appropriate technical and organisational measures to integrate data protection principles into processing.",
      category: "privacy-by-design",
      framework: "GDPR",
      article: "Article 25(1)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Conduct privacy impact assessments during design phase. Implement pseudonymisation by default. Minimise data processing in all components.",
      checks: [
        { id: "GDPR-ART25-001-C1", description: "Privacy impact assessment conducted", status: "not-implemented" },
        { id: "GDPR-ART25-001-C2", description: "Pseudonymisation implemented where applicable", status: "not-implemented" },
        { id: "GDPR-ART25-001-C3", description: "Data protection integrated into development lifecycle", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART25-002",
      name: "Data Protection by Default",
      description: "Only personal data necessary for each specific purpose is processed by default.",
      category: "privacy-by-design",
      framework: "GDPR",
      article: "Article 25(2)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Configure default settings to process minimal data. Require explicit opt-in for additional data processing. Implement granular consent controls.",
      checks: [
        { id: "GDPR-ART25-002-C1", description: "Default settings minimise data processing", status: "not-implemented" },
        { id: "GDPR-ART25-002-C2", description: "Explicit opt-in required for additional processing", status: "not-implemented" }
      ]
    }
  ];
}

// ../compliance-engine/dist/article-30.js
function createArticle30Controls() {
  return [
    {
      id: "GDPR-ART30-001",
      name: "Record of Processing Activities",
      description: "Maintain a record of processing activities under the controller's responsibility.",
      category: "documentation",
      framework: "GDPR",
      article: "Article 30(1)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Create and maintain a processing activities register. Include: purposes, data categories, recipients, retention periods, and security measures.",
      checks: [
        { id: "GDPR-ART30-001-C1", description: "Processing activities register created", status: "not-implemented" },
        { id: "GDPR-ART30-001-C2", description: "All required fields documented per Article 30", status: "not-implemented" },
        { id: "GDPR-ART30-001-C3", description: "Register kept up to date", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART30-002",
      name: "Processor Records",
      description: "Processors must maintain records of all categories of processing carried out on behalf of controllers.",
      category: "documentation",
      framework: "GDPR",
      article: "Article 30(2)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "If acting as a processor, maintain records of all processing categories. Include controller details, processing purposes, and data transfers.",
      checks: [
        { id: "GDPR-ART30-002-C1", description: "Processor processing records maintained", status: "not-implemented" },
        { id: "GDPR-ART30-002-C2", description: "Data transfer documentation complete", status: "not-implemented" }
      ]
    }
  ];
}

// ../compliance-engine/dist/article-32.js
function createArticle32Controls() {
  return [
    {
      id: "GDPR-ART32-001",
      name: "Pseudonymisation",
      description: "Implement pseudonymisation as a technical measure to protect personal data.",
      category: "data-protection",
      framework: "GDPR",
      article: "Article 32(1)(a)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Replace identifying fields with pseudonymous identifiers. Maintain a separate, secured mapping table. Use tokenisation where applicable.",
      checks: [
        { id: "GDPR-ART32-001-C1", description: "Pseudonymisation strategy defined", status: "not-implemented" },
        { id: "GDPR-ART32-001-C2", description: "Technical implementation of pseudonymisation in place", status: "not-implemented" },
        { id: "GDPR-ART32-001-C3", description: "Mapping table secured with access controls", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART32-002",
      name: "Encryption at Rest",
      description: "Implement encryption of personal data at rest using approved algorithms.",
      category: "encryption",
      framework: "GDPR",
      article: "Article 32(1)(a)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Use AES-256-GCM or ChaCha20-Poly1305 for data at rest. Encrypt databases, file storage, and backups. Manage keys via vault or KMS.",
      checks: [
        { id: "GDPR-ART32-002-C1", description: "Database encryption enabled", status: "not-implemented" },
        { id: "GDPR-ART32-002-C2", description: "File storage encryption enabled", status: "not-implemented" },
        { id: "GDPR-ART32-002-C3", description: "Backup encryption enabled", status: "not-implemented" },
        { id: "GDPR-ART32-002-C4", description: "Key management via approved system (Vault/KMS)", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART32-003",
      name: "Encryption in Transit",
      description: "Ensure all personal data transmitted is encrypted using TLS 1.2 minimum.",
      category: "encryption",
      framework: "GDPR",
      article: "Article 32(1)(a)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Enforce TLS 1.2 minimum, prefer TLS 1.3. Configure HSTS. Disable older protocols. Use strong cipher suites.",
      checks: [
        { id: "GDPR-ART32-003-C1", description: "TLS 1.2 minimum enforced on all endpoints", status: "not-implemented" },
        { id: "GDPR-ART32-003-C2", description: "HSTS headers configured", status: "not-implemented" },
        { id: "GDPR-ART32-003-C3", description: "Strong cipher suites only", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART32-004",
      name: "Unique User Identification",
      description: "Ensure unique identification of each user through secure authentication.",
      category: "authentication",
      framework: "GDPR",
      article: "Article 32(1)(b)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement unique user IDs. Use Argon2id for password hashing. Support MFA and passkeys.",
      checks: [
        { id: "GDPR-ART32-004-C1", description: "Unique user identification implemented", status: "not-implemented" },
        { id: "GDPR-ART32-004-C2", description: "Secure password hashing (Argon2id)", status: "not-implemented" },
        { id: "GDPR-ART32-004-C3", description: "MFA support implemented", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART32-005",
      name: "Automatic Session Timeout",
      description: "Implement automatic session expiration after period of inactivity.",
      category: "authentication",
      framework: "GDPR",
      article: "Article 32(1)(b)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Set maximum session duration. Implement idle timeout (15-30 minutes). Require re-authentication for sensitive operations.",
      checks: [
        { id: "GDPR-ART32-005-C1", description: "Session timeout configured", status: "not-implemented" },
        { id: "GDPR-ART32-005-C2", description: "Idle timeout implemented", status: "not-implemented" },
        { id: "GDPR-ART32-005-C3", description: "Re-authentication for sensitive operations", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART32-006",
      name: "Audit Logging",
      description: "Maintain comprehensive audit logs of all access and processing activities.",
      category: "audit",
      framework: "GDPR",
      article: "Article 32(1)(b)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Log all authentication, authorization, data access, exports, and admin actions. Never log passwords, tokens, or sensitive data. Ensure logs are immutable.",
      checks: [
        { id: "GDPR-ART32-006-C1", description: "Audit logging system implemented", status: "not-implemented" },
        { id: "GDPR-ART32-006-C2", description: "Logs include required fields (userId, action, resource, timestamp, IP)", status: "not-implemented" },
        { id: "GDPR-ART32-006-C3", description: "Logs are immutable (append-only)", status: "not-implemented" },
        { id: "GDPR-ART32-006-C4", description: "Sensitive data is not logged", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART32-007",
      name: "Integrity Controls",
      description: "Implement measures to ensure ongoing integrity of personal data.",
      category: "data-integrity",
      framework: "GDPR",
      article: "Article 32(1)(b)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Use checksums or hashes for data integrity verification. Implement input validation. Use database constraints.",
      checks: [
        { id: "GDPR-ART32-007-C1", description: "Data integrity verification implemented", status: "not-implemented" },
        { id: "GDPR-ART32-007-C2", description: "Input validation on all data entry points", status: "not-implemented" },
        { id: "GDPR-ART32-007-C3", description: "Database constraints enforced", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART32-008",
      name: "Backup and Recovery",
      description: "Implement regular backup and recovery procedures for personal data.",
      category: "backup",
      framework: "GDPR",
      article: "Article 32(1)(b)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Perform daily encrypted backups. Test restores weekly. Conduct monthly recovery tests. Document backup procedures.",
      checks: [
        { id: "GDPR-ART32-008-C1", description: "Daily backup schedule configured", status: "not-implemented" },
        { id: "GDPR-ART32-008-C2", description: "Backups are encrypted", status: "not-implemented" },
        { id: "GDPR-ART32-008-C3", description: "Weekly restore tests performed", status: "not-implemented" },
        { id: "GDPR-ART32-008-C4", description: "Monthly recovery tests documented", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART32-009",
      name: "Regular Security Testing",
      description: "Conduct regular testing, assessment, and evaluation of security measures.",
      category: "security-testing",
      framework: "GDPR",
      article: "Article 32(1)(d)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Run dependency scans (Trivy, Dependabot). Perform secret scanning (Gitleaks). Use SAST (Semgrep). Schedule penetration tests. Generate SBOM for supply-chain visibility.",
      checks: [
        { id: "GDPR-ART32-009-C1", description: "Dependency scanning in CI/CD", status: "not-implemented" },
        { id: "GDPR-ART32-009-C2", description: "Secret scanning in CI/CD", status: "not-implemented" },
        { id: "GDPR-ART32-009-C3", description: "SAST analysis integrated", status: "not-implemented" },
        { id: "GDPR-ART32-009-C4", description: "Penetration test schedule defined", status: "not-implemented" },
        { id: "GDPR-ART32-009-C5", description: "SBOM generated and scanned for vulnerabilities", status: "not-implemented" }
      ]
    }
  ];
}

// ../compliance-engine/dist/article-33.js
function createArticle33Controls() {
  return [
    {
      id: "GDPR-ART33-001",
      name: "Data Breach Notification to Authority",
      description: "Notify the supervisory authority of a personal data breach within 72 hours.",
      category: "incident-response",
      framework: "GDPR",
      article: "Article 33(1)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create a breach notification procedure. Define escalation paths. Prepare notification templates. Maintain contact details for supervisory authorities.",
      checks: [
        { id: "GDPR-ART33-001-C1", description: "Breach notification procedure documented", status: "not-implemented" },
        { id: "GDPR-ART33-001-C2", description: "72-hour notification timeline achievable", status: "not-implemented" },
        { id: "GDPR-ART33-001-C3", description: "Supervisory authority contacts maintained", status: "not-implemented" }
      ]
    },
    {
      id: "GDPR-ART33-002",
      name: "Breach Documentation",
      description: "Document all data breaches including facts, effects, and remedial actions.",
      category: "incident-response",
      framework: "GDPR",
      article: "Article 33(4)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Maintain a breach register. Record: nature of breach, categories and number of data subjects, likely consequences, and measures taken.",
      checks: [
        { id: "GDPR-ART33-002-C1", description: "Breach register maintained", status: "not-implemented" },
        { id: "GDPR-ART33-002-C2", description: "All required breach details documented", status: "not-implemented" }
      ]
    }
  ];
}

// ../compliance-engine/dist/article-34.js
function createArticle34Controls() {
  return [
    {
      id: "GDPR-ART34-001",
      name: "Data Breach Communication to Data Subjects",
      description: "Communicate personal data breaches to affected data subjects when likely to result in high risk.",
      category: "incident-response",
      framework: "GDPR",
      article: "Article 34(1)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Prepare data subject notification templates. Define criteria for high-risk breaches. Establish communication channels.",
      checks: [
        { id: "GDPR-ART34-001-C1", description: "Data subject notification templates prepared", status: "not-implemented" },
        { id: "GDPR-ART34-001-C2", description: "High-risk criteria defined", status: "not-implemented" },
        { id: "GDPR-ART34-001-C3", description: "Communication channels established", status: "not-implemented" }
      ]
    }
  ];
}

// ../compliance-engine/dist/index.js
function createGDPRControls() {
  return [
    ...createArticle5Controls(),
    ...createArticle25Controls(),
    ...createArticle30Controls(),
    ...createArticle32Controls(),
    ...createArticle33Controls(),
    ...createArticle34Controls()
  ];
}

// ../policy-engine/dist/packs/gdpr.js
function createGDPRPolicyPack() {
  return {
    id: "gdpr",
    name: "GDPR Compliance Pack",
    description: "General Data Protection Regulation controls covering Articles 5, 25, 30, 32, 33, and 34.",
    version: "1.0.0",
    project_types: [
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
      "mobile-application"
    ],
    controls: createGDPRControls(),
    frameworks: ["GDPR"]
  };
}

// ../policy-engine/dist/packs/owasp.js
function createOWASPPolicyPack() {
  const controls = [
    {
      id: "OWASP-ASVS-001",
      name: "Input Validation",
      description: "Verify that all input data is validated, filtered, or sanitized.",
      category: "validation",
      framework: "OWASP",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Validate all inputs on the server side. Use allowlists over denylists. Implement schema validation (Zod, Joi).",
      checks: [
        { id: "OWASP-ASVS-001-C1", description: "Server-side input validation implemented", status: "not-implemented" },
        { id: "OWASP-ASVS-001-C2", description: "Schema validation library in use", status: "not-implemented" }
      ]
    },
    {
      id: "OWASP-ASVS-002",
      name: "Output Encoding",
      description: "Verify that output encoding prevents XSS and injection attacks.",
      category: "validation",
      framework: "OWASP",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Encode output appropriate to context (HTML, JavaScript, URL, CSS). Use framework-provided escaping.",
      checks: [
        { id: "OWASP-ASVS-002-C1", description: "Output encoding implemented", status: "not-implemented" },
        { id: "OWASP-ASVS-002-C2", description: "Content-Security-Policy headers configured", status: "not-implemented" }
      ]
    },
    {
      id: "OWASP-ASVS-003",
      name: "Authentication Security",
      description: "Verify that authentication uses strong mechanisms.",
      category: "authentication",
      framework: "OWASP",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement MFA. Use Argon2id for hashing. Implement account lockout. Use rate limiting.",
      checks: [
        { id: "OWASP-ASVS-003-C1", description: "MFA implemented", status: "not-implemented" },
        { id: "OWASP-ASVS-003-C2", description: "Secure password hashing (Argon2id)", status: "not-implemented" },
        { id: "OWASP-ASVS-003-C3", description: "Account lockout implemented", status: "not-implemented" },
        { id: "OWASP-ASVS-003-C4", description: "Rate limiting on authentication endpoints", status: "not-implemented" }
      ]
    },
    {
      id: "OWASP-ASVS-004",
      name: "Access Control",
      description: "Verify that access controls enforce least privilege and deny by default.",
      category: "authorization",
      framework: "OWASP",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement RBAC. Enforce deny-by-default. Validate authorization on every request.",
      checks: [
        { id: "OWASP-ASVS-004-C1", description: "RBAC implemented", status: "not-implemented" },
        { id: "OWASP-ASVS-004-C2", description: "Deny-by-default enforced", status: "not-implemented" },
        { id: "OWASP-ASVS-004-C3", description: "Authorization checked on every request", status: "not-implemented" }
      ]
    },
    {
      id: "OWASP-ASVS-005",
      name: "Secrets Management",
      description: "Verify that secrets are properly managed and never stored in source code.",
      category: "secrets",
      framework: "OWASP",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Use vault or secret management. Never commit secrets. Use environment variables. Rotate secrets regularly.",
      checks: [
        { id: "OWASP-ASVS-005-C1", description: "No secrets in source code", status: "not-implemented" },
        { id: "OWASP-ASVS-005-C2", description: "Secret management solution in use", status: "not-implemented" },
        { id: "OWASP-ASVS-005-C3", description: "Secret rotation policy defined", status: "not-implemented" }
      ]
    },
    {
      id: "OWASP-ASVS-006",
      name: "Secure Communications",
      description: "Verify that all communications use TLS 1.2+.",
      category: "encryption",
      framework: "OWASP",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Enforce TLS 1.2 minimum. Configure HSTS. Disable insecure protocols.",
      checks: [
        { id: "OWASP-ASVS-006-C1", description: "TLS 1.2+ enforced", status: "not-implemented" },
        { id: "OWASP-ASVS-006-C2", description: "HSTS configured", status: "not-implemented" }
      ]
    }
  ];
  return {
    id: "owasp",
    name: "OWASP ASVS Policy Pack",
    description: "OWASP Application Security Verification Standard controls.",
    version: "1.0.0",
    project_types: [
      "saas",
      "ai-application",
      "healthcare-system",
      "event-platform",
      "photo-storage-platform",
      "vulnerability-scanner",
      "generic-web-application",
      "api-backend",
      "mobile-application"
    ],
    controls,
    frameworks: ["OWASP"]
  };
}

// ../policy-engine/dist/packs/ai.js
function createAIPolicyPack() {
  const controls = [
    {
      id: "AI-001",
      name: "Prompt Logging",
      description: "Log all AI prompts and interactions for audit purposes.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement logging of all prompts sent to AI models. Store prompts securely with access controls. Define retention periods.",
      checks: [
        { id: "AI-001-C1", description: "Prompt logging system implemented", status: "not-implemented" },
        { id: "AI-001-C2", description: "Logs stored securely", status: "not-implemented" },
        { id: "AI-001-C3", description: "Retention period defined", status: "not-implemented" }
      ]
    },
    {
      id: "AI-002",
      name: "Output Validation",
      description: "Validate AI outputs before presenting to users or taking actions.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement output filtering and validation. Check for PII leakage. Validate against safety guidelines.",
      checks: [
        { id: "AI-002-C1", description: "Output validation pipeline implemented", status: "not-implemented" },
        { id: "AI-002-C2", description: "PII detection on outputs", status: "not-implemented" }
      ]
    },
    {
      id: "AI-003",
      name: "PII Detection",
      description: "Detect and protect personal data in AI inputs and outputs.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement PII detection before sending to external AI providers. Redact or pseudonymise detected PII.",
      checks: [
        { id: "AI-003-C1", description: "PII detection on inputs", status: "not-implemented" },
        { id: "AI-003-C2", description: "PII redaction/pseudonymisation implemented", status: "not-implemented" }
      ]
    },
    {
      id: "AI-004",
      name: "AI Rate Limiting",
      description: "Implement rate limiting on AI endpoints.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement per-user and per-IP rate limiting on AI endpoints. Define usage quotas.",
      checks: [
        { id: "AI-004-C1", description: "Rate limiting on AI endpoints", status: "not-implemented" },
        { id: "AI-004-C2", description: "Usage quotas defined", status: "not-implemented" }
      ]
    },
    {
      id: "AI-005",
      name: "Data Classification for AI",
      description: "Classify data before processing through AI systems.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement data classification checks before AI processing. Restrict restricted/confidential data from external AI providers.",
      checks: [
        { id: "AI-005-C1", description: "Data classification before AI processing", status: "not-implemented" },
        { id: "AI-005-C2", description: "Restricted data blocked from external AI", status: "not-implemented" }
      ]
    },
    {
      id: "AI-006",
      name: "Prevent Unauthorized Data Transfer to External AI",
      description: "Prevent unauthorized transfer of personal data to external AI providers.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement data loss prevention for AI API calls. Review and approve AI providers. Document data processing agreements.",
      checks: [
        { id: "AI-006-C1", description: "DLP controls for AI API calls", status: "not-implemented" },
        { id: "AI-006-C2", description: "AI providers reviewed and approved", status: "not-implemented" },
        { id: "AI-006-C3", description: "DPAs with AI providers signed", status: "not-implemented" }
      ]
    }
  ];
  return {
    id: "ai",
    name: "AI System Policy Pack",
    description: "Controls for LLMs, Agents, MCP, and RAG systems.",
    version: "1.0.0",
    project_types: ["ai-application", "mcp-server"],
    controls,
    frameworks: ["GDPR"]
  };
}

// ../policy-engine/dist/packs/blockchain.js
function createBlockchainPolicyPack() {
  const controls = [
    {
      id: "BC-001",
      name: "Cryptographic Signatures",
      description: "All on-chain operations must use cryptographic signatures.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement wallet-based transaction signing. Verify signatures before on-chain operations.",
      checks: [
        { id: "BC-001-C1", description: "Cryptographic signing implemented", status: "not-implemented" },
        { id: "BC-001-C2", description: "Signature verification on all operations", status: "not-implemented" }
      ]
    },
    {
      id: "BC-002",
      name: "Validator Identity Verification",
      description: "Validators must be identity-verified.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement KYC for validators. Maintain identity verification records.",
      checks: [
        { id: "BC-002-C1", description: "Validator identity verification process", status: "not-implemented" }
      ]
    },
    {
      id: "BC-003",
      name: "Key Rotation",
      description: "Implement regular key rotation for blockchain operations.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Define key rotation schedule. Automate rotation where possible. Maintain key history.",
      checks: [
        { id: "BC-003-C1", description: "Key rotation schedule defined", status: "not-implemented" },
        { id: "BC-003-C2", description: "Rotation automation implemented", status: "not-implemented" }
      ]
    },
    {
      id: "BC-004",
      name: "Encrypted Payload Support",
      description: "Support encrypted payloads for sensitive on-chain data.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Encrypt sensitive data before storing on-chain. Use hybrid encryption schemes.",
      checks: [
        { id: "BC-004-C1", description: "Encrypted payload support implemented", status: "not-implemented" },
        { id: "BC-004-C2", description: "No plaintext personal data on-chain", status: "not-implemented" }
      ]
    },
    {
      id: "BC-005",
      name: "Immutable Audit Trails",
      description: "Maintain immutable audit trails for all blockchain operations.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Use blockchain immutability for audit logs. Store hashes and CIDs. Keep references off-chain.",
      checks: [
        { id: "BC-005-C1", description: "Audit trail mechanism implemented", status: "not-implemented" },
        { id: "BC-005-C2", description: "Hashes stored on-chain, data off-chain", status: "not-implemented" }
      ]
    },
    {
      id: "BC-006",
      name: "No Plaintext Personal Data On-Chain",
      description: "Never store plaintext personal data on-chain. Store only hashes, CIDs, references, and encrypted metadata.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Store only hashes (SHA-256+), CIDs, references, or encrypted metadata on-chain. Keep actual data in encrypted off-chain storage.",
      checks: [
        { id: "BC-006-C1", description: "Only hashes/CIDs/references on-chain", status: "not-implemented" },
        { id: "BC-006-C2", description: "Encrypted metadata for on-chain records", status: "not-implemented" }
      ]
    }
  ];
  return {
    id: "blockchain",
    name: "Blockchain Policy Pack",
    description: "Controls for blockchain, wallets, and government ledgers.",
    version: "1.0.0",
    project_types: ["blockchain", "wallet"],
    controls,
    frameworks: ["GDPR"]
  };
}

// ../policy-engine/dist/packs/government.js
function createGovernmentPolicyPack() {
  const controls = [
    {
      id: "GOV-001",
      name: "Data Sovereignty",
      description: "Ensure all data processing occurs within designated jurisdictions.",
      category: "government",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Deploy infrastructure in required jurisdictions. Implement geo-fencing for data storage. Verify cloud provider compliance.",
      checks: [
        { id: "GOV-001-C1", description: "Infrastructure in required jurisdictions", status: "not-implemented" },
        { id: "GOV-001-C2", description: "Geo-fencing implemented", status: "not-implemented" },
        { id: "GOV-001-C3", description: "Cloud provider compliance verified", status: "not-implemented" }
      ]
    },
    {
      id: "GOV-002",
      name: "Chain of Custody",
      description: "Maintain complete chain of custody for all data processing.",
      category: "government",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Log all data access and transfers. Maintain custody records. Implement digital signatures on records.",
      checks: [
        { id: "GOV-002-C1", description: "Chain of custody logging implemented", status: "not-implemented" },
        { id: "GOV-002-C2", description: "Digital signatures on custody records", status: "not-implemented" }
      ]
    },
    {
      id: "GOV-003",
      name: "Tamper Evidence",
      description: "Implement tamper detection for all records and data.",
      category: "government",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Use cryptographic hashing for integrity verification. Implement merkle trees for batch verification. Use write-once storage.",
      checks: [
        { id: "GOV-003-C1", description: "Tamper detection implemented", status: "not-implemented" },
        { id: "GOV-003-C2", description: "Integrity verification on read", status: "not-implemented" }
      ]
    },
    {
      id: "GOV-004",
      name: "Record Integrity Verification",
      description: "Enable verification of record integrity at any point.",
      category: "government",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Store integrity hashes with records. Provide verification APIs. Schedule regular integrity checks.",
      checks: [
        { id: "GOV-004-C1", description: "Integrity hashes stored with records", status: "not-implemented" },
        { id: "GOV-004-C2", description: "Verification API available", status: "not-implemented" },
        { id: "GOV-004-C3", description: "Regular integrity checks scheduled", status: "not-implemented" }
      ]
    },
    {
      id: "GOV-005",
      name: "Auditability",
      description: "Ensure all actions are fully auditable.",
      category: "government",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement comprehensive audit logging. Ensure logs are immutable. Provide audit trail export capabilities.",
      checks: [
        { id: "GOV-005-C1", description: "Comprehensive audit logging", status: "not-implemented" },
        { id: "GOV-005-C2", description: "Immutable log storage", status: "not-implemented" },
        { id: "GOV-005-C3", description: "Audit trail export capability", status: "not-implemented" }
      ]
    }
  ];
  return {
    id: "government",
    name: "Government Policy Pack",
    description: "Additional controls for government systems including data sovereignty and chain of custody.",
    version: "1.0.0",
    project_types: ["government-system"],
    controls,
    frameworks: ["GDPR"]
  };
}

// ../policy-engine/dist/packs/cis.js
function createCISPolicyPack() {
  const controls = [
    {
      id: "CIS-001",
      name: "Inventory of Authorized and Unauthorized Devices",
      description: "Maintain an inventory of all devices authorized to access organizational data.",
      category: "asset-management",
      framework: "CIS",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Maintain device inventory. Implement MDM. Monitor for unauthorized devices.",
      checks: [
        { id: "CIS-001-C1", description: "Device inventory maintained", status: "not-implemented" },
        { id: "CIS-001-C2", description: "Unauthorized device detection", status: "not-implemented" }
      ]
    },
    {
      id: "CIS-002",
      name: "Inventory of Authorized and Unauthorized Software",
      description: "Maintain a software inventory via SBOM generation and scanning.",
      category: "asset-management",
      framework: "CIS",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Generate SBOM in CycloneDX or SPDX format using Syft or Trivy. Scan SBOM for vulnerabilities using Grype. Automate SBOM generation in CI/CD pipeline. Store SBOM artifacts alongside release artifacts.",
      checks: [
        { id: "CIS-002-C1", description: "Software inventory (SBOM) maintained", status: "not-implemented" },
        { id: "CIS-002-C2", description: "Dependency scanning implemented", status: "not-implemented" },
        { id: "CIS-002-C3", description: "SBOM generated in CycloneDX or SPDX format", status: "not-implemented" },
        { id: "CIS-002-C4", description: "SBOM vulnerability scanning configured", status: "not-implemented" },
        { id: "CIS-002-C5", description: "SBOM generation automated in CI/CD", status: "not-implemented" }
      ]
    },
    {
      id: "CIS-003",
      name: "Secure Configuration",
      description: "Establish and maintain secure configuration for all hardware and software.",
      category: "configuration",
      framework: "CIS",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Use infrastructure-as-code. Implement configuration management. Regular configuration audits.",
      checks: [
        { id: "CIS-003-C1", description: "Secure baseline configurations defined", status: "not-implemented" },
        { id: "CIS-003-C2", description: "Configuration drift detection", status: "not-implemented" }
      ]
    },
    {
      id: "CIS-004",
      name: "Continuous Vulnerability Management",
      description: "Continuously assess and remediate vulnerabilities.",
      category: "vulnerability-management",
      framework: "CIS",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Automated vulnerability scanning in CI/CD. Regular penetration testing. Remediation SLAs defined.",
      checks: [
        { id: "CIS-004-C1", description: "Automated vulnerability scanning", status: "not-implemented" },
        { id: "CIS-004-C2", description: "Remediation SLAs defined", status: "not-implemented" }
      ]
    },
    {
      id: "CIS-005",
      name: "Controlled Use of Administrative Privileges",
      description: "Control and monitor access to administrative privileges.",
      category: "access-control",
      framework: "CIS",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement RBAC. Use least privilege. Audit all admin actions. Require MFA for admin access.",
      checks: [
        { id: "CIS-005-C1", description: "RBAC implemented", status: "not-implemented" },
        { id: "CIS-005-C2", description: "MFA required for admin access", status: "not-implemented" },
        { id: "CIS-005-C3", description: "Admin action audit logging", status: "not-implemented" }
      ]
    }
  ];
  return {
    id: "cis",
    name: "CIS Controls Policy Pack",
    description: "Center for Internet Security Controls.",
    version: "1.0.0",
    project_types: [
      "saas",
      "healthcare-system",
      "generic-web-application",
      "government-system"
    ],
    controls,
    frameworks: ["CIS"]
  };
}

// ../policy-engine/dist/packs/nist.js
function createNISTPolicyPack() {
  const controls = [
    {
      id: "NIST-ID-001",
      name: "Identity Management",
      description: "Manage identities and access to organizational resources.",
      category: "identify",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement centralized identity management. Use SSO. Automate user provisioning and deprovisioning.",
      checks: [
        { id: "NIST-ID-001-C1", description: "Centralized identity management", status: "not-implemented" },
        { id: "NIST-ID-001-C2", description: "SSO implemented", status: "not-implemented" }
      ]
    },
    {
      id: "NIST-PR-001",
      name: "Access Control",
      description: "Implement access control policies and mechanisms.",
      category: "protect",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement RBAC or ABAC. Enforce least privilege. Regular access reviews.",
      checks: [
        { id: "NIST-PR-001-C1", description: "Access control model implemented", status: "not-implemented" },
        { id: "NIST-PR-001-C2", description: "Regular access reviews scheduled", status: "not-implemented" }
      ]
    },
    {
      id: "NIST-PR-002",
      name: "Data Security",
      description: "Protect data at rest and in transit.",
      category: "protect",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Encrypt data at rest (AES-256). Encrypt data in transit (TLS 1.2+). Classify data.",
      checks: [
        { id: "NIST-PR-002-C1", description: "Data encryption at rest", status: "not-implemented" },
        { id: "NIST-PR-002-C2", description: "Data encryption in transit", status: "not-implemented" },
        { id: "NIST-PR-002-C3", description: "Data classification implemented", status: "not-implemented" }
      ]
    },
    {
      id: "NIST-DE-001",
      name: "Security Monitoring",
      description: "Monitor for security events and anomalies.",
      category: "detect",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement centralized logging. Use SIEM or similar. Define alert thresholds.",
      checks: [
        { id: "NIST-DE-001-C1", description: "Centralized logging implemented", status: "not-implemented" },
        { id: "NIST-DE-001-C2", description: "Security alerting configured", status: "not-implemented" }
      ]
    },
    {
      id: "NIST-RS-001",
      name: "Incident Response",
      description: "Establish and maintain incident response capabilities.",
      category: "respond",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create incident response plan. Define roles and responsibilities. Conduct regular drills.",
      checks: [
        { id: "NIST-RS-001-C1", description: "Incident response plan documented", status: "not-implemented" },
        { id: "NIST-RS-001-C2", description: "Roles and responsibilities defined", status: "not-implemented" },
        { id: "NIST-RS-001-C3", description: "Regular drills conducted", status: "not-implemented" }
      ]
    },
    {
      id: "NIST-RC-001",
      name: "Recovery Planning",
      description: "Establish and maintain recovery plans.",
      category: "recover",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create disaster recovery plan. Define RTO and RPO. Test recovery procedures regularly.",
      checks: [
        { id: "NIST-RC-001-C1", description: "Disaster recovery plan documented", status: "not-implemented" },
        { id: "NIST-RC-001-C2", description: "RTO and RPO defined", status: "not-implemented" },
        { id: "NIST-RC-001-C3", description: "Regular recovery tests", status: "not-implemented" }
      ]
    },
    {
      id: "NIST-ID-002",
      name: "Supply Chain Risk Management",
      description: "Identify and manage supply chain risks through software Bill of Materials (SBOM).",
      category: "identify",
      framework: "NIST",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Generate SBOM for all software components using Syft or Trivy. Scan SBOM for known vulnerabilities using Grype. Automate SBOM generation in CI/CD. Enforce SBOM-based policies for third-party dependencies.",
      checks: [
        { id: "NIST-ID-002-C1", description: "SBOM generated for all dependencies", status: "not-implemented" },
        { id: "NIST-ID-002-C2", description: "SBOM vulnerability scanning automated", status: "not-implemented" },
        { id: "NIST-ID-002-C3", description: "Third-party dependency risk assessed", status: "not-implemented" }
      ]
    }
  ];
  return {
    id: "nist",
    name: "NIST Cybersecurity Framework Policy Pack",
    description: "NIST CSF controls across Identify, Protect, Detect, Respond, and Recover.",
    version: "1.0.0",
    project_types: [
      "saas",
      "healthcare-system",
      "generic-web-application",
      "government-system"
    ],
    controls,
    frameworks: ["NIST"]
  };
}

// ../policy-engine/dist/index.js
var ALL_PACKS = [
  createGDPRPolicyPack,
  createOWASPPolicyPack,
  createAIPolicyPack,
  createBlockchainPolicyPack,
  createGovernmentPolicyPack,
  createCISPolicyPack,
  createNISTPolicyPack
];
var PACK_MAP = {
  gdpr: createGDPRPolicyPack,
  owasp: createOWASPPolicyPack,
  ai: createAIPolicyPack,
  blockchain: createBlockchainPolicyPack,
  government: createGovernmentPolicyPack,
  cis: createCISPolicyPack,
  nist: createNISTPolicyPack
};
function getAllPacks() {
  return ALL_PACKS.map((fn) => fn());
}
function getPack(id) {
  const factory = PACK_MAP[id];
  return factory ? factory() : void 0;
}
function getPacksForProjectType(projectType) {
  return getAllPacks().filter((pack) => pack.project_types.includes(projectType));
}

// ../scoring-engine/dist/index.js
var SEVERITY_WEIGHTS = {
  critical: 10,
  high: 7,
  medium: 4,
  low: 1
};
var STATUS_CREDIT = {
  pass: 1,
  warning: 0.5,
  fail: 0,
  "not-implemented": 0,
  "not-applicable": 1
};
var SEVERITY_PENALTY = {
  critical: 12,
  high: 7,
  medium: 4,
  low: 1
};
function computeGrade(score) {
  if (score >= 90)
    return "A";
  if (score >= 80)
    return "B";
  if (score >= 65)
    return "C";
  if (score >= 50)
    return "D";
  return "F";
}
function emptySeverityBucket() {
  return { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 };
}
function buildSeverityBreakdown(controls) {
  const breakdown = {
    critical: emptySeverityBucket(),
    high: emptySeverityBucket(),
    medium: emptySeverityBucket(),
    low: emptySeverityBucket()
  };
  for (const c of controls) {
    const bucket = breakdown[c.severity];
    bucket.total++;
    if (c.status === "pass" || c.status === "not-applicable") {
      bucket.passed++;
    } else if (c.status === "warning") {
      bucket.warning++;
    } else if (c.status === "fail") {
      bucket.failed++;
    } else {
      bucket.not_implemented++;
    }
  }
  return breakdown;
}
function computeWeightedScore(controls) {
  if (controls.length === 0)
    return { score: 0, maxPossible: 0 };
  let earned = 0;
  let maxPossible = 0;
  for (const c of controls) {
    const weight = SEVERITY_WEIGHTS[c.severity];
    const credit = STATUS_CREDIT[c.status] ?? 0;
    earned += weight * credit;
    maxPossible += weight;
  }
  const score = maxPossible > 0 ? Math.round(earned / maxPossible * 100) : 0;
  return { score, maxPossible };
}
function countCriticalFailures(controls) {
  return controls.filter((c) => c.severity === "critical" && (c.status === "fail" || c.status === "not-implemented")).length;
}
function scoreByFramework(controls, frameworks) {
  const result = {};
  for (const fw of frameworks) {
    const fwControls = controls.filter((c) => c.framework === fw);
    const { score, maxPossible } = computeWeightedScore(fwControls);
    const breakdown = buildSeverityBreakdown(fwControls);
    const passed = fwControls.filter((c) => c.status === "pass" || c.status === "not-applicable").length;
    const failed = fwControls.filter((c) => c.status === "fail").length;
    const warning = fwControls.filter((c) => c.status === "warning").length;
    const notApplicable = fwControls.filter((c) => c.status === "not-applicable").length;
    const notImplemented = fwControls.filter((c) => c.status === "not-implemented").length;
    const criticalFailures = countCriticalFailures(fwControls);
    let adjustedScore = score;
    if (criticalFailures > 0 && adjustedScore > 0) {
      const cap = Math.max(0, 75 - criticalFailures * 8);
      adjustedScore = Math.min(adjustedScore, cap);
    }
    result[fw] = {
      framework: fw,
      score: adjustedScore,
      grade: computeGrade(adjustedScore),
      total_controls: fwControls.length,
      passed_controls: passed,
      failed_controls: failed,
      warning_controls: warning,
      not_applicable: notApplicable,
      not_implemented: notImplemented,
      severity_breakdown: breakdown,
      critical_failures: criticalFailures,
      max_possible_score: maxPossible,
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  return result;
}
function computeAuditImpact(findings) {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const medium = findings.filter((f) => f.severity === "medium").length;
  const low = findings.filter((f) => f.severity === "low").length;
  const totalDeduction = Math.min(100, critical * SEVERITY_PENALTY.critical + high * SEVERITY_PENALTY.high + medium * SEVERITY_PENALTY.medium + low * SEVERITY_PENALTY.low);
  return {
    total_deduction: totalDeduction,
    critical_findings: critical,
    high_findings: high,
    medium_findings: medium,
    low_findings: low
  };
}
function computeOverallScore(frameworkScores) {
  const scores = Object.values(frameworkScores);
  if (scores.length === 0)
    return 0;
  let totalWeight = 0;
  let weightedSum = 0;
  for (const s of scores) {
    const weight = Math.max(1, s.total_controls);
    weightedSum += s.score * weight;
    totalWeight += weight;
  }
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}
function generateScoreFile(controls, frameworks, findings) {
  const frameworkScores = scoreByFramework(controls, frameworks);
  let overall = computeOverallScore(frameworkScores);
  let auditImpact;
  if (findings && findings.length > 0) {
    auditImpact = computeAuditImpact(findings);
    overall = Math.max(0, overall - auditImpact.total_deduction);
  }
  return {
    overall,
    overall_grade: computeGrade(overall),
    frameworks: frameworkScores,
    audit_impact: auditImpact,
    evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function formatScoreOutput(score) {
  const lines = [];
  lines.push("");
  lines.push("  \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557");
  lines.push("  \u2551         COMPLIANCE SCORE REPORT              \u2551");
  lines.push("  \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D");
  lines.push("");
  for (const [fw, data] of Object.entries(score.frameworks)) {
    const padding = Math.max(1, 20 - fw.length);
    const dots = ".".repeat(padding);
    const gradeTag = `[${data.grade}]`;
    lines.push(`  ${fw} ${dots} ${String(data.score).padStart(3)}%  ${gradeTag}`);
    if (data.critical_failures > 0) {
      lines.push(`    \u26A0  ${data.critical_failures} critical control(s) failed`);
    }
    const sb = data.severity_breakdown;
    const parts = [];
    if (sb.critical.total > 0)
      parts.push(`${sb.critical.passed}/${sb.critical.total} critical`);
    if (sb.high.total > 0)
      parts.push(`${sb.high.passed}/${sb.high.total} high`);
    if (sb.medium.total > 0)
      parts.push(`${sb.medium.passed}/${sb.medium.total} medium`);
    if (sb.low.total > 0)
      parts.push(`${sb.low.passed}/${sb.low.total} low`);
    if (parts.length > 0)
      lines.push(`    ${parts.join(" \xB7 ")}`);
  }
  lines.push("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  const overallPadding = Math.max(1, 20 - "Overall".length);
  const overallDots = ".".repeat(overallPadding);
  lines.push(`  Overall ${overallDots} ${String(score.overall).padStart(3)}%  [${score.overall_grade}]`);
  if (score.audit_impact) {
    const ai = score.audit_impact;
    lines.push("");
    lines.push("  Audit Findings Impact:");
    lines.push(`    Critical: ${ai.critical_findings}  \xB7  High: ${ai.high_findings}  \xB7  Medium: ${ai.medium_findings}  \xB7  Low: ${ai.low_findings}`);
    lines.push(`    Score deduction: -${ai.total_deduction}%`);
  }
  lines.push("");
  return lines.join("\n");
}

// ../audit-engine/dist/index.js
import * as fs from "node:fs";
import * as path from "node:path";

// ../audit-engine/dist/scanners/secrets-scanner.js
var SECRET_PATTERNS = [
  { pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{4,}/gi, name: "Hardcoded password" },
  { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{4,}/gi, name: "Hardcoded API key" },
  { pattern: /(?:secret|token|auth)\s*[:=]\s*['"][^'"]{8,}/gi, name: "Hardcoded secret/token" },
  { pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s'"]{10,}/gi, name: "Database connection string with credentials" },
  { pattern: /sk-[a-zA-Z0-9]{20,}/g, name: "OpenAI/API key pattern" },
  { pattern: /AKIA[0-9A-Z]{16}/g, name: "AWS Access Key ID" },
  { pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g, name: "Private key in source" },
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: "GitHub personal access token" },
  { pattern: /gho_[a-zA-Z0-9]{36}/g, name: "GitHub OAuth token" },
  { pattern: /glpat-[a-zA-Z0-9\-]{20,}/g, name: "GitLab personal access token" },
  { pattern: /xox[bpsa]-[a-zA-Z0-9\-]{10,}/g, name: "Slack token" },
  { pattern: /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, name: "JWT token in source" },
  { pattern: /(?:CONNECTION_STRING|DATABASE_URL|DB_PASSWORD|SECRET_KEY|PRIVATE_KEY)\s*[:=]\s*['"][^'"]{4,}/gi, name: "Sensitive environment variable with value" }
];
var IGNORE_DIRS = /* @__PURE__ */ new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  "coverage",
  ".ges",
  "vendor",
  "__pycache__",
  ".venv",
  "venv"
]);
var IGNORE_FILES = /* @__PURE__ */ new Set([
  ".gitignore",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock"
]);
var DOTENV_FILES = /^\.env(?:\.\w+)?$/;
function shouldScanFile(filePath) {
  const parts = filePath.split("/");
  if (parts.some((p) => IGNORE_DIRS.has(p)))
    return false;
  const basename2 = parts[parts.length - 1] || "";
  if (IGNORE_FILES.has(basename2))
    return false;
  if (DOTENV_FILES.test(basename2))
    return false;
  return true;
}
var SecretsScanner = class {
  name = "secrets";
  scan(ctx) {
    const findings = [];
    for (const [filePath, content] of ctx.fileContents) {
      if (!shouldScanFile(filePath))
        continue;
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const { pattern, name } of SECRET_PATTERNS) {
          pattern.lastIndex = 0;
          const match = pattern.exec(line);
          if (match) {
            findings.push({
              ruleId: "SECRETS-001",
              severity: "critical",
              category: "secrets",
              title: name,
              description: "A secret or credential was found in source code. Secrets must never be committed to repositories.",
              file: filePath,
              line: i + 1,
              evidence: maskSecret(match[0]),
              controlIds: ["OWASP-ASVS-005", "GDPR-ART32-002"],
              fix: "Move this secret to a secure vault (Vault, AWS KMS, etc.) or environment variable. Never commit secrets to source control."
            });
          }
        }
      }
    }
    return findings;
  }
};
function maskSecret(secret) {
  if (secret.length <= 8)
    return "***";
  return secret.slice(0, 4) + "***" + secret.slice(-4);
}

// ../audit-engine/dist/scanners/crypto-scanner.js
var WEAK_HASH_PATTERNS = [
  { pattern: /\bmd5\s*\(/gi, algo: "MD5" },
  { pattern: /\bsha1\s*\(/gi, algo: "SHA1" },
  { pattern: /\bcreateHash\s*\(\s*['"]md5['"]\s*\)/gi, algo: "MD5 (Node.js crypto)" },
  { pattern: /\bcreateHash\s*\(\s*['"]sha1['"]\s*\)/gi, algo: "SHA1 (Node.js crypto)" },
  { pattern: /\.digest\s*\(\s*['"]md5['"]\s*\)/gi, algo: "MD5 digest" },
  { pattern: /hashlib\.md5\(/gi, algo: "MD5 (Python)" },
  { pattern: /hashlib\.sha1\(/gi, algo: "SHA1 (Python)" }
];
var WEAK_CRYPTO_PATTERNS = [
  { pattern: /\bDES\b|\b3DES\b|\bBlowfish\b/g, algo: "Weak encryption algorithm" },
  { pattern: /\bcreateCipheriv\s*\(\s*['"]aes-128/gi, algo: "AES-128 (use AES-256)" },
  { pattern: /\bcreateCipher\b\s*\(/g, algo: "Deprecated createCipher (use createCipheriv)" },
  { pattern: /\btc_aes_encrypt\b/gi, algo: "AES-128 (use AES-256)" },
  { pattern: /\bAES.*ECB\b/gi, algo: "AES ECB mode (use GCM or CBC)" },
  { pattern: /Cipher\s*\(\s*['"]des/gi, algo: "DES cipher (deprecated)" },
  { pattern: /\btls\.connect\s*\([^)]*rejectUnauthorized\s*:\s*false/gi, algo: "TLS with certificate verification disabled" },
  { pattern: /process\.env\.NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]0['"]/gi, algo: "TLS verification globally disabled" }
];
var INSECURE_PASSWORD_PATTERNS = [
  { pattern: /\.compare\s*\(.*,\s*.*\)|bcrypt\.compare|argon2\.verify/gi, check: false, desc: "Secure password comparison" },
  { pattern: /(?:stored|saved|hashed|db|database)\s*\.?\s*(?:password|pw)\s*===?\s*(?:req|input|user|plain|raw)/gi, check: true, desc: "Plaintext password comparison (use Argon2id/bcrypt)" },
  { pattern: /(?:password|pw)\s*===?\s*['"][^'"]{2,}['"]/gi, check: true, desc: "Hardcoded password comparison (use Argon2id/bcrypt)" }
];
var SCAN_EXTENSIONS = /* @__PURE__ */ new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php", ".cs"]);
var CryptoScanner = class {
  name = "crypto";
  scan(ctx) {
    const findings = [];
    for (const [filePath, content] of ctx.fileContents) {
      const ext = filePath.substring(filePath.lastIndexOf("."));
      if (!SCAN_EXTENSIONS.has(ext))
        continue;
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const { pattern, algo } of WEAK_HASH_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "CRYPTO-001",
              severity: "critical",
              category: "authentication",
              title: `Weak hashing algorithm: ${algo}`,
              description: `${algo} is cryptographically broken and must not be used for passwords or security-sensitive operations. Use Argon2id for passwords, SHA-256+ for general hashing.`,
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["GDPR-ART32-004", "OWASP-ASVS-003"],
              fix: `Replace ${algo} with Argon2id (passwords) or SHA-256+ (general hashing).`
            });
          }
        }
        for (const { pattern, algo } of WEAK_CRYPTO_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "CRYPTO-002",
              severity: "high",
              category: "encryption",
              title: `Insecure encryption: ${algo}`,
              description: `${algo} is not approved for use. Use AES-256-GCM or ChaCha20-Poly1305.`,
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["GDPR-ART32-002", "GDPR-ART32-003"],
              fix: "Replace with AES-256-GCM or ChaCha20-Poly1305 for data at rest, TLS 1.3 for data in transit."
            });
          }
        }
        for (const { pattern, check, desc } of INSECURE_PASSWORD_PATTERNS) {
          pattern.lastIndex = 0;
          if (check && pattern.test(line)) {
            findings.push({
              ruleId: "CRYPTO-003",
              severity: "critical",
              category: "authentication",
              title: desc,
              description: "Passwords must be hashed using Argon2id before comparison. Never compare plaintext passwords.",
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["GDPR-ART32-004", "OWASP-ASVS-003"],
              fix: "Use argon2.verify(hashedPassword, inputPassword) for password comparison."
            });
          }
        }
      }
    }
    return findings;
  }
};

// ../audit-engine/dist/scanners/code-security-scanner.js
var SQL_INJECTION_PATTERNS = [
  { pattern: /(?:query|execute|raw|sql)\s*\(\s*[`"'].*\+\s*(?:req|params|query|body|input|request)/gi, desc: "SQL query with string concatenation from user input" },
  { pattern: /(?:query|execute|raw|sql)\s*\(\s*[`"'].*\$\{(?:req|params|query|body)/gi, desc: "SQL query with template literal injection" },
  { pattern: /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL SELECT with concatenated user input" },
  { pattern: /INSERT\s+INTO\s+.*VALUES\s*\(.*\+\s*(?:req|params|query|body)/gi, desc: "SQL INSERT with concatenated user input" },
  { pattern: /DELETE\s+FROM\s+.*WHERE\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL DELETE with concatenated user input" },
  { pattern: /UPDATE\s+.*SET\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL UPDATE with concatenated user input" }
];
var XSS_PATTERNS = [
  { pattern: /innerHTML\s*=\s*(?:req|params|query|body|input)/gi, desc: "Direct innerHTML assignment from user input" },
  { pattern: /document\.write\s*\(\s*(?:req|params|query|body)/gi, desc: "document.write with user input" },
  { pattern: /v-html\s*=\s*(?:req|params|query|body|input)/gi, desc: "Vue v-html with user input" },
  { pattern: /dangerouslySetInnerHTML\s*=\s*\{.*(?:req|params|query|body)/gi, desc: "React dangerouslySetInnerHTML with user input" },
  { pattern: /\.html\s*\(\s*(?:req|params|query|body)/gi, desc: "jQuery .html() with user input" }
];
var INPUT_VALIDATION_PATTERNS = [
  { pattern: /(?:parseInt|parseFloat|Number)\s*\(\s*req\.(?:body|params|query)/gi, desc: "Unvalidated number parsing from request" },
  { pattern: new RegExp(["e", "v", "a", "l"].join("") + "\\s*\\(\\s*(?:req|params|query|body|input)", "gi"), desc: ["e", "v", "a", "l"].join("") + "() with user input - critical RCE risk" },
  { pattern: new RegExp(["F", "u", "n", "c", "t", "i", "o", "n"].join("") + "\\s*\\(\\s*(?:req|params|query|body)", "gi"), desc: ["F", "u", "n", "c", "t", "i", "o", "n"].join("") + " constructor with user input" },
  { pattern: /exec\s*\(\s*(?:req|params|query|body)/gi, desc: "Command execution with user input" },
  { pattern: /child_process.*(?:req|params|query|body)/gi, desc: "Child process with user input" }
];
var SCAN_EXTENSIONS2 = /* @__PURE__ */ new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"]);
var CodeSecurityScanner = class {
  name = "code-security";
  scan(ctx) {
    const findings = [];
    for (const [filePath, content] of ctx.fileContents) {
      const ext = filePath.substring(filePath.lastIndexOf("."));
      if (!SCAN_EXTENSIONS2.has(ext))
        continue;
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const { pattern, desc } of SQL_INJECTION_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "INJECT-001",
              severity: "critical",
              category: "injection",
              title: "SQL Injection vulnerability",
              description: desc + ". Use parameterized queries or an ORM.",
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["OWASP-ASVS-001", "GDPR-ART5-006"],
              fix: "Use parameterized queries: db.query('SELECT * FROM users WHERE id = $1', [req.query.id])"
            });
          }
        }
        for (const { pattern, desc } of XSS_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "INJECT-002",
              severity: "critical",
              category: "xss",
              title: "Cross-Site Scripting (XSS) vulnerability",
              description: desc + ". Sanitize all user input before rendering.",
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["OWASP-ASVS-002", "GDPR-ART5-006"],
              fix: "Use textContent instead of innerHTML, or sanitize input with a library like DOMPurify."
            });
          }
        }
        for (const { pattern, desc } of INPUT_VALIDATION_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "INJECT-003",
              severity: "critical",
              category: "injection",
              title: "Code injection risk",
              description: desc + ". Never pass user input to code execution functions.",
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["OWASP-ASVS-001"],
              fix: "Remove " + ["e", "v", "a", "l"].join("") + "/exec usage with user input. Use safe alternatives."
            });
          }
        }
      }
    }
    return findings;
  }
};

// ../audit-engine/dist/scanners/auth-scanner.js
var SCAN_EXTENSIONS3 = /* @__PURE__ */ new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"]);
var AuthScanner = class {
  name = "auth";
  scan(ctx) {
    const findings = [];
    const content = ctx.fileContents;
    if (!ctx.isWebProject)
      return findings;
    const hasAuthMiddleware = this.detectAuthMiddleware(content);
    const routesWithoutAuth = this.detectRoutesWithoutAuth(content, hasAuthMiddleware);
    const hasRateLimiting = this.detectRateLimiting(content);
    const hasSessionConfig = this.detectSessionConfig(content);
    const hasCORSSettings = this.detectCORSSettings(content);
    if (routesWithoutAuth.length > 0) {
      for (const route of routesWithoutAuth.slice(0, 20)) {
        findings.push({
          ruleId: "AUTH-001",
          severity: "high",
          category: "authentication",
          title: "Route without authentication",
          description: `Endpoint ${route.method} ${route.path} does not require authentication. All endpoints handling personal data must require auth.`,
          file: route.file,
          line: route.line,
          evidence: route.evidence,
          controlIds: ["GDPR-ART32-004", "OWASP-ASVS-003", "OWASP-ASVS-004"],
          fix: "Add authentication middleware to this route or apply globally."
        });
      }
    }
    if (!hasRateLimiting) {
      findings.push({
        ruleId: "AUTH-002",
        severity: "high",
        category: "authentication",
        title: "No rate limiting detected",
        description: "No rate limiting library or configuration found. Rate limiting is required on authentication endpoints and API routes.",
        file: "project",
        evidence: "No rate limiter (express-rate-limit, etc.) found in codebase",
        controlIds: ["GDPR-ART32-004", "OWASP-ASVS-003"],
        fix: "Install and configure rate limiting: npm install express-rate-limit"
      });
    }
    if (!hasSessionConfig) {
      findings.push({
        ruleId: "AUTH-003",
        severity: "medium",
        category: "authentication",
        title: "No session timeout configuration detected",
        description: "No session expiration or timeout configuration found. Sessions must expire after a period of inactivity.",
        file: "project",
        evidence: "No session timeout configuration found",
        controlIds: ["GDPR-ART32-005"],
        fix: "Configure session expiration: maxAge, idle timeout, or JWT expiration."
      });
    }
    if (hasCORSSettings === "wildcard") {
      findings.push({
        ruleId: "AUTH-004",
        severity: "high",
        category: "security",
        title: "CORS configured as wildcard (*)",
        description: "CORS is set to allow all origins. This is insecure for production. Restrict to known origins.",
        file: "project",
        evidence: "cors({ origin: '*' }) or Access-Control-Allow-Origin: *",
        controlIds: ["OWASP-ASVS-006"],
        fix: "Restrict CORS to specific origins: cors({ origin: ['https://yourdomain.com'] })"
      });
    }
    if (!this.detectMFA(content)) {
      findings.push({
        ruleId: "AUTH-005",
        severity: "high",
        category: "authentication",
        title: "No MFA implementation detected",
        description: "No multi-factor authentication implementation found. MFA is mandatory per GDPR Article 32.",
        file: "project",
        evidence: "No MFA/2FA/OTP/TOTP library found in dependencies or code",
        controlIds: ["GDPR-ART32-004"],
        fix: "Implement MFA using TOTP (otpauth, speakeasy) or WebAuthn."
      });
    }
    return findings;
  }
  detectAuthMiddleware(content) {
    const authIndicators = [
      /jwt\.verify|jsonwebtoken|jwtDecode/i,
      /passport\.use|passport\.authenticate/i,
      /authMiddleware|authGuard|requireAuth|isAuthenticated/i,
      /session\s*\(\s*{/i,
      /bearer\s+token/i,
      /firebase.*auth/i,
      /nextAuth|next-auth/i,
      /supabase.*auth/i,
      /clerk/i,
      /auth0/i
    ];
    return this.searchPatterns(content, authIndicators);
  }
  detectRoutesWithoutAuth(content, hasGlobalAuth) {
    const routes = [];
    if (hasGlobalAuth)
      return routes;
    const routePattern = /(?:app|router|route)\s*\.\s*(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]*)/gi;
    for (const [filePath, fileContent] of content) {
      const ext = filePath.substring(filePath.lastIndexOf("."));
      if (!SCAN_EXTENSIONS3.has(ext))
        continue;
      const lines = fileContent.split("\n");
      for (let i = 0; i < lines.length; i++) {
        routePattern.lastIndex = 0;
        const match = routePattern.exec(lines[i]);
        if (match) {
          const path4 = match[2];
          const publicPaths = ["/", "/health", "/healthz", "/status", "/ping", "/ready", "/readiness", "/version", "/public"];
          if (!publicPaths.some((p) => path4 === p)) {
            routes.push({
              method: match[1].toUpperCase(),
              path: path4,
              file: filePath,
              line: i + 1,
              evidence: lines[i].trim()
            });
          }
        }
      }
    }
    return routes;
  }
  detectRateLimiting(content) {
    return this.searchPatterns(content, [
      /rate.?limit/i,
      /rateLimit|rate-limit/i,
      /express-rate-limit/i,
      /throttl/i
    ]);
  }
  detectSessionConfig(content) {
    return this.searchPatterns(content, [
      /session\s*\(\s*{[^}]*maxAge/i,
      /maxAge\s*[:=]/i,
      /expiresIn\s*[:=]/i,
      /expires\s*[:=]/i,
      /cookie\s*:\s*{[^}]*maxAge/i,
      /idleTimeout/i
    ]);
  }
  detectCORSSettings(content) {
    for (const [, fileContent] of content) {
      if (/cors\s*\(\s*{[^}]*origin\s*:\s*['"]\*['"]/s.test(fileContent) || /Access-Control-Allow-Origin\s*:\s*\*/i.test(fileContent)) {
        return "wildcard";
      }
      if (/cors\s*\(/i.test(fileContent) || /Access-Control-Allow/i.test(fileContent)) {
        return "configured";
      }
    }
    return "none";
  }
  detectMFA(content) {
    return this.searchPatterns(content, [
      /mfa|multi.?factor|2fa|two.?factor/i,
      /totp|otpauth|speakeasy|otplib/i,
      /webauthn|fido2|passkey/i,
      /authenticator/i
    ]);
  }
  searchPatterns(content, patterns) {
    for (const [, fileContent] of content) {
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(fileContent))
          return true;
      }
    }
    return false;
  }
};

// ../audit-engine/dist/scanners/config-scanner.js
var ConfigScanner = class {
  name = "config";
  scan(ctx) {
    const findings = [];
    this.checkPackageJson(ctx, findings);
    this.checkEnvFiles(ctx, findings);
    this.checkDockerConfig(ctx, findings);
    this.checkTLSConfig(ctx, findings);
    this.checkGitignore(ctx, findings);
    this.checkLoggingConfig(ctx, findings);
    return findings;
  }
  checkPackageJson(ctx, findings) {
    const pkgContent = ctx.fileContents.get("package.json");
    if (!pkgContent)
      return;
    try {
      const pkg2 = JSON.parse(pkgContent);
      const deps = { ...pkg2.dependencies, ...pkg2.devDependencies };
      if (deps.helmet === void 0 && (deps.express || deps.koa || deps.fastify)) {
        findings.push({
          ruleId: "CONFIG-001",
          severity: "high",
          category: "security",
          title: "Missing security headers (no helmet)",
          description: "No helmet middleware detected for HTTP framework. Security headers protect against XSS, clickjacking, and other attacks.",
          file: "package.json",
          evidence: "helmet not in dependencies",
          controlIds: ["OWASP-ASVS-002", "OWASP-ASVS-006"],
          fix: "npm install helmet && app.use(helmet())"
        });
      }
      if (deps.cors === void 0 && (deps.express || deps.fastify)) {
        findings.push({
          ruleId: "CONFIG-002",
          severity: "medium",
          category: "security",
          title: "No CORS configuration",
          description: "No CORS package found. Unrestricted CORS can expose your API to cross-origin attacks.",
          file: "package.json",
          evidence: "cors not in dependencies",
          controlIds: ["OWASP-ASVS-006"],
          fix: "npm install cors and configure allowed origins explicitly."
        });
      }
      const auditDeps = ["lodash", "axios", "underscore"];
      for (const dep of auditDeps) {
        if (deps[dep]) {
          findings.push({
            ruleId: "CONFIG-003",
            severity: "medium",
            category: "dependencies",
            title: `Dependency review needed: ${dep}`,
            description: `${dep} is a commonly exploited dependency. Ensure you are running the latest version with no known vulnerabilities.`,
            file: "package.json",
            evidence: `${dep}: ${deps[dep]}`,
            controlIds: ["CIS-004", "OWASP-ASVS-005"],
            fix: "Run npm audit regularly. Update to latest version. Consider automated dependency scanning."
          });
        }
      }
    } catch {
    }
  }
  checkEnvFiles(ctx, findings) {
    for (const [filePath, content] of ctx.fileContents) {
      if (filePath !== ".env" && !filePath.endsWith("/.env") && !filePath.startsWith(".env."))
        continue;
      if (filePath.includes("example") || filePath.includes("template"))
        continue;
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith("#"))
          continue;
        if (/\b(PASSWORD|SECRET|KEY|TOKEN|PRIVATE)\b.*=\s*[^\s]/i.test(line) && !line.includes("your_") && !line.includes("changeme") && !line.includes("xxx")) {
          findings.push({
            ruleId: "CONFIG-004",
            severity: "critical",
            category: "secrets",
            title: "Secret with value in .env file",
            description: "A .env file contains actual secret values. Ensure .env files are in .gitignore and never committed.",
            file: filePath,
            line: i + 1,
            evidence: line.split("=")[0] + "=***",
            controlIds: ["OWASP-ASVS-005", "GDPR-ART32-002"],
            fix: "Ensure .env is in .gitignore. Use a secrets management solution for production."
          });
        }
      }
    }
  }
  checkDockerConfig(ctx, findings) {
    const dockerfile = ctx.fileContents.get("Dockerfile");
    if (dockerfile) {
      if (/USER\s+root/i.test(dockerfile) || !/USER\s+/i.test(dockerfile)) {
        findings.push({
          ruleId: "CONFIG-005",
          severity: "medium",
          category: "infrastructure",
          title: "Docker running as root",
          description: "Container may be running as root. Use a non-root user for security.",
          file: "Dockerfile",
          evidence: "No non-root USER directive found",
          controlIds: ["CIS-003"],
          fix: "Add: USER node (or other non-root user) to your Dockerfile."
        });
      }
      if (/\bENV\b.*(?:PASSWORD|SECRET|KEY|TOKEN)\s*=\s*\S+/i.test(dockerfile)) {
        findings.push({
          ruleId: "CONFIG-006",
          severity: "critical",
          category: "secrets",
          title: "Secret in Dockerfile ENV",
          description: "Secrets must not be baked into Docker images.",
          file: "Dockerfile",
          evidence: "ENV with secret value",
          controlIds: ["OWASP-ASVS-005"],
          fix: "Use Docker secrets or environment variables at runtime instead."
        });
      }
    }
  }
  checkTLSConfig(ctx, findings) {
    for (const [filePath, content] of ctx.fileContents) {
      if (!filePath.includes(".env") && !filePath.includes("config"))
        continue;
      if (/\bNODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0['"]?/i.test(content)) {
        findings.push({
          ruleId: "CONFIG-007",
          severity: "critical",
          category: "encryption",
          title: "TLS verification disabled",
          description: "NODE_TLS_REJECT_UNAUTHORIZED=0 disables TLS certificate verification, enabling MITM attacks.",
          file: filePath,
          evidence: "NODE_TLS_REJECT_UNAUTHORIZED=0",
          controlIds: ["GDPR-ART32-003", "OWASP-ASVS-006"],
          fix: "Remove NODE_TLS_REJECT_UNAUTHORIZED=0. Fix the certificate issue instead."
        });
      }
    }
  }
  checkGitignore(ctx, findings) {
    const gitignore = ctx.fileContents.get(".gitignore");
    if (!gitignore) {
      findings.push({
        ruleId: "CONFIG-008",
        severity: "high",
        category: "security",
        title: "No .gitignore file",
        description: "No .gitignore found. Secrets and build artifacts may be committed accidentally.",
        file: ".gitignore",
        evidence: "File not found",
        controlIds: ["OWASP-ASVS-005"],
        fix: "Create .gitignore with node_modules/, .env, dist/, *.key, etc."
      });
      return;
    }
    const required = [".env", "node_modules"];
    for (const pattern of required) {
      if (!gitignore.includes(pattern)) {
        findings.push({
          ruleId: "CONFIG-009",
          severity: "high",
          category: "security",
          title: `.gitignore missing ${pattern}`,
          description: `${pattern} should be in .gitignore to prevent accidental commits.`,
          file: ".gitignore",
          evidence: `${pattern} not found in .gitignore`,
          controlIds: ["OWASP-ASVS-005"],
          fix: `Add ${pattern} to .gitignore.`
        });
      }
    }
  }
  checkLoggingConfig(ctx, findings) {
    const hasLogging = this.searchContent(ctx, [
      /winston|pino|bunyan|morgan|helmet/i,
      /logging|logger/i,
      /auditLog|audit_log/i
    ]);
    if (!hasLogging) {
      findings.push({
        ruleId: "CONFIG-010",
        severity: "high",
        category: "audit",
        title: "No logging framework detected",
        description: "No logging library or audit logging found. Audit logging is mandatory for GDPR compliance.",
        file: "project",
        evidence: "No logging library (winston, pino, etc.) found",
        controlIds: ["GDPR-ART32-006", "OWASP-ASVS-004"],
        fix: "Install a logging library (winston or pino) and implement structured audit logging."
      });
    }
  }
  searchContent(ctx, patterns) {
    for (const [, content] of ctx.fileContents) {
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(content))
          return true;
      }
    }
    return false;
  }
};

// ../audit-engine/dist/scanners/database-scanner.js
var DB_SCHEMA_EXTENSIONS = /* @__PURE__ */ new Set([
  ".prisma",
  ".sql"
]);
var DB_SCHEMA_FILENAMES = [
  /(?:^|[\/\\])(?:schema|migration|knexfile|drizzle\.config|database\.conf)/i
];
var DB_DIR_INDICATORS = [
  /[\/\\](?:migrations?|models?|entities?|repositories?|schemas?|db|database)[\/\\]/i
];
var ORM_ENTITY_PATTERNS = {
  ".ts": /(?:@Entity|@Table|@Schema|BaseModel)\s*\(|(?:Model|Entity|Schema)\s+extends\s+|Schema\s*=\s*new\s+mongoose\.Schema/i,
  ".js": /(?:@Entity|@Table|@Schema|BaseModel)\s*\(/,
  ".py": /class\s+\w+\s*\(\s*(?:models\.Model|Base|declarative_base)\)/i,
  ".rb": /class\s+\w+\s*<\s*(?:ApplicationRecord|ActiveRecord::Base)/i,
  ".go": /type\s+\w+\s+struct\s*\{[\s\S]*?gorm/i,
  ".java": /@Entity\s*(?:public\s+)?class/i,
  ".php": /class\s+\w+\s+extends\s+(?:Model|Eloquent|Doctrine)/i
};
var MIGRATION_DIR_PATTERN = /[\/\\]migrations?[\/\\]/i;
function isDatabaseSchemaFile(filePath, content) {
  const ext = filePath.substring(filePath.lastIndexOf("."));
  const basename2 = filePath.substring(filePath.lastIndexOf("/") + 1);
  if (ext === ".prisma")
    return true;
  if (MIGRATION_DIR_PATTERN.test(filePath))
    return false;
  if (DB_SCHEMA_EXTENSIONS.has(ext))
    return true;
  for (const pattern of DB_SCHEMA_FILENAMES) {
    if (pattern.test(basename2))
      return true;
  }
  for (const pattern of DB_DIR_INDICATORS) {
    if (pattern.test(filePath))
      return true;
  }
  const ormPattern = ORM_ENTITY_PATTERNS[ext];
  if (ormPattern && ormPattern.test(content))
    return true;
  return false;
}
var DatabaseScanner = class {
  name = "database";
  scan(ctx) {
    const findings = [];
    this.checkSchemaPatterns(ctx, findings);
    this.checkORMConfig(ctx, findings);
    return findings;
  }
  checkSchemaPatterns(ctx, findings) {
    for (const [filePath, content] of ctx.fileContents) {
      if (!isDatabaseSchemaFile(filePath, content))
        continue;
      const isPrisma = filePath.endsWith(".prisma");
      const hasTimestamps = isPrisma ? /\b(?:createdAt|created_at)\b.*(?:DateTime|timestamp)/i.test(content) : /\b(?:timestamps|created_at|createdAt|createdDate|date_created|timecreated|createdTime)\s*[:\(]/i.test(content);
      const hasSoftDelete = /\b(?:deleted_at|deletedAt|softDelete|paranoid|is_deleted|isDeleted|deleted|active)\s*[:\(]/i.test(content) || isPrisma && /\b(?:deletedAt|deleted_at)\s+DateTime/i.test(content);
      const hasUserAudit = /\b(?:created_by|createdBy|updated_by|updatedBy|owner_id|author_id)\s*[:\(]/i.test(content) || isPrisma && /\b(?:createdBy|updatedBy|ownerId|authorId)\s+String/i.test(content);
      const hasSchemaDef = /\b(?:model|schema|entity|table|struct|class)\b.*\{/i.test(content) || /\bCREATE\s+TABLE\b/i.test(content) || /@(?:Entity|Table|Schema)\b/.test(content);
      if (!hasSchemaDef)
        continue;
      if (!hasTimestamps) {
        findings.push({
          ruleId: "DB-001",
          severity: "high",
          category: "database",
          title: "Missing audit timestamps in schema",
          description: "Database schema does not include created_at/updated_at timestamps. These are mandatory for audit trails.",
          file: filePath,
          evidence: "No created_at/updated_at columns detected",
          controlIds: ["GDPR-ART32-006"],
          fix: "Add created_at and updated_at columns. In Prisma: add DateTime fields, in Sequelize: timestamps: true, in Django: auto_now_add=True."
        });
      }
      if (!hasSoftDelete) {
        findings.push({
          ruleId: "DB-002",
          severity: "medium",
          category: "database",
          title: "Missing soft delete pattern",
          description: "No deleted_at column or soft delete pattern found. Hard deletes prevent audit trail and data recovery.",
          file: filePath,
          evidence: "No deleted_at/softDelete pattern detected",
          controlIds: ["GDPR-ART32-007"],
          fix: "Add deleted_at column or soft delete flag. In Prisma: DeletedAt DateTime?, in Sequelize: paranoid: true, in Django: SoftDeleteModel."
        });
      }
      if (!hasUserAudit) {
        findings.push({
          ruleId: "DB-003",
          severity: "medium",
          category: "database",
          title: "Missing user audit columns",
          description: "No created_by/updated_by columns found. Track who makes changes for accountability.",
          file: filePath,
          evidence: "No created_by/updated_by columns detected",
          controlIds: ["GDPR-ART32-006"],
          fix: "Add created_by and updated_by columns to track which user made changes."
        });
      }
    }
  }
  checkORMConfig(ctx, findings) {
    const prismaSchema = ctx.fileContents.get("prisma/schema.prisma");
    if (prismaSchema) {
      if (!/@@map/i.test(prismaSchema) && !/model\s+Audit/i.test(prismaSchema)) {
        findings.push({
          ruleId: "DB-004",
          severity: "medium",
          category: "database",
          title: "No Audit model in Prisma schema",
          description: "Consider adding an Audit model for immutable audit logging.",
          file: "prisma/schema.prisma",
          evidence: "No Audit model found",
          controlIds: ["GDPR-ART32-006"],
          fix: "Add model Audit { id Int @id @default(autoincrement()) userId String action String resource String timestamp DateTime @default(now()) ipAddress String }"
        });
      }
    }
  }
};

// ../audit-engine/dist/index.js
var IGNORE_DIRS2 = /* @__PURE__ */ new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  "coverage",
  ".ges",
  "vendor",
  "__pycache__",
  ".venv",
  "venv",
  ".turbo",
  ".cache",
  "reports",
  "compliance",
  "security",
  "controls",
  "policies",
  "checklists",
  "docs",
  "bundle",
  ".crush",
  ".vscode",
  ".idea"
]);
var SKIP_PATHS = [
  "/audit-engine/src/"
];
var IGNORE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".mp4",
  ".mp3",
  ".zip",
  ".gz",
  ".tar",
  ".lock",
  ".map",
  ".wasm"
]);
function collectFiles(root) {
  const files = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORE_DIRS2.has(entry.name))
        continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (!IGNORE_EXTENSIONS.has(ext)) {
          const rel = path.relative(root, fullPath).replace(/\\/g, "/");
          if (!SKIP_PATHS.some((skip) => rel.includes(skip))) {
            files.push(rel);
          }
        }
      }
    }
  }
  walk(root);
  return files;
}
function readFiles(root, files) {
  const contents = /* @__PURE__ */ new Map();
  const MAX_FILE_SIZE = 1024 * 1024;
  for (const file of files) {
    try {
      const fullPath = path.join(root, file);
      const stat = fs.statSync(fullPath);
      if (stat.size > MAX_FILE_SIZE)
        continue;
      const content = fs.readFileSync(fullPath, "utf-8");
      contents.set(file, content);
    } catch {
    }
  }
  return contents;
}
function detectWebProject(fileContents) {
  const webPatterns = [
    /from\s+['"]express['"]/,
    /require\s*\(\s*['"]express['"]\s*\)/,
    /from\s+['"]fastify['"]/,
    /require\s*\(\s*['"]fastify['"]\s*\)/,
    /from\s+['"]koa['"]/,
    /require\s*\(\s*['"]koa['"]\s*\)/,
    /from\s+['"]hono['"]/,
    /require\s*\(\s*['"]hono['"]\s*\)/,
    /from\s+['"]@nestjs/,
    /from\s+['"]next['"]/,
    /from\s+['"]nuxt['"]/,
    /from\s+['"]@sveltejs/,
    /from\s+['"]@remix-run/,
    /from\s+['"]@angular/,
    /from\s+['"]vue['"]/,
    /import\s+django/,
    /from\s+flask\s+import/,
    /from\s+fastapi\s+import/,
    /from\s+sanic\s+import/,
    /from\s+aiohttp\s+import/,
    /import\s+tornado/,
    /use\s+gin\.Default\(\)|gin\.New\(\)/,
    /fiber\.New\(\)/,
    /echo\.New\(\)/,
    /mux\.NewRouter\(\)/,
    /chi\.NewRouter\(\)/,
    /iris\.New\(\)/,
    /use\s+Actix\s*Web/,
    /use\s+rocket/,
    /use\s+warp/,
    /use\s+axum/,
    /Rails\.application/,
    /ActionController::Base/,
    /Sinatra::Base/,
    /import\s+io\.express/,
    /import\s+io\.ktor/,
    /import\s+spark\.Spark/,
    /@SpringBootApplication/,
    /@Controller/,
    /@RestController/,
    /use\s+Rocketeer/,
    /Route::get|Route::post/,
    /use\s+Illuminate/,
    /using\s+Microsoft\.AspNetCore/,
    /using\s+Nancy/,
    /ControllerBase/,
    /createServer\s*\(\s*.*request\b/,
    /http\.createServer/,
    /router\.(get|post|put|delete|patch)\s*\(/
  ];
  for (const [, content] of fileContents) {
    for (const pattern of webPatterns) {
      if (pattern.test(content))
        return true;
    }
  }
  for (const [filePath, content] of fileContents) {
    if (filePath === "package.json") {
      try {
        const pkg2 = JSON.parse(content);
        const allDeps = { ...pkg2.dependencies, ...pkg2.devDependencies };
        if (allDeps.express || allDeps.fastify || allDeps.koa || allDeps.hono || allDeps.next || allDeps.nuxt || allDeps["@nestjs/core"] || allDeps["@sveltejs/kit"] || allDeps["@remix-run/node"] || allDeps["@angular/core"] || allDeps.vue) {
          return true;
        }
      } catch {
      }
    }
    if (filePath === "requirements.txt" || filePath === "pyproject.toml") {
      if (/django|flask|fastapi|sanic|aiohttp|tornado|starlette/i.test(content))
        return true;
    }
    if (filePath === "go.mod") {
      if (/gin-gonic|fiber|echo|chi|gorilla\/mux|iris/i.test(content))
        return true;
    }
    if (filePath === "Cargo.toml") {
      if (/actix-web|rocket|warp|axum|tide/i.test(content))
        return true;
    }
    if (filePath === "Gemfile") {
      if (/rails|sinatra|hanami/i.test(content))
        return true;
    }
    if (filePath === "pom.xml" || filePath === "build.gradle") {
      if (/spring-boot|ktor|sparkjava|quarkus/i.test(content))
        return true;
    }
    if (filePath === "composer.json") {
      try {
        const pkg2 = JSON.parse(content);
        const allDeps = { ...pkg2.require, ...pkg2["require-dev"] };
        if (allDeps["laravel/framework"] || allDeps["symfony/symfony"] || allDeps["slim/slim"])
          return true;
      } catch {
      }
    }
  }
  return false;
}
function runAudit(root) {
  const files = collectFiles(root);
  const fileContents = readFiles(root, files);
  const isWebProject = detectWebProject(fileContents);
  const ctx = { root, files, fileContents, isWebProject };
  const scanners = [
    new SecretsScanner(),
    new CryptoScanner(),
    new CodeSecurityScanner(),
    new AuthScanner(),
    new ConfigScanner(),
    new DatabaseScanner()
  ];
  const allFindings = [];
  for (const scanner of scanners) {
    allFindings.push(...scanner.scan(ctx));
  }
  return { findings: allFindings, scannedFiles: files.length };
}
function deduplicateFindings(findings) {
  const seen = /* @__PURE__ */ new Set();
  return findings.filter((f) => {
    const key = `${f.ruleId}:${f.file}:${f.line || ""}:${f.evidence}`;
    if (seen.has(key))
      return false;
    seen.add(key);
    return true;
  });
}

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path4, errorMaps, issueData } = params;
  const fullPath = [...path4, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path4, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path4;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// ../core/dist/schemas/index.js
var ProjectTypeSchema = external_exports.enum([
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
  "mobile-application"
]);
var FrameworkNameSchema = external_exports.enum([
  "GDPR",
  "OWASP",
  "CIS",
  "NIST",
  "ISO27001",
  "ISO27701"
]);
var DataClassificationSchema = external_exports.enum([
  "public",
  "internal",
  "confidential",
  "restricted"
]);
var ControlStatusSchema = external_exports.enum([
  "pass",
  "fail",
  "warning",
  "not-applicable",
  "not-implemented"
]);
var ReportFormatSchema = external_exports.enum(["markdown", "html", "pdf"]);
var RequirementConfigSchema = external_exports.object({
  required: external_exports.boolean(),
  level: external_exports.enum(["mandatory", "recommended", "optional"]).optional(),
  notes: external_exports.string().optional()
});
var ProjectConfigSchema = external_exports.object({
  project_name: external_exports.string().min(1),
  project_type: ProjectTypeSchema,
  frameworks: external_exports.array(FrameworkNameSchema).min(1),
  requirements: external_exports.object({
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
    privacy_controls: RequirementConfigSchema
  }),
  created_at: external_exports.string(),
  version: external_exports.string()
});
var ControlCheckSchema = external_exports.object({
  id: external_exports.string(),
  description: external_exports.string(),
  status: ControlStatusSchema,
  evidence: external_exports.string().optional()
});
var ControlSchema = external_exports.object({
  id: external_exports.string(),
  name: external_exports.string(),
  description: external_exports.string(),
  category: external_exports.string(),
  framework: FrameworkNameSchema,
  article: external_exports.string().optional(),
  status: ControlStatusSchema.default("not-implemented"),
  severity: external_exports.enum(["critical", "high", "medium", "low"]),
  implementation_guidance: external_exports.string(),
  checks: external_exports.array(ControlCheckSchema)
});
var AuditEntrySchema = external_exports.object({
  userId: external_exports.string(),
  action: external_exports.string(),
  resource: external_exports.string(),
  timestamp: external_exports.string(),
  ipAddress: external_exports.string(),
  metadata: external_exports.record(external_exports.unknown()).optional()
});
var ReportOptionsSchema = external_exports.object({
  format: ReportFormatSchema,
  title: external_exports.string(),
  include_executive_summary: external_exports.boolean(),
  include_risk_assessment: external_exports.boolean(),
  include_compliance: external_exports.boolean(),
  include_security: external_exports.boolean()
});

// ../core/dist/constants/index.js
import { createRequire } from "node:module";
import * as url from "node:url";
import * as path2 from "node:path";
var __filename = url.fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var require2 = createRequire(import.meta.url);
var pkg = {"version":"0.6.0"};
var GESF_VERSION = pkg.version;

// src/server.ts
var TOOLS = [
  {
    name: "check_compliance",
    description: "Check GDPR compliance status for a project. Returns compliance scores per framework (GDPR, OWASP, CIS, NIST) with grades and control breakdown.",
    inputSchema: {
      type: "object",
      properties: {
        project_type: { type: "string", description: "Project type (saas, ai-application, mcp-server, blockchain, wallet, government-system, healthcare-system, event-platform, photo-storage-platform, vulnerability-scanner, generic-web-application, api-backend, mobile-application)" }
      }
    }
  },
  {
    name: "check_project_status",
    description: "Read the actual project's .ges/ directory to get real-time compliance status, scores, config, and audit results. Use this when the project has already been initialized with 'ges init'.",
    inputSchema: {
      type: "object",
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root. Defaults to current working directory." }
      }
    }
  },
  {
    name: "list_missing_controls",
    description: "Show missing or failed compliance controls for a given framework. Returns control ID, severity, name, and implementation guidance.",
    inputSchema: {
      type: "object",
      properties: {
        project_type: {
          type: "string",
          description: "Project type"
        },
        framework: {
          type: "string",
          description: "Framework name (GDPR, OWASP, CIS, NIST)"
        }
      }
    }
  },
  {
    name: "list_framework_controls",
    description: "List all controls for a given framework with their status, severity, category, and implementation guidance. Useful for understanding the full control landscape.",
    inputSchema: {
      type: "object",
      properties: {
        framework: {
          type: "string",
          description: "Framework name (GDPR, OWASP, CIS, NIST, AI, blockchain, government)"
        },
        status_filter: {
          type: "string",
          description: "Filter by status (pass, fail, warning, not-implemented, not-applicable). Omit to show all."
        }
      }
    }
  },
  {
    name: "run_audit",
    description: "Run a full source code security audit on the project. Scans for secrets, weak cryptography, injection vulnerabilities, auth issues, config problems, and database anti-patterns. Returns findings with severity, file location, evidence, and fix guidance.",
    inputSchema: {
      type: "object",
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root to audit." }
      }
    }
  },
  {
    name: "generate_compliance_report",
    description: "Generate a full compliance report with executive summary, findings, framework scores, risk assessment, security controls, and actionable recommendations. The primary report tool for compliance status.",
    inputSchema: {
      type: "object",
      properties: {
        project_type: { type: "string", description: "Project type" },
        project_name: { type: "string", description: "Project name" },
        frameworks: { type: "string", description: "Comma-separated framework names (GDPR,OWASP,CIS,NIST)" }
      }
    }
  },
  {
    name: "generate_audit_report",
    description: "Generate a report from actual source code audit findings. Combines audit results with compliance scoring and detailed recommendations for each finding. Requires a project path.",
    inputSchema: {
      type: "object",
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root to audit and report on." },
        project_name: { type: "string", description: "Project name for the report title." }
      }
    }
  },
  {
    name: "fix_recommendation",
    description: "Get detailed step-by-step remediation guidance for a specific control or finding. Provides implementation steps, code examples, and verification steps. Use this to fix issues one by one.",
    inputSchema: {
      type: "object",
      properties: {
        control_id: { type: "string", description: "Control ID to get fix guidance for (e.g. GDPR-ART32-001, OWASP-AUTH-001)" },
        finding_title: { type: "string", description: "Title of a specific audit finding to get fix guidance for." }
      }
    }
  },
  {
    name: "generate_retention_policy",
    description: "Generate a data retention policy template",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" }
      }
    }
  },
  {
    name: "generate_incident_response",
    description: "Generate an incident response plan template",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" }
      }
    }
  },
  {
    name: "generate_risk_assessment",
    description: "Generate a risk assessment template",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" }
      }
    }
  },
  {
    name: "generate_dpa",
    description: "Generate a Data Processing Agreement template",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" }
      }
    }
  },
  {
    name: "generate_data_inventory",
    description: "Generate a data inventory document listing data categories, classifications, retention periods, and legal basis. Required for GDPR Article 30 compliance.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" },
        project_type: { type: "string", description: "Project type" }
      }
    }
  },
  {
    name: "generate_processing_records",
    description: "Generate Article 30 Records of Processing Activities (ROPA). Documents all processing activities, purposes, data categories, recipients, and retention periods.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" },
        controller_name: { type: "string", description: "Data controller organization name" }
      }
    }
  },
  {
    name: "auto_fix",
    description: "Run an audit and automatically fix all fixable security/compliance issues in the project source code. Creates files, modifies source, generates security scaffolding. Returns a detailed report of what was fixed and what requires manual review.",
    inputSchema: {
      type: "object",
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        dry_run: { type: "boolean", description: "If true, show what would be fixed without making changes. Default: false." },
        rule_ids: { type: "string", description: "Comma-separated rule IDs to fix (e.g. 'CONFIG-001,AUTH-002'). Omit to fix all auto-fixable issues." }
      }
    }
  },
  {
    name: "apply_control_override",
    description: "Mark a compliance control as not-applicable, pass, or another status in the project's .ges/control-overrides.json. Use this when a control doesn't apply to the project or has been verified manually.",
    inputSchema: {
      type: "object",
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        control_id: { type: "string", description: "Control ID to override (e.g. GDPR-ART32-004)" },
        status: { type: "string", description: "New status: 'not-applicable' or 'pass'" },
        reason: { type: "string", description: "Reason for the override" }
      }
    }
  },
  {
    name: "implement_control",
    description: "Generate and write actual implementation files for a compliance control into the target project. Creates source files, configuration, and middleware. Returns what was created and next steps.",
    inputSchema: {
      type: "object",
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        control_id: { type: "string", description: "Control ID to implement (e.g. GDPR-ART32-002, GDPR-ART32-006, AUTH-002)" }
      }
    }
  }
];
function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}
function resolveProjectPath(projectPath) {
  return projectPath || process.cwd();
}
function readJsonFileSafe(filePath) {
  try {
    const content = fs2.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}
function loadProjectConfig(projectPath) {
  const gesDir = path3.join(projectPath, ".ges");
  const config = readJsonFileSafe(path3.join(gesDir, "config.json"));
  const score = readJsonFileSafe(path3.join(gesDir, "score.json"));
  const overrides = readJsonFileSafe(path3.join(gesDir, "control-overrides.json"));
  return {
    config,
    score,
    overrides: Array.isArray(overrides) ? overrides : []
  };
}
function applyControlOverrides(controls, overrides) {
  if (overrides.length === 0) return controls;
  const overrideMap = new Map(overrides.map((o) => [o.control_id, o]));
  return controls.map((control) => {
    const override = overrideMap.get(control.id);
    if (!override) return control;
    return {
      ...control,
      status: override.status,
      checks: control.checks.map((check) => ({ ...check, status: override.status }))
    };
  });
}
function updateControlsFromFindings(controls, findings) {
  return controls.map((control) => {
    if (control.status === "pass" || control.status === "not-applicable") return control;
    const relevantFindings = findings.filter((f) => f.controlIds && f.controlIds.includes(control.id));
    if (relevantFindings.length === 0) return control;
    const hasCritical = relevantFindings.some((f) => f.severity === "critical" || f.severity === "high");
    return {
      ...control,
      status: hasCritical ? "fail" : "warning",
      checks: control.checks.map((check) => ({
        ...check,
        status: hasCritical ? "fail" : "warning"
      }))
    };
  });
}
function getControlsForProject(projectType, frameworks) {
  const projectPacks = getPacksForProjectType(projectType);
  const packIds = new Set(projectPacks.map((p) => p.id));
  const fwLower = new Set(frameworks.map((f) => f.toLowerCase()));
  const allPacks = getAllPacks();
  for (const p of allPacks) {
    if (fwLower.has(p.id)) packIds.add(p.id);
  }
  return allPacks.filter((p) => packIds.has(p.id)).flatMap((p) => p.controls);
}
function generateFullComplianceReport(projectName, projectType, frameworks, findings, overrides) {
  const controls = getControlsForProject(projectType, frameworks);
  const overriddenControls = applyControlOverrides(controls, overrides || []);
  const auditedControls = findings ? updateControlsFromFindings(overriddenControls, findings) : overriddenControls;
  const score = generateScoreFile(auditedControls, frameworks, findings);
  const sections = [];
  sections.push(`# Compliance Report - ${projectName}`);
  sections.push(`
Generated: ${(/* @__PURE__ */ new Date()).toISOString()}`);
  sections.push(`Project Type: ${projectType}`);
  sections.push(`Frameworks: ${frameworks.join(", ")}
`);
  sections.push("## Executive Summary\n");
  sections.push(`**Overall Score: ${score.overall}% (Grade: ${score.overall_grade})**
`);
  sections.push("| Framework | Score | Grade | Passed | Failed | Warnings | Critical Failures |");
  sections.push("|-----------|-------|-------|--------|--------|----------|-------------------|");
  for (const [fw, data] of Object.entries(score.frameworks)) {
    sections.push(`| ${fw} | ${data.score}% | ${data.grade} | ${data.passed_controls} | ${data.failed_controls} | ${data.warning_controls} | ${data.critical_failures} |`);
  }
  if (findings && findings.length > 0) {
    sections.push(`
**Security Findings**: ${findings.length} total`);
    const crit = findings.filter((f) => f.severity === "critical").length;
    const high = findings.filter((f) => f.severity === "high").length;
    sections.push(`- Critical: ${crit}, High: ${high}`);
  }
  if (score.audit_impact) {
    const ai = score.audit_impact;
    sections.push(`
**Audit Impact**: -${ai.total_deduction}% deduction`);
  }
  if (findings && findings.length > 0) {
    sections.push("\n## Security Findings\n");
    const grouped = {};
    for (const f of findings) {
      if (!grouped[f.category]) grouped[f.category] = [];
      grouped[f.category].push(f);
    }
    for (const [category, categoryFindings] of Object.entries(grouped)) {
      sections.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}
`);
      sections.push("| Severity | Title | File | Fix |");
      sections.push("|----------|-------|------|-----|");
      for (const f of categoryFindings) {
        const loc = f.file !== "project" ? `${f.file}${f.line ? `:${f.line}` : ""}` : "project-wide";
        sections.push(`| ${f.severity} | ${f.title} | ${loc} | ${f.fix.slice(0, 80)} |`);
      }
      sections.push("");
    }
  }
  sections.push("\n## Compliance Details\n");
  for (const [fw, data] of Object.entries(score.frameworks)) {
    sections.push(`### ${fw} - ${data.score}% (Grade: ${data.grade})
`);
    sections.push(`- Total Controls: ${data.total_controls}`);
    sections.push(`- Passed: ${data.passed_controls}`);
    sections.push(`- Failed: ${data.failed_controls}`);
    sections.push(`- Warnings: ${data.warning_controls}`);
    sections.push(`- Not Implemented: ${data.not_implemented}`);
    sections.push(`- Critical Failures: ${data.critical_failures}`);
    const sb = data.severity_breakdown;
    sections.push("\n**Severity Breakdown:**");
    sections.push("| Level | Total | Passed | Failed | Warning | Not Implemented |");
    sections.push("|-------|-------|--------|--------|---------|-----------------|");
    if (sb.critical.total > 0) sections.push(`| Critical | ${sb.critical.total} | ${sb.critical.passed} | ${sb.critical.failed} | ${sb.critical.warning} | ${sb.critical.not_implemented} |`);
    if (sb.high.total > 0) sections.push(`| High | ${sb.high.total} | ${sb.high.passed} | ${sb.high.failed} | ${sb.high.warning} | ${sb.high.not_implemented} |`);
    if (sb.medium.total > 0) sections.push(`| Medium | ${sb.medium.total} | ${sb.medium.passed} | ${sb.medium.failed} | ${sb.medium.warning} | ${sb.medium.not_implemented} |`);
    if (sb.low.total > 0) sections.push(`| Low | ${sb.low.total} | ${sb.low.passed} | ${sb.low.failed} | ${sb.low.warning} | ${sb.low.not_implemented} |`);
    sections.push("");
  }
  sections.push(generateRecommendations(auditedControls, findings));
  return sections.join("\n");
}
function generateRecommendations(controls, findings) {
  const lines = ["## Recommendations\n"];
  const failedControls = controls.filter((c) => c.status === "fail");
  const criticalFails = failedControls.filter((c) => c.severity === "critical");
  const highFails = failedControls.filter((c) => c.severity === "high");
  const warningControls = controls.filter((c) => c.status === "warning");
  const notImplemented = controls.filter((c) => c.status === "not-implemented");
  if (criticalFails.length > 0) {
    lines.push("### Critical Actions Required\n");
    for (const c of criticalFails) {
      lines.push(`**${c.id}** (${c.severity}): ${c.name}`);
      lines.push(`  Category: ${c.category}`);
      lines.push(`  Guidance: ${c.implementation_guidance}`);
      lines.push(`  Fix: Use \`fix_recommendation\` tool with control_id="${c.id}" for detailed steps.
`);
    }
  }
  if (highFails.length > 0) {
    lines.push("### High Priority Actions\n");
    for (const c of highFails) {
      lines.push(`**${c.id}** (${c.severity}): ${c.name}`);
      lines.push(`  Category: ${c.category}`);
      lines.push(`  Guidance: ${c.implementation_guidance}
`);
    }
  }
  if (findings && findings.length > 0) {
    const critFindings = findings.filter((f) => f.severity === "critical");
    const highFindings = findings.filter((f) => f.severity === "high");
    if (critFindings.length > 0) {
      lines.push("### Immediate Security Fixes\n");
      for (const f of critFindings) {
        lines.push(`- **[${f.severity.toUpperCase()}] ${f.title}** (${f.file}${f.line ? `:${f.line}` : ""})`);
        lines.push(`  Evidence: ${f.evidence}`);
        lines.push(`  Fix: ${f.fix}`);
        if (f.controlIds && f.controlIds.length > 0) {
          lines.push(`  Related controls: ${f.controlIds.join(", ")}`);
        }
        lines.push("");
      }
    }
    if (highFindings.length > 0 && critFindings.length === 0) {
      lines.push("### Security Fixes Needed\n");
      for (const f of highFindings) {
        lines.push(`- **[${f.severity.toUpperCase()}] ${f.title}** (${f.file}${f.line ? `:${f.line}` : ""})`);
        lines.push(`  Fix: ${f.fix}
`);
      }
    }
  }
  if (warningControls.length > 0) {
    lines.push("### Warnings to Address\n");
    for (const c of warningControls.slice(0, 10)) {
      lines.push(`- **${c.id}** (${c.severity}): ${c.name} \u2014 ${c.implementation_guidance.split(".")[0]}`);
    }
    if (warningControls.length > 10) {
      lines.push(`- ... and ${warningControls.length - 10} more warnings`);
    }
    lines.push("");
  }
  if (notImplemented.length > 0) {
    lines.push("### Not Yet Implemented\n");
    lines.push(`${notImplemented.length} controls have not been implemented yet. Priority order:
`);
    const sorted = [...notImplemented].sort((a, b) => {
      const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return (sevOrder[a.severity] ?? 4) - (sevOrder[b.severity] ?? 4);
    });
    for (const c of sorted.slice(0, 10)) {
      lines.push(`- **${c.id}** (${c.severity}): ${c.name}`);
      lines.push(`  ${c.implementation_guidance.split(".")[0]}`);
    }
    if (notImplemented.length > 10) {
      lines.push(`
... and ${notImplemented.length - 10} more not-implemented controls.`);
    }
    lines.push("");
  }
  const totalIssues = failedControls.length + warningControls.length + notImplemented.length;
  if (totalIssues === 0) {
    lines.push("**All controls are passing.** No recommendations at this time. Continue monitoring with regular audits.");
  } else {
    lines.push(`**Summary**: ${totalIssues} total issues (${criticalFails.length} critical, ${highFails.length} high, ${warningControls.length} warnings, ${notImplemented.length} not-implemented).`);
    lines.push("\nUse the `fix_recommendation` tool with a specific control_id to get step-by-step implementation guidance for any issue.");
  }
  return lines.join("\n");
}
function generateFixGuidance(controlId, findingTitle) {
  const allControls = getAllPacks().flatMap((p) => p.controls);
  const control = allControls.find((c) => c.id === controlId);
  const lines = [];
  lines.push(`# Fix Guidance: ${controlId}
`);
  if (control) {
    lines.push(`## Control: ${control.name}`);
    lines.push(`**Framework**: ${control.framework}`);
    lines.push(`**Category**: ${control.category}`);
    lines.push(`**Severity**: ${control.severity}`);
    lines.push(`**Current Status**: ${control.status}`);
    lines.push(`**Article**: ${control.article || "N/A"}
`);
    lines.push(`### Description
${control.description}
`);
    lines.push(`### Implementation Guidance
${control.implementation_guidance}
`);
    lines.push("### Implementation Steps\n");
    const steps = generateImplementationSteps(control);
    for (let i = 0; i < steps.length; i++) {
      lines.push(`${i + 1}. ${steps[i]}`);
    }
    lines.push("\n### Verification\n");
    lines.push("After implementing the fix:");
    lines.push("1. Run `ges audit` to verify the finding no longer appears");
    lines.push("2. Run `ges score` to see the updated compliance score");
    lines.push("3. If the control is not applicable to your project, add it to `.ges/control-overrides.json`:");
    lines.push("```json");
    lines.push('[\n  {\n    "control_id": "' + controlId + '",\n    "status": "not-applicable",\n    "reason": "Explain why this control does not apply"\n  }\n]');
    lines.push("```");
  } else {
    lines.push(`Control **${controlId}** not found in any framework pack.`);
    lines.push("\nAvailable control IDs:");
    const grouped = {};
    for (const c of allControls) {
      if (!grouped[c.framework]) grouped[c.framework] = [];
      grouped[c.framework].push(`  ${c.id}: ${c.name} (${c.severity})`);
    }
    for (const [fw, ids] of Object.entries(grouped)) {
      lines.push(`
**${fw}:**`);
      lines.push(ids.join("\n"));
    }
  }
  if (findingTitle) {
    lines.push(`
### Finding: ${findingTitle}
`);
    lines.push("To fix this specific finding:");
    lines.push("1. Locate the file mentioned in the finding");
    lines.push("2. Apply the fix suggested in the finding details");
    lines.push("3. Run `ges audit` to verify the fix");
  }
  return lines.join("\n");
}
function generateImplementationSteps(control) {
  const steps = [];
  const category = control.category;
  const id = control.id;
  if (category === "encryption") {
    steps.push("Install an encryption library: `npm install crypto-js` or use Node.js built-in `crypto` module");
    steps.push("Implement AES-256-GCM encryption for data at rest");
    steps.push("Ensure TLS 1.2+ is configured for all data in transit");
    steps.push("Add encryption key management (use environment variables or a vault service)");
    steps.push("Verify encryption is applied to all sensitive data fields in your database schema");
  } else if (category === "authentication") {
    steps.push("Implement Argon2id password hashing: `npm install argon2`");
    steps.push("Add multi-factor authentication (MFA) support");
    steps.push("Implement session expiration (recommended: 15-30 minutes of inactivity)");
    steps.push("Add rate limiting to authentication endpoints: `npm install express-rate-limit`");
    steps.push("Configure CORS to restrict origins (never use `*` in production)");
  } else if (category === "authorization") {
    steps.push("Implement Role-Based Access Control (RBAC) with defined roles and permissions");
    steps.push("Apply the principle of least privilege to all user roles");
    steps.push("Configure deny-by-default access control policies");
    steps.push("Add authorization middleware to all protected routes");
    steps.push("Document the access control matrix in your compliance documentation");
  } else if (category === "audit") {
    steps.push("Implement audit logging middleware that captures: userId, action, resource, timestamp, ipAddress");
    steps.push("Store audit logs in a separate, append-only data store");
    steps.push("Ensure logs are immutable (no update or delete operations)");
    steps.push("Add logging for: authentication, authorization, data exports, role changes, admin actions");
    steps.push("Configure log retention policy (minimum 1 year for compliance)");
  } else if (category === "secrets") {
    steps.push("Audit all source files for hardcoded secrets: `ges scan` or `npx gitleaks detect`");
    steps.push("Move all secrets to environment variables or a secrets manager (Vault, AWS KMS, etc.)");
    steps.push("Add secrets to `.gitignore` (.env files, key files, certificate files)");
    steps.push("Implement secret rotation policy (rotate every 90 days minimum)");
    steps.push("Add pre-commit hooks to prevent secrets from being committed: `npx gitleaks protect --staged`");
  } else if (category === "security-testing") {
    steps.push("Set up automated security scanning in CI/CD (Trivy, Semgrep, npm audit)");
    steps.push("Add dependency scanning to detect vulnerable packages");
    steps.push("Implement static application security testing (SAST)");
    steps.push("Schedule regular penetration testing (quarterly recommended)");
    steps.push("Create a security testing checklist and integrate into your development workflow");
  } else if (category === "privacy") {
    steps.push("Implement data minimization - only collect data that is necessary");
    steps.push("Add privacy-by-design principles to your development process");
    steps.push("Implement data subject rights endpoints (access, rectification, erasure, portability)");
    steps.push("Create and publish a privacy policy");
    steps.push("Conduct a Privacy Impact Assessment (PIA) for high-risk processing");
  } else if (category === "data-protection") {
    steps.push("Classify all data into categories: public, internal, confidential, restricted");
    steps.push("Apply appropriate protection controls based on classification");
    steps.push("Implement data retention policies with automated deletion");
    steps.push("Add data access logging for all restricted and confidential data");
    steps.push("Create a data inventory documenting all personal data processing activities");
  } else if (category === "access-control") {
    steps.push("Review and document all user roles and their permissions");
    steps.push("Implement the principle of least privilege");
    steps.push("Add separation of duties for critical operations");
    steps.push("Implement regular access reviews (quarterly recommended)");
    steps.push("Automate provisioning and deprovisioning of access");
  } else if (category === "incident-response") {
    steps.push("Create an incident response plan with defined severity levels and escalation paths");
    steps.push("Define communication templates for GDPR breach notification (72-hour requirement)");
    steps.push("Set up incident detection and alerting (monitoring, SIEM)");
    steps.push("Conduct regular incident response tabletop exercises");
    steps.push("Document lessons learned after each incident");
  } else if (category === "vulnerability-management") {
    steps.push("Implement automated vulnerability scanning in CI/CD pipeline");
    steps.push("Set up dependency scanning (npm audit, Dependabot, Snyk)");
    steps.push("Define SLA for fixing vulnerabilities based on severity (critical: 24h, high: 7d)");
    steps.push("Maintain a vulnerability register with tracking");
    steps.push("Regularly review and update dependencies");
  } else if (category === "configuration") {
    steps.push("Review and harden all service configurations");
    steps.push("Implement security headers (helmet for Node.js: `npm install helmet`)");
    steps.push("Configure proper CORS policies");
    steps.push("Ensure containers do not run as root");
    steps.push("Remove all default credentials and configurations");
  } else {
    steps.push(`Review the control requirements: ${control.description}`);
    steps.push(`Follow the implementation guidance: ${control.implementation_guidance}`);
    steps.push("Implement the required controls based on your project's architecture");
    steps.push("Test the implementation thoroughly");
    steps.push("Document the implementation in your compliance documentation");
  }
  if (id.includes("AI") || id.includes("ai-")) {
    steps.push("");
    steps.push("**AI-Specific Considerations:**");
    steps.push("- Implement prompt logging and monitoring");
    steps.push("- Add PII detection for all inputs and outputs");
    steps.push("- Rate limit AI API calls to prevent abuse");
    steps.push("- Validate all AI outputs before presenting to users");
    steps.push("- Classify data before sending to AI providers");
  }
  if (id.includes("BLOCK") || id.includes("blockchain")) {
    steps.push("");
    steps.push("**Blockchain-Specific Considerations:**");
    steps.push("- Never store plaintext personal data on-chain");
    steps.push("- Store only hashes, CIDs, or encrypted references on-chain");
    steps.push("- Implement key rotation procedures");
    steps.push("- Use cryptographic signatures for all on-chain transactions");
    steps.push("- Maintain immutable audit trails off-chain");
  }
  return steps;
}
function createAutoFixPlan(root, findings, filterRuleIds) {
  const actions = [];
  const warnings = [];
  const processedRules = /* @__PURE__ */ new Set();
  for (const f of findings) {
    if (filterRuleIds && !filterRuleIds.has(f.ruleId)) continue;
    const key = `${f.ruleId}:${f.file}`;
    if (processedRules.has(key)) continue;
    processedRules.add(key);
    switch (f.ruleId) {
      case "CONFIG-001":
        actions.push(...buildHelmetFix(root));
        break;
      case "CONFIG-002":
        actions.push(...buildCorsFix(root));
        break;
      case "CONFIG-004":
        actions.push(...buildEnvGitignoreFix(root));
        break;
      case "CONFIG-005":
        actions.push(...buildDockerNonRootFix(root));
        break;
      case "CONFIG-007":
        actions.push(...buildTLSFix(root, f));
        break;
      case "CONFIG-008":
        actions.push(...buildGitignoreCreateFix(root));
        break;
      case "CONFIG-009":
        actions.push(...buildGitignoreEntryFix(root, f));
        break;
      case "CONFIG-010":
        actions.push(...buildLoggingFix(root));
        break;
      case "SECRETS-001":
        actions.push(...buildSecretsFix(root, f));
        warnings.push(`[SECRETS-001] Secret in ${f.file}:${f.line}. Verify .env is in .gitignore and never committed.`);
        break;
      case "CRYPTO-001":
        actions.push(...buildWeakHashFix(root, f));
        warnings.push("[CRYPTO-001] For passwords, use Argon2id instead of SHA-256.");
        break;
      case "CRYPTO-003":
        actions.push(...buildPasswordFix(root, f));
        break;
      case "AUTH-002":
        actions.push(...buildRateLimitFix(root));
        break;
      case "AUTH-003":
        actions.push(...buildSessionTimeoutFix(root));
        break;
      case "AUTH-004":
        actions.push(...buildCORSWildcardFix(root));
        break;
      case "DB-001":
        actions.push(...buildTimestampsFix(root, f));
        break;
      case "DB-002":
        actions.push(...buildSoftDeleteFix(root, f));
        break;
      case "DB-003":
        actions.push(...buildUserAuditFix(root, f));
        break;
      case "DB-004":
        actions.push(...buildAuditModelFix(root));
        break;
      default:
        warnings.push(`[${f.severity.toUpperCase()}] ${f.title} in ${f.file}${f.line ? `:${f.line}` : ""}: Manual fix required.`);
    }
  }
  return { actions, warnings };
}
function applyAutoFixAction(root, action) {
  const fullPath = path3.join(root, action.filePath);
  try {
    switch (action.type) {
      case "create": {
        if (fs2.existsSync(fullPath)) {
          return { applied: false, action, error: "File already exists" };
        }
        const dir = path3.dirname(fullPath);
        if (!fs2.existsSync(dir)) fs2.mkdirSync(dir, { recursive: true });
        fs2.writeFileSync(fullPath, action.content || "", "utf-8");
        return { applied: true, action };
      }
      case "modify": {
        if (!fs2.existsSync(fullPath)) {
          return { applied: false, action, error: "File not found" };
        }
        const content = fs2.readFileSync(fullPath, "utf-8");
        if (action.search && !content.includes(action.search)) {
          return { applied: false, action, error: "Search string not found" };
        }
        fs2.writeFileSync(fullPath, content.replace(action.search || "", action.replace || ""), "utf-8");
        return { applied: true, action };
      }
      case "append": {
        const dir = path3.dirname(fullPath);
        if (!fs2.existsSync(dir)) fs2.mkdirSync(dir, { recursive: true });
        fs2.appendFileSync(fullPath, action.content || "", "utf-8");
        return { applied: true, action };
      }
      case "npm-install": {
        return { applied: true, action };
      }
    }
  } catch (err) {
    return { applied: false, action, error: err instanceof Error ? err.message : String(err) };
  }
}
function findMainAppFile(root) {
  const lang = detectProjectLanguage(root);
  const candidates = {
    typescript: ["src/index.ts", "src/app.ts", "src/server.ts", "src/main.ts", "index.ts", "app.ts", "server.ts"],
    javascript: ["src/index.js", "src/app.js", "src/server.js", "src/main.js", "index.js", "app.js", "server.js"],
    python: ["app.py", "main.py", "manage.py", "wsgi.py", "asgi.py", "src/app.py", "src/main.py"],
    ruby: ["config.ru", "app.rb", "server.rb", "main.rb", "config/application.rb"],
    go: ["main.go", "cmd/server/main.go", "cmd/app/main.go"],
    java: ["src/main/java/com/example/Application.java", "src/main/java/Application.java"],
    php: ["public/index.php", "index.php", "app.php", "app/Http/Kernel.php"],
    rust: ["src/main.rs", "src/bin/main.rs", "src/app.rs"],
    csharp: ["Program.cs", "Startup.cs"]
  };
  const exts = candidates[lang] || [];
  for (const c of exts) {
    if (fs2.existsSync(path3.join(root, c))) return c;
  }
  if (lang === "java") {
    const found = findFileRecursive(root, "Application.java", "src/main/java");
    if (found) return found;
  }
  if (lang === "go") {
    for (const c of ["cmd/server/main.go", "cmd/app/main.go", "main.go"]) {
      if (fs2.existsSync(path3.join(root, c))) return c;
    }
  }
  return null;
}
function findFileRecursive(root, name, baseDir) {
  const dir = path3.join(root, baseDir);
  if (!fs2.existsSync(dir)) return null;
  try {
    const entries = fs2.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "venv" || e.name === "__pycache__" || e.name === ".git") continue;
      const childPath = path3.join(baseDir, e.name);
      if (e.isDirectory()) {
        const found = findFileRecursive(root, name, childPath);
        if (found) return found;
      } else if (e.name === name) {
        return childPath;
      }
    }
  } catch {
  }
  return null;
}
function detectProjectLanguage(root) {
  if (fs2.existsSync(path3.join(root, "go.mod"))) return "go";
  if (fs2.existsSync(path3.join(root, "Cargo.toml"))) return "rust";
  if (fs2.existsSync(path3.join(root, "requirements.txt")) || fs2.existsSync(path3.join(root, "pyproject.toml")) || fs2.existsSync(path3.join(root, "Pipfile")) || fs2.existsSync(path3.join(root, "setup.py"))) return "python";
  if (fs2.existsSync(path3.join(root, "go.mod"))) return "go";
  if (fs2.existsSync(path3.join(root, "pom.xml")) || fs2.existsSync(path3.join(root, "build.gradle")) || fs2.existsSync(path3.join(root, "build.gradle.kts"))) return "java";
  if (fs2.existsSync(path3.join(root, "Gemfile"))) return "ruby";
  if (fs2.existsSync(path3.join(root, "composer.json"))) return "php";
  const pkgContent = readFileSafe(path3.join(root, "package.json"));
  if (pkgContent) {
    try {
      const pkg2 = JSON.parse(pkgContent);
      const deps = { ...pkg2.dependencies, ...pkg2.devDependencies };
      if (deps.typescript || deps["@types/node"] || fs2.existsSync(path3.join(root, "tsconfig.json"))) return "typescript";
      return "javascript";
    } catch {
    }
  }
  if (fs2.existsSync(path3.join(root, "tsconfig.json"))) return "typescript";
  return "javascript";
}
function detectWebFramework(root, lang) {
  if (lang === "typescript" || lang === "javascript") {
    if (hasDep(root, "express")) return "express";
    if (hasDep(root, "fastify")) return "fastify";
    if (hasDep(root, "koa")) return "koa";
    if (hasDep(root, "hono")) return "hono";
    if (hasDep(root, "next")) return "next";
    if (hasDep(root, "@nestjs/core")) return "nestjs";
    if (hasDep(root, "@sveltejs/kit")) return "sveltekit";
  }
  if (lang === "python") {
    const reqFiles = ["requirements.txt", "pyproject.toml", "Pipfile"];
    for (const f of reqFiles) {
      const c = readFileSafe(path3.join(root, f));
      if (c) {
        if (/^\s*django\b/mi.test(c) || /django/i.test(c)) return "django";
        if (/^\s*flask\b/mi.test(c) || /flask/i.test(c)) return "flask";
        if (/^\s*fastapi\b/mi.test(c) || /fastapi/i.test(c)) return "fastapi";
        if (/^\s*sanic\b/mi.test(c) || /sanic/i.test(c)) return "sanic";
      }
    }
    const settingsPy = readFileSafe(path3.join(root, "settings.py")) || readFileSafe(path3.join(root, "app/settings.py")) || readFileSafe(path3.join(root, "config/settings.py"));
    if (settingsPy && /DJANGO_SETTINGS_MODULE|INSTALLED_APPS|django/.test(settingsPy)) return "django";
    const appPy = readFileSafe(path3.join(root, "app.py")) || readFileSafe(path3.join(root, "main.py"));
    if (appPy) {
      if (/from\s+flask\s+import|import\s+flask/.test(appPy)) return "flask";
      if (/from\s+fastapi\s+import|import\s+fastapi/.test(appPy)) return "fastapi";
      if (/from\s+django/.test(appPy)) return "django";
    }
  }
  if (lang === "ruby") {
    const gemfile = readFileSafe(path3.join(root, "Gemfile"));
    if (gemfile) {
      if (/rails/i.test(gemfile)) return "rails";
      if (/sinatra/i.test(gemfile)) return "sinatra";
    }
  }
  if (lang === "go") {
    const goMod = readFileSafe(path3.join(root, "go.mod")) || "";
    const mainGo = readFileSafe(path3.join(root, "main.go")) || "";
    const allGo = goMod + mainGo;
    if (/gin-gonic|gin\.Default|gin\.New/.test(allGo)) return "gin";
    if (/fiber\.New/.test(allGo)) return "fiber";
    if (/echo\.New/.test(allGo)) return "echo";
    if (/chi\.NewRouter|chi\.Mux/.test(allGo)) return "chi";
    if (/mux\.NewRouter/.test(allGo)) return "gorilla";
    if (/http\.ListenAndServe|http\.HandleFunc/.test(allGo)) return "nethttp";
  }
  if (lang === "java") {
    const pom = readFileSafe(path3.join(root, "pom.xml")) || "";
    const gradle = readFileSafe(path3.join(root, "build.gradle")) || "";
    const all = pom + gradle;
    if (/spring-boot|springframework/.test(all)) return "spring";
    if (/ktor/.test(all)) return "ktor";
    if (/quarkus/.test(all)) return "quarkus";
    if (/micronaut/.test(all)) return "micronaut";
  }
  if (lang === "rust") {
    const cargo = readFileSafe(path3.join(root, "Cargo.toml")) || "";
    const mainRs = readFileSafe(path3.join(root, "src/main.rs")) || "";
    const libRs = readFileSafe(path3.join(root, "src/lib.rs")) || "";
    const all = cargo + mainRs + libRs;
    if (/actix-web|actix_web/.test(all)) return "actix";
    if (/axum/.test(all)) return "axum";
    if (/rocket/.test(all)) return "rocket";
    if (/warp/.test(all)) return "warp";
  }
  if (lang === "php") {
    const composer = readFileSafe(path3.join(root, "composer.json"));
    if (composer) {
      try {
        const pkg2 = JSON.parse(composer);
        const req = pkg2.require || {};
        if (req["laravel/framework"]) return "laravel";
        if (req["symfony/symfony"] || req["symfony/framework-bundle"]) return "symfony";
        if (req["slim/slim"]) return "slim";
        if (req["laravel/lumen-framework"]) return "lumen";
      } catch {
      }
    }
  }
  return "generic";
}
function hasDep(root, dep) {
  const pkg2 = readJsonFileSafe(path3.join(root, "package.json"));
  if (!pkg2) return false;
  const deps = { ...pkg2.dependencies, ...pkg2.devDependencies };
  return dep in deps;
}
function readFileSafe(filePath) {
  try {
    return fs2.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}
function buildHelmetFix(root) {
  const lang = detectProjectLanguage(root);
  const fw = detectWebFramework(root, lang);
  const actions = [];
  if (lang === "typescript" || lang === "javascript") {
    const appFile = findMainAppFile(root);
    if (!appFile) return [];
    if (fw === "express") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install helmet", ruleId: "CONFIG-001" });
      const content = readFileSafe(path3.join(root, appFile));
      if (content && content.includes("const app = express()")) {
        actions.push({ type: "modify", filePath: appFile, search: "const app = express()", replace: "const app = express()\n\napp.use(helmet())", description: "Add helmet middleware", ruleId: "CONFIG-001" });
      } else {
        actions.push({ type: "append", filePath: appFile, content: "\nimport helmet from 'helmet';\napp.use(helmet());\n", description: "Add helmet import and middleware", ruleId: "CONFIG-001" });
      }
    } else if (fw === "fastify") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install @fastify/helmet", ruleId: "CONFIG-001" });
      actions.push({ type: "append", filePath: appFile, content: "\nimport helmet from '@fastify/helmet';\napp.register(helmet);\n", description: "Add Fastify helmet plugin", ruleId: "CONFIG-001" });
    } else if (fw === "koa") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install koa-helmet", ruleId: "CONFIG-001" });
      actions.push({ type: "append", filePath: appFile, content: "\nimport helmet from 'koa-helmet';\napp.use(helmet());\n", description: "Add koa-helmet middleware", ruleId: "CONFIG-001" });
    } else if (fw === "hono") {
      actions.push({ type: "append", filePath: appFile, content: "\nimport { secureHeaders } from 'hono/secure-headers';\napp.use(secureHeaders());\n", description: "Add Hono secure headers", ruleId: "CONFIG-001" });
    }
  } else if (lang === "python") {
    if (fw === "django") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Python uses django-csp/secure", ruleId: "CONFIG-001" });
      const settingsFile = findFileRecursive(root, "settings.py", ".") || "settings.py";
      actions.push({ type: "append", filePath: settingsFile, content: "\n# Security headers\nSECURE_BROWSER_XSS_FILTER = True\nSECURE_CONTENT_TYPE_NOSNIFF = True\nSECURE_HSTS_SECONDS = 31536000\nSECURE_HSTS_INCLUDE_SUBDOMAINS = True\nSECURE_HSTS_PRELOAD = True\nX_FRAME_OPTIONS = 'DENY'\nSECURE_SSL_REDIRECT = True\nSESSION_COOKIE_SECURE = True\nCSRF_COOKIE_SECURE = True\n", description: "Add Django security headers settings", ruleId: "CONFIG-001" });
    } else if (fw === "flask" || fw === "fastapi" || fw === "sanic") {
      const appFile = findMainAppFile(root) || "app.py";
      actions.push({
        type: "append",
        filePath: appFile,
        content: fw === "fastapi" ? "\nfrom fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware\napp.add_middleware(HTTPSRedirectMiddleware)\n" : "\nfrom flask_talisman import Talisman\nTalisman(app, force_https=True, strict_transport_security=True, session_cookie_secure=True)\n",
        description: `Add security headers for ${fw}`,
        ruleId: "CONFIG-001"
      });
    }
  } else if (lang === "ruby") {
    if (fw === "rails") {
      const envFile = fs2.existsSync(path3.join(root, "config/environments/production.rb")) ? "config/environments/production.rb" : "config/application.rb";
      actions.push({ type: "append", filePath: envFile, content: "\nconfig.force_ssl = true\nconfig.ssl_options = { hsts: { subdomains: true, preload: true, expires: 1.year } }\nconfig.x_frame_options = 'SAMEORIGIN'\nconfig.x_content_type_options = 'nosniff'\nconfig.x_xss_protection = '1; mode=block'\nconfig.strict_transport_security = 'max-age=31536000; includeSubDomains'\n", description: "Add Rails security headers", ruleId: "CONFIG-001" });
    }
  } else if (lang === "go") {
    const appFile = findMainAppFile(root) || "main.go";
    if (fw === "gin" || fw === "echo" || fw === "fiber" || fw === "chi" || fw === "nethttp") {
      actions.push({ type: "append", filePath: appFile, content: `
import "net/http"

// Security headers middleware
func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Content-Security-Policy", "default-src 'self'")
		next.ServeHTTP(w, r)
	})
}
`, description: "Add Go security headers middleware", ruleId: "CONFIG-001" });
    }
  } else if (lang === "java") {
    if (fw === "spring") {
      const hasSrc = fs2.existsSync(path3.join(root, "src/main/java"));
      const configPath = hasSrc ? "src/main/java/com/example/SecurityConfig.java" : "SecurityConfig.java";
      actions.push({ type: "create", filePath: configPath, content: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.headers()
            .contentSecurityPolicy("default-src 'self'")
            .and()
            .xssProtection()
            .and()
            .frameOptions().deny()
            .httpStrictTransportSecurity()
                .includeSubDomains(true)
                .preload(true)
                .maxAgeInSeconds(31536000);
        return http.build();
    }
}
`, description: "Create Spring Security config with headers", ruleId: "CONFIG-001" });
    }
  } else if (lang === "php") {
    if (fw === "laravel" || fw === "symfony") {
      const middleware = fw === "laravel" ? "app/Http/Middleware/SecurityHeaders.php" : "src/Middleware/SecurityHeadersMiddleware.php";
      const content = fw === "laravel" ? `<?php

namespace App\\Http\\Middleware;

use Closure;

class SecurityHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        return $response;
    }
}
` : `<?php

namespace App\\Middleware;

use Symfony\\Component\\HttpFoundation\\Response;

class SecurityHeadersMiddleware
{
    public function __invoke($request, $handler)
    {
        $response = $handler->handle($request);
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        return $response;
    }
}
`;
      actions.push({ type: "create", filePath: middleware, content, description: `Create security headers middleware for ${fw}`, ruleId: "CONFIG-001" });
    }
  } else if (lang === "rust") {
    const appFile = findMainAppFile(root) || "src/main.rs";
    if (fw === "actix") {
      actions.push({ type: "create", filePath: "src/middleware/security_headers.rs", content: `use actix_web::{HttpResponse, dev::{ServiceRequest, Service, ServiceResponse}};

pub fn add_security_headers(res: &mut HttpResponse) {
    res.headers_mut().insert(("X-Content-Type-Options", "nosniff"));
    res.headers_mut().insert(("X-Frame-Options", "DENY"));
    res.headers_mut().insert(("X-XSS-Protection", "1; mode=block"));
    res.headers_mut().insert(("Strict-Transport-Security", "max-age=31536000; includeSubDomains"));
    res.headers_mut().insert(("Referrer-Policy", "strict-origin-when-cross-origin"));
    res.headers_mut().insert(("Content-Security-Policy", "default-src 'self'"));
}
`, description: "Create Actix-web security headers middleware", ruleId: "CONFIG-001" });
    } else if (fw === "axum") {
      actions.push({ type: "create", filePath: "src/middleware/security_headers.rs", content: `use axum::{http::HeaderValue, response::Response};

pub async fn security_headers(mut res: Response) -> Response {
    let headers = res.headers_mut();
    headers.insert("X-Content-Type-Options", HeaderValue::from_static("nosniff"));
    headers.insert("X-Frame-Options", HeaderValue::from_static("DENY"));
    headers.insert("X-XSS-Protection", HeaderValue::from_static("1; mode=block"));
    headers.insert("Strict-Transport-Security", HeaderValue::from_static("max-age=31536000; includeSubDomains"));
    headers.insert("Referrer-Policy", HeaderValue::from_static("strict-origin-when-cross-origin"));
    headers.insert("Content-Security-Policy", HeaderValue::from_static("default-src 'self'"));
    res
}
`, description: "Create Axum security headers middleware", ruleId: "CONFIG-001" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\n// GESF: Add security headers middleware\n// actix-web: use actix_web::middleware::DefaultHeaders\n// axum: use tower-http::set-header::SetResponseHeader\n// rocket: use rocket::fairing\n", description: "Add Rust security headers guidance", ruleId: "CONFIG-001" });
    }
  }
  return actions;
}
function buildCorsFix(root) {
  const lang = detectProjectLanguage(root);
  const fw = detectWebFramework(root, lang);
  const actions = [];
  if (lang === "typescript" || lang === "javascript") {
    const appFile = findMainAppFile(root);
    if (!appFile) return [];
    actions.push({ type: "npm-install", filePath: "package.json", description: "Install cors", ruleId: "CONFIG-002" });
    if (fw === "fastify") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install @fastify/cors", ruleId: "CONFIG-002" });
      actions.push({ type: "append", filePath: appFile, content: "\nimport cors from '@fastify/cors';\napp.register(cors, { origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'] });\n", description: "Add Fastify CORS", ruleId: "CONFIG-002" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\nimport cors from 'cors';\napp.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'] }));\n", description: "Add CORS with configured origins", ruleId: "CONFIG-002" });
    }
  } else if (lang === "python") {
    const appFile = findMainAppFile(root) || "app.py";
    if (fw === "django") {
      const settingsFile = findFileRecursive(root, "settings.py", ".") || "settings.py";
      actions.push({ type: "append", filePath: settingsFile, content: "\nCORS_ALLOWED_ORIGINS = ['https://yourdomain.com']\nCORS_ALLOW_CREDENTIALS = True\n", description: "Add Django CORS settings", ruleId: "CONFIG-002" });
    } else if (fw === "fastapi") {
      actions.push({ type: "append", filePath: appFile, content: "\nfrom fastapi.middleware.cors import CORSMiddleware\napp.add_middleware(CORSMiddleware, allow_origins=['http://localhost:3000'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])\n", description: "Add FastAPI CORS middleware", ruleId: "CONFIG-002" });
    } else if (fw === "flask") {
      actions.push({ type: "append", filePath: appFile, content: "\nfrom flask_cors import CORS\nCORS(app, origins=['http://localhost:3000'])\n", description: "Add Flask CORS", ruleId: "CONFIG-002" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\n# CORS: Configure allowed origins in production\n# pip install flask-cors or fastapi[all]\n", description: "Add CORS note", ruleId: "CONFIG-002" });
    }
  } else if (lang === "ruby") {
    if (fw === "rails") {
      actions.push({ type: "append", filePath: "config/application.rb", content: "\nconfig.middleware.insert_before 0, Rack::Cors do\n  allow do\n    origins 'https://yourdomain.com'\n    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete]\n  end\nend\n", description: "Add Rails CORS via Rack::Cors", ruleId: "CONFIG-002" });
    }
  } else if (lang === "go") {
    const appFile = findMainAppFile(root) || "main.go";
    actions.push({ type: "append", filePath: appFile, content: '\nimport "net/http"\n\nfunc corsMiddleware(allowedOrigins []string, next http.Handler) http.Handler {\n	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n		origin := r.Header.Get("Origin")\n		for _, o := range allowedOrigins {\n			if origin == o {\n				w.Header().Set("Access-Control-Allow-Origin", origin)\n				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")\n				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")\n				break\n			}\n		}\n		if r.Method == "OPTIONS" { w.WriteHeader(http.StatusNoContent); return }\n		next.ServeHTTP(w, r)\n	})\n}\n', description: "Add Go CORS middleware", ruleId: "CONFIG-002" });
  } else if (lang === "java") {
    if (fw === "spring") {
      actions.push({ type: "create", filePath: "src/main/java/com/example/CorsConfig.java", content: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("https://yourdomain.com");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
`, description: "Create Spring CORS configuration", ruleId: "CONFIG-002" });
    }
  } else if (lang === "rust") {
    const appFile = findMainAppFile(root) || "src/main.rs";
    if (fw === "actix") {
      actions.push({ type: "create", filePath: "src/middleware/cors.rs", content: `use actix_cors::Cors;
use actix_web::http::header;

pub fn cors_config() -> Cors {
    Cors::default()
        .allowed_origin("http://localhost:3000")
        .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
        .allowed_headers(vec![header::CONTENT_TYPE, header::AUTHORIZATION])
        .max_age(3600)
}
`, description: "Create Actix-web CORS configuration", ruleId: "CONFIG-002" });
    } else if (fw === "axum") {
      actions.push({ type: "create", filePath: "src/middleware/cors.rs", content: `use tower_http::cors::{CorsLayer, Any};
use http::Method;

pub fn cors_layer() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(["http://localhost:3000".parse().unwrap()])
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any)
}
`, description: "Create Axum CORS layer", ruleId: "CONFIG-002" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\n// GESF CORS: Configure allowed origins\n// actix-web: cargo add actix-cors\n// axum: cargo add tower-http --features cors\n// rocket: cargo add rocket_cors\n", description: "Add Rust CORS guidance", ruleId: "CONFIG-002" });
    }
  }
  return actions;
}
function buildEnvGitignoreFix(root) {
  const gi = fs2.existsSync(path3.join(root, ".gitignore")) ? ".gitignore" : null;
  const envFiles = detectProjectLanguage(root) === "python" ? "\n.env\n.env.*\n!.env.example\n*.pyc\n__pycache__/\n" : detectProjectLanguage(root) === "go" ? "\n.env\n.env.*\n!.env.example\n*.exe\n" : detectProjectLanguage(root) === "ruby" ? "\n.env\n.env.*\n!.env.example\n*.gem\n" : detectProjectLanguage(root) === "java" ? "\n.env\n.env.*\n!.env.example\n*.class\ntarget/\n" : detectProjectLanguage(root) === "php" ? "\n.env\n.env.*\n!.env.example\nvendor/\n" : detectProjectLanguage(root) === "rust" ? "\n.env\n.env.*\n!.env.example\ntarget/\n*.key\n*.pem\n" : "\n.env\n.env.*\n!.env.example\n";
  if (!gi) return buildGitignoreCreateFix(root);
  const content = readFileSafe(path3.join(root, gi)) || "";
  if (content.includes(".env")) return [];
  return [{ type: "append", filePath: ".gitignore", content: envFiles, description: "Add .env to .gitignore", ruleId: "CONFIG-004" }];
}
function buildDockerNonRootFix(root) {
  if (!fs2.existsSync(path3.join(root, "Dockerfile"))) return [];
  return [{ type: "append", filePath: "Dockerfile", content: "\nUSER node\n", description: "Add non-root USER to Dockerfile", ruleId: "CONFIG-005" }];
}
function buildTLSFix(root, f) {
  return [{ type: "modify", filePath: f.file, search: "NODE_TLS_REJECT_UNAUTHORIZED=0", replace: "NODE_TLS_REJECT_UNAUTHORIZED=1", description: "Re-enable TLS verification", ruleId: "CONFIG-007" }];
}
function buildGitignoreCreateFix(root) {
  const lang = detectProjectLanguage(root);
  const templates = {
    typescript: "node_modules/\n.env\n.env.*\n!.env.example\ndist/\nbuild/\n*.key\n*.pem\ncoverage/\n.DS_Store\n",
    javascript: "node_modules/\n.env\n.env.*\n!.env.example\ndist/\nbuild/\n*.key\n*.pem\ncoverage/\n.DS_Store\n",
    python: "__pycache__/\n*.pyc\n*.pyo\n.env\n.env.*\n!.env.example\n*.key\n*.pem\n.pytest_cache/\n.venv/\nvenv/\n*.egg-info/\ndist/\nbuild/\n.DS_Store\n",
    ruby: ".env\n.env.*\n!.env.example\n*.key\n*.pem\nlog/\ntmp/\n*.gem\n.DS_Store\n",
    go: ".env\n.env.*\n!.env.example\n*.key\n*.pem\n*.exe\n/bin/\n.DS_Store\n",
    java: ".env\n.env.*\n!.env.example\n*.key\n*.pem\n*.class\ntarget/\n.idea/\n*.iml\n.DS_Store\n",
    php: ".env\n.env.*\n!.env.example\nvendor/\n*.key\n*.pem\n.DS_Store\n",
    rust: "target/\nCargo.lock\n.env\n.env.*\n!.env.example\n*.key\n*.pem\n.DS_Store\n",
    csharp: ".env\n.env.*\n!.env.example\nbin/\nobj/\n*.key\n*.pem\n.DS_Store\n"
  };
  return [{ type: "create", filePath: ".gitignore", content: templates[lang] || templates.javascript, description: `Create .gitignore for ${lang} project`, ruleId: "CONFIG-008" }];
}
function buildGitignoreEntryFix(root, f) {
  const entry = f.fix.replace("Add ", "").replace(" to .gitignore.", "");
  if (!fs2.existsSync(path3.join(root, ".gitignore"))) return buildGitignoreCreateFix(root);
  return [{ type: "append", filePath: ".gitignore", content: `
${entry}
`, description: `Add ${entry} to .gitignore`, ruleId: "CONFIG-009" }];
}
function buildLoggingFix(root) {
  const lang = detectProjectLanguage(root);
  const actions = [];
  if (lang === "typescript" || lang === "javascript") {
    const hasSrc = fs2.existsSync(path3.join(root, "src"));
    const loggerPath = hasSrc ? "src/lib/logger.ts" : "lib/logger.ts";
    actions.push({ type: "npm-install", filePath: "package.json", description: "Install pino logger", ruleId: "CONFIG-010" });
    actions.push({ type: "create", filePath: loggerPath, content: `import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
});

interface AuditLogParams {
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  metadata?: Record<string, unknown>;
}

export function auditLog(params: AuditLogParams): void {
  logger.info({ ...params, timestamp: new Date().toISOString(), type: 'audit' });
}

export default logger;
`, description: "Create structured logger with audit logging", ruleId: "CONFIG-010" });
  } else if (lang === "python") {
    actions.push({ type: "create", filePath: "lib/logger.py", content: `import logging
import json
from datetime import datetime

logger = logging.getLogger("audit")
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(message)s'))
logger.addHandler(handler)

def audit_log(user_id: str, action: str, resource: str, ip_address: str, **metadata):
    entry = {
        "userId": user_id,
        "action": action,
        "resource": resource,
        "ipAddress": ip_address,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "type": "audit",
        **metadata,
    }
    logger.info(json.dumps(entry))
`, description: "Create Python audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "ruby") {
    actions.push({ type: "create", filePath: "lib/audit_logger.rb", content: `require 'logger'
require 'json'

class AuditLogger
  def initialize(logdev = $stdout)
    @logger = Logger.new(logdev)
    @logger.formatter = proc { |_, _, _, msg| msg }
  end

  def audit_log(user_id:, action:, resource:, ip_address:, **metadata)
    entry = {
      userId: user_id,
      action: action,
      resource: resource,
      ipAddress: ip_address,
      timestamp: Time.now.utc.iso8601,
      type: 'audit',
      **metadata,
    }
    @logger.info(entry.to_json)
  end
end

AUDIT = AuditLogger.new
`, description: "Create Ruby audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "go") {
    actions.push({ type: "create", filePath: "lib/audit.go", content: `package lib

import (
	"encoding/json"
	"log"
	"os"
	"time"
)

type AuditEntry struct {
	UserID    string                 "json:\\"userId\\""
	Action    string                 "json:\\"action\\""
	Resource  string                 "json:\\"resource\\""
	IPAddress string                 "json:\\"ipAddress\\""
	Timestamp string                 "json:\\"timestamp\\""
	Type      string                 "json:\\"type\\""
	Metadata  map[string]interface{} "json:\\"metadata,omitempty\\""
}

var auditLogger = log.New(os.Stdout, "", 0)

func AuditLog(userID, action, resource, ipAddr string, metadata map[string]interface{}) {
	entry := AuditEntry{
		UserID:    userID,
		Action:    action,
		Resource:  resource,
		IPAddress: ipAddr,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Type:      "audit",
		Metadata:  metadata,
	}
	data, _ := json.Marshal(entry)
	auditLogger.Println(string(data))
}
`, description: "Create Go audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "java") {
    actions.push({ type: "create", filePath: "src/main/java/com/example/AuditLogger.java", content: `package com.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.Instant;
import java.util.Map;

public class AuditLogger {
    private static final Logger logger = LoggerFactory.getLogger("audit");
    private static final ObjectMapper mapper = new ObjectMapper();

    public static void auditLog(String userId, String action, String resource, String ipAddress, Map<String, Object> metadata) {
        try {
            Map<String, Object> entry = Map.of(
                "userId", userId,
                "action", action,
                "resource", resource,
                "ipAddress", ipAddress,
                "timestamp", Instant.now().toString(),
                "type", "audit"
            );
            if (metadata != null) entry.putAll(metadata);
            logger.info(mapper.writeValueAsString(entry));
        } catch (Exception e) {
            logger.error("Audit log failed", e);
        }
    }
}
`, description: "Create Java audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "php") {
    actions.push({ type: "create", filePath: "lib/audit_logger.php", content: `<?php

class AuditLogger
{
    public static function log(string $userId, string $action, string $resource, string $ipAddress, array $metadata = []): void
    {
        $entry = array_merge([
            'userId' => $userId,
            'action' => $action,
            'resource' => $resource,
            'ipAddress' => $ipAddress,
            'timestamp' => gmdate('c'),
            'type' => 'audit',
        ], $metadata);
        error_log(json_encode($entry));
    }
}
`, description: "Create PHP audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "rust") {
    actions.push({ type: "create", filePath: "src/logger.rs", content: `use serde_json::json;
use tracing::{info, instrument};
use chrono::Utc;

#[derive(Debug, serde::Serialize)]
pub struct AuditEntry {
    pub user_id: String,
    pub action: String,
    pub resource: String,
    pub ip_address: String,
    pub timestamp: String,
    #[serde(rename = "type")]
    pub entry_type: String,
}

pub fn audit_log(user_id: &str, action: &str, resource: &str, ip_address: &str) {
    let entry = AuditEntry {
        user_id: user_id.to_string(),
        action: action.to_string(),
        resource: resource.to_string(),
        ip_address: ip_address.to_string(),
        timestamp: Utc::now().to_rfc3339(),
        entry_type: "audit".to_string(),
    };
    info!("{}", serde_json::to_string(&entry).unwrap_or_default());
}
`, description: "Create Rust audit logger (tracing)", ruleId: "CONFIG-010" });
  }
  return actions;
}
function buildSecretsFix(root, f) {
  const actions = [];
  const content = readFileSafe(path3.join(root, f.file));
  if (!content) return actions;
  const lines = content.split("\n");
  const idx = (f.line || 1) - 1;
  if (idx >= lines.length) return actions;
  const line = lines[idx];
  const lang = detectProjectLanguage(root);
  const match = line.match(/(\w+)\s*[:=]\s*['"]([^'"]+)['"]/);
  if (match) {
    const varName = match[1];
    const value = match[2];
    actions.push({ type: "append", filePath: ".env", content: `
${varName}=${value}
`, description: `Move ${varName} to .env`, ruleId: "SECRETS-001" });
    let replacement;
    if (lang === "python") {
      replacement = line.replace(match[0], `${varName} = os.environ.get('${varName}')`);
    } else if (lang === "ruby") {
      replacement = line.replace(match[0], `${varName} = ENV['${varName}']`);
    } else if (lang === "go") {
      replacement = line.replace(match[0], `${varName} := os.Getenv("${varName}")`);
    } else if (lang === "java") {
      replacement = line.replace(match[0], `String ${varName} = System.getenv("${varName}")`);
    } else if (lang === "php") {
      replacement = line.replace(match[0], `$${varName} = getenv('${varName}')`);
    } else if (lang === "rust") {
      replacement = line.replace(match[0], `let ${varName} = std::env::var("${varName}").unwrap_or_default()`);
    } else {
      replacement = `${varName}: process.env.${varName}`;
    }
    actions.push({ type: "modify", filePath: f.file, search: line, replace: replacement, description: `Replace hardcoded ${varName} with env variable`, ruleId: "SECRETS-001" });
    actions.push(...buildEnvGitignoreFix(root));
  }
  return actions;
}
function buildWeakHashFix(root, f) {
  const lang = detectProjectLanguage(root);
  const content = readFileSafe(path3.join(root, f.file));
  if (!content) return [];
  const lines = content.split("\n");
  const idx = (f.line || 1) - 1;
  if (idx >= lines.length) return [];
  const line = lines[idx];
  let replacement = line;
  if (lang === "python") {
    replacement = line.replace(/hashlib\.md5\(/gi, "hashlib.sha256(").replace(/hashlib\.sha1\(/gi, "hashlib.sha256(");
  } else if (lang === "go") {
    replacement = line.replace(/md5\.New\(\)/gi, "sha256.New()").replace(/sha1\.New\(\)/gi, "sha256.New()");
  } else if (lang === "ruby") {
    replacement = line.replace(/Digest::MD5/gi, "Digest::SHA256").replace(/Digest::SHA1/gi, "Digest::SHA256");
  } else if (lang === "java") {
    replacement = line.replace(/MessageDigest\.getInstance\(["']MD5["']\)/gi, 'MessageDigest.getInstance("SHA-256")').replace(/MessageDigest\.getInstance\(["']SHA-1["']\)/gi, 'MessageDigest.getInstance("SHA-256")');
  } else if (lang === "php") {
    replacement = line.replace(/md5\(/gi, "hash('sha256', ").replace(/sha1\(/gi, "hash('sha256', ");
  } else if (lang === "rust") {
    replacement = line.replace(/md5::compute/gi, "sha2::Sha256::digest").replace(/use md5/gi, "use sha2::{Sha256, Digest}");
  } else {
    replacement = line.replace(/createHash\s*\(\s*['"](?:md5|sha1)['"]\s*\)/, "createHash('sha256')");
  }
  if (replacement === line) return [];
  return [{ type: "modify", filePath: f.file, search: line, replace: replacement, description: "Replace weak hash with SHA-256", ruleId: "CRYPTO-001" }];
}
function buildPasswordFix(root, _f) {
  const lang = detectProjectLanguage(root);
  const actions = [];
  if (lang === "typescript" || lang === "javascript") {
    const hasSrc = fs2.existsSync(path3.join(root, "src"));
    const authPath = hasSrc ? "src/lib/auth.ts" : "lib/auth.ts";
    actions.push({ type: "npm-install", filePath: "package.json", description: "Install argon2", ruleId: "CRYPTO-003" });
    if (!fs2.existsSync(path3.join(root, authPath))) {
      actions.push({ type: "create", filePath: authPath, content: `import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hashedPassword: string, inputPassword: string): Promise<boolean> {
  return argon2.verify(hashedPassword, inputPassword);
}
`, description: "Create Argon2id password utility", ruleId: "CRYPTO-003" });
    }
  } else if (lang === "python") {
    actions.push({ type: "create", filePath: "lib/auth.py", content: `import hashlib
import os

def hash_password(password: str) -> str:
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex() + ':' + key.hex()

def verify_password(stored: str, provided: str) -> bool:
    salt_hex, key_hex = stored.split(':')
    salt = bytes.fromhex(salt_hex)
    new_key = hashlib.pbkdf2_hmac('sha256', provided.encode(), salt, 100000)
    return new_key.hex() == key_hex
`, description: "Create Python password utility (PBKDF2-SHA256)", ruleId: "CRYPTO-003" });
  } else if (lang === "go") {
    actions.push({ type: "create", filePath: "lib/auth.go", content: `package lib

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/hex"
	"golang.org/x/crypto/argon2"
)

func HashPassword(password string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return hex.EncodeToString(salt) + ":" + hex.EncodeToString(hash), nil
}

func VerifyPassword(stored, provided string) (bool, error) {
	parts := strings.SplitN(stored, ":", 2)
	if len(parts) != 2 { return false, nil }
	salt, _ := hex.DecodeString(parts[0])
	storedHash, _ := hex.DecodeString(parts[1])
	providedHash := argon2.IDKey([]byte(provided), salt, 1, 64*1024, 4, 32)
	return subtle.ConstantTimeCompare(storedHash, providedHash) == 1, nil
}
`, description: "Create Go Argon2id password utility", ruleId: "CRYPTO-003" });
  } else if (lang === "ruby") {
    actions.push({ type: "create", filePath: "lib/auth.rb", content: `require 'bcrypt'

def hash_password(password)
  BCrypt::Password.create(password)
end

def verify_password(stored_hash, provided_password)
  BCrypt::Password.new(stored_hash) == provided_password
end
`, description: "Create Ruby BCrypt password utility", ruleId: "CRYPTO-003" });
  } else if (lang === "java") {
    actions.push({ type: "create", filePath: "src/main/java/com/example/PasswordUtil.java", content: `package com.example;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordUtil {
    private static final int ITERATIONS = 100000;
    private static final int KEY_LENGTH = 256;
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String hashPassword(String password) throws Exception {
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        byte[] hash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);
    }

    public static boolean verifyPassword(String stored, String provided) throws Exception {
        String[] parts = stored.split(":");
        byte[] salt = Base64.getDecoder().decode(parts[0]);
        byte[] storedHash = Base64.getDecoder().decode(parts[1]);
        PBEKeySpec spec = new PBEKeySpec(provided.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        byte[] testHash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        return java.util.Arrays.equals(storedHash, testHash);
    }
}
`, description: "Create Java PBKDF2 password utility", ruleId: "CRYPTO-003" });
  } else if (lang === "php") {
    actions.push({ type: "create", filePath: "lib/auth.php", content: `<?php

function hash_password(string $password): string {
    return password_hash($password, PASSWORD_ARGON2ID);
}

function verify_password(string $hash, string $password): bool {
    return password_verify($password, $hash);
}
`, description: "Create PHP Argon2id password utility", ruleId: "CRYPTO-003" });
  } else if (lang === "rust") {
    actions.push({ type: "create", filePath: "src/auth.rs", content: `use argon2::{Argon2, Algorithm, Version, Params};
use argon2::password_hash::{SaltString, PasswordHasher, PasswordVerifier};
use rand::rngs::OsRng;

pub fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);
    let params = Params::new(65536, 3, 4, Some(32))?;
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);
    let hash = argon2.hash_password(password.as_bytes(), &salt)?;
    Ok(hash.to_string())
}

pub fn verify_password(hash: &str, password: &str) -> Result<bool, argon2::password_hash::Error> {
    let parsed = argon2::PasswordHash::new(hash)?;
    Ok(Argon2::default().verify_password(password.as_bytes(), &parsed).is_ok())
}
`, description: "Create Rust Argon2id password utility", ruleId: "CRYPTO-003" });
  }
  return actions;
}
function buildRateLimitFix(root) {
  const lang = detectProjectLanguage(root);
  const fw = detectWebFramework(root, lang);
  const actions = [];
  if (lang === "typescript" || lang === "javascript") {
    const appFile = findMainAppFile(root);
    if (!appFile) return [];
    if (fw === "express") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install express-rate-limit", ruleId: "AUTH-002" });
      actions.push({ type: "append", filePath: appFile, content: `
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
`, description: "Add rate limiting (100 req/15min)", ruleId: "AUTH-002" });
    } else if (fw === "fastify") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install @fastify/rate-limit", ruleId: "AUTH-002" });
      actions.push({ type: "append", filePath: appFile, content: `
import rateLimit from '@fastify/rate-limit';
app.register(rateLimit, { max: 100, timeWindow: '15 minutes' });
`, description: "Add rate limiting to Fastify", ruleId: "AUTH-002" });
    }
  } else if (lang === "python") {
    const appFile = findMainAppFile(root) || "app.py";
    if (fw === "django") {
      actions.push({ type: "append", filePath: appFile, content: "\n# Rate limiting: pip install django-ratelimit\n# Add to views: @ratelimit(key='ip', rate='100/h', block=True)\n", description: "Add Django rate limiting note", ruleId: "AUTH-002" });
    } else if (fw === "fastapi") {
      actions.push({ type: "append", filePath: appFile, content: "\nfrom slowapi import Limiter\nfrom slowapi.util import get_remote_address\n\nlimiter = Limiter(key_func=get_remote_address)\n# Add to routes: @limiter.limit('100/15minutes')\n", description: "Add FastAPI rate limiting (slowapi)", ruleId: "AUTH-002" });
    } else if (fw === "flask") {
      actions.push({ type: "append", filePath: appFile, content: "\nfrom flask_limiter import Limiter\nfrom flask_limiter.util import get_remote_address\n\nlimiter = Limiter(app=app, key_func=get_remote_address, default_limits=['100 per 15 minute'])\n", description: "Add Flask rate limiting", ruleId: "AUTH-002" });
    }
  } else if (lang === "ruby") {
    if (fw === "rails") {
      actions.push({ type: "append", filePath: "Gemfile", content: "\ngem 'rack-attack'\n", description: "Add rack-attack for rate limiting", ruleId: "AUTH-002" });
      actions.push({ type: "append", filePath: "config/application.rb", content: "\nconfig.middleware.use Rack::Attack\nRack::Attack.throttle('req/ip', limit: 100, period: 15.minutes) { |req| req.ip }\n", description: "Add Rails rate limiting config", ruleId: "AUTH-002" });
    }
  } else if (lang === "go") {
    const appFile = findMainAppFile(root) || "main.go";
    actions.push({ type: "append", filePath: appFile, content: '\nimport (\n	"net/http"\n	"sync"\n	"time"\n)\n\ntype rateLimiter struct {\n	mu       sync.Mutex\n	visitors map[string][]time.Time\n	limit    int\n	window   time.Duration\n}\n\nfunc newRateLimiter(limit int, window time.Duration) *rateLimiter {\n	return &rateLimiter{visitors: make(map[string][]time.Time), limit: limit, window: window}\n}\n\nfunc (rl *rateLimiter) allow(ip string) bool {\n	rl.mu.Lock()\n	defer rl.mu.Unlock()\n	now := time.Now()\n	windowStart := now.Add(-rl.window)\n	var recent []time.Time\n	for _, t := range rl.visitors[ip] {\n		if t.After(windowStart) { recent = append(recent, t) }\n	}\n	rl.visitors[ip] = recent\n	if len(recent) >= rl.limit { return false }\n	rl.visitors[ip] = append(rl.visitors[ip], now)\n	return true\n}\n\nvar limiter = newRateLimiter(100, 15*time.Minute)\n\nfunc rateLimitMiddleware(next http.Handler) http.Handler {\n	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n		if !limiter.allow(r.RemoteAddr) {\n			http.Error(w, "Too many requests", http.StatusTooManyRequests)\n			return\n		}\n		next.ServeHTTP(w, r)\n	})\n}\n', description: "Add Go rate limiter middleware", ruleId: "AUTH-002" });
  } else if (lang === "java") {
    if (fw === "spring") {
      actions.push({ type: "create", filePath: "src/main/java/com/example/RateLimitConfig.java", content: `package com.example;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket newBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(15)));
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Bucket bucket = buckets.computeIfAbsent(request.getRemoteAddr(), k -> newBucket());
        if (bucket.tryConsume(1)) return true;
        response.setStatus(429);
        return false;
    }
}
`, description: "Create Spring rate limiter (bucket4j)", ruleId: "AUTH-002" });
    }
  } else if (lang === "php") {
    const appFile = findMainAppFile(root) || "public/index.php";
    actions.push({ type: "append", filePath: appFile, content: "\n// Rate limiting middleware\n$ip = $_SERVER['REMOTE_ADDR'];\n$limit = 100;\n$window = 900; // 15 minutes\n$cacheKey = 'rate_limit_' . $ip;\n// Implement with your cache layer (Redis, APCu, file-based)\n", description: "Add PHP rate limiting scaffolding", ruleId: "AUTH-002" });
  } else if (lang === "rust") {
    const appFile = findMainAppFile(root) || "src/main.rs";
    if (fw === "actix") {
      actions.push({ type: "append", filePath: appFile, content: "\n// Rate limiting: cargo add actix-governor\n// use actix_governor::{GovernorConfigBuilder, Governor};\n// let governor_conf = GovernorConfigBuilder::default()\n//     .per_second(1)\n//     .burst_size(20)\n//     .finish()\n//     .unwrap();\n// app.wrap(Governor::new(&governor_conf));\n", description: "Add Actix-web rate limiting (actix-governor)", ruleId: "AUTH-002" });
    } else if (fw === "axum") {
      actions.push({ type: "append", filePath: appFile, content: "\n// Rate limiting: cargo add tower --features limit\n// use tower::ServiceBuilder;\n// use tower::limit::RateLimitLayer;\n// use std::time::Duration;\n// let app = axum::Router::new()\n//     .layer(ServiceBuilder::new()\n//         .layer(RateLimitLayer::new(100, Duration::from_secs(900))));\n", description: "Add Axum rate limiting (tower)", ruleId: "AUTH-002" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\n// GESF Rate Limiting: 100 requests per 15 minutes\n// actix-web: cargo add actix-governor\n// axum: cargo add tower --features limit\n", description: "Add Rust rate limiting guidance", ruleId: "AUTH-002" });
    }
  }
  return actions;
}
function buildSessionTimeoutFix(root) {
  const lang = detectProjectLanguage(root);
  const fw = detectWebFramework(root, lang);
  const actions = [];
  if (lang === "typescript" || lang === "javascript") {
    const appFile = findMainAppFile(root);
    if (!appFile) return [];
    if (fw === "express") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install express-session", ruleId: "AUTH-003" });
      actions.push({ type: "append", filePath: appFile, content: `
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 30 * 60 * 1000 },
}));
`, description: "Add session with 30-min timeout", ruleId: "AUTH-003" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\nconst SESSION_TIMEOUT_MS = 30 * 60 * 1000;\n", description: "Add session timeout constant", ruleId: "AUTH-003" });
    }
  } else if (lang === "python") {
    if (fw === "django") {
      const settingsFile = findFileRecursive(root, "settings.py", ".") || "settings.py";
      actions.push({ type: "append", filePath: settingsFile, content: "\nSESSION_COOKIE_AGE = 1800  # 30 minutes\nSESSION_COOKIE_SECURE = True\nSESSION_COOKIE_HTTPONLY = True\nSESSION_EXPIRE_AT_BROWSER_CLOSE = True\n", description: "Add Django session timeout settings", ruleId: "AUTH-003" });
    } else {
      const appFile = findMainAppFile(root) || "app.py";
      actions.push({ type: "append", filePath: appFile, content: "\n# Session timeout: 30 minutes\nSESSION_TIMEOUT = 30 * 60\n", description: "Add session timeout constant", ruleId: "AUTH-003" });
    }
  } else if (lang === "ruby") {
    if (fw === "rails") {
      actions.push({ type: "append", filePath: "config/initializers/session_store.rb", content: "\nRails.application.config.session_store :cookie_store, expire_after: 30.minutes, secure: Rails.env.production?, httponly: true\n", description: "Add Rails session timeout", ruleId: "AUTH-003" });
    }
  } else if (lang === "go") {
    const appFile = findMainAppFile(root) || "main.go";
    actions.push({ type: "append", filePath: appFile, content: "\nconst sessionTimeout = 30 * time.Minute\n", description: "Add Go session timeout constant", ruleId: "AUTH-003" });
  } else if (lang === "java") {
    if (fw === "spring") {
      actions.push({ type: "append", filePath: "src/main/resources/application.properties", content: "\nserver.servlet.session.timeout=30m\nserver.servlet.session.cookie.http-only=true\nserver.servlet.session.cookie.secure=true\n", description: "Add Spring session timeout config", ruleId: "AUTH-003" });
    }
  } else if (lang === "php") {
    if (fw === "laravel") {
      actions.push({ type: "append", filePath: "config/session.php", content: "\n'lifetime' => 30,\n'expire_on_close' => true,\n'secure' => env('APP_ENV') === 'production',\n'http_only' => true,\n", description: "Add Laravel session timeout", ruleId: "AUTH-003" });
    } else {
      const appFile = findMainAppFile(root) || "public/index.php";
      actions.push({ type: "append", filePath: appFile, content: "\nini_set('session.gc_maxlifetime', 1800); // 30 minutes\nsession_set_cookie_params(1800, '/', '', true, true);\n", description: "Add PHP session timeout config", ruleId: "AUTH-003" });
    }
  } else if (lang === "rust") {
    const appFile = findMainAppFile(root) || "src/main.rs";
    actions.push({ type: "append", filePath: appFile, content: "\nconst SESSION_TIMEOUT_SECS: u64 = 30 * 60; // 30 minutes\n", description: "Add Rust session timeout constant", ruleId: "AUTH-003" });
  }
  return actions;
}
function buildCORSWildcardFix(root) {
  const lang = detectProjectLanguage(root);
  const appFile = findMainAppFile(root);
  if (!appFile) return [];
  const content = readFileSafe(path3.join(root, appFile)) || "";
  const actions = [];
  const wildcardPatterns = ["origin: '*'", "origin:'*'", 'origin:"*"', "Access-Control-Allow-Origin: *"];
  for (const pattern of wildcardPatterns) {
    if (!content.includes(pattern)) continue;
    if (lang === "python") {
      const replacement = pattern.includes("*'") || pattern.includes('*"') ? "origins=['http://localhost:3000']" : "origins=['http://localhost:3000']";
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: replacement, description: "Replace CORS wildcard", ruleId: "AUTH-004" });
    } else if (lang === "go") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: 'w.Header().Set("Access-Control-Allow-Origin", os.Getenv("ALLOWED_ORIGIN"))', description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else if (lang === "ruby") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: "origins ENV.fetch('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')", description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else if (lang === "java") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: 'config.addAllowedOrigin(System.getenv("ALLOWED_ORIGIN"))', description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else if (lang === "php") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: "$response->headers->set('Access-Control-Allow-Origin', getenv('ALLOWED_ORIGIN'))", description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else if (lang === "rust") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: 'allowed_origin(std::env::var("ALLOWED_ORIGIN").unwrap_or("http://localhost:3000".to_string()))', description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: "origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']", description: "Replace CORS wildcard", ruleId: "AUTH-004" });
    }
  }
  return actions;
}
function buildTimestampsFix(root, f) {
  if (f.file.endsWith(".prisma")) {
    const content = readFileSafe(path3.join(root, f.file));
    if (!content) return [];
    const modelMatch = content.match(/model\s+\w+\s*\{[^}]*\}/g);
    if (!modelMatch || modelMatch.length === 0) return [];
    const block = modelMatch[0];
    const closingBrace = block.lastIndexOf("}");
    if (closingBrace === -1) return [];
    const insertion = "\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt";
    return [{ type: "modify", filePath: f.file, search: block, replace: block.slice(0, closingBrace) + insertion + block.slice(closingBrace), description: "Add createdAt/updatedAt to Prisma model", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".py")) {
    return [{ type: "append", filePath: f.file, content: "\n# GESF: Add audit timestamps\n# For Django models:\n#   created_at = models.DateTimeField(auto_now_add=True)\n#   updated_at = models.DateTimeField(auto_now=True)\n# For SQLAlchemy:\n#   created_at = Column(DateTime, default=datetime.utcnow)\n#   updated_at = Column(DateTime, onupdate=datetime.utcnow)\n", description: "Add Python timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".rb")) {
    return [{ type: "append", filePath: f.file, content: "\n# GESF: Rails has built-in timestamps. Add to model:\n#   create_table :your_table do |t|\n#     t.timestamps\n#   end\n", description: "Add Rails timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".go")) {
    return [{ type: "append", filePath: f.file, content: '\n// GESF: Add audit timestamps to GORM models:\n// type YourModel struct {\n//   ID        uint           `json:"id" gorm:"primaryKey"`\n//   CreatedAt time.Time      `json:"created_at"`\n//   UpdatedAt time.Time      `json:"updated_at"`\n// }\n', description: "Add Go timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".java")) {
    return [{ type: "append", filePath: f.file, content: '\n// GESF: Add JPA audit timestamps:\n// @CreatedDate\n// @Column(name = "created_at", updatable = false)\n// private Instant createdAt;\n//\n// @LastModifiedDate\n// @Column(name = "updated_at")\n// private Instant updatedAt;\n', description: "Add Java JPA timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".php")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Laravel uses timestamps() in migrations:\n// $table->timestamps(); // adds created_at, updated_at\n// $table->softDeletes(); // adds deleted_at\n", description: "Add Laravel timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".rs")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add audit timestamps to ORM models:\n// Diesel: created_at TIMESTAMP NOT NULL DEFAULT NOW(),\n//         updated_at TIMESTAMP NOT NULL DEFAULT NOW(),\n// SQLx:   created_at: chrono::NaiveDateTime,\n//         updated_at: chrono::NaiveDateTime,\n// SeaORM: created_at: DateTime,\n//         updated_at: DateTime,\n", description: "Add Rust timestamp guidance", ruleId: "DB-001" }];
  }
  return [];
}
function buildSoftDeleteFix(root, f) {
  if (f.file.endsWith(".prisma")) {
    const content = readFileSafe(path3.join(root, f.file));
    if (!content) return [];
    const modelMatch = content.match(/model\s+\w+\s*\{[^}]*\}/g);
    if (!modelMatch || modelMatch.length === 0) return [];
    const block = modelMatch[0];
    const closingBrace = block.lastIndexOf("}");
    if (closingBrace === -1) return [];
    return [{ type: "modify", filePath: f.file, search: block, replace: block.slice(0, closingBrace) + "\n  deletedAt  DateTime?" + block.slice(closingBrace), description: "Add deletedAt to Prisma model", ruleId: "DB-002" }];
  }
  if (f.file.endsWith(".py")) {
    return [{ type: "append", filePath: f.file, content: "\n# GESF: Add soft delete to Django/SQLAlchemy:\n# Django: deleted_at = models.DateTimeField(null=True, blank=True)\n# SQLAlchemy: deleted_at = Column(DateTime, nullable=True)\n", description: "Add Python soft delete guidance", ruleId: "DB-002" }];
  }
  if (f.file.endsWith(".go")) {
    return [{ type: "append", filePath: f.file, content: '\n// GESF: Add soft delete to GORM:\n// DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`\n', description: "Add Go soft delete guidance", ruleId: "DB-002" }];
  }
  if (f.file.endsWith(".rs")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add soft delete:\n// Diesel: deleted_at TIMESTAMP NULL,\n// SQLx:   deleted_at: Option<chrono::NaiveDateTime>,\n// SeaORM: deleted_at: Option<DateTime>,\n", description: "Add Rust soft delete guidance", ruleId: "DB-002" }];
  }
  return [];
}
function buildUserAuditFix(root, f) {
  if (f.file.endsWith(".prisma")) {
    const content = readFileSafe(path3.join(root, f.file));
    if (!content) return [];
    const modelMatch = content.match(/model\s+\w+\s*\{[^}]*\}/g);
    if (!modelMatch || modelMatch.length === 0) return [];
    const block = modelMatch[0];
    const closingBrace = block.lastIndexOf("}");
    if (closingBrace === -1) return [];
    return [{ type: "modify", filePath: f.file, search: block, replace: block.slice(0, closingBrace) + "\n  createdBy  String?\n  updatedBy  String?" + block.slice(closingBrace), description: "Add createdBy/updatedBy columns", ruleId: "DB-003" }];
  }
  if (f.file.endsWith(".py")) {
    return [{ type: "append", filePath: f.file, content: "\n# GESF: Add user audit columns:\n# Django: created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')\n# SQLAlchemy: created_by = Column(Integer, ForeignKey('users.id'))\n", description: "Add Python user audit guidance", ruleId: "DB-003" }];
  }
  if (f.file.endsWith(".rs")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add user audit columns:\n// Diesel: created_by VARCHAR(255) NULL,\n//         updated_by VARCHAR(255) NULL,\n// SQLx:   created_by: Option<String>,\n//         updated_by: Option<String>,\n", description: "Add Rust user audit guidance", ruleId: "DB-003" }];
  }
  return [];
}
function buildAuditModelFix(root) {
  if (fs2.existsSync(path3.join(root, "prisma/schema.prisma"))) {
    return [{ type: "append", filePath: "prisma/schema.prisma", content: "\\nmodel Audit {\\n  id        Int      @id @default(autoincrement())\\n  userId    String\\n  action    String\\n  resource  String\\n  timestamp DateTime @default(now())\\n  ipAddress String\\n  metadata  Json?\\n}\\n", description: "Add Audit model to Prisma schema", ruleId: "DB-004" }];
  }
  const lang = detectProjectLanguage(root);
  if (lang === "python") {
    return [{ type: "create", filePath: "lib/models/audit.py", content: `from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Audit(Base):
    __tablename__ = 'audit'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(255))
    action = Column(String(255))
    resource = Column(String(255))
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(45))
    metadata = Column(JSON)
`, description: "Create Python Audit model (SQLAlchemy)", ruleId: "DB-004" }];
  }
  if (lang === "go") {
    return [{ type: "create", filePath: "lib/models/audit.go", content: `package models

import "time"

type Audit struct {
	ID        uint      \`json:"id" gorm:"primaryKey;autoIncrement"\`
	UserID    string    \`json:"userId"\`
	Action    string    \`json:"action"\`
	Resource  string    \`json:"resource"\`
	Timestamp time.Time \`json:"timestamp" gorm:"default:now()"\`
	IPAddress string    \`json:"ipAddress"\`
}
`, description: "Create Go Audit model (GORM)", ruleId: "DB-004" }];
  }
  if (lang === "java") {
    return [{ type: "create", filePath: "src/main/java/com/example/Audit.java", content: `package com.example;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit")
public class Audit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String action;
    private String resource;
    private String ipAddress;
    @Column(columnDefinition = "jsonb")
    private String metadata;
    private Instant timestamp = Instant.now();
}
`, description: "Create Java Audit entity (JPA)", ruleId: "DB-004" }];
  }
  if (lang === "rust") {
    return [{ type: "create", filePath: "src/models/audit.rs", content: `use chrono::NaiveDateTime;

#[derive(Debug, Queryable, Serialize)]
pub struct Audit {
    pub id: i32,
    pub user_id: String,
    pub action: String,
    pub resource: String,
    pub ip_address: String,
    pub timestamp: NaiveDateTime,
}

// Diesel table definition:
// table! {
//     audit (id) {
//         id -> Int4,
//         user_id -> Varchar,
//         action -> Varchar,
//         resource -> Varchar,
//         ip_address -> Varchar,
//         timestamp -> Timestamp,
//     }
// }
`, description: "Create Rust Audit model (Diesel)", ruleId: "DB-004" }];
  }
  return [];
}
function getNpmInstallsFromActions(actions) {
  const installs = /* @__PURE__ */ new Set();
  for (const a of actions) {
    if (a.type !== "npm-install") continue;
    const map = {
      "CONFIG-001": "helmet",
      "CONFIG-002": "cors",
      "CONFIG-010": "pino",
      "CRYPTO-003": "argon2",
      "AUTH-002": "express-rate-limit",
      "AUTH-003": "express-session"
    };
    if (map[a.ruleId]) installs.add(map[a.ruleId]);
  }
  return [...installs];
}
function buildEncryptionAtRestImpl(root, hasSrc) {
  const lang = detectProjectLanguage(root);
  if (lang === "rust") {
    return [
      { type: "create", filePath: "src/encryption.rs", content: `use aes_gcm::{Aes256Gcm, KeyInit, Nonce};
use aes_gcm::aead::Aead;
use rand::RngCore;
use base64::{Engine, engine::general_purpose::STANDARD as BASE64};

pub fn encrypt(plaintext: &str, key: &[u8; 32]) -> Result<String, aes_gcm::Error> {
    let cipher = Aes256Gcm::new(key.into());
    let mut nonce_bytes = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);
    let ciphertext = cipher.encrypt(nonce, plaintext.as_bytes())?;
    let mut combined = nonce_bytes.to_vec();
    combined.extend_from_slice(&ciphertext);
    Ok(BASE64.encode(&combined))
}

pub fn decrypt(encoded: &str, key: &[u8; 32]) -> Result<String, aes_gcm::Error> {
    let combined = BASE64.decode(encoded).map_err(|_| aes_gcm::Error)?;
    let (nonce_bytes, ciphertext) = combined.split_at(12);
    let cipher = Aes256Gcm::new(key.into());
    let nonce = Nonce::from_slice(nonce_bytes);
    let plaintext = cipher.decrypt(nonce, ciphertext)?;
    String::from_utf8(plaintext).map_err(|_| aes_gcm::Error)
}
`, description: "Create Rust AES-256-GCM encryption utility", ruleId: "GDPR-ART32-002" }
    ];
  }
  const cryptoPath = hasSrc ? "src/lib/encryption.ts" : "lib/encryption.ts";
  return [
    { type: "npm-install", filePath: "package.json", description: "Node.js crypto is built-in", ruleId: "GDPR-ART32-002" },
    { type: "create", filePath: cryptoPath, content: `import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function deriveKey(secret: string, salt: Buffer): Buffer {
  return scryptSync(secret, salt, 32);
}

export function encrypt(plaintext: string, secret: string): string {
  const salt = randomBytes(16);
  const key = deriveKey(secret, salt);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

export function decrypt(ciphertext: string, secret: string): string {
  const data = Buffer.from(ciphertext, 'base64');
  const salt = data.subarray(0, 16);
  const iv = data.subarray(16, 32);
  const tag = data.subarray(32, 48);
  const encrypted = data.subarray(48);
  const key = deriveKey(secret, salt);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final('utf8');
}
`, description: "Create AES-256-GCM encryption utility", ruleId: "GDPR-ART32-002" }
  ];
}
function buildEncryptionInTransitImpl(root, _hasSrc) {
  const lang = detectProjectLanguage(root);
  const appFile = findMainAppFile(root);
  const actions = [];
  if (lang === "rust") {
    if (appFile) {
      actions.push({ type: "append", filePath: appFile, content: "\n// GESF: Enforce TLS in production\n// Use a reverse proxy (nginx, caddy) for TLS termination\n// or configure rustls with your certificate:\n// let config = rustls::ServerConfig::builder()\n//     .with_safe_defaults()\n//     .with_no_client_auth()\n//     .with_single_cert(certs, key);\n", description: "Add Rust TLS guidance", ruleId: "GDPR-ART32-003" });
    }
    return actions;
  }
  if (appFile) {
    actions.push({ type: "append", filePath: appFile, content: "\nif (process.env.NODE_ENV === 'production') {\n  app.use((req, res, next) => {\n    if (req.headers['x-forwarded-proto'] === 'http') {\n      return res.redirect(301, `https://${req.headers.host}${req.url}`);\n    }\n    next();\n  });\n}\n", description: "Add HTTPS redirect middleware", ruleId: "GDPR-ART32-003" });
  }
  return actions;
}
function buildUserIdentificationImpl(root, hasSrc) {
  const lang = detectProjectLanguage(root);
  if (lang === "rust") {
    const authPath2 = "src/auth.rs";
    if (fs2.existsSync(path3.join(root, authPath2))) return [];
    return [
      { type: "create", filePath: authPath2, content: `use argon2::{Argon2, Algorithm, Version, Params};
use argon2::password_hash::{SaltString, PasswordHasher, PasswordVerifier};
use rand::rngs::OsRng;

pub fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);
    let params = Params::new(65536, 3, 4, Some(32))?;
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);
    let hash = argon2.hash_password(password.as_bytes(), &salt)?;
    Ok(hash.to_string())
}

pub fn verify_password(hash: &str, password: &str) -> Result<bool, argon2::password_hash::Error> {
    let parsed = argon2::PasswordHash::new(hash)?;
    Ok(Argon2::default().verify_password(password.as_bytes(), &parsed).is_ok())
}
`, description: "Create Rust auth utility with Argon2id", ruleId: "GDPR-ART32-004" }
    ];
  }
  const authPath = hasSrc ? "src/lib/auth.ts" : "lib/auth.ts";
  if (fs2.existsSync(path3.join(root, authPath))) return [];
  return [
    { type: "npm-install", filePath: "package.json", description: "Install argon2 for password hashing", ruleId: "GDPR-ART32-004" },
    { type: "create", filePath: authPath, content: `import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hashedPassword: string, inputPassword: string): Promise<boolean> {
  return argon2.verify(hashedPassword, inputPassword);
}
`, description: "Create auth utility with Argon2id", ruleId: "GDPR-ART32-004" }
  ];
}
function buildIntegrityControlsImpl(root, hasSrc) {
  const lang = detectProjectLanguage(root);
  if (lang === "rust") {
    return [
      { type: "create", filePath: "src/integrity.rs", content: `use sha2::{Sha256, Digest};

pub fn hash_data(data: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data.as_bytes());
    format!("{:x}", hasher.finalize())
}

pub fn verify_integrity(data: &str, expected_hash: &str) -> bool {
    hash_data(data) == expected_hash
}

pub fn generate_checksum(content: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(content);
    format!("{:x}", hasher.finalize())
}
`, description: "Create Rust integrity verification utility", ruleId: "GDPR-ART32-007" }
    ];
  }
  const integrityPath = hasSrc ? "src/lib/integrity.ts" : "lib/integrity.ts";
  return [
    { type: "create", filePath: integrityPath, content: `import { createHash } from 'node:crypto';

export function hashData(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function verifyIntegrity(data: string, expectedHash: string): boolean {
  return hashData(data) === expectedHash;
}

export function generateChecksum(content: string): string {
  return createHash('sha256').update(content).digest('base64');
}
`, description: "Create integrity verification utility", ruleId: "GDPR-ART32-007" }
  ];
}
function buildBackupPolicyImpl(root, _hasSrc) {
  return [
    { type: "create", filePath: "scripts/backup.sh", content: `#!/bin/bash
set -euo pipefail

BACKUP_DIR="\${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz.gpg"
ENCRYPTION_KEY="'''\${BACKUP_ENCRYPTION_KEY:-change-me}'''"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."

if command -v pg_dump &> /dev/null; then
  pg_dump "$DATABASE_URL" | gpg --symmetric --cipher-algo AES256 --batch --passphrase "$ENCRYPTION_KEY" -o "$BACKUP_FILE"
  echo "[$(date)] Database backup completed: $BACKUP_FILE"
fi

tar czf - ./data 2>/dev/null | gpg --symmetric --cipher-algo AES256 --batch --passphrase "$ENCRYPTION_KEY" -o "$BACKUP_DIR/data_$TIMESTAMP.tar.gz.gpg" 2>/dev/null || true

echo "[$(date)] Backup completed."

find "$BACKUP_DIR" -name "*.gpg" -mtime +30 -delete
echo "[$(date)] Cleaned up backups older than 30 days."
`, description: "Create encrypted backup script", ruleId: "GDPR-ART32-008" }
  ];
}
function buildSecurityTestingImpl(root) {
  const lang = detectProjectLanguage(root);
  const setupSteps = lang === "rust" ? `      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: cargo build
      - name: cargo audit
        run: cargo install cargo-audit && cargo audit` : `      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - name: npm audit
        run: npm audit --audit-level=high
        continue-on-error: true`;
  return [
    { type: "create", filePath: ".github/workflows/security-scan.yml", content: `name: Security Scan
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  schedule:
    - cron: '0 6 * * 1'

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
${setupSteps}
      - name: Run GESF compliance check
        run: npx @greenarmor/ges audit --ci
`, description: "Create security scanning GitHub Actions workflow", ruleId: "GDPR-ART32-009" },
    { type: "create", filePath: ".github/workflows/sbom-scan.yml", content: `name: SBOM Generation & Scan
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  schedule:
    - cron: '0 6 * * 1'

jobs:
  sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate SBOM with Syft
        uses: anchore/sbom-action@v0
        with:
          image: ""
          path: .
          format: cyclonedx-json
          output-file: sbom.json
          fail-build: false

      - name: Scan SBOM for vulnerabilities with Grype
        uses: anchore/scan-action@v6
        with:
          sbom: sbom.json
          fail-build: true
          severity-cutoff: high

      - name: Upload SBOM artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: sbom-artifacts
          path: sbom.json
          retention-days: 90
`, description: "Create SBOM generation and scanning GitHub Actions workflow", ruleId: "GDPR-ART32-009" }
  ];
}
function generateDataInventory(projectName, projectType) {
  const webCategories = [
    { category: "User Profiles", type: "Personal", classification: "Restricted", retention: "Account + 30 days", basis: "Contract (Art. 6(1)(b))" },
    { category: "Email Addresses", type: "Personal", classification: "Confidential", retention: "Account + 30 days", basis: "Contract (Art. 6(1)(b))" },
    { category: "Authentication Credentials", type: "Personal", classification: "Restricted", retention: "Session duration", basis: "Contract (Art. 6(1)(b))" },
    { category: "IP Addresses", type: "Personal", classification: "Internal", retention: "30 days", basis: "Legitimate interest (Art. 6(1)(f))" },
    { category: "Session Data", type: "Operational", classification: "Internal", retention: "Session duration", basis: "Contract (Art. 6(1)(b))" },
    { category: "Audit Logs", type: "Operational", classification: "Internal", retention: "1 year", basis: "Legal obligation (Art. 6(1)(c))" }
  ];
  const aiCategories = [
    { category: "AI Prompts", type: "Personal", classification: "Confidential", retention: "90 days", basis: "Legitimate interest (Art. 6(1)(f))" },
    { category: "AI Outputs", type: "Personal", classification: "Internal", retention: "30 days", basis: "Legitimate interest (Art. 6(1)(f))" },
    { category: "Training Data References", type: "Personal", classification: "Restricted", retention: "Duration of use", basis: "Consent (Art. 6(1)(a))" }
  ];
  const blockchainCategories = [
    { category: "Wallet Addresses", type: "Pseudonymous", classification: "Public", retention: "Indefinite (on-chain)", basis: "Contract (Art. 6(1)(b))" },
    { category: "Transaction History", type: "Pseudonymous", classification: "Public", retention: "Indefinite (on-chain)", basis: "Contract (Art. 6(1)(b))" },
    { category: "KYC Data", type: "Personal", classification: "Restricted", retention: "5 years", basis: "Legal obligation (Art. 6(1)(c))" }
  ];
  let categories = webCategories;
  if (projectType.includes("ai")) categories = [...webCategories, ...aiCategories];
  if (projectType.includes("blockchain") || projectType.includes("wallet")) categories = [...webCategories, ...blockchainCategories];
  if (projectType.includes("healthcare")) {
    categories = [...webCategories, { category: "Health Records", type: "Special Category", classification: "Restricted", retention: "10 years", basis: "Legal obligation (Art. 6(1)(c) + Art. 9)" }];
  }
  if (projectType.includes("photo")) {
    categories = [...webCategories, { category: "Photos/Images", type: "Personal", classification: "Restricted", retention: "Account + 30 days", basis: "Contract (Art. 6(1)(b))" }];
  }
  const lines = [
    `# Data Inventory - ${projectName}
`,
    `Generated: ${(/* @__PURE__ */ new Date()).toISOString()}
`,
    `## Data Categories
`,
    `| Category | Type | Classification | Retention | Legal Basis |`,
    `|----------|------|---------------|-----------|-------------|`
  ];
  for (const cat of categories) {
    lines.push(`| ${cat.category} | ${cat.type} | ${cat.classification} | ${cat.retention} | ${cat.basis} |`);
  }
  lines.push("");
  lines.push("## Data Classification Rules\n");
  lines.push("| Classification | Encryption | Access Controls | Audit Logging |");
  lines.push("|---------------|-----------|-----------------|---------------|");
  lines.push("| Public | Not required | Not required | Not required |");
  lines.push("| Internal | Not required | Required | Recommended |");
  lines.push("| Confidential | Required | Required | Required |");
  lines.push("| Restricted | Required | Required + MFA | Required + Immutable |");
  lines.push("");
  lines.push("## Data Subject Rights Implementation\n");
  lines.push("- [ ] Right of access (Article 15) - API endpoint or process implemented");
  lines.push("- [ ] Right to rectification (Article 16) - Update process documented");
  lines.push("- [ ] Right to erasure (Article 17) - Deletion process with verification");
  lines.push("- [ ] Right to restriction (Article 18) - Mark-and-hold process");
  lines.push("- [ ] Right to data portability (Article 20) - Export in machine-readable format");
  lines.push("- [ ] Right to object (Article 21) - Opt-out mechanism");
  lines.push("");
  lines.push("## Third-Party Processors\n");
  lines.push("| Processor | Data Shared | Purpose | DPA Signed | Location |");
  lines.push("|-----------|------------|---------|------------|----------|");
  lines.push("| [Cloud Provider] | [Data categories] | [Purpose] | [Yes/No] | [Country] |");
  lines.push("");
  lines.push("## Cross-Border Transfers\n");
  lines.push("| Transfer From | Transfer To | Safeguard |");
  lines.push("|--------------|------------|-----------|");
  lines.push("| [EU] | [Country] | [SCCs / Adequacy Decision / BCRs] |");
  return lines.join("\n");
}
function generateProcessingRecords(projectName, controllerName) {
  const lines = [
    `# Records of Processing Activities (ROPA) - ${projectName}
`,
    `**Controller**: ${controllerName}`,
    `**Date**: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`,
    `**Document Reference**: ROPA-${projectName.replace(/\s+/g, "-").toUpperCase()}-001
`,
    `## Article 30(1) \u2014 Controller Records
`
  ];
  const activities = [
    {
      name: "User Account Management",
      purpose: "Provision and manage user accounts",
      categories: "Identity data, contact data, authentication data",
      recipients: "Internal systems, identity provider",
      transfers: "None (or specify if applicable)",
      retention: "Account lifetime + 30 days post-deletion",
      security: "Encryption at rest (AES-256-GCM), TLS 1.2+ in transit, MFA, RBAC"
    },
    {
      name: "Service Delivery",
      purpose: "Deliver core product/service functionality",
      categories: "Usage data, preferences, content data",
      recipients: "Internal systems, CDN provider",
      transfers: "None (or specify)",
      retention: "Account lifetime",
      security: "Encryption, access controls, audit logging"
    },
    {
      name: "Communication",
      purpose: "Service notifications, support, marketing (with consent)",
      categories: "Email addresses, communication preferences",
      recipients: "Email service provider",
      transfers: "None (or specify)",
      retention: "Until consent withdrawal or account closure",
      security: "Encryption, access controls"
    },
    {
      name: "Analytics and Monitoring",
      purpose: "Service improvement and security monitoring",
      categories: "Usage data, IP addresses, device information",
      recipients: "Analytics provider, monitoring systems",
      transfers: "None (or specify)",
      retention: "12 months for analytics, 1 year for security logs",
      security: "Pseudonymization, access controls, aggregated reporting"
    },
    {
      name: "Legal Compliance",
      purpose: "Meet regulatory and legal obligations",
      categories: "Identity data, transaction records, audit logs",
      recipients: "Legal authorities (upon request), auditors",
      transfers: "As required by law",
      retention: "Per legal requirements (typically 5-7 years)",
      security: "Encryption, access controls, immutable audit trail"
    }
  ];
  for (const activity of activities) {
    lines.push(`### ${activity.name}
`);
    lines.push(`- **Purpose**: ${activity.purpose}`);
    lines.push(`- **Categories of Data Subjects**: Users, customers, employees`);
    lines.push(`- **Categories of Personal Data**: ${activity.categories}`);
    lines.push(`- **Categories of Recipients**: ${activity.recipients}`);
    lines.push(`- **International Transfers**: ${activity.transfers}`);
    lines.push(`- **Retention Period**: ${activity.retention}`);
    lines.push(`- **Technical and Organizational Measures**: ${activity.security}`);
    lines.push(`- **Legal Basis**: Contract (Art. 6(1)(b)), Legitimate Interest (Art. 6(1)(f))
`);
  }
  lines.push("## Data Protection Officer\n");
  lines.push("- **Name**: [DPO Name or N/A if not required]");
  lines.push("- **Contact**: [DPO Contact Details]");
  lines.push("");
  lines.push("## Review History\n");
  lines.push("| Date | Reviewer | Changes |");
  lines.push("|------|----------|---------|");
  lines.push(`| ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]} | Initial | Created ROPA |`);
  return lines.join("\n");
}
function handleRequest(request) {
  const isNotification = request.id === void 0 || request.id === null;
  if (request.method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "gesf-mcp-server",
          version: GESF_VERSION
        }
      }
    };
  }
  if (request.method === "notifications/initialized") {
    return null;
  }
  if (request.method === "notifications/cancelled") {
    return null;
  }
  if (request.method === "ping") {
    if (isNotification) return null;
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {}
    };
  }
  if (request.method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: { tools: TOOLS }
    };
  }
  if (request.method === "tools/call") {
    const toolName = request.params?.name || "";
    const args = request.params?.arguments || {};
    let resultText;
    try {
      switch (toolName) {
        case "check_compliance": {
          const projectType = args.project_type || "saas";
          const packs = getPacksForProjectType(projectType);
          const controls = packs.flatMap((p) => p.controls);
          const frameworks = [...new Set(controls.map((c) => c.framework))];
          const score = generateScoreFile(controls, frameworks);
          resultText = formatScoreOutput(score);
          break;
        }
        case "check_project_status": {
          const projectPath = resolveProjectPath(args.project_path);
          const { config, score, overrides } = loadProjectConfig(projectPath);
          if (!config) {
            resultText = `No GESF project found at ${projectPath}. Run 'ges init' first to initialize the project.`;
            break;
          }
          const lines = [];
          lines.push(`# Project Status: ${config.project_name || "Unknown"}
`);
          lines.push(`**Path**: ${projectPath}`);
          lines.push(`**Type**: ${config.project_type || "Unknown"}`);
          lines.push(`**Initialized**: ${config.created_at || "Unknown"}`);
          lines.push(`**Frameworks**: ${Array.isArray(config.frameworks) ? config.frameworks.join(", ") : "Unknown"}`);
          if (overrides.length > 0) {
            const naCount = overrides.filter((o) => o.status === "not-applicable").length;
            const passCount = overrides.filter((o) => o.status === "pass").length;
            lines.push(`**Control Overrides**: ${overrides.length} (${naCount} not-applicable, ${passCount} pre-verified)`);
          }
          if (score) {
            lines.push(`
## Compliance Score
`);
            lines.push(`**Overall: ${score.overall}% (Grade: ${score.overall_grade})**
`);
            lines.push("| Framework | Score | Grade | Passed | Failed | Warnings | Critical |");
            lines.push("|-----------|-------|-------|--------|--------|----------|----------|");
            for (const [fw, data] of Object.entries(score.frameworks)) {
              lines.push(`| ${fw} | ${data.score}% | ${data.grade} | ${data.passed_controls} | ${data.failed_controls} | ${data.warning_controls} | ${data.critical_failures} |`);
            }
            if (score.audit_impact) {
              const ai = score.audit_impact;
              lines.push(`
**Audit Impact**: -${ai.total_deduction}% (${ai.critical_findings} critical, ${ai.high_findings} high, ${ai.medium_findings} medium, ${ai.low_findings} low findings)`);
            }
            lines.push(`
Last evaluated: ${score.evaluated_at}`);
          } else {
            lines.push("\nNo compliance score found. Run 'ges audit' then 'ges score'.");
          }
          const controlsDir = path3.join(projectPath, "controls");
          if (fs2.existsSync(controlsDir)) {
            const controlFiles = fs2.readdirSync(controlsDir).filter((f) => f.endsWith(".json"));
            if (controlFiles.length > 0) {
              lines.push(`
**Control Files**: ${controlFiles.join(", ")}`);
            }
          }
          resultText = lines.join("\n");
          break;
        }
        case "list_missing_controls": {
          const framework = args.framework || "GDPR";
          const projectType = args.project_type;
          let controls;
          if (projectType) {
            const packs = getPacksForProjectType(projectType);
            controls = packs.flatMap((p) => p.controls);
          } else {
            controls = getAllPacks().flatMap((p) => p.controls);
          }
          const missing = controls.filter(
            (c) => c.framework.toLowerCase() === framework.toLowerCase() && c.status !== "pass"
          );
          if (missing.length === 0) {
            resultText = `All ${framework} controls are passing. No missing controls found.`;
          } else {
            const lines = [`# Missing Controls - ${framework}
`];
            const critical = missing.filter((c) => c.severity === "critical");
            const high = missing.filter((c) => c.severity === "high");
            const medium = missing.filter((c) => c.severity === "medium");
            const low = missing.filter((c) => c.severity === "low");
            lines.push(`**Total**: ${missing.length} (${critical.length} critical, ${high.length} high, ${medium.length} medium, ${low.length} low)
`);
            for (const group of [
              { label: "Critical", items: critical },
              { label: "High", items: high },
              { label: "Medium", items: medium },
              { label: "Low", items: low }
            ]) {
              if (group.items.length > 0) {
                lines.push(`## ${group.label} Severity
`);
                for (const c of group.items) {
                  lines.push(`**${c.id}**: ${c.name}`);
                  lines.push(`  Status: ${c.status} | Category: ${c.category}`);
                  lines.push(`  ${c.implementation_guidance.split(".")[0]}
`);
                }
              }
            }
            lines.push(`
Use \`fix_recommendation\` with a control_id to get detailed implementation guidance.`);
            resultText = lines.join("\n");
          }
          break;
        }
        case "list_framework_controls": {
          const framework = args.framework || "GDPR";
          const statusFilter = args.status_filter;
          let allControls;
          const pack = getPack(framework.toLowerCase());
          if (pack) {
            allControls = pack.controls;
          } else {
            allControls = getAllPacks().flatMap((p) => p.controls);
          }
          const filtered = framework.toLowerCase() !== "all" ? allControls.filter((c) => c.framework.toLowerCase() === framework.toLowerCase()) : allControls;
          const controls = statusFilter ? filtered.filter((c) => c.status === statusFilter) : filtered;
          if (controls.length === 0) {
            resultText = statusFilter ? `No ${framework} controls with status '${statusFilter}' found.` : `No controls found for framework '${framework}'. Available: GDPR, OWASP, CIS, NIST, AI, blockchain, government.`;
          } else {
            const lines = [`# ${framework} Controls (${controls.length} total${statusFilter ? `, filtered by: ${statusFilter}` : ""})
`];
            lines.push("| ID | Name | Severity | Category | Status |");
            lines.push("|----|------|----------|----------|--------|");
            for (const c of controls) {
              lines.push(`| ${c.id} | ${c.name} | ${c.severity} | ${c.category} | ${c.status} |`);
            }
            lines.push(`
### Summary`);
            const byStatus = {};
            for (const c of controls) {
              byStatus[c.status] = (byStatus[c.status] || 0) + 1;
            }
            for (const [status, count] of Object.entries(byStatus)) {
              lines.push(`- ${status}: ${count}`);
            }
            resultText = lines.join("\n");
          }
          break;
        }
        case "run_audit": {
          const projectPath = resolveProjectPath(args.project_path);
          if (!fs2.existsSync(projectPath)) {
            resultText = `Project path does not exist: ${projectPath}`;
            break;
          }
          if (!fs2.existsSync(path3.join(projectPath, ".ges"))) {
            resultText = `GESF not initialized at ${projectPath}. Run 'ges init' first.`;
            break;
          }
          const { findings: rawFindings, scannedFiles } = runAudit(projectPath);
          const findings = deduplicateFindings(rawFindings);
          const projectConfig = loadProjectConfig(projectPath);
          const config = projectConfig.config;
          const frameworks = config?.frameworks || ["GDPR", "OWASP"];
          const projectType = config?.project_type || "generic-web-application";
          const controls = getControlsForProject(projectType, frameworks);
          const overriddenControls = applyControlOverrides(controls, projectConfig.overrides);
          const auditedControls = updateControlsFromFindings(overriddenControls, findings);
          const score = generateScoreFile(auditedControls, frameworks, findings);
          const critical = findings.filter((f) => f.severity === "critical");
          const high = findings.filter((f) => f.severity === "high");
          const medium = findings.filter((f) => f.severity === "medium");
          const low = findings.filter((f) => f.severity === "low");
          const lines = [];
          lines.push(`# Security Audit Report
`);
          lines.push(`**Scanned**: ${scannedFiles} files`);
          lines.push(`**Findings**: ${findings.length} total (${critical.length} critical, ${high.length} high, ${medium.length} medium, ${low.length} low)
`);
          if (findings.length > 0) {
            const grouped = {};
            for (const f of findings) {
              if (!grouped[f.category]) grouped[f.category] = [];
              grouped[f.category].push(f);
            }
            const categoryOrder = ["secrets", "encryption", "authentication", "injection", "xss", "security", "database", "config", "infrastructure", "dependencies"];
            for (const cat of categoryOrder) {
              if (!grouped[cat]) continue;
              lines.push(`## ${cat.charAt(0).toUpperCase() + cat.slice(1)}
`);
              for (const f of grouped[cat]) {
                const loc = f.file !== "project" ? ` (${f.file}${f.line ? `:${f.line}` : ""})` : " (project-wide)";
                lines.push(`- **[${f.severity.toUpperCase()}] ${f.title}**${loc}`);
                lines.push(`  Evidence: ${f.evidence.slice(0, 150)}`);
                lines.push(`  Fix: ${f.fix}`);
                if (f.controlIds && f.controlIds.length > 0) {
                  lines.push(`  Controls: ${f.controlIds.join(", ")}`);
                }
                lines.push("");
              }
            }
          } else {
            lines.push("**No security findings detected.** All scanned files are clean.\n");
          }
          lines.push("## Compliance Score\n");
          lines.push(`**Overall: ${score.overall}% (Grade: ${score.overall_grade})**
`);
          for (const [fw, data] of Object.entries(score.frameworks)) {
            lines.push(`- ${fw}: ${data.score}% (${data.grade}) \u2014 ${data.passed_controls}/${data.total_controls} controls passed, ${data.critical_failures} critical failures`);
          }
          if (projectConfig.overrides.length > 0) {
            lines.push(`
*Note: ${projectConfig.overrides.length} control overrides applied.*`);
          }
          resultText = lines.join("\n");
          break;
        }
        case "generate_compliance_report": {
          const projectName = args.project_name || "Project";
          const projectType = args.project_type || "saas";
          const frameworksStr = args.frameworks || "GDPR,OWASP";
          const frameworks = frameworksStr.split(",").map((f) => f.trim());
          resultText = generateFullComplianceReport(projectName, projectType, frameworks);
          break;
        }
        case "generate_audit_report": {
          const projectPath = resolveProjectPath(args.project_path);
          if (!args.project_path && !fs2.existsSync(path3.join(projectPath, ".ges"))) {
            const projectName2 = args.project_name || "Project";
            const projectType2 = "generic-web-application";
            resultText = generateFullComplianceReport(projectName2, projectType2, ["GDPR", "OWASP"]);
            resultText += "\n\n**Note: No project path specified and no .ges/ directory found. Showing default compliance report. Provide project_path for actual audit results.**";
            break;
          }
          if (!fs2.existsSync(projectPath)) {
            resultText = `Project path does not exist: ${projectPath}`;
            break;
          }
          const projectName = args.project_name || path3.basename(projectPath);
          const projectConfig = loadProjectConfig(projectPath);
          const config = projectConfig.config;
          const projectType = config?.project_type || "generic-web-application";
          const frameworks = config?.frameworks || ["GDPR", "OWASP"];
          const { findings: rawFindings, scannedFiles } = runAudit(projectPath);
          const findings = deduplicateFindings(rawFindings);
          resultText = generateFullComplianceReport(projectName, projectType, frameworks, findings, projectConfig.overrides);
          resultText += `

**Audit Details**: Scanned ${scannedFiles} files. ${findings.length} findings detected.`;
          break;
        }
        case "fix_recommendation": {
          const controlId = args.control_id || "";
          const findingTitle = args.finding_title;
          if (!controlId && !findingTitle) {
            resultText = "Please provide either a control_id (e.g. 'GDPR-ART32-001') or a finding_title to get fix guidance.";
            break;
          }
          resultText = generateFixGuidance(controlId, findingTitle);
          break;
        }
        case "generate_retention_policy": {
          const name = args.project_name || "Project";
          resultText = `# Data Retention Policy - ${name}

## 1. Purpose

This policy defines the retention periods for all data categories processed by ${name}.

## 2. Retention Periods

| Category | Period | Justification | Legal Basis |
|----------|--------|---------------|-------------|
| User account data | Account lifetime + 30 days | Contract fulfillment | Art. 6(1)(b) |
| Email addresses | Account lifetime + 30 days | Communication | Art. 6(1)(b) |
| Authentication data | Session duration | Security | Art. 6(1)(f) |
| IP addresses | 30 days | Security monitoring | Art. 6(1)(f) |
| Audit logs | 1 year | Legal obligation | Art. 6(1)(c) |
| Session data | Session duration | Operational | Art. 6(1)(b) |
| Marketing consent | Until withdrawal | Consent | Art. 6(1)(a) |
| Support tickets | 2 years | Quality assurance | Art. 6(1)(f) |

## 3. Deletion Process

1. Automated deletion: Data past retention period is flagged for deletion
2. Deletion verification: Monthly audit of deletion jobs
3. Backup purge: Backups containing expired data are purged within 90 days
4. Deletion log: All deletions are logged with timestamp and scope

## 4. Exceptions

- Data subject to legal hold: Retained until hold is lifted
- Data required for ongoing legal proceedings: Retained until proceedings conclude
- Anonymized data may be retained indefinitely for statistical purposes

## 5. Data Subject Rights

- Users can request early deletion via the data subject rights process
- Right to erasure (Article 17) requests are processed within 30 days
- Verification of identity is required before any deletion

## 6. Review Schedule

This policy is reviewed quarterly and updated as needed.

Last reviewed: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        }
        case "generate_incident_response": {
          const name = args.project_name || "Project";
          resultText = `# Incident Response Plan - ${name}

## 1. Severity Levels

| Level | Response Time | Examples |
|-------|--------------|----------|
| P1 (Critical) | 15 minutes | Data breach, system compromise, ransomware |
| P2 (High) | 1 hour | Unauthorized access, vulnerability exploitation |
| P3 (Medium) | 4 hours | Suspicious activity, policy violation |
| P4 (Low) | 24 hours | Minor misconfiguration, informational findings |

## 2. Response Team

| Role | Responsibility |
|------|---------------|
| Incident Commander | Overall coordination and decision making |
| Security Lead | Technical investigation and containment |
| Communications Lead | Internal and external notifications |
| Legal Advisor | Regulatory and legal compliance |
| DPO (if applicable) | GDPR compliance and data subject notification |

## 3. Response Process

### Phase 1: Detection & Identification
- Alert triggered by monitoring, user report, or external notification
- Initial assessment of scope and severity
- Assign severity level (P1-P4)

### Phase 2: Containment
- Isolate affected systems
- Preserve evidence for forensic analysis
- Implement temporary controls

### Phase 3: Eradication
- Identify root cause
- Remove threat from all systems
- Patch vulnerabilities

### Phase 4: Recovery
- Restore systems from verified backups
- Verify system integrity
- Resume normal operations with enhanced monitoring

### Phase 5: Post-Incident Review
- Document timeline and actions taken
- Identify lessons learned
- Update security controls and processes
- Update this plan if needed

## 4. GDPR Breach Notification

**72-hour rule**: If a breach is likely to result in a risk to data subjects:
1. Notify supervisory authority within 72 hours (Article 33)
2. If high risk: Notify affected data subjects without undue delay (Article 34)
3. Document all actions in the breach register

### Notification Template
- Nature of the breach
- Categories and approximate number of data subjects
- Likely consequences
- Measures taken or proposed

## 5. Communication Templates

### Internal Notification
Subject: [P-level] Security Incident - [Brief Description]
- What: [Description]
- When: [Detection time]
- Impact: [Known impact]
- Actions: [Current containment measures]
- Next update: [Time]

### Regulatory Notification
Addressed to: [Supervisory Authority]
- DPO contact: [Name, email, phone]
- Breach description: [Details]
- Affected individuals: [Number and categories]
- Measures taken: [Containment and remediation]

## 6. Testing

- Tabletop exercises: Quarterly
- Full simulation: Annually
- Plan review: After each incident and at least semi-annually

Last reviewed: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        }
        case "generate_risk_assessment": {
          const name = args.project_name || "Project";
          resultText = `# Risk Assessment - ${name}

## 1. Methodology

Risk assessment follows the GESF methodology based on ISO 27005 and NIST SP 800-30.

Risk Score = Likelihood \xD7 Impact

| Rating | Score |
|--------|-------|
| Critical | 5 |
| High | 4 |
| Medium | 3 |
| Low | 2 |
| Negligible | 1 |

## 2. Risk Register

| ID | Risk | Likelihood | Impact | Score | Mitigation | Residual |
|----|------|-----------|--------|-------|------------|----------|
| R001 | Data breach (external) | Medium (3) | Critical (5) | 15 | Encryption, MFA, WAF, pen testing | Medium |
| R002 | Insider threat | Low (2) | High (4) | 8 | RBAC, audit logging, DLP | Low |
| R003 | Data loss | Low (2) | Critical (5) | 10 | Backups, DR plan, replication | Low |
| R004 | Ransomware | Low (2) | Critical (5) | 10 | Backups, EDR, email filtering | Low |
| R005 | Supply chain attack | Medium (3) | High (4) | 12 | Dependency scanning, SBOM, vendor assessment | Medium |
| R006 | Misconfiguration | Medium (3) | High (4) | 12 | IaC scanning, security review, hardening | Medium |
| R007 | Credential compromise | Medium (3) | High (4) | 12 | MFA, password policy, monitoring | Low |
| R008 | DDoS attack | Low (2) | Medium (3) | 6 | CDN, rate limiting, WAF | Low |
| R009 | Non-compliance (GDPR) | Medium (3) | High (4) | 12 | Regular audits, compliance scanning | Low |
| R010 | Third-party data breach | Medium (3) | High (4) | 12 | DPA requirements, vendor assessment | Medium |

## 3. Risk Treatment Plan

| ID | Treatment | Owner | Deadline | Status |
|----|-----------|-------|----------|--------|
| R001 | Implement WAF + annual pen testing | Security Lead | Quarterly | In progress |
| R002 | Deploy DLP solution | Security Lead | Q2 | Planned |
| R003 | Test DR plan monthly | Platform Lead | Monthly | In progress |
| R005 | Automate dependency scanning | DevOps | Q1 | In progress |
| R006 | Implement IaC security scanning | DevOps | Q2 | Planned |
| R007 | Enforce MFA for all users | Security Lead | Q1 | Done |
| R009 | Monthly compliance audits | Compliance Lead | Monthly | In progress |

## 4. Acceptance Criteria

Risks with residual score > 12 require executive sign-off.
All critical risks must have active mitigation plans.

## 5. Review Schedule

- Full assessment: Annually
- Risk register review: Quarterly
- After any significant change or incident

Last reviewed: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`;
          break;
        }
        case "generate_dpa": {
          const name = args.project_name || "Project";
          resultText = `# Data Processing Agreement - ${name}

## 1. Parties

**Controller**: [Company Name]
Address: [Address]
DPO: [Name, Email]

**Processor**: [Service Provider Name]
Address: [Address]
DPO: [Name, Email]

## 2. Subject Matter and Duration

This Agreement governs the processing of personal data by the Processor on behalf of the Controller in connection with the provision of services for **${name}**.

**Duration**: Effective from the date of signature until termination of the underlying service agreement.

## 3. Details of Processing

| Category | Type | Purpose |
|----------|------|--------|
| User data | Personal | Service delivery |
| Authentication data | Personal | Access control |
| Usage data | Operational | Analytics |
| Communication data | Personal | Support |

## 4. Obligations of the Processor

The Processor shall:

1. Process data only on documented instructions from the Controller
2. Ensure confidentiality of all persons authorized to process personal data
3. Implement appropriate technical and organizational measures (Article 32)
4. Not engage sub-processors without prior authorization
5. Assist the Controller in responding to data subject rights requests
6. Assist the Controller in ensuring compliance with Articles 32-36
7. Delete or return all personal data upon termination
8. Make available all information necessary to demonstrate compliance
9. Allow and contribute to audits conducted by the Controller or mandated auditor

## 5. Security Measures (Article 32)

- Encryption of personal data at rest (AES-256-GCM)
- Encryption of personal data in transit (TLS 1.2+)
- Access controls with principle of least privilege
- Regular security testing and vulnerability assessments
- Incident response plan with 72-hour notification
- Audit logging with immutable records
- Regular backup and disaster recovery testing

## 6. Sub-Processors

| Sub-Processor | Purpose | Location |
|-------------|---------|----------|
| [Cloud Provider] | Hosting | [Country] |
| [Email Provider] | Communications | [Country] |

The Controller authorizes the use of the above sub-processors. Any changes will be notified 30 days in advance.

## 7. Data Breach Notification

The Processor shall notify the Controller within 24 hours of becoming aware of a personal data breach, providing:
- Nature of the breach including categories and approximate numbers
- Name and contact details of the DPO
- Likely consequences of the breach
- Measures taken or proposed to address the breach

## 8. Data Subject Rights

The Processor shall assist the Controller in fulfilling its obligations to respond to data subject requests for:
- Access (Article 15)
- Rectification (Article 16)
- Erasure (Article 17)
- Restriction (Article 18)
- Data portability (Article 20)
- Objection (Article 21)

## 9. International Transfers

Any transfer of personal data outside the EEA shall be subject to:
- Adequacy decision by the European Commission, OR
- Standard Contractual Clauses (SCCs), OR
- Binding Corporate Rules (BCRs)

## 10. Termination

Upon termination:
1. Processor shall return all personal data to the Controller within 30 days
2. If return is not possible, Processor shall delete all personal data
3. Processor shall certify deletion in writing

## 11. Liability and Indemnification

Each party's liability shall be governed by the underlying service agreement and applicable GDPR provisions.

## 12. Governing Law

This Agreement shall be governed by [Applicable Jurisdiction].

---

**Signed:**

Controller: _________________________ Date: ____________

Processor: _________________________ Date: ____________`;
          break;
        }
        case "generate_data_inventory": {
          const projectName = args.project_name || "Project";
          const projectType = args.project_type || "saas";
          resultText = generateDataInventory(projectName, projectType);
          break;
        }
        case "generate_processing_records": {
          const projectName = args.project_name || "Project";
          const controllerName = args.controller_name || "[Organization Name]";
          resultText = generateProcessingRecords(projectName, controllerName);
          break;
        }
        case "auto_fix": {
          const projectPath = resolveProjectPath(args.project_path);
          const dryRun = args.dry_run === "true";
          const ruleFilter = args.rule_ids ? new Set(args.rule_ids.split(",").map((r) => r.trim())) : void 0;
          if (!fs2.existsSync(projectPath)) {
            resultText = `Project path does not exist: ${projectPath}`;
            break;
          }
          const { findings: rawFindings, scannedFiles } = runAudit(projectPath);
          const findings = deduplicateFindings(rawFindings);
          if (findings.length === 0) {
            resultText = `# Auto-Fix Report

**Project**: ${projectPath}
**Scanned**: ${scannedFiles} files

No issues found. Project is clean!`;
            break;
          }
          const { actions, warnings } = createAutoFixPlan(projectPath, findings, ruleFilter);
          if (actions.length === 0) {
            const lines2 = [
              `# Auto-Fix Report
`,
              `**Project**: ${projectPath}`,
              `**Scanned**: ${scannedFiles} files`,
              `**Findings**: ${findings.length}
`,
              `## No Auto-Fixable Issues
`,
              `All ${findings.length} findings require manual review:
`
            ];
            for (const w of warnings) lines2.push(`- ${w}`);
            for (const f of findings.slice(0, 10)) {
              lines2.push(`- [${f.severity.toUpperCase()}] ${f.title} (${f.file}${f.line ? `:${f.line}` : ""})`);
            }
            resultText = lines2.join("\n");
            break;
          }
          const npmInstalls = getNpmInstallsFromActions(actions);
          const lines = [
            `# Auto-Fix Report
`,
            `**Project**: ${projectPath}`,
            `**Scanned**: ${scannedFiles} files`,
            `**Findings**: ${findings.length} total`,
            `**Auto-fixable**: ${actions.length} actions`,
            `**Manual review**: ${warnings.length} items`,
            dryRun ? `**Mode**: DRY RUN (no changes applied)
` : ""
          ];
          if (dryRun) {
            lines.push("## Planned Actions (dry run)\n");
          } else {
            lines.push("## Applied Fixes\n");
          }
          let applied = 0;
          let failed = 0;
          for (const action of actions) {
            if (dryRun) {
              lines.push(`- [${action.type}] ${action.filePath}: ${action.description}`);
              applied++;
            } else {
              const result = applyAutoFixAction(projectPath, action);
              if (result.applied) {
                applied++;
                lines.push(`- \u2713 [${action.type}] ${action.filePath}: ${action.description}`);
              } else {
                failed++;
                lines.push(`- \u2717 [${action.type}] ${action.filePath}: ${action.description} \u2014 ${result.error}`);
              }
            }
          }
          lines.push(`
## Summary
`);
          lines.push(`- Actions applied: ${applied}${failed > 0 ? ` (${failed} failed)` : ""}`);
          if (npmInstalls.length > 0) {
            lines.push(`
## npm Packages to Install
`);
            lines.push("```bash");
            lines.push(`npm install ${npmInstalls.join(" ")}`);
            lines.push("```\n");
            lines.push("Or if using pnpm:");
            lines.push("```bash");
            lines.push(`pnpm add ${npmInstalls.join(" ")}`);
            lines.push("```");
          }
          if (warnings.length > 0) {
            lines.push(`
## Manual Review Required
`);
            for (const w of warnings) lines.push(`- ${w}`);
          }
          lines.push(`
## Next Steps`);
          lines.push("1. Install the npm packages listed above");
          lines.push("2. Review all changes with `git diff`");
          lines.push("3. Run `ges audit` to verify fixes");
          lines.push("4. Address remaining manual review items");
          lines.push("5. Use `fix_recommendation` tool for detailed guidance on manual items");
          resultText = lines.join("\n");
          break;
        }
        case "apply_control_override": {
          const projectPath = resolveProjectPath(args.project_path);
          const controlId = args.control_id || "";
          const status = args.status || "not-applicable";
          const reason = args.reason || "";
          if (!controlId) {
            resultText = "Error: control_id is required.";
            break;
          }
          if (!["not-applicable", "pass"].includes(status)) {
            resultText = `Error: status must be 'not-applicable' or 'pass'. Got: ${status}`;
            break;
          }
          if (!fs2.existsSync(path3.join(projectPath, ".ges"))) {
            resultText = `Error: No .ges/ directory at ${projectPath}. Run 'ges init' first.`;
            break;
          }
          const overridePath = path3.join(projectPath, ".ges", "control-overrides.json");
          let overrides = [];
          if (fs2.existsSync(overridePath)) {
            const parsed = readJsonFileSafe(overridePath);
            if (Array.isArray(parsed)) overrides = parsed;
          }
          const existing = overrides.findIndex((o) => o.control_id === controlId);
          if (existing >= 0) {
            overrides[existing] = { control_id: controlId, status, reason };
          } else {
            overrides.push({ control_id: controlId, status, reason });
          }
          const dir = path3.dirname(overridePath);
          if (!fs2.existsSync(dir)) fs2.mkdirSync(dir, { recursive: true });
          fs2.writeFileSync(overridePath, JSON.stringify(overrides, null, 2), "utf-8");
          const lines = [
            `# Control Override Applied
`,
            `**Control**: ${controlId}`,
            `**Status**: ${status}`,
            `**Reason**: ${reason || "(none provided)"}`,
            `**File**: ${overridePath}`,
            `**Total overrides**: ${overrides.length}
`,
            `The override will take effect on the next \`ges audit\` or \`ges score\` run.`,
            `
Run \`ges audit\` then \`ges score\` to see the updated compliance score.`
          ];
          resultText = lines.join("\n");
          break;
        }
        case "implement_control": {
          const projectPath = resolveProjectPath(args.project_path);
          const controlId = args.control_id || "";
          if (!controlId) {
            resultText = "Error: control_id is required. Example: GDPR-ART32-002, GDPR-ART32-006, AUTH-002";
            break;
          }
          if (!fs2.existsSync(projectPath)) {
            resultText = `Error: Project path does not exist: ${projectPath}`;
            break;
          }
          const hasSrc = fs2.existsSync(path3.join(projectPath, "src"));
          const appFile = findMainAppFile(projectPath);
          const lines = [`# Implement Control: ${controlId}
`];
          const actions = [];
          const controlMap = {
            "GDPR-ART32-002": {
              name: "Encryption at Rest",
              actions: buildEncryptionAtRestImpl(projectPath, hasSrc),
              warnings: ["Configure encryption keys via environment variables or a vault service."]
            },
            "GDPR-ART32-003": {
              name: "Encryption in Transit",
              actions: buildEncryptionInTransitImpl(projectPath, hasSrc),
              warnings: ["Ensure your server/infrastructure is configured with TLS certificates."]
            },
            "GDPR-ART32-004": {
              name: "Unique User Identification",
              actions: buildUserIdentificationImpl(projectPath, hasSrc),
              warnings: ["Integrate the auth middleware into your routes."]
            },
            "GDPR-ART32-005": {
              name: "Automatic Session Timeout",
              actions: buildSessionTimeoutFix(projectPath),
              warnings: []
            },
            "GDPR-ART32-006": {
              name: "Audit Logging",
              actions: buildLoggingFix(projectPath),
              warnings: ["Use auditLog() for all security-relevant actions."]
            },
            "GDPR-ART32-007": {
              name: "Integrity Controls",
              actions: buildIntegrityControlsImpl(projectPath, hasSrc),
              warnings: ["Apply integrity hashing to all critical data flows."]
            },
            "GDPR-ART32-008": {
              name: "Backup and Recovery",
              actions: buildBackupPolicyImpl(projectPath, hasSrc),
              warnings: ["Test your backup recovery process monthly."]
            },
            "GDPR-ART32-009": {
              name: "Regular Security Testing",
              actions: buildSecurityTestingImpl(projectPath),
              warnings: ["Schedule regular security scans in CI/CD."]
            }
          };
          const plan = controlMap[controlId];
          if (!plan) {
            resultText = `Control ${controlId} does not have an auto-implementation. Use \`fix_recommendation\` for manual guidance.

Available auto-implementations: ${Object.keys(controlMap).join(", ")}`;
            break;
          }
          lines.push(`**Control**: ${plan.name}
`);
          for (const action of plan.actions) {
            const result = applyAutoFixAction(projectPath, action);
            if (result.applied) {
              lines.push(`- \u2713 [${action.type}] ${action.filePath}: ${action.description}`);
            } else if (result.error === "File already exists") {
              lines.push(`- \u2192 [${action.type}] ${action.filePath}: Already exists (skipped)`);
            } else {
              lines.push(`- \u2717 [${action.type}] ${action.filePath}: ${result.error}`);
            }
          }
          const npmInstalls = getNpmInstallsFromActions(plan.actions);
          if (npmInstalls.length > 0) {
            lines.push(`
## Install Dependencies
`);
            lines.push("```bash");
            lines.push(`npm install ${npmInstalls.join(" ")}`);
            lines.push("```");
          }
          if (plan.warnings.length > 0) {
            lines.push(`
## Notes`);
            for (const w of plan.warnings) lines.push(`- ${w}`);
          }
          lines.push(`
## Next Steps`);
          lines.push("1. Install any npm packages listed above");
          lines.push("2. Import and integrate the generated files into your app");
          lines.push("3. Run `ges audit` to verify the control is now passing");
          lines.push(`4. Or use \`apply_control_override\` with control_id="${controlId}" if verified manually`);
          resultText = lines.join("\n");
          break;
        }
        default:
          return {
            jsonrpc: "2.0",
            id: request.id,
            error: { code: -32601, message: `Unknown tool: ${toolName}` }
          };
      }
    } catch (err) {
      return {
        jsonrpc: "2.0",
        id: request.id,
        result: {
          content: [{
            type: "text",
            text: `Error executing tool '${toolName}': ${err instanceof Error ? err.message : String(err)}. Check your parameters and try again.`
          }]
        }
      };
    }
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        content: [{ type: "text", text: resultText }]
      }
    };
  }
  if (isNotification) {
    return null;
  }
  return {
    jsonrpc: "2.0",
    id: request.id,
    error: { code: -32601, message: `Unknown method: ${request.method}` }
  };
}
var rl = readline.createInterface({ input: process.stdin });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    send({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" }
    });
    return;
  }
  try {
    const response = handleRequest(parsed);
    if (response !== null) {
      send(response);
    }
  } catch (err) {
    send({
      jsonrpc: "2.0",
      id: parsed.id ?? null,
      error: {
        code: -32603,
        message: "Internal error",
        data: err instanceof Error ? err.message : String(err)
      }
    });
  }
});
rl.on("close", () => {
  process.exit(0);
});
export {
  handleRequest
};
