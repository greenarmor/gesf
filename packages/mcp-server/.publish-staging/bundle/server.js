#!/usr/bin/env node

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
function scoreByFramework(controls, frameworks) {
  const result = {};
  for (const fw of frameworks) {
    const fwControls = controls.filter((c) => c.framework === fw);
    const total = fwControls.length;
    const passed = fwControls.filter((c) => c.status === "pass").length;
    const failed = fwControls.filter((c) => c.status === "fail").length;
    const warning = fwControls.filter((c) => c.status === "warning").length;
    const notApplicable = fwControls.filter((c) => c.status === "not-applicable").length;
    const score = total > 0 ? Math.round((passed + notApplicable) / total * 100) : 0;
    result[fw] = {
      framework: fw,
      score,
      total_controls: total,
      passed_controls: passed,
      failed_controls: failed,
      warning_controls: warning,
      not_applicable: notApplicable,
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  return result;
}
function computeOverallScore(frameworkScores) {
  const scores = Object.values(frameworkScores);
  if (scores.length === 0)
    return 0;
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return Math.round(total / scores.length);
}
function generateScoreFile(controls, frameworks) {
  const frameworkScores = scoreByFramework(controls, frameworks);
  const overall = computeOverallScore(frameworkScores);
  return {
    overall,
    frameworks: frameworkScores,
    evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function formatScoreOutput(score) {
  const lines = [];
  lines.push("");
  for (const [fw, data] of Object.entries(score.frameworks)) {
    const padding = Math.max(1, 20 - fw.length);
    const dots = ".".repeat(padding);
    lines.push(`  ${fw} ${dots} ${data.score}%`);
  }
  const overallPadding = Math.max(1, 20 - "Overall".length);
  const overallDots = ".".repeat(overallPadding);
  lines.push(`  Overall ${overallDots} ${score.overall}%`);
  lines.push("");
  return lines.join("\n");
}

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
          version: "0.2.0"
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
