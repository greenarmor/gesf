#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import * as readline from "node:readline";

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
      implementation_guidance: "Run dependency scans (Trivy, Dependabot). Perform secret scanning (Gitleaks). Use SAST (Semgrep). Schedule penetration tests.",
      checks: [
        { id: "GDPR-ART32-009-C1", description: "Dependency scanning in CI/CD", status: "not-implemented" },
        { id: "GDPR-ART32-009-C2", description: "Secret scanning in CI/CD", status: "not-implemented" },
        { id: "GDPR-ART32-009-C3", description: "SAST analysis integrated", status: "not-implemented" },
        { id: "GDPR-ART32-009-C4", description: "Penetration test schedule defined", status: "not-implemented" }
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
      description: "Maintain a software inventory.",
      category: "asset-management",
      framework: "CIS",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Use package managers and lock files. Scan for unauthorized software. Maintain SBOM.",
      checks: [
        { id: "CIS-002-C1", description: "Software inventory (SBOM) maintained", status: "not-implemented" },
        { id: "CIS-002-C2", description: "Dependency scanning implemented", status: "not-implemented" }
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
function getAllPacks() {
  return ALL_PACKS.map((fn) => fn());
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
  const { data, path: path2, errorMaps, issueData } = params;
  const fullPath = [...path2, ...issueData.path || []];
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
  constructor(parent, value, path2, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path2;
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
import * as path from "node:path";
var __filename = url.fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var require2 = createRequire(import.meta.url);
var pkg = require2("../../package.json");
var GESF_VERSION = pkg.version;

// src/server.ts
var TOOLS = [
  {
    name: "check_compliance",
    description: "Check GDPR compliance status for a project",
    inputSchema: {
      type: "object",
      properties: {
        project_type: { type: "string", description: "Project type" }
      }
    }
  },
  {
    name: "list_missing_controls",
    description: "Show missing compliance controls",
    inputSchema: {
      type: "object",
      properties: {
        project_type: {
          type: "string",
          description: "Project type"
        },
        framework: {
          type: "string",
          description: "Framework name (GDPR, OWASP, etc.)"
        }
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
  }
];
function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
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
    switch (toolName) {
      case "check_compliance": {
        const projectType = args.project_type || "saas";
        const packs = getPacksForProjectType(projectType);
        const controls = packs.flatMap((p) => p.controls);
        const score = generateScoreFile(controls, ["GDPR", "OWASP"]);
        resultText = formatScoreOutput(score);
        break;
      }
      case "list_missing_controls": {
        const framework = args.framework || "GDPR";
        const allControls = getAllPacks().flatMap((p) => p.controls);
        const missing = allControls.filter(
          (c) => c.framework === framework && c.status !== "pass"
        );
        resultText = missing.length > 0 ? missing.map(
          (c) => `- [${c.severity.toUpperCase()}] ${c.id}: ${c.name}`
        ).join("\n") : "All controls are passing.";
        break;
      }
      case "generate_retention_policy": {
        const name = args.project_name || "Project";
        resultText = `# Data Retention Policy - ${name}

## Retention Periods

| Category | Period | Justification |
|----------|--------|---------------|
| User data | Account + 30 days | Contract |
| Audit logs | 1 year | Legal obligation |
| Session data | Session duration | Operational |

Review quarterly and update as needed.`;
        break;
      }
      case "generate_incident_response": {
        const name = args.project_name || "Project";
        resultText = `# Incident Response Plan - ${name}

## Severity Levels
- P1 (Critical): 15 min response
- P2 (High): 1 hour response
- P3 (Medium): 4 hour response

## Process
1. Detection \u2192 2. Assessment \u2192 3. Containment \u2192 4. Eradication \u2192 5. Recovery \u2192 6. Post-Incident

## GDPR: Notify supervisory authority within 72 hours.`;
        break;
      }
      case "generate_risk_assessment": {
        const name = args.project_name || "Project";
        resultText = `# Risk Assessment - ${name}

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Data breach | Medium | Critical | Encryption, MFA, access controls |
| Insider threat | Low | High | RBAC, audit logging |
| Data loss | Low | Critical | Backups, DR plan |
| Non-compliance | Medium | High | Regular audits |`;
        break;
      }
      case "generate_dpa": {
        const name = args.project_name || "Project";
        resultText = `# Data Processing Agreement - ${name}

## Parties
- Controller: [Company Name]
- Processor: [Service Provider]

## Subject Matter
Processing of personal data as described in the attached schedule.

## Duration
Effective until termination of services.

## Obligations
- Process data only on documented instructions
- Ensure confidentiality
- Implement appropriate security (Article 32)
- Assist with data subject rights
- Assist with breach notification
- Delete/return data on termination`;
        break;
      }
      default:
        return {
          jsonrpc: "2.0",
          id: request.id,
          error: { code: -32601, message: `Unknown tool: ${toolName}` }
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
